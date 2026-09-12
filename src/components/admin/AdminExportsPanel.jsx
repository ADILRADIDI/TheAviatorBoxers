import { FileSpreadsheet, FileText } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const EXPORTS = [
  { path: "/api/admin/exports/orders.csv", label: "Commandes", detail: "Toutes les commandes avec client, ville, statut et total.", format: "csv" },
  { path: "/api/admin/exports/products.csv", label: "Produits", detail: "Catalogue complet avec prix, stock et couleurs.", format: "csv" },
  { path: "/api/admin/exports/customers.csv", label: "Clients", detail: "Clients regroupés par téléphone avec total dépensé.", format: "csv" },
  { path: "/api/admin/exports/inventory.csv", label: "Inventaire", detail: "Stock par variante (SKU, taille, couleur).", format: "csv" },
  { path: "/api/admin/exports/sales.csv", label: "Ventes (CSV)", detail: "Indicateurs commerciaux par période.", format: "csv" },
  { path: "/api/admin/exports/sales.xlsx", label: "Ventes (Excel)", detail: "Même rapport au format Excel.", format: "xlsx" },
];

export default function AdminExportsPanel() {
  const download = async (item) => {
    const response = await fetch(`${API}${item.path}`, { headers: { "x-admin-token": localStorage.getItem("aviator_admin_token") || "" } });
    if (!response.ok) throw new Error(`Erreur API ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    let blob;
    let filename = item.path.split("/").pop();
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      blob = new Blob([payload.content], { type: payload.contentType || "text/csv; charset=utf-8" });
      filename = payload.filename || filename;
    } else {
      blob = await response.blob();
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="border border-border bg-background p-5 sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Pilotage</p>
      <h2 className="mt-1 font-display text-2xl font-bold">Exports & rapports</h2>
      <p className="mt-2 text-sm text-muted-foreground">Téléchargez les données opérationnelles au format CSV ou Excel.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {EXPORTS.map((item) => (
          <button key={item.path} onClick={() => download(item)} className="flex items-start gap-4 border border-border p-4 text-left transition-colors hover:border-navy hover:bg-secondary">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-navy text-white">{item.format === "xlsx" ? <FileSpreadsheet className="h-4 w-4" /> : <FileText className="h-4 w-4" />}</span>
            <span>
              <strong className="block text-sm font-semibold text-navy">{item.label}</strong>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.detail}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
