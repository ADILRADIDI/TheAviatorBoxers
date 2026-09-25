import { cn } from "@/lib/utils";

const FILL = "#C7D400";
const EMPTY = "hsl(0 0% 0% / 0.08)";

export default function RatingInput({ label, value, max = 5, onChange, className = "" }) {
  const parsed = Number(value);
  const current = Math.max(0, Math.min(max, Number.isFinite(parsed) ? parsed : 0));
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n <= current}
            aria-label={`${label} ${n} sur ${max}`}
            onClick={() => onChange(n)}
            style={{ background: n <= current ? FILL : EMPTY }}
            className="h-9 w-9 rounded-full transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        );
      })}
    </div>
  );
}