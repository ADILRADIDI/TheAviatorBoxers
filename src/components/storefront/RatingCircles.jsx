import { cn } from "@/lib/utils";

const FILL = "#C7D400";
const EMPTY = "hsl(0 0% 0% / 0.08)";

export default function RatingCircles({ value, max = 5, size = 16, className = "" }) {
  const clamped = Math.max(0, Math.min(max, Number(value) || 0));
  const filled = Math.floor(clamped);
  const fraction = clamped - filled;
  return (
    <span role="img" aria-label={`${clamped.toFixed(1)} / ${max}`} className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, i) => {
        const style =
          i < filled
            ? { background: FILL }
            : i === filled && fraction > 0
              ? { background: `conic-gradient(${FILL} ${fraction * 360}deg, ${EMPTY} 0)` }
              : { background: EMPTY };
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{ width: size, height: size, borderRadius: "9999px", ...style }}
            className="inline-block"
          />
        );
      })}
    </span>
  );
}