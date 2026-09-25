import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

// ponytail: no size-per-color filtering — every piece picks from the same
// colorOptions + sizeOptions. Upgrade when per-color stock arrives.
export default function PackBuilder({ pieces, colorOptions, sizeOptions, onChange }) {
  const { t } = useLanguage();

  const setField = (index, patch) => {
    const next = pieces.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChange(next);
  };

  return (
    <div className="space-y-5">
      {pieces.map((piece, index) => (
        <div key={index} className="rounded-sm border border-border/60 p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/70">
            {t("Pièce")} {index + 1}
          </span>

          <div className="mt-3">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-ink/80">
              {t("Couleur")}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {colorOptions.map((c) => {
                const active = piece.color === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    onClick={() => setField(index, { color: c.name })}
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                      active
                        ? "border-[#C7D400] ring-2 ring-[#C7D400]/30"
                        : "border-foreground/15 hover:border-foreground/40",
                    )}
                  >
                    <span
                      className="h-7 w-7 rounded-full"
                      style={c.hex ? { backgroundColor: c.hex } : undefined}
                    >
                      {!c.hex && <span className="block h-7 w-7 rounded-full bg-foreground/10" />}
                    </span>
                    {active && <Check className="absolute h-4 w-4 text-navy drop-shadow" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-ink/80">
              {t("Taille")}
            </span>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((itemSize) => (
                <button
                  key={itemSize}
                  type="button"
                  onClick={() => setField(index, { size: itemSize })}
                  className={cn(
                    "chip min-w-[3rem] justify-center px-0",
                    piece.size === itemSize && "is-on",
                  )}
                >
                  {itemSize}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}