import React, { useContext, useRef } from "react";
import { Group, Mesh, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Circle, Text } from "@react-three/drei";
import { observer } from "mobx-react-lite";

import Country from "@/modules/capitalizer/models/Country";
import { Continent } from "@/modules/capitalizer/models/RawCountry";
import StoreContext from "@/modules/capitalizer/models/StoreContext";

const CONTINENT_COLOR: Record<Continent, number | string> = {
  Antarctica: 0xffffff,
  Asia: "indianred",
  Europe: "cornflowerblue",
  Americas: "darkseagreen",
  Africa: "darkgoldenrod",
  Oceania: "darkcyan",
};

const SELECTED_COLOR = "darkslateblue";

const COUNTRY_BASE_Z = 0;
const TEXT_BASE_Z = 0.21;
const CAPITAL_BASE_Z = COUNTRY_BASE_Z + 0.01;

const MIN_FONT_SIZE = 0.15;
const MAX_FONT_SIZE = 0.8;
const FONT_SIZE_FACTOR = 0.08;

const MIN_CAPITAL_OFFSET_SIZE = 0.15;
const MAX_CAPITAL_OFFSET_SIZE = 0.8;
const CAPITAL_OFFSET_FACTOR = 0.08;

type CountryMeshProps = {
  isSelected: boolean;
  country: Country;
};

const CountryMesh = observer(({ isSelected, country }: CountryMeshProps) => {
  const store = useContext(StoreContext);
  const meshRef = useRef<Mesh>(null);
  const textRef = useRef<Object3D>(null);
  const capitalRef = useRef<Group>(null);

  const { shapes, displayName, name, continent, centerCoordinates, width, capital, capitalCoordinates } = country;
  useFrame(() => {
    if (!isSelected) {
      if (meshRef.current?.position.z !== 0) {
        meshRef.current?.position.setZ(COUNTRY_BASE_Z);
        textRef.current?.position.setZ(TEXT_BASE_Z);
        capitalRef.current?.position.setZ(CAPITAL_BASE_Z);
      }
      return;
    }

    const newZ = 0.105 + 0.1 * Math.sin(((Date.now() % 1500) / 1500) * 2 * Math.PI);
    meshRef.current?.position.setZ(newZ);
    textRef.current?.position.setZ(newZ + 0.1);
    capitalRef.current?.position.setZ(newZ + CAPITAL_BASE_Z);
  });

  const fontSize = Math.min(Math.max(width * FONT_SIZE_FACTOR, MIN_FONT_SIZE), MAX_FONT_SIZE);
  const capitalOffset = Math.min(
    Math.max(width * CAPITAL_OFFSET_FACTOR, MIN_CAPITAL_OFFSET_SIZE),
    MAX_CAPITAL_OFFSET_SIZE
  );
  return (
    <>
      {capitalCoordinates && isSelected && store.gameMode === "learn" ? (
        <group ref={capitalRef}>
          <Circle
            args={[Math.min(width / 100, 0.5), 18]}
            position={new Vector3(capitalCoordinates.lon, capitalCoordinates.lat, CAPITAL_BASE_Z)}
            material-color="hotpink"
          />
          <Text
            fontSize={fontSize * 0.5}
            color={0xffffff}
            position={new Vector3(capitalCoordinates.lon, capitalCoordinates.lat - capitalOffset, TEXT_BASE_Z)}
          >
            {capital}
          </Text>
        </group>
      ) : null}
      <Text
        ref={textRef}
        outlineColor={0x000000}
        fontSize={fontSize}
        color={0xffffff}
        position={new Vector3(centerCoordinates.lon, centerCoordinates.lat, TEXT_BASE_Z)}
      >
        {displayName}
      </Text>
      <mesh key={name} ref={meshRef}>
        <shapeGeometry attach="geometry" args={[shapes]} />
        <meshBasicMaterial attach="material" color={isSelected ? SELECTED_COLOR : CONTINENT_COLOR[continent]} />
      </mesh>
    </>
  );
});

export default CountryMesh;
