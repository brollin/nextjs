import NextLink from "next/link";
import Head from "next/head";
import { keyframes } from "@emotion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VStack, Box, Text, HStack, IconButton, Heading, Center } from "@chakra-ui/react";
import { IoSettingsOutline } from "react-icons/io5";
import { FiClock, FiSunrise, FiSunset } from "react-icons/fi";
import LandscapeBackground from "./LandscapeBackground";
import { useSmoothedFollow } from "./useSmoothedFollow";
import DevPanel from "./DevPanel";
import { DEV_SHOW_DEV_UI_INIT } from "./devConstants";
import {
  DEFAULT_FREQUENCY_SPREAD,
  DEFAULT_HARMONICS_PER_LAYER,
  DEFAULT_HIGH_FREQ_FALLOFF,
  DEFAULT_HILL_SEED,
  DEFAULT_HILL_Y_OFFSET,
  DEFAULT_MOUNTAIN_COUNT,
  MAX_FREQUENCY_SPREAD,
  MAX_HARMONICS_PER_LAYER,
  MAX_HIGH_FREQ_FALLOFF,
  MAX_HILL_SEED,
  MAX_HILL_Y_OFFSET,
  MAX_MOUNTAIN_COUNT,
  MIN_FREQUENCY_SPREAD,
  MIN_HARMONICS_PER_LAYER,
  MIN_HIGH_FREQ_FALLOFF,
  MIN_HILL_SEED,
  MIN_HILL_Y_OFFSET,
  MIN_MOUNTAIN_COUNT,
} from "./hillLayers";
import SunCalc from "suncalc";
import {
  DEFAULT_OBSERVER_CITY_ID,
  getObserverCoords,
  getObserverTimeZone,
  type ObserverCityId,
} from "./observerCities";

/** Wheel / touch movement → simulated time shift (ms per pixel of delta). */
const WHEEL_MS_PER_DELTA = 10000;
const TOUCH_MS_PER_PX = 89600;

/** Exponential smoothing for time offset: snappy for scroll; see `OFFSET_SMOOTH_RESET` after “Now”. */
const OFFSET_SMOOTH_FAST = 20;
/** Slower easing when animating back to real time after “Now”. */
const OFFSET_SMOOTH_RESET = 5;
/** Gentler rate for sunrise / sunset preset jumps so the sun glides to the event. */
const OFFSET_SMOOTH_PRESET = 3;

/** Next sunrise or sunset strictly after `virtualNowMs` (epoch ms). */
function msOffsetForNextSunEvent(
  event: "sunrise" | "sunset",
  virtualNowMs: number,
  lat: number,
  lng: number,
): number | null {
  const day = new Date(virtualNowMs);
  for (let i = 0; i < 370; i++) {
    const times = SunCalc.getTimes(day, lat, lng);
    const ev = event === "sunrise" ? times.sunrise : times.sunset;
    if (Number.isNaN(ev.getTime())) {
      day.setDate(day.getDate() + 1);
      continue;
    }
    if (ev.getTime() > virtualNowMs + 200) {
      return ev.getTime() - Date.now();
    }
    day.setDate(day.getDate() + 1);
  }
  return null;
}

const devGearKeyframes = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const NAV_LINKS = [
  { href: "/capitalizer", label: "capitalizer" },
  { href: "/planets", label: "planets" },
  { href: "/health", label: "health" },
  { href: "/sandbox", label: "sandbox" },
  { href: "/chess", label: "chess" },
] as const;

