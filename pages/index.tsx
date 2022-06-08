import Head from "next/head";
import styles from "../styles/HappyBirthdayPlanets.module.css";
import planets from "../planetaryData/planets.json";
import Earth from "../components/earth";
import { useState } from "react";
import chroma from "chroma-js";
import classnames from "classnames";

// TODO randomize first planet
// TODO give planet info
// TODO planet shadow
// TODO permalink to a specific planet

const width = 400;
const height = 500;

const planetColorGradient = chroma.scale(["fuchsia", "navy", "teal", "lime", "yellow", "red"]);

// The fewer total earth radii, the more we should zoom.
const zoomFactor = (planetRadius: number) => {
  const totalEarthRadii = 1 + planetRadius;
  return Math.max(1, (-2 / 12) * totalEarthRadii + 3.33);
};

export default function HappyBirthdayPlanets() {
  const [planetIndex, setPlanetIndex] = useState(0);
  const [count, setCount] = useState(1);
  const planet = planets[planetIndex];
  const zoom = zoomFactor(parseInt(planet.pl_rade));
  const onWander = () => {
    setPlanetIndex(Math.floor(Math.random() * planets.length));
    setCount(count + 1);
  };
  const partyPoopers = count % 10 == 0;
  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday Jeff!</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <svg width={width} height={height}>
        <defs>
          <radialGradient id="planetGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
            <stop offset="0%" stopColor={planetColorGradient(parseInt(planet.pl_eqt) / 1300)} />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <radialGradient id="earthGradient" cx="0.5" cy="0.5" r="0.8" fx="0.25" fy="0.25">
            <stop offset="0%" stopColor="#0000E0" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
        </defs>
        <g key={planet.rowid} className={styles.fadeIn}>
          <circle
            className={styles.planet}
            r={10 * parseInt(planet.pl_rade) * zoom}
            cx={width / 2}
            cy={height / 2}
            fill="url(#planetGradient)"
          />
          <g transform={`translate(${width * 0.8}, ${height * 0.8})`}>
            <g className={styles.earth}>
              <g transform={`scale(${0.2 * zoom})`}>
                <Earth />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <div className={styles.happyBirthday}>
        {partyPoopers
          ? "Oh no... this is a planet of party poopers. They do not wish Jeff a happy birthday."
          : "Happy birthday Jeff!"}
      </div>
      <div>{partyPoopers ? "Thanks a lot," : "From planet"}</div>
      <span className={classnames(styles.fadeIn, styles.planetName)} key={planet.rowid}>
        {planet.pl_name}
      </span>
      <button className={styles.wander} onClick={onWander}>
        Wander
      </button>
    </div>
  );
}
