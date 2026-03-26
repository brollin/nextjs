import { Box, FormControl, FormLabel, HStack, IconButton, Input, Tooltip, VStack } from "@chakra-ui/react";
import { IoChevronDown, IoChevronUp, IoInformationCircleOutline } from "react-icons/io5";
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
    <HStack spacing={2} align="stretch" w="100%">
      <Input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        size="sm"
        h="34px"
        flex={1}
        minW={0}
        bg="whiteAlpha.100"
        borderColor="whiteAlpha.300"
        color="gray.100"
        borderRadius="md"
        fontSize="xs"
        onChange={(e) => {
          const raw = parseFloat(e.target.value);
          if (!Number.isFinite(raw)) return;
          onChange(clampToStep(raw, min, max, step, isInteger));
        }}
      />
      <VStack
        spacing={0}
        flexShrink={0}
        w="34px"
        h="34px"
        borderWidth="1px"
        borderColor="whiteAlpha.300"
        borderRadius="md"
        overflow="hidden"
        bg="whiteAlpha.100"
      >
        <IconButton
          aria-label="Increase"
          icon={<IoChevronUp size={16} />}
          variant="ghost"
          size="xs"
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
          icon={<IoChevronDown size={16} />}
          variant="ghost"
          size="xs"
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

function LabelWithHint({ label, hint }: { label: string; hint: string }) {
  return (
    <FormLabel fontSize="xs" mb={1} color="gray.300" fontWeight="medium" display="flex" alignItems="center" gap={1}>
      {label}
      <Tooltip
        label={hint}
        fontSize="xs"
        px={3}
        py={2}
        maxW="280px"
        hasArrow
        placement="top"
        openDelay={200}
      >
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          cursor="help"
          color="whiteAlpha.500"
          _hover={{ color: "whiteAlpha.800" }}
          aria-label={`About ${label}`}
        >
          <IoInformationCircleOutline size={14} />
        </Box>
      </Tooltip>
    </FormLabel>
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
      minW={{ base: "220px", sm: "248px" }}
      w="100%"
      maxH="70vh"
      overflowY="auto"
      m={0}
      p={3}
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
      <FormControl size="sm" mb={4}>
        <LabelWithHint
          label="Seed"
          hint="Same seed → same hills; reuse for future random features."
        />
        <DevNumberRow
          value={hillSeed}
          min={MIN_HILL_SEED}
          max={MAX_HILL_SEED}
          step={1}
          isInteger
          onChange={onHillSeedChange}
        />
      </FormControl>

      <FormControl size="sm" mb={4}>
        <FormLabel fontSize="xs" mb={1} color="gray.300" fontWeight="medium">
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

      <FormControl size="sm" mb={4}>
        <LabelWithHint label="Harmonics / layer" hint="Sine terms summed per ridge (1 = plain sine)." />
        <DevNumberRow
          value={harmonicsPerLayer}
          min={MIN_HARMONICS_PER_LAYER}
          max={MAX_HARMONICS_PER_LAYER}
          step={1}
          isInteger
          onChange={onHarmonicsPerLayerChange}
        />
      </FormControl>

      <FormControl size="sm" mb={4}>
        <LabelWithHint
          label="Frequency spread"
          hint="Each harmonic’s frequency × this vs the previous (detail scale)."
        />
        <DevNumberRow
          value={frequencySpread}
          min={MIN_FREQUENCY_SPREAD}
          max={MAX_FREQUENCY_SPREAD}
          step={0.05}
          onChange={onFrequencySpreadChange}
        />
      </FormControl>

      <FormControl size="sm">
        <LabelWithHint
          label="High-freq falloff"
          hint="Amplitude × this for each higher harmonic (lower = smoother)."
        />
        <DevNumberRow
          value={highFrequencyFalloff}
          min={MIN_HIGH_FREQ_FALLOFF}
          max={MAX_HIGH_FREQ_FALLOFF}
          step={0.02}
          onChange={onHighFrequencyFalloffChange}
        />
      </FormControl>
    </Box>
  );
}
