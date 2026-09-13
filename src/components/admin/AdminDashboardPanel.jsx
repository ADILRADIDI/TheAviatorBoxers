import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Boxes, CheckCircle2, ClipboardList, Clock, Package, ShoppingCart, TrendingUp, Truck, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/store";

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const numericTarget = Number(target) || 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(numericTarget * eased));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function Kpi({ icon: Icon, label, value, detail, tone = "navy", accent }) {
  const animated = useCountUp(value);
  return (
    <article className="admin-card admin-card-hover admin-pop p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone === "lime" ? "bg-accent-lime text-black" : "bg-navy text-white"}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-black/45">
          <TrendingUp className="h-3.5 w-3.5" />
          {accent || "période"}
        </span>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <strong className="mt-1 block font-display text-3xl font-black tracking-tight text-navy">
        {typeof value === "number" ? formatNumber(animated) : value}
      </strong>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </article>
  );
}

const statusFlow = [
  { key: "nouvelle", label: "Nouvelle", icon: Clock, color: "bg-[hsl(38_92%_50%)]" },
  { key: "confirmee", label: "Confirmée", icon: CheckCircle2, color: "bg-[hsl(205_100%_18%)]" },
  { key: "preparation", label: "En préparation", icon: Package, color: "bg-[hsl(0_0%_30%)]" },
  { key: "expediee", label: "Expédiée", icon: Truck, color: "bg-[hsl(190_55%_42%)]" },
  { key: "livree", label: "Livrée", icon: CheckCircle2, color: "bg-[hsl(64_100%_42%)]" },
];

