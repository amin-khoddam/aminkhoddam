"use client";

import { useCallback, useRef } from "react";

export function useTilt<T extends HTMLElement>(maxTilt = 8) {
    const ref = useRef<T>(null);

    const onMouseMove = useCallback(
        (e: React.MouseEvent<T>) => {
            const el = ref.current;
            if (!el) return;

            const { left, top, width, height } = el.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            el.style.setProperty("--rx", `${(0.5 - y / height) * maxTilt * 2}deg`);
            el.style.setProperty("--ry", `${(x / width - 0.5) * maxTilt * 2}deg`);
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y}px`);
        },
        [maxTilt],
    );

    const onMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
    }, []);

    return { ref, onMouseMove, onMouseLeave };
}