"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { usePaymentIntentStore } from "@/features/payment/store/payment-intent-store";
import { useAmountFormatter } from "@/hooks/use-amount-formatter";
import { useRouter } from "@/i18n/navigation";
import { MIN_TRANSACTION_AMOUNT, QUICK_TOP_UP_AMOUNTS } from "../domain/constants";
import { useWalletErrorMessage } from "../hooks/use-wallet-error-message";
import { useWalletHydrated } from "../hooks/use-wallet-hydration";
import { useWalletBalance, useWalletStore } from "../store/wallet-store";
import { AmountSheet } from "./amount-sheet";

type OpenSheet = "topup" | "withdraw" | null;

export function WalletOverview() {
  const t = useTranslations("wallet");
  const { format, formatWithCurrency, currency } = useAmountFormatter();
  const router = useRouter();

  const hydrated = useWalletHydrated();
  const balance = useWalletBalance();
  const withdraw = useWalletStore((state) => state.withdraw);
  const createIntent = usePaymentIntentStore((state) => state.createIntent);
  const describeError = useWalletErrorMessage();

  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);

  function handleTopUp(amount: number) {
    createIntent(amount);
    setOpenSheet(null);
    router.push("/wallet/payment");
  }

  function handleWithdraw(amount: number) {
    const result = withdraw(amount);

    if (!result.ok) {
      toast.error(describeError(result.error, balance));
      return;
    }

    setOpenSheet(null);
    toast.success(t("withdrawSheet.success", { amount: format(amount), currency }));
  }

  return (
    <>
      <Surface variant="strong" padding="lg" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-brand/20 to-transparent"
        />

        <div className="relative">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {t("balanceLabel")}
          </p>

          {hydrated ? (
            <p className="tabular-amount mt-2 font-display text-3xl font-bold sm:text-4xl">
              {formatWithCurrency(balance)}
            </p>
          ) : (
            <Skeleton className="mt-2 h-10 w-56" />
          )}

          {hydrated ? (
            <p className="tabular-amount mt-2 text-xs text-muted-foreground">
              {t("availableToWithdraw", { amount: format(balance), currency })}
            </p>
          ) : (
            <Skeleton className="mt-2 h-4 w-40" />
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button size="xl" className="w-full sm:w-auto" onClick={() => setOpenSheet("topup")}>
              <ArrowUpRight data-icon="inline-start" className="rtl:-scale-x-100" />
              {t("addBalance")}
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setOpenSheet("withdraw")}
              disabled={!hydrated}
            >
              <ArrowDownLeft data-icon="inline-start" className="rtl:-scale-x-100" />
              {t("withdraw")}
            </Button>
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {t("demoNotice")}
          </p>
        </div>
      </Surface>

      <AmountSheet
        open={openSheet === "topup"}
        onOpenChange={(open) => setOpenSheet(open ? "topup" : null)}
        title={t("topUp.title")}
        description={t("topUp.description")}
        submitLabel={t("topUp.submit")}
        quickAmounts={QUICK_TOP_UP_AMOUNTS}
        onSubmit={handleTopUp}
      />

      <AmountSheet
        open={openSheet === "withdraw"}
        onOpenChange={(open) => setOpenSheet(open ? "withdraw" : null)}
        title={t("withdrawSheet.title")}
        description={t("withdrawSheet.description")}
        submitLabel={t("withdrawSheet.submit")}
        availableBalance={balance}
        hint={
          balance >= MIN_TRANSACTION_AMOUNT
            ? t("withdrawSheet.maxHint", { amount: format(balance), currency })
            : undefined
        }
        onSubmit={handleWithdraw}
      />
    </>
  );
}
