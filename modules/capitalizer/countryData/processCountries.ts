import { saveJson } from "../../../modules/common/helpers";
import { DehydratedCountry } from "../../../modules/capitalizer/models/Country";
import { Continent, LonLatListList, RawCountry } from "../../../modules/capitalizer/models/RawCountry";
import countryDataOverrides from "../../../modules/capitalizer/countryData/countryDataOverrides";
import countryCapitalData from "../countryCapitalData";
import chroma from "chroma-js";

const rawCountryData: RawCountry[] = require("./boundaryData.json");

const COLOR_BOUNDS: Record<Continent, string[]> = {
  Antarctica: ["white", "white"],
  Asia: ["darkred", "indianred"],
  Europe: ["darkblue", "cornflowerblue"],
  Americas: ["darkgreen", "darkseagreen"],
  Africa: ["#dfc520", "darkgoldenrod"],
  Oceania: ["turquoise", "darkcyan"],
};

class CountryProcessor {
  countryData: Record<string, DehydratedCountry> = {};

  constructor(rawCountries: RawCountry[]) {
    let continentCountryCount: Record<Continent, number> = {
      Antarctica: 0,
      Asia: 0,
      Europe: 0,
      Americas: 0,
      Africa: 0,
      Oceania: 0,
    };

    // First pass through rawCountries: collect metadata
    for (const country of rawCountries) {
      const { continent } = country;
      continentCountryCount[continent]++;
    }

    const continentColorScales: Partial<Record<Continent, string[]>> = {};
    for (const [continent, count] of Object.entries(continentCountryCount))
      continentColorScales[continent as Continent] = chroma
        .bezier(COLOR_BOUNDS[continent as Continent])
        .scale()
        .colors(count);

    continentCountryCount = {
      Antarctica: 0,
      Asia: 0,
      Europe: 0,
      Americas: 0,
      Africa: 0,
      Oceania: 0,
    };

    // Second pass through rawCountries: assembled dehydrated countries
    for (const country of rawCountries) {
      const { geo_shape, status, name, continent, geo_point_2d, iso_3166_1_alpha_2_codes } = country;
      const { geometry } = geo_shape;

      let boundaryData = [];
      switch (geometry.type) {
        case "Polygon":
          boundaryData.push(geometry.coordinates[0]);

          // For south africa, I found a hole saved as a second boundary on a polygon
          if (geometry.coordinates.length > 1) boundaryData.push(geometry.coordinates[1]);
          break;
        case "MultiPolygon":
          for (const coordinatesList of geometry.coordinates) boundaryData.push(coordinatesList[0]);
          break;
        default:
          throw new Error(`Unknown type of geometry encountered: ${geometry.type}`);
      }

      let capital = "";
      let capitalCoordinates;
      if (status === "Member State") {
        const index = countryCapitalData.findIndex(
          (countryItem) => countryItem.CountryCode === iso_3166_1_alpha_2_codes
        );

        if (index >= 0) {
          const countryCapitalDatum = countryCapitalData[index];
          capital = countryCapitalDatum.CapitalName;
          capitalCoordinates = {
            lon: Number(countryCapitalDatum.CapitalLongitude),
            lat: Number(countryCapitalDatum.CapitalLatitude),
          };
        } else console.log("no countryCapitalData CountryCode match for:", iso_3166_1_alpha_2_codes);
      }

      const color = continentColorScales[country.continent]![continentCountryCount[country.continent]];
      continentCountryCount[country.continent]++;

      this.countryData[name] = {
        boundaryData,
        status,
        name,
        displayName: name,
        continent,
        centerCoordinates: geo_point_2d,
        bounds: this.computeBounds(boundaryData),
        capital,
        capitalCoordinates,
        countryCode: iso_3166_1_alpha_2_codes ?? null,
        color,
        holeIndices: [],
        ...this.getCountryOverrideData(name),
      };
    }
  }

  private computeBounds = (boundaryData: LonLatListList) => {
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
