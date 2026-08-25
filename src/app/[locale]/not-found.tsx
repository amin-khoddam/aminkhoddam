import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("description")}</p>
      <Button asChild size="xl" className="mt-6">
        <Link href="/">{t("action")}</Link>
      </Button>
    </div>
  );
}
