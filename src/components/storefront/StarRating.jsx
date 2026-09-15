import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Star rating — filled stars in accent lime, empty in muted outline.
export default function StarRating({ value = 5, size = 14, className, showValue = false, count }) {
  const stars = [1, 2, 3, 4, 5];
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5">
        {stars.map((s) => (
          <Star
            key={s}
            style={{ width: size, height: size }}
            className={cn(
              s <= rounded ? "fill-[hsl(72_74%_52%)] text-[hsl(72_74%_52%)]" : "fill-transparent text-foreground/25",
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground">
          <span className="font-bold text-foreground">{Number(value).toFixed(1)}</span>
          {count != null ? ` (${count})` : ""}
        </span>
      )}
    </span>
  );
}