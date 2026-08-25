"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CircleCheck, Loader2, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { useWalletStore } from "@/features/wallet/store/wallet-store";
import { useAmountFormatter } from "@/hooks/use-amount-formatter";
import { Link, useRouter } from "@/i18n/navigation";
import type { CardFormValues } from "../domain/schemas";
import { useAuthorizePayment } from "../hooks/use-authorize-payment";
import { usePaymentIntentHydrated, usePaymentIntentStore } from "../store/payment-intent-store";
import type { PaymentErrorCode } from "../types";
import { CardForm } from "./card-form";

interface Receipt {
  reference: string;
  amount: number;
  maskedPan: string;
}

/**
 * Simulated bank gateway.
 *
 * The wallet is credited exactly once per payment intent: the intent id is the
 * idempotency key, so a repeated authorization cannot double-credit.
 */
export function PaymentGateway() {
  const t = useTranslations("payment");
  const { formatWithCurrency, format, currency } = useAmountFormatter();
  const router = useRouter();

  const hydrated = usePaymentIntentHydrated();
  const intent = usePaymentIntentStore((state) => state.intent);
  const clearIntent = usePaymentIntentStore((state) => state.clearIntent);
  const deposit = useWalletStore((state) => state.deposit);

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [failureCode, setFailureCode] = useState<PaymentErrorCode | null>(null);
  const authorize = useAuthorizePayment();

  function handleSubmit(values: CardFormValues) {
    if (!intent) return;
    setFailureCode(null);

    authorize.mutate(
      { intentId: intent.id, amount: intent.amount, ...values },
      {
        onSuccess: (result) => {
          if (result.status === "declined") {
            setFailureCode(result.code);
            return;
          }

          const credited = deposit({ amount: intent.amount, reference: intent.id });

          // A duplicate reference means this intent was already credited, which
          // is still a success from the payer's point of view.
          if (!credited.ok && credited.error !== "DUPLICATE_REFERENCE") {
            setFailureCode("UNKNOWN");
            return;
          }

          setReceipt({
            reference: result.reference,
            amount: result.amount,
            maskedPan: result.maskedPan,
          });
          clearIntent();
        },
      },
    );
  }

  function handleCancel() {
    clearIntent();
    router.push("/wallet");
  }

  if (!hydrated) {
    return (
      <Surface variant="strong" padding="lg" className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Surface>
    );
  }

  if (receipt) {
    return (
      <Surface variant="strong" padding="lg" className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-success/30 bg-success/10">
          <CircleCheck className="size-7 text-success" aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold">{t("successTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("successDescription", { amount: format(receipt.amount), currency })}
        </p>

        <dl className="mt-5 space-y-2 rounded-xl border border-border/70 bg-muted/40 p-4 text-start text-xs">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{t("referenceLabel")}</dt>
            <dd className="font-mono" dir="ltr">
              {receipt.reference}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{t("cardNumberLabel")}</dt>
            <dd className="font-mono" dir="ltr">
              {receipt.maskedPan}
            </dd>
          </div>
        </dl>

        <Button asChild size="xl" className="mt-6 w-full">
          <Link href="/wallet">{t("backToWallet")}</Link>
        </Button>
      </Surface>
    );
  }

  if (!intent) {
    return (
      <Surface variant="strong" padding="lg" className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-border/70 bg-muted/40">
          <TriangleAlert className="size-6 text-muted-foreground" aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold">{t("noIntentTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("noIntentDescription")}</p>
        <Button asChild size="xl" className="mt-6 w-full">
          <Link href="/wallet">{t("backToWallet")}</Link>
        </Button>
      </Surface>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="glass-panel">
        <ShieldCheck />
        <AlertTitle>{t("demoBanner")}</AlertTitle>
      </Alert>

      <Surface variant="strong" padding="none" className="overflow-hidden">
        <header className="border-b border-border/70 bg-linear-to-br from-brand/15 to-transparent p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{t("merchant")}</p>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden />
              {t("title")}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">{t("amountLabel")}</p>
            <p className="tabular-amount mt-1 font-display text-2xl font-bold sm:text-3xl">
              {formatWithCurrency(intent.amount)}
            </p>
          </div>
        </header>

        <div className="p-5 sm:p-6">
          {authorize.isPending ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Loader2 className="size-7 animate-spin text-brand" aria-hidden />
              <p className="text-sm font-medium">{t("processingTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("processingDescription")}</p>
            </div>
          ) : (
            <>
              {failureCode ? (
                <Alert variant="destructive" className="mb-4">
                  <TriangleAlert />
                  <AlertTitle>{t("failureTitle")}</AlertTitle>
                  <AlertDescription>{t(`errors.${failureCode}`)}</AlertDescription>
                </Alert>
              ) : null}

              <CardForm
                pending={authorize.isPending}
                submitLabel={t("submit", { amount: format(intent.amount), currency })}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </>
          )}
        </div>
      </Surface>
    </div>
  );
}
