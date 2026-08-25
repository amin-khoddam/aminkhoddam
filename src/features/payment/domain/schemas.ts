import { z } from "zod";
import { isExpired, isValidCardNumber, normalizePan } from "./card";
import { CARD_NUMBER_LENGTH } from "./constants";
import { paymentErrorCodes } from "../types";

export interface CardSchemaMessages {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  expired: string;
  cvv: string;
}

export type CardFormValues = {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
};

/** Client-side card form rules. The server re-validates the same constraints. */
export function createCardSchema(messages: CardSchemaMessages, now: Date) {
  return z
    .object({
      cardNumber: z.string().refine(isValidCardNumber, messages.cardNumber),
      expiryMonth: z
        .string()
        .refine((value) => /^\d{1,2}$/.test(value.trim()), messages.expiryMonth)
        .refine((value) => {
          const month = Number(value);
          return month >= 1 && month <= 12;
        }, messages.expiryMonth),
      expiryYear: z.string().refine((value) => /^\d{2}$/.test(value.trim()), messages.expiryYear),
      cvv: z.string().refine((value) => /^\d{3,4}$/.test(value.trim()), messages.cvv),
    })
    .superRefine((values, ctx) => {
      if (isExpired(Number(values.expiryMonth), Number(values.expiryYear), now)) {
        ctx.addIssue({ code: "custom", path: ["expiryMonth"], message: messages.expired });
      }
    });
}

/** Request body accepted by `POST /api/payments/authorize`. */
export const authorizeRequestSchema = z.object({
  intentId: z.string().min(1).max(64),
  amount: z.number().int().positive(),
  cardNumber: z
    .string()
    .max(32)
    .transform(normalizePan)
    .refine((value) => value.length === CARD_NUMBER_LENGTH),
  expiryMonth: z.string().regex(/^\d{1,2}$/),
  expiryYear: z.string().regex(/^\d{2}$/),
  cvv: z.string().regex(/^\d{3,4}$/),
});

export type AuthorizeRequestBody = z.infer<typeof authorizeRequestSchema>;

/** Runtime guard for the gateway response so the client never trusts the wire. */
export const authorizationResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("approved"),
    reference: z.string().min(1),
    maskedPan: z.string().min(1),
    amount: z.number().int().positive(),
  }),
  z.object({
    status: z.literal("declined"),
    code: z.enum(paymentErrorCodes),
  }),
]);
