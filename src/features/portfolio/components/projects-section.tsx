import { useTranslations } from "next-intl";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { TechBadge } from "@/components/shared/tech-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { projects } from "@/config/profile";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  const t = useTranslations("projects");

  return (
    <Section
      id="projects"
      index="04"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal
            key={project.id}
            delay={0.05 * index}
            className={cn("h-full", project.featured && "sm:col-span-2")}
          >
            <Surface
              interactive
              padding={project.featured ? "lg" : "md"}
              className="flex h-full flex-col"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-display text-base font-semibold sm:text-lg">
                  {t(`items.${project.id}.name`)}
                </h3>
                {project.featured ? <Badge variant="secondary">{t("featured")}</Badge> : null}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${project.id}.description`)}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium">{t("roleLabel")}:</span>{" "}
                {t(`items.${project.id}.role`)}
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <TechBadge>{tech}</TechBadge>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2 pt-1">
                {project.internalHref ? (
                  <Button asChild size="sm" className="h-10 sm:h-8">
                    <Link href={project.internalHref}>
                      {t("openWallet")}
                      <ArrowUpRight data-icon="inline-end" className="rtl:-scale-x-100" />
                    </Link>
                  </Button>
                ) : null}

                {project.demoUrl ? (
                  <Button asChild size="sm" variant="outline" className="h-10 sm:h-8">
                    <a href={project.demoUrl} target="_blank" rel="noreferrer noopener">
                      <ExternalLink data-icon="inline-start" />
                      {t("viewDemo")}
                    </a>
                  </Button>
                ) : null}

                {project.repoUrl ? (
                  <Button asChild size="sm" variant="ghost" className="h-10 sm:h-8">
                    <a href={project.repoUrl} target="_blank" rel="noreferrer noopener">
                      <Code2 data-icon="inline-start" />
                      {t("viewCode")}
                    </a>
                  </Button>
                ) : null}
              </div>
            </Surface>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
