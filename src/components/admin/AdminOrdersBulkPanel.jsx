import { useState } from "react";
import { CheckSquare, Download, Eye, Square, Trash2, Calendar, Phone, MapPin, Mail, FileText, Tag, Undo2 } from "lucide-react";
import AdminModal from "./AdminModal";
import { formatNumber } from "@/lib/store";

import { adminRequest as request } from "@/lib/adminApi";

const statusBadges = {
  nouvelle: "bg-amber-50 text-amber-700 border-amber-200",
  confirmee: "bg-blue-50 text-blue-700 border-blue-200",
  preparation: "bg-purple-50 text-purple-700 border-purple-200",
  expediee: "bg-indigo-50 text-indigo-700 border-indigo-200",
  livree: "bg-emerald-50 text-emerald-700 border-emerald-200",
  annulee: "bg-rose-50 text-rose-700 border-rose-200",
};

const returnStatusBadges = {
  requested: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  completed: "bg-sky-50 text-sky-700 border-sky-200",
};

const returnStatusLabels = {
  requested: "Retour demandé",
  approved: "Retour accepté",
  rejected: "Retour refusé",
  completed: "Retour terminé",
};

function TrafficSourceBadge({ source }) {
  const s = String(source || "DIRECT").toUpperCase();
  if (s.includes("TIKTOK")) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white tracking-wide border border-black shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00f2fe]" />
        TIKTOK
      </span>
    );
  }
  if (s.includes("INSTA") || s.includes("IG")) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 text-[10px] font-bold tracking-wide">
        <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
        INSTAGRAM
      </span>
    );
  }
  if (s.includes("FACEBOOK") || s.includes("FB") || s.includes("META")) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold tracking-wide">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
        FACEBOOK
      </span>
    );
  }
  if (s.includes("YOUTUBE") || s.includes("YT")) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[10px] font-bold tracking-wide">
        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
        YOUTUBE
      </span>
    );
  }
  if (s.includes("GOOGLE") || s.includes("GADS")) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold tracking-wide">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        GOOGLE
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-bold tracking-wide">
      DIRECT
    </span>
  );
}

