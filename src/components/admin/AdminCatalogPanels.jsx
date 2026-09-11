import { useState } from "react";
import { Edit3, ImagePlus, Plus, Trash2 } from "lucide-react";
import AdminModal from "./AdminModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function adminRequest(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", "x-admin-token": localStorage.getItem("aviator_admin_token") || "" },
    ...options,
  });
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
}

const emptyProduct = { name: "", slug: "", price: "", stock: "", color_name: "Navy", images: "" };

export function AdminProductsPanel({ data, refresh }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setError(""); setOpen(true); };
  const openEdit = (product) => { setEditing(product); setForm({ ...product, images: (product.images || []).join("\n") }); setError(""); setOpen(true); };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = { ...form, images: form.images.split("\n").map((url) => url.trim()).filter(Boolean), price: Number(form.price), stock: Number(form.stock), sizes: form.sizes || ["S", "M", "L", "XL", "XXL"] };
      await adminRequest(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", { method: editing ? "PATCH" : "POST", body: JSON.stringify(payload) });
      setOpen(false); refresh();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };
  const remove = async (product) => {
    if (!window.confirm(`Supprimer ${product.name} ? Cette action est irréversible.`)) return;
    try { await adminRequest(`/api/admin/products/${product.id}`, { method: "DELETE" }); refresh(); } catch (requestError) { setError(requestError.message); }
  };

  return <section className="border border-border bg-background p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Catalogue</p><h2 className="mt-1 font-display text-2xl font-bold">Produits & stock</h2></div><button onClick={openCreate} className="flex items-center gap-2 bg-navy px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"><Plus className="h-4 w-4" />Nouveau produit</button></div>
    <div className="mt-6 divide-y divide-border border-y border-border">{data.map((product) => <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="flex items-center gap-3">{product.images?.[0] ? <img src={product.images[0]} alt="" className="h-12 w-12 object-cover" /> : <span className="flex h-12 w-12 items-center justify-center bg-muted"><ImagePlus className="h-4 w-4 text-muted-foreground" /></span>}<div><strong>{product.name}</strong><p className="text-xs text-muted-foreground">{product.slug} · {product.color_name || "Couleur non définie"}</p></div></div><div className="flex items-center gap-3"><span className={`text-sm font-bold ${product.stock < 5 ? "text-destructive" : "text-navy"}`}>{product.stock} en stock</span><button onClick={() => openEdit(product)} className="border border-border p-2 text-navy" aria-label={`Modifier ${product.name}`}><Edit3 className="h-4 w-4" /></button><button onClick={() => remove(product)} className="border border-border p-2 text-destructive" aria-label={`Supprimer ${product.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}{!data.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun produit. Ajoutez votre premier produit.</p>}</div>
    <AdminModal open={open} title={editing ? "Modifier le produit" : "Créer un produit"} description="Les modifications sont enregistrées dans PostgreSQL." onClose={() => setOpen(false)}><form onSubmit={save} className="space-y-4"><input required placeholder="Nom du produit" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><input required placeholder="Slug unique" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><div className="grid gap-3 sm:grid-cols-2"><input required min="0" type="number" placeholder="Prix DH" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><input required min="0" type="number" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /></div><input placeholder="Couleur" value={form.color_name || ""} onChange={(event) => setForm({ ...form, color_name: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Images produit<input placeholder="Une URL par ligne" value={form.images || ""} onChange={(event) => setForm({ ...form, images: event.target.value })} className="mt-2 h-24 w-full border border-border px-4 py-3 text-sm" /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setOpen(false)} className="border border-border px-4 py-3 text-xs font-bold uppercase">Annuler</button><button disabled={saving} className="bg-navy px-4 py-3 text-xs font-bold uppercase text-white disabled:opacity-50">{saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer"}</button></div></form></AdminModal>
  </section>;
}

export function AdminCategoriesPanel({ data, refresh }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const save = async (event) => { event.preventDefault(); await adminRequest("/api/admin/categories", { method: "POST", body: JSON.stringify(form) }); setForm({ name: "", slug: "", description: "" }); setOpen(false); refresh(); };
  return <section className="border border-border bg-background p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Catalogue</p><h2 className="mt-1 font-display text-2xl font-bold">Catégories</h2></div><button onClick={() => setOpen(true)} className="bg-navy px-4 py-3 text-xs font-bold uppercase text-white">Nouvelle catégorie</button></div><div className="mt-6 divide-y divide-border border-y border-border">{data.map((category) => <div key={category.id} className="flex items-center justify-between py-4"><div><strong>{category.name}</strong><p className="text-xs text-muted-foreground">/{category.slug} · {category.description}</p></div><span className="bg-accent-lime px-2 py-1 text-xs font-bold">{category.active ? "Active" : "Inactive"}</span></div>)}</div><AdminModal open={open} title="Créer une catégorie" onClose={() => setOpen(false)}><form onSubmit={save} className="space-y-4"><input required placeholder="Nom" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><input required placeholder="Slug unique" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /><textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" /> <div className="flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="border border-border px-4 py-3 text-xs font-bold uppercase">Annuler</button><button className="bg-navy px-4 py-3 text-xs font-bold uppercase text-white">Créer</button></div></form></AdminModal></section>;
}
