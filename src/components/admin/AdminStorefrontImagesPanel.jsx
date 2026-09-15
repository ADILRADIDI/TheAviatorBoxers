import { useState } from "react";
import { ImagePlus, Save, Link2, Trash2, Check, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";
const request = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, {
    headers: {
      ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      "x-admin-token": localStorage.getItem("aviator_admin_token") || "",
    },
    ...options,
  });
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
};

const SLOTS = [
  { key: "logo", label: "Logo", hint: "En-tête, pied de page & favicon", multiple: false },
  { key: "heroSlider", label: "Slider d'accueil", hint: "Grandes images du héros (3)", multiple: true },
  { key: "brandStory", label: "Histoire de la marque", hint: "Page À propos & en-tête de page", multiple: false },
  { key: "packFive", label: "Pack The Aviator", hint: "Preview du pack sur l'accueil", multiple: false },
  { key: "fabricMacro", label: "Tissu premium", hint: "Page Qualité — détail du tissu", multiple: false },
  { key: "product3d", label: "Produit 3D", hint: "Bénéfices — vue produit", multiple: false },
];

export default function AdminStorefrontImagesPanel() {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState({});
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    let settings;
    try {
      settings = await request("/api/admin/settings");
    } catch {
      settings = {};
    }
    const overrides = settings.storefront_images && typeof settings.storefront_images === "object"
      ? settings.storefront_images
      : {};
    if (!form) setForm(overrides);
    return { overrides };
  };

  const current = (key) => {
    const value = form && form[key];
    if (key === "heroSlider") return Array.isArray(value) ? value : [value].filter(Boolean);
    return value;
  };

  const setSlot = (key, value) => {
    setForm((f) => {
      const next = { ...(f || {}) };
      if (Array.isArray(next[key])) next[key] = [value];
      else next[key] = value;
      return next;
    });
  };

  const setHeroIndex = (index, value) => {
    setForm((f) => {
      const next = { ...(f || {}) };
      const list = Array.isArray(next.heroSlider) ? [...next.heroSlider] : [];
      list[index] = value;
      next.heroSlider = list;
      return next;
    });
  };

  const addHeroSlide = () => {
    setForm((f) => {
      const next = { ...(f || {}) };
      const list = Array.isArray(next.heroSlider) ? [...next.heroSlider] : [];
      list.push("");
      next.heroSlider = list;
      return next;
    });
  };

  const removeHeroSlide = (index) => {
    setForm((f) => {
      const next = { ...(f || {}) };
      const list = Array.isArray(next.heroSlider) ? [...next.heroSlider] : [];
      list.splice(index, 1);
      next.heroSlider = list;
      return next;
    });
  };

  const uploadFor = async (slotKey, file) => {
    if (!file) return;
    setUploadingSlot(slotKey);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const asset = await request("/api/admin/media", { method: "POST", body });
      const url = asset.file_url || asset.url || asset.path;
      if (!url) throw new Error("Le serveur n'a pas renvoyé d'URL.");
      if (slotKey === "heroSlider") {
        setForm((f) => {
          const next = { ...(f || {}) };
          const list = Array.isArray(next.heroSlider) ? [...next.heroSlider] : [];
          list.push(url);
          next.heroSlider = list;
          return next;
        });
      } else {
        setSlot(slotKey, url);
      }
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploadingSlot(null);
    }
  };

  const removeSlot = (key) => {
    setForm((f) => {
      const next = { ...(f || {}) };
      delete next[key];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const settings = await request("/api/admin/settings");
      const cleaned = {};
      for (const key of Object.keys(form || {})) {
        if (!form[key]) continue;
        if (key === "heroSlider") {
          const slides = Array.isArray(form[key]) ? form[key].filter(Boolean) : [];
          if (slides.length) cleaned[key] = slides;
        } else {
          cleaned[key] = form[key];
        }
      }
      const nextSettings = { ...settings, storefront_images: cleaned };
      await request("/api/admin/settings", { method: "PUT", body: JSON.stringify(nextSettings) });
      setMessage("Images publiées sur la boutique.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => { event.preventDefault(); save(); }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="admin-section-title">Contenu</p>
          <h2 className="admin-h2 mt-1">Images de la boutique</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Remplacez les photos par défaut (héros, logo, histoire, packs, tissu, produit 3D). Laissez un champ vide pour garder l'image actuelle.
          </p>
        </div>
        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
          <Save className="h-4 w-4" /> {saving ? "Publication..." : "Publier"}
        </button>
      </div>

      <p className="text-sm text-muted-foreground">Astuce : passez par la Médiathèque pour importer vos fichiers puis sélectionnez-les ici, ou reliez directement une URL (Google Photos, Fichier local, etc.).</p>

      {error && <div className="admin-card border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      {message && <div className="admin-card border-accent-lime/40 bg-accent-lime/10 p-4 text-sm text-navy">{message}</div>}

      <div className="grid gap-5">
        {SLOTS.map((slot) => (
          <SlotCard
            key={slot.key}
            slot={slot}
            value={current(slot.key)}
            uploading={uploadingSlot === slot.key}
            onChange={slot.key === "heroSlider" ? undefined : (v) => setSlot(slot.key, v)}
            onHeroIndex={slot.key === "heroSlider" ? setHeroIndex : undefined}
            onAddHero={slot.key === "heroSlider" ? addHeroSlide : undefined}
            onRemoveHero={slot.key === "heroSlider" ? removeHeroSlide : undefined}
            onUpload={(file) => uploadFor(slot.key, file)}
            onRemove={() => removeSlot(slot.key)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
          <Save className="h-4 w-4" /> {saving ? "Publication..." : "Publier"}
        </button>
      </div>
    </form>
  );
}

function SlotCard({ slot, value, uploading, onChange, onHeroIndex, onAddHero, onRemoveHero, onUpload, onRemove }) {
  const [urlDraft, setUrlDraft] = useState("");
  const previewUrl = (() => {
    if (slot.multiple) return Array.isArray(value) && value[0] ? value[0] : "";
    return value || "";
  })();
  const hasValue = slot.multiple ? Array.isArray(value) && value.length > 0 : Boolean(valuehedral);
  return (
    <section className="admin-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-[180px] flex-1">
          <h3 className="admin-h2 text-lg">{slot.label}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{slot.hint}</p>
        </div>
        {hasValue && (
          <button type="button" onClick={onRemove} className="admin-btn admin-btn-danger !px-3" aria-label={`Effacer ${slot.label}`}>
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden border border-black/10 bg-black/[0.03] sm:w-40">
          {previewUrl ? (
            <img src={previewUrl} alt={slot.label} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground/50" />
          )}
        </div>

        <div className="grid flex-1 gap-2.5">
          <label className="flex cursor-pointer items-center gap-2 rounded border border-black/10 px-3 py-2 text-xs font-semibold text-navy hover:bg-black/[0.03]">
            <ImagePlus className="h-4 w-4" />
            {uploading ? "Import en cours..." : filled("Importer un fichier")}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(file);
                event.target.value = "";
              }}
            />
          </label>

          {!slot.multiple && (
            <div className="flex items-center gap-2">
              <input
                value={urlDraft}
                onChange={(event) => setUrlDraft(event.target.value)}
                placeholder="Collez une URL d'image…"
                className="admin-input flex-1"
                aria-label={`URL pour ${slot.label}`}
              />
              <button
                type="button"
                onClick={() => { if (urlDraft.trim() && onChange) onChange(urlDraft.trim()); setUrlDraft(""); }}
                className="admin-btn admin-btn-ghost !px-3"
                aria-label={`Appliquer l'URL ${slot.label}`}
              >
                <Link2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {slot.multiple && (
            <div className="space-y-2">
              {(Array.isArray(value) ? value : []).map((src, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={src || ""}
                    onChange={(event) => onHeroIndex && onHeroIndex(index, event.target.value)}
                    placeholder={`Image n°${index + 1}…`}
                    className="admin-input flex-1"
                    aria-label={`Image de slider n°${index + 1}`}
                  />
                  <button type="button" onClick={() => onRemoveHero && onRemoveHero(index)} className="text-destructive" aria-label={`Retirer l'image n°${index + 1}`}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={onAddHero} className="admin-btn admin-btn-ghost">
                <Plus className="h-4 w-4" /> Ajouter une image
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function filled(label) { return label; }
