import Head from "next/head";
import styles from "../styles/HappyBirthdayPlanets.module.css";

import planets from "../planetaryData/planets.json";

// TODO randomized planet
// TODO give planet info
// TODO generate planet based on size
// TODO planet shadow
// TODO new favicon

const width = 500;
const height = 500;

export default function HappyBirthdayPlanets() {
  const planet = planets[0];
  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday Jeff!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <svg width={width} height={height}>
        <g>
          <circle className={styles.planet} r={10 * parseInt(planet.pl_rade)} cx={width / 2} cy={height / 2} />
        </g>
      </svg>
      <div>Happy birthday Jeff,</div>
      <div>
        from planet <span className={styles.planetName}>{planet.pl_name}</span>!
      </div>
    </div>
  );
}
