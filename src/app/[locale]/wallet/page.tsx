import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/features/wallet/components/transaction-list";
import { WalletOverview } from "@/features/wallet/components/wallet-overview";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(props: PageProps<"/[locale]/wallet">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.wallet" });

  return { title: t("title"), description: t("description") };
}

export default function WalletPage() {
  const t = useTranslations("wallet");
  const tNav = useTranslations("nav");

  return (
    <div className="container-page py-10 sm:py-14">
      <Button asChild variant="ghost" size="sm" className="-ms-2 mb-6 h-10 px-3 sm:h-8 sm:px-2.5">
        <Link href="/">
          <ArrowLeft data-icon="inline-start" className="rtl:-scale-x-100" />
          {tNav("backToPortfolio")}
        </Link>
      </Button>

      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6">
        <WalletOverview />
        <TransactionList />
      </div>
    </div>
  );
}
