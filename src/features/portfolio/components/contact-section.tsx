import { useTranslations } from "next-intl";
import { BadgeCheck, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { socialIcons } from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { profile } from "@/config/profile";
import { ResumeDownloadButton } from "@/features/wallet/components/resume-download-button";

interface ContactRow {
  id: string;
  Icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export function ContactSection() {
  const t = useTranslations("contact");

  const rows: ContactRow[] = [
    {
      id: "email",
      Icon: Mail,
      label: t("emailLabel"),
      value: profile.email,
      href: `https://mail.google.com/mail/?view=cm&to=amin.khoddam.connect@gmail.com`,
    },
    {
      id: "phone",
      Icon: Phone,
      label: t("phoneLabel"),
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
    { id: "location", Icon: MapPin, label: t("locationLabel"), value: t("location") },
    {
      id: "availability",
      Icon: BadgeCheck,
      label: t("availabilityLabel"),
      value: t("availability"),
    },
  ];

  return (
    <Section
      id="contact"
      index="05"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Reveal>
        <Surface variant="strong" padding="lg">
          <div className="grid gap-8 lg:grid-cols-2">
            <dl className="grid gap-3 sm:grid-cols-2">
              {rows.map(({ id, Icon, label, value, href }) => (
                <div key={id} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Icon className="size-3.5" aria-hidden />
                    {label}
                  </dt>
                  <dd className="mt-1.5 line-clamp-1 text-sm font-medium break-words">
                    {href ? (
                      <a
                        target={id === "email" ? "_blank" : "_self"}
                        href={href}
                        className="transition-colors hover:text-brand"
                        dir="ltr"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col justify-between gap-6">
              <div className="flex flex-wrap gap-3">
                <Button asChild size="xl">
                  <a
                    target="_blank"
                    href={"https://mail.google.com/mail/?view=cm&to=amin.khoddam.connect@gmail.com"}
                  >
                    <Mail data-icon="inline-start" />
                    {t("primaryCta")}
                  </a>
                </Button>
                <ResumeDownloadButton variant="outline" size="xl" label={t("secondaryCta")} />
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {t("socialLabel")}
                </p>
                <div className="flex items-center gap-2">
                  {profile.socials.map(({ id, url }) => {
                    const Icon = socialIcons[id];
                    if (!Icon) return null;

                    return (
                      <a
                        key={id}
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={id}
                        className="grid size-10 place-items-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">{t("placeholderNote")}</p>
            </div>
          </div>
        </Surface>
      </Reveal>
    </Section>
  );
}
