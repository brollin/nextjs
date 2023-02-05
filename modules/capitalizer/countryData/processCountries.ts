import { saveJson } from "../../common/helpers";
import { Country } from "./Country";
import { RawCountry } from "./RawCountry";
import { countries, capitals } from "../countryCapitalData";

const rawCountryData: RawCountry[] = require("./boundaryData.json");

class CountryProcessor {
  countryData: { [name: string]: Partial<Country> } = {};

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

      // TODO: compute bounds here

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
}

const countryLoader = new CountryProcessor(rawCountryData);
saveJson("./modules/capitalizer/countryData/countryData.json", countryLoader.countryData);
