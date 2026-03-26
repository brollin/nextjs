import { useMemo } from "react";
import { Box } from "@chakra-ui/react";

const VB = { w: 1200, h: 800 };

type HillSpec = {
  baseline: number;
  amplitude: number;
  frequency: number;
  phase: number;
  fill: string;
};

const HILL_LAYERS: HillSpec[] = [
  { baseline: 340, amplitude: 22, frequency: 0.0048, phase: 0.4, fill: "#9EC4E8" },
  { baseline: 395, amplitude: 28, frequency: 0.0062, phase: 1.15, fill: "#7BA8D9" },
  { baseline: 455, amplitude: 34, frequency: 0.0075, phase: 2.3, fill: "#5A8CC4" },
  { baseline: 515, amplitude: 40, frequency: 0.0088, phase: 0.75, fill: "#3D6FA8" },
  { baseline: 575, amplitude: 36, frequency: 0.0095, phase: 3.1, fill: "#2A5580" },
];

function buildHillPath(
  width: number,
  height: number,
  baseline: number,
  amplitude: number,
  frequency: number,
  phase: number,
  steps = 240,
): string {
  const y0 = baseline + amplitude * Math.sin(phase);
  let d = `M 0 ${height + 1} L 0 ${y0}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = baseline + amplitude * Math.sin(frequency * x + phase);
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += ` L ${width} ${height + 1} Z`;
  return d;
}

export default function LandscapeBackground() {
  const paths = useMemo(
    () =>
      HILL_LAYERS.map((layer) =>
        buildHillPath(VB.w, VB.h, layer.baseline, layer.amplitude, layer.frequency, layer.phase),
      ),
    [],
  );

  return (
    <Box position="fixed" inset={0} zIndex={0} pointerEvents="none" aria-hidden overflow="hidden">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ minHeight: "100vh", display: "block" }}
      >
        <defs>
          <linearGradient id="landing-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8D9F5" />
            <stop offset="45%" stopColor="#8FC0EA" />
            <stop offset="100%" stopColor="#6BA6D9" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#landing-sky)" />
        {HILL_LAYERS.map((layer, i) => (
          <path key={i} d={paths[i]} fill={layer.fill} />
        ))}
      </svg>
    </Box>
  );
}
