import styles from "@/styles/Capitalizer.module.css";
import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import Controls from "@/modules/capitalizer/components/Controls";
import StoreContext from "@/modules/capitalizer/models/StoreContext";
import CountryMesh from "@/modules/capitalizer/components/CountryMesh";
import { Grid } from "@react-three/drei";

const BORDER_BASE_Z = 0.002;

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
        <CountryMesh key={country.name} isSelected={store.currentCountry?.name === country.name} country={country} />
      ))}
    </>
  );
});

const WorldMapCanvas = observer(() => {
  const store = useContext(StoreContext);
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true}>
        {store.currentCountry ? <Controls currentCountry={store.currentCountry} /> : null}
        {store.initialized ? <AllCountries /> : null}
        {store.initialized ? <AllBorders /> : null}
        {store.initialized && store.gridEnabled ? (
          <Grid position={[0, 0, -0.1]} rotation-x={Math.PI / 2} args={[360, 180]} fadeDistance={180} />
        ) : null}
      </Canvas>
    </Box>
  );
});

export default WorldMapCanvas;
