import { saveJson } from "../../../modules/common/helpers";
import { UnhydratedCountry } from "../../../modules/capitalizer/models/Country";
import { LonLatListList, RawCountry } from "../../../modules/capitalizer/models/RawCountry";
import { countries, capitals } from "../../../modules/capitalizer/countryCapitalData";
import countryDataOverrides from "../../../modules/capitalizer/countryData/countryDataOverrides";
import countryCapitalData from "../countryCapitalData2";

const rawCountryData: RawCountry[] = require("./boundaryData.json");

class CountryProcessor {
  countryData: { [name: string]: UnhydratedCountry } = {};

  constructor(rawCountries: RawCountry[]) {
    for (const country of rawCountries) {
      const { geo_shape, status, name, continent, geo_point_2d, iso_3166_1_alpha_2_codes } = country;
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

      // TODO: remove this dataset in favor of the below one
      let capital = "";
      if (status === "Member State") {
        const index = countries.indexOf(name);
        if (index >= 0) capital = capitals[index];
        else console.log("no country name match for:", name);
      }

      let capitalCoordinates;
      if (status === "Member State") {
        const index = countryCapitalData.findIndex(
          (countryItem) => countryItem.CountryCode === iso_3166_1_alpha_2_codes
        );

        if (index >= 0) {
          const countryCapitalDatum = countryCapitalData[index];
          capitalCoordinates = {
            lon: Number(countryCapitalDatum.CapitalLongitude),
            lat: Number(countryCapitalDatum.CapitalLatitude),
          };
        } else console.log("no countryCapitalData CountryCode match for:", iso_3166_1_alpha_2_codes);
      }

      this.countryData[name] = {
        boundaryData: boundaryData,
        status,
        name,
        displayName: name,
        continent,
        centerCoordinates: geo_point_2d,
        bounds: this.computeBounds(boundaryData),
        capital,
        capitalCoordinates,
        countryCode: iso_3166_1_alpha_2_codes ?? null,
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
