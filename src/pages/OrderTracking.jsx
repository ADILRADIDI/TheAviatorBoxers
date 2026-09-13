import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Package, AlertCircle } from "lucide-react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import PageHeader from "@/components/storefront/PageHeader";
import { formatPrice } from "@/lib/store";
import { useLanguage } from "@/lib/language";
import { usePageMeta } from "@/lib/seo";

const STATUS_LABELS = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  preparation: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
  retour: "Retour en cours",
  requested: "Demande reçue",
  approved: "Retour accepté",
  rejected: "Retour refusé",
  completed: "Retour terminé",
  echec: "Échec",
};

export default function OrderTracking() {
  const [form, setForm] = useState({ orderNumber: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [returnForm, setReturnForm] = useState({ reason: "", notes: "" });
  const [returnMessage, setReturnMessage] = useState("");
  const { t } = useLanguage();
  usePageMeta({ title: "Suivi de commande — The Aviator", description: "Suivez votre commande The Aviator : saisissez votre numéro de commande et votre téléphone. Livraison 24-48h partout au Maroc.", noindex: true });

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
      setError(t("Nous ne trouvons pas cette commande. Vérifiez le numéro et le téléphone."));
    } finally {
      setLoading(false);
    }
  };

  const submitReturn = async (event) => {
    event.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/returns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_number: order.order_number, phone: form.phone, ...returnForm }),
    });
    const result = await response.json();
    setReturnMessage(result.accepted ? t("Votre demande de retour a été envoyée.") : result.duplicate ? t("Une demande existe déjà pour cette commande.") : t("Cette commande ne peut pas être retournée."));
    if (result.request) setOrder({ ...order, return_request: result.request });
  };

  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow={t("Commande")} title={t("Suivre ma commande")} subtitle={t("Retrouvez l'état de votre livraison avec votre référence et votre téléphone.")} />
      <main className="container-edge py-12">
        <div className="mx-auto max-w-xl">
          <form onSubmit={submit} className="border border-border bg-background p-6 sm:p-8">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("Numéro de commande")}</span>
              <input required value={form.orderNumber} onChange={(event) => setForm({ ...form, orderNumber: event.target.value })} className="w-full border border-border px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="AVT-..." autoComplete="off" />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("Téléphone utilisé à la commande")}</span>
              <input required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full border border-border px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="06 12 34 56 78" autoComplete="tel" />
            </label>
            {error && <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</p>}
            <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 bg-navy py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"><Search className="h-4 w-4" />{loading ? t("Recherche...") : t("Rechercher ma commande")}</button>
          </form>

          {order && (
            <section className="mt-8 border border-border bg-background p-6" aria-live="polite">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Package className="h-7 w-7 text-navy" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("Commande")}</p>
                  <h2 className="font-display text-xl font-bold">#{order.order_number || order.id}</h2>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm"><span className="text-muted-foreground">{t("Statut")}</span><strong>{t(STATUS_LABELS[order.status] || order.status || "En traitement")}</strong></div>
              <div className="mt-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">{t("Ville")}</span><span>{order.city}</span></div>
              <div className="mt-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">{t("Total")}</span><strong>{formatPrice(order.total)}</strong></div>
            </section>
          )}
          {order?.return_request ? (
            <section className="mt-8 border border-border bg-secondary p-6">
              <h2 className="font-display text-xl font-bold">{t("Retour")}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{t("Statut :")} <strong className="text-foreground">{t(STATUS_LABELS[order.return_request.status] || order.return_request.status)}</strong></p>
              <p className="mt-2 text-sm text-muted-foreground">{t("Votre demande est suivie par notre équipe. Nous vous contacterons si une information complémentaire est nécessaire.")}</p>
            </section>
          ) : order?.status === "livree" && (
            <form onSubmit={submitReturn} className="mt-8 border border-border bg-secondary p-6">
              <h2 className="font-display text-xl font-bold">{t("Demander un retour")}</h2>
              <select required value={returnForm.reason} onChange={(event) => setReturnForm({ ...returnForm, reason: event.target.value })} className="mt-4 w-full border border-border bg-background px-3 py-3 text-sm">
                <option value="">{t("Choisissez un motif")}</option>
                <option value="taille">{t("Problème de taille")}</option>
                <option value="defaut">{t("Défaut produit")}</option>
                <option value="autre">{t("Autre")}</option>
              </select>
              <textarea value={returnForm.notes} onChange={(event) => setReturnForm({ ...returnForm, notes: event.target.value })} className="mt-3 w-full border border-border bg-background px-3 py-3 text-sm" placeholder={t("Précisions (optionnel)")} />
              {returnMessage && <p className="mt-3 text-sm text-muted-foreground">{returnMessage}</p>}
              <button type="submit" className="mt-4 w-full bg-navy py-3.5 text-xs font-bold uppercase tracking-wider text-white">{t("Envoyer la demande")}</button>
            </form>
          )}

          <Link to="/collection" className="mt-6 block text-center text-xs font-medium uppercase tracking-wider text-muted-foreground underline underline-offset-4">{t("Continuer mes achats")}</Link>
        </div>
      </main>
    </>
  );
}