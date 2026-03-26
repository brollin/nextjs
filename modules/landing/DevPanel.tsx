import {
  Box,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import {
  DEFAULT_MOUNTAIN_COUNT,
  MAX_MOUNTAIN_COUNT,
  MIN_MOUNTAIN_COUNT,
} from "./hillLayers";

type DevPanelProps = {
  mountainCount: number;
  onMountainCountChange: (value: number) => void;
};

export default function DevPanel({ mountainCount, onMountainCountChange }: DevPanelProps) {
  return (
    <Box
      minW={{ base: "200px", sm: "220px" }}
      px={3}
      py={2}
      borderRadius="md"
      bg="rgba(20, 30, 45, 0.88)"
      backdropFilter="blur(10px)"
      boxShadow="md"
      borderWidth="1px"
      borderColor="whiteAlpha.300"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Text fontSize="10px" fontWeight="bold" color="whiteAlpha.700" letterSpacing="0.08em" mb={2}>
        DEV
      </Text>
      <FormControl size="sm">
        <FormLabel fontSize="xs" mb={1} color="gray.200">
          Mountain layers
        </FormLabel>
        <NumberInput
          size="sm"
          value={mountainCount}
          min={MIN_MOUNTAIN_COUNT}
          max={MAX_MOUNTAIN_COUNT}
          clampValueOnBlur
          onChange={(_, v) => {
            if (Number.isFinite(v)) onMountainCountChange(v);
          }}
        >
          <NumberInputField
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            color="gray.100"
            rounded="md"
          />
          <NumberInputStepper>
            <NumberIncrementStepper borderColor="whiteAlpha.300" color="gray.300" />
            <NumberDecrementStepper borderColor="whiteAlpha.300" color="gray.300" />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Text fontSize="10px" color="whiteAlpha.500" mt={2}>
        Default {DEFAULT_MOUNTAIN_COUNT} · double-click sky to hide
      </Text>
    </Box>
  );
}
