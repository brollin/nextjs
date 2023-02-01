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
    };

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
  continent: string;
  region: string;
  iso_3166_1_alpha_2_codes: string;
  french_short: string;
};
