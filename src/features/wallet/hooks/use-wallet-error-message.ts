"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAmountFormatter } from "@/hooks/use-amount-formatter";
import { MAX_TRANSACTION_AMOUNT, MIN_TRANSACTION_AMOUNT } from "../domain/constants";
import type { WalletErrorCode } from "../domain/types";

/** Turns a domain error code into a localized, value-aware message. */
export function useWalletErrorMessage() {
  const t = useTranslations("wallet.errors");
  const { format, currency } = useAmountFormatter();

  return useCallback(
    (code: WalletErrorCode, availableBalance = 0) =>
      t(code, {
        min: format(MIN_TRANSACTION_AMOUNT),
        max: format(MAX_TRANSACTION_AMOUNT),
        amount: format(availableBalance),
        currency,
      }),
    [t, format, currency],
  );
}
