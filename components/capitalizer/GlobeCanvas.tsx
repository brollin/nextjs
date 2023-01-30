import React, { Suspense } from "react";
import styles from "../../styles/Capitalizer.module.css";
import { Canvas, extend, Object3DNode, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box } from "@chakra-ui/react";

extend({ OrbitControls });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

const Controls = () => {
  const { camera, gl } = useThree();
  return <orbitControls attach="orbitControls" args={[camera, gl.domElement]} />;
};

const Globe = () => {
  {
    /* Earth Remix by Zoe XR [CC-BY] via Poly Pizza */
  }
  const globe = useLoader(GLTFLoader, "/EarthRemix.glb");

  return <primitive object={globe.scene} scale={0.05} />;
};

export const GlobeCanvas = () => {
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true} camera={{ position: [-4, 0, 0] }}>
        <Controls />
        <Suspense fallback={null}>
          <Globe />
        </Suspense>
        {/* <axesHelper scale={5} /> */}
        <ambientLight color="white" intensity={0.3} />
      </Canvas>
    </Box>
  );
};
