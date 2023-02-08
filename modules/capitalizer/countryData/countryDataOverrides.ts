import { UnhydratedCountry } from "../../../modules/capitalizer/models/Country";

const countryDataOverrides: Record<string, Partial<UnhydratedCountry>> = {
  Fiji: {
    centerCoordinates: { lon: 177.96485, lat: -17.681347 },
  },
  "U.K. of Great Britain and Northern Ireland": {
    centerCoordinates: { lon: -2.89558470050636, lat: 56.1553497202996 },
  },
  "United States of America": {
    centerCoordinates: { lon: -98.855654, lat: 40.326168 },
    bounds: {
      minX: -178.2165599999999,
      minY: 18.92548000000005,
      maxX: -66.97083999999995,
      maxY: 71.35144000000008,
    },
  },
};

export default countryDataOverrides;
