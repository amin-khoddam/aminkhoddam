"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during server render and hydration, `true` afterwards.
 *
 * Used by components whose output depends on browser-only state so the first
 * client render still matches the server HTML.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
