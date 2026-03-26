declare module "suncalc" {
  export interface SunPosition {
    azimuth: number;
    altitude: number;
  }
  export function getPosition(date: Date, lat: number, lng: number): SunPosition;
}
