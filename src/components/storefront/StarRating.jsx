import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({ value = 5, size = 14, className, showValue = false, count }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex">
        {stars.map((s) => (
          <Star
            key={s}
            style={{ width: size, height: size }}
            className={cn(
              s <= Math.round(value) ? "fill-foreground text-foreground" : "fill-muted text-muted",
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground">
          {Number(value).toFixed(1)}
          {count != null ? ` (${count})` : ""}
        </span>
      )}
    </span>
  );
}