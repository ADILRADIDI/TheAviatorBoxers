import { useState } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import AdminModal from "./AdminModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json", "x-admin-token": localStorage.getItem("aviator_admin_token") || "" }, ...options });
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
}

const emptyForm = { code: "", name: "", description: "", instructions: "", sort_order: "0" };

export default function AdminPaymentMethodsPanel({ data, refresh }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await request("/api/admin/payment-methods", { method: "POST", body: JSON.stringify({ ...form, sort_order: Number(form.sort_order || 0) }) });
      setForm(emptyForm);
      setOpen(false);
      refresh();
    } catch (requestError) { setError(requestError.message); }
  };

  const toggle = async (method) => {
    await request(`/api/admin/payment-methods/${method.id}`, { method: "PATCH", body: JSON.stringify({ active: !method.active }) });
    refresh();
  };

  const remove = async (method) => {
    if (!window.confirm(`Supprimer « ${method.name} » ?`)) return;
    await request(`/api/admin/payment-methods/${method.id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <section className="border border-border bg-background p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Réglages</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Moyens de paiement</h2>
          <p className="mt-2 text-sm text-muted-foreground">Seuls les moyens actifs sont proposés aux clients au checkout.</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-navy px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"><Plus className="h-4 w-4" />Nouveau moyen</button>
      </div>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {data.map((method) => (
          <div key={method.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-secondary"><CreditCard className="h-4 w-4 text-navy" /></span>
              <div>
                <strong>{method.name}</strong>
                <p className="text-xs text-muted-foreground">{method.code} · ordre {method.sortOrder}</p>
                {method.description && <p className="mt-1 max-w-md text-xs text-muted-foreground">{method.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(method)} className={`px-3 py-1 text-xs font-bold ${method.active ? "bg-accent-lime text-navy" : "bg-muted text-muted-foreground"}`}>{method.active ? "Actif" : "Inactif"}</button>
              <button onClick={() => remove(method)} className="border border-border p-2 text-destructive" aria-label={`Supprimer ${method.name}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {!data.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun moyen de paiement. Ajoutez le paiement à la livraison (COD) pour commencer.</p>}
      </div>
      <AdminModal open={open} title="Nouveau moyen de paiement" description="Ex. cod (paiement à la livraison) ou cmi (carte bancaire)." onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <input required placeholder="Code (ex. cod, cmi)" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.trim().toLowerCase() })} className="w-full border border-border px-4 py-3 text-sm" />
          <input required placeholder="Nom affiché (ex. Paiement à la livraison)" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" />
          <input placeholder="Description courte" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" />
          <textarea placeholder="Instructions client (optionnel)" value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} rows={3} className="w-full border border-border px-4 py-3 text-sm" />
          <input required type="number" min="0" placeholder="Ordre d'affichage" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} className="w-full border border-border px-4 py-3 text-sm" />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setOpen(false)} className="border border-border px-4 py-3 text-xs font-bold uppercase">Annuler</button>
            <button className="bg-navy px-4 py-3 text-xs font-bold uppercase text-white">Créer</button>
          </div>
        </form>
      </AdminModal>
    </section>
  );
}
