import { cn } from "@/lib/utils";

interface TechBadgeProps {
  children: string;
  className?: string;
}

/** Small technology chip used in the hero, experience and project cards. */
export function TechBadge({ children, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 bg-muted/50 px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground sm:text-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}
