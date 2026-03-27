import chroma from "chroma-js";
import SunCalc from "suncalc";

const RAD_TO_DEG = 180 / Math.PI;

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/** Smooth Hermite step from edge0 to edge1. */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Solar altitude in degrees (SunCalc altitude is radians). */
export function solarAltitudeDeg(when: Date, lat: number, lng: number): number {
  const { altitude } = SunCalc.getPosition(when, lat, lng);
  return altitude * RAD_TO_DEG;
}

/** Sky gradient stops: top → mid → horizon (bottom). */
export function skyColorsForAltitude(altDeg: number): [string, string, string] {
  const nightTop = "#030308";
  const nightMid = "#0a101c";
  const nightBot = "#121a2a";

  const dawnTop = "#3d4a68";
  const dawnMid = "#c87852";
  const dawnBot = "#f0a070";

  const dayTop = "#B8D9F5";
  const dayMid = "#8FC0EA";
  const dayBot = "#6BA6D9";

  const top =
    altDeg < -6
      ? chroma.mix(nightTop, dawnTop, smoothstep(-22, -6, altDeg)).hex()
      : chroma.mix(dawnTop, dayTop, smoothstep(-6, 28, altDeg)).hex();

  const mid =
    altDeg < -6
      ? chroma.mix(nightMid, dawnMid, smoothstep(-22, -6, altDeg)).hex()
      : chroma.mix(dawnMid, dayMid, smoothstep(-6, 28, altDeg)).hex();

  const bot =
    altDeg < -6
      ? chroma.mix(nightBot, dawnBot, smoothstep(-22, -6, altDeg)).hex()
      : chroma.mix(dawnBot, dayBot, smoothstep(-6, 28, altDeg)).hex();

  return [top, mid, bot];
}

/** Sun disc fill and stroke. */
export function sunDiscColors(altDeg: number): { fill: string; stroke: string } {
  if (altDeg < -8) {
    return { fill: "#3a3a45", stroke: "#2a2a32" };
  }
  if (altDeg < 8) {
    const t = smoothstep(-8, 8, altDeg);
    return {
      fill: chroma.mix("#ff7a2e", "#fff8e8", t).hex(),
      stroke: chroma.mix("#c45a20", "#f5e6b8", t).hex(),
    };
  }
  return { fill: "#FFF8E8", stroke: "#F5E6B8" };
}

/** Radial glow stops (center → mid → edge). */
export function sunGlowStops(altDeg: number): [string, string, string] {
  if (altDeg < -8) {
    return [
      "rgba(120, 130, 160, 0.25)",
      "rgba(60, 70, 100, 0.08)",
      "rgba(20, 25, 40, 0)",
    ];
  }
  if (altDeg < 6) {
    const t = smoothstep(-8, 6, altDeg);
    return [
      chroma.mix("rgba(255, 120, 60, 0.85)", "rgba(255, 248, 220, 0.95)", t).css(),
      chroma.mix("rgba(255, 160, 90, 0.4)", "rgba(255, 230, 160, 0.35)", t).css(),
      chroma.mix("rgba(255, 140, 80, 0)", "rgba(255, 220, 140, 0)", t).css(),
    ];
  }
  return [
    "rgba(255, 248, 220, 0.95)",
    "rgba(255, 230, 160, 0.35)",
    "rgba(255, 220, 140, 0)",
  ];
}

/** How much to mix hill base color toward night (0 = day, 1 = deep night). */
export function mountainNightMix(altDeg: number): number {
  return 1 - smoothstep(-18, -6, altDeg);
}

/** Tint a mountain layer hex for current altitude. */
export function tintMountainFill(baseHex: string, altDeg: number): string {
  const n = mountainNightMix(altDeg);
  if (n < 0.02) return baseHex;
  const nightSilhouette = "#080c14";
  return chroma.mix(baseHex, nightSilhouette, n * 0.82).hex();
}

/** Opacity for sun group when sun is far below horizon (still drawn for continuity). */
export function sunGroupOpacity(altDeg: number): number {
  if (altDeg >= -4) return 1;
  return 0.2 + 0.8 * smoothstep(-14, -4, altDeg);
}
