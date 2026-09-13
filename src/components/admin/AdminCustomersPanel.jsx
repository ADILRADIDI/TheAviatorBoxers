import { useState } from "react";
import { Download, Eye } from "lucide-react";
import AdminModal from "./AdminModal";
import { formatNumber } from "@/lib/store";
const API = import.meta.env.VITE_API_URL || "";
async function request(path) { const response = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json", "x-admin-token": localStorage.getItem("aviator_admin_token") || "" } }); if (!response.ok) throw new Error(`Erreur API ${response.status}`); return response.json(); }

const handleExportCsv = async () => {
  try {
    const result = await request("/api/admin/exports/customers.csv");
    const blob = new Blob([result.content || ""], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = result.filename || "aviator-customers.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Erreur lors de l'export : " + err.message);
  }
};

export default function AdminCustomersPanel({ data }) {
  const [selected, setSelected] = useState(null); const [orders, setOrders] = useState([]);
  const open = async (customer) => { const result = await request(`/api/admin/orders?search=${encodeURIComponent(customer.phone)}&limit=100`); setOrders(result.data || result); setSelected(customer); };
  return (
    <section className="admin-card p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="admin-section-title">CRM</p><h2 className="admin-h2 mt-1">Clients</h2></div>
        <button onClick={handleExportCsv} className="admin-btn admin-btn-primary"><Download className="h-3.5 w-3.5" />Exporter CSV</button>
      </div>
      <div className="admin-list-scroll mt-6 overflow-x-auto rounded-xl border border-black/10">
        <div className="admin-list-head grid min-w-[720px] grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.5fr] gap-4 border-b border-black/10 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Client</span><span>Ville</span><span>Commandes</span><span>Dépensé</span><span />
        </div>
        {data.map((customer) => (
          <div key={customer.phone} className="grid min-w-[720px] grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.5fr] items-center gap-4 border-b border-black/8 px-4 py-4 last:border-0 hover:bg-black/[0.02]">
            <div><strong className="text-sm text-navy">{customer.name || "Client invité"}</strong><p className="mt-1 text-xs text-muted-foreground">{customer.phone}</p></div>
            <span className="text-sm">{customer.city}</span>
            <span className="text-sm">{customer.orders}</span>
            <strong className="text-sm text-navy">{formatNumber(customer.totalSpent)} DH</strong>
            <button onClick={() => open(customer)} className="justify-self-end rounded-md border border-black/10 p-2 hover:bg-black/5" aria-label={`Voir ${customer.name || customer.phone}`}><Eye className="h-4 w-4" /></button>
          </div>
        ))}
        {!data.length && <p className="px-4 py-10 text-center text-sm text-muted-foreground">Aucun client enregistré.</p>}
      </div>
      <AdminModal open={Boolean(selected)} title={selected?.name || "Client invité"} onClose={() => setSelected(null)}>
        {selected && <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-black/10 p-4"><p className="text-xs text-muted-foreground">Téléphone</p><strong className="text-navy">{selected.phone}</strong></div>
            <div className="rounded-lg border border-black/10 p-4"><p className="text-xs text-muted-foreground">Commandes</p><strong className="text-navy">{selected.orders}</strong></div>
            <div className="rounded-lg border border-black/10 p-4"><p className="text-xs text-muted-foreground">Dépensé</p><strong className="text-navy">{formatNumber(selected.totalSpent)} DH</strong></div>
          </div>
          <div>
            <p className="admin-section-title mb-2">Commandes de ce client</p>
            {orders.length > 0 ? (
              <div className="divide-y divide-black/10 rounded-lg border border-black/10">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                    <strong className="font-mono text-xs text-navy">{order.orderNumber}</strong>
                    <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span>
                    <span className="admin-badge !bg-accent-lime/15 !text-navy !border-accent-lime/40">{order.status}</span>
                    <strong className="text-xs">{formatNumber((order.total || 0) / 100)} DH</strong>
                  </div>
                ))}
              </div>
            ) : <p className="py-6 text-center text-sm text-muted-foreground">Aucune commande trouvée.</p>}
          </div>
        </div>}
      </AdminModal>
    </section>
  );
}