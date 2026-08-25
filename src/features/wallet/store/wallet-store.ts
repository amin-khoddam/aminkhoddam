"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createId } from "@/lib/id";
import { RESUME_PRICE } from "../domain/constants";
import type { TransactionType, WalletErrorCode, WalletSnapshot } from "../domain/types";
import { applyTransaction, emptyWallet } from "../domain/wallet";

export const WALLET_STORAGE_KEY = "amin-khoddam.wallet";

export type WalletActionResult = { ok: true } | { ok: false; error: WalletErrorCode };

interface WalletActions {
  /** Credits the wallet after a successful gateway authorization. */
  deposit(input: { amount: number; reference: string }): WalletActionResult;
  withdraw(amount: number): WalletActionResult;
  /** Charges once; later calls succeed without deducting again. */
  purchaseResume(): WalletActionResult;
  reset(): void;
}

type WalletStore = WalletSnapshot & WalletActions;

function commit(
  snapshot: WalletSnapshot,
  type: TransactionType,
  amount: number,
  reference: string,
): { result: WalletActionResult; next: WalletSnapshot } {
  const outcome = applyTransaction(snapshot, {
    id: createId(),
    type,
    amount,
    reference,
    createdAt: new Date().toISOString(),
  });

  return outcome.ok
    ? { result: { ok: true }, next: outcome.value }
    : { result: { ok: false, error: outcome.error }, next: snapshot };
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...emptyWallet,

      deposit({ amount, reference }) {
        const { result, next } = commit(snapshotOf(get()), "topup", amount, reference);
        if (result.ok) set(next);
        return result;
      },

      withdraw(amount) {
        const { result, next } = commit(
          snapshotOf(get()),
          "withdrawal",
          amount,
          `withdrawal-${createId()}`,
        );
        if (result.ok) set(next);
        return result;
      },

      purchaseResume() {
        const snapshot = snapshotOf(get());
        if (snapshot.resumeUnlocked) return { ok: true };

        const { result, next } = commit(
          snapshot,
          "resume_purchase",
          RESUME_PRICE,
          `resume-${createId()}`,
        );
        if (result.ok) set(next);
        return result;
      },

      reset() {
        set(emptyWallet);
      },
    }),
    {
      name: WALLET_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => snapshotOf(state),
    },
  ),
);

function snapshotOf(state: WalletSnapshot): WalletSnapshot {
  return {
    balance: state.balance,
    transactions: state.transactions,
    appliedReferences: state.appliedReferences,
    resumeUnlocked: state.resumeUnlocked,
  };
}

/* Atomic selectors keep components from re-rendering on unrelated changes. */
export const useWalletBalance = () => useWalletStore((state) => state.balance);
export const useWalletTransactions = () => useWalletStore((state) => state.transactions);
export const useResumeUnlocked = () => useWalletStore((state) => state.resumeUnlocked);
