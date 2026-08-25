import { NextResponse } from "next/server";
import { authorizePayment } from "@/features/payment/domain/authorization";
import { AUTHORIZE_RATE_LIMIT, GATEWAY_LATENCY_MS } from "@/features/payment/domain/constants";
import { authorizeRequestSchema } from "@/features/payment/domain/schemas";
import type { PaymentErrorCode } from "@/features/payment/types";
import { createId } from "@/lib/id";
import { logger } from "@/lib/logger";
import { clientKeyFromHeaders, consumeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A well-formed request is a few hundred bytes; anything larger is rejected. */
const MAX_BODY_BYTES = 2_048;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function decline(code: PaymentErrorCode, status: number, headers?: HeadersInit) {
  return NextResponse.json(
    { status: "declined", code },
    { status, headers: { ...NO_STORE, ...headers } },
  );
}

/** Maps the first schema failure onto a user-facing decline reason. */
function codeForField(field: PropertyKey | undefined): PaymentErrorCode {
  if (field === "amount") return "INVALID_AMOUNT";
  if (field === "expiryMonth" || field === "expiryYear") return "INVALID_EXPIRY";
  return "INVALID_CARD";
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulated card authorization.
 *
 * Card details are validated in memory and discarded with the request: nothing
 * is persisted, echoed back or logged beyond the masked PAN the caller already
 * knows.
 */
export async function POST(request: Request) {
  const rate = consumeRateLimit(
    `payments:authorize:${clientKeyFromHeaders(request.headers)}`,
    AUTHORIZE_RATE_LIMIT,
  );

  if (!rate.allowed) {
    return decline("RATE_LIMITED", 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  try {
    const raw = await request.text();

    if (raw.length > MAX_BODY_BYTES) {
      return decline("UNKNOWN", 413);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return decline("UNKNOWN", 400);
    }

    const parsed = authorizeRequestSchema.safeParse(payload);
    if (!parsed.success) {
      return decline(codeForField(parsed.error.issues[0]?.path[0]), 400);
    }

    await delay(GATEWAY_LATENCY_MS);

    const result = authorizePayment(parsed.data, {
      now: new Date(),
      reference: `TRX-${createId().replace(/-/g, "").slice(0, 12).toUpperCase()}`,
    });

    if (result.status === "declined") {
      return decline(result.code, 402);
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    // Never surface the stack: the client only needs a generic failure code.
    logger.error("payment_authorization_failed", {
      reason: error instanceof Error ? error.name : "unknown",
    });
    return decline("UNKNOWN", 500);
  }
}
