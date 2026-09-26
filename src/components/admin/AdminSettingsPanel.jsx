import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Globe, FileCode, ExternalLink, CheckCircle } from "lucide-react";

import { adminRequest as request } from "@/lib/adminApi";

const DEFAULTS = {
  store_name: "THE AVIATOR",
  tagline: "",
  description: "",
  email: "",
  phone: "",
  whatsapp_number: "",
  whatsapp_default_message: "Bonjour The Aviator, je souhaite commander un pack :",
  address: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  google_analytics_id: "G-NST40JYCB7",
  google_stream_id: "15844671059",
  google_tag_manager_id: "",
  google_account_email: "social@theaviatorboxer.com",
  meta_pixel_id: "",
  tiktok_pixel_id: "",
  trust_items: [],
  footer_columns: [],
};

function Field({ label, value, onChange, placeholder, type = "text", help = "" }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder} className="admin-input mt-1.5" />
      {help && <span className="mt-1 block text-[11px] text-muted-foreground">{help}</span>}
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

      <section className="admin-card p-5 sm:p-7 border-l-4 border-l-[#25D366]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-white bg-[#25D366] px-2 py-0.5 uppercase rounded-xs">
              WhatsApp & Conversions
            </span>
            <h3 className="admin-h2 mt-2 flex items-center gap-2">
              Contrôle du Message WhatsApp (Arabe / Français)
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Personnalisez le numéro et le message pré-rempli qui s'ouvre lorsque les clients cliquent sur les boutons WhatsApp du site.
            </p>
          </div>

          {/* Test Button */}
          {form.whatsapp_number && (
            <a
              href={`https://wa.me/${form.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(form.whatsapp_default_message || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1EBE5D] transition-colors"
              title="Tester le lien WhatsApp en direct avec vos paramètres actuels"
            >
              <span>🚀 Tester sur WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Numéro WhatsApp Réceptionnaire (Format international sans +)"
              value={form.whatsapp_number}
              onChange={set("whatsapp_number")}
              placeholder="Ex: 212669318641"
              help="Exemple : 212669318641 (212 suivi du numéro marocain sans le 0)."
            />
          </div>

          {/* Quick Presets Buttons (Arabic / French / Darija) */}
          <div className="sm:col-span-2 rounded-md border border-black/10 bg-black/[0.02] p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Modèles rapides (Cliquez pour remplir en 1-clic) :
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, whatsapp_default_message: "Bonjour The Aviator, je souhaite commander un pack / avoir des informations :" }))}
                className="rounded border border-black/15 bg-white px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-black/5 transition-colors"
              >
                🇫🇷 Français classique
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, whatsapp_default_message: "السلام عليكم The Aviator، أرغب في طلب عرض البوكسر أو الاستفسار عن تفاصيل :" }))}
                className="rounded border border-black/15 bg-white px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-black/5 transition-colors"
              >
                🇲🇦 العربية (Standard)
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, whatsapp_default_message: "سلام The Aviator، بغيت نطلب باك ديال البوكسر / نسولكم على القياس :" }))}
                className="rounded border border-black/15 bg-white px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-black/5 transition-colors"
              >
                💬 الدارجة (Darija)
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, whatsapp_default_message: "Bonjour The Aviator / سلام، بغيت نطلب باك ديالي 📦" }))}
                className="rounded border border-black/15 bg-white px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-black/5 transition-colors"
              >
                ⚡ Bilingue Express
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Texte du Message WhatsApp (Français ou Arabe)
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {(form.whatsapp_default_message || "").length} caractères
                </span>
              </div>
              <textarea
                rows={3}
                dir="auto"
                value={form.whatsapp_default_message ?? ""}
                onChange={set("whatsapp_default_message")}
                placeholder="Écrivez ici en Français ou en Arabe..."
                className="admin-input mt-1 resize-y min-h-[70px] text-sm leading-relaxed"
              />
              <span className="mt-1.5 block text-[11px] text-muted-foreground">
                Ce texte apparaîtra automatiquement dans la fenêtre de discussion WhatsApp du client lorsqu'il clique sur n'importe quel bouton WhatsApp du site.
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="admin-card p-5 sm:p-7">
        <h3 className="admin-h2">Coordonnées & réseaux sociaux</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Email" type="email" value={form.email} onChange={set("email")} />
          <Field label="Téléphone" value={form.phone} onChange={set("phone")} />
          <Field label="Adresse" value={form.address} onChange={set("address")} />
          <Field label="Instagram (URL)" value={form.instagram} onChange={set("instagram")} />
          <Field label="Facebook (URL)" value={form.facebook} onChange={set("facebook")} />
          <Field label="TikTok (URL)" value={form.tiktok} onChange={set("tiktok")} />
          <Field label="YouTube (URL)" value={form.youtube} onChange={set("youtube")} />
        </div>
      </section>

      {/* Marketing, Google Analytics & Pixels */}
      <section className="admin-card p-5 sm:p-7 border-l-4 border-l-[#C7D400]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-navy bg-[#C7D400] px-2 py-0.5 uppercase">
              Tracking & Visibilité
            </span>
            <h3 className="admin-h2 mt-2">Google Analytics & Pixels Publicitaires</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Configurez le compte Google Analytics (GA4) associé à l'adresse Gmail du propriétaire, ainsi que vos pixels Meta et TikTok.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="ID de mesure Google Analytics 4 (GA4)"
            value={form.google_analytics_id}
            onChange={set("google_analytics_id")}
            placeholder="Ex: G-NST40JYCB7"
            help="Créé depuis analytics.google.com avec le compte Gmail du propriétaire."
          />
          <Field
            label="Numéro de flux Web (Stream ID)"
            value={form.google_stream_id}
            onChange={set("google_stream_id")}
            placeholder="Ex: 15844671059"
            help="Numéro du flux de données Web (ex: 15844671059)."
          />
          <Field
            label="Compte Gmail Propriétaire (Référence GA4 / Search Console)"
            type="email"
            value={form.google_account_email}
            onChange={set("google_account_email")}
            placeholder="Ex: social@theaviatorboxer.com"
            help="Adresse Gmail propriétaire du flux de données et des rapports."
          />
          <Field
            label="Google Tag Manager (Optionnel)"
            value={form.google_tag_manager_id}
            onChange={set("google_tag_manager_id")}
            placeholder="Ex: GTM-XXXXXXX"
            help="Si vous préférez gérer vos balises via Google Tag Manager."
          />
          <Field
            label="Pixel Meta / Facebook & Instagram"
            value={form.meta_pixel_id}
            onChange={set("meta_pixel_id")}
            placeholder="Ex: 123456789012345"
            help="ID du Pixel Meta pour le suivi des conversions et campagnes publicitaires."
          />
          <div className="sm:col-span-2">
            <Field
              label="Pixel TikTok (Optionnel)"
              value={form.tiktok_pixel_id}
              onChange={set("tiktok_pixel_id")}
              placeholder="Ex: CXXXXXXXXXXXXXXX"
              help="ID du Pixel TikTok pour suivre les événements d'achat."
            />
          </div>
        </div>

        <div className="mt-5 rounded-md border border-black/10 bg-black/[0.02] p-4 text-xs text-ink/80 space-y-2">
          <p className="font-bold text-navy flex items-center gap-1.5">
            Guide rapide d'activation avec le compte Gmail du client :
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
            <li>Connectez-vous sur <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-navy font-semibold underline">analytics.google.com</a> avec le compte Gmail du patron/client.</li>
            <li>Créez une propriété <strong>The Aviator Boxers</strong> et configurez un flux Web avec l'URL de votre boutique.</li>
            <li>Copiez l'<strong>ID de mesure</strong> (au format <code>G-XXXXXXXXXX</code>) et collez-le dans le champ ci-dessus.</li>
            <li>Cliquez sur <strong>« Enregistrer »</strong> en haut à droite : le tracking GA4 est instantanément actif sur l'ensemble du site.</li>
          </ol>
        </div>
      </section>

      {/* Sitemap & SEO Indexing */}
      <section className="admin-card p-5 sm:p-7 border-l-4 border-l-navy">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-white bg-navy px-2 py-0.5 uppercase">
              SEO & Référencement
            </span>
            <h3 className="admin-h2 mt-2">Sitemap XML & Indexation Google</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Le sitemap XML génère la liste officielle des URLs et images indexables pour Google, Bing et Yahoo.
            </p>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="admin-btn admin-btn-ghost text-xs flex items-center gap-1.5"
          >
            <FileCode className="h-3.5 w-3.5 text-navy" />
            Voir le Sitemap XML en direct
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-slate-50/70 p-4 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              URL du Sitemap Officiel
            </span>
            <p className="font-mono text-xs font-bold text-navy select-all break-all">
              https://theaviatorboxer.com/sitemap.xml
            </p>
            <p className="text-[11px] text-muted-foreground">
              Déclaré automatiquement dans <code className="bg-white px-1 py-0.5 rounded border border-black/10">robots.txt</code>.
            </p>
          </div>

          <div className="rounded-lg border border-black/10 bg-slate-50/70 p-4 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Soumission aux moteurs de recherche
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-white border border-black/15 px-2.5 py-1.5 text-xs font-bold text-navy hover:bg-black/5 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-blue-600" />
                Google Search Console
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
              <a
                href="https://www.bing.com/webmasters"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-white border border-black/15 px-2.5 py-1.5 text-xs font-bold text-navy hover:bg-black/5 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-teal-600" />
                Bing Webmaster Tools
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            Le fichier sitemap intègre les balises d'images haute résolution (<code className="text-navy">xmlns:image</code>) pour booster la visibilité de votre pack sur Google Images.
          </span>
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
                    <input placeholder="Chemin (ex: /notre-boxer)" value={link.to} onChange={updateLink(columnIndex, linkIndex, "to")} className="admin-input min-w-[160px] flex-1" aria-label="Chemin du lien" />
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