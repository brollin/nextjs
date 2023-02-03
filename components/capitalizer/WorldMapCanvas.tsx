import styles from "../../styles/Capitalizer.module.css";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Shape } from "three";
import { Box } from "@chakra-ui/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Country } from "../../modules/capitalizer/countryData/Country";
import { Continent } from "../../modules/capitalizer/countryData/RawCountry";
import { Vector2, Vector3 } from "three";
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

const selectedColor = "darkslateblue";

const extrudeSettings = { curveSegments: 1, steps: 1, depth: 0.005, bevelEnabled: false };

type AllCountriesProps = {
  selectedCountry: Country;
};

const AllCountries = ({ selectedCountry }: AllCountriesProps) => (
  <>
    {Object.values(countryData).flatMap(({ boundaryData, name, continent, centerCoordinates }) =>
      boundaryData.map((positions, index) => {
        const vectors = [];
        for (let i = 0; i < positions.length; i += 2) vectors.push(new Vector2(positions[i], positions[i + 1]));
        const shape = new Shape(vectors);
        const selected = selectedCountry.name === name;
        return (
          <>
            <Text
              key={name + index}
              color={0xffffff}
              position={new Vector3(centerCoordinates.lon, centerCoordinates.lat, 1)}
            >
              {name}
            </Text>
            <mesh key={name + index}>
              <extrudeGeometry attach="geometry" args={[shape, extrudeSettings]} />
              <meshBasicMaterial attach="material" color={selected ? selectedColor : continentColor[continent]} />
            </mesh>
          </>
        );
      })
    )}
  </>
);

type WorldMapCanvasProps = {
  countryName: string;
};

export const WorldMapCanvas = ({ countryName }: WorldMapCanvasProps) => {
  const country = countryData[countryName];
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true} camera={{ position: new Vector3(0, 0, 130) }}>
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

    state.camera.position.lerp(pos, 0.25);
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
