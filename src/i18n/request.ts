import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as getRootLocale } from "next/root-params";
import { defaultLocale, routing } from "./routing";

/**
 * Resolves the active locale from the `[locale]` root param. Root params are not
 * available outside the localized route tree (for example in a route handler),
 * so the default locale is used as a fallback.
 */
async function resolveLocale(override?: string) {
  if (hasLocale(routing.locales, override)) return override;

  try {
    const rootLocale = await getRootLocale();
    if (hasLocale(routing.locales, rootLocale)) return rootLocale;
  } catch {
    // Intentionally ignored: falls through to the default locale.
  }

  return defaultLocale;
}

export default getRequestConfig(async ({ locale: override }) => {
  const locale = await resolveLocale(override);

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: "Asia/Tehran",
  };
});
