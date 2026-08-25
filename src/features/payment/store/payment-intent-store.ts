"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createId } from "@/lib/id";
import type { PaymentIntent } from "../types";

export const PAYMENT_INTENT_STORAGE_KEY = "amin-khoddam.payment-intent";

interface PaymentIntentStore {
  intent: PaymentIntent | null;
  createIntent(amount: number): PaymentIntent;
  clearIntent(): void;
}

/**
 * The intent is the hand-off between the top-up sheet and the gateway page.
 * Session storage keeps it across a refresh of the gateway page but drops it
 * when the tab closes, and its id doubles as the wallet idempotency key.
 */
export const usePaymentIntentStore = create<PaymentIntentStore>()(
  persist(
    (set) => ({
      intent: null,

      createIntent(amount) {
        const intent: PaymentIntent = {
          id: createId(),
          amount,
          createdAt: new Date().toISOString(),
        };
        set({ intent });
        return intent;
      },

      clearIntent() {
        set({ intent: null });
      },
    }),
    {
      name: PAYMENT_INTENT_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const subscribe = (onStoreChange: () => void) =>
  usePaymentIntentStore.persist.onFinishHydration(onStoreChange);

const getSnapshot = () => usePaymentIntentStore.persist.hasHydrated();

const getServerSnapshot = () => false;

export function usePaymentIntentHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
