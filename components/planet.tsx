export default function PlanetView({ className, r, cx, cy }) {
  return <circle className={className} r={r} cx={cx} cy={cy} fill="url(#planetGradient)" />;
}