export default function Landing() {
  const [timeOffsetMs, setTimeOffsetMs] = useState(0);
  const [offsetSmoothRate, setOffsetSmoothRate] = useState(OFFSET_SMOOTH_FAST);
  /** Imperative mirror of smoothed offset — LandscapeBackground reads this in rAF without re-rendering. */
  const timeOffsetRef = useRef(0);
  /** Smoothed toward `timeOffsetMs` so wheel/touch steps don’t jitter the sun and clock. */
  const smoothedOffsetMs = useSmoothedFollow(timeOffsetMs, offsetSmoothRate, timeOffsetRef);
  const smoothedOffsetForPresetsRef = useRef(smoothedOffsetMs);
  smoothedOffsetForPresetsRef.current = smoothedOffsetMs;
  const [clientTimeReady, setClientTimeReady] = useState(false);
  useEffect(() => {
    setClientTimeReady(true);
  }, []);
  /** Bumps once per second so the clock label tracks real time while offset is fixed. */
  const [clockTick, setClockTick] = useState(0);

  /** Hides “Now” as soon as it’s clicked; cleared when offset is synced or user scrolls time again. */
  const [nowButtonSuppressed, setNowButtonSuppressed] = useState(false);

  const [devPanelVisible, setDevPanelVisible] = useState(DEV_SHOW_DEV_UI_INIT);
  /** Ignore sun time drags when interacting with the scrollable dev panel (`stopPropagation` does not affect window-level touch listeners). */
  const devPanelContainerRef = useRef<HTMLDivElement | null>(null);
  const touchTimeDragGestureStartedInDevPanelRef = useRef(false);
  const [observerCityId, setObserverCityId] = useState<ObserverCityId>(DEFAULT_OBSERVER_CITY_ID);
  const [mountainCount, setMountainCount] = useState(DEFAULT_MOUNTAIN_COUNT);
  const [hillSeed, setHillSeed] = useState(DEFAULT_HILL_SEED);
  const [harmonicsPerLayer, setHarmonicsPerLayer] = useState(DEFAULT_HARMONICS_PER_LAYER);
  const [frequencySpread, setFrequencySpread] = useState(DEFAULT_FREQUENCY_SPREAD);
  const [highFrequencyFalloff, setHighFrequencyFalloff] = useState(DEFAULT_HIGH_FREQ_FALLOFF);
  const [hillYOffset, setHillYOffset] = useState(DEFAULT_HILL_Y_OFFSET);

  const toggleDevPanel = useCallback(() => {
    setDevPanelVisible((v) => !v);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select") || el?.closest('[contenteditable="true"]')) {
        return;
      }
      if (e.key !== "d" && e.key !== "D") return;
      e.preventDefault();
      toggleDevPanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleDevPanel]);

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

  const clampHillYOffset = useCallback((v: number) => {
    return Math.min(MAX_HILL_Y_OFFSET, Math.max(MIN_HILL_Y_OFFSET, Math.round(v)));
  }, []);

  const { lat: observerLat, lng: observerLng } = useMemo(() => getObserverCoords(observerCityId), [observerCityId]);

  const observerTimeZone = useMemo(() => getObserverTimeZone(observerCityId), [observerCityId]);

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        timeStyle: "medium",
        hour12: true,
        timeZone: observerTimeZone,
      }),
    [observerTimeZone],
  );

  useEffect(() => {
    const id = window.setInterval(() => setClockTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  /**
   * Mobile: `touch-action: manipulation` avoids double-tap zoom (pinch still works).
   * `overscroll-behavior-y: none` reduces pull-to-refresh / rubber-band at scroll edges.
   */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlTouch = html.style.touchAction;
    const prevBodyTouch = body.style.touchAction;
    const prevHtmlOver = html.style.overscrollBehaviorY;
    const prevBodyOver = body.style.overscrollBehaviorY;
    html.style.touchAction = "manipulation";
    body.style.touchAction = "manipulation";
    html.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";
    return () => {
      html.style.touchAction = prevHtmlTouch;
      body.style.touchAction = prevBodyTouch;
      html.style.overscrollBehaviorY = prevHtmlOver;
      body.style.overscrollBehaviorY = prevBodyOver;
    };
  }, []);

  const applyScrollDeltaToTime = useCallback((deltaY: number) => {
    if (deltaY === 0) return;
    setOffsetSmoothRate(OFFSET_SMOOTH_FAST);
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
      const panelEl = devPanelContainerRef.current;
      const inDevPanel = !!(panelEl && e.target instanceof Node && panelEl.contains(e.target));
      touchTimeDragGestureStartedInDevPanelRef.current = inDevPanel;
      if (inDevPanel) {
        lastY = null;
        return;
      }
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchTimeDragGestureStartedInDevPanelRef.current || lastY == null) return;
      const y = e.touches[0].clientY;
      const dy = y - lastY;
      lastY = y;
      if (dy === 0) return;
      setOffsetSmoothRate(OFFSET_SMOOTH_FAST);
      setTimeOffsetMs((o) => o + dy * TOUCH_MS_PER_PX);
    };
    const onTouchEnd = () => {
      touchTimeDragGestureStartedInDevPanelRef.current = false;
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
      setNowButtonSuppressed(false);
    }
  }, [timeOffsetMs]);

  const jumpToNextSunEvent = useCallback(
    (event: "sunrise" | "sunset") => {
      const virtualNowMs = Date.now() + smoothedOffsetForPresetsRef.current;
      const next = msOffsetForNextSunEvent(event, virtualNowMs, observerLat, observerLng);
      if (next == null) return;
      setOffsetSmoothRate(OFFSET_SMOOTH_PRESET);
      setTimeOffsetMs(next);
    },
    [observerLat, observerLng],
  );

  /** Recompute only when smoothed time crosses ~3 min buckets (avoids SunCalc loops every rAF). */
  const sunPresetAvailKey = Math.floor(smoothedOffsetMs / 180_000);
  const sunPresetAvailability = useMemo(() => {
    if (!clientTimeReady) {
      return { sunrise: true, sunset: true };
    }
    const virtualNowMs = Date.now() + smoothedOffsetForPresetsRef.current;
    return {
      sunrise: msOffsetForNextSunEvent("sunrise", virtualNowMs, observerLat, observerLng) != null,
      sunset: msOffsetForNextSunEvent("sunset", virtualNowMs, observerLat, observerLng) != null,
    };
  }, [clientTimeReady, observerLat, observerLng, sunPresetAvailKey]);

  useEffect(() => {
    if (Math.abs(smoothedOffsetMs) < 500) {
      setNowButtonSuppressed(false);
    }
  }, [smoothedOffsetMs]);

  useEffect(() => {
    if (Math.abs(smoothedOffsetMs) < 500 && offsetSmoothRate < OFFSET_SMOOTH_FAST) {
      setOffsetSmoothRate(OFFSET_SMOOTH_FAST);
    }
  }, [smoothedOffsetMs, offsetSmoothRate]);

  const displayedTime = useMemo(
    () => timeFormatter.format(new Date(Date.now() + smoothedOffsetMs)),
    [clockTick, smoothedOffsetMs, timeFormatter],
  );

  const isoTime = useMemo(() => new Date(Date.now() + smoothedOffsetMs).toISOString(), [clockTick, smoothedOffsetMs]);

  const showTimeReset = Math.abs(smoothedOffsetMs) > 500 && !nowButtonSuppressed;

  return (
    <>
      <Head>
        <title>beep boop</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <LandscapeBackground
        timeOffsetRef={timeOffsetRef}
        observerLat={observerLat}
        observerLng={observerLng}
        mountainCount={mountainCount}
        hillSeed={hillSeed}
        harmonicsPerLayer={harmonicsPerLayer}
        frequencySpread={frequencySpread}
        highFrequencyFalloff={highFrequencyFalloff}
        hillYOffset={hillYOffset}
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
          <HStack pointerEvents="auto" spacing={2} align="flex-start">
            <VStack spacing={0.5} align="stretch">
              <Box
                px={4}
                py={2.5}
                borderRadius="xl"
                bg="rgba(248, 250, 252, 0.88)"
                borderWidth="1px"
                borderColor="rgba(26, 58, 82, 0.14)"
                backdropFilter="blur(8px)"
                boxShadow="none"
                display="flex"
                alignItems="center"
                pointerEvents="none"
                cursor="default"
                userSelect="none"
              >
                <Text
                  as="time"
                  dateTime={isoTime}
                  suppressHydrationWarning
                  fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                  fontSize={{ base: "xs", sm: "sm" }}
                  fontWeight="medium"
                  color="rgba(26, 58, 82, 0.88)"
                  letterSpacing="0.02em"
                >
                  {displayedTime}
                </Text>
              </Box>
              <Center w="100%">
                <HStack spacing={1}>
                  <IconButton
                    type="button"
                    aria-label="Jump to next sunrise"
                    icon={<FiSunrise size={18} strokeWidth={1.85} />}
                    size="sm"
                    variant="ghost"
                    borderRadius="md"
                    borderWidth={0}
                    minW="32px"
                    h="32px"
                    color="rgba(255, 255, 255, 0.78)"
                    isDisabled={!sunPresetAvailability.sunrise}
                    _hover={{ bg: sunPresetAvailability.sunrise ? "rgba(255,255,255,0.65)" : undefined }}
                    _active={{ bg: sunPresetAvailability.sunrise ? "rgba(255,255,255,0.5)" : undefined }}
                    onClick={() => jumpToNextSunEvent("sunrise")}
                    boxShadow="none"
                  />
                  <IconButton
                    type="button"
                    aria-label="Jump to next sunset"
                    icon={<FiSunset size={18} strokeWidth={1.85} />}
                    size="sm"
                    variant="ghost"
                    borderRadius="md"
                    borderWidth={0}
                    minW="32px"
                    h="32px"
                    color="rgba(255, 255, 255, 0.78)"
                    isDisabled={!sunPresetAvailability.sunset}
                    _hover={{ bg: sunPresetAvailability.sunset ? "rgba(255,255,255,0.65)" : undefined }}
                    _active={{ bg: sunPresetAvailability.sunset ? "rgba(255,255,255,0.5)" : undefined }}
                    onClick={() => jumpToNextSunEvent("sunset")}
                    boxShadow="none"
                  />
                  {/* Fixed slot so toggling Now does not shift sunrise/sunset */}
                  <Box minW="32px" h="32px" flexShrink={0}>
                    {showTimeReset ? (
                      <IconButton
                        type="button"
                        aria-label="Reset to current time"
                        icon={<FiClock size={18} strokeWidth={1.85} />}
                        size="sm"
                        variant="ghost"
                        borderRadius="md"
                        borderWidth={0}
                        minW="32px"
                        h="32px"
                        color="rgba(255, 255, 255, 0.78)"
                        _hover={{ bg: "rgba(255,255,255,0.65)" }}
                        _active={{ bg: "rgba(255,255,255,0.5)" }}
                        onClick={() => {
                          setNowButtonSuppressed(true);
                          setTimeOffsetMs(0);
                          setOffsetSmoothRate(OFFSET_SMOOTH_RESET);
                        }}
                        boxShadow="none"
                      />
                    ) : null}
                  </Box>
                </HStack>
              </Center>
            </VStack>
          </HStack>
          <HStack pointerEvents="auto" spacing={3} alignItems="flex-start" justifyContent="flex-end" flexShrink={0}>
            <IconButton
              aria-label="Toggle dev settings"
              icon={
                <Box
                  as="span"
                  display="inline-flex"
                  lineHeight={0}
                  animation={devPanelVisible ? `${devGearKeyframes} 4s linear infinite` : undefined}
                >
                  <IoSettingsOutline size={18} />
                </Box>
              }
              size="sm"
              variant="ghost"
              color="#1a3a52"
              bg="rgba(255,255,255,0.78)"
              backdropFilter="blur(10px)"
              boxShadow="md"
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.65)"
              borderRadius="xl"
              flexShrink={0}
              _hover={{ bg: "rgba(255,255,255,0.9)" }}
              _active={{ bg: "rgba(255,255,255,0.85)" }}
              onClick={toggleDevPanel}
            />
          </HStack>
        </HStack>
      </Box>
      {devPanelVisible && (
        <Box
          ref={devPanelContainerRef}
          position="fixed"
          zIndex={30}
          top={{ base: "calc(max(12px, env(safe-area-inset-top)) + 44px)", md: "calc(16px + 40px)" }}
          right={{ base: "max(16px, env(safe-area-inset-right))", md: 5 }}
          pointerEvents="auto"
          maxW="min(100vw - 24px, 300px)"
        >
          <DevPanel
            observerCityId={observerCityId}
            onObserverCityChange={setObserverCityId}
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
            hillYOffset={hillYOffset}
            onHillYOffsetChange={(v) => setHillYOffset(clampHillYOffset(v))}
          />
        </Box>
      )}
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
        <VStack spacing={32} width="100%" maxW="md" align="center" pointerEvents="auto">
          <Heading
            as="h1"
            fontWeight="normal"
            fontSize={{ base: "2.25rem", sm: "3rem" }}
            lineHeight="1.05"
            textAlign="center"
            px={2}
          >
            <Text
              as="span"
              display="inline"
              fontWeight="200"
              letterSpacing="0.06em"
              bgGradient="linear(to-br, #ffffff, #e8f4fc, #c5dff0)"
              bgClip="text"
              sx={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.65)) drop-shadow(0 0 18px rgba(0,0,0,0.35))",
              }}
            >
              brollin
            </Text>
            <Text
              as="span"
              display="inline"
              fontWeight="300"
              letterSpacing="0.18em"
              color="rgba(209, 209, 209, 0.78)"
              sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.55), 0 0 12px rgba(0,0,0,0.25)" }}
            >
              .space
            </Text>
          </Heading>
          <VStack spacing={2.5} width="100%" align="stretch" maxW="220px" mx="auto" userSelect="none" px={0}>
            {NAV_LINKS.map(({ href, label }) => (
              <NextLink key={href} href={href} passHref>
                <Box
                  as="a"
                  display="block"
                  cursor="pointer"
                  py={2.5}
                  px={3}
                  borderRadius="xl"
                  fontSize="sm"
                  fontWeight="600"
                  letterSpacing="0.08em"
                  textTransform="lowercase"
                  textAlign="center"
                  textDecoration="none"
                  color="rgba(15, 40, 64, 0.98)"
                  bg="rgba(255,255,255,0.22)"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="rgba(15, 40, 64, 0.14)"
                  backdropFilter="blur(12px)"
                  boxShadow="0 3px 10px rgba(15, 40, 64, 0.06)"
                  transitionProperty="transform, box-shadow, background-color, border-color"
                  transitionDuration="0.12s"
                  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
                  sx={{
                    WebkitTapHighlightColor: "transparent",
                    "@media (hover: hover)": {
                      "&:hover": {
                        bg: "rgba(255,255,255,0.48)",
                        borderColor: "rgba(15, 40, 64, 0.28)",
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(15, 40, 64, 0.12)",
                      },
                    },
                  }}
                  _active={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 16px rgba(15, 40, 64, 0.12)",
                  }}
                >
                  {label}
                </Box>
              </NextLink>
            ))}
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
