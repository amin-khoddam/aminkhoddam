import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The single card primitive of the design system. Portfolio sections and the
 * wallet share it so both halves of the product look like one thing.
 */
const surfaceVariants = cva("rounded-2xl", {
  variants: {
    variant: {
      glass: "glass-panel",
      strong: "glass-panel-strong",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    },
    interactive: {
      true: "transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--elevation-elevated)]",
      false: "",
    },
  },
  defaultVariants: { variant: "glass", padding: "md", interactive: false },
});

export type SurfaceProps = React.ComponentProps<"div"> & VariantProps<typeof surfaceVariants>;

export function Surface({ className, variant, padding, interactive, ...props }: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      className={cn(surfaceVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  );
}

export { surfaceVariants };
