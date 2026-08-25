import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  showRole?: boolean;
}

export function Brand({ className, showRole = false }: BrandProps) {
  const t = useTranslations("nav");

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand to-brand-accent font-display text-sm font-bold text-primary-foreground shadow-[0_6px_20px_color-mix(in_oklab,var(--brand)_35%,transparent)]"
      >
        AK
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-sm font-semibold">{t("brandName")}</span>
        {showRole ? (
          <span className="truncate text-[0.7rem] text-muted-foreground">{t("brandRole")}</span>
        ) : null}
      </span>
    </Link>
  );
}
