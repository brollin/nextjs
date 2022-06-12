import { CSSTransition, SwitchTransition } from "react-transition-group";
import React, { ReactNode, useState } from "react";
import chroma from "chroma-js";
import classnames from "classnames";
import Head from "next/head";

import { Planet } from "../models/Planet";
import EarthView from "../components/earth";
import planetData from "../planetaryData/planets.json";
import PlanetView from "../components/planet";
import styles from "../styles/HappyBirthdayPlanets.module.css";
import { RawPlanet } from "../models/RawPlanet";
import MoonView from "../components/moon";

// UP NEXT
// TODO surface: make a procedurally generated landscape. hills for rocky, clouds for giants
// TODO surface: show suns, moons, other planets in sky
// TODO reflect: zoom out to show all planets visited so far

// LATER
// TODO calculate whether in the habitable zone
// TODO show color temperature scale
// TODO randomize first planet
// TODO smarter zooming for very large planets
// TODO add our solar systems planets
// TODO permalink to a specific planet

// The SVG viewBox width and height
const viewWidth = 400;
const viewHeight = 500;

const planets = (planetData as RawPlanet[]).map((planet) => new Planet(planet));
const planetColorGradient = chroma.scale(["fuchsia", "navy", "teal", "lime", "yellow", "red"]);

// The fewer total earth radii, the more we should zoom
const zoomFactor = (planetRadius: number) => {
  const totalEarthRadii = 1 + planetRadius;
  return Math.max(1, (-2 / 12) * totalEarthRadii + 3.33);
};

type Mode = "orbit" | "surface";

export default function HappyBirthdayPlanets() {
  const [planetIndex, setPlanetIndex] = useState(32);
  const [count, setCount] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [mode, setMode] = useState<Mode>("orbit");

  const planet = planets[planetIndex];
  const zoom = zoomFactor(planet.earthRadii);
  const partyPoopers = count % 5 == 0;

  const onWander = () => {
    setPlanetIndex(Math.floor(Math.random() * planets.length));
    setCount(count + 1);
  };
  const onTransport = () => setMode(mode === "orbit" ? "surface" : "orbit");

  const orbitView = (
    <g className={styles.fadeIn}>
      <PlanetView
        className={styles.planet}
        cx={viewWidth / 2}
        cy={viewHeight / 2}
        r={10 * planet.earthRadii * zoom}
        color={planetColorGradient(planet.temperature / 1300)}
      />
      <EarthView className={styles.earth} cx={viewWidth * 0.9} cy={viewHeight * 0.8} r={zoom * 10} />
    </g>
  );

  const surfaceView = (
    <g className={styles.fadeIn}>
      <PlanetView
        cx={viewWidth / 2}
        cy={viewHeight * 10}
        r={viewHeight * 9.25}
        color={planetColorGradient(planet.temperature / 1300)}
      />
      {planet.numberStars > 0 ? null : null}
      <MoonView cx={viewWidth * 0.1} cy={viewHeight * 0.3} r={30} />
    </g>
  );

  const modeToView: Record<Mode, ReactNode> = {
    orbit: orbitView,
    surface: surfaceView,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday Jeff!</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <svg className={styles.vectorContainer} width="100%" height={500} viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
        <SwitchTransition>
          <CSSTransition key={`${planet.id}${mode}}`} timeout={500} classNames="fade">
            {modeToView[mode]}
          </CSSTransition>
        </SwitchTransition>
      </svg>
      <div className={styles.content}>
        <div className={styles.birthdayText}>
          {partyPoopers
            ? "Oh no... this is a planet of party poopers. They do not wish Jeff a happy birthday."
            : "Happy birthday Jeff!"}
        </div>
        <div className={styles.birthdayText}>{partyPoopers ? "Thanks a lot," : "From planet"}</div>
        <span className={classnames(styles.fadeInRise, styles.planetName)} key={planet.id}>
          {planet.name}
        </span>
        <div className={styles.actions}>
          <button className={styles.action} onClick={onWander}>
            Wander
          </button>
          <button className={styles.action} onClick={onTransport}>
            Transport
          </button>
        </div>
        {showMore ? <PlanetInfo planet={planet} /> : <a onClick={() => setShowMore(true)}>Show me more...</a>}
      </div>
    </div>
  );
}

const PlanetInfo = ({ planet }) => (
  <>
    <span className={classnames(styles.fadeInRise, styles.planetName)} key={`${planet.id}name`}>
      {planet.name}
    </span>
    <div key={`${planet.id}info`} className={styles.planetInfo}>
      <span className={styles.planetInfo__heading}>Type</span>
      <span className={styles.fadeInRise}>{planet.type()}</span>
      <span className={styles.planetInfo__heading}>Earth radii</span>
      <span className={styles.fadeInRise}>{planet.earthRadii.toFixed(1)}</span>
      <span className={styles.planetInfo__heading}>Earth masses</span>
      <span className={styles.fadeInRise}>{planet.earthMasses ? planet.earthMasses.toFixed(1) : "?"}</span>
      <span className={styles.planetInfo__heading}>Temperature</span>
      <span className={styles.fadeInRise}>{planet.temperatureF().toFixed(0) + " °F"}</span>
      <span className={styles.planetInfo__heading}>Number of stars</span>
      <span className={styles.fadeInRise}>{planet.numberStars}</span>
      <span className={styles.planetInfo__heading}>Length of year</span>
      <span className={styles.fadeInRise}>
        {planet.orbitalPeriod ? planet.orbitalPeriod.toFixed(1) + " Earth days" : "?"}
      </span>
    </div>
    <a href="https://exoplanetarchive.ipac.caltech.edu">Data sourced from NASA Exoplanet Archive</a>
  </>
);
