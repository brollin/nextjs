import {
  memo,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
  type MutableRefObject,
  type RefObject,
} from "react";
import { Box } from "@chakra-ui/react";
import SunCalc from "suncalc";
import {
  createHillLayers,
  DEFAULT_FREQUENCY_SPREAD,
  DEFAULT_HARMONICS_PER_LAYER,
  DEFAULT_HIGH_FREQ_FALLOFF,
  DEFAULT_HILL_SEED,
  DEFAULT_MOUNTAIN_COUNT,
  hillYAt,
  type LayerHarmonic,
} from "./hillLayers";
import { DEFAULT_OBSERVER_LAT, DEFAULT_OBSERVER_LNG } from "./observerCities";
import { skyColorsForAltitude } from "./landscapeAmbient";

const RAD_TO_DEG = 180 / Math.PI;

const VB = { w: 1200, h: 800 };

/** Visual horizon in viewBox space (y grows downward). Sun at altitude 0 sits here. */
const HORIZON_Y = 392;

const SUN_RADIUS = 32;
const SUN_GLOW_RADIUS = 52;

function buildHillPath(
  width: number,
  height: number,
  baseline: number,
  harmonics: LayerHarmonic[],
  steps = 180,
): string {
  const y0 = hillYAt(0, baseline, harmonics);
  let d = `M 0 ${height + 1} L 0 ${y0}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = hillYAt(x, baseline, harmonics);
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += ` L ${width} ${height + 1} Z`;
  return d;
}

/**
 * Visible portion of the viewBox when the SVG uses `preserveAspectRatio="xMidYMid slice"`.
 * Narrow / tall viewports crop the sides; wide / short ones crop top and bottom.
 */
function getVisibleViewBoxSlice(
  viewportW: number,
  viewportH: number,
  vbW: number,
  vbH: number,
): { xMin: number; xMax: number } {
  const scale = Math.max(viewportW / vbW, viewportH / vbH);
  let xMin = 0;
  let xMax = vbW;
  if (vbW * scale > viewportW) {
    const visibleW = viewportW / scale;
    xMin = vbW / 2 - visibleW / 2;
    xMax = vbW / 2 + visibleW / 2;
  }
  return { xMin, xMax };
}

function getSunriseSunsetAzimuth(
  day: Date,
  lat: number,
  lng: number,
): { azSunrise: number; azSunset: number } | null {
  const times = SunCalc.getTimes(day, lat, lng);
  if (Number.isNaN(times.sunrise.getTime()) || Number.isNaN(times.sunset.getTime())) {
    return null;
  }
  const azSunrise = SunCalc.getPosition(times.sunrise, lat, lng).azimuth;
  const azSunset = SunCalc.getPosition(times.sunset, lat, lng).azimuth;
  return { azSunrise, azSunset };
}

/**
 * Map azimuth to the visible horizontal band: sunrise azimuth → left edge, sunset → right edge.
 * If `riseSet` is null, uses the legacy sine mapping and clamps to the visible band.
 */
function azimuthToX(
  azimuth: number,
  vbW: number,
  xMin: number,
  xMax: number,
  riseSet: { azSunrise: number; azSunset: number } | null,
): number {
  const pad = SUN_RADIUS + 6;
  let left = xMin + pad;
  let right = xMax - pad;
  if (right <= left) {
    left = (xMin + xMax) / 2;
    right = left;
  }

  if (riseSet == null || Math.abs(riseSet.azSunset - riseSet.azSunrise) < 1e-6) {
    const margin = 72;
    const raw = vbW * 0.5 + (vbW * 0.5 - margin) * Math.sin(azimuth);
    return Math.min(Math.max(raw, left), right);
  }
  const t = (azimuth - riseSet.azSunrise) / (riseSet.azSunset - riseSet.azSunrise);
  return left + t * (right - left);
}

/** Altitude: radians above horizon. Maps to viewBox y (smaller y = higher in sky). */
function altitudeToY(altitude: number, height: number): number {
  const vertScale = (height * 0.44) / (Math.PI / 2);
  return HORIZON_Y - altitude * vertScale;
}

type SkyStopRefs = [
  RefObject<SVGStopElement | null>,
  RefObject<SVGStopElement | null>,
  RefObject<SVGStopElement | null>,
];

/**
 * Quantized key for sky gradient updates. Near the horizon, colors change steeply per degree — coarse
 * buckets + throttle reduce full-screen gradient repaints.
 */
function ambientBucket(altDeg: number): number {
  const a = Math.abs(altDeg);
  const t = Math.min(1, Math.max(0, (a - 6) / 26));
  const scale = 0.42 + t * 1.58;
  return Math.round(altDeg * scale);
}

/** Sun transform every frame; sky gradient stops when bucket changes (and throttle allows). */
function useLandscapeFrame(
  sunGroupRef: RefObject<SVGGElement | null>,
  skyStopRefs: SkyStopRefs,
  lat: number,
  lng: number,
  timeOffsetRef: MutableRefObject<number>,
) {
  const rafRef = useRef(0);
  const riseSetCacheRef = useRef<{ key: string; value: ReturnType<typeof getSunriseSunsetAzimuth> } | null>(
    null,
  );
  const lastAmbientBucketRef = useRef<number | null>(null);
  /** Caps how often we touch gradient stops (full-screen sky repaint) even if the bucket flips rapidly. */
  const lastAmbientAtRef = useRef(0);

  const viewportRef = useRef({ w: 1200, h: 800 });
  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport;
      if (vv) {
        viewportRef.current = { w: vv.width, h: vv.height };
      } else {
        viewportRef.current = { w: window.innerWidth, h: window.innerHeight };
      }
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    if (typeof window.visualViewport !== "undefined") {
      window.visualViewport.addEventListener("resize", update);
      window.visualViewport.addEventListener("scroll", update);
    }
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      if (typeof window.visualViewport !== "undefined") {
        window.visualViewport.removeEventListener("resize", update);
        window.visualViewport.removeEventListener("scroll", update);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const apply = () => {
      const when = new Date(Date.now() + timeOffsetRef.current);
      const { w: vw, h: vh } = viewportRef.current;
      const { xMin, xMax } = getVisibleViewBoxSlice(vw, vh, VB.w, VB.h);

      const dayKey = `${when.getFullYear()}-${when.getMonth()}-${when.getDate()}-${lat}-${lng}`;
      let riseSet: ReturnType<typeof getSunriseSunsetAzimuth>;
      const cached = riseSetCacheRef.current;
      if (cached?.key === dayKey) {
        riseSet = cached.value;
      } else {
        riseSet = getSunriseSunsetAzimuth(when, lat, lng);
        riseSetCacheRef.current = { key: dayKey, value: riseSet };
      }

      const { azimuth, altitude } = SunCalc.getPosition(when, lat, lng);
      const altDeg = altitude * RAD_TO_DEG;
      const cx = azimuthToX(azimuth, VB.w, xMin, xMax, riseSet);
      const cy = altitudeToY(altitude, VB.h);

      const sunG = sunGroupRef.current;
      if (sunG) {
        sunG.setAttribute("transform", `translate(${cx}, ${cy})`);
      }

      const amb = ambientBucket(altDeg);
      const nowMs = performance.now();
      const bucketChanged = amb !== lastAmbientBucketRef.current;
      const throttleOk =
        lastAmbientBucketRef.current === null || nowMs - lastAmbientAtRef.current >= 85;
      if (bucketChanged && throttleOk) {
        lastAmbientBucketRef.current = amb;
        lastAmbientAtRef.current = nowMs;
        const [s0, s1, s2] = skyColorsForAltitude(altDeg);
        skyStopRefs[0].current?.setAttribute("stop-color", s0);
        skyStopRefs[1].current?.setAttribute("stop-color", s1);
        skyStopRefs[2].current?.setAttribute("stop-color", s2);
      }
    };

    const tick = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      apply();
      rafRef.current = requestAnimationFrame(tick);
    };
    lastAmbientBucketRef.current = null;
    lastAmbientAtRef.current = 0;
    apply();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [lat, lng]);
}

type LandscapeBackgroundProps = {
  /** Smoothed time offset (ms) — read imperatively each frame so the component need not re-render when time animates. */
  timeOffsetRef: MutableRefObject<number>;
  /** Observer latitude ° (SunCalc). */
  observerLat?: number;
  /** Observer longitude ° (SunCalc). */
  observerLng?: number;
  mountainCount?: number;
  /** Procedural terrain seed (also reserved for future random features). */
  hillSeed?: number;
  harmonicsPerLayer?: number;
  frequencySpread?: number;
  highFrequencyFalloff?: number;
};

function LandscapeBackground({
  timeOffsetRef,
  observerLat = DEFAULT_OBSERVER_LAT,
  observerLng = DEFAULT_OBSERVER_LNG,
  mountainCount = DEFAULT_MOUNTAIN_COUNT,
  hillSeed = DEFAULT_HILL_SEED,
  harmonicsPerLayer = DEFAULT_HARMONICS_PER_LAYER,
  frequencySpread = DEFAULT_FREQUENCY_SPREAD,
  highFrequencyFalloff = DEFAULT_HIGH_FREQ_FALLOFF,
}: LandscapeBackgroundProps) {
  const sunGroupRef = useRef<SVGGElement | null>(null);
  const skyStop0Ref = useRef<SVGStopElement | null>(null);
  const skyStop1Ref = useRef<SVGStopElement | null>(null);
  const skyStop2Ref = useRef<SVGStopElement | null>(null);

  const hillLayers = useMemo(
    () =>
      createHillLayers({
        layerCount: mountainCount,
        seed: hillSeed,
        harmonicsPerLayer,
        frequencySpread,
        highFrequencyFalloff,
      }),
    [mountainCount, hillSeed, harmonicsPerLayer, frequencySpread, highFrequencyFalloff],
  );

  const paths = useMemo(
    () => hillLayers.map((layer) => buildHillPath(VB.w, VB.h, layer.baseline, layer.harmonics)),
    [hillLayers],
  );

  useLandscapeFrame(
    sunGroupRef,
    [skyStop0Ref, skyStop1Ref, skyStop2Ref],
    observerLat,
    observerLng,
    timeOffsetRef,
  );

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={0}
      pointerEvents="auto"
      overflow="hidden"
      sx={{ contain: "paint" }}
    >
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ minHeight: "100vh", display: "block" }}
        aria-hidden
      >
        <defs>
          <linearGradient id="landing-sky" x1="0" y1="0" x2="0" y2="1">
            <stop ref={skyStop0Ref} offset="0%" stopColor="#B8D9F5" />
            <stop ref={skyStop1Ref} offset="45%" stopColor="#8FC0EA" />
            <stop ref={skyStop2Ref} offset="100%" stopColor="#6BA6D9" />
          </linearGradient>
          <radialGradient id="landing-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 248, 220, 0.95)" />
            <stop offset="45%" stopColor="rgba(255, 230, 160, 0.35)" />
            <stop offset="100%" stopColor="rgba(255, 220, 140, 0)" />
          </radialGradient>
          <filter id="landing-sun-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#landing-sky)" />
        <g
          ref={sunGroupRef}
          transform="translate(0,0)"
          style={{ willChange: "transform" }}
        >
          <circle
            cx={0}
            cy={0}
            r={SUN_GLOW_RADIUS}
            fill="url(#landing-sun-glow)"
            filter="url(#landing-sun-blur)"
          />
          <circle cx={0} cy={0} r={SUN_RADIUS} fill="#FFF8E8" stroke="#F5E6B8" strokeWidth="1.5" />
        </g>
        {hillLayers.map((layer, i) => (
          <path
            key={`${hillSeed}-${mountainCount}-${harmonicsPerLayer}-${i}`}
            d={paths[i]}
            fill={layer.fill}
            shapeRendering="optimizeSpeed"
          />
        ))}
      </svg>
    </Box>
  );
}

export default memo(LandscapeBackground);
