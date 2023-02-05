import styles from "../../../styles/Capitalizer.module.css";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Box } from "@chakra-ui/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Country, UnhydratedCountry } from "../models/Country";
import { Continent } from "../models/RawCountry";
import { Vector3 } from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import CameraControls from "camera-controls";
import { Perf } from "r3f-perf";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../models/Store";

const countryDataRaw: {
  [name: string]: UnhydratedCountry;
} = require("../countryData/countryData.json");
const countries = Object.values(countryDataRaw).map((country) => new Country(country));

const continentColor: Record<Continent, number | string> = {
  Antarctica: 0xffffff,
  Asia: "indianred",
  Europe: "cornflowerblue",
  Americas: "darkseagreen",
  Africa: "darkgoldenrod",
  Oceania: "darkcyan",
};

const selectedColor = "darkslateblue";

type CountryWrappedProps = {
  isSelected: boolean;
  country: Country;
};

const CountryMesh = ({ isSelected, country }: CountryWrappedProps) => {
  const { shapes, name, continent, centerCoordinates } = country;
  // const extrudeOptions = { curveSegments: 1, steps: 1, depth: isSelected ? 0.1 : 0.005, bevelEnabled: false };

  const countryObject = (
    <>
      <Text
        outlineColor={0x000000}
        fontSize={isSelected ? 0.5 : 0.4}
        color={0xffffff}
        position={new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0.1)}
      >
        {name}
      </Text>
      <mesh key={name}>
        {/* <extrudeGeometry attach="geometry" args={[shapes, extrudeOptions]} /> */}
        <shapeGeometry attach="geometry" args={[shapes]} />
        <meshBasicMaterial attach="material" color={isSelected ? selectedColor : continentColor[continent]} />
      </mesh>
    </>
  );
  return countryObject;
};
const CountryMeshMemo = memo(CountryMesh);

const AllBorders = () => {
  const borderGeometries = countries.flatMap(({ shapes }) =>
    shapes.map((shape) => {
      const points = shape.getPoints();
      const segmentPoints = [];
      for (let i = 0; i < points.length - 1; i++)
        segmentPoints.push(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);

      const bufferAttribute = new THREE.BufferAttribute(new Float32Array(segmentPoints), 2);
      const bufferGeometry = new THREE.BufferGeometry();
      bufferGeometry.setAttribute("position", bufferAttribute);
      return bufferGeometry;
    })
  );

  return (
    <lineSegments position={[0, 0, 0.005]}>
      <primitive attach="geometry" object={mergeBufferGeometries(borderGeometries)} />
      <lineBasicMaterial attach="material" color={0x000000} />
    </lineSegments>
  );
};
const AllBordersMemo = memo(AllBorders);

const AllCountries = ({ selectedCountry }: { selectedCountry: Country }) => (
  <>
    {countries.map((country) => (
      <CountryMeshMemo key={country.name} isSelected={selectedCountry.name === country.name} country={country} />
    ))}
    <AllBordersMemo />
  </>
);

type WorldMapCanvasProps = {
  countryName: string;
};

export const WorldMapCanvas = observer<WorldMapCanvasProps>(({ countryName }) => {
  const store = useContext(StoreContext);
  const country = countries.find(({ name }) => name === countryName);
  if (!country) console.log("could not find country", countryName);
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true}>
        {/* <Perf /> */}
        {country && store.cameraMode === "follow" ? <Controls country={country} /> : null}
        {store.cameraMode === "control" ? <OrbitControls makeDefault /> : null}
        {country ? <AllCountries selectedCountry={country} /> : null}
      </Canvas>
    </Box>
  );
});

CameraControls.install({ THREE });

type ControlsProps = {
  country: Country;
  pos?: Vector3;
};

const Controls = ({ country }: ControlsProps) => {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [camera, gl.domElement]);

  const { centerCoordinates } = country;
  const { minX, minY, maxX, maxY } = country.computeBounds();
  const distance = controls.getDistanceToFitBox((maxX - minX) * 1.2, (maxY - minY) * 1.2, 0.01);

  const positionFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat - 5, Math.max(distance, 10));
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
      if (state.camera.position.distanceTo(positionFinal) < 0.01) {
        setAnimating(false);
      }

      state.camera.position.lerp(positionFinal, 0.08);
      target.copy(state.camera.position).setZ(0).lerp(targetFinal, 0.5);
      // TODO: understand below line
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
