import React, { useContext, useRef } from "react";
import { Group, Mesh, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { action } from "mobx";

import Country from "@/modules/capitalizer/models/Country";
import StoreContext from "@/modules/capitalizer/models/StoreContext";
import CapitalGroup from "@/modules/capitalizer/components/CapitalGroup";
import {
  countryLabelFontSize,
  TEXT_BASE_Z,
  CAPITAL_BASE_Z,
  COUNTRY_BASE_Z,
} from "@/modules/capitalizer/countryHelpers";

const SELECTED_COLOR = "rebeccapurple";

type CountryMeshProps = {
  isSelected: boolean;
  country: Country;
};

const CountryMesh = observer(({ isSelected, country }: CountryMeshProps) => {
  const store = useContext(StoreContext);
  const meshRef = useRef<Mesh>(null);
  const textRef = useRef<Object3D>(null);
  const capitalRef = useRef<Group>(null);

  const { shapes, displayName, name, color, centerCoordinates } = country;

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

  return (
    <>
      {isSelected && store.gameMode === "learn" ? <CapitalGroup country={country} ref={capitalRef} /> : null}
      <Text
        ref={textRef}
        outlineColor={0x000000}
        outlineWidth={0.01}
        fontSize={countryLabelFontSize(country)}
        color={0xffffff}
        position={new Vector3(centerCoordinates.lon, centerCoordinates.lat, TEXT_BASE_Z)}
      >
        {displayName}
      </Text>
      <mesh
        userData={{ name }}
        onClick={action((e) => store.advance(e.eventObject.userData.name))}
        key={name}
        ref={meshRef}
      >
        <shapeGeometry attach="geometry" args={[shapes]} />
        <meshBasicMaterial attach="material" color={isSelected ? SELECTED_COLOR : color} />
      </mesh>
    </>
  );
});

export default CountryMesh;
