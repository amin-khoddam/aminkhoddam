"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, FileText, Receipt, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { useAmountFormatter } from "@/hooks/use-amount-formatter";
import { cn } from "@/lib/utils";
import type { TransactionType } from "../domain/types";
import { transactionDirection } from "../domain/wallet";
import { useWalletHydrated } from "../hooks/use-wallet-hydration";
import { useWalletStore, useWalletTransactions } from "../store/wallet-store";

const TYPE_ICONS: Record<TransactionType, LucideIcon> = {
  topup: ArrowUpRight,
  withdrawal: ArrowDownLeft,
  resume_purchase: FileText,
};

export function TransactionList() {
  const t = useTranslations("wallet.transactions");
  const tCommon = useTranslations("common");
  const formatter = useFormatter();
  const { format, currency } = useAmountFormatter();

  const hydrated = useWalletHydrated();
  const transactions = useWalletTransactions();
  const reset = useWalletStore((state) => state.reset);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleReset() {
    reset();
    setConfirmOpen(false);
    toast.success(t("cleared"));
  }

  return (
    <Surface padding="none" className="overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-5 sm:p-6">
        <div>
          <h2 className="font-display text-base font-semibold">{t("title")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("description")}</p>
        </div>

        {hydrated && transactions.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
            <RotateCcw data-icon="inline-start" />
            {t("clear")}
          </Button>
        ) : null}
      </header>

      {!hydrated ? (
        <ul className="divide-y divide-border/70">
          {[0, 1, 2].map((row) => (
            <li key={row} className="flex items-center gap-3 p-4 sm:px-6">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
            </li>
          ))}
        </ul>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-border/70 bg-muted/40">
            <Receipt className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <p className="mt-1 text-sm font-medium">{t("empty")}</p>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <ul className="h-[239px] max-h-[239px] divide-y divide-border/70 overflow-y-auto">
          {transactions.map((transaction) => {
            const Icon = TYPE_ICONS[transaction.type];
            const isCredit = transactionDirection(transaction.type) === "credit";

            return (
              <li key={transaction.id} className="flex items-center gap-3 p-4 sm:px-6">
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl border",
                    isCredit
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-border/70 bg-muted/50 text-muted-foreground",
                  )}
                >
                  <Icon className="size-4 rtl:-scale-x-100" aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t(`types.${transaction.type}`)}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {formatter.dateTime(new Date(transaction.createdAt), {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <p
                  className={cn(
                    "tabular-amount shrink-0 text-sm font-semibold",
                    isCredit ? "text-success" : "text-foreground",
                  )}
                  dir="ltr"
                >
                  {isCredit ? "+" : "−"} {format(transaction.amount)} {currency}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent closeLabel={tCommon("close")}>
          <DialogHeader>
            <DialogTitle>{t("clearConfirmTitle")}</DialogTitle>
            <DialogDescription>{t("clearConfirmDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="lg" onClick={() => setConfirmOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button variant="destructive" size="lg" onClick={handleReset}>
              {t("clear")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Surface>
  );
}
