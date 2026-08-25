"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in the middle of the viewport so the
 * header can highlight it. Disabled on routes that have no sections.
 */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (topMost) setActiveId(topMost.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids, enabled]);

  return enabled ? activeId : null;
}
