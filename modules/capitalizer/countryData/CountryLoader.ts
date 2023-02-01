import { LonLatList, RawCountry } from "./RawCountry";

const countryData: RawCountry[] = require("./boundaryData.json");

export class CountryLoader {
  countryBoundary: { [name: string]: number[][] } = {};

  constructor() {
    for (const country of countryData) {
      const { geo_shape } = country;
      const { geometry } = geo_shape;

      if (geometry.type === "Polygon") {
        const coordinatesList = geometry.coordinates[0];
        this.countryBoundary[country.name] = [this.extractBoundary(coordinatesList)];
      } else if (geometry.type === "MultiPolygon") {
        this.countryBoundary[country.name] = [];

        for (const coordinatesListList of geometry.coordinates) {
          const coordinatesList = coordinatesListList[0];
          this.countryBoundary[country.name].push(this.extractBoundary(coordinatesList));
        }
      }
    }
  }

  private extractBoundary = (coordinatesList: LonLatList) => {
    let coordinates = [];
    for (const pair of coordinatesList) coordinates.push(pair[0], pair[1], 0);
    return coordinates;
  };
}
