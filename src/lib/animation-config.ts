export type AnimKind = "type" | "pop" | "wipe";

export type AgentConfig = {
  id: string;
  name: string;
  color: string;
  /** Short role hint shown nowhere but useful for debugging/tooling. */
  role: string;
};

export const AGENTS: AgentConfig[] = [
  { id: "scout", name: "Scout", color: "#38bdf8", role: "finds elements" },
  { id: "layout", name: "Layout", color: "#a3e635", role: "places boxes" },
  { id: "typeset", name: "Typeset", color: "#fbbf24", role: "sets type" },
  { id: "motion", name: "Motion", color: "#f472b6", role: "adds motion" },
  { id: "qa", name: "QA", color: "#34d399", role: "checks details" },
  { id: "deploy", name: "Deploy", color: "#fb923c", role: "ships it" },
  { id: "copy", name: "Copy", color: "#c084fc", role: "writes copy" },
  { id: "render", name: "Render", color: "#f87171", role: "paints pixels" },
];

export const CONFIG = {
  desktopAgents: 8,
  mobileAgents: 8,
  mobileQuery: "(max-width: 767px)",
  /** Hard cap on agents building at the same time to prevent screen clutter. */
  maxConcurrent: 4,
  /** Minimum gap between two agents claiming work (keeps the sequence readable). */
  claimStaggerMs: 160,
  selectMs: 260,
  releaseMs: 220,
  moveMin: 280,
  moveMax: 620,
  typeMsPerChar: 12,
  typeMin: 340,
  typeMax: 1100,
  wipeMs: 650,
  popMs: 440,
  storageKey: "kh-agents",
  viewportMargin: 20,
  tour: {
    scrollMin: 1300,
    scrollMax: 2800,
    scrollMsPerPx: 0.8,
    dwellMs: 500,
    sectionTimeoutMs: 16000,
    sections: ["projects", "stack", "experience", "about", "contact"] as const,
  },
};

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Ease-in, steady cruise, ease-out. Position 0..1 for progress 0..1. */
export function trapezoid(t: number, ramp = 0.25) {
  const a = ramp;
  const v = 1 / (1 - a);
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < a) return (v * t * t) / (2 * a);
  if (t <= 1 - a) return v * (a / 2 + (t - a));
  return 1 - (v * (1 - t) * (1 - t)) / (2 * a);
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
