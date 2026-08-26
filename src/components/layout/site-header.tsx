"use client";

import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { portfolioSections } from "@/config/site";
import { ResumeDownloadButton } from "@/features/wallet/components/resume-download-button";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled } from "@/hooks/use-scrolled";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrolled();
  const activeSection = useActiveSection(portfolioSections, isHome);

  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-4">
      <div className="container-page">
        <div
          className={cn(
            "flex items-center gap-1 rounded-2xl px-2 py-2 transition-[background-color,box-shadow] duration-300 sm:gap-1.5 sm:rounded-full sm:px-3",
            scrolled ? "glass-panel-strong" : "glass-panel",
          )}
        >
          <Brand className="me-auto ps-1" />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t("menuTitle")}>
            {portfolioSections.map((section) => {
              const isActive = isHome && activeSection === section;

              return (
                <Link
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();

                      document.getElementById(section)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  key={section}
                  href={`/#${section}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {t(section)}
                </Link>
              );
            })}
          </nav>

          <span className="mx-1 hidden h-5 w-px bg-border lg:block" aria-hidden />

          <div className="hidden items-center gap-0.5 md:flex">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>

          <ResumeDownloadButton
            variant="ghost"
            size="sm"
            label={t("resume")}
            className="hidden lg:inline-flex"
          />

          <Button asChild size="sm" className="h-11 min-w-11 rounded-full lg:h-8 lg:min-w-0">
            <Link href="/wallet" aria-label={t("wallet")}>
              <Wallet data-icon="inline-start" />
              <span className="hidden sm:inline">{t("wallet")}</span>
            </Link>
          </Button>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
