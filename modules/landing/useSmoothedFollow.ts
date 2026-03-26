import { useEffect, useRef, useState } from "react";

/** Higher = snappier follow (still smooth); tuned for wheel bursts. */
const DEFAULT_SMOOTHING_RATE = 20;

/**
 * Frame-rate–independent exponential smoothing toward `target`.
 * Removes jitter when `target` jumps on discrete wheel/touch events.
 *
 * @param rate — exponential rate; lower = slower convergence (default tuned for wheel/touch).
 */
export function useSmoothedFollow(target: number, rate: number = DEFAULT_SMOOTHING_RATE): number {
  const [smoothed, setSmoothed] = useState(target);
  const targetRef = useRef(target);
  const smoothedRef = useRef(target);
  const rateRef = useRef(rate);
  targetRef.current = target;
  rateRef.current = rate;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = targetRef.current;
      const prev = smoothedRef.current;
      const next = prev + (t - prev) * (1 - Math.exp(-rateRef.current * dt));
      const settled = Math.abs(t - next) < 0.5 ? t : next;
      smoothedRef.current = settled;
      setSmoothed(settled);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return smoothed;
}
