import { useTranslations } from "next-intl";

export function SkipToContent() {
  const t = useTranslations("common");

  return (
    <a
      href="#main-content"
      className="sr-only rounded-b-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-2 focus:z-100 focus:ring-3 focus:ring-ring"
    >
      {t("skipToContent")}
    </a>
  );
}
