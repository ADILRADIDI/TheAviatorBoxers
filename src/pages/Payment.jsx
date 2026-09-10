import { Banknote, ShieldCheck, Lock, CreditCard, Check } from "lucide-react";
import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Reveal from "@/components/storefront/Reveal";

export default function Payment() {
  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow="Informations" title="Paiement" subtitle="Des options de paiement simples et sécurisées." />

      <div className="container-edge py-12 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {/* COD */}
          <Reveal>
            <div className="border border-border bg-background p-6 lg:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center bg-accent-lime/20 text-navy">
                  <Banknote className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Paiement à la livraison (COD)</h2>
                  <p className="text-sm text-muted-foreground">Disponible partout au Maroc</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Le paiement à la livraison est notre méthode de paiement principale.
                Vous payez en espèces directement au livreur au moment de la réception
                de votre commande. Aucun paiement anticipé n'est requis.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Aucun paiement en ligne nécessaire",
                  "Payez uniquement à la réception du colis",
                  "Vérifiez votre commande avant de payer",
                  "Disponible dans toutes les villes du Maroc",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent-lime" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Online payment coming soon */}
          <Reveal delay={0.1}>
            <div className="border border-dashed border-border p-6 lg:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center bg-muted text-muted-foreground">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Paiement en ligne</h2>
                  <p className="text-sm text-muted-foreground">Bientôt disponible</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Nous travaillons à intégrer le paiement en ligne sécurisé (carte bancaire)
                pour vous offrir encore plus de flexibilité. En attendant, le paiement
                à la livraison reste disponible partout au Maroc.
              </p>
            </div>
          </Reveal>

          {/* Security */}
          <Reveal delay={0.2}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4 border border-border p-6">
                <ShieldCheck className="h-6 w-6 shrink-0 text-navy" />
                <div>
                  <h3 className="text-sm font-bold">Données protégées</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Vos informations personnelles sont traitées de manière confidentielle et sécurisée.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-border p-6">
                <Lock className="h-6 w-6 shrink-0 text-navy" />
                <div>
                  <h3 className="text-sm font-bold">Transactions sécurisées</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Aucune donnée bancaire n'est demandée pour le paiement à la livraison.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}