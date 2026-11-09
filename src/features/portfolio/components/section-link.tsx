// components/section-link.tsx
"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type SectionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  section?: string;
};

export function SectionLink({ section, onClick, ...props }: SectionLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Link
      {...props}
      href={section ? `/#${section}` : "/"}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        if (isHome) {
          e.preventDefault();

          if (section) {
            document.getElementById(section)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }}
    />
  );
}