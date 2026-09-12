import { useState } from "react";
import { Globe2, LineChart } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json", "x-admin-token": localStorage.getItem("aviator_admin_token") || "" }, ...options });
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
}

export default function AdminSettingsPanel({ data, refresh }) {
  const seo = data?.seo || {};
  const tracking = data?.tracking || {};
  const [form, setForm] = useState({ seo, tracking });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await request("/api/admin/settings", { method: "PATCH", body: JSON.stringify({ seo: form.seo, tracking: form.tracking }) });
      setSaved(true);
      refresh();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  const setSeo = (key) => (event) => setForm((current) => ({ ...current, seo: { ...current.seo, [key]: event.target.value } }));
  const setTracking = (key) => (event) => setForm((current) => ({ ...current, tracking: { ...current.tracking, [key]: event.target.value } }));

  return (
    <section className="border border-border bg-background p-5 sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Réglages</p>
      <h2 className="mt-1 font-display text-2xl font-bold">Paramètres SEO & tracking</h2>
      <p className="mt-2 text-sm text-muted-foreground">Titres et descriptions par défaut du site, et identifiants des outils de mesure marketing.</p>
      <form onSubmit={save} className="mt-6 space-y-8">
        <fieldset>
          <legend className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy"><Globe2 className="h-4 w-4" /> SEO par défaut</legend>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Titre du site<input value={form.seo.site_title || ""} onChange={setSeo("site_title")} className="mt-2 w-full border border-border px-4 py-3 text-sm" placeholder="THE AVIATOR — Boxers Premium pour Hommes" /></label>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description du site<textarea value={form.seo.site_description || ""} onChange={setSeo("site_description")} rows={3} className="mt-2 w-full border border-border px-4 py-3 text-sm" placeholder="Meta description par défaut utilisée par les pages sans réglage dédié." /></label>
        </fieldset>
        <fieldset>
          <legend className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy"><LineChart className="h-4 w-4" /> Tracking</legend>
          <p className="mt-2 text-xs text-muted-foreground">Laissez vide pour désactiver un outil. Les identifiants sont injectés sur le storefront.</p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Google Analytics (ID de mesure)<input value={form.tracking.google_analytics_id || ""} onChange={setTracking("google_analytics_id")} className="mt-2 w-full border border-border px-4 py-3 text-sm" placeholder="G-XXXXXXXXXX" /></label>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meta Pixel ID (Facebook / Instagram)<input value={form.tracking.meta_pixel_id || ""} onChange={setTracking("meta_pixel_id")} className="mt-2 w-full border border-border px-4 py-3 text-sm" placeholder="123456789012345" /></label>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">TikTok Pixel ID<input value={form.tracking.tiktok_pixel_id || ""} onChange={setTracking("tiktok_pixel_id")} className="mt-2 w-full border border-border px-4 py-3 text-sm" placeholder="CXXXXXXXXXXXXXXXXXXX" /></label>
        </fieldset>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {saved && !error && <p className="text-sm text-green-700">Réglages enregistrés.</p>}
        <div className="flex justify-end">
          <button disabled={saving} className="bg-navy px-6 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">{saving ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
      </form>
    </section>
  );
}
