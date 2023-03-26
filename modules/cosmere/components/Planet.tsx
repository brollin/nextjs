import { observer } from "mobx-react-lite";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, Text, useTexture } from "@react-three/drei";
import { AdditiveBlending, Color, FrontSide, SphereGeometry, Vector2 } from "three";
import { useMemo, useRef } from "react";

import vertexShader from "@cosmere/shaders/glow/vertex.glsl";
import fragmentShader from "@cosmere/shaders/glow/fragment.glsl";

const Planet = observer(() => {
  const sphere = useRef<SphereGeometry>(null);

  const [planetTexture, roughnessTexture, displacementTexture, normalTexture, aoTexture] = useTexture([
    "/Rock_047/Rock_047_BaseColor.jpg",
    "/Rock_047/Rock_047_Roughness.jpg",
    "/Rock_047/Rock_047_Height.png",
    "/Rock_047/Rock_047_Normal.jpg",
    "/Rock_047/Rock_047_AmbientOcclusion.jpg",
  ]);

  const { camera, gl } = useThree();
  useFrame((state, delta) => {
    sphere.current?.rotateY(delta / 5);
  });

  const uniforms = useMemo(
    () => ({
      c: { type: "f", value: 1.0 },
      p: { type: "f", value: 1.0 },
      glowColor: { type: "c", value: new Color(0x0000b0) },
      viewVector: { type: "v3", value: camera.position },
    }),
    [camera.position]
  );

  // glow code
  // https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Shader-Glow.html
  // https://stemkoski.github.io/Three.js/Shader-Glow.html
  return (
    <>
      <Text position={[0, 15, 0]} color={0xffffff}>
        Scadrial
      </Text>
      <Sphere ref={sphere} args={[10, 400, 400]}>
        <meshStandardMaterial
          attach="material"
          map={planetTexture}
          roughnessMap={roughnessTexture}
          roughness={1}
          displacementMap={displacementTexture}
          displacementScale={0.7}
          normalMap={normalTexture}
          normalScale={new Vector2(0, 0)}
          aoMap={aoTexture}
        />
      </Sphere>
      {/* <mesh>
        <sphereGeometry args={[10.5]} />
        <shaderMaterial
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          side={FrontSide}
          blending={AdditiveBlending}
          transparent
        />
      </mesh> */}
    </>
  );
});

export default Planet;
