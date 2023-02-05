import { Shape, Vector2 } from "three";
import { Continent } from "./RawCountry";

export class Country {
  capital: string;
  boundaryData: number[][][];
  status: string;
  name: string;
  continent: Continent;
  centerCoordinates: { lon: number; lat: number };
  shapes: Shape[];

  constructor(country: UnprocessedCountry) {
    this.capital = country.capital;
    this.boundaryData = country.boundaryData;
    this.status = country.status;
    this.name = country.name;
    this.continent = country.continent;
    this.centerCoordinates = country.centerCoordinates;

    this.computeShapes();
  }

  private computeShapes = () => {
    this.shapes = this.boundaryData.map((countryPart) => new Shape(countryPart.map(([x, y]) => new Vector2(x, y))));
  };
}

export type UnprocessedCountry = Omit<Country, "shapes">;
