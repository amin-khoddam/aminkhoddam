import { normalizeDigits } from "@/lib/money";
import { CARD_NUMBER_LENGTH } from "./constants";

/** Strips grouping characters and converts Persian digits to ASCII. */
export function normalizePan(value: string): string {
  return normalizeDigits(value).replace(/[^0-9]/g, "");
}

/** Groups a PAN into blocks of four for display. */
export function formatPan(value: string): string {
  return normalizePan(value)
    .slice(0, CARD_NUMBER_LENGTH)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

/** Keeps only the last four digits; used for receipts and logs. */
export function maskPan(value: string): string {
  const digits = normalizePan(value);
  if (digits.length < 4) return "****";
  return `**** **** **** ${digits.slice(-4)}`;
}

/** Standard Luhn checksum. */
export function isLuhnValid(value: string): boolean {
  const digits = normalizePan(value);
  if (digits.length === 0) return false;

  let sum = 0;
  let double = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = digits.charCodeAt(index) - 48;

    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

export function isValidCardNumber(value: string): boolean {
  return normalizePan(value).length === CARD_NUMBER_LENGTH && isLuhnValid(value);
}

/**
 * Cards stay valid through the last day of their expiry month.
 * `year` accepts the two-digit form used on the card face.
 */
export function isExpired(month: number, year: number, now: Date): boolean {
  if (!Number.isInteger(month) || month < 1 || month > 12) return true;
  if (!Number.isInteger(year) || year < 0) return true;

  const fullYear = year < 100 ? 2000 + year : year;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (fullYear < currentYear) return true;
  if (fullYear > currentYear) return false;
  return month < currentMonth;
}
