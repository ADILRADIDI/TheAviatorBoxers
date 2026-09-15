import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

// Editorial section heading: lime eyebrow, display title, kicker.
export default function SectionHeading({ eyebrow, title, sub, dark = false, center = false, action, className }) {
  return (
    <Reveal className={cn("w-full", className)}>
      <div className={cn("flex w-full flex-col gap-4", center && "items-center text-center")}>
        {eyebrow && (
          <span className={cn("label-eyebrow flex items-center gap-2.5", center && "w-full justify-center", dark ? "text-white/45" : "text-ink/45")}>
            <span className="h-1 w-1 shrink-0 rounded-full bg-[hsl(72_74%_52%)]" />
            {eyebrow}
          </span>
        )}
        {title && (
          <h2
            className={cn(
              "font-display leading-[0.95] tracking-tight",
              "text-3xl sm:text-4xl lg:text-5xl",
              dark ? "text-white" : "text-ink",
            )}
          >
            {title}
          </h2>
        )}
        {sub && (
          <p className={cn("max-w-xl text-sm leading-relaxed sm:text-base", dark ? "text-white/60" : "text-ink/60", center && "mx-auto")}>
            {sub}
          </p>
        )}
        {action}
      </div>
    </Reveal>
  );
}