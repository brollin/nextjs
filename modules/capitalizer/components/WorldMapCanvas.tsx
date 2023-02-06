import styles from "../../../styles/Capitalizer.module.css";
import React, { memo, useContext, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Mesh, Vector3 } from "three";
import * as THREE from "three";
import { Box } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
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

const BORDER_BASE_Z = 0.002;
const COUNTRY_BASE_Z = 0;
const TEXT_BASE_Z = 0.21;

const CountryMesh = ({ isSelected, country }: CountryWrappedProps) => {
  const { shapes, name, continent, centerCoordinates, bounds } = country;

  const meshRef = useRef<Mesh>(null);
  const textRef = useRef(null);
  useFrame(() => {
    if (!isSelected) {
      if (meshRef.current.position.z !== 0) {
        meshRef.current.position.setZ(COUNTRY_BASE_Z);
        textRef.current.position.setZ(TEXT_BASE_Z);
      }
      return;
    }

    const newZ = 0.105 + 0.1 * Math.sin(((Date.now() % 1500) / 1500) * 2 * Math.PI);
    meshRef.current.position.setZ(newZ);
    textRef.current.position.setZ(newZ + 0.1);
  });

  const { minX, maxX } = bounds;
  const fontSize = Math.min(Math.max((maxX - minX) * 0.08, 0.1), 0.8);
  const countryObject = (
    <>
      <Text
        ref={textRef}
        outlineColor={0x000000}
        fontSize={fontSize}
        color={0xffffff}
        position={new Vector3(centerCoordinates.lon, centerCoordinates.lat, TEXT_BASE_Z)}
      >
        {name}
      </Text>
      <mesh key={name} ref={meshRef}>
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
    <lineSegments position={[0, 0, BORDER_BASE_Z]}>
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
        <Perf />
        {store.currentCountry ? <Controls /> : null}
        {store.countries ? <AllCountries /> : null}
      </Canvas>
    </Box>
  );
});

export default WorldMapCanvas;
