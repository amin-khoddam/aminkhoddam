"use client";

import { useSyncExternalStore } from "react";
import { useWalletStore } from "../store/wallet-store";

const subscribe = (onStoreChange: () => void) =>
  useWalletStore.persist.onFinishHydration(onStoreChange);

const getSnapshot = () => useWalletStore.persist.hasHydrated();

const getServerSnapshot = () => false;

/**
 * Wallet data only exists in local storage, so the first client render must
 * match the server output. Components use this flag to show a skeleton until
 * the persisted state has been read.
 */
export function useWalletHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
