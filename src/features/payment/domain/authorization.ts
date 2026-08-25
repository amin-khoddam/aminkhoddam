import { MAX_TRANSACTION_AMOUNT, MIN_TRANSACTION_AMOUNT } from "@/features/wallet/domain/constants";
import { isExpired, isValidCardNumber, maskPan, normalizePan } from "./card";
import { DECLINED_TEST_CARD } from "./constants";
import type { AuthorizationRequest, AuthorizationResult } from "../types";

/**
 * Decides the outcome of a simulated authorization.
 *
 * Pure and deterministic: the same request always produces the same result,
 * which keeps the flow testable and makes the demo predictable. Card data is
 * only inspected here and never returned, stored or logged.
 */
export function authorizePayment(
  request: AuthorizationRequest,
  context: { now: Date; reference: string },
): AuthorizationResult {
  const { amount, cardNumber, expiryMonth, expiryYear } = request;

  if (
    !Number.isSafeInteger(amount) ||
    amount < MIN_TRANSACTION_AMOUNT ||
    amount > MAX_TRANSACTION_AMOUNT
  ) {
    return { status: "declined", code: "INVALID_AMOUNT" };
  }

  if (!isValidCardNumber(cardNumber)) {
    return { status: "declined", code: "INVALID_CARD" };
  }

  if (isExpired(Number(expiryMonth), Number(expiryYear), context.now)) {
    return { status: "declined", code: "INVALID_EXPIRY" };
  }

  if (normalizePan(cardNumber) === DECLINED_TEST_CARD) {
    return { status: "declined", code: "CARD_DECLINED" };
  }

  return {
    status: "approved",
    reference: context.reference,
    maskedPan: maskPan(cardNumber),
    amount,
  };
}
