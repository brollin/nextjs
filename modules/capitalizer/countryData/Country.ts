import { Continent } from "./RawCountry";

export class Country {
  capital: string;
  boundaryData: number[][];
  status: string;
  name: string;
  continent: Continent;
  centerCoordinates: { lon: number; lat: number };
}
