import { useState } from "react";
import { Download, Edit3, ImagePlus, Plus, Trash2 } from "lucide-react";
import AdminModal from "./AdminModal";

const API = import.meta.env.VITE_API_URL || "";

async function adminRequest(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}), "x-admin-token": localStorage.getItem("aviator_admin_token") || "" },
    ...options,
  });
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
}

const emptyProduct = { name: "", slug: "", price: "", stock: "", color_name: "Navy", images: [], description: "", featured: false };

export function AdminProductsPanel({ data, refresh }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setError(""); setStep(1); setOpen(true); };
  const openEdit = (product) => {
    setEditing(product);
    setForm({
      ...product,
      images: Array.isArray(product.images) ? [...product.images] : [],
      description: product.description || "",
      featured: Boolean(product.featured),
    });
    setError("");
    setStep(1);
    setOpen(true);
  };
  const stepValid = () => {
    if (step === 1 && (!form.name.trim() || !form.slug.trim() || form.price === "" || form.stock === "")) {
      setError("Remplissez le nom, le slug, le prix et le stock pour continuer.");
      return false;
    }
    return true;
  };
  const goToStep = (next) => setTimeout(() => { setError(""); setStep(next); }, 0);
  const uploadImages = async (files) => {
    setError("");
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const asset = await adminRequest("/api/admin/media", { method: "POST", body: formData });
        if (asset?.url) uploaded.push(asset.url);
      }
      if (uploaded.length) setForm((current) => ({ ...current, images: [...(current.images || []), ...uploaded] }));
    } catch (uploadError) {
      setError(uploadError.message || "Échec de l'import d'images.");
    }
  };
  const removeImage = (index) => setForm((current) => ({ ...current, images: (current.images || []).filter((_, i) => i !== index) }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = {
        ...form,
        images: (form.images || []).map((url) => url.trim()).filter(Boolean),
        price: Number(form.price),
        stock: Number(form.stock),
        sizes: form.sizes || ["S", "M", "L", "XL", "XXL"],
        description: form.description?.trim() || "",
        featured: Boolean(form.featured),
      };
      await adminRequest(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", { method: editing ? "PATCH" : "POST", body: JSON.stringify(payload) });
      setOpen(false); refresh();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };
  const remove = async (product) => {
    if (!window.confirm(`Supprimer ${product.name} ? Cette action est irréversible.`)) return;
    try { await adminRequest(`/api/admin/products/${product.id}`, { method: "DELETE" }); refresh(); } catch (requestError) { setError(requestError.message); }
  };
  const exportCsv = async () => {
    try {
      const result = await adminRequest("/api/admin/exports/products.csv");
      const blob = new Blob([result.content || ""], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || "aviator-products.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (requestError) { setError(requestError.message); }
  };

  return <section className="admin-card p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="admin-section-title">Catalogue</p><h2 className="admin-h2 mt-1">Produits & stock</h2></div><div className="flex flex-wrap gap-2"><button onClick={exportCsv} className="admin-btn admin-btn-ghost"><Download className="h-3.5 w-3.5" />Exporter CSV</button><button onClick={openCreate} className="admin-btn admin-btn-primary"><Plus className="h-4 w-4" />Nouveau produit</button></div></div>
    <div className="admin-list-scroll mt-6 divide-y divide-black/10 rounded-xl border border-black/10">{data.map((product) => <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 py-4 px-4 hover:bg-black/[0.02]"><div className="flex items-center gap-3">{product.images?.[0] ? <img src={product.images[0]} alt="" className="h-12 w-12 object-cover" /> : <span className="flex h-12 w-12 items-center justify-center bg-muted"><ImagePlus className="h-4 w-4 text-muted-foreground" /></span>}<div><div className="flex items-center gap-2"><strong>{product.name}</strong>{product.featured && <span className="bg-accent-lime text-navy text-[10px] font-bold px-1.5 py-0.5 rounded">En avant</span>}</div><p className="text-xs text-muted-foreground">{product.slug} · {product.color_name || "Couleur non définie"}</p>{product.description && <p className="mt-0.5 text-xs text-muted-foreground/80 line-clamp-1">{product.description}</p>}</div></div><div className="flex items-center gap-3"><span className={`text-sm font-bold ${product.stock < 5 ? "text-destructive" : "text-navy"}`}>{product.stock} en stock</span><button onClick={() => openEdit(product)} className="border border-border p-2 text-navy" aria-label={`Modifier ${product.name}`}><Edit3 className="h-4 w-4" /></button><button onClick={() => remove(product)} className="border border-border p-2 text-destructive" aria-label={`Supprimer ${product.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}{!data.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun produit. Ajoutez votre premier produit.</p>}</div>
    <AdminModal open={open} size="2xl" title={editing ? "Modifier le produit" : "Créer un produit"} description="Assistant en 3 étapes — les modifications sont enregistrées dans PostgreSQL." onClose={() => setOpen(false)}>
      <form onSubmit={save} className="space-y-5">
        <ol className="flex items-center gap-1 rounded-xl border border-black/10 bg-black/[0.02] p-2 text-[10px] font-bold uppercase tracking-wider">
          {[{ n: 1, label: "Informations" }, { n: 2, label: "Images & couleurs" }, { n: 3, label: "Validation" }].map((item, index) => (
            <li key={item.n} className="flex flex-1 items-center gap-1 overflow-hidden">
              {index > 0 && <span className="mx-1 h-px flex-1 bg-black/10" />}
              <button type="button" onClick={() => { if (item.n < step || stepValid()) goToStep(item.n); }} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors ${step === item.n ? "bg-navy text-white" : item.n < step ? "text-navy hover:bg-black/5" : "cursor-default text-muted-foreground/60"}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step === item.n ? "bg-white/20" : item.n < step ? "bg-accent-lime" : "bg-black/5"}`}>{item.n}</span><span className="hidden sm:inline">{item.label}</span></button>
            </li>
          ))}
        </ol>
        {step === 1 && <div className="space-y-4"><input required placeholder="Nom du produit" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><input required placeholder="Slug unique (ex: boxer-navy-premium)" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><div className="grid gap-3 sm:grid-cols-2"><input required min="0" type="number" placeholder="Prix DH" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><input required min="0" type="number" placeholder="Stock initial" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /></div><textarea rows={4} placeholder="Description du produit (qualité, matière, détails...)" value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full resize-none border border-border px-4 py-3 text-sm" /></div>}
        {step === 2 && <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><input placeholder="Couleur principale" value={form.color_name || ""} onChange={(event) => setForm({ ...form, color_name: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><label className="flex items-center gap-2 rounded border border-border px-4 text-sm font-semibold text-navy"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="accent-navy h-4 w-4" />Produit mis en avant</label></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Images produit (import multiple)</label><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(event) => { uploadImages(event.target.files); event.target.value = ""; }} className="mt-2 block w-full cursor-pointer border border-dashed border-border px-3 py-4 text-sm file:mr-3 file:cursor-pointer file:border-0 file:bg-navy file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-white" aria-label="Importer plusieurs images" /><p className="mt-1.5 text-[11px] text-muted-foreground">Sélectionnez une ou plusieurs images : elles sont importées dans la médiathèque puis associées au produit.</p>{form.images?.length ? <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{form.images.map((url, index) => <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden border border-border"><img src={`${API}${url}`} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-label="Retirer cette image"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div> : <p className="mt-2 text-xs text-muted-foreground">Aucune image associée pour le moment.</p>}</div></div>}
        {step === 3 && <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4"><dl className="space-y-2 text-sm"><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Nom</dt><dd className="font-semibold text-navy">{form.name || "—"}</dd></div><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Slug</dt><dd className="font-mono text-xs text-navy">{form.slug || "—"}</dd></div><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Prix</dt><dd className="font-semibold">{form.price ? `${form.price} DH` : "—"}</dd></div><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Stock</dt><dd className="font-semibold">{form.stock ?? "—"} unités</dd></div><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Couleur</dt><dd className="font-semibold">{form.color_name || "—"}</dd></div><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">En avant</dt><dd>{form.featured ? "Oui" : "Non"}</dd></div><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Images</dt><dd>{form.images?.length || 0} importée(s)</dd></div></dl></div>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-between gap-3 border-t border-black/10 pt-4"><button type="button" onClick={() => setOpen(false)} className="border border-border px-4 py-3 text-xs font-bold uppercase">Annuler</button><div className="flex gap-3">{step > 1 && <button type="button" onClick={() => { setError(""); goToStep(step - 1); }} className="border border-border px-4 py-3 text-xs font-bold uppercase">Précédent</button>}{step < 3 ? <button type="button" onClick={() => { if (stepValid()) { setError(""); goToStep(step + 1); } }} className="bg-navy px-5 py-3 text-xs font-bold uppercase text-white">Suivant</button> : <button disabled={saving} className="bg-navy px-5 py-3 text-xs font-bold uppercase text-white disabled:opacity-50">{saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer le produit"}</button>}</div></div>
      </form>
    </AdminModal>
  </section>;
}

export function AdminCategoriesPanel({ data, refresh }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [error, setError] = useState("");
  const openCreate = () => { setEditing(null); setForm({ name: "", slug: "", description: "" }); setError(""); setOpen(true); };
  const openEdit = (category) => { setEditing(category); setForm({ name: category.name, slug: category.slug, description: category.description || "" }); setError(""); setOpen(true); };
  const save = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await adminRequest(editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories", { method: editing ? "PATCH" : "POST", body: JSON.stringify(form) });
      setOpen(false); refresh();
    } catch (requestError) { setError(requestError.message); }
  };
  const toggle = async (category) => { try { await adminRequest(`/api/admin/categories/${category.id}`, { method: "PATCH", body: JSON.stringify({ active: !category.active }) }); refresh(); } catch (requestError) { setError(requestError.message); } };
  const remove = async (category) => { if (window.confirm(`Supprimer la catégorie ${category.name} ?`)) { try { await adminRequest(`/api/admin/categories/${category.id}`, { method: "DELETE" }); refresh(); } catch (requestError) { setError(requestError.message); } } };
  return <section className="border border-border bg-background p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Catalogue</p><h2 className="mt-1 font-display text-2xl font-bold">Catégories</h2></div><button onClick={openCreate} className="bg-navy px-4 py-3 text-xs font-bold uppercase text-white">Nouvelle catégorie</button></div>{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<div className="admin-list-scroll mt-6 divide-y divide-border border-y border-border">{data.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 py-4"><div><strong>{category.name}</strong><p className="text-xs text-muted-foreground">/{category.slug} · {category.description || "Aucune description"}</p></div><div className="flex items-center gap-2"><button onClick={() => toggle(category)} className={`px-2 py-1 text-xs font-bold ${category.active ? "bg-accent-lime text-navy" : "bg-muted text-muted-foreground"}`}>{category.active ? "Active" : "Inactive"}</button><button onClick={() => openEdit(category)} className="border border-border p-2 text-navy" aria-label={`Modifier ${category.name}`}><Edit3 className="h-4 w-4" /></button><button onClick={() => remove(category)} className="border border-border p-2 text-destructive" aria-label={`Supprimer ${category.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}{!data.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucune catégorie.</p>}</div>{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<AdminModal open={open} title={editing ? "Modifier la catégorie" : "Créer une catégorie"} onClose={() => setOpen(false)}><form onSubmit={save} className="space-y-4"><input required placeholder="Nom" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><input required placeholder="Slug unique" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /> <div className="flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="border border-border px-4 py-3 text-xs font-bold uppercase">Annuler</button><button className="bg-navy px-4 py-3 text-xs font-bold uppercase text-white">{editing ? "Enregistrer" : "Créer"}</button></div></form></AdminModal></section>;
}
