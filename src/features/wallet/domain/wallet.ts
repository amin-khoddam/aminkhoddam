import {
  MAX_STORED_REFERENCES,
  MAX_STORED_TRANSACTIONS,
  MAX_TRANSACTION_AMOUNT,
  MIN_TRANSACTION_AMOUNT,
} from "./constants";
import type {
  Transaction,
  TransactionDirection,
  TransactionInput,
  TransactionType,
  WalletResult,
  WalletSnapshot,
} from "./types";

export const emptyWallet: WalletSnapshot = {
  balance: 0,
  transactions: [],
  appliedReferences: [],
  resumeUnlocked: false,
};

const DIRECTIONS: Record<TransactionType, TransactionDirection> = {
  topup: "credit",
  withdrawal: "debit",
  resume_purchase: "debit",
};

/** Transaction types the user enters an amount for, hence range-checked. */
const RANGE_CHECKED_TYPES: ReadonlySet<TransactionType> = new Set<TransactionType>([
  "topup",
  "withdrawal",
]);

export function transactionDirection(type: TransactionType): TransactionDirection {
  return DIRECTIONS[type];
}

export function isValidAmount(amount: number): boolean {
  return Number.isSafeInteger(amount) && amount > 0;
}

/** Validates an amount the user typed against the wallet limits. */
export function validateAmountRange(amount: number): WalletResult<number> {
  if (!isValidAmount(amount)) return { ok: false, error: "INVALID_AMOUNT" };
  if (amount < MIN_TRANSACTION_AMOUNT) return { ok: false, error: "AMOUNT_TOO_LOW" };
  if (amount > MAX_TRANSACTION_AMOUNT) return { ok: false, error: "AMOUNT_TOO_HIGH" };
  return { ok: true, value: amount };
}

function bounded<T>(items: T[], limit: number): T[] {
  return items.length > limit ? items.slice(0, limit) : items;
}

/**
 * Applies a transaction to a wallet snapshot.
 *
 * Pure by design: it never touches storage or React state, which keeps the
 * balance arithmetic testable and makes swapping local storage for a backend a
 * change of caller rather than a rewrite of the rules.
 */
export function applyTransaction(
  snapshot: WalletSnapshot,
  input: TransactionInput,
): WalletResult<WalletSnapshot> {
  if (!isValidAmount(input.amount)) return { ok: false, error: "INVALID_AMOUNT" };

  if (RANGE_CHECKED_TYPES.has(input.type)) {
    const range = validateAmountRange(input.amount);
    if (!range.ok) return range;
  }

  if (snapshot.appliedReferences.includes(input.reference)) {
    return { ok: false, error: "DUPLICATE_REFERENCE" };
  }

  const direction = transactionDirection(input.type);
  if (direction === "debit" && input.amount > snapshot.balance) {
    return { ok: false, error: "INSUFFICIENT_FUNDS" };
  }

  const transaction: Transaction = {
    id: input.id,
    type: input.type,
    amount: input.amount,
    createdAt: input.createdAt,
    reference: input.reference,
  };

  return {
    ok: true,
    value: {
      balance:
        direction === "credit" ? snapshot.balance + input.amount : snapshot.balance - input.amount,
      transactions: bounded([transaction, ...snapshot.transactions], MAX_STORED_TRANSACTIONS),
      appliedReferences: bounded(
        [input.reference, ...snapshot.appliedReferences],
        MAX_STORED_REFERENCES,
      ),
      resumeUnlocked: snapshot.resumeUnlocked || input.type === "resume_purchase",
    },
  };
}
