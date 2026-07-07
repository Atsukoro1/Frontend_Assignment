"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number towards `target` with an ease-out curve. Jumps
 * straight to the target when the user prefers reduced motion.
 */
export function useCountUp(target: number, durationMs = 800): number {
  const [value, setValue] = useState(target);
  const previousTarget = useRef<number | null>(null);

  useEffect(() => {
    const from = previousTarget.current ?? 0;
    previousTarget.current = target;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || from === target) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
