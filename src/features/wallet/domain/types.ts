export type TransactionType = "topup" | "withdrawal" | "resume_purchase";

export type TransactionDirection = "credit" | "debit";

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Positive whole amount in Toman; the direction carries the sign. */
  amount: number;
  /** ISO 8601 timestamp. */
  createdAt: string;
  /** Idempotency key, e.g. the payment intent id. */
  reference: string;
}

export interface WalletSnapshot {
  balance: number;
  transactions: Transaction[];
  /** References already applied, used to reject duplicate submissions. */
  appliedReferences: string[];
  /** Set once the resume has been paid for; later downloads are free. */
  resumeUnlocked: boolean;
}

export type WalletErrorCode =
  | "INVALID_AMOUNT"
  | "AMOUNT_TOO_LOW"
  | "AMOUNT_TOO_HIGH"
  | "INSUFFICIENT_FUNDS"
  | "DUPLICATE_REFERENCE";

export type WalletResult<T> = { ok: true; value: T } | { ok: false; error: WalletErrorCode };

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  reference: string;
  createdAt: string;
  id: string;
}
