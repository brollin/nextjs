import React, { Suspense } from "react";
import styles from "../../styles/Capitalizer.module.css";
import { Canvas, extend, Object3DNode, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
    <Canvas shadows={true} className={styles.canvas} camera={{ position: [-4, 0, 0] }}>
      <Controls />
      <Suspense fallback={null}>
        <Globe />
      </Suspense>
      <axesHelper scale={5} />
      <ambientLight color="white" intensity={0.3} />
    </Canvas>
  );
};
