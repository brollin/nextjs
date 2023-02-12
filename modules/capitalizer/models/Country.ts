import { Shape, Vector2 } from "three";

import { Continent, LonLatList, Status } from "@/modules/capitalizer/models/RawCountry";

type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export default class Country {
  capital: string;
  capitalCoordinates?: { lon: number; lat: number };
  boundaryData: LonLatList[];
  status: Status;
  name: string;
  displayName: string;
  continent: Continent;
  centerCoordinates: { lon: number; lat: number };
  bounds: Bounds;
  shapes: Shape[] = [];
  countryCode: string | null; // iso_3166_1_alpha_2_code
  color: string;

  get width() {
    // Special case for those countries with bounds on either side of the prime anti-meridian (e.g. Fiji)
    if (this.bounds.maxX > 170 && this.bounds.minX < -155) return this.bounds.minX + 360 - this.bounds.maxX;
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
    this.displayName = country.displayName;
    this.continent = country.continent;
    this.centerCoordinates = country.centerCoordinates;
    this.bounds = country.bounds;
    this.countryCode = country.countryCode;
    this.capitalCoordinates = country.capitalCoordinates;
    this.color = country.color;

    this.hydrate();
  }

  private hydrate = () => {
    this.shapes = this.boundaryData.map((countryPart) => new Shape(countryPart.map(([x, y]) => new Vector2(x, y))));
  };
}

export type UnhydratedCountry = Pick<
  Country,
  | "capital"
  | "boundaryData"
  | "status"
  | "name"
  | "displayName"
  | "continent"
  | "centerCoordinates"
  | "bounds"
  | "countryCode"
  | "capitalCoordinates"
  | "color"
>;
