import Head from "next/head";
import styles from "../styles/HappyBirthdayPlanets.module.css";

import planets from "../planetaryData/planets.json";
import Earth from "../components/earth";
import { useState } from "react";

// TODO randomized planet
// TODO give planet info
// TODO planet shadow
// TODO button for next planet
// TODO permalink to a specific planet
// TODO new favicon

const width = 500;
const height = 500;

export default function HappyBirthdayPlanets() {
  const [planetIndex, setPlanetIndex] = useState(0);
  const planet = planets[planetIndex];
  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday Jeff!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <svg width={width} height={height}>
        <g>
          <circle
            className={styles.planet}
            r={10 * parseInt(planet.pl_rade)}
            cx={width / 2}
            cy={height / 2}
            fill="#8F8000"
          />
          <g transform={`translate(${width * 0.9}, ${height * 0.8})`}>
            <g className={styles.earth}>
              <Earth />
            </g>
          </g>
        </g>
      </svg>
      <div className={styles.happyBirthday}>Happy birthday Jeff!</div>
      <div>From planet</div>
      <span className={styles.planetName}>{planet.pl_name}</span>
      <button className={styles.wander} onClick={() => setPlanetIndex(Math.floor(Math.random() * planets.length))}>
        Wander
      </button>
    </div>
  );
}
