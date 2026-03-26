export type HillSpec = {
  baseline: number;
  amplitude: number;
  frequency: number;
  phase: number;
  fill: string;
};

const PALETTE = [
  "#9EC4E8",
  "#8BB8E2",
  "#7BA8D9",
  "#6B9BD1",
  "#5A8CC4",
  "#4A7AB5",
  "#3D6FA8",
  "#356A9E",
  "#2E5F8F",
  "#2A5580",
];

export const DEFAULT_MOUNTAIN_COUNT = 5;
export const MIN_MOUNTAIN_COUNT = 1;
export const MAX_MOUNTAIN_COUNT = 20;

/** Procedural sinusoidal hill stacks: back (light) → front (dark). */
export function createHillLayers(count: number): HillSpec[] {
  const n = Math.min(MAX_MOUNTAIN_COUNT, Math.max(MIN_MOUNTAIN_COUNT, Math.round(count)));
  const minBase = 320;
  const maxBase = 585;
  const layers: HillSpec[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const baseline = minBase + t * (maxBase - minBase);
    const amplitude = 20 + t * 24 + (i % 3) * 2;
    const frequency = 0.0048 + t * 0.005 + (i % 2) * 0.0004;
    const phase = 0.35 + i * 0.58 + (i % 4) * 0.12;
    const colorT = n === 1 ? 0 : i / (n - 1);
    const cIdx = Math.round(colorT * (PALETTE.length - 1));
    layers.push({
      baseline,
      amplitude,
      frequency,
      phase,
      fill: PALETTE[Math.min(PALETTE.length - 1, cIdx)],
    });
  }
  return layers;
}
