import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PaymentGateway } from "@/features/payment/components/payment-gateway";
import { PaymentQueryProvider } from "@/features/payment/components/payment-query-provider";

export async function generateMetadata(
  props: PageProps<"/[locale]/wallet/payment">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.payment" });

  return { title: t("title"), description: t("description"), robots: { index: false } };
}

export default function PaymentPage() {
  return (
    <div className="container-page flex justify-center py-10 sm:py-14">
      <div className="w-full max-w-md">
        <PaymentQueryProvider>
          <PaymentGateway />
        </PaymentQueryProvider>
      </div>
    </div>
  );
}
