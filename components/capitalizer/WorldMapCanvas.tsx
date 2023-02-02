import React, { useMemo } from "react";
import * as THREE from "three";
import styles from "../../styles/Capitalizer.module.css";
import { Box } from "@chakra-ui/react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Country } from "../../modules/capitalizer/countryData/Country";
import { Continent } from "../../modules/capitalizer/countryData/RawCountry";
import { Vector3 } from "three";
import CameraControls from "camera-controls";

const countryData: { [name: string]: Country } = require("../../modules/capitalizer/countryData/countryData.json");

const continentColor: Record<Continent, number | string> = {
  Antarctica: 0xffffff,
  Asia: "indianred",
  Europe: "cornflowerblue",
  Americas: "darkseagreen",
  Africa: "darkgoldenrod",
  Oceana: "darkcyan",
};

type AllCountriesProps = {
  selectedCountry: Country;
};
const AllCountries = ({ selectedCountry }: AllCountriesProps) => (
  <>
    {Object.values(countryData).flatMap(({ boundaryData, name, continent, centerCoordinates }) =>
      boundaryData.map((positions, index) => (
        <>
          <Text color={0xffffff} position={new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0)}>
            {name}
          </Text>
          <lineLoop key={name + index}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array(positions)}
                count={positions.length / 3}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color={continentColor[continent]} />
          </lineLoop>
        </>
      ))
    )}
  </>
);

// TODO: make a simple shape
const ShapeTest = () => {
  const positions = [];
  return (
    <mesh>
      <shapeGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(positions.filter((value, index) => (index + 3) % 3 != 0))}
          count={positions.length / 2}
          itemSize={3}
        />
      </shapeGeometry>
      <meshBasicMaterial attach="material" color={0xff00ff} />
    </mesh>
  );
};

type WorldMapCanvasProps = {
  countryName: string;
};

export const WorldMapCanvas = ({ countryName }: WorldMapCanvasProps) => {
  const country = countryData[countryName];
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true} camera={{ position: new Vector3(0, 0, 130) }}>
        {/* <axesHelper scale={5} /> */}
        {/* <ShapeTest /> */}
        <OrbitControls />
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

const Controls = ({ country, pos = new Vector3() }: ControlsProps) => {
  // TODO: understand this better, do better zooming/panning
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [camera, gl.domElement]);
  controls.setLookAt(
    camera.position.x,
    camera.position.y,
    camera.position.z,
    camera.position.x,
    camera.position.y,
    0,
    true
  );

  const { centerCoordinates } = country;
  const focus = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 30);
  return useFrame((state, delta) => {
    pos.set(focus.x, focus.y, focus.z + 0.2);

    state.camera.position.lerp(pos, 0.5);
    state.camera.updateProjectionMatrix();

    controls.setLookAt(
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
      state.camera.position.x,
      state.camera.position.y,
      0,
      true
    );
    return controls.update(delta);
  });
};
