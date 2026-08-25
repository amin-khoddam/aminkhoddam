"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { authorizationResultSchema } from "../domain/schemas";
import type { AuthorizationResult } from "../types";

export interface AuthorizePaymentInput {
  intentId: string;
  amount: number;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/**
 * Network failures are folded into a declined result so the gateway UI has a
 * single result shape to render, with a code the message catalog can translate.
 */
function toDeclined(error: unknown): AuthorizationResult {
  const parsed = authorizationResultSchema.safeParse(
    typeof error === "object" && error !== null && "response" in error
      ? (error as { response?: { data?: unknown } }).response?.data
      : undefined,
  );

  if (parsed.success) return parsed.data;
  return { status: "declined", code: "NETWORK" };
}

export function useAuthorizePayment() {
  return useMutation<AuthorizationResult, Error, AuthorizePaymentInput>({
    mutationFn: async (input) => {
      try {
        const response = await apiClient.post("/payments/authorize", input);
        const parsed = authorizationResultSchema.safeParse(response.data);
        return parsed.success ? parsed.data : { status: "declined", code: "UNKNOWN" };
      } catch (error) {
        return toDeclined(error);
      }
    },
  });
}
