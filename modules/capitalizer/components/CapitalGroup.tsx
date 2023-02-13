import { forwardRef, Ref } from "react";
import { Group, Vector3 } from "three";
import { Circle, Text } from "@react-three/drei";

import { capitalLabelOffset, CAPITAL_BASE_Z, countryLabelFontSize, TEXT_BASE_Z } from "@/modules/capitalizer/helpers";
import Country from "@/modules/capitalizer/models/Country";

type CapitalGroupProps = {
  country: Country;
};

const CapitalGroupWithRef = ({ country }: CapitalGroupProps, ref: Ref<Group>) => {
  const { capitalCoordinates, width, capital } = country;

  if (!capitalCoordinates) return null;

  return (
    <group ref={ref}>
      <Circle
        args={[Math.min(width / 100, 0.2), 12]}
        position={new Vector3(capitalCoordinates.lon, capitalCoordinates.lat, CAPITAL_BASE_Z)}
        material-color="hotpink"
      />
      <Text
        outlineColor={0x000000}
        outlineWidth={0.01}
        fontSize={countryLabelFontSize(country) * 0.65}
        color={0xffffff}
        position={
          new Vector3(capitalCoordinates.lon, capitalCoordinates.lat + capitalLabelOffset(country), TEXT_BASE_Z)
        }
      >
        {capital}
      </Text>
    </group>
  );
};

const CapitalGroup = forwardRef(CapitalGroupWithRef);

export default CapitalGroup;
