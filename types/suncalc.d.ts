declare module "suncalc" {
  export interface SunPosition {
    azimuth: number;
    altitude: number;
  }
  export interface SunTimes {
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    dawn: Date;
    dusk: Date;
    nadir: Date;
    night: Date;
    nightEnd: Date;
    goldenHour: Date;
    goldenHourEnd: Date;
    sunriseEnd: Date;
    sunsetStart: Date;
    nauticalDawn: Date;
    nauticalDusk: Date;
  }
  export function getPosition(date: Date, lat: number, lng: number): SunPosition;
  export function getTimes(date: Date, lat: number, lng: number, height?: number): SunTimes;
}
