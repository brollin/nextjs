import { RawPlanet } from "./RawPlanet";

// Source: https://en.wikipedia.org/wiki/List_of_planet_types
type PlanetType = "unknown" | "sub-earth" | "super-earth" | "ice or gas giant" | "super-jupiter" | "hot jupiter";

type DensityType = "unknown" | "ice or gas giant" | "rocky";

export class Planet {
  id: string;
  name: string;
  temperature: number; // Kelvin
  numberStars: number;
  earthRadii: number;
  earthMasses: number;
  orbitalPeriod: number; // Earth days
  orbitalSemiMajorAxis: number; // AU

  constructor(rawPlanet: RawPlanet) {
    this.id = rawPlanet.pl_name;
    this.name = rawPlanet.pl_name;
    this.temperature = rawPlanet.pl_eqt;
    this.numberStars = rawPlanet.sy_snum;
    this.earthRadii = rawPlanet.pl_rade;
    this.earthMasses = rawPlanet.pl_bmasse;
    this.orbitalPeriod = rawPlanet.pl_orbper;
    this.orbitalSemiMajorAxis = rawPlanet.pl_orbsmax;
  }

  // cm^3
  volume = () => ((4 / 3) * Math.PI * (this.earthRadii * 6.378e8)) ^ 3;

  // g/cm^3
  density = () => (this.earthMasses * 5.972e27) / this.volume();

  // deg F
  temperatureF = () => (this.temperature - 273) * 1.8 + 32;

  jupiterMasses = () => this.earthMasses * 0.00314558;

  // http://astro140.courses.science.psu.edu/theme4/census-and-properties-of-exoplanets/exoplanet-composition/
  densityType = (): DensityType => {
    if (this.earthMasses == 0 || this.earthRadii == 0) return "unknown";

    const density = this.density();
    if (density >= 3) {
      // as gas giants increase in mass, they reach an upper limit in radius, after which point they
      // will just become denser as mass is increased. assume planets that are around Jupiters size
      // but more dense are giants.
      return this.jupiterMasses() > 0.5 ? "ice or gas giant" : "rocky";
    } else if (density < 3) return "ice or gas giant";
  };

  type = (): PlanetType => {
    const densityType = this.densityType();
    switch (densityType) {
      case "ice or gas giant":
        // TODO super puffs
        if (this.orbitalPeriod < 10 || this.orbitalSemiMajorAxis < 0.5) return "hot jupiter";
        else if (this.jupiterMasses() > 1) return "super-jupiter";
        else return "ice or gas giant";
      case "rocky":
        if (this.earthMasses >= 1) return "super-earth";
        else return "sub-earth";
      default:
        return "unknown";
    }
  };
}
