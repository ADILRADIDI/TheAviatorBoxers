import { STORE } from "./store";
import { getSourceTag } from "./tracking";

// Build a structured WhatsApp order message
export function buildWhatsAppMessage({ customer, items, subtotal, shippingFee, discount, total, couponCode, city, source }) {
  const lines = [];

  lines.push("سلام، مرحبا بيك في The Aviator 👋");
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

  // Traffic Source Tag
  const tag = source || getSourceTag();
  if (tag) {
    lines.push("");
    lines.push(`Source: ${tag}`);
  }

  return lines.join("\n");
}

export function getStoredWhatsAppConfig() {
  try {
    // 1. Check direct site settings cache
    const siteRaw = localStorage.getItem("aviator_site_settings");
    if (siteRaw) {
      const parsed = JSON.parse(siteRaw);
      if (parsed) {
        return {
          number: parsed.whatsapp_number || STORE.whatsappNumber,
          defaultMessage: parsed.whatsapp_default_message || STORE.whatsappDefaultMessage || "Bonjour The Aviator, je souhaite commander un pack / avoir des informations :",
        };
      }
    }

    // 2. Check admin active database store
    const raw = localStorage.getItem("aviator_admin_clean_v4") ||
      localStorage.getItem("aviator_admin_mock_db_v4") ||
      localStorage.getItem("aviator_admin_mock_db_v3") ||
      localStorage.getItem("aviator_admin_mock_db_v2");

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.settings) {
        return {
          number: parsed.settings.whatsapp_number || STORE.whatsappNumber,
          defaultMessage: parsed.settings.whatsapp_default_message || STORE.whatsappDefaultMessage || "Bonjour The Aviator, je souhaite commander un pack / avoir des informations :",
        };
      }
    }
  } catch {}
  return {
    number: STORE.whatsappNumber,
    defaultMessage: STORE.whatsappDefaultMessage || "Bonjour The Aviator, je souhaite commander un pack / avoir des informations :",
  };
}

export function whatsappOrderUrl(message, customNumber = "") {
  const config = getStoredWhatsAppConfig();
  const phone = customNumber || config.number || STORE.whatsappNumber;
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

export function whatsappContactUrl(message = "", customNumber = "") {
  const config = getStoredWhatsAppConfig();
  const phone = customNumber || config.number || STORE.whatsappNumber;
  let textMsg = message || config.defaultMessage;
  
  // Attach traffic source if not already present
  const tag = getSourceTag();
  if (tag && !textMsg.toLowerCase().includes("source:")) {
    textMsg = `${textMsg}\n\nSource: ${tag}`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(textMsg)}`;
}