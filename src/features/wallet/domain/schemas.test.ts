import { describe, expect, it } from "vitest";
import { createAmountSchema } from "./schemas";

const messages = {
  invalid: "invalid",
  tooLow: "too-low",
  tooHigh: "too-high",
  insufficient: "insufficient",
};

function firstError(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.success ? null : (result.error?.issues[0]?.message ?? null);
}

describe("createAmountSchema", () => {
  const schema = createAmountSchema({ messages });

  it("accepts a grouped amount inside the range", () => {
    expect(schema.safeParse({ amount: "500,000" }).success).toBe(true);
  });

  it("accepts Persian digits", () => {
    expect(schema.safeParse({ amount: "۵۰۰٬۰۰۰" }).success).toBe(true);
  });

  it("reports an empty field as invalid", () => {
    expect(firstError(schema.safeParse({ amount: "" }))).toBe("invalid");
  });

  it("reports amounts under the minimum", () => {
    expect(firstError(schema.safeParse({ amount: "1,000" }))).toBe("too-low");
  });

  it("reports amounts over the maximum", () => {
    expect(firstError(schema.safeParse({ amount: "20,000,000" }))).toBe("too-high");
  });

  it("reports insufficient funds when a balance cap is supplied", () => {
    const withdrawSchema = createAmountSchema({ messages, availableBalance: 100_000 });

    expect(firstError(withdrawSchema.safeParse({ amount: "200,000" }))).toBe("insufficient");
    expect(withdrawSchema.safeParse({ amount: "100,000" }).success).toBe(true);
  });

  it("prefers the range message over the balance message", () => {
    const withdrawSchema = createAmountSchema({ messages, availableBalance: 100_000 });

    expect(firstError(withdrawSchema.safeParse({ amount: "1,000" }))).toBe("too-low");
  });
});
