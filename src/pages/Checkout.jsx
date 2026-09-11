const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Banknote, ShieldCheck, Lock, MessageCircle, Loader2 } from "lucide-react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { useCart, lineKey } from "@/lib/cart-context";
import { formatPrice, STORE, computeDiscount, MOROCCAN_CITIES, DEFAULT_SHIPPING, fetchShippingZone, createOrder } from "@/lib/store";

import { buildWhatsAppMessage, whatsappOrderUrl } from "@/lib/whatsapp";
import { track, Events } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function validatePhone(phone) {
  const p = phone.replace(/[\s-]/g, "");
  return /^(0[6-7]\d{8}|\+212[6-7]\d{8}|212[6-7]\d{8})$/.test(p);
}

export default function Checkout() {
  const { items, subtotal, coupon, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", phone: "", city: "", address: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [shippingZone, setShippingZone] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!form.city) {
      setShippingZone(null);
      return undefined;
    }
    setShippingLoading(true);
    fetchShippingZone(form.city)
      .then((zone) => active && setShippingZone(zone))
      .catch(() => active && setShippingZone(null))
      .finally(() => active && setShippingLoading(false));
    return () => { active = false; };
  }, [form.city]);

  const discountInfo = computeDiscount(coupon, subtotal, 0);
  const discount = discountInfo.amount;
  const freeShipping = subtotal - discount >= STORE.freeShippingThreshold || discountInfo.freeShipping;
  const shippingFee = freeShipping ? 0 : shippingZone?.fee ?? DEFAULT_SHIPPING.fee;
  const total = subtotal - discount + shippingFee;

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nom complet requis";
    if (!form.phone.trim()) e.phone = "Téléphone requis";
    else if (!validatePhone(form.phone)) e.phone = "Numéro marocain invalide (06/07)";
    if (!form.city) e.city = "Ville requise";
    if (!form.address.trim()) e.address = "Adresse requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) {
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    track(Events.BEGIN_CHECKOUT, { value: total, currency: "MAD" });
    try {
      const orderItems = items.map((i) => ({
        product_id: i.productId, name: i.name, color: i.color, size: i.size,
        quantity: i.quantity, price: i.price,
      }));

      const orderPayload = {
        first_name: form.name.trim(),
        last_name: "",
        phone: form.phone,
        city: form.city,
        address: form.address,
        items: orderItems,
        subtotal,
        shipping_fee: shippingFee,
        discount,
        total,
        payment_method: "cod",
        coupon_code: coupon?.code || "",
        status: "nouvelle",
        source: "checkout",
        idempotency_key: idempotencyKey,
      };
      const order = await createOrder(orderPayload);

      track(Events.PURCHASE, { value: total, currency: "MAD", order_id: order.id });

      const orderData = {
        id: order.id,
        first_name: form.name,
        phone: form.phone,
        city: form.city,
        items: orderItems,
        subtotal, shipping_fee: shippingFee, discount, total,
        coupon_code: coupon?.code,
      };

      clearCart();
      navigate("/confirmation", { state: { order: orderData } });
    } catch (err) {
      setSubmitting(false);
      setErrors({ form: "Une erreur est survenue. Veuillez réessayer ou commander via WhatsApp." });
    }
  };

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage({
      customer: form,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      couponCode: coupon?.code,
      city: form.city,
    });
    window.open(whatsappOrderUrl(message), "_blank");
  };

  if (items.length === 0) {
    return (
      <>
        <AnnouncementBar />
        <div className="container-edge py-20 text-center">
          <h1 className="font-display text-3xl">Panier vide</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ajoutez des produits avant de passer commande.</p>
          <Link to="/collection" className="mt-6 inline-block bg-navy px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">Voir la collection</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <div className="border-b border-border bg-secondary">
        <div className="container-edge py-8">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Commande</h1>
          <p className="mt-1 text-sm text-muted-foreground">Complétez vos informations pour finaliser la commande.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container-edge py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div className="space-y-8">
            {errors.form && (
              <div className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{errors.form}</div>
            )}

            {/* Informations essentielles */}
            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">Informations de livraison</legend>
              <Field label="Nom complet" error={errors.name} required>
                <input value={form.name} onChange={set("name")} className={inputCls(!!errors.name)} placeholder="Ahmed Benani" data-error={!!errors.name} autoComplete="name" />
              </Field>
              <Field label="Téléphone" error={errors.phone} required>
                <input value={form.phone} onChange={set("phone")} type="tel" className={inputCls(!!errors.phone)} placeholder="06 12 34 56 78" data-error={!!errors.phone} autoComplete="tel" />
              </Field>
            </fieldset>

            {/* Livraison */}
            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">Adresse de livraison</legend>
              <Field label="Ville" error={errors.city} required>
                <select value={form.city} onChange={set("city")} className={inputCls(!!errors.city)} data-error={!!errors.city}>
                  <option value="">Sélectionnez votre ville</option>
                  {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Adresse" error={errors.address} required>
                <input value={form.address} onChange={set("address")} className={inputCls(!!errors.address)} placeholder="N°, rue, imm." data-error={!!errors.address} />
              </Field>
            </fieldset>

            {/* Paiement */}
            <fieldset className="space-y-4">
              <legend className="font-display text-lg font-bold">Mode de paiement</legend>
              <label className="flex cursor-pointer items-center gap-3 border-2 border-navy bg-navy/5 p-4">
                <input type="radio" name="payment" defaultChecked className="accent-navy" />
                <Banknote className="h-5 w-5 text-navy" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Paiement à la livraison (COD)</p>
                  <p className="text-xs text-muted-foreground">Payez en espèces à la réception</p>
                </div>
              </label>
              <div className="flex items-center gap-2 border border-dashed border-border p-4 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" />
                Paiement en ligne bientôt disponible. Vos données sont protégées.
              </div>
            </fieldset>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-background p-6">
              <h2 className="font-display text-lg font-bold">Ma commande</h2>
              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => {
                  const key = lineKey(item);
                  return (
                    <li key={key} className="flex gap-3">
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-muted">
                        {item.image && <Image src={item.image} alt="" fittingType="fill" className="h-full w-full object-cover" />}
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-bold text-white">{item.quantity}</span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <p className="text-xs font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{[item.color, item.size].filter(Boolean).join(" · ")}</p>
                      </div>
                      <span className="self-center text-xs font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-accent-lime"><span>Réduction</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Livraison</span><span>{shippingLoading ? "Calcul..." : shippingFee === 0 ? "Gratuite" : formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-shine mt-5 flex w-full items-center justify-center gap-2 bg-navy py-4 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Traitement...</> : "Confirmer ma commande"}
              </button>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OU</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="flex w-full items-center justify-center gap-2 border border-[#25D366] bg-[#25D366]/5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#1da851] transition-colors hover:bg-[#25D366] hover:text-white"
              >
                <MessageCircle className="h-4 w-4" /> Commander via WhatsApp
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Commande 100% sécurisée
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

function inputCls(hasError) {
  return cn("w-full border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1", hasError ? "border-destructive focus:ring-destructive" : "border-border focus:border-navy focus:ring-navy");
}

function Field({ label, error, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}