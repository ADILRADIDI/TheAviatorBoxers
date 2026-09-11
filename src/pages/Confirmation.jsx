import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, MessageCircle, Home } from "lucide-react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { formatPrice } from "@/lib/store";
import { STORE } from "@/lib/store";

export default function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;

  const waMessage = order
    ? `Bonjour The Aviator, je viens de passer la commande (ref: ${order.id?.slice(-8) || ""}). Total: ${formatPrice(order.total)}. Ville: ${order.city}.`
    : "Bonjour The Aviator,";

  return (
    <>
      <AnnouncementBar />
      <div className="container-edge py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-lime/20">
            <CheckCircle className="h-10 w-10 text-accent-lime" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Merci pour votre commande !
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Votre commande a bien été enregistrée. Nous vous contacterons rapidement
            pour confirmer la livraison.
          </p>

          {order && (
            <div className="mt-8 border border-border bg-background p-6 text-left">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Numéro de commande</p>
                  <p className="mt-0.5 font-mono text-sm font-bold">#{order.id?.slice(-8).toUpperCase() || "AVT-" + Date.now()}</p>
                </div>
                <Package className="h-8 w-8 text-navy" strokeWidth={1} />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Client</span><span className="font-medium">{order.first_name} {order.last_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Téléphone</span><span className="font-medium">{order.phone}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Ville</span><span className="font-medium">{order.city}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Articles</span><span className="font-medium">{order.items?.length || 0}</span></div>
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-sm text-accent-lime"><span>Réduction</span><span>-{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Livraison</span><span>{order.shipping_fee === 0 ? "Gratuite" : formatPrice(order.shipping_fee)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              </div>

              <div className="mt-4 flex items-center gap-2 border border-border bg-secondary p-3 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Paiement à la livraison · Livraison 24-48h
              </div>
            </div>
          )}

          {!order && (
            <div className="mt-8 border border-border bg-secondary p-6 text-center">
              <p className="text-sm text-muted-foreground">Aucune commande récente à afficher.</p>
              <Link to="/collection" className="mt-4 inline-flex bg-navy px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
                Voir la collection
              </Link>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#25D366] bg-[#25D366]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#1da851] transition-colors hover:bg-[#25D366] hover:text-white"
            >
              <MessageCircle className="h-4 w-4" /> Suivre sur WhatsApp
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-navy px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              <Home className="h-4 w-4" /> Retour à l'accueil
            </Link>
            {order && <Link to="/suivi-commande" className="inline-flex items-center justify-center border border-border px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-navy">Suivre ma commande</Link>}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Une question ? Contactez-nous au <a href={`https://wa.me/${STORE.whatsappNumber}`} className="font-medium text-navy underline underline-offset-4">WhatsApp</a>.
          </p>
        </div>
      </div>
    </>
  );
}