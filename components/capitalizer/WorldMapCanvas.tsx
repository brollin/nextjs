import styles from "../../styles/Capitalizer.module.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Box } from "@chakra-ui/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bounds, Float, OrbitControls, Text, useBounds } from "@react-three/drei";
import { Country } from "../../modules/capitalizer/countryData/Country";
import { Continent } from "../../modules/capitalizer/countryData/RawCountry";
import { Group, Object3D, Vector3, Vector3Tuple } from "three";
import CameraControls from "camera-controls";

const countryDataRaw: {
  [name: string]: Omit<Country, "shapes">;
} = require("../../modules/capitalizer/countryData/countryData.json");
const countries = Object.values(countryDataRaw).map((country) => new Country(country));

const continentColor: Record<Continent, number | string> = {
  Antarctica: 0xffffff,
  Asia: "indianred",
  Europe: "cornflowerblue",
  Americas: "darkseagreen",
  Africa: "darkgoldenrod",
  Oceana: "darkcyan",
};

const selectedColor = "darkslateblue";

type CountryObjectProps = {
  isSelected: boolean;
  country: Country;
};

const CountryObject = ({ isSelected, country }: CountryObjectProps) => {
  const { shapes, name, continent, centerCoordinates } = country;
  const extrudeOptions = { curveSegments: 1, steps: 1, depth: isSelected ? 0.1 : 0.005, bevelEnabled: false };

  const countryObject = (
    <>
      <Text
        fontSize={isSelected ? 0.75 : 0.5}
        color={isSelected ? 0xffffff : 0xffffff}
        position={new Vector3(centerCoordinates.lon, centerCoordinates.lat, 1)}
      >
        {name}
      </Text>
      <mesh key={name}>
        <extrudeGeometry attach="geometry" args={[shapes, extrudeOptions]} />
        <meshBasicMaterial attach="material" color={isSelected ? selectedColor : continentColor[continent]} />
      </mesh>
    </>
  );
  return isSelected ? countryObject : countryObject;
};

const AllCountries = ({ selectedCountry }: { selectedCountry: Country }) => (
  <>
    {countries.map((country) => (
      <CountryObject key={country.name} isSelected={selectedCountry.name === country.name} country={country} />
    ))}
  </>
);

type WorldMapCanvasProps = {
  countryName: string;
};

export const WorldMapCanvas = ({ countryName }: WorldMapCanvasProps) => {
  const country = countries.find(({ name }) => name === countryName);
  if (!country) console.log("could not find country", countryName);
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true}>
        {/* <OrbitControls /> */}
        <AllCountries selectedCountry={country} />
        {country ? <Controls country={country} /> : null}
      </Canvas>
    </Box>
  );
};

CameraControls.install({ THREE });

type ControlsProps = {
  country: Country;
  pos?: Vector3;
};

const Controls = ({ country }: ControlsProps) => {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [camera, gl.domElement]);

  const { centerCoordinates } = country;
  // TODO: calculate z based on bounding box of country with getDistanceToFitBox
  const positionFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 40);
  const targetFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0);
  const target = new Vector3();

  const [animating, setAnimating] = useState(true);

  // set initial camera position/direction
  useEffect(() => {
    camera.position.set(0, 0, 130);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => setAnimating(true), [country]);

  useFrame((state, delta) => {
    if (animating) {
      if (state.camera.position.distanceTo(positionFinal) < 0.0001 && target.distanceTo(targetFinal) < 0.0001)
        setAnimating(false);

      state.camera.position.lerp(positionFinal, 0.08);
      target.copy(state.camera.position).setZ(0).lerp(targetFinal, 0.5);
      // TODO: understand below
      // state.camera.updateProjectionMatrix();
      controls.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        target.x,
        target.y,
        target.z
      );
      controls.update(delta);
    }
  });

  return null;
};