export default function AdminDashboardPanel({ data = {}, onNavigate = () => {}, period = "all", onPeriodChange = () => {} }) {
  const quickActions = [
    ["produits", "Ajouter un produit", Package],
    ["commandes", "Voir les commandes", ClipboardList],
    ["coupons", "Créer un coupon", ShoppingCart],
    ["media", "Importer un média", Boxes],
  ];

  const periods = [
    { key: "today", label: "Aujourd'hui" },
    { key: "7d", label: "7 jours" },
    { key: "30d", label: "30 jours" },
    { key: "all", label: "Tout" },
  ];

  const statusCounts = data.statusCounts || {};
  const totalOrders = Object.values(statusCounts).reduce((sum, n) => sum + (Number(n) || 0), 0);
  const chartData = (data.topProducts || []).slice(0, 6).map((product) => ({
    name: product.name.replace("Aviator Essential ", "Essential ").replace("Pack Signature 2 pièces", "Pack 2 pièces"),
    revenu: Number(product.revenue) || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="admin-pop relative overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#00285E_0%,#001A3E_55%,#000_100%)] px-6 py-8 text-white sm:px-8">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 right-28 h-64 w-64 rounded-full border border-accent-lime/30" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.26em] text-accent-lime">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent-lime" />
              The Aviator · Operations
            </p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">Tableau de bord</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Suivi en temps réel des ventes, commandes et performances de la boutique.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 p-1 backdrop-blur">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => onPeriodChange(p.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${period === p.key ? "bg-accent-lime text-black" : "text-white/80 hover:bg-white/10"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={ArrowUpRight} label="Chiffre d'affaires" value={data.revenue} detail="Commandes non annulées" tone="lime" accent="CA total" />
        <Kpi icon={ClipboardList} label="Commandes" value={data.orders || 0} detail={`Sur la période : ${periods.find((p) => p.key === period)?.label || "Tout"}`} />
        <Kpi icon={Users} label="Clients" value={data.customers || 0} detail="Clients uniques" />
        <Kpi icon={Boxes} label="Stock faible" value={data.lowStock || 0} detail="Produits sous le seuil (5)" tone="lime" accent="Alertes" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="admin-card admin-pop p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="admin-section-title">Performance</p>
              <h3 className="admin-h2 mt-1">Top produits</h3>
            </div>
            <span className="text-xs text-muted-foreground">CA en DH · Top 6 produits</span>
          </div>
          <div className="mt-6 h-56">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C7D400" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#C7D400" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 0% / 0.07)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 42%)" }} axisLine={false} tickLine={false} interval={0} tickFormatter={(v) => (v.length > 14 ? `${v.slice(0, 13)}…` : v)} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 42%)" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(val) => [`${formatNumber(val)} DH`, "CA"]} contentStyle={{ borderRadius: 8, border: "1px solid hsl(0 0% 0% / 0.1)", fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenu" stroke="#00285E" strokeWidth={2} fill="url(#revenueFill)" activeDot={{ r: 4, fill: "#00285E" }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Aucune vente sur cette période.</p>
            )}
          </div>
        </section>

        {/* Status breakdown */}
        <section className="admin-card admin-pop p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="admin-section-title">État des flux</p>
              <h3 className="admin-h2 mt-1">Répartition des commandes</h3>
            </div>
            <button onClick={() => onNavigate("commandes")} className="text-xs font-bold text-navy hover:underline">Voir toutes les commandes &rarr;</button>
          </div>
          <div className="mt-6 space-y-4">
            {Object.entries(statusCounts).length > 0 ? (
              Object.entries(statusCounts).map(([key, count]) => {
                const meta = statusFlow.find((s) => s.key === key);
                if (!meta || !count) return null;
                const pct = totalOrders ? Math.round((count / totalOrders) * 100) : 0;
                const Icon = meta.icon;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-black/[0.04] text-navy"><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{meta.label}</span>
                        <span className="font-bold text-navy">{count} · {pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                        <div className={`h-full rounded-full ${meta.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">Aucune commande sur cette période.</p>
            )}
          </div>
        </section>
      </div>

      {/* Workflow stepper */}
      <section className="admin-card admin-pop p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-section-title">Cycle de vie</p>
            <h3 className="admin-h2 mt-1">Meilleures ventes</h3>
          </div>
          <span className="text-xs text-muted-foreground">Quantités vendues sur la période</span>
        </div>

        {/* Top products */}
        <div className="mt-5">
          {(data.topProducts || []).length > 0 ? (
            <div className="divide-y divide-black/10">
              {(data.topProducts || []).map((product, index) => {
                const pct = data.topProducts[0]?.quantity ? Math.round((product.quantity / data.topProducts[0].quantity) * 100) : 0;
                return (
                  <div key={`${product.product_id}-${index}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy font-display text-xs font-black text-accent-lime">{index + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-navy">{product.name}</p>
                        <span className="text-xs text-muted-foreground">{formatNumber(product.revenue)} DH</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#00285E] to-[#C7D400] transition-all duration-700" style={{ width: `${Math.max(6, pct)}%` }} />
                      </div>
                    </div>
                    <span className="admin-badge !bg-accent-lime/15 !text-navy !border-accent-lime/40">{product.quantity} vendu{product.quantity > 1 ? "s" : ""}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucune vente enregistrée sur cette période.</p>
          )}
        </div>

        {/* Stepper */}
        <div className="mt-7 border-t border-black/10 pt-6">
          <p className="admin-section-title mb-4">Pipeline de commandes</p>
          <ol className="flex flex-wrap items-center gap-y-4">
            {statusFlow.map((step, index) => {
              const count = statusCounts[step.key] || 0;
              const Icon = step.icon;
              return (
                <li key={step.key} className="flex items-center">
                  <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${step.color}`}><Icon className="h-3.5 w-3.5" /></span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{step.label}</p>
                      <strong className="block text-sm text-navy">{count}</strong>
                    </div>
                  </div>
                  {index < statusFlow.length - 1 && (
                    <span className="mx-1 h-px w-6 bg-black/15 sm:w-8" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Quick actions */}
      <section className="admin-card admin-pop p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-section-title">Actions rapides</p>
            <h3 className="admin-h2 mt-1">Gestion directe</h3>
          </div>
          <span className="text-xs text-muted-foreground">Accès direct aux modules</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(([tab, label, Icon]) => (
            <button key={tab} onClick={() => onNavigate(tab)} className="admin-card-hover group flex items-center gap-3 rounded-xl border border-black/10 px-4 py-4 text-left text-sm font-bold text-navy hover:border-navy/30">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-accent-lime transition-transform group-hover:scale-110"><Icon className="h-4 w-4" /></span>
              {label}
              <ArrowUpRight className="ml-auto h-4 w-4 text-black/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy" />
            </button>
          ))}
        </div>
      </section>

      {/* Bottom stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="admin-card admin-pop p-5">
          <p className="admin-section-title">Panier moyen</p>
          <strong className="mt-3 block font-display text-2xl font-black text-navy">{formatNumber(data.averageOrder)} DH</strong>
          <p className="mt-2 text-xs text-muted-foreground">Sur les commandes actives et confirmées.</p>
        </article>
        <article className="admin-card admin-pop p-5">
          <p className="admin-section-title">Avis en attente</p>
          <strong className="mt-3 block font-display text-2xl font-black text-navy">{data.pendingReviews || 0}</strong>
          <button onClick={() => onNavigate("avis")} className="mt-2 text-xs font-bold text-navy underline underline-offset-4">Ouvrir la modération</button>
        </article>
        <article className="admin-card admin-pop p-5">
          <p className="admin-section-title">État système</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-accent-lime" />
            <strong className="font-display text-2xl font-black text-navy">Opérationnel</strong>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Base PostgreSQL synchronisée et API saine.</p>
        </article>
      </div>
    </div>
  );
}