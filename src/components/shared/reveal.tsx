"use client";

import { useRef, type ReactNode } from "react";
import { m, useInView } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds; use small increments to stagger siblings. */
  delay?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const HIDDEN = { opacity: 0, y: 18 } as const;
const VISIBLE = { opacity: 1, y: 0 } as const;

/**
 * Entrance animation used across the portfolio: a short fade and slide-up when
 * the element scrolls into view, once.
 *
 * The viewport check is an explicit `useInView` rather than `whileInView` so
 * the lighter `domAnimation` feature bundle is enough. It reports `false`
 * during server rendering, which is also the initial client state, so the
 * markup matches on hydration.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <m.div
      ref={ref}
      data-reveal
      className={className}
      initial={HIDDEN}
      animate={inView ? VISIBLE : HIDDEN}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}
