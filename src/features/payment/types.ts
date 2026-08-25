/** Contract shared by the payment route handler and its client. */

export const paymentErrorCodes = [
  "CARD_DECLINED",
  "INVALID_CARD",
  "INVALID_EXPIRY",
  "INVALID_AMOUNT",
  "RATE_LIMITED",
  "NETWORK",
  "UNKNOWN",
] as const;

export type PaymentErrorCode = (typeof paymentErrorCodes)[number];

export interface AuthorizationRequest {
  amount: number;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface AuthorizationApproved {
  status: "approved";
  reference: string;
  maskedPan: string;
  amount: number;
}

export interface AuthorizationDeclined {
  status: "declined";
  code: PaymentErrorCode;
}

export type AuthorizationResult = AuthorizationApproved | AuthorizationDeclined;

/** A top-up the user has started but not yet paid for. */
export interface PaymentIntent {
  id: string;
  amount: number;
  createdAt: string;
}
