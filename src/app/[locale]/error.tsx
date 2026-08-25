"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset(): void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("error");

  useEffect(() => {
    // The digest is the only safe identifier to surface; the message may leak internals.
    console.error("client_error", { digest: error.digest });
  }, [error.digest]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("description")}</p>
      <Button size="xl" className="mt-6" onClick={reset}>
        {t("action")}
      </Button>
    </div>
  );
}
