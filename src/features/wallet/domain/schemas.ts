import { z } from "zod";
import { parseAmount } from "@/lib/money";
import { MAX_TRANSACTION_AMOUNT, MIN_TRANSACTION_AMOUNT } from "./constants";

export interface AmountSchemaMessages {
  invalid: string;
  tooLow: string;
  tooHigh: string;
  insufficient: string;
}

export interface AmountSchemaOptions {
  messages: AmountSchemaMessages;
  /** When provided, the amount may not exceed the available balance. */
  availableBalance?: number;
}

export type AmountFormValues = { amount: string };

/**
 * One schema powers both the top-up and the withdrawal sheet; the withdrawal
 * variant just passes the current balance so the same rules stay in one place.
 * Messages are injected so validation text comes from the active locale.
 */
export function createAmountSchema({ messages, availableBalance }: AmountSchemaOptions) {
  return z.object({
    amount: z.string().superRefine((rawValue, ctx) => {
      const amount = parseAmount(rawValue);

      if (amount === null || amount <= 0) {
        ctx.addIssue({ code: "custom", message: messages.invalid });
        return;
      }

      if (amount < MIN_TRANSACTION_AMOUNT) {
        ctx.addIssue({ code: "custom", message: messages.tooLow });
        return;
      }

      if (amount > MAX_TRANSACTION_AMOUNT) {
        ctx.addIssue({ code: "custom", message: messages.tooHigh });
        return;
      }

      if (availableBalance !== undefined && amount > availableBalance) {
        ctx.addIssue({ code: "custom", message: messages.insufficient });
      }
    }),
  });
}
