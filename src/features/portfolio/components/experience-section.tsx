import { useTranslations } from "next-intl";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { TechBadge } from "@/components/shared/tech-badge";
import { Surface } from "@/components/ui/surface";
import { experiences } from "@/config/profile";

export function ExperienceSection() {
  const t = useTranslations("experience");

  return (
    <Section
      id="experience"
      index="03"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <ol className="relative space-y-4 border-s border-border/70 ps-5 sm:ps-8">
        {experiences.map((entry, index) => (
          <li key={entry.id} className="relative">
            {/* Timeline node, centred on the rail. */}
            <span
              aria-hidden
              className={
                entry.current
                  ? "absolute -start-[1.55rem] top-6 size-3 rounded-full bg-brand ring-4 ring-background sm:-start-[2.3rem]"
                  : "absolute -start-[1.55rem] top-6 size-3 rounded-full bg-border ring-4 ring-background sm:-start-[2.3rem]"
              }
            />

            <Reveal delay={0.06 * index}>
              <Surface interactive>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-base font-semibold sm:text-lg">
                    {t(`items.${entry.id}.role`)}
                    <span className="text-brand"> · {t(`items.${entry.id}.company`)}</span>
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {t(`items.${entry.id}.period`)}
                  </p>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${entry.id}.summary`)}
                </p>

                <ul className="mt-4 space-y-2">
                  {entry.highlightIds.map((highlightId) => (
                    <li
                      key={highlightId}
                      className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/60"
                      />
                      <span>{t(`items.${entry.id}.highlights.${highlightId}`)}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {entry.stack.map((tech) => (
                    <li key={tech}>
                      <TechBadge>{tech}</TechBadge>
                    </li>
                  ))}
                </ul>
              </Surface>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
