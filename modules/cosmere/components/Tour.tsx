import styles from "@/styles/Cosmere.module.css";
import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Controls from "@/modules/cosmere/components/Controls";
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
        <ambientLight intensity={0.1} />
        <directionalLight args={[0xffffff, 1]} position={[0, 0, 100]} />
        <Controls />
      </Canvas>
    </Box>
  );
});

export default Tour;
