export class Planet {
  id: string;
  name: string;
  temperature: number; // Kelvin
  numberStars: number;
  earthRadii: number;
  earthMasses: number;

  constructor(planet) {
    this.id = planet.rowid;
    this.name = planet.pl_name;
    this.temperature = parseInt(planet.pl_eqt);
    this.numberStars = parseInt(planet.sy_snum);
    this.earthRadii = parseFloat(planet.pl_rade);
    this.earthMasses = parseFloat(planet.pl_masse);
  }

  temperatureF = () => (this.temperature - 273) * 1.8 + 32;
}
