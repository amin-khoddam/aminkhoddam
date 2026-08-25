import { defineRouting } from "next-intl/routing";

export const locales = ["fa", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "fa";

/** Text direction is derived from the locale, never stored separately. */
export const localeDirections: Record<AppLocale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export function getDirection(locale: AppLocale) {
  return localeDirections[locale];
}
