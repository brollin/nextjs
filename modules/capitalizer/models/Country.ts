import { Shape, Vector2 } from "three";
import { Continent } from "./RawCountry";

type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export class Country {
  capital: string;
  boundaryData: number[][][];
  status: "Member State" | "unknown"; // more statuses are possible
  name: string;
  continent: Continent;
  centerCoordinates: { lon: number; lat: number };
  bounds: Bounds;
  shapes: Shape[];

  get width() {
    // Special case for those countries with bounds on either side of the prime anti-meridian (e.g. Fiji)
    if (this.bounds.maxX > 170 && this.bounds.minX < -170) return this.bounds.minX + 360 - this.bounds.maxX;
    return this.bounds.maxX - this.bounds.minX;
  }

  get height() {
    return this.bounds.maxY - this.bounds.minY;
  }

  constructor(country: UnhydratedCountry) {
    this.capital = country.capital;
    this.boundaryData = country.boundaryData;
    this.status = country.status;
    this.name = country.name;
    this.continent = country.continent;
    this.centerCoordinates = country.centerCoordinates;
    this.bounds = country.bounds;

    this.hydrate();
  }

  private hydrate = () => {
    this.shapes = this.boundaryData.map((countryPart) => new Shape(countryPart.map(([x, y]) => new Vector2(x, y))));
  };
}

export type UnhydratedCountry = Pick<
  Country,
  "capital" | "boundaryData" | "status" | "name" | "continent" | "centerCoordinates" | "bounds"
>;
