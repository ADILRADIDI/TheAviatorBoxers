import { useState } from "react";
import { Mail } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import { STORE } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const { t } = useLanguage();

  const submit = (e) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[hsl(72_74%_52%)]/10 blur-3xl" />
      <div className="container-edge text-center">
        <Reveal>
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-white/15">
            <Mail className="h-6 w-6 text-[hsl(72_74%_52%)]" strokeWidth={1.5} />
          </span>
          <h2 className="mt-6 font-display text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("Rejoignez le club The Aviator")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
            {t("Recevez en avant-première nos nouveautés, offres exclusives et conseils.")}
          </p>
        </Reveal>

        {done ? (
          <Reveal delay={0.1}>
            <div className="mx-auto mt-8 flex max-w-md items-center gap-3 border border-[hsl(72_74%_52%)]/40 bg-[hsl(72_74%_52%)]/10 px-6 py-5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(72_74%_52%)]" />
              <p className="text-sm font-medium text-[hsl(72_74%_52%)]">{t("Merci ! Vous êtes inscrit à notre newsletter.")}</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Votre adresse email")}
                className="flex-1 border-b border-white/25 bg-transparent px-2 py-3 text-sm text-white placeholder:text-white/40 focus:border-[hsl(72_74%_52%)] focus:outline-none"
              />
              <button
                type="submit"
                className="btn-store btn-store--lime btn-sheen shrink-0"
              >
                {t("S'inscrire")}
              </button>
            </form>
            <p className="mt-4 text-xs text-white/40">
              {t("En vous inscrivant, vous acceptez de recevoir des emails")} de {STORE.name}.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}