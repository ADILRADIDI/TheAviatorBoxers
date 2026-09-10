import { useState } from "react";
import { Mail } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import { STORE } from "@/lib/store";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <section className="bg-navy py-20 text-white lg:py-24">
      <div className="container-edge max-w-2xl text-center">
        <Reveal>
          <Mail className="mx-auto h-8 w-8 text-accent-lime" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Rejoignez le club The Aviator
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Recevez en avant-première nos nouveautés, offres exclusives et conseils.
          </p>
        </Reveal>

        {done ? (
          <Reveal delay={0.1}>
            <div className="mt-8 border border-accent-lime bg-accent-lime/10 px-6 py-5">
              <p className="text-sm font-medium text-accent-lime">✓ Merci ! Vous êtes inscrit à notre newsletter.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-accent-lime focus:outline-none"
              />
              <button type="submit" className="btn-shine bg-accent-lime px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-navy transition-colors hover:bg-white">
                S'inscrire
              </button>
            </form>
            <p className="mt-3 text-xs text-white/40">
              En vous inscrivant, vous acceptez de recevoir des emails de {STORE.name}.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}