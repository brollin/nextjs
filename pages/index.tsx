import { CSSTransition, SwitchTransition } from "react-transition-group";
import React, { useState } from "react";
import chroma from "chroma-js";
import classnames from "classnames";
import Head from "next/head";

import { Planet } from "../models/Planet";
import EarthView from "../components/earth";
import planetData from "../planetaryData/planets.json";
import PlanetView from "../components/planet";
import styles from "../styles/HappyBirthdayPlanets.module.css";
import { RawPlanet } from "../models/RawPlanet";

// UP NEXT
// TODO reflect: zoom out to show all planets visited so far
// TODO gaze: implement a view from the surface (e.g. show Charon from Pluto surface)
// TODO gaze: make a procedurally generated landscape
// TODO gaze: show suns, moons, other planets in sky

// LATER
// TODO randomize first planet
// TODO fix planet 62 - smarter zooming
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

export default function HappyBirthdayPlanets() {
  const [planetIndex, setPlanetIndex] = useState(32);
  const [count, setCount] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [mode, setMode] = useState("wander");

  const planet = planets[planetIndex];
  const zoom = zoomFactor(planet.earthRadii);
  const partyPoopers = count % 5 == 0;

  const onWander = () => {
    setMode("wander");
    setPlanetIndex(Math.floor(Math.random() * planets.length));
    setCount(count + 1);
  };
  const onGaze = () => setMode("gaze");

  const wanderView = (
    <SwitchTransition>
      <CSSTransition key={planet.id} timeout={500} classNames="fade">
        {
          // <CSSTransition
          //   key={planet.id}
          //   nodeRef={ref}
          //   addEndListener={(done) => {
          //     ref.current;
          //     // TODO add an event listener onto the element above
          //     // or go back to using timeout
          //   }}
          //   classNames="fade"
          // >
        }
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
      </CSSTransition>
    </SwitchTransition>
  );

  const gazeView = (
    <SwitchTransition>
      <CSSTransition key={planet.id} timeout={500} classNames="fade">
        <g className={styles.fadeIn}>
          <PlanetView
            cx={viewWidth / 2}
            cy={viewHeight * 2}
            r={viewHeight * 1.5}
            color={planetColorGradient(planet.temperature / 1300)}
          />
          {planet.numberStars > 0 ? null : null}
          {
            // TODO render stars
          }
        </g>
      </CSSTransition>
    </SwitchTransition>
  );

  const modeToView = {
    wander: wanderView,
    gaze: gazeView,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday Jeff!</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <svg className={styles.vectorContainer} width="100%" height={500} viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
        {modeToView[mode]}
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
          <button className={styles.action} onClick={onGaze}>
            Gaze
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
        {planet.orbitalPeriod ? planet.orbitalPeriod.toFixed(1) + " days" : "?"}
      </span>
    </div>
    <a href="https://exoplanetarchive.ipac.caltech.edu">Data sourced from NASA Exoplanet Archive</a>
  </>
);
