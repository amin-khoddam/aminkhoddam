"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ResumeDownloadButton } from "@/features/portfolio/components/resume-download-button";
import { Link, usePathname } from "@/i18n/navigation";
import { portfolioSections } from "@/config/site";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
/**
 * Mobile navigation. Opens from the bottom so it matches the wallet sheets and
 * keeps every target within thumb reach.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const tLanguage = useTranslations("language");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-11 lg:hidden"
          aria-label={t("openMenu")}
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        side="right"
        closeLabel={tCommon("close")}
        className="rounded-l-3xl border-t pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="px-5 pt-5 text-start">
          <SheetTitle>{t("menuTitle")}</SheetTitle>
          <SheetDescription>{t("menuDescription")}</SheetDescription>
        </SheetHeader>

        <nav className="grid grid-cols-2 gap-2 px-5" aria-label={t("menuTitle")}>
          {portfolioSections.map((section) => (
            <SheetClose key={section} asChild>
              <Link
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault();

                    document.getElementById(section)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });

                    setOpen(false);
                  }
                }}
                href={`/#${section}`}
                className="flex min-h-12 items-center rounded-xl border border-border/70 bg-muted/40 px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              >
                {t(section)}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <Separator className="my-1" />

        <div className="flex flex-col gap-2 px-5">
          <SheetClose asChild>
            <Button asChild size="xl" className="w-full">
              <Link href="/wallet">
                <Wallet data-icon="inline-start" />
                {t("wallet")}
              </Link>
            </Button>
          </SheetClose>
          <ResumeDownloadButton
            variant="outline"
            size="xl"
            className="w-full"
            label={t("resume")}
          />
        </div>

        <Separator className="my-1" />

        <div className="flex items-center justify-between gap-3 px-5 pb-2">
          <span className="text-xs font-medium text-muted-foreground">
            {tTheme("label")} · {tLanguage("label")}
          </span>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
