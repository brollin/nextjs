import Link from "next/link";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import { MdConstruction } from "react-icons/md";
import LandscapeBackground from "./LandscapeBackground";
import { useSmoothedFollow } from "./useSmoothedFollow";
import DevPanel from "./DevPanel";
import { DEV_SHOW_DEV_UI_INIT } from "./devConstants";
import {
  DEFAULT_FREQUENCY_SPREAD,
  DEFAULT_HARMONICS_PER_LAYER,
  DEFAULT_HIGH_FREQ_FALLOFF,
  DEFAULT_HILL_SEED,
  DEFAULT_MOUNTAIN_COUNT,
  MAX_FREQUENCY_SPREAD,
  MAX_HARMONICS_PER_LAYER,
  MAX_HIGH_FREQ_FALLOFF,
  MAX_HILL_SEED,
  MAX_MOUNTAIN_COUNT,
  MIN_FREQUENCY_SPREAD,
  MIN_HARMONICS_PER_LAYER,
  MIN_HIGH_FREQ_FALLOFF,
  MIN_HILL_SEED,
  MIN_MOUNTAIN_COUNT,
} from "./hillLayers";

/** Wheel / touch movement → simulated time shift (ms per pixel of delta). */
const WHEEL_MS_PER_DELTA = 7200;
const TOUCH_MS_PER_PX = 11200;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "medium",
  hour12: true,
});

