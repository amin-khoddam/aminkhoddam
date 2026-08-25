import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  /** Two-digit marker shown before the section label. */
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("container-page scroll-mt-24 my-16 sm:my-20 lg:my-24", className)}
    >
      <Reveal className="mb-10 max-w-2xl sm:mb-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-xs text-brand">{index}</span>
          <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
          <span className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
        </div>
        <h2 className="text-2xl font-bold text-balance sm:text-3xl lg:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </Reveal>
      {children}
    </section>
  );
}
