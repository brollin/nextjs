import styles from "@/styles/Cosmere.module.css";
import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Controls from "@/modules/cosmere/components/Controls";

const Tour = observer(() => {
  // const store = useContext(StoreContext);
  return (
    <Box position="fixed" h="100vh" w="100vw">
      <Canvas className={styles.canvas} shadows={true}>
        <Text color={0xffffff}>Welcome to the Cosmere</Text>
        <Controls />
      </Canvas>
    </Box>
  );
});

export default Tour;
