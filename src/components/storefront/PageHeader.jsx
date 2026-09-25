import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

// Editorial page header:
// - dark -> full-bleed fading background image under navy ink + lime eyebrow
// - light -> typographic hero with a lime-offset framed image block
export default function PageHeader({ eyebrow, title, subtitle, dark = false, image = IMAGES.brandStory, titleClassName = "text-5xl sm:text-6xl lg:text-[4.5rem]", children }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        dark ? "border-white/10 bg-navy text-white" : "border-border bg-paper text-ink",
      )}
    >
      {dark && image ? (
        <div className="absolute inset-0 opacity-[0.09]">
          <Image src={image} alt="" fittingType="fill" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="container-edge relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_320px] lg:gap-14 lg:py-24">
        <div className="text-center lg:text-left">
          {eyebrow && (
            <span className={cn("label-eyebrow flex items-center justify-center gap-2.5 lg:justify-start", dark ? "text-white/45" : "text-ink/45")}>
              <span className="h-1 w-1 shrink-0 rounded-full bg-[#C7D400]" />
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              "mt-5 font-heading leading-[0.95] tracking-tight",
              titleClassName,
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={cn("mx-auto mt-5 max-w-xl text-sm leading-relaxed lg:mx-0 lg:text-base", dark ? "text-white/60" : "text-ink/60")}>
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {image && !dark && (
          <div className="media-frame hidden lg:block">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <Image src={image} alt="" fittingType="fill" className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}