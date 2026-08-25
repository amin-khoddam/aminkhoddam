import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Sora, Vazirmatn } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AppProviders } from "@/app/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { getDirection, routing, type AppLocale } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t("title"), template: `%s — ${siteConfig.name}` },
    description: t("description"),
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((item) => [item, `/${item}`])),
    },
    openGraph: {
      type: "website",
      locale,
      url: `/${locale}`,
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Root layout. It lives under `[locale]` so the locale is a root param, which
 * makes it readable from any server component without prop drilling.
 */
export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const activeLocale = locale as AppLocale;
  // Only ship the font family the active locale actually renders with.
  const fontVariables =
    activeLocale === "fa"
      ? `${vazirmatn.variable} ${inter.variable}`
      : `${inter.variable} ${sora.variable} ${vazirmatn.variable}`;

  return (
    <html
      lang={activeLocale}
      dir={getDirection(activeLocale)}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Reveal animations set an initial opacity of 0; without JavaScript
            the content must still be visible. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <AppProviders>
          <NextIntlClientProvider>
            <div className="ambient-backdrop" aria-hidden />
            <div className="ambient-grid" aria-hidden />
            <div className="ambient-noise" aria-hidden />
            <SkipToContent />
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <Toaster />
          </NextIntlClientProvider>
        </AppProviders>
      </body>
    </html>
  );
}
