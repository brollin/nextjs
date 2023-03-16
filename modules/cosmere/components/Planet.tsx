import { observer } from "mobx-react-lite";
import { useFrame } from "@react-three/fiber";
import { Sphere, Text, useTexture } from "@react-three/drei";
import { SphereGeometry, Vector3 } from "three";
import { useRef } from "react";

const Planet = observer(() => {
  // const store = useContext(StoreContext);
  const sphere = useRef<SphereGeometry>(null);

  const [texture, roughnessTexture, displacementTexture, normalTexture, aoTexture] = useTexture([
    "/Rock_047/Rock_047_BaseColor.jpg",
    "/Rock_047/Rock_047_Roughness.jpg",
    "/Rock_047/Rock_047_Height.png",
    "/Rock_047/Rock_047_Normal.jpg",
    "/Rock_047/Rock_047_AmbientOcclusion.jpg",
  ]);

  useFrame((state, delta) => {
    sphere.current?.rotateY(delta / 5);
  });

  return (
    <>
      <Text position={[0, 15, 0]} color={0xffffff}>
        Scadrial
      </Text>
      <Sphere ref={sphere} args={[10, 50, 50]}>
        <meshStandardMaterial
          attach="material"
          map={texture}
          roughnessMap={roughnessTexture}
          displacementMap={displacementTexture}
          normalMap={normalTexture}
          aoMap={aoTexture}
        />
      </Sphere>
    </>
  );
});

export default Planet;
