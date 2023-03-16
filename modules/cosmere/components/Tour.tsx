import styles from "@/styles/Cosmere.module.css";
import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Text } from "@react-three/drei";
import Controls from "@/modules/cosmere/components/Controls";
import { Vector3 } from "three";
import { useRef } from "react";
import Planet from "@/modules/cosmere/components/Planet";

const Tour = observer(() => {
  // const store = useContext(StoreContext);

  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true}>
        <Text position={[0, -20, 0]} color={0xffffff}>
          Welcome to the Cosmere
        </Text>
        <Planet />
        <ambientLight />
        <Controls />
      </Canvas>
    </Box>
  );
});

export default Tour;