export default function Landing() {
  const [timeOffsetMs, setTimeOffsetMs] = useState(0);
  /** Smoothed toward `timeOffsetMs` so wheel/touch steps don’t jitter the sun and clock. */
  const smoothedOffsetMs = useSmoothedFollow(timeOffsetMs);
  /** Bumps once per second so the clock label tracks real time while offset is fixed. */
  const [clockTick, setClockTick] = useState(0);

  const [devPanelVisible, setDevPanelVisible] = useState(DEV_SHOW_DEV_UI_INIT);
  const [mountainCount, setMountainCount] = useState(DEFAULT_MOUNTAIN_COUNT);
  const [hillSeed, setHillSeed] = useState(DEFAULT_HILL_SEED);
  const [harmonicsPerLayer, setHarmonicsPerLayer] = useState(DEFAULT_HARMONICS_PER_LAYER);
  const [frequencySpread, setFrequencySpread] = useState(DEFAULT_FREQUENCY_SPREAD);
  const [highFrequencyFalloff, setHighFrequencyFalloff] = useState(DEFAULT_HIGH_FREQ_FALLOFF);

  const toggleDevPanel = useCallback(() => {
    setDevPanelVisible((v) => !v);
  }, []);

  const clampMountainCount = useCallback((v: number) => {
    return Math.min(MAX_MOUNTAIN_COUNT, Math.max(MIN_MOUNTAIN_COUNT, Math.round(v)));
  }, []);

  const clampHillSeed = useCallback((v: number) => {
    return Math.min(MAX_HILL_SEED, Math.max(MIN_HILL_SEED, Math.round(v)));
  }, []);

  const clampHarmonicsPerLayer = useCallback((v: number) => {
    return Math.min(MAX_HARMONICS_PER_LAYER, Math.max(MIN_HARMONICS_PER_LAYER, Math.round(v)));
  }, []);

  const clampFrequencySpread = useCallback((v: number) => {
    return Math.min(MAX_FREQUENCY_SPREAD, Math.max(MIN_FREQUENCY_SPREAD, v));
  }, []);

  const clampHighFrequencyFalloff = useCallback((v: number) => {
    return Math.min(MAX_HIGH_FREQ_FALLOFF, Math.max(MIN_HIGH_FREQ_FALLOFF, v));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setClockTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const applyScrollDeltaToTime = useCallback((deltaY: number) => {
    if (deltaY === 0) return;
    setTimeOffsetMs((o) => o + deltaY * WHEEL_MS_PER_DELTA);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      applyScrollDeltaToTime(e.deltaY);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [applyScrollDeltaToTime]);

  useEffect(() => {
    let lastY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (lastY == null) return;
      const y = e.touches[0].clientY;
      const dy = y - lastY;
      lastY = y;
      if (dy === 0) return;
      setTimeOffsetMs((o) => o + dy * TOUCH_MS_PER_PX);
    };
    const onTouchEnd = () => {
      lastY = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  const displayedTime = useMemo(
    () => timeFormatter.format(new Date(Date.now() + smoothedOffsetMs)),
    [clockTick, smoothedOffsetMs],
  );

  const isoTime = useMemo(
    () => new Date(Date.now() + smoothedOffsetMs).toISOString(),
    [clockTick, smoothedOffsetMs],
  );

  return (
    <>
      <Head>
        <title>beep boop</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <LandscapeBackground
        timeOffsetMs={smoothedOffsetMs}
        mountainCount={mountainCount}
        hillSeed={hillSeed}
        harmonicsPerLayer={harmonicsPerLayer}
        frequencySpread={frequencySpread}
        highFrequencyFalloff={highFrequencyFalloff}
        onBackgroundDoubleActivate={toggleDevPanel}
      />
      <Box
        position="fixed"
        top={{ base: "max(12px, env(safe-area-inset-top))", md: 4 }}
        right={{ base: "max(12px, env(safe-area-inset-right))", md: 4 }}
        zIndex={20}
        pointerEvents="none"
      >
        <VStack align="flex-end" spacing={2}>
          <Box
            pointerEvents="none"
            px={3}
            py={2}
            borderRadius="md"
            bg="rgba(255,255,255,0.72)"
            backdropFilter="blur(10px)"
            boxShadow="sm"
          >
            <Text
              as="time"
              dateTime={isoTime}
              suppressHydrationWarning
              fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              fontSize={{ base: "xs", sm: "sm" }}
              fontWeight="medium"
              color="#1a3a52"
              letterSpacing="0.02em"
            >
              {displayedTime}
            </Text>
          </Box>
          {devPanelVisible && (
            <Box pointerEvents="auto">
              <DevPanel
                mountainCount={mountainCount}
                onMountainCountChange={(v) => setMountainCount(clampMountainCount(v))}
                hillSeed={hillSeed}
                onHillSeedChange={(v) => setHillSeed(clampHillSeed(v))}
                harmonicsPerLayer={harmonicsPerLayer}
                onHarmonicsPerLayerChange={(v) => setHarmonicsPerLayer(clampHarmonicsPerLayer(v))}
                frequencySpread={frequencySpread}
                onFrequencySpreadChange={(v) => setFrequencySpread(clampFrequencySpread(v))}
                highFrequencyFalloff={highFrequencyFalloff}
                onHighFrequencyFalloffChange={(v) => setHighFrequencyFalloff(clampHighFrequencyFalloff(v))}
              />
            </Box>
          )}
        </VStack>
      </Box>
      <Box
        as="main"
        position="relative"
        zIndex={1}
        minH="100vh"
        w="100vw"
        overflowX="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, sm: 6 }}
        py={{ base: 8, sm: 10 }}
        pb={{ base: "max(2rem, env(safe-area-inset-bottom))", sm: 10 }}
        pt={{ base: "max(1rem, env(safe-area-inset-top))", sm: 10 }}
        pointerEvents="none"
      >
        <VStack spacing={6} width="100%" maxW="md" align="center" pointerEvents="auto">
          <MdConstruction size={120} color="#1a3a52" aria-hidden />
          <VStack spacing={3} width="100%" align="center">
            <Link href="/capitalizer">capitalizer</Link>
            <Link href="/planets">planets</Link>
            <Link href="/health">health</Link>
            <Link href="/sandbox">sandbox</Link>
            <Link href="/chess">chess</Link>
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