export default function AdminOrdersBulkPanel({ data = [], refresh = () => {} }) {
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(false);

  const allSelected = data.length > 0 && selected.length === data.length;
  const toggleAll = () => setSelected(allSelected ? [] : data.map((order) => order.id));
  const toggle = (id) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const bulkStatus = async (status) => {
    setBusy(true);
    try {
      await Promise.all(
        selected.map((id) =>
          request(`/api/admin/orders/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
          })
        )
      );
      setSelected([]);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (order) => {
    if (!window.confirm(`Supprimer définitivement la commande ${order.orderNumber} ?`)) return;
    await request(`/api/admin/orders/${order.id}`, { method: "DELETE" });
    setSelected((current) => current.filter((id) => id !== order.id));
    refresh();
  };

  const updateReturn = async (returnRequest, status) => {
    setBusy("return");
    try {
      await request(`/api/admin/returns/${returnRequest.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setDetail((current) =>
        current
          ? { ...current, return_request: { ...current.return_request, status, stockRestored: current.return_request?.stockRestored || status === "approved" } }
          : current
      );
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const deleteReturn = async (returnRequest) => {
    if (returnRequest && !window.confirm("Supprimer définitivement cette demande de retour ?")) return;
    setBusy("return");
    try {
      await request(`/api/admin/returns/${returnRequest.id}`, { method: "DELETE" });
      setDetail((current) => (current ? { ...current, return_request: null } : current));
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportCsv = async () => {
    try {
      const result = await request("/api/admin/exports/orders.csv");
      const blob = new Blob([result.content || ""], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || "aviator-orders.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur lors de l'export : " + err.message);
    }
  };

  return (
    <section className="admin-card p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="admin-section-title">Vente</p>
          <h2 className="admin-h2 mt-1">Commandes</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportCsv} className="admin-btn admin-btn-primary">
            <Download className="h-3.5 w-3.5" />
            Exporter CSV
          </button>

          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selected.length} sélectionnée{selected.length > 1 ? "s" : ""}
              </span>
              <button disabled={busy} onClick={() => bulkStatus("confirmee")} className="admin-btn admin-btn-lime disabled:opacity-50">Confirmer</button>
              <button disabled={busy} onClick={() => bulkStatus("preparation")} className="admin-btn admin-btn-ghost disabled:opacity-50">Préparer</button>
              <button disabled={busy} onClick={() => bulkStatus("expediee")} className="admin-btn admin-btn-ghost disabled:opacity-50">Expédier</button>
            </div>
          )}
        </div>
      </div>

      <div className="admin-list-scroll mt-6 overflow-x-auto rounded-xl border border-black/10">
        <div className="admin-list-head flex min-w-[850px] items-center gap-4 border-b border-black/10 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <button onClick={toggleAll} aria-label="Tout sélectionner" className="p-1">
            {allSelected ? <CheckSquare className="h-4 w-4 text-navy" /> : <Square className="h-4 w-4" />}
          </button>
          <span className="w-36">Date</span>
          <span className="flex-1">Commande & Client</span>
          <span className="w-24 text-right">Total</span>
          <span className="w-36 text-center">Statut</span>
          <span className="w-20 text-right">Actions</span>
        </div>

        {data.map((order) => (
          <div key={order.id} className={`flex min-w-[850px] items-center gap-4 border-b border-black/10 px-4 py-4 last:border-0 transition-colors ${order.return_request ? "bg-amber-50/50 hover:bg-amber-50/80" : "hover:bg-black/[0.02]"}`}>
            <button onClick={() => toggle(order.id)} aria-label={`Sélectionner ${order.orderNumber}`} className="p-1">
              {selected.includes(order.id) ? <CheckSquare className="h-4 w-4 text-navy" /> : <Square className="h-4 w-4" />}
            </button>

            {/* Date */}
            <div className="w-36 text-xs text-muted-foreground">
              <span className="block font-medium text-foreground">
                {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
              <span className="text-[11px]">
                {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Order & Customer */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="font-mono text-sm text-navy">{order.orderNumber}</strong>
                <TrafficSourceBadge source={order.traffic_source || order.trafficSource} />
                {order.utm_campaign && (
                  <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px]" title={`Campagne: ${order.utm_campaign}`}>
                    #{order.utm_campaign}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {order.firstName || order.customerName} {order.lastName || ""} · {order.phone} · <span className="font-medium text-navy">{order.city}</span>
              </p>
              {order.return_request && (
                <span className={`mt-1.5 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${returnStatusBadges[order.return_request.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                  <Undo2 className="h-3 w-3" />
                  {returnStatusLabels[order.return_request.status] || "Retour"}
                </span>
              )}
            </div>

            {/* Total */}
            <div className="w-24 text-right">
              <strong className="text-sm text-navy">{formatNumber((order.total || 0) / 100)} DH</strong>
            </div>

            {/* Status */}
            <div className="w-36 text-center">
              <select
                value={order.status}
                onChange={async (event) => {
                  await request(`/api/admin/orders/${order.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({ status: event.target.value }),
                  });
                  refresh();
                }}
                className={`w-full rounded-md border px-2 py-1.5 text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-navy/30 ${statusBadges[order.status] || "border-black/15 bg-white"}`}
              >
                <option value="nouvelle">Nouvelle</option>
                <option value="confirmee">Confirmée</option>
                <option value="preparation">En préparation</option>
                <option value="expediee">Expédiée</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>

            {/* Actions */}
            <div className="w-20 flex justify-end gap-1">
              <button onClick={() => setDetail(order)} className="rounded-md border border-black/10 p-2 text-navy hover:bg-black/5" aria-label={`Voir ${order.orderNumber}`} title="Détails de la commande">
                <Eye className="h-4 w-4" />
              </button>
              <button onClick={() => remove(order)} className="rounded-md border border-black/10 p-2 text-destructive hover:bg-destructive/10" aria-label={`Supprimer ${order.orderNumber}`} title="Supprimer la commande">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {!data.length && <p className="py-12 text-center text-sm text-muted-foreground">Aucune commande trouvée.</p>}
      </div>

      {/* Order Detail Modal */}
      <AdminModal open={Boolean(detail)} title={`Commande ${detail?.orderNumber || ""}`} onClose={() => setDetail(null)}>
        {detail && (
          <div className="space-y-5 text-sm">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(detail.createdAt)}
                </span>
                <p className="mt-1 font-mono text-lg font-bold text-navy">{detail.orderNumber}</p>
              </div>
              <span
                className={`rounded border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  statusBadges[detail.status] || "border-border bg-secondary"
                }`}
              >
                {detail.status}
              </span>
            </div>

            {/* Customer Details */}
            <div className="grid gap-4 sm:grid-cols-2 rounded border border-border bg-secondary/30 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Client</p>
                <p className="mt-1 font-semibold text-navy">{detail.firstName} {detail.lastName}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-navy" />
                  <a href={`tel:${detail.phone}`} className="hover:underline">{detail.phone}</a>
                </p>
                {detail.email && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-navy" />
                    <a href={`mailto:${detail.email}`} className="hover:underline">{detail.email}</a>
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Livraison</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-navy font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-navy" />
                  {detail.city}
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{detail.address}</p>
                {detail.neighborhood && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Quartier : {detail.neighborhood}</p>
                )}
              </div>
            </div>

            {/* Traffic & Attribution Source */}
            <div className="rounded border border-border bg-slate-50/70 p-4">
              <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Origine & Source d'acquisition
                </p>
                <TrafficSourceBadge source={detail.traffic_source || detail.trafficSource} />
              </div>
              <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Source</span>
                  <span className="font-semibold text-navy">{detail.traffic_source || detail.trafficSource || "DIRECT"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Médium</span>
                  <span className="font-medium text-foreground">{detail.utm_medium || "—"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">Campagne</span>
                  <span className="font-mono text-xs text-navy">{detail.utm_campaign || "—"}</span>
                </div>
                {detail.referrer && (
                  <div className="col-span-2 sm:col-span-4">
                    <span className="text-[10px] text-muted-foreground block uppercase font-medium">Référent</span>
                    <span className="text-[11px] text-muted-foreground truncate block">{detail.referrer}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes if any */}
            {detail.notes && (
              <div className="rounded border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900 flex items-start gap-2">
                <FileText className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Instructions du client :</strong>
                  <p className="mt-0.5">{detail.notes}</p>
                </div>
              </div>
            )}

            {/* Return management */}
            {detail.return_request && (
              <div className="rounded border border-amber-200 bg-amber-50/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">
                    <Undo2 className="h-4 w-4" />
                    Demande de retour
                  </p>
                  <span className={`rounded border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${returnStatusBadges[detail.return_request.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                    {returnStatusLabels[detail.return_request.status] || detail.return_request.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
                  <p><strong className="font-semibold text-navy">Motif :</strong> <span className="text-foreground/80">{detail.return_request.reason}</span></p>
                  <p><strong className="font-semibold text-navy">Téléphone :</strong> <span className="text-foreground/80">{detail.return_request.phone}</span></p>
                  <p><strong className="font-semibold text-navy">Demandé le :</strong> <span className="text-foreground/80">{formatDate(detail.return_request.createdAt)}</span></p>
                  <p><strong className="font-semibold text-navy">Stock :</strong> <span className="text-foreground/80">{detail.return_request.stockRestored ? "restauré" : "non restauré"}</span></p>
                  {detail.return_request.notes && (
                    <p className="sm:col-span-2"><strong className="font-semibold text-navy">Notes :</strong> <span className="text-foreground/80">{detail.return_request.notes}</span></p>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-navy">Traiter le retour :</span>
                  <select
                    value={detail.return_request.status}
                    disabled={busy === "return"}
                    onChange={(event) => updateReturn(detail.return_request, event.target.value)}
                    className="admin-input !w-auto !py-2"
                    aria-label="Traiter la demande de retour"
                  >
                    <option value="requested">Demandé</option>
                    <option value="approved">Accepté</option>
                    <option value="rejected">Refusé</option>
                    <option value="completed">Terminé</option>
                  </select>
                  <button
                    disabled={busy === "return"}
                    onClick={() => deleteReturn(detail.return_request)}
                    className="admin-btn admin-btn-danger !py-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer la demande
                  </button>
                </div>
              </div>
            )}

            {/* Items Table */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2">Articles commandés</p>
              <div className="border border-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-secondary text-[10px] font-bold uppercase text-muted-foreground">
                    <tr>
                      <th className="p-2.5">Produit</th>
                      <th className="p-2.5">Variante</th>
                      <th className="p-2.5 text-center">Qté</th>
                      <th className="p-2.5 text-right">Prix unit.</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Array.isArray(detail.items) && detail.items.map((item, idx) => {
                      const qty = Number(item.quantity || 1);
                      const unitPrice = Number(item.price || 0);
                      const lineTotal = qty * unitPrice;
                      return (
                        <tr key={idx} className="hover:bg-secondary/20">
                          <td className="p-2.5 font-semibold text-navy">{item.name || "Article"}</td>
                          <td className="p-2.5 text-muted-foreground">
                            {[item.color, item.size ? `Taille ${item.size}` : null].filter(Boolean).join(" · ") || "-"}
                          </td>
                          <td className="p-2.5 text-center font-bold">{qty}</td>
                          <td className="p-2.5 text-right">{formatNumber(unitPrice)} DH</td>
                          <td className="p-2.5 text-right font-bold text-navy">{formatNumber(lineTotal)} DH</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="rounded border border-border bg-secondary/20 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span className="font-semibold text-foreground">{formatNumber((detail.subtotal || 0) / 100)} DH</span>
              </div>
              {detail.discount > 0 && (
                <div className="flex justify-between text-accent-lime font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3 w-3" />
                    Réduction {detail.couponCode ? `(${detail.couponCode})` : ""}
                  </span>
                  <span>-{formatNumber((detail.discount || 0) / 100)} DH</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Frais de livraison ({detail.city})</span>
                <span className="font-semibold text-foreground">
                  {detail.shippingFee === 0 ? "Gratuit" : `${formatNumber((detail.shippingFee || 0) / 100)} DH`}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold text-navy">
                <span>Total à encaisser (COD)</span>
                <span className="font-heading text-lg">{formatNumber((detail.total || 0) / 100)} DH</span>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </section>
  );
}
