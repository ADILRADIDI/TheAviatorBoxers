import { useState } from "react";
import { AlertTriangle, Boxes, CheckCircle2, Download, History, RefreshCw, Search } from "lucide-react";
import AdminModal from "./AdminModal";
import { adminRequest as request } from "@/lib/adminApi";

export default function AdminInventoryPanel({ data, refresh }) {
  const items = Array.isArray(data) ? data : [];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | low | ok
  const [editing, setEditing] = useState(null);
  const [stock, setStock] = useState(0);
  const [reason, setReason] = useState("");
  const [movements, setMovements] = useState([]);
  const [showMovements, setShowMovements] = useState(false);
  const [loadingMovements, setLoadingMovements] = useState(false);

  const handleExportCsv = async () => {
    try {
      const result = await request("/api/admin/exports/inventory.csv");
      const blob = new Blob([result.content || ""], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || `aviator-inventaire-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur lors de l'export : " + err.message);
    }
  };

  const adjust = async (event) => {
    event.preventDefault();
    try {
      await request(`/api/admin/inventory/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ stock: Number(stock), reason: reason.trim() || "Ajustement manuel" })
      });
      setEditing(null);
      setReason("");
      refresh();
    } catch (err) {
      alert("Erreur lors de l'ajustement : " + err.message);
    }
  };

  const openMovements = async () => {
    setLoadingMovements(true);
    setShowMovements(true);
    try {
      const result = await request("/api/admin/inventory/movements?page=1&limit=100");
      setMovements(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setMovements([]);
    } finally {
      setLoadingMovements(false);
    }
  };

  const filteredItems = items.filter((variant) => {
    const s = search.toLowerCase();
    const sku = (variant.sku || "").toLowerCase();
    const color = (variant.color || variant.color_name || "").toLowerCase();
    const size = (variant.size || "").toLowerCase();
    const prod = (variant.productName || variant.product_name || "").toLowerCase();
    const matchesSearch = !search || sku.includes(s) || color.includes(s) || size.includes(s) || prod.includes(s);

    const currentStock = Number(variant.stock ?? variant.currentStock ?? 0);
    const threshold = Number(variant.lowStockThreshold ?? variant.minStock ?? 5);
    const isLow = currentStock <= threshold;

    if (filter === "low") return matchesSearch && isLow;
    if (filter === "ok") return matchesSearch && !isLow;
    return matchesSearch;
  });

  const lowStockCount = items.filter((v) => Number(v.stock ?? v.currentStock ?? 0) <= Number(v.lowStockThreshold ?? v.minStock ?? 5)).length;
  const totalStockCount = items.reduce((sum, v) => sum + Number(v.stock ?? v.currentStock ?? 0), 0);

  return (
    <section className="border border-border bg-background p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Logistique & Entrepôt</p>
          <h2 className="mt-1 font-heading text-2xl font-bold">Inventaire & Stock</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Suivi des stocks en temps réel par variante, alertes de rupture et mouvements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 border border-border bg-background px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Exporter CSV
          </button>
          <button
            onClick={openMovements}
            className="flex items-center gap-1.5 border border-border bg-background px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted"
          >
            <History className="h-3.5 w-3.5" />
            Historique Mouvements
          </button>
        </div>
      </div>

      {/* KPI mini-cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded border border-border bg-muted/20 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Références</p>
          <p className="mt-1 text-2xl font-bold text-navy">{items.length} variantes</p>
        </div>
        <div className="rounded border border-border bg-muted/20 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Unités en Stock</p>
          <p className="mt-1 text-2xl font-bold text-navy">{totalStockCount} pièces</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded border border-border bg-muted/20 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Alertes Stock Faible</p>
          <p className={`mt-1 text-2xl font-bold ${lowStockCount > 0 ? "text-destructive" : "text-emerald-600"}`}>
            {lowStockCount} {lowStockCount > 1 ? "alertes" : "alerte"}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par SKU, taille, couleur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-border bg-background pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-navy"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded ${
              filter === "all" ? "bg-navy text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Tous ({items.length})
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`px-3 py-1.5 text-xs font-bold rounded ${
              filter === "low" ? "bg-destructive text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Stock faible ({lowStockCount})
          </button>
          <button
            onClick={() => setFilter("ok")}
            className={`px-3 py-1.5 text-xs font-bold rounded ${
              filter === "ok" ? "bg-emerald-600 text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Stock OK ({items.length - lowStockCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-list-scroll mt-4 overflow-x-auto rounded border border-border">
        <div className="grid min-w-[760px] grid-cols-[1.5fr_0.8fr_1fr_1fr_1fr_auto] gap-4 bg-muted/40 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>SKU & Produit</span>
          <span>Taille</span>
          <span>Couleur</span>
          <span>Stock disponible</span>
          <span>Seuil d'alerte</span>
          <span className="text-right pr-2">Action</span>
        </div>

        <div className="divide-y divide-border">
          {filteredItems.map((variant) => {
            const currentStock = Number(variant.stock ?? variant.currentStock ?? 0);
            const threshold = Number(variant.lowStockThreshold ?? variant.minStock ?? 5);
            const isLow = currentStock <= threshold;
            const colorLabel = variant.color || variant.color_name || variant.colorName || "Standard";
            const sizeLabel = variant.size || "M";
            const productName = variant.productName || variant.product_name || "Pack 2 Boxers THE AVIATOR";

            return (
              <div
                key={variant.id || variant.sku}
                className="grid min-w-[760px] grid-cols-[1.5fr_0.8fr_1fr_1fr_1fr_auto] items-center gap-4 px-4 py-3.5 hover:bg-muted/20 transition-colors"
              >
                <div>
                  <strong className="font-mono text-xs font-bold text-navy">{variant.sku}</strong>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">{productName}</p>
                </div>
                <div>
                  <span className="inline-block rounded border border-border bg-muted/30 px-2 py-0.5 text-xs font-bold text-foreground">
                    {sizeLabel}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground">
                    {colorLabel}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${isLow ? "text-destructive" : "text-navy"}`}>
                    {isLow ? <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                    {currentStock} unité{currentStock > 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Min. {threshold}
                  </span>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => {
                      setEditing(variant);
                      setStock(currentStock);
                    }}
                    className="inline-flex items-center gap-1 border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-navy hover:text-white transition-colors"
                  >
                    Ajuster
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!filteredItems.length && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <Boxes className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
            Aucune variante trouvée pour ces critères.
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      <AdminModal
        open={Boolean(editing)}
        title="Ajuster le stock"
        description={`Mise à jour directe du stock disponible pour la variante ${editing?.sku || ""}.`}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <form onSubmit={adjust} className="space-y-4">
            <div className="rounded border border-border bg-muted/20 p-3">
              <div className="font-mono text-sm font-bold text-navy">{editing.sku}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {editing.productName || "Pack 2 Boxers"} · Taille {editing.size || "M"} · {editing.color || editing.color_name || "Standard"}
              </div>
            </div>

            <div>
              <label className="admin-label">Nouveau stock (unités)</label>
              <input
                required
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-border px-4 py-2.5 text-sm font-bold"
              />
            </div>

            <div>
              <label className="admin-label">Motif de l'ajustement</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ex: Réception atelier, Inventaire physique, Retour..."
                className="w-full border border-border px-4 py-2.5 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="border border-border px-4 py-2.5 text-xs font-bold uppercase"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-navy px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-navy/90"
              >
                Enregistrer l'ajustement
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Movements Modal */}
      <AdminModal
        open={showMovements}
        size="2xl"
        title="Historique des mouvements de stock"
        description="Journal d'audit de toutes les entrées et sorties de stock."
        onClose={() => setShowMovements(false)}
      >
        <div className="max-h-[60vh] overflow-y-auto overscroll-contain divide-y divide-border border-y border-border">
          {movements.map((movement) => {
            const prev = Number(movement.previousStock ?? movement.beforeStock ?? 0);
            const next = Number(movement.newStock ?? movement.afterStock ?? 0);
            const isIncrease = next >= prev;
            const diff = next - prev;
            const skuLabel = movement.sku || movement.variantId || "SKU";
            const dateStr = movement.createdAt ? new Date(movement.createdAt).toLocaleString("fr-FR") : "Récent";

            return (
              <div key={movement.id || Math.random()} className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-navy">{skuLabel}</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{movement.reason || "Ajustement de stock"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      isIncrease
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {prev} → {next} ({isIncrease ? "+" : ""}{diff})
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {dateStr}
                  </span>
                </div>
              </div>
            );
          })}
          {!movements.length && !loadingMovements && (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucun mouvement enregistré pour le moment.</p>
          )}
          {loadingMovements && (
            <p className="py-8 text-center text-sm text-muted-foreground">Chargement des mouvements...</p>
          )}
        </div>
      </AdminModal>
    </section>
  );
}