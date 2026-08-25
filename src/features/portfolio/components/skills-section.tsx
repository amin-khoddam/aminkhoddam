import { useTranslations } from "next-intl";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { TechBadge } from "@/components/shared/tech-badge";
import { Surface } from "@/components/ui/surface";
import { skillGroups } from "@/config/profile";

export function SkillsSection() {
  const t = useTranslations("skills");

  return (
    <Section
      id="skills"
      index="02"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.id} delay={0.05 * index} className="h-full">
            <Surface interactive className="h-full">
              <h3 className="font-display text-base font-semibold">
                {t(`groups.${group.id}.title`)}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {t(`groups.${group.id}.description`)}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <TechBadge>{skill}</TechBadge>
                  </li>
                ))}
              </ul>
            </Surface>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
