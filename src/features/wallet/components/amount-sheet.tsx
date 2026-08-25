"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAmountFormatter } from "@/hooks/use-amount-formatter";
import type { AppLocale } from "@/i18n/routing";
import { formatAmountInput, parseAmount } from "@/lib/money";
import { cn } from "@/lib/utils";
import { MAX_TRANSACTION_AMOUNT, MIN_TRANSACTION_AMOUNT } from "../domain/constants";
import { createAmountSchema, type AmountFormValues } from "../domain/schemas";

interface AmountSheetProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  title: string;
  description: string;
  submitLabel: string;
  /** Extra line under the range hint, e.g. the withdrawable maximum. */
  hint?: string;
  /** When set, the amount is also capped at the available balance. */
  availableBalance?: number;
  quickAmounts?: readonly number[];
  onSubmit(amount: number): void;
}

/**
 * Bottom sheet shared by the top-up and withdrawal flows.
 *
 * Both use the same schema factory, so the amount rules are defined once and
 * the two entry points cannot drift apart.
 */
export function AmountSheet({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  hint,
  availableBalance,
  quickAmounts,
  onSubmit,
}: AmountSheetProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("wallet");
  const tCommon = useTranslations("common");
  const { format, currency } = useAmountFormatter();

  const schema = useMemo(
    () =>
      createAmountSchema({
        availableBalance,
        messages: {
          invalid: t("errors.INVALID_AMOUNT"),
          tooLow: t("errors.AMOUNT_TOO_LOW", { min: format(MIN_TRANSACTION_AMOUNT), currency }),
          tooHigh: t("errors.AMOUNT_TOO_HIGH", { max: format(MAX_TRANSACTION_AMOUNT), currency }),
          insufficient: t("errors.INSUFFICIENT_FUNDS", {
            amount: format(availableBalance ?? 0),
            currency,
          }),
        },
      }),
    [availableBalance, currency, format, t],
  );

  const form = useForm<AmountFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { amount: "" },
  });

  const amountField = form.register("amount");
  const errorMessage = form.formState.errors.amount?.message;
  const canSubmit = form.formState.isValid;

  useEffect(() => {
    if (!open) form.reset({ amount: "" });
  }, [open, form]);

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Re-group digits as they are typed so the field always reads like money.
    event.target.value = formatAmountInput(event.target.value, locale);
    return amountField.onChange(event);
  }

  function applyQuickAmount(amount: number) {
    form.setValue("amount", format(amount), { shouldValidate: true, shouldDirty: true });
  }

  const submit = form.handleSubmit(({ amount }) => {
    const parsed = parseAmount(amount);
    if (parsed === null) return;
    onSubmit(parsed);
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92svh] min-h-[52svh]">
        <form onSubmit={submit} className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <DrawerHeader className="px-5 text-start sm:px-6">
            <DrawerTitle className="text-lg">{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 space-y-4 px-5 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="wallet-amount" className="text-xs font-medium">
                {t("amountLabel")}
              </Label>

              <div className="relative">
                <Input
                  {...amountField}
                  onChange={handleAmountChange}
                  id="wallet-amount"
                  inputMode="numeric"
                  autoComplete="off"
                  enterKeyHint="done"
                  placeholder={t("amountPlaceholder")}
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby="wallet-amount-hint"
                  className="tabular-amount h-16 rounded-2xl text-center text-2xl font-semibold sm:h-16 sm:text-2xl"
                />
                <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-muted-foreground">
                  {currency}
                </span>
              </div>

              <p
                id="wallet-amount-hint"
                role={errorMessage ? "alert" : undefined}
                className={cn(
                  "text-xs leading-relaxed",
                  errorMessage ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {errorMessage ??
                  t("rangeHint", {
                    min: format(MIN_TRANSACTION_AMOUNT),
                    max: format(MAX_TRANSACTION_AMOUNT),
                    currency,
                  })}
              </p>

              {hint && !errorMessage ? (
                <p className="text-xs text-muted-foreground">{hint}</p>
              ) : null}
            </div>

            {quickAmounts?.length ? (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("quickAmounts")}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="lg"
                      className="tabular-amount h-12 sm:h-9"
                      onClick={() => applyQuickAmount(amount)}
                    >
                      {format(amount)}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <DrawerFooter className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <Button type="submit" size="xl" className="w-full" disabled={!canSubmit}>
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              {tCommon("cancel")}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
