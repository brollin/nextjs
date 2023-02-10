export type LonLat = [number, number];
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
      type: "unknown";
      coordinates: LonLatListList[];
    };

// More statuses are possible, but we only care about member states
export type Status = "Member State" | "unknown";

export type Continent = "Antarctica" | "Asia" | "Europe" | "Americas" | "Africa" | "Oceania";

export type RawCountry = {
  geo_point_2d: { lon: number; lat: number };
  geo_shape: {
    type: "Feature";
    geometry: Geometry;
  };
  iso3: string;
  status: Status;
  color_code: string;
  name: string;
  continent: Continent;
  region: string;
  iso_3166_1_alpha_2_codes: string | null;
  french_short: string;
};
