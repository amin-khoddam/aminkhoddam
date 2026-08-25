import { describe, expect, it } from "vitest";
import { MAX_TRANSACTION_AMOUNT, MIN_TRANSACTION_AMOUNT, RESUME_PRICE } from "./constants";
import type { TransactionInput, WalletSnapshot } from "./types";
import { applyTransaction, emptyWallet, validateAmountRange } from "./wallet";

function input(overrides: Partial<TransactionInput> = {}): TransactionInput {
  return {
    id: "tx-1",
    type: "topup",
    amount: 100_000,
    reference: "ref-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function fundedWallet(balance: number): WalletSnapshot {
  return { ...emptyWallet, balance };
}

describe("validateAmountRange", () => {
  it("accepts the boundaries", () => {
    expect(validateAmountRange(MIN_TRANSACTION_AMOUNT).ok).toBe(true);
    expect(validateAmountRange(MAX_TRANSACTION_AMOUNT).ok).toBe(true);
  });

  it("rejects amounts below the minimum", () => {
    expect(validateAmountRange(MIN_TRANSACTION_AMOUNT - 1)).toEqual({
      ok: false,
      error: "AMOUNT_TOO_LOW",
    });
  });

  it("rejects amounts above the maximum", () => {
    expect(validateAmountRange(MAX_TRANSACTION_AMOUNT + 1)).toEqual({
      ok: false,
      error: "AMOUNT_TOO_HIGH",
    });
  });

  it("rejects non-integer and non-positive amounts", () => {
    expect(validateAmountRange(50_000.5)).toEqual({ ok: false, error: "INVALID_AMOUNT" });
    expect(validateAmountRange(0)).toEqual({ ok: false, error: "INVALID_AMOUNT" });
    expect(validateAmountRange(-100_000)).toEqual({ ok: false, error: "INVALID_AMOUNT" });
  });
});

describe("applyTransaction", () => {
  it("credits a top-up and records the transaction", () => {
    const result = applyTransaction(emptyWallet, input({ amount: 250_000 }));

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.balance).toBe(250_000);
    expect(result.value.transactions).toHaveLength(1);
    expect(result.value.transactions[0]).toMatchObject({ type: "topup", amount: 250_000 });
    expect(result.value.appliedReferences).toContain("ref-1");
  });

  it("does not mutate the snapshot it receives", () => {
    const snapshot = fundedWallet(100_000);
    applyTransaction(snapshot, input({ amount: 100_000 }));

    expect(snapshot.balance).toBe(100_000);
    expect(snapshot.transactions).toHaveLength(0);
  });

  it("debits a withdrawal", () => {
    const result = applyTransaction(
      fundedWallet(400_000),
      input({ type: "withdrawal", amount: 150_000, reference: "w-1" }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.balance).toBe(250_000);
  });

  it("rejects a withdrawal larger than the balance", () => {
    const result = applyTransaction(
      fundedWallet(60_000),
      input({ type: "withdrawal", amount: 100_000, reference: "w-2" }),
    );

    expect(result).toEqual({ ok: false, error: "INSUFFICIENT_FUNDS" });
  });

  it("rejects a reference that was already applied", () => {
    const first = applyTransaction(emptyWallet, input());
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = applyTransaction(first.value, input({ id: "tx-2" }));
    expect(second).toEqual({ ok: false, error: "DUPLICATE_REFERENCE" });
  });

  it("keeps the resume price outside the user-facing amount range", () => {
    const result = applyTransaction(
      fundedWallet(RESUME_PRICE),
      input({ type: "resume_purchase", amount: RESUME_PRICE, reference: "resume-1" }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.balance).toBe(0);
    expect(result.value.resumeUnlocked).toBe(true);
  });

  it("applies the range check to user-entered amounts", () => {
    expect(applyTransaction(emptyWallet, input({ amount: 10_000 }))).toEqual({
      ok: false,
      error: "AMOUNT_TOO_LOW",
    });
  });

  it("puts the newest transaction first", () => {
    const first = applyTransaction(emptyWallet, input({ reference: "a" }));
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = applyTransaction(
      first.value,
      input({ id: "tx-2", amount: 200_000, reference: "b" }),
    );
    expect(second.ok).toBe(true);
    if (!second.ok) return;

    expect(second.value.transactions.map((item) => item.reference)).toEqual(["b", "a"]);
  });
});
