import { cn } from "@/lib/utils";

// The Aviator emblem: stylized 'A' with horizontal wings
export function AviatorEmblem({ className }) {
  return (
    <svg viewBox="0 0 48 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Left wing */}
      <path d="M2 22 L18 22 L24 16 L14 16 Z" fill="currentColor" />
      {/* Right wing */}
      <path d="M46 22 L30 22 L24 16 L34 16 Z" fill="currentColor" />
      {/* A frame */}
      <path d="M24 6 L36 34 L29 34 L27 28 L21 28 L19 34 L12 34 Z M23 23 L25 23 L24 19 Z" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ variant = "dark", showText = true, className, emblemClassName }) {
  const isLight = variant === "light";
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <AviatorEmblem className={cn("h-6 w-7", isLight ? "text-white" : "text-navy", emblemClassName)} />
      <span className={cn("mt-1 h-px w-9 bg-accent-lime")} />
      <span className="mt-1 flex flex-col items-center">
        <span className={cn("text-[8px] font-semibold uppercase tracking-[0.3em]", isLight ? "text-white/70" : "text-muted-foreground")}>The</span>
        <span className={cn("font-display text-[15px] font-bold uppercase tracking-[0.2em]", isLight ? "text-white" : "text-navy")}>Aviator</span>
      </span>
    </span>
  );
}

// Compact horizontal lockup for navbar
export function LogoLockup({ variant = "dark", className }) {
  const isLight = variant === "light";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <AviatorEmblem className={cn("h-5 w-6 shrink-0", isLight ? "text-white" : "text-navy")} />
      <span className="flex flex-col leading-none">
        <span className={cn("h-px w-7 bg-accent-lime")} />
        <span className={cn("mt-1 font-display text-[13px] font-bold uppercase tracking-[0.18em]", isLight ? "text-white" : "text-navy")}>
          The Aviator
        </span>
      </span>
    </span>
  );
}