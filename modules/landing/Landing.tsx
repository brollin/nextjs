import Link from "next/link";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import { MdConstruction } from "react-icons/md";
import LandscapeBackground from "./LandscapeBackground";
import { useSmoothedFollow } from "./useSmoothedFollow";

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
      <LandscapeBackground timeOffsetMs={smoothedOffsetMs} />
      <Box
        position="fixed"
        top={{ base: "max(12px, env(safe-area-inset-top))", md: 4 }}
        right={{ base: "max(12px, env(safe-area-inset-right))", md: 4 }}
        zIndex={10}
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
      >
        <VStack spacing={6} width="100%" maxW="md" align="center">
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
