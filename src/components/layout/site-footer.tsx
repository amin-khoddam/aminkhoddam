import { useTranslations } from "next-intl";
import { Brand } from "@/components/layout/brand";
import { socialIcons } from "@/components/shared/social-icons";
import { portfolioSections, siteConfig } from "@/config/site";
import { profile } from "@/config/profile";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/70 sm:mt-24">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Brand showRole />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
        </div>

        <nav aria-label={t("sections")}>
          <h2 className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase">{t("sections")}</h2>
          <ul className="space-y-2">
            {portfolioSections.map((section) => (
              <li key={section}>
                <Link
                  href={`/#${section}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tNav(section)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase">{t("demo")}</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/wallet"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {tNav("wallet")}
              </Link>
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-2">
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
      </div>

      <div className="border-t border-border/70">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {siteConfig.name}. {t("rights")}
          </span>
          <span className="font-mono">Next.js · TypeScript · Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
