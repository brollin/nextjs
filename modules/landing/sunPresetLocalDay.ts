import SunCalc from "suncalc";

/**
 * Calendar date (year, month, day) for an instant in a given IANA zone.
 * `en-CA` yields YYYY-MM-DD for reliable parsing.
 */
export function getCalendarDatePartsInTimeZone(ms: number, timeZone: string): { y: number; m: number; d: number } {
  const s = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}

/**
 * UTC epoch ms for a wall-clock instant in `timeZone` (ISO calendar, 1-based month).
 * Uses `Temporal` when available; otherwise a bounded Intl search.
 */
export function utcMsForLocalWallClock(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): number {
  const TemporalCtor = (globalThis as unknown as {
    Temporal?: { ZonedDateTime: { from: (x: Record<string, unknown>) => { epochMilliseconds: number } } };
  }).Temporal;
  if (TemporalCtor?.ZonedDateTime) {
    try {
      const zdt = TemporalCtor.ZonedDateTime.from({
        timeZone,
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond: 0,
      });
      return zdt.epochMilliseconds;
    } catch {
      // fall through
    }
  }
  return utcMsForLocalWallClockIntlSearch(year, month, day, hour, minute, second, timeZone);
}

function utcMsForLocalWallClockIntlSearch(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  const read = (t: number) => {
    const parts = fmt.formatToParts(new Date(t));
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? NaN);
    return { y: get("year"), m: get("month"), d: get("day"), h: get("hour"), mi: get("minute"), s: get("second") };
  };
  const t0 = Date.UTC(year, month - 1, day, 12, 0, 0);
  for (let dt = -36 * 3600000; dt <= 36 * 3600000; dt += 60000) {
    const t = t0 + dt;
    const p = read(t);
    if (p.y === year && p.m === month && p.d === day && p.h === hour && p.mi === minute && p.s === second) {
      return t;
    }
  }
  for (let dt = -36 * 3600000; dt <= 36 * 3600000; dt += 1000) {
    const t = t0 + dt;
    const p = read(t);
    if (p.y === year && p.m === month && p.d === day && p.h === hour && p.mi === minute && p.s === second) {
      return t;
    }
  }
  return t0;
}

/**
 * Sets simulated time to **today's** sunrise or sunset in `timeZone` (observer local calendar day of `virtualNowMs`),
 * not the next occurrence in the future (so you can jump backward within the same day).
 */
export function msOffsetForSunEventOnVirtualCalendarDay(
  event: "sunrise" | "sunset",
  virtualNowMs: number,
  lat: number,
  lng: number,
  timeZone: string,
): number | null {
  const { y, m, d } = getCalendarDatePartsInTimeZone(virtualNowMs, timeZone);
  const noonUtc = utcMsForLocalWallClock(y, m, d, 12, 0, 0, timeZone);
  const times = SunCalc.getTimes(new Date(noonUtc), lat, lng);
  const ev = event === "sunrise" ? times.sunrise : times.sunset;
  if (Number.isNaN(ev.getTime())) {
    return null;
  }
  return ev.getTime() - Date.now();
}
