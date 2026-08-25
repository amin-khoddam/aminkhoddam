"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { formatAmount } from "@/lib/money";

/**
 * Formats Toman amounts in the active locale's numbering system and pairs them
 * with the localized currency label.
 */
export function useAmountFormatter() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("common");
  const currency = t("currency");

  return useMemo(
    () => ({
      currency,
      format: (amount: number) => formatAmount(amount, locale),
      formatWithCurrency: (amount: number) => `${formatAmount(amount, locale)} ${currency}`,
    }),
    [locale, currency],
  );
}
