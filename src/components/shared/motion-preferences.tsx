"use client";

import type { ReactNode } from "react";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";

/**
 * Motion context for the portfolio page.
 *
 * `MotionConfig reducedMotion="user"` applies the visitor's preference: with
 * reduced motion the transform is skipped while opacity still resolves, so
 * nothing is left hidden.
 *
 * `LazyMotion` with the `domAnimation` feature set loads roughly half of what
 * the full `motion` component pulls in. `strict` makes the smaller `m`
 * component mandatory, so a stray `motion.*` import cannot quietly undo that.
 */
export function MotionPreferences({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
