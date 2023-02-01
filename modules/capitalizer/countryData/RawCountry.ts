export type LonLat = string[];
export type LonLatList = LonLat[];
export type LonLatListList = LonLatList[];

export type Geometry =
  | {
      type: "Polygon";
      coordinates: LonLatList[];
    }
  | {
      type: "MultiPolygon";
      coordinates: LonLatListList[];
    }
  | {
      // There is a better way to do this one...
      type: "unknown";
      coordinates: LonLatListList[];
    };

export type Continent = "Antarctica" | "Asia" | "Europe" | "Americas" | "Africa" | "Oceana";

export type RawCountry = {
  geo_point_2d: { lon: number; lat: number };
  geo_shape: {
    type: "Feature";
    geometry: Geometry;
  };
  iso3: string;
  status: string;
  color_code: string;
  name: string;
  continent: Continent;
  region: string;
  iso_3166_1_alpha_2_codes: string;
  french_short: string;
};
