/**
 * Preset observer locations for SunCalc on the landing page.
 * Coordinates are approximate city centers.
 */
export const OBSERVER_CITIES = [
  { id: "sf", label: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { id: "san-diego", label: "San Diego", lat: 32.7157, lng: -117.1611 },
  { id: "seattle", label: "Seattle", lat: 47.6062, lng: -122.3321 },
  { id: "new-york", label: "New York", lat: 40.7128, lng: -74.006 },
  { id: "chicago", label: "Chicago", lat: 41.8781, lng: -87.6298 },
  { id: "london", label: "London", lat: 51.5074, lng: -0.1278 },
  { id: "tokyo", label: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { id: "beijing", label: "Beijing", lat: 39.9042, lng: 116.4074 },
] as const;

export type ObserverCityId = (typeof OBSERVER_CITIES)[number]["id"];

export const DEFAULT_OBSERVER_CITY_ID: ObserverCityId = "sf";

export function getObserverCoords(id: ObserverCityId): { lat: number; lng: number } {
  const row = OBSERVER_CITIES.find((c) => c.id === id);
  if (row) return { lat: row.lat, lng: row.lng };
  return { lat: OBSERVER_CITIES[0].lat, lng: OBSERVER_CITIES[0].lng };
}

const _sf = getObserverCoords("sf");
export const DEFAULT_OBSERVER_LAT = _sf.lat;
export const DEFAULT_OBSERVER_LNG = _sf.lng;
