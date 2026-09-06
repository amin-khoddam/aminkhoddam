import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { TechBadge } from "@/components/shared/tech-badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { heroStack, heroStatIds } from "@/config/profile";
import { ResumeDownloadButton } from "@/features/wallet/components/resume-download-button";
import { Link } from "@/i18n/navigation";
import { WalletPreviewCard } from "./wallet-preview-card";

export function HeroSection() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  return (
    <section className="container-page pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:gap-14">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {t("availability")}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6">
              <span className="block text-sm font-medium text-muted-foreground sm:text-base">
                {t("name")} · {tNav("brandRole")}
              </span>
              <span className="mt-3 block text-3xl leading-[1.12] font-bold text-balance sm:text-4xl lg:text-5xl xl:text-[3.4rem]">
                {t("headlineLead")} <span className="text-gradient">{t("headlineHighlight")}</span>{" "}
                {t("headlineTail")}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
              {t("intro")}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="xl">
                <Link href="/#projects">{t("primaryCta")}</Link>
              </Button>
              <ResumeDownloadButton variant="outline" size="xl" label={t("secondaryCta")} />
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="me-1 text-xs font-medium text-muted-foreground">
                {t("stackLabel")}
              </span>
              {heroStack.map((tech) => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="lg:animate-float">
          <WalletPreviewCard />
          <span className="mt-2 block text-center text-sm font-medium text-muted-foreground sm:text-base">
            {t("note")}
          </span>
        </Reveal>
      </div>

      <Reveal delay={0.3}>
        <dl className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4 sm:gap-4">
          {heroStatIds.map((statId) => (
            <Surface key={statId} padding="sm" className="text-center sm:text-start">
              <dt className="font-display text-2xl font-bold sm:text-3xl">
                <span className="text-gradient">{t(`stats.${statId}.value`)}</span>
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {t(`stats.${statId}.label`)}
              </dd>
            </Surface>
          ))}
        </dl>
      </Reveal>

      <div className="mt-12 hidden justify-center text-muted-foreground lg:flex">
        <ArrowDown className="size-5 animate-bounce" aria-hidden />
      </div>
    </section>
  );
}
