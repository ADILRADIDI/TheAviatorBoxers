import { Truck, Package, RefreshCw, Banknote, MapPin, Clock } from "lucide-react";
import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Reveal from "@/components/storefront/Reveal";
import { STORE } from "@/lib/store";

export default function ShippingReturns() {
  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow="Informations" title="Livraison & Retours" subtitle="Tout ce qu'il faut savoir sur la livraison et les retours." />

      <div className="container-edge py-12 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Delivery */}
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center bg-navy/5 text-navy"><Truck className="h-6 w-6" /></div>
              <h2 className="font-display text-2xl font-bold">Livraison</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>Nous livrons partout au Maroc, dans toutes les villes du Royaume. Voici les informations essentielles :</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Délai :</strong> 24 à 48h ouvrées après confirmation de la commande.</span></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Zones :</strong> Toutes les villes du Maroc sont desservies.</span></li>
                <li className="flex items-start gap-3"><Banknote className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Frais :</strong> Calculés selon votre ville. Livraison gratuite dès {STORE.freeShippingThreshold} DH d'achat.</span></li>
                <li className="flex items-start gap-3"><Package className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Suivi :</strong> Vous recevez une confirmation et un appel avant la livraison.</span></li>
              </ul>
            </div>
          </section>

          {/* Process */}
          <section className="border border-border bg-secondary p-6 lg:p-8">
            <h3 className="font-display text-xl font-bold">Comment ça marche ?</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                { n: "1", t: "Commande", d: "Vous validez votre commande en ligne ou via WhatsApp." },
                { n: "2", t: "Préparation", d: "Nous préparons et expédions votre colis sous 24h." },
                { n: "3", t: "Livraison", d: "Le livreur vous contacte et vous remet le colis. Vous payez à la réception." },
              ].map((step) => (
                <div key={step.n}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">{step.n}</div>
                  <h4 className="mt-3 text-sm font-bold">{step.t}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{step.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Returns */}
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center bg-navy/5 text-navy"><RefreshCw className="h-6 w-6" /></div>
              <h2 className="font-display text-2xl font-bold">Retours & Échanges</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>Votre satisfaction est notre priorité. Si un produit ne vous convient pas, voici notre politique de retour :</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Délai de retour :</strong> 7 jours après réception du produit.</span></li>
                <li className="flex items-start gap-3"><Package className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Condition :</strong> Le produit doit être intact, non porté et dans son emballage d'origine.</span></li>
                <li className="flex items-start gap-3"><RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Échange :</strong> Échange possible pour une autre taille ou couleur, selon disponibilité.</span></li>
                <li className="flex items-start gap-3"><Banknote className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">Remboursement :</strong> Remboursement possible en cas de défaut produit.</span></li>
              </ul>
              <p className="mt-4 rounded border border-border bg-background p-4 text-xs">Pour initier un retour, contactez-nous via WhatsApp en indiquant votre numéro de commande. Les frais de retour sont à la charge du client, sauf en cas de défaut produit.</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}