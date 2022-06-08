import fs from "fs";
import papa from "papaparse";

const parseCsv = (filename: string): Promise<any> => {
  const file = fs.createReadStream(filename);
  return new Promise((resolve) => {
    papa.parse(file, {
      comments: "#",
      header: true,
      complete: (results) => {
        if (results.errors.length) {
          console.log("Errors encountered!", results.errors);
        }
        resolve(results.data);
      },
    });
  });
};

type Planet = {
  pl_rade: string;
  sy_snum: string;
};
const acceptablePlanet = (planet: Planet) => parseInt(planet.pl_rade) > 0;

const prunePlanets = (data: Planet[]) => {
  const planets = [];
  for (const planet of data) {
    if (acceptablePlanet(planet)) planets.push(planet);
  }
  return planets;
};

const saveJson = (filename: string, data: any) => fs.writeFileSync(filename, JSON.stringify(data));

const main = async () => {
  console.log("Parsing planetary data...");
  const data = (await parseCsv("./planetaryData/PS_2022.06.07_19.36.03.csv")) as Planet[];
  console.log(`Complete. ${data.length} planets parsed.`);

  const planets = prunePlanets(data);
  console.log(`After pruning, ${planets.length} planets remain.`);

  saveJson("./planetaryData/planets.json", planets.slice(0, 500));
};

main();
