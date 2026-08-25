import { describe, expect, it } from "vitest";
import { MAX_TRANSACTION_AMOUNT, MIN_TRANSACTION_AMOUNT } from "@/features/wallet/domain/constants";
import type { AuthorizationRequest } from "../types";
import { authorizePayment } from "./authorization";
import { APPROVED_TEST_CARD, DECLINED_TEST_CARD } from "./constants";

const context = { now: new Date("2026-06-15T00:00:00.000Z"), reference: "TRX-TEST" };

function request(overrides: Partial<AuthorizationRequest> = {}): AuthorizationRequest {
  return {
    amount: 500_000,
    cardNumber: APPROVED_TEST_CARD,
    expiryMonth: "12",
    expiryYear: "28",
    ...overrides,
  };
}

describe("authorizePayment", () => {
  it("approves a valid card and returns a masked pan", () => {
    const result = authorizePayment(request(), context);

    expect(result).toEqual({
      status: "approved",
      reference: "TRX-TEST",
      maskedPan: "**** **** **** 4242",
      amount: 500_000,
    });
  });

  it("declines the dedicated declined test card", () => {
    expect(authorizePayment(request({ cardNumber: DECLINED_TEST_CARD }), context)).toEqual({
      status: "declined",
      code: "CARD_DECLINED",
    });
  });

  it("declines an invalid card number", () => {
    expect(authorizePayment(request({ cardNumber: "4242424242424241" }), context)).toEqual({
      status: "declined",
      code: "INVALID_CARD",
    });
  });

  it("declines an expired card", () => {
    expect(authorizePayment(request({ expiryMonth: "01", expiryYear: "25" }), context)).toEqual({
      status: "declined",
      code: "INVALID_EXPIRY",
    });
  });

  it("declines amounts outside the wallet range", () => {
    expect(authorizePayment(request({ amount: MIN_TRANSACTION_AMOUNT - 1 }), context)).toEqual({
      status: "declined",
      code: "INVALID_AMOUNT",
    });

    expect(authorizePayment(request({ amount: MAX_TRANSACTION_AMOUNT + 1 }), context)).toEqual({
      status: "declined",
      code: "INVALID_AMOUNT",
    });
  });

  it("declines a non-integer amount", () => {
    expect(authorizePayment(request({ amount: 500_000.5 }), context)).toEqual({
      status: "declined",
      code: "INVALID_AMOUNT",
    });
  });

  it("never echoes the card number back", () => {
    const result = authorizePayment(request(), context);
    expect(JSON.stringify(result)).not.toContain(APPROVED_TEST_CARD);
  });
});
