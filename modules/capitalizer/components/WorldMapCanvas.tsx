import styles from "../../../styles/Capitalizer.module.css";
import React, { memo, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Vector3 } from "three";
import * as THREE from "three";
import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Perf } from "r3f-perf";

import { Country } from "../models/Country";
import { Continent } from "../models/RawCountry";
import { StoreContext } from "../models/Store";
import Controls from "./Controls";

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

const AllBorders = observer(() => {
  const store = useContext(StoreContext);
  const borderGeometries = store.countries.flatMap(({ shapes }) =>
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
});

const AllCountries = observer(() => {
  const store = useContext(StoreContext);
  return (
    <>
      {store.countries.map((country) => (
        <CountryMeshMemo
          key={country.name}
          isSelected={store.currentCountry?.name === country.name}
          country={country}
        />
      ))}
      <AllBorders />
    </>
  );
});

const WorldMapCanvas = observer(() => {
  const store = useContext(StoreContext);
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true}>
        {/* <Perf /> */}
        {store.currentCountry && store.cameraMode === "follow" ? <Controls country={store.currentCountry} /> : null}
        {store.cameraMode === "control" ? <OrbitControls makeDefault /> : null}
        {store.countries ? <AllCountries /> : null}
      </Canvas>
    </Box>
  );
});

export default WorldMapCanvas;
