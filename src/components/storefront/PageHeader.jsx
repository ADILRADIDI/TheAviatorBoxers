import { cn } from "@/lib/utils";

export default function PageHeader({ eyebrow, title, subtitle, dark = false, children }) {
  return (
    <div className={cn("border-b", dark ? "border-white/10 bg-navy text-white" : "border-border bg-secondary")}>
      <div className="container-edge py-12 text-center lg:py-16">
        {eyebrow && <span className={cn("label-eyebrow", dark && "text-white/50")}>{eyebrow}</span>}
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && <p className={cn("mx-auto mt-3 max-w-md text-sm", dark ? "text-white/60" : "text-muted-foreground")}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}