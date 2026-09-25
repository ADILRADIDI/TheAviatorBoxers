import { useEffect, useState } from "react";
import { 
  Compass, TrendingUp, ShoppingBag, DollarSign, Users, Eye, 
  ExternalLink, ArrowUpRight, BarChart3, Filter, PieChart as PieIcon,
  RefreshCw, CheckCircle2
} from "lucide-react";
import { formatNumber } from "@/lib/store";
import { adminRequest as request } from "@/lib/adminApi";

const SOURCE_COLORS = {
  TIKTOK: { bg: "bg-black", text: "text-white", border: "border-black", badge: "bg-black text-white", dot: "bg-[#00f2fe]", hex: "#000000" },
  INSTAGRAM: { bg: "bg-pink-500", text: "text-white", border: "border-pink-500", badge: "bg-pink-50 text-pink-700 border-pink-200", dot: "bg-pink-500", hex: "#E1306C" },
  FACEBOOK: { bg: "bg-blue-600", text: "text-white", border: "border-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-600", hex: "#1877F2" },
  YOUTUBE: { bg: "bg-red-600", text: "text-white", border: "border-red-600", badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-600", hex: "#FF0000" },
  GOOGLE: { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", hex: "#10B981" },
  DIRECT: { bg: "bg-slate-700", text: "text-white", border: "border-slate-700", badge: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-500", hex: "#475569" },
};

function getSourceStyle(source) {
  const s = String(source || "DIRECT").toUpperCase();
  if (s.includes("TIKTOK")) return SOURCE_COLORS.TIKTOK;
  if (s.includes("INSTA") || s.includes("IG")) return SOURCE_COLORS.INSTAGRAM;
  if (s.includes("FACEBOOK") || s.includes("FB") || s.includes("META")) return SOURCE_COLORS.FACEBOOK;
  if (s.includes("YOUTUBE") || s.includes("YT")) return SOURCE_COLORS.YOUTUBE;
  if (s.includes("GOOGLE") || s.includes("GADS")) return SOURCE_COLORS.GOOGLE;
  return SOURCE_COLORS.DIRECT;
}

export default function AdminTrafficPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSource, setFilterSource] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await request("/api/admin/orders");
      const orderList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      setOrders(orderList);
    } catch (err) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute statistics by source
  const statsBySource = {};
  const campaignsMap = {};

  let totalRevenue = 0;
  let totalOrdersCount = orders.length;

  orders.forEach((o) => {
    const rawSource = o.traffic_source || o.trafficSource || "DIRECT";
    let sourceKey = "DIRECT";
    const s = String(rawSource).toUpperCase();
    if (s.includes("TIKTOK")) sourceKey = "TIKTOK";
    else if (s.includes("INSTA") || s.includes("IG")) sourceKey = "INSTAGRAM";
    else if (s.includes("FACEBOOK") || s.includes("FB") || s.includes("META")) sourceKey = "FACEBOOK";
    else if (s.includes("YOUTUBE") || s.includes("YT")) sourceKey = "YOUTUBE";
    else if (s.includes("GOOGLE")) sourceKey = "GOOGLE";

    const rev = (Number(o.total) || 0) / 100;
    totalRevenue += rev;

    if (!statsBySource[sourceKey]) {
      statsBySource[sourceKey] = { source: sourceKey, orders: 0, revenue: 0 };
    }
    statsBySource[sourceKey].orders += 1;
    statsBySource[sourceKey].revenue += rev;

    // Track campaigns
    const campaignName = o.utm_campaign || o.utm_source || "Sans campagne";
    if (!campaignsMap[campaignName]) {
      campaignsMap[campaignName] = { name: campaignName, source: sourceKey, orders: 0, revenue: 0 };
    }
    campaignsMap[campaignName].orders += 1;
    campaignsMap[campaignName].revenue += rev;
  });

  const sourceRanked = Object.values(statsBySource).sort((a, b) => b.revenue - a.revenue);
  const campaignsRanked = Object.values(campaignsMap).sort((a, b) => b.revenue - a.revenue);

  const filteredOrders = filterSource === "ALL" 
    ? orders 
    : orders.filter((o) => {
        const s = String(o.traffic_source || o.trafficSource || "DIRECT").toUpperCase();
        return s.includes(filterSource);
      });

  if (loading) {
    return (
      <section className="admin-card p-6 space-y-4">
        <div className="admin-skeleton h-28" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="admin-skeleton h-24" />
          <div className="admin-skeleton h-24" />
          <div className="admin-skeleton h-24" />
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-section-title">Marketing & Attribution</p>
          <h2 className="admin-h2 mt-1">Sources de trafic & Acquisition</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Suivi des canaux publicitaires (TikTok, Meta/Facebook, Instagram, YouTube, Direct) et des ventes générées.
          </p>
        </div>
        <button onClick={loadData} className="admin-btn admin-btn-ghost text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Actualiser
        </button>
      </div>

      {error && (
        <div className="admin-card border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Top Channel Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {["TIKTOK", "INSTAGRAM", "FACEBOOK", "YOUTUBE", "GOOGLE", "DIRECT"].map((src) => {
          const data = statsBySource[src] || { source: src, orders: 0, revenue: 0 };
          const style = SOURCE_COLORS[src];
          const pct = totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0;
          const isSelected = filterSource === src;

          return (
            <button
              key={src}
              onClick={() => setFilterSource(isSelected ? "ALL" : src)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 admin-pop ${
                isSelected 
                  ? "border-navy ring-2 ring-navy/20 bg-navy/5 shadow-sm" 
                  : "border-black/10 bg-white hover:border-black/20 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-wider border ${style.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {src}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">{pct}%</span>
              </div>
              <p className="mt-3 font-heading text-lg font-black text-navy">
                {formatNumber(data.revenue)} DH
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {data.orders} commande{data.orders > 1 ? "s" : ""}
              </p>
            </button>
          );
        })}
      </div>

      {/* Breakdown Channels & UTM Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Share Bars */}
        <section className="admin-card p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h3 className="admin-h2 text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-navy" />
              Répartition du Chiffre d'Affaires par Canal
            </h3>
            <span className="text-xs text-muted-foreground font-mono font-bold">
              Total : {formatNumber(totalRevenue)} DH
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {sourceRanked.map((item) => {
              const style = SOURCE_COLORS[item.source] || SOURCE_COLORS.DIRECT;
              const pct = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;

              return (
                <div key={item.source} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${style.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {item.source}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        ({item.orders} commande{item.orders > 1 ? "s" : ""})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-navy">{formatNumber(item.revenue)} DH</span>
                      <span className="text-muted-foreground ml-1.5">({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${style.bg}`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Campaigns Table */}
        <section className="admin-card p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h3 className="admin-h2 text-sm flex items-center gap-2">
              <Compass className="h-4 w-4 text-navy" />
              Performance des Campagnes UTM
            </h3>
            <span className="text-xs text-muted-foreground">
              {campaignsRanked.length} campagne{campaignsRanked.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-[10px] uppercase font-bold text-muted-foreground">
                  <th className="pb-2">Campagne UTM</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2 text-center">Ventes</th>
                  <th className="pb-2 text-right">Revenu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {campaignsRanked.map((c) => {
                  const style = getSourceStyle(c.source);
                  return (
                    <tr key={c.name} className="hover:bg-black/[0.02]">
                      <td className="py-2.5 font-mono font-medium text-navy truncate max-w-[180px]">
                        #{c.name}
                      </td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${style.badge}`}>
                          {c.source}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-bold text-foreground">
                        {c.orders}
                      </td>
                      <td className="py-2.5 text-right font-bold text-navy">
                        {formatNumber(c.revenue)} DH
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Orders List for selected Traffic Source */}
      <section className="admin-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-3">
          <div>
            <h3 className="admin-h2 text-sm">
              Commandes issues de : <span className="text-navy uppercase font-black">{filterSource === "ALL" ? "Tous les canaux" : filterSource}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""} trouvée{filteredOrders.length > 1 ? "s" : ""}
            </p>
          </div>
          {filterSource !== "ALL" && (
            <button
              onClick={() => setFilterSource("ALL")}
              className="admin-btn admin-btn-ghost text-xs"
            >
              Afficher tous les canaux
            </button>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-[10px] uppercase font-bold text-muted-foreground">
                <th className="pb-2">Commande</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Client</th>
                <th className="pb-2">Ville</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Campagne UTM</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredOrders.map((o) => {
                const style = getSourceStyle(o.traffic_source || o.trafficSource);
                return (
                  <tr key={o.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 font-mono font-bold text-navy">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="py-3 font-medium text-foreground">
                      {o.firstName || o.customerName} {o.lastName || ""}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {o.city}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${style.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {o.traffic_source || o.trafficSource || "DIRECT"}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-muted-foreground">
                      {o.utm_campaign ? `#${o.utm_campaign}` : (o.utm_source || "—")}
                    </td>
                    <td className="py-3 text-right font-bold text-navy">
                      {formatNumber((o.total || 0) / 100)} DH
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
