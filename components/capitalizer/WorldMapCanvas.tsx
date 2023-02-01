import React from "react";
import styles from "../../styles/Capitalizer.module.css";
import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Country } from "../../modules/capitalizer/countryData/Country";

const countryData: { [name: string]: Country } = require("../../modules/capitalizer/countryData/countryData.json");

const AllCountries = () => (
  <>
    {Object.values(countryData).flatMap(({ boundaryData, name }) =>
      boundaryData.map((positions, index) => (
        <lineLoop key={name + index}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(positions)}
              count={positions.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color={0xffffff} />
        </lineLoop>
      ))
    )}
  </>
);

export const WorldMapCanvas = () => (
  <Box position="fixed" h="100vh" w="100vw">
    <Canvas className={styles.canvas} shadows={true} camera={{ position: [0, 0, 130] }}>
      {/* <axesHelper scale={5} /> */}
      <OrbitControls />
      <AllCountries />
    </Canvas>
  </Box>
);
