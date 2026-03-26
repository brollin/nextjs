import { Box, FormControl, FormLabel, HStack, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
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

type DevNumberRowProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  isInteger?: boolean;
  onChange: (value: number) => void;
};

function clampToStep(value: number, min: number, max: number, step: number, isInteger: boolean): number {
  let v = Math.min(max, Math.max(min, value));
  if (isInteger) {
    return Math.round(v);
  }
  const snapped = Math.round((v - min) / step) * step + min;
  return Math.min(max, Math.max(min, Number(snapped.toFixed(6))));
}

function DevNumberRow({ value, min, max, step = 1, isInteger = false, onChange }: DevNumberRowProps) {
  const inc = () => {
    onChange(clampToStep(value + step, min, max, step, isInteger));
  };
  const dec = () => {
    onChange(clampToStep(value - step, min, max, step, isInteger));
  };

  return (
    <HStack spacing={3} align="stretch" w="100%">
      <Input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        size="md"
        h="44px"
        flex={1}
        minW={0}
        bg="whiteAlpha.100"
        borderColor="whiteAlpha.300"
        color="gray.100"
        borderRadius="lg"
        fontSize="sm"
        onChange={(e) => {
          const raw = parseFloat(e.target.value);
          if (!Number.isFinite(raw)) return;
          onChange(clampToStep(raw, min, max, step, isInteger));
        }}
      />
      <VStack
        spacing={0}
        flexShrink={0}
        w="44px"
        h="44px"
        borderWidth="1px"
        borderColor="whiteAlpha.300"
        borderRadius="lg"
        overflow="hidden"
        bg="whiteAlpha.100"
      >
        <IconButton
          aria-label="Increase"
          icon={<IoChevronUp size={22} />}
          variant="ghost"
          size="sm"
          flex={1}
          minH={0}
          h="50%"
          borderRadius={0}
          color="gray.200"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={inc}
        />
        <IconButton
          aria-label="Decrease"
          icon={<IoChevronDown size={22} />}
          variant="ghost"
          size="sm"
          flex={1}
          minH={0}
          h="50%"
          borderRadius={0}
          borderTopWidth="1px"
          borderColor="whiteAlpha.300"
          color="gray.200"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={dec}
        />
      </VStack>
    </HStack>
  );
}

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
      minW={{ base: "240px", sm: "280px" }}
      maxW="min(100vw - 32px, 320px)"
      maxH="70vh"
      overflowY="auto"
      m={0}
      p={5}
      borderRadius="lg"
      bg="rgba(20, 30, 45, 0.92)"
      backdropFilter="blur(12px)"
      boxShadow="xl"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Text fontSize="11px" fontWeight="bold" color="whiteAlpha.800" letterSpacing="0.12em" mb={5} textAlign="left">
        DEV
      </Text>

      <FormControl size="md" mb={6}>
        <FormLabel fontSize="sm" mb={2} color="gray.200" fontWeight="medium">
          Seed
        </FormLabel>
        <DevNumberRow
          value={hillSeed}
          min={MIN_HILL_SEED}
          max={MAX_HILL_SEED}
          step={1}
          isInteger
          onChange={onHillSeedChange}
        />
        <Text fontSize="xs" color="whiteAlpha.500" mt={2} lineHeight="short">
          Same seed → same hills; reuse for future random features.
        </Text>
      </FormControl>

      <FormControl size="md" mb={6}>
        <FormLabel fontSize="sm" mb={2} color="gray.200" fontWeight="medium">
          Mountain layers
        </FormLabel>
        <DevNumberRow
          value={mountainCount}
          min={MIN_MOUNTAIN_COUNT}
          max={MAX_MOUNTAIN_COUNT}
          step={1}
          isInteger
          onChange={onMountainCountChange}
        />
      </FormControl>

      <FormControl size="md" mb={6}>
        <FormLabel fontSize="sm" mb={2} color="gray.200" fontWeight="medium">
          Harmonics / layer
        </FormLabel>
        <DevNumberRow
          value={harmonicsPerLayer}
          min={MIN_HARMONICS_PER_LAYER}
          max={MAX_HARMONICS_PER_LAYER}
          step={1}
          isInteger
          onChange={onHarmonicsPerLayerChange}
        />
        <Text fontSize="xs" color="whiteAlpha.500" mt={2} lineHeight="short">
          Sine terms summed per ridge (1 = plain sine).
        </Text>
      </FormControl>

      <FormControl size="md" mb={6}>
        <FormLabel fontSize="sm" mb={2} color="gray.200" fontWeight="medium">
          Frequency spread
        </FormLabel>
        <DevNumberRow
          value={frequencySpread}
          min={MIN_FREQUENCY_SPREAD}
          max={MAX_FREQUENCY_SPREAD}
          step={0.05}
          onChange={onFrequencySpreadChange}
        />
        <Text fontSize="xs" color="whiteAlpha.500" mt={2} lineHeight="short">
          Each harmonic’s frequency × this vs the previous (detail scale).
        </Text>
      </FormControl>

      <FormControl size="md">
        <FormLabel fontSize="sm" mb={2} color="gray.200" fontWeight="medium">
          High-freq falloff
        </FormLabel>
        <DevNumberRow
          value={highFrequencyFalloff}
          min={MIN_HIGH_FREQ_FALLOFF}
          max={MAX_HIGH_FREQ_FALLOFF}
          step={0.02}
          onChange={onHighFrequencyFalloffChange}
        />
        <Text fontSize="xs" color="whiteAlpha.500" mt={2} lineHeight="short">
          Amplitude × this for each higher harmonic (lower = smoother).
        </Text>
      </FormControl>
    </Box>
  );
}
