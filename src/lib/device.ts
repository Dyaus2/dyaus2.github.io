import type { Tier } from "./store";

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const finePointer = (): boolean =>
  typeof window !== "undefined" && !!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

export function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Rough GPU budget guess; refined at runtime by PerformanceMonitor. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "mid";
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  if (prefersReducedMotion()) return "low";
  if (mobile) return cores >= 8 ? "mid" : "low";
  return cores >= 8 ? "high" : "mid";
}

export const budgets = {
  low: { stars: 1200, nodes: 160, pulses: 40, clusterNodes: 36, avatar: 900, bloom: false, dpr: [1, 1.25] as [number, number] },
  mid: { stars: 2600, nodes: 320, pulses: 90, clusterNodes: 60, avatar: 1600, bloom: true, dpr: [1, 1.5] as [number, number] },
  high: { stars: 4500, nodes: 520, pulses: 160, clusterNodes: 90, avatar: 2600, bloom: true, dpr: [1, 2] as [number, number] },
};
export type Budget = (typeof budgets)[Tier];
