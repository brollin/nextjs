import fs from "fs";
import { RawPlanet } from "../models/RawPlanet";

const rawPlanets = require("./pscomppars.json");

const acceptablePlanet = (planet: RawPlanet) =>
  planet.pl_rade > 0 && planet.pl_eqt > 0 && planet.pl_bmasse > 0 && planet.st_rad > 0 && planet.pl_orbsmax > 0;

const prunePlanets = (planets: RawPlanet[]) => {
  const prunedPlanets = [];
  for (const planet of planets) {
    if (acceptablePlanet(planet)) prunedPlanets.push(planet);
  }
  return prunedPlanets;
};

const saveJson = (filename: string, data: any) => fs.writeFileSync(filename, JSON.stringify(data));

const main = async () => {
  console.log("Number of planets:", (rawPlanets as RawPlanet[]).length);

  const prunedPlanets = prunePlanets(rawPlanets as RawPlanet[]);
  console.log("Remaining planets after pruning:", prunedPlanets.length);

  // gather planets by prefix
  const planetGroups: Record<string, RawPlanet[]> = {};
  for (const planet of prunedPlanets as RawPlanet[]) {
    const prefix = planet.pl_name.substring(0, 3);
    if (!planetGroups[prefix]) planetGroups[prefix] = [];
    planetGroups[prefix].push(planet);
  }
  const prefixes = Object.keys(planetGroups);
  console.log("Total planet prefixes:", prefixes.length);

  // take a subset of planets with as unique of names as possible
  const finalPlanets = [];
  let prefixIndex = 0;
  while (finalPlanets.length < 500) {
    const newPlanet = planetGroups[prefixes[prefixIndex]].pop();
    if (newPlanet) finalPlanets.push(newPlanet);
    prefixIndex = (prefixIndex + 1) % prefixes.length;
  }
  saveJson("./planetaryData/planets.json", finalPlanets);
  console.log("Final number of planets:", finalPlanets.length);
};

main();
