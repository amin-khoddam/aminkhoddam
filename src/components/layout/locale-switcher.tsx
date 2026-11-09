"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Switches locale while staying on the current route. Direction and fonts
 * follow from the locale in the root layout, so nothing else needs updating.
 */
export function LocaleSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: string) {
    if (nextLocale === locale) return;
    startTransition(() => router.replace(pathname, { locale: nextLocale, scroll: false }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-10 lg:size-7 cursor-pointer"
          aria-label={t("label")}
          disabled={isPending}
        >
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        align="end"
        className="min-w-40"
      >
        <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {routing.locales.map((item) => (
            <DropdownMenuRadioItem key={item} value={item}>
              <span
                className={item === "fa" ? "font-[family-name:var(--font-vazirmatn)]" : undefined}
                dir={item === "fa" ? "rtl" : "ltr"}
              >
                {t(item)}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
