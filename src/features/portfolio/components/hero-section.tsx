import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { TechBadge } from "@/components/shared/tech-badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { heroStack, heroStatIds } from "@/config/profile";
import { ResumeDownloadButton } from "@/features/portfolio/components/resume-download-button";
import { TerminalPreviewCard } from "@/features/portfolio/components/terminal-preview-card";
import { SectionLink } from "@/features/portfolio/components/section-link";

export function HeroSection() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  return (
    <section className="container-page pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-24 lg:pb-28">
      <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
        <div className="min-w-0">
          <Reveal>
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span className="min-w-0 text-pretty">{t("availability")}</span>
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-5 sm:mt-6">
              <span className="block text-xs font-medium text-muted-foreground sm:text-base">
                {t("name")} · {tNav("brandRole")}
              </span>
              <span className="mt-3 block text-[1.75rem] leading-[1.15] font-bold text-balance break-words min-[400px]:text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem]">
                {t("headlineLead")} <span className="text-gradient">{t("headlineHighlight")}</span>{" "}
                {t("headlineTail")}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground sm:mt-6 sm:text-base">
              {t("intro")}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="xl" className="w-full sm:w-auto">
                <SectionLink section="projects">{t("primaryCta")}</SectionLink>
              </Button>
              <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">
                <ResumeDownloadButton variant="outline" size="xl" label={t("secondaryCta")} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-wrap items-center gap-2 sm:mt-8">
              <span className="me-1 w-full text-xs font-medium text-muted-foreground sm:w-auto">
                {t("stackLabel")}
              </span>
              {heroStack.map((tech) => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.12}
          className="mx-auto w-full max-w-md min-w-0 sm:max-w-lg lg:max-w-none lg:animate-float"
        >
          <TerminalPreviewCard />
        </Reveal>
      </div>

      <Reveal delay={0.3}>
        <dl className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4 sm:gap-4">
          {heroStatIds.map((statId) => (
            <Surface key={statId} padding="sm" className="text-center sm:text-start">
              <dt className="font-display text-xl font-bold min-[400px]:text-2xl sm:text-3xl">
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