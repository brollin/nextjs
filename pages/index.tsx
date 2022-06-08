import Head from "next/head";
import styles from "../styles/HappyBirthdayPlanets.module.css";
import planets from "../planetaryData/planets.json";
import Earth from "../components/earth";
import { useState } from "react";
import chroma from "chroma-js";

// TODO make planet prettier
// TODO randomize first planet
// TODO animate transition between planets
// TODO give planet info
// TODO pick better planets with better names
// TODO planet shadow
// TODO permalink to a specific planet
// TODO new favicon

const width = 500;
const height = 500;

const planetColorGradient = chroma.scale(["fuchsia", "navy", "teal", "lime", "yellow", "red"]);

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
        <defs>
          <radialGradient id="planetGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
            <stop offset="0%" stopColor={planetColorGradient(parseInt(planet.pl_eqt) / 2500)} />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <radialGradient id="earthGradient" cx="0.5" cy="0.5" r="0.8" fx="0.25" fy="0.25">
            <stop offset="0%" stopColor="#0000E0" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
        </defs>
        <g>
          <circle
            className={styles.planet}
            r={10 * parseInt(planet.pl_rade)}
            cx={width / 2}
            cy={height / 2}
            fill="url(#planetGradient)"
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
