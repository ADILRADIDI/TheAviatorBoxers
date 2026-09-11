import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Package, AlertCircle } from "lucide-react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import PageHeader from "@/components/storefront/PageHeader";
import { formatPrice } from "@/lib/store";

const STATUS_LABELS = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  preparation: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
  retour: "Retour en cours",
  echec: "Échec",
};

export default function OrderTracking() {
  const [form, setForm] = useState({ orderNumber: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const orderNumber = form.orderNumber.trim();
      const phone = form.phone.replace(/[\s-]/g, "");
      if (!orderNumber || !phone) throw new Error("missing");
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/orders/${encodeURIComponent(orderNumber)}?phone=${encodeURIComponent(phone)}`);
      if (!response.ok) throw new Error("not-found");
      const match = await response.json();
      if (!match) throw new Error("not-found");
      setOrder(match);
    } catch {
      setError("Nous ne trouvons pas cette commande. Vérifiez le numéro et le téléphone.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow="Commande" title="Suivre ma commande" subtitle="Retrouvez l'état de votre livraison avec votre référence et votre téléphone." />
      <main className="container-edge py-12">
        <div className="mx-auto max-w-xl">
          <form onSubmit={submit} className="border border-border bg-background p-6 sm:p-8">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Numéro de commande</span>
              <input required value={form.orderNumber} onChange={(event) => setForm({ ...form, orderNumber: event.target.value })} className="w-full border border-border px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="AVT-..." autoComplete="off" />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Téléphone utilisé à la commande</span>
              <input required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full border border-border px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="06 12 34 56 78" autoComplete="tel" />
            </label>
            {error && <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</p>}
            <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 bg-navy py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"><Search className="h-4 w-4" />{loading ? "Recherche..." : "Rechercher ma commande"}</button>
          </form>

          {order && (
            <section className="mt-8 border border-border bg-background p-6" aria-live="polite">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Package className="h-7 w-7 text-navy" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Commande</p>
                  <h2 className="font-display text-xl font-bold">#{order.order_number || order.id}</h2>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm"><span className="text-muted-foreground">Statut</span><strong>{STATUS_LABELS[order.status] || order.status || "En traitement"}</strong></div>
              <div className="mt-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">Ville</span><span>{order.city}</span></div>
              <div className="mt-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">Total</span><strong>{formatPrice(order.total)}</strong></div>
            </section>
          )}

          <Link to="/collection" className="mt-6 block text-center text-xs font-medium uppercase tracking-wider text-muted-foreground underline underline-offset-4">Continuer mes achats</Link>
        </div>
      </main>
    </>
  );
}
