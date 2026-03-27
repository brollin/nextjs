/**
 * Deterministic PRNG for procedural content. Same seed → same sequence.
 * Use for mountains now; reuse for other random features later.
 */

/** Mix any numeric seed into a positive 32-bit integer. */
export function hashSeed(seed: number): number {
  const n = Math.floor(seed);
  let h = n | 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Mulberry32 — fast, good enough for visuals. Returns values in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = hashSeed(seed) || 1;
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
