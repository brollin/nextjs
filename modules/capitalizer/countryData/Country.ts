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

  // TODO: compute this beforehand
  computeBounds = () => {
    const point = this.boundaryData[0][0];
    let minX = point[0];
    let minY = point[1];
    let maxX = point[0];
    let maxY = point[1];
    for (const boundary of this.boundaryData) {
      for (const [x, y] of boundary) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    return { minX, minY, maxX, maxY };
  };
}

export type UnprocessedCountry = Omit<Country, "shapes">;
