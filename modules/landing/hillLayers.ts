import { mulberry32 } from "./seededRandom";

export type LayerHarmonic = {
  amplitude: number;
  frequency: number;
  phase: number;
};

export type HillSpec = {
  baseline: number;
  harmonics: LayerHarmonic[];
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

export const DEFAULT_HILL_SEED = 42_001;
export const MIN_HILL_SEED = 0;
export const MAX_HILL_SEED = 999_999_999;

/** Sine terms stacked per ridge (1 = single sinusoid). */
export const DEFAULT_HARMONICS_PER_LAYER = 10;
export const MIN_HARMONICS_PER_LAYER = 1;
export const MAX_HARMONICS_PER_LAYER = 30;

/**
 * Each harmonic after the first gets frequency multiplied by this (e.g. 2 ≈ octaves).
 * Higher → more small-scale wiggles along the ridge.
 */
export const DEFAULT_FREQUENCY_SPREAD = 2.1;
export const MIN_FREQUENCY_SPREAD = 1.05;
export const MAX_FREQUENCY_SPREAD = 4;

/**
 * Amplitude multiplier for each successive harmonic (0–1 typical).
 * Lower → smoother silhouettes; higher → bumpier high-frequency detail.
 */
export const DEFAULT_HIGH_FREQ_FALLOFF = 0.52;
export const MIN_HIGH_FREQ_FALLOFF = 0.15;
export const MAX_HIGH_FREQ_FALLOFF = 0.95;

export type CreateHillLayersOptions = {
  layerCount: number;
  /** Master seed — drives all random choices for this terrain. */
  seed: number;
  harmonicsPerLayer: number;
  frequencySpread: number;
  highFrequencyFalloff: number;
};

function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Seeded procedural ridges: each layer is a sum of sinusoids at geometrically spaced frequencies.
 */
export function createHillLayers(options: CreateHillLayersOptions): HillSpec[] {
  const n = clampInt(options.layerCount, MIN_MOUNTAIN_COUNT, MAX_MOUNTAIN_COUNT);
  const harmonicsPerLayer = clampInt(options.harmonicsPerLayer, MIN_HARMONICS_PER_LAYER, MAX_HARMONICS_PER_LAYER);
  const frequencySpread = clamp(options.frequencySpread, MIN_FREQUENCY_SPREAD, MAX_FREQUENCY_SPREAD);
  const highFrequencyFalloff = clamp(options.highFrequencyFalloff, MIN_HIGH_FREQ_FALLOFF, MAX_HIGH_FREQ_FALLOFF);

  const rng = mulberry32(options.seed);
  const minBase = 320;
  const maxBase = 585;
  const layers: HillSpec[] = [];

  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const baseline = minBase + t * (maxBase - minBase) + (rng() - 0.5) * 14;

    const f0 = 0.003 + t * 0.006 + rng() * 0.001;
    const baseAmp = 14 + t * 22 + rng() * 8;

    const harmonics: LayerHarmonic[] = [];
    for (let k = 0; k < harmonicsPerLayer; k++) {
      const freq = f0 * Math.pow(frequencySpread, k);
      const amp = baseAmp * Math.pow(highFrequencyFalloff, k) * (0.65 + 0.7 * rng());
      const phase = rng() * Math.PI * 2;
      harmonics.push({ amplitude: amp, frequency: freq, phase });
    }

    const colorT = n === 1 ? 0 : i / (n - 1);
    const cIdx = Math.round(colorT * (PALETTE.length - 1));
    layers.push({
      baseline,
      harmonics,
      fill: PALETTE[Math.min(PALETTE.length - 1, cIdx)],
    });
  }

  return layers;
}

/** Evaluate ridge height at viewBox x (sum of harmonics). */
export function hillYAt(x: number, baseline: number, harmonics: LayerHarmonic[]): number {
  let s = 0;
  for (const h of harmonics) {
    s += h.amplitude * Math.sin(h.frequency * x + h.phase);
  }
  return baseline + s;
}
