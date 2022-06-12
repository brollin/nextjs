import { RawPlanet } from "./RawPlanet";

// Source: https://en.wikipedia.org/wiki/List_of_planet_types
type MassType =
  | "unknown"
  | "sub-earth"
  | "earth"
  | "super-earth"
  | "mini-neptune"
  | "ice giant"
  | "gas giant"
  | "super-jupiter";

export class Planet {
  id: string;
  name: string;
  temperature: number; // Kelvin
  numberStars: number;
  earthRadii: number;
  earthMasses: number;
  orbitalPeriod: number;

  constructor(rawPlanet: RawPlanet) {
    this.id = rawPlanet.pl_name;
    this.name = rawPlanet.pl_name;
    this.temperature = rawPlanet.pl_eqt;
    this.numberStars = rawPlanet.sy_snum;
    this.earthRadii = rawPlanet.pl_rade;
    this.earthMasses = rawPlanet.pl_bmasse;
    this.orbitalPeriod = rawPlanet.pl_orbper;
  }

  // cm^3
  volume = () => ((4 / 3) * Math.PI * (this.earthRadii * 6.378e8)) ^ 3;

  // g/cm^3
  density = () => (this.earthMasses * 5.972e27) / this.volume();

  // deg F
  temperatureF = () => (this.temperature - 273) * 1.8 + 32;

  type = (): MassType => {
    if (this.earthMasses == 0 || this.earthRadii == 0) return "unknown";

    if (this.earthMasses > 317.9) return "super-jupiter";
    else if (this.earthMasses > 317.9) return "super-jupiter";
    else if (this.earthMasses > 317.9) return "super-jupiter";
    else if (this.earthMasses > 317.9) return "super-jupiter";
    else if (this.earthMasses > 317.9) return "super-jupiter";
  };
}
