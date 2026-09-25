import { useState } from "react";
import { Boxes, Download, History } from "lucide-react";
import { adminRequest as request } from "@/lib/adminApi";
const handleExportCsv = async () => { try { const result = await request("/api/admin/exports/inventory.csv"); const blob = new Blob([result.content || ""], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = result.filename || "aviator-inventory.csv"; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); } catch (err) { alert("Erreur lors de l'export : " + err.message); } };
export default function AdminInventoryPanel({ data, refresh }) {
  const [editing, setEditing] = useState(null); const [stock, setStock] = useState(0); const [reason, setReason] = useState(""); const [movements, setMovements] = useState([]); const [showMovements, setShowMovements] = useState(false);
  const adjust = async (event) => { event.preventDefault(); await request(`/api/admin/inventory/${editing.id}`, { method: "PATCH", body: JSON.stringify({ stock: Number(stock), reason }) }); setEditing(null); setReason(""); refresh(); };
  const openMovements = async () => { const result = await request("/api/admin/inventory/movements?page=1&limit=100"); setMovements(result.data || result); setShowMovements(true); };
  return (
    <section className="admin-card p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="admin-section-title">Inventaire</p><h2 className="admin-h2 mt-1">Stock par variante</h2></div>
        <div className="flex gap-2">
          <button onClick={handleExportCsv} className="admin-btn admin-btn-primary"><Download className="h-3.5 w-3.5" />Exporter CSV</button>
          <button onClick={openMovements} className="admin-btn admin-btn-ghost"><History className="h-3.5 w-3.5" />Mouvements</button>
        </div>
      </div>
      <div className="admin-list-scroll mt-6 overflow-x-auto rounded-xl border border-black/10">
        <div className="admin-list-head grid min-w-[680px] grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>SKU / variante</span><span>Taille</span><span>Couleur</span><span>Stock</span><span>État</span>
        </div>
        {data.map((variant) => (
          <div key={variant.id} className="grid min-w-[680px] grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] items-center gap-4 border-t border-black/8 px-4 py-4 hover:bg-black/[0.02]">
            <div><strong className="font-mono text-sm text-navy">{variant.sku}</strong><p className="text-xs text-muted-foreground">{variant.productId}</p></div>
            <span>{variant.size}</span><span>{variant.color}</span>
            <strong className={variant.stock <= variant.lowStockThreshold ? "text-destructive" : "text-navy"}>{variant.stock}</strong>
            <span><button onClick={() => { setEditing(variant); setStock(variant.stock); }} className="admin-btn admin-btn-ghost !py-1.5">Ajuster</button></span>
          </div>
        ))}
        {!data.length && <p className="px-4 py-10 text-sm text-muted-foreground"><Boxes className="mr-2 inline h-4 w-4" />Aucune variante.</p>}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">Chaque ajustement est enregistré dans l’audit et l’historique des mouvements.</div>
      {editing && <div className="fixed inset-0 z-[100] flex overflow-y-auto bg-black/55 p-5 backdrop-blur-sm"><form onSubmit={adjust} className="admin-pop relative m-auto w-full max-w-md rounded-none bg-white p-6 shadow-2xl ring-1 ring-black/10 sm:rounded-2xl"><h3 className="admin-h2">Ajuster le stock</h3><p className="mt-1 font-mono text-xs text-muted-foreground">{editing.sku} · {editing.size} · {editing.color}</p><label className="admin-label mt-4">Nouveau stock</label><input required type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="admin-input" /><label className="admin-label mt-4">Motif</label><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Inventaire, retour fournisseur..." className="admin-input" /><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="admin-btn admin-btn-ghost">Annuler</button><button className="admin-btn admin-btn-primary">Enregistrer l'ajustement</button></div></form></div>}
      {showMovements && <div className="fixed inset-0 z-[100] flex overflow-y-auto bg-black/55 p-5 backdrop-blur-sm"><div className="admin-pop relative m-auto w-full max-w-2xl overflow-hidden rounded-none bg-white shadow-2xl ring-1 ring-black/10 sm:rounded-2xl"><div className="flex items-start justify-between gap-4 border-b border-black/10 px-6 py-5"><div><h3 className="admin-h2">Mouvements de stock</h3><p className="mt-1 text-sm text-muted-foreground">Historique des ajustements récents.</p></div><button onClick={() => setShowMovements(false)} className="rounded-md p-2 hover:bg-black/5" aria-label="Fermer">✕</button></div><div className="max-h-[70vh] overflow-y-auto overscroll-contain divide-y divide-black/10 px-6 pb-6">{movements.length > 0 ? movements.map((movement) => <div key={movement.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span className="font-mono text-xs text-navy">{movement.variantId}</span><span className="text-xs text-muted-foreground">{movement.reason || "Ajustement"}</span><span className={`admin-badge ${movement.afterStock >= movement.beforeStock ? "!bg-accent-lime/15 !text-navy" : "!bg-destructive/10 !text-destructive"}`}>{movement.beforeStock} → {movement.afterStock}</span><span className="text-xs text-muted-foreground">{new Date(movement.createdAt).toLocaleString("fr-FR")}</span></div>) : <p className="py-8 text-center text-sm text-muted-foreground">Aucun mouvement.</p>}</div></div></div>}
    </section>
  );
}