import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";
const request = async (path, options) => {
  const response = await fetch(`${API}${path}`, { headers: { ...(options?.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}), "x-admin-token": localStorage.getItem("aviator_admin_token") || "" }, ...options });
  if (response.status === 401) {
    localStorage.removeItem("aviator_admin_token");
    window.dispatchEvent(new CustomEvent("aviator-admin-expired"));
  }
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
};

const DEFAULTS = {
  store_name: "THE AVIATOR",
  tagline: "",
  description: "",
  email: "",
  phone: "",
  whatsapp_number: "",
  address: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  trust_items: [],
  footer_columns: [],
};

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder} className="admin-input mt-1.5" />
    </label>
  );
}

export default function AdminSettingsPanel() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    request("/api/admin/settings")
      .then((data) => { if (active) setForm({ ...DEFAULTS, ...data, trust_items: data.trust_items || [], footer_columns: data.footer_columns || [] }); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await request("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setMessage("Modifications enregistrées.");
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const addTrust = () => setForm((f) => ({ ...f, trust_items: [...(f.trust_items || []), { title: "", subtitle: "" }] }));
  const updateTrust = (index, key) => (event) => setForm((f) => { const trust_items = f.trust_items.map((item, i) => i === index ? { ...item, [key]: event.target.value } : item); return { ...f, trust_items }; });
  const removeTrust = (index) => setForm((f) => ({ ...f, trust_items: f.trust_items.filter((_, i) => i !== index) }));

  const addColumn = () => setForm((f) => ({ ...f, footer_columns: [...(f.footer_columns || []), { title: "", links: [] }] }));
  const updateColumn = (index, key) => (event) => setForm((f) => { const footer_columns = f.footer_columns.map((col, i) => i === index ? { ...col, [key]: event.target.value } : col); return { ...f, footer_columns }; });
  const removeColumn = (index) => setForm((f) => ({ ...f, footer_columns: f.footer_columns.filter((_, i) => i !== index) }));
  const addLink = (columnIndex) => setForm((f) => { const footer_columns = f.footer_columns.map((col, i) => i === columnIndex ? { ...col, links: [...(col.links || []), { label: "", to: "" }] } : col); return { ...f, footer_columns }; });
  const updateLink = (columnIndex, linkIndex, key) => (event) => setForm((f) => { const footer_columns = f.footer_columns.map((col, i) => i === columnIndex ? { ...col, links: col.links.map((link, j) => j === linkIndex ? { ...link, [key]: event.target.value } : link) } : col); return { ...f, footer_columns }; });
  const removeLink = (columnIndex, linkIndex) => setForm((f) => { const footer_columns = f.footer_columns.map((col, i) => i === columnIndex ? { ...col, links: col.links.filter((_, j) => j !== linkIndex) } : col); return { ...f, footer_columns }; });

  if (loading) {
    return (
      <section className="admin-card p-5 sm:p-7">
        <div className="grid gap-4"><div className="admin-skeleton h-28" /><div className="admin-skeleton h-28" /></div>
      </section>
    );
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="admin-section-title">Site</p>
          <h2 className="admin-h2 mt-1">Réglages généraux du site</h2>
        </div>
        <button className="admin-btn admin-btn-primary" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
      {error && <div className="admin-card border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      {message && <div className="admin-card border-accent-lime/40 bg-accent-lime/10 p-4 text-sm text-navy">{message}</div>}

      <section className="admin-card p-5 sm:p-7">
        <h3 className="admin-h2">Identité de la boutique</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nom de la boutique" value={form.store_name} onChange={set("store_name")} />
          <Field label="Slogan" value={form.tagline} onChange={set("tagline")} />
          <div className="sm:col-span-2">
            <Field label="Description" value={form.description} onChange={set("description")} />
          </div>
        </div>
      </section>

      <section className="admin-card p-5 sm:p-7">
        <h3 className="admin-h2">Coordonnées & réseaux sociaux</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Email" type="email" value={form.email} onChange={set("email")} />
          <Field label="Téléphone" value={form.phone} onChange={set("phone")} />
          <Field label="Numéro WhatsApp (int. sans +)" value={form.whatsapp_number} onChange={set("whatsapp_number")} />
          <Field label="Adresse" value={form.address} onChange={set("address")} />
          <Field label="Instagram (URL)" value={form.instagram} onChange={set("instagram")} />
          <Field label="Facebook (URL)" value={form.facebook} onChange={set("facebook")} />
          <Field label="TikTok (URL)" value={form.tiktok} onChange={set("tiktok")} />
          <Field label="YouTube (URL)" value={form.youtube} onChange={set("youtube")} />
        </div>
      </section>

      <section className="admin-card p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <h3 className="admin-h2">Badges de confiance (pied de page)</h3>
          <button type="button" onClick={addTrust} className="admin-btn admin-btn-lime"><Plus className="h-4 w-4" /> Ajouter</button>
        </div>
        <div className="mt-4 space-y-3">
          {(form.trust_items || []).map((item, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3 rounded-md border border-black/10 bg-black/[0.02] p-3">
              <input placeholder="Titre (ex: Livraison 24-48h)" value={item.title} onChange={updateTrust(index, "title")} className="admin-input min-w-[180px] flex-1" aria-label="Titre du badge" />
              <input placeholder="Sous-titre (ex: Partout au Maroc)" value={item.subtitle} onChange={updateTrust(index, "subtitle")} className="admin-input min-w-[180px] flex-1" aria-label="Sous-titre du badge" />
              <button type="button" onClick={() => removeTrust(index)} className="admin-btn admin-btn-danger !px-3" aria-label="Supprimer le badge"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {!(form.trust_items || []).length && <p className="text-sm text-muted-foreground">Aucun badge. Cliquez sur « Ajouter ».</p>}
        </div>
      </section>

      <section className="admin-card p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <h3 className="admin-h2">Colonnes & liens du pied de page</h3>
          <button type="button" onClick={addColumn} className="admin-btn admin-btn-lime"><Plus className="h-4 w-4" /> Ajouter une colonne</button>
        </div>
        <div className="mt-4 space-y-4">
          {(form.footer_columns || []).map((col, columnIndex) => (
            <div key={columnIndex} className="rounded-md border border-black/10 bg-black/[0.02] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <input placeholder="Titre de la colonne (ex: Boutique)" value={col.title} onChange={updateColumn(columnIndex, "title")} className="admin-input max-w-xs" aria-label="Titre de la colonne" />
                <button type="button" onClick={() => addLink(columnIndex)} className="admin-btn admin-btn-ghost"><Plus className="h-4 w-4" /> Lien</button>
                <button type="button" onClick={() => removeColumn(columnIndex)} className="admin-btn admin-btn-danger ml-auto !px-3" aria-label="Supprimer la colonne"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 space-y-2">
                {(col.links || []).map((link, linkIndex) => (
                  <div key={linkIndex} className="flex flex-wrap items-center gap-3">
                    <input placeholder="Libellé (ex: Collection)" value={link.label} onChange={updateLink(columnIndex, linkIndex, "label")} className="admin-input min-w-[160px] flex-1" aria-label="Libellé du lien" />
                    <input placeholder="Chemin (ex: /collection)" value={link.to} onChange={updateLink(columnIndex, linkIndex, "to")} className="admin-input min-w-[160px] flex-1" aria-label="Chemin du lien" />
                    <button type="button" onClick={() => removeLink(columnIndex, linkIndex)} className="admin-btn admin-btn-danger !px-3" aria-label="Supprimer le lien"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                {!(col.links || []).length && <p className="text-xs text-muted-foreground">Aucun lien dans cette colonne.</p>}
              </div>
            </div>
          ))}
          {!(form.footer_columns || []).length && <p className="text-sm text-muted-foreground">Aucune colonne. Cliquez sur « Ajouter une colonne ».</p>}
        </div>
      </section>
    </form>
  );
}