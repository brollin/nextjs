import {
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

/** Matches `<linearGradient … offset="45%">` for the middle stop. */
const SKY_MID_T = 0.45;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorTop;
uniform vec3 uColorMid;
uniform vec3 uColorBot;
uniform float uMidPos;
varying vec2 vUv;

void main() {
  float p = vUv.y;
  vec3 c;
  if (p >= uMidPos) {
    float denom = max(1.0 - uMidPos, 0.0001);
    c = mix(uColorMid, uColorTop, (p - uMidPos) / denom);
  } else {
    float denom = max(uMidPos, 0.0001);
    c = mix(uColorBot, uColorMid, p / denom);
  }
  gl_FragColor = vec4(c, 1.0);
}
`;

function InvalidateBinder({ outRef }: { outRef: MutableRefObject<(() => void) | null> }) {
  const { invalidate: inv } = useThree();
  useLayoutEffect(() => {
    outRef.current = () => inv();
    return () => {
      outRef.current = null;
    };
  }, [inv, outRef]);
  return null;
}

type SkyQuadProps = {
  materialRef: MutableRefObject<THREE.ShaderMaterial | null>;
};

function SkyQuad({ materialRef }: SkyQuadProps) {
  const uniforms = useMemo(
    () => ({
      uColorTop: { value: new THREE.Color("#B8D9F5") },
      uColorMid: { value: new THREE.Color("#8FC0EA") },
      uColorBot: { value: new THREE.Color("#6BA6D9") },
      uMidPos: { value: SKY_MID_T },
    }),
    [],
  );

  return (
    <mesh frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export type LandscapeSkyCanvasHandle = {
  setSkyColors(topHex: string, midHex: string, botHex: string): void;
};

type LandscapeSkyCanvasProps = {
  apiRef: MutableRefObject<LandscapeSkyCanvasHandle | null>;
};

/**
 * Full-viewport vertical three-stop sky gradient (WebGL). Matches the old SVG linearGradient.
 * Uses `frameloop="demand"` — only redraws when `setSkyColors` runs.
 */
export default function LandscapeSkyCanvas({ apiRef }: LandscapeSkyCanvasProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const invalidateRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    apiRef.current = {
      setSkyColors(topHex: string, midHex: string, botHex: string) {
        const m = materialRef.current;
        if (!m) return;
        m.uniforms.uColorTop.value.set(topHex);
        m.uniforms.uColorMid.value.set(midHex);
        m.uniforms.uColorBot.value.set(botHex);
        invalidateRef.current?.();
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef]);

  return (
    <Canvas
      orthographic
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      frameloop="demand"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor("#6BA6D9", 1);
        invalidate();
      }}
    >
      <InvalidateBinder outRef={invalidateRef} />
      <OrthographicCamera
        makeDefault
        left={-1}
        right={1}
        top={1}
        bottom={-1}
        near={0}
        far={2}
        position={[0, 0, 1]}
      />
      <SkyQuad materialRef={materialRef} />
    </Canvas>
  );
}
