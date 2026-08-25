import { useTranslations } from "next-intl";
import { Accessibility, Layers, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Surface } from "@/components/ui/surface";
import { aboutHighlightIds, aboutParagraphIds } from "@/config/profile";

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  systems: Layers,
  performance: Zap,
  accessibility: Accessibility,
  quality: ShieldCheck,
};

export function AboutSection() {
  const t = useTranslations("about");

  return (
    <Section
      id="about"
      index="01"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("lead")}
    >
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-10">
        <Reveal className="lg:col-span-3">
          <div className="space-y-4">
            {aboutParagraphIds.map((id) => (
              <p
                key={id}
                className="text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base"
              >
                {t(`paragraphs.${id}`)}
              </p>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
          {aboutHighlightIds.map((id, index) => {
            const Icon = HIGHLIGHT_ICONS[id];

            return (
              <Reveal key={id} delay={0.06 * index}>
                <Surface padding="sm" interactive className="h-full">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/70 bg-muted/50">
                      <Icon className="size-4 text-brand" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">{t(`highlights.${id}.title`)}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {t(`highlights.${id}.description`)}
                      </p>
                    </div>
                  </div>
                </Surface>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
