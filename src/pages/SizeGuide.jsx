import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { SIZE_GUIDE } from "@/lib/store";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SizeGuide() {
  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow="Aide" title="Guide des tailles" subtitle="Trouvez la taille parfaite pour un confort optimal." />

      <div className="container-edge py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Table */}
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Taille</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Tour de taille (cm)</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Tour de hanches (cm)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? "bg-background" : "bg-secondary"}>
                    <td className="px-6 py-4 font-bold">{row.size}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.waist}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to measure */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">Comment mesurer ?</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="border border-border p-6">
                <h3 className="text-sm font-bold">Tour de taille</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mesurez autour de la partie la plus étroite de votre taille, juste au-dessus du nombril, en restant détendu.</p>
              </div>
              <div className="border border-border p-6">
                <h3 className="text-sm font-bold">Tour de hanches</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mesurez autour de la partie la plus large de vos hanches, en gardant le mètre horizontal.</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-10 border border-accent-lime bg-accent-lime/10 p-6">
            <h3 className="font-display text-lg font-bold">Bon à savoir</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Si vous êtes entre deux tailles, nous vous conseillons de choisir la taille supérieure.</li>
              <li>• Le tissu contient 5% de Lycra pour une bonne élasticité et un maintien confortable.</li>
              <li>• Après le premier lavage, le tissu peut légèrement se détendre.</li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link to="/collection" className="inline-flex items-center gap-2 bg-navy px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white">
              Voir la collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}