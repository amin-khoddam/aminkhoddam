import { describe, expect, it } from "vitest";
import { formatAmount, formatAmountInput, normalizeDigits, parseAmount } from "./money";

describe("normalizeDigits", () => {
  it("converts Persian and Arabic-Indic digits to ASCII", () => {
    expect(normalizeDigits("۱۲۳۴۵۶۷۸۹۰")).toBe("1234567890");
    expect(normalizeDigits("٥٠٠")).toBe("500");
  });

  it("leaves ASCII digits and other characters untouched", () => {
    expect(normalizeDigits("500,000 x")).toBe("500,000 x");
  });
});

describe("parseAmount", () => {
  it("strips grouping characters", () => {
    expect(parseAmount("500,000")).toBe(500_000);
    expect(parseAmount("۵۰۰٬۰۰۰")).toBe(500_000);
  });

  it("returns null when there is no digit to read", () => {
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("   ")).toBeNull();
    expect(parseAmount("abc")).toBeNull();
  });

  it("rejects values beyond the safe integer range", () => {
    expect(parseAmount("9".repeat(20))).toBeNull();
  });
});

describe("formatAmount", () => {
  it("groups thousands for English", () => {
    expect(formatAmount(1_250_000, "en")).toBe("1,250,000");
  });

  it("round-trips through the Persian numbering system", () => {
    expect(parseAmount(formatAmount(1_250_000, "fa"))).toBe(1_250_000);
  });
});

describe("formatAmountInput", () => {
  it("reformats partial input while typing", () => {
    expect(formatAmountInput("50000", "en")).toBe("50,000");
  });

  it("returns an empty string for input without digits", () => {
    expect(formatAmountInput("", "en")).toBe("");
  });
});
