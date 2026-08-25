import type { AppLocale } from "@/i18n/routing";

const EASTERN_ARABIC_DIGITS = /[۰-۹٠-٩]/g;
const NON_DIGITS = /[^0-9]/g;

const NUMBER_FORMAT_LOCALES: Record<AppLocale, string> = {
  fa: "fa-IR",
  en: "en-US",
};

/** Converts Persian/Arabic-Indic digits to their ASCII equivalents. */
export function normalizeDigits(value: string): string {
  return value.replace(EASTERN_ARABIC_DIGITS, (digit) => {
    const code = digit.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

/**
 * Parses user input into an integer amount of Toman.
 * Returns `null` when the input contains no usable digits, so callers can
 * distinguish "empty" from "zero".
 */
export function parseAmount(input: string): number | null {
  const digits = normalizeDigits(input).replace(NON_DIGITS, "");
  if (digits.length === 0) return null;

  const amount = Number(digits);
  return Number.isSafeInteger(amount) ? amount : null;
}

/** Formats an amount using the locale's numbering system and grouping. */
export function formatAmount(amount: number, locale: AppLocale): string {
  return new Intl.NumberFormat(NUMBER_FORMAT_LOCALES[locale]).format(amount);
}

/** Re-formats raw input as a grouped amount while the user types. */
export function formatAmountInput(input: string, locale: AppLocale): string {
  const amount = parseAmount(input);
  return amount === null ? "" : formatAmount(amount, locale);
}
