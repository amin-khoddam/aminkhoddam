"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatPan, normalizePan } from "../domain/card";
import { APPROVED_TEST_CARD, DECLINED_TEST_CARD } from "../domain/constants";
import { createCardSchema, type CardFormValues } from "../domain/schemas";

interface CardFormProps {
  submitLabel: string;
  pending: boolean;
  onSubmit(values: CardFormValues): void;
  onCancel(): void;
}

const DIGITS_ONLY = /[^0-9]/g;

export function CardForm({ submitLabel, pending, onSubmit, onCancel }: CardFormProps) {
  const t = useTranslations("payment");
  const tCommon = useTranslations("common");

  // Stable "now" so validation does not change between renders.
  const now = useMemo(() => new Date(), []);
  const schema = useMemo(
    () =>
      createCardSchema(
        {
          cardNumber: t("validation.cardNumber"),
          expiryMonth: t("validation.expiryMonth"),
          expiryYear: t("validation.expiryYear"),
          expired: t("validation.expired"),
          cvv: t("validation.cvv"),
        },
        now,
      ),
    [t, now],
  );

  const form = useForm<CardFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { cardNumber: "", expiryMonth: "", expiryYear: "", cvv: "" },
  });

  const cardNumberField = form.register("cardNumber");
  const { errors } = form.formState;

  function handleCardNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = formatPan(event.target.value);
    return cardNumberField.onChange(event);
  }

  function fillTestCard(pan: string) {
    form.reset({
      cardNumber: formatPan(pan),
      expiryMonth: "12",
      expiryYear: String((now.getFullYear() + 2) % 100).padStart(2, "0"),
      cvv: "123",
    });
  }

  const submit = form.handleSubmit((values) =>
    onSubmit({ ...values, cardNumber: normalizePan(values.cardNumber) }),
  );

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="text-xs">
          {t("cardNumberLabel")}
        </Label>
        <div className="relative">
          <CreditCard
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground"
          />
          <Input
            {...cardNumberField}
            onChange={handleCardNumberChange}
            id="cardNumber"
            dir="ltr"
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={19}
            placeholder="0000 0000 0000 0000"
            aria-invalid={Boolean(errors.cardNumber)}
            className="tabular-amount h-12 rounded-xl ps-10 text-center text-base tracking-[0.15em]"
          />
        </div>
        <FieldError message={errors.cardNumber?.message} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="expiryMonth" className="text-xs">
            {t("expiryLabel")}
          </Label>
          <div className="flex items-center gap-2" dir="ltr">
            <Input
              {...form.register("expiryMonth")}
              id="expiryMonth"
              inputMode="numeric"
              autoComplete="cc-exp-month"
              maxLength={2}
              placeholder={t("expiryMonthPlaceholder")}
              aria-invalid={Boolean(errors.expiryMonth)}
              className="tabular-amount h-12 rounded-xl text-center text-base"
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value.replace(DIGITS_ONLY, "");
              }}
            />
            <span className="text-sm text-muted-foreground">/</span>
            <Input
              {...form.register("expiryYear")}
              id="expiryYear"
              inputMode="numeric"
              autoComplete="cc-exp-year"
              maxLength={2}
              placeholder={t("expiryYearPlaceholder")}
              aria-invalid={Boolean(errors.expiryYear)}
              className="tabular-amount h-12 rounded-xl text-center text-base"
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value.replace(DIGITS_ONLY, "");
              }}
            />
          </div>
          <FieldError message={errors.expiryMonth?.message ?? errors.expiryYear?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv" className="text-xs">
            {t("cvvLabel")}
          </Label>
          <Input
            {...form.register("cvv")}
            id="cvv"
            type="password"
            dir="ltr"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            placeholder={t("cvvPlaceholder")}
            aria-invalid={Boolean(errors.cvv)}
            className="tabular-amount h-12 rounded-xl text-center text-base"
          />
          <FieldError message={errors.cvv?.message} />
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">{t("testCards")}</p>
        <div className="flex flex-col gap-1.5">
          <TestCardButton
            label={t("testCardApproved", { card: formatPan(APPROVED_TEST_CARD) })}
            onClick={() => fillTestCard(APPROVED_TEST_CARD)}
          />
          <TestCardButton
            label={t("testCardDeclined", { card: formatPan(DECLINED_TEST_CARD) })}
            onClick={() => fillTestCard(DECLINED_TEST_CARD)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" size="xl" className="w-full" disabled={pending}>
          <Lock data-icon="inline-start" />
          {pending ? tCommon("processing") : submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={onCancel}
          disabled={pending}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

function TestCardButton({ label, onClick }: { label: string; onClick(): void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-9 items-center rounded-md text-start font-mono text-[0.7rem] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {label}
    </button>
  );
}
