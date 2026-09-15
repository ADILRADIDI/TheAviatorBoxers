import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="storefront-app flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-2.5">
            <span className="font-display text-2xl tracking-[0.35em] text-foreground">THE AVIATOR</span>
            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 bg-[hsl(72_74%_52%)]" />
              {"·"}
              <span>Confiance depuis le Maroc</span>
            </span>
          </Link>
        </div>

        <div className="relative overflow-hidden border border-border bg-background">
          <span className="absolute left-0 top-0 h-[3px] w-full bg-[hsl(72_74%_52%)]" />
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-[hsl(72_74%_52%)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h1 className="font-display text-2xl leading-tight text-foreground">{title}</h1>
                {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            <div className="mt-7">{children}</div>
          </div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-xs text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}