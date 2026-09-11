import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

export default function PageHeader({ eyebrow, title, subtitle, dark = false, image = IMAGES.brandStory, children }) {
  return (
    <div className={cn("border-b", dark ? "border-white/10 bg-navy text-white" : "border-border bg-secondary")}>
      <div className="container-edge grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_280px] lg:gap-12 lg:py-14">
        <div className="text-center lg:text-left">
          {eyebrow && <span className={cn("label-eyebrow", dark && "text-white/50")}>{eyebrow}</span>}
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && <p className={cn("mx-auto mt-3 max-w-md text-sm lg:mx-0", dark ? "text-white/60" : "text-muted-foreground")}>{subtitle}</p>}
          {children}
        </div>
        {image && <div className="hidden aspect-[4/3] overflow-hidden border border-border/50 bg-muted lg:block"><Image src={image} alt="" fittingType="fill" className="h-full w-full object-cover" /></div>}
      </div>
    </div>
  );
}