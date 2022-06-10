const PlanetView = ({ className, cx, cy, r, color }) => (
  <>
    <defs>
      <radialGradient id="planetGradient" cx="0.5" cy="0.5" r="0.55" fx="0.25" fy="0.25">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="black" />
      </radialGradient>
    </defs>
    <circle className={className} cx={cx} cy={cy} r={r} fill="url(#planetGradient)" />
  </>
);

export default PlanetView;
