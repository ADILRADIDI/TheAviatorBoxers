import { STORE } from "./store";

// Build a structured WhatsApp order message
export function buildWhatsAppMessage({ customer, items, subtotal, shippingFee, discount, total, couponCode, city }) {
  const lines = [];

  lines.push("Bonjour The Aviator,");
  lines.push("");
  lines.push("Je souhaite commander :");
  lines.push("");

  items.forEach((item, i) => {
    const colorPart = item.color ? ` — ${item.color}` : "";
    const sizePart = item.size ? ` — ${item.size}` : "";
    lines.push(`${i + 1}. ${item.name}${colorPart}${sizePart} (x${item.quantity})`);
  });

  lines.push("");
  lines.push(`Ville: ${city || customer?.city || "—"}`);

  const totals = [];
  totals.push(`Sous-total: ${subtotal} ${STORE.currencySymbol}`);
  if (discount > 0) totals.push(`Réduction: -${discount} ${STORE.currencySymbol}`);
  totals.push(`Livraison: ${shippingFee === 0 ? "Gratuite" : shippingFee + " " + STORE.currencySymbol}`);
  totals.push(`Total: ${total} ${STORE.currencySymbol}`);
  lines.push("");
  lines.push(totals.join("\n"));

  if (couponCode) {
    lines.push("");
    lines.push(`Code promo: ${couponCode}`);
  }

  if (customer) {
    lines.push("");
    lines.push(`Nom: ${customer.first_name || ""} ${customer.last_name || ""}`.trim());
    if (customer.phone) lines.push(`Téléphone: ${customer.phone}`);
    if (customer.address) lines.push(`Adresse: ${customer.address}`);
    if (customer.neighborhood) lines.push(`Quartier: ${customer.neighborhood}`);
  }

  lines.push("");
  lines.push("Paiement: à la livraison");

  return lines.join("\n");
}

export function whatsappOrderUrl(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${STORE.whatsappNumber}?text=${text}`;
}

export function whatsappContactUrl(message = "") {
  const text = message ? encodeURIComponent(message) : encodeURIComponent("Bonjour The Aviator,");
  return `https://wa.me/${STORE.whatsappNumber}?text=${text}`;
}