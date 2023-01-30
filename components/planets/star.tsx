type Props = {
  className?: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
};

const StarView = ({ className, cx, cy, r, color }: Props) => (
  <>
    <defs>
      <radialGradient id="starGradient" cx="0.5" cy="0.5" r="0.55" fx="0.25" fy="0.25">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="black" />
      </radialGradient>
    </defs>
    <circle className={className} cx={cx} cy={cy} r={r} fill="url(#starGradient)" />
  </>
);

export default StarView;
