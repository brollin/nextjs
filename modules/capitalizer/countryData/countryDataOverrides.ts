import { UnhydratedCountry } from "../../../modules/capitalizer/models/Country";

const countryDataOverrides: Record<string, Partial<UnhydratedCountry>> = {
  Fiji: {
    centerCoordinates: { lon: 177.96485, lat: -17.681347 },
  },
  "U.K. of Great Britain and Northern Ireland": {
    displayName: "United Kingdom",
    centerCoordinates: { lon: -2.89558470050636, lat: 56.1553497202996 },
  },
  "United States of America": {
    centerCoordinates: { lon: -98.855654, lat: 40.326168 },
    bounds: {
      minX: -178.21656,
      minY: 18.92548,
      maxX: -66.97084,
      maxY: 71.35144,
    },
  },
  "Russian Federation": {
    bounds: {
      minX: 28.533686,
      minY: 41.19658,
      maxX: 179.99999,
      maxY: 81.85193,
    },
    displayName: "Russia",
  },
  "Brunei Darussalam": {
    displayName: "Brunei",
  },
  "Iran (Islamic Republic of)": {
    displayName: "Iran",
  },
  "Democratic People's Republic of Korea": {
    displayName: "North Korea",
  },
  "Republic of Korea": {
    displayName: "South Korea",
  },
  "Lao People's Democratic Republic": {
    displayName: "Laos",
  },
  "Libyan Arab Jamahiriya": {
    displayName: "Libya",
  },
  "The former Yugoslav Republic of Macedonia": {
    displayName: "North Macedonia",
  },
  "Micronesia (Federated States of)": {
    displayName: "Micronesia",
  },
  "Moldova, Republic of": {
    displayName: "Moldova",
  },
  "Syrian Arab Republic": {
    displayName: "Syria",
  },
  "United Republic of Tanzania": {
    displayName: "Tanzania",
  },
  "South Africa": {
    holeIndices: [1],
  },
};

export default countryDataOverrides;
