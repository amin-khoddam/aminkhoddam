"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CircleCheck, Download, TriangleAlert, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAmountFormatter } from "@/hooks/use-amount-formatter";
import { Link } from "@/i18n/navigation";
import { useResumeDownload } from "../hooks/use-resume-download";
import { useWalletHydrated } from "../hooks/use-wallet-hydration";

type ButtonProps = React.ComponentProps<typeof Button>;

interface ResumeDownloadButtonProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  label?: string;
  showIcon?: boolean;
}

/**
 * Entry point for the paid resume download. The wallet rules live in
 * `useResumeDownload`; this component only renders the matching state.
 */
export function ResumeDownloadButton({
  variant = "outline",
  size = "sm",
  className,
  label,
  showIcon = true,
}: ResumeDownloadButtonProps) {
  const t = useTranslations("resume");
  const tCommon = useTranslations("common");
  const { formatWithCurrency, currency, format } = useAmountFormatter();
  const hydrated = useWalletHydrated();
  const [open, setOpen] = useState(false);

  const { balance, price, unlocked, hasSufficientBalance, status, confirm, reset } =
    useResumeDownload();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function handleConfirm() {
    const outcome = confirm();
    if (outcome?.charged) {
      toast.success(t("purchased", { amount: format(price), currency }));
    } else {
      toast.success(t("downloadStarted"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {showIcon ? <Download data-icon="inline-start" /> : null}
          {label ?? t("title")}
        </Button>
      </DialogTrigger>

      <DialogContent closeLabel={tCommon("close")} className="sm:max-w-md">
        {status === "completed" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CircleCheck className="size-5 text-success" />
                {t("downloadStarted")}
              </DialogTitle>
              <DialogDescription>{t("alreadyPurchasedDescription")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" size="lg" onClick={() => handleOpenChange(false)}>
                {tCommon("close")}
              </Button>
            </DialogFooter>
          </>
        ) : !hydrated ? (
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{tCommon("loading")}</DialogDescription>
          </DialogHeader>
        ) : !hasSufficientBalance ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TriangleAlert className="size-5 text-destructive" />
                {t("insufficientTitle")}
              </DialogTitle>
              <DialogDescription>
                {t("insufficientDescription", {
                  amount: format(price),
                  balance: format(balance),
                  currency,
                })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" size="lg" onClick={() => handleOpenChange(false)}>
                {tCommon("cancel")}
              </Button>
              <Button size="lg" asChild onClick={() => handleOpenChange(false)}>
                <Link href="/wallet">
                  <Wallet data-icon="inline-start" />
                  {t("goToWallet")}
                </Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{unlocked ? t("alreadyPurchasedTitle") : t("title")}</DialogTitle>
              <DialogDescription>
                {unlocked
                  ? t("alreadyPurchasedDescription")
                  : t("priceNotice", { amount: format(price), currency })}
              </DialogDescription>
            </DialogHeader>

            {!unlocked ? (
              <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                {t("confirmDescription", {
                  balance: format(balance),
                  remaining: format(balance - price),
                  currency,
                })}
              </p>
            ) : null}

            <DialogFooter>
              <Button variant="outline" size="lg" onClick={() => handleOpenChange(false)}>
                {tCommon("cancel")}
              </Button>
              <Button size="lg" onClick={handleConfirm} disabled={status === "processing"}>
                <Download data-icon="inline-start" />
                {unlocked ? t("download") : `${t("confirm")} · ${formatWithCurrency(price)}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
