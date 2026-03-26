import Link from "next/link";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VStack, Box, Text, HStack, Button } from "@chakra-ui/react";
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

/** Exponential smoothing for time offset: snappy for scroll; see `OFFSET_SMOOTH_RESET` after “Now”. */
const OFFSET_SMOOTH_FAST = 20;
/** Slower easing when animating back to real time after “Now”. */
const OFFSET_SMOOTH_RESET = 5;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "medium",
  hour12: true,
});

export default function Landing() {
  const [timeOffsetMs, setTimeOffsetMs] = useState(0);
  const [offsetSmoothRate, setOffsetSmoothRate] = useState(OFFSET_SMOOTH_FAST);
  /** Smoothed toward `timeOffsetMs` so wheel/touch steps don’t jitter the sun and clock. */
  const smoothedOffsetMs = useSmoothedFollow(timeOffsetMs, offsetSmoothRate);
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

  /** Disables double-tap zoom on mobile while this page is shown; pinch zoom still works. */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.touchAction;
    const prevBody = body.style.touchAction;
    html.style.touchAction = "manipulation";
    body.style.touchAction = "manipulation";
    return () => {
      html.style.touchAction = prevHtml;
      body.style.touchAction = prevBody;
    };
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

  useEffect(() => {
    if (timeOffsetMs !== 0) {
      setOffsetSmoothRate(OFFSET_SMOOTH_FAST);
    }
  }, [timeOffsetMs]);

  useEffect(() => {
    if (Math.abs(smoothedOffsetMs) < 500 && offsetSmoothRate < OFFSET_SMOOTH_FAST) {
      setOffsetSmoothRate(OFFSET_SMOOTH_FAST);
    }
  }, [smoothedOffsetMs, offsetSmoothRate]);

  const displayedTime = useMemo(
    () => timeFormatter.format(new Date(Date.now() + smoothedOffsetMs)),
    [clockTick, smoothedOffsetMs],
  );

  const isoTime = useMemo(() => new Date(Date.now() + smoothedOffsetMs).toISOString(), [clockTick, smoothedOffsetMs]);

  /** Show reset while shifted or while smoothing back to real time after reset. */
  const showTimeReset = Math.abs(smoothedOffsetMs) > 500;

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
        top={0}
        left={0}
        right={0}
        zIndex={20}
        pointerEvents="none"
        pt={{ base: "max(12px, env(safe-area-inset-top))", md: 4 }}
        pr={{ base: "max(16px, env(safe-area-inset-right))", md: 5 }}
        pl={{ base: "max(16px, env(safe-area-inset-left))", md: 5 }}
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
      >
        <HStack alignItems="flex-start" justifyContent="space-between" w="100%" maxW="100%">
          <HStack pointerEvents="auto" spacing={2} align="stretch">
            <Box
              px={4}
              py={2.5}
              borderRadius="xl"
              bg="rgba(255,255,255,0.78)"
              backdropFilter="blur(10px)"
              boxShadow="md"
              display="flex"
              alignItems="center"
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
            {showTimeReset && (
              <Button
                aria-label="Reset to current time"
                variant="ghost"
                alignSelf="stretch"
                fontSize={{ base: "xs", sm: "sm" }}
                fontWeight="medium"
                color="#1a3a52"
                px={3}
                borderRadius="xl"
                bg="rgba(255,255,255,0.78)"
                backdropFilter="blur(10px)"
                boxShadow="md"
                minH={0}
                h="unset"
                whiteSpace="nowrap"
                _hover={{ bg: "rgba(255,255,255,0.9)" }}
                _active={{ bg: "rgba(255,255,255,0.85)" }}
                onClick={() => {
                  setTimeOffsetMs(0);
                  setOffsetSmoothRate(OFFSET_SMOOTH_RESET);
                }}
              >
                Now
              </Button>
            )}
          </HStack>
          {devPanelVisible && (
            <Box pointerEvents="auto" m={10}>
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
        </HStack>
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
