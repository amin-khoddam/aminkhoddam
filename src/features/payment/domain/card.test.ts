import { describe, expect, it } from "vitest";
import {
  formatPan,
  isExpired,
  isLuhnValid,
  isValidCardNumber,
  maskPan,
  normalizePan,
} from "./card";
import { APPROVED_TEST_CARD, DECLINED_TEST_CARD } from "./constants";

describe("normalizePan", () => {
  it("removes grouping characters and normalizes digits", () => {
    expect(normalizePan("۴۲۴۲ 4242-4242 4242")).toBe("4242424242424242");
  });
});

describe("formatPan", () => {
  it("groups digits in blocks of four", () => {
    expect(formatPan("4242424242424242")).toBe("4242 4242 4242 4242");
  });

  it("truncates beyond the card length", () => {
    expect(formatPan("42424242424242429999")).toBe("4242 4242 4242 4242");
  });
});

describe("maskPan", () => {
  it("keeps only the last four digits", () => {
    expect(maskPan("4242424242424242")).toBe("**** **** **** 4242");
  });

  it("degrades safely for short input", () => {
    expect(maskPan("42")).toBe("****");
  });
});

describe("isLuhnValid", () => {
  it("accepts the standard test cards", () => {
    expect(isLuhnValid(APPROVED_TEST_CARD)).toBe(true);
    expect(isLuhnValid(DECLINED_TEST_CARD)).toBe(true);
  });

  it("rejects a number with a broken checksum", () => {
    expect(isLuhnValid("4242424242424241")).toBe(false);
  });

  it("rejects empty input", () => {
    expect(isLuhnValid("")).toBe(false);
  });
});

describe("isValidCardNumber", () => {
  it("requires the full card length", () => {
    expect(isValidCardNumber("424242424242")).toBe(false);
    expect(isValidCardNumber(APPROVED_TEST_CARD)).toBe(true);
  });
});

describe("isExpired", () => {
  const now = new Date("2026-06-15T00:00:00.000Z");

  it("treats the current month as valid", () => {
    expect(isExpired(6, 26, now)).toBe(false);
  });

  it("treats an earlier month in the same year as expired", () => {
    expect(isExpired(5, 26, now)).toBe(true);
  });

  it("accepts a future year", () => {
    expect(isExpired(1, 27, now)).toBe(false);
  });

  it("rejects an out-of-range month", () => {
    expect(isExpired(13, 27, now)).toBe(true);
    expect(isExpired(0, 27, now)).toBe(true);
  });

  it("rejects values that are not numbers", () => {
    expect(isExpired(Number.NaN, 27, now)).toBe(true);
  });
});
