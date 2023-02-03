import { Country } from "./Country";
import { LonLatList, RawCountry } from "./RawCountry";

const boundaryData: RawCountry[] = require("./boundaryData.json");
const { countries, capitals }: { countries: string[]; capitals: string[] } = require("../countryCapitalData.json");

export class CountryProcessor {
  countryData: { [name: string]: Partial<Country> } = {};

  constructor() {
    for (const country of boundaryData) {
      const { geo_shape, status, name, continent, geo_point_2d } = country;
      const { geometry } = geo_shape;

      let boundaryData = [];
      switch (geometry.type) {
        case "Polygon":
          const coordinatesList = geometry.coordinates[0];
          boundaryData.push(this.extractBoundary(coordinatesList));
          break;
        case "MultiPolygon":
          for (const coordinatesListList of geometry.coordinates) {
            const coordinatesList = coordinatesListList[0];
            boundaryData.push(this.extractBoundary(coordinatesList));
          }
          break;
        default:
          throw new Error(`Unknown type of geometry encountered: ${geometry.type}`);
      }

      let capital = "";
      if (status === "Member State") {
        const index = countries.indexOf(name);
        if (index >= 0) capital = capitals[index];
        else console.log("no country name match for:", name);
      }

      this.countryData[country.name] = {
        capital,
        boundaryData,
        status,
        name,
        continent,
        centerCoordinates: geo_point_2d,
      };
    }
  }

  private extractBoundary = (coordinatesList: LonLatList) => {
    // let coordinates = [];
    // for (const pair of coordinatesList) coordinates.push(pair[0], pair[1]);
    // return coordinates;
    return coordinatesList;
  };
}
