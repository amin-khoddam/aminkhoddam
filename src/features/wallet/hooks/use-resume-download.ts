"use client";

import { useCallback, useRef, useState } from "react";
import { profile } from "@/config/profile";
import { triggerDownload } from "@/lib/download";
import { RESUME_PRICE } from "../domain/constants";
import type { WalletErrorCode } from "../domain/types";
import { useResumeUnlocked, useWalletBalance, useWalletStore } from "../store/wallet-store";

export type ResumeDownloadStatus = "idle" | "processing" | "completed";

/**
 * `charged` distinguishes the first paid download from a later free one, so the
 * caller can show the right confirmation. `undefined` means the request did not
 * run — either a click arrived while one was in flight, or the wallet rejected
 * it and `error` now holds the reason.
 */
export type ResumeConfirmResult = { charged: boolean } | undefined;

/**
 * Owns the "pay once, then download" rule for the resume.
 *
 * Two guards prevent an accidental double charge: the store refuses to charge
 * again once the resume is unlocked, and an in-flight ref rejects repeat clicks
 * before React has re-rendered.
 */
export function useResumeDownload() {
  const balance = useWalletBalance();
  const unlocked = useResumeUnlocked();
  const purchaseResume = useWalletStore((state) => state.purchaseResume);

  const [status, setStatus] = useState<ResumeDownloadStatus>("idle");
  const [error, setError] = useState<WalletErrorCode | null>(null);
  const inFlight = useRef(false);

  const download = useCallback(() => {
    triggerDownload(profile.resumePath, profile.resumeFileName);
  }, []);

  const confirm = useCallback((): ResumeConfirmResult => {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("processing");
    setError(null);

    const wasUnlocked = unlocked;
    const result = purchaseResume();

    if (!result.ok) {
      setError(result.error);
      setStatus("idle");
      inFlight.current = false;
      return;
    }

    download();
    setStatus("completed");
    inFlight.current = false;
    return { charged: !wasUnlocked };
  }, [download, purchaseResume, unlocked]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return {
    balance,
    price: RESUME_PRICE,
    unlocked,
    hasSufficientBalance: unlocked || balance >= RESUME_PRICE,
    status,
    error,
    confirm,
    reset,
  };
}
