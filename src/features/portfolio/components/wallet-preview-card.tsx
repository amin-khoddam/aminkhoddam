"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { RESUME_PRICE } from "@/features/wallet/domain/constants";
import { useWalletHydrated } from "@/features/wallet/hooks/use-wallet-hydration";
import { useWalletBalance, useWalletTransactions } from "@/features/wallet/store/wallet-store";
import { useAmountFormatter } from "@/hooks/use-amount-formatter";
import { Link } from "@/i18n/navigation";

/**
 * Hero visual: a live view of the wallet demo rather than a decorative mockup.
 */
export function WalletPreviewCard() {
  const t = useTranslations("hero.card");
  const tWallet = useTranslations("wallet");
  const tResume = useTranslations("resume");
  const { formatWithCurrency } = useAmountFormatter();
  const hydrated = useWalletHydrated();
  const balance = useWalletBalance();
  const transactionCount = useWalletTransactions().length;

  return (
    <Surface variant="strong" padding="none" className="overflow-hidden">
      <div className="relative border-b border-border/60 bg-linear-to-br from-brand/25 via-brand/10 to-transparent p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground">{t("title")}</p>
            {hydrated ? (
              <p className="tabular-amount mt-2 font-display text-2xl font-bold sm:text-3xl">
                {formatWithCurrency(balance)}
              </p>
            ) : (
              <Skeleton className="mt-2 h-8 w-40" />
            )}
          </div>
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-background/60"
          >
            <Wallet className="size-5 text-brand" />
          </span>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <dl className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
            <dt className="text-muted-foreground">{tWallet("transactions.title")}</dt>
            <dd className="tabular-amount mt-1 text-base font-semibold">
              {hydrated ? transactionCount : "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
            <dt className="text-muted-foreground">{tResume("title")}</dt>
            <dd className="tabular-amount mt-1 text-base font-semibold">
              {formatWithCurrency(RESUME_PRICE)}
            </dd>
          </div>
        </dl>

        <p className="text-xs leading-relaxed text-muted-foreground">{t("hint")}</p>

        <Button asChild size="lg" className="w-full">
          <Link href="/wallet">
            {t("action")}
            <ArrowUpRight data-icon="inline-end" className="rtl:-scale-x-100" />
          </Link>
        </Button>
      </div>
    </Surface>
  );
}
