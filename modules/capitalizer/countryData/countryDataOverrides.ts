import { UnhydratedCountry } from "@/modules/capitalizer/models/Country";

const countryDataOverrides: Record<string, Partial<UnhydratedCountry>> = {
  Fiji: {
    centerCoordinates: { lon: 177.96485, lat: -17.681347 },
  },
  "U.K. of Great Britain and Northern Ireland": {
    centerCoordinates: { lon: -2.89558470050636, lat: 56.1553497202996 },
  },
};

export default countryDataOverrides;
