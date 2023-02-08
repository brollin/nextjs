import { saveJson } from "../../common/helpers";
import { UnhydratedCountry } from "../models/Country";
import { RawCountry } from "../models/RawCountry";
import { countries, capitals } from "../countryCapitalData";
import countryDataOverrides from "./countryDataOverrides";

const rawCountryData: RawCountry[] = require("./boundaryData.json");

class CountryProcessor {
  countryData: { [name: string]: UnhydratedCountry } = {};

  constructor(rawCountries) {
    for (const country of rawCountries) {
      const { geo_shape, status, name, continent, geo_point_2d } = country;
      const { geometry } = geo_shape;

      let boundaryData = [];
      switch (geometry.type) {
        case "Polygon":
          boundaryData.push(geometry.coordinates[0]);
          break;
        case "MultiPolygon":
          for (const coordinatesList of geometry.coordinates) boundaryData.push(coordinatesList[0]);
          break;
        default:
          throw new Error(`Unknown type of geometry encountered: ${geometry.type}`);
      }

      // TODO: mercator projection computation

      let capital = "";
      if (status === "Member State") {
        const index = countries.indexOf(name);
        if (index >= 0) capital = capitals[index];
        else console.log("no country name match for:", name);
      }

      this.countryData[name] = {
        capital,
        boundaryData,
        status,
        name,
        continent,
        centerCoordinates: geo_point_2d,
        bounds: this.computeBounds(boundaryData),
        ...this.getCountryOverrideData(name),
      };
    }
  }

  private computeBounds = (boundaryData) => {
    const point = boundaryData[0][0];
    let minX = point[0];
    let minY = point[1];
    let maxX = point[0];
    let maxY = point[1];
    for (const boundary of boundaryData) {
      for (const [x, y] of boundary) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    return { minX, minY, maxX, maxY };
  };

  private getCountryOverrideData = (countryName: string) => countryDataOverrides[countryName] ?? {};
}

const countryLoader = new CountryProcessor(rawCountryData);
saveJson("./modules/capitalizer/countryData/countryData.json", countryLoader.countryData);
