import { useState } from "react";
import RatingInput from "@/components/storefront/RatingInput";
import { useLanguage } from "@/lib/language";

export const CRITERIA = [
  { key: "tissu", label: "Tissu" },
  { key: "service", label: "Service" },
  { key: "livraison", label: "Livraison" },
  { key: "qualite", label: "Qualité générale" },
];

const DEFAULT_FORM = { name: "", city: "", rating: 0, comment: "", tissu: 0, service: 0, livraison: 0, qualite: 0 };

const FIELD_CLASS = "block w-full border border-border bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ink focus:bg-background focus:outline-none focus:ring-0";

async function createReview(payload) {
  const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("review failed");
  return response.json();
}

export default function ReviewForm({ onSubmitted }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await createReview({ ...form, rating: Number(form.rating) });
      setForm(DEFAULT_FORM);
      setMessage(t("Merci ! Votre avis sera publié après validation."));
      onSubmitted?.();
    } catch {
      setMessage(t("Impossible d'envoyer votre avis pour le moment."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="font-heading text-2xl font-bold">{t("Partagez votre expérience")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("Votre avis sera vérifié avant publication.")}</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input required value={form.name} onChange={(event) => update("name", event.target.value)} className={FIELD_CLASS} placeholder={t("Votre nom")} aria-label={t("Votre nom")} />
          <input value={form.city} onChange={(event) => update("city", event.target.value)} className={FIELD_CLASS} placeholder={t("Votre ville")} aria-label={t("Votre ville")} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold">{t("Note")}</span>
          <RatingInput label={t("Note")} value={form.rating} onChange={(rating) => update("rating", rating)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {CRITERIA.map((c) => (
            <div key={c.key} className="flex flex-col items-center gap-1.5">
              <span className="text-sm font-semibold">{t(c.label)}</span>
              <RatingInput label={t(c.label)} value={form[c.key]} onChange={(rating) => update(c.key, rating)} />
            </div>
          ))}
        </div>
        <textarea required minLength={10} rows={4} value={form.comment} onChange={(event) => update("comment", event.target.value)} className={`${FIELD_CLASS} resize-none`} placeholder={t("Votre avis")} aria-label={t("Votre avis")} />
        {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
        <button disabled={submitting} className="btn-store btn-store--navy btn-sheen w-full disabled:opacity-50">{submitting ? t("Envoi...") : t("Envoyer mon avis")}</button>
      </form>
    </>
  );
}