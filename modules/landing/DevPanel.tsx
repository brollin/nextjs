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
  DEFAULT_FREQUENCY_SPREAD,
  DEFAULT_HARMONICS_PER_LAYER,
  DEFAULT_HIGH_FREQ_FALLOFF,
  DEFAULT_HILL_SEED,
  DEFAULT_MOUNTAIN_COUNT,
  MAX_FREQUENCY_SPREAD,
  MAX_HARMONICS_PER_LAYER,
  MAX_HIGH_FREQ_FALLOFF,
  MAX_HILL_SEED,
  MAX_MOUNTAIN_COUNT,
  MIN_FREQUENCY_SPREAD,
  MIN_HARMONICS_PER_LAYER,
  MIN_HIGH_FREQ_FALLOFF,
  MIN_HILL_SEED,
  MIN_MOUNTAIN_COUNT,
} from "./hillLayers";

type DevPanelProps = {
  mountainCount: number;
  onMountainCountChange: (value: number) => void;
  hillSeed: number;
  onHillSeedChange: (value: number) => void;
  harmonicsPerLayer: number;
  onHarmonicsPerLayerChange: (value: number) => void;
  frequencySpread: number;
  onFrequencySpreadChange: (value: number) => void;
  highFrequencyFalloff: number;
  onHighFrequencyFalloffChange: (value: number) => void;
};

export default function DevPanel({
  mountainCount,
  onMountainCountChange,
  hillSeed,
  onHillSeedChange,
  harmonicsPerLayer,
  onHarmonicsPerLayerChange,
  frequencySpread,
  onFrequencySpreadChange,
  highFrequencyFalloff,
  onHighFrequencyFalloffChange,
}: DevPanelProps) {
  return (
    <Box
      minW={{ base: "200px", sm: "240px" }}
      maxH="70vh"
      overflowY="auto"
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

      <FormControl size="sm" mb={3}>
        <FormLabel fontSize="xs" mb={1} color="gray.200">
          Seed
        </FormLabel>
        <NumberInput
          size="sm"
          value={hillSeed}
          min={MIN_HILL_SEED}
          max={MAX_HILL_SEED}
          clampValueOnBlur
          onChange={(_, v) => {
            if (Number.isFinite(v)) onHillSeedChange(v);
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
        <Text fontSize="10px" color="whiteAlpha.500" mt={1}>
          Same seed → same hills; reuse for future random features.
        </Text>
      </FormControl>

      <FormControl size="sm" mb={3}>
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

      <FormControl size="sm" mb={3}>
        <FormLabel fontSize="xs" mb={1} color="gray.200">
          Harmonics / layer
        </FormLabel>
        <NumberInput
          size="sm"
          value={harmonicsPerLayer}
          min={MIN_HARMONICS_PER_LAYER}
          max={MAX_HARMONICS_PER_LAYER}
          clampValueOnBlur
          onChange={(_, v) => {
            if (Number.isFinite(v)) onHarmonicsPerLayerChange(v);
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
        <Text fontSize="10px" color="whiteAlpha.500" mt={1}>
          Sine terms summed per ridge (1 = plain sine).
        </Text>
      </FormControl>

      <FormControl size="sm" mb={3}>
        <FormLabel fontSize="xs" mb={1} color="gray.200">
          Frequency spread
        </FormLabel>
        <NumberInput
          size="sm"
          value={frequencySpread}
          min={MIN_FREQUENCY_SPREAD}
          max={MAX_FREQUENCY_SPREAD}
          step={0.05}
          clampValueOnBlur
          onChange={(_, v) => {
            if (Number.isFinite(v)) onFrequencySpreadChange(v);
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
        <Text fontSize="10px" color="whiteAlpha.500" mt={1}>
          Each harmonic’s frequency × this vs the previous (detail scale).
        </Text>
      </FormControl>

      <FormControl size="sm" mb={2}>
        <FormLabel fontSize="xs" mb={1} color="gray.200">
          High-freq falloff
        </FormLabel>
        <NumberInput
          size="sm"
          value={highFrequencyFalloff}
          min={MIN_HIGH_FREQ_FALLOFF}
          max={MAX_HIGH_FREQ_FALLOFF}
          step={0.02}
          clampValueOnBlur
          onChange={(_, v) => {
            if (Number.isFinite(v)) onHighFrequencyFalloffChange(v);
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
        <Text fontSize="10px" color="whiteAlpha.500" mt={1}>
          Amplitude × this for each higher harmonic (lower = smoother).
        </Text>
      </FormControl>

      <Text fontSize="10px" color="whiteAlpha.500" mt={1}>
        Defaults: seed {DEFAULT_HILL_SEED}, layers {DEFAULT_MOUNTAIN_COUNT}, harmonics{" "}
        {DEFAULT_HARMONICS_PER_LAYER}, spread {DEFAULT_FREQUENCY_SPREAD}, falloff {DEFAULT_HIGH_FREQ_FALLOFF} ·
        double-click sky to hide
      </Text>
    </Box>
  );
}
