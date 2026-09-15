import { Component, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Bell, ChevronLeft, Images, Layers, LayoutDashboard, Lock, Megaphone,
  Menu, Package, ScrollText, Settings, ShieldCheck, ShoppingBag, Star, Tags, TicketPercent,
  Trash2, Truck, UserCog, Users, Warehouse, X,
} from "lucide-react";
import { AdminCategoriesPanel, AdminProductsPanel } from "@/components/admin/AdminCatalogPanels";
import { AdminCouponsPanel, AdminPromotionsPanel } from "@/components/admin/AdminOperationsPanels";
import AdminOrdersPanel from "@/components/admin/AdminOrdersBulkPanel";
import AdminCustomersPanel from "@/components/admin/AdminCustomersPanel";
import AdminRolesPanel from "@/components/admin/AdminRolesPanel";
import AdminUsersPanel from "@/components/admin/AdminUsersPanelComplete";
import AdminDashboardPanel from "@/components/admin/AdminDashboardPanel";
import AdminInventoryPanel from "@/components/admin/AdminInventoryPanel";
import AdminSettingsPanel from "@/components/admin/AdminSettingsPanel";
import AdminStorefrontImagesPanel from "@/components/admin/AdminStorefrontImagesPanel";
import { useAsync } from "@/lib/useAsync";

const API = import.meta.env.VITE_API_URL || "";
const request = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, { headers: { ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}), "x-admin-token": localStorage.getItem("aviator_admin_token") || "" }, ...options });
  if (response.status === 401) {
    localStorage.removeItem("aviator_admin_token");
    window.dispatchEvent(new CustomEvent("aviator-admin-expired"));
  }
  if (!response.ok) throw new Error(`Erreur API ${response.status}`);
  return response.json();
};

const navGroups = [
  { title: "Pilotage", items: [["dashboard", "Vue d'ensemble", LayoutDashboard], ["commandes", "Commandes", ShoppingBag], ["customers", "Clients", Users], ["audit-logs", "Journal d'activité", ScrollText], ["notifications", "Notifications", Bell], ["roles", "Rôles & permissions", ShieldCheck], ["users", "Utilisateurs admin", UserCog]] },
  { title: "Catalogue", items: [["produits", "Produits", Package], ["categories", "Catégories", Tags], ["variants", "Variantes & stock", Layers], ["inventory", "Inventaire", Warehouse]] },
  { title: "Vente", items: [["shipping-zones", "Livraison", Truck], ["coupons", "Coupons", TicketPercent], ["promotions", "Promotions", Megaphone]] },
  { title: "Contenu", items: [["avis", "Avis", Star], ["images", "Images", Images]] }, 
  { title: "Configuration", items: [["settings", "Réglages", Settings]] },
];
const tabs = navGroups.flatMap((group) => group.items);
const apiTabs = { commandes: "orders", produits: "products", "shipping-zones": "shipping-zones", coupons: "coupons", promotions: "promotions", avis: "reviews", inventory: "inventory", notifications: "notifications", "audit-logs": "audit-logs", images: "settings", settings: "settings" };
const navPermission = { dashboard: "dashboard.view", commandes: "orders.view", customers: "customers.view", "audit-logs": "audit_logs.view", notifications: "notifications.view", roles: "roles.view", users: "users.view", produits: "products.view", categories: "categories.view", variants: "variants.view", inventory: "inventory.view", "shipping-zones": "shipping.view", coupons: "discounts.view", promotions: "promotions.view", avis: "reviews.view", images: "settings.view", settings: "settings.view" };
const tabToRoute = { dashboard: "dashboard", commandes: "orders", customers: "clients", "audit-logs": "activity", notifications: "notifications", roles: "roles", users: "users", produits: "products", categories: "categories", variants: "variants", inventory: "inventory", "shipping-zones": "shipping", coupons: "coupons", promotions: "promotions", avis: "reviews", images: "images", settings: "settings" };
const routeToTab = Object.fromEntries(Object.entries(tabToRoute).map(([tab, route]) => [route, tab]));
routeToTab.returns = "commandes";

class AdminErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Admin render error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-card border-destructive/40 bg-destructive/5 p-6 text-destructive">
          <h3 className="admin-h2 text-destructive">Erreur d'affichage du panneau</h3>
          <p className="mt-1 text-sm">{this.state.error?.message || "Une erreur est survenue lors du chargement."}</p>
          <button onClick={() => this.setState({ hasError: false })} className="admin-btn admin-btn-primary mt-4">Réessayer</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Admin() {
  const { tab: routeTab } = useParams();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(() => Boolean(localStorage.getItem("aviator_admin_token")));
  const [permissions, setPermissions] = useState(() => { try { return JSON.parse(localStorage.getItem("aviator_admin_permissions") || "[]"); } catch { return []; } });
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dashboardPeriod, setDashboardPeriod] = useState("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("aviator_admin_sidebar") === "collapsed");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const requestedTab = routeToTab[routeTab] || null;
  const canView = (key) => permissions.length === 0 || permissions.includes(navPermission[key]);
  const defaultTab = permissions.includes("orders.view") ? "commandes" : "dashboard";
  const tab = requestedTab && canView(requestedTab) ? requestedTab : null;
  const load = async () => {
    try {
      setError("");
      setLoading(true);
      if (tab === "dashboard") {
        const result = await request(`/api/admin/dashboard?period=${dashboardPeriod}`);
        setData(result);
      } else {
        const params = new URLSearchParams({ page: String(page), limit: "20" });
        if (search) params.set("search", search);
        if (statusFilter) params.set("status", statusFilter);
        const result = await request(`/api/admin/${apiTabs[tab] || tab}?${params}`);
        const listData = Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);
        setData(listData);
        setMeta(result?.pages ? result : null);
      }
    } catch (err) {
      setError(err.message);
      if (tab !== "dashboard") setData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (authenticated && tab) load();
  }, [authenticated, tab, page, search, statusFilter, dashboardPeriod]);
  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    const fetchInbox = async () => {
      try {
        const result = await request("/api/admin/notifications/inbox");
        if (active && result?.count !== undefined) setUnreadCount(result.count);
      } catch { if (active) setUnreadCount(0); }
    };
    fetchInbox();
    const interval = setInterval(fetchInbox, 30000);
    return () => { active = false; clearInterval(interval); };
  }, [authenticated, tab]);
  useEffect(() => {
    const expire = () => setAuthenticated(false);
    window.addEventListener("aviator-admin-expired", expire);
    return () => window.removeEventListener("aviator-admin-expired", expire);
  }, []);

  if (!authenticated) return <AdminLogin onSuccess={(result) => { setPermissions(result.permissions || []); setAuthenticated(true); navigate(`/admin/${tabToRoute[result.permissions?.includes("orders.view") ? "commandes" : "dashboard"]}`, { replace: true }); }} />;
  if (!tab) return <Navigate to={`/admin/${tabToRoute[defaultTab]}`} replace />;

  const changeTab = (nextTab) => {
    navigate(`/admin/${tabToRoute[nextTab]}`);
    setSearch("");
    setStatusFilter("");
    setPage(1);
    setMobileNavOpen(false);
  };
  const logout = async () => {
    try {
      const token = localStorage.getItem("aviator_admin_token");
      await fetch(`${API}/api/admin/logout`, { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token || "" }, body: JSON.stringify({ token }) });
    } catch { /* session déjà expirée */ }
    localStorage.removeItem("aviator_admin_token");
    localStorage.removeItem("aviator_admin_permissions");
    setAuthenticated(false);
  };

  const activeLabel = tabs.find(([key]) => key === tab)?.[1] || "Back-office";
  const sidebarWidth = sidebarCollapsed ? "w-[74px]" : "w-[252px]";

  return (
    <div data-admin-shell className="min-h-screen bg-[hsl(0_0%_96%)] text-foreground">
      {/* Sidebar (desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-[hsl(0_0%_5%)] text-white transition-all duration-300 lg:flex ${sidebarWidth}`}>
        <SidebarContent
          collapsed={sidebarCollapsed}
          groups={navGroups}
          tab={tab}
          canView={canView}
          onNavigate={changeTab}
          onToggle={() => setSidebarCollapsed((value) => { const next = !value; localStorage.setItem("aviator_admin_sidebar", next ? "collapsed" : "expanded"); return next; })}
        />
      </aside>

      {/* Sidebar (mobile) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-[hsl(0_0%_5%)] text-white shadow-2xl">
            <SidebarContent collapsed={false} groups={navGroups} tab={tab} canView={canView} onNavigate={changeTab} onClose={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-[252px]" style={sidebarCollapsed ? { paddingLeft: "74px" } : undefined}>
        <header className="sticky top-0 z-30 border-b border-black/10 bg-white/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileNavOpen(true)} aria-label="Ouvrir la navigation" className="rounded-md border border-black/10 p-2 hover:bg-black/5 lg:hidden"><Menu className="h-4 w-4" /></button>
              <div className="min-w-0">
                <p className="admin-section-title">Back-office</p>
                <h1 className="mt-0.5 truncate font-display text-xl font-extrabold tracking-tight text-navy">{activeLabel}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={() => changeTab("notifications")} className="relative rounded-md border border-black/10 p-2 hover:bg-black/5" aria-label={`Notifications${unreadCount ? ` (${unreadCount} non lues)` : ""}`}>
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-lime px-1 text-[10px] font-black text-black">{unreadCount}</span>}
              </button>
              <div className="hidden h-8 w-px bg-black/10 sm:block" />
              <div className="hidden items-center gap-2.5 rounded-md border border-black/10 py-1 pl-1 pr-3 sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-navy font-display text-xs font-black text-accent-lime">A</span>
                <span className="text-xs font-bold text-navy">Admin</span>
              </div>
              <button onClick={logout} className="admin-btn admin-btn-ghost !px-3 !py-2"><span className="hidden sm:inline">Déconnexion</span><span className="sm:hidden">Sortir</span></button>
            </div>
          </div>
        </header>

        <main className="container-edge flex-1 py-7">
          {tab !== "dashboard" && (
            <div className="admin-card mb-6 flex flex-wrap items-center gap-3 p-4">
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <SearchIcon />
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Rechercher dans la liste..."
                  className="admin-input !pl-9"
                  aria-label="Rechercher"
                />
              </div>
              {tab === "commandes" && (
                <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Filtrer par statut" className="admin-input sm:w-48">
                  <option value="">Tous les statuts</option>
                  <option value="nouvelle">Nouvelle</option>
                  <option value="confirmee">Confirmée</option>
                  <option value="preparation">En préparation</option>
                  <option value="expediee">Expédiée</option>
                  <option value="livree">Livrée</option>
                  <option value="annulee">Annulée</option>
                </select>
              )}
              {tab === "avis" && (
                <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Filtrer par statut" className="admin-input sm:w-48">
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              )}
            </div>
          )}

          <div key={tab} className="admin-fade-up">
            <AdminErrorBoundary>
              {error && <div className="admin-card mb-5 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
              {loading ? (
                <div className="grid gap-4">
                  <div className="admin-skeleton h-28" />
                  <div className="admin-skeleton h-64" />
                  <div className="admin-skeleton h-64" />
                </div>
              ) : (
                <>
                  {tab === "dashboard" && <Dashboard data={data} period={dashboardPeriod} onPeriodChange={setDashboardPeriod} onNavigate={changeTab} />}
                  {tab === "roles" && <AdminRolesPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "users" && <AdminUsersPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "commandes" && <AdminOrdersPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "customers" && <AdminCustomersPanel data={Array.isArray(data) ? data : []} />}
                  {tab === "audit-logs" && <SimpleList title="Journal d'activité" data={Array.isArray(data) ? data : []} fields={["actor", "action", "entity"]} />}
                  {tab === "notifications" && <NotificationsPanel data={Array.isArray(data) ? data : []} refresh={load} onRead={(n) => setUnreadCount((c) => Math.max(0, c - (n.read ? 0 : 1)))} />}
                  {tab === "produits" && <AdminProductsPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "categories" && <AdminCategoriesPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "variants" && <Variants data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "inventory" && <AdminInventoryPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "shipping-zones" && <ShippingZones data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "coupons" && <AdminCouponsPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "promotions" && <AdminPromotionsPanel data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "avis" && <Reviews data={Array.isArray(data) ? data : []} refresh={load} />}
                  {tab === "settings" && <AdminSettingsPanel />}{tab === "images" && <AdminStorefrontImagesPanel />}
                  {meta && <Pagination meta={meta} page={page} onPageChange={setPage} />}
                </>
              )}
            </AdminErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ collapsed, groups, tab, canView, onNavigate, onToggle, onClose }) {
  const Logo = function () {
    if (onToggle) {
      return (
        <button onClick={onToggle} aria-label={collapsed ? "Développer la navigation" : "Réduire la navigation"} className="absolute right-2 top-4 rounded-md border border-white/15 p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
          {collapsed ? <Menu className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      );
    }
    return null;
  };
  return (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-lime font-display text-lg font-black text-black shadow-[0_0_22px_-4px_hsl(64_100%_42%)]">A</span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-black uppercase tracking-[0.18em]">The Aviator</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">Espace admin</p>
          </div>
        )}
        {onClose && <button onClick={onClose} aria-label="Fermer la navigation" className="ml-auto text-white/60 hover:text-white"><X className="h-4 w-4" /></button>}
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 py-5">
        {groups.map((group) => {
          const visibleItems = group.items.filter(([key]) => canView(key));
          if (!visibleItems.length) return null;
          return (
            <div key={group.title}>
              {!collapsed && <p className="mb-1.5 px-2.5 text-[9px] font-black uppercase tracking-[0.22em] text-white/35">{group.title}</p>}
              <div className="space-y-0.5">
                {visibleItems.map(([key, label, Icon]) => (
                  <button key={key} onClick={() => onNavigate(key)} title={collapsed ? label : undefined} aria-label={label} className={`admin-sidebar-item ${tab === key ? "admin-sidebar-item-active" : ""}`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                    {tab === key && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-black/30" style={collapsed ? { display: "none" } : undefined} />}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      <Logo />
      <div className="border-t border-white/10 px-4 py-4">
        {!collapsed && (
          <div className="flex items-center gap-2 text-[11px] text-white/45">
            <span className="flex h-2 w-2 rounded-full bg-accent-lime" />
            Système opérationnel v2.0
          </div>
        )}
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function AdminLogin({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await request("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!result.authenticated) throw new Error("Email ou mot de passe incorrect.");
      localStorage.setItem("aviator_admin_token", result.token);
      localStorage.setItem("aviator_admin_permissions", JSON.stringify(result.permissions || []));
      onSuccess(result);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return (
    <div data-admin-shell className="flex min-h-screen bg-[hsl(0_0%_96%)]">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-[hsl(0_0%_5%)] p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full border border-accent-lime/25" />
        <div className="pointer-events-none absolute right-10 top-24 h-40 w-40 rounded-full bg-navy blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-lime font-display text-xl font-black text-black">A</span>
          <div>
            <p className="font-display text-sm font-black uppercase tracking-[0.2em]">The Aviator</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Espace administrateur</p>
          </div>
        </div>
        <div className="relative z-10">
          <p className="admin-section-title !text-accent-lime">Pilotage centralisé</p>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight">L'outil de gestion de la<br />boutique haut de gamme.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
            Commandes, catalogue, stock, livraison, promotions et export : pilotez toute l'activité The Aviator depuis un seul endroit, en toute sécurité.
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            <div>
              <strong className="font-display text-2xl font-black text-accent-lime">100%</strong>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">COD · Paiement à la livraison</p>
            </div>
            <div>
              <strong className="font-display text-2xl font-black text-accent-lime">24h</strong>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">Traitement des commandes</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-[11px] text-white/40">
          <Lock className="h-3.5 w-3.5" /> Session signée et révocable · Base PostgreSQL
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <form onSubmit={submit} className="admin-pop w-full max-w-md">
          <div className="lg:hidden">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-lime font-display text-lg font-black text-black">A</span>
              <div><p className="font-display text-xs font-black uppercase tracking-[0.2em]">The Aviator</p><p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Espace administrateur</p></div>
            </div>
          </div>
          <div className="admin-card p-8 sm:p-10">
            <h1 className="font-display text-3xl font-black tracking-tight text-navy">Connexion sécurisée</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Accédez aux commandes, produits, promotions et avis.</p>
            <label className="mt-7 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email
              <input required type="email" autoComplete="username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="admin-input mt-2" placeholder="admin@theaviator.local" />
            </label>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mot de passe
              <input required type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="admin-input mt-2" placeholder="••••••••" />
            </label>
            {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
            <button disabled={busy} className="admin-btn admin-btn-primary mt-6 w-full !py-3.5">
              {busy ? "Vérification..." : "Ouvrir le back-office"}
            </button>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">Session persistante révocable côté serveur.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Panel({ title, eyebrow, children }) {
  return (
    <section className="admin-card p-5 sm:p-7">
      {eyebrow && <p className="admin-section-title">{eyebrow}</p>}
      <h2 className="admin-h2 mt-1">{title}</h2>
      {children}
    </section>
  );
}

function Pagination({ meta, page, onPageChange }) {
  if (!meta) return null;
  return (
    <div className="admin-card mt-5 flex flex-wrap items-center justify-between gap-3 p-4 text-xs text-muted-foreground">
      <span>{meta.total} élément{meta.total > 1 ? "s" : ""} · page {page} / {meta.pages}</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="admin-btn admin-btn-ghost !px-3 !py-1.5 disabled:opacity-40">Précédent</button>
        <button disabled={page >= meta.pages} onClick={() => onPageChange(page + 1)} className="admin-btn admin-btn-ghost !px-3 !py-1.5 disabled:opacity-40">Suivant</button>
      </div>
    </div>
  );
}

function Dashboard({ data, onNavigate, period, onPeriodChange }) { return <AdminDashboardPanel data={data} onNavigate={onNavigate} period={period} onPeriodChange={onPeriodChange} />; }

function SimpleList({ title, data, fields }) {
  const items = (Array.isArray(data) ? data : []).filter(Boolean);
  return (
    <Panel title={title} eyebrow="Historique">
      <div className="admin-list-scroll mt-4 divide-y divide-black/10 border-y border-black/10">
        {items.map((item, index) => (
          <div key={item.id || index} className="flex items-center justify-between gap-4 py-4">
            <strong className="text-sm text-navy">{fields.map((field) => item[field]).filter(Boolean).join(" · ") || "Élément"}</strong>
            <span className="text-xs text-muted-foreground">{item.createdAt ? new Date(item.createdAt).toLocaleString("fr-FR") : ""}</span>
          </div>
        ))}
        {!items.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun élément.</p>}
      </div>
    </Panel>
  );
}

function NotificationsPanel({ data, refresh, onRead }) {
  const items = (Array.isArray(data) ? data : []).filter(Boolean);
  const unread = items.filter((n) => !n.read).length;
  const [form, setForm] = useState({ type: "info", title: "", message: "" });
  const createNotification = async (event) => {
    event.preventDefault();
    if (!form.title || !form.message) return;
    await request("/api/admin/notifications", { method: "POST", body: JSON.stringify(form) });
    setForm({ type: "info", title: "", message: "" });
    refresh();
  };
  return (
    <Panel title="Notifications" eyebrow="Centre de messagerie">
      <form onSubmit={createNotification} className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr_3fr_auto]">
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="admin-input" aria-label="Type">
          <option value="info">Info</option>
          <option value="warning">Avertissement</option>
          <option value="success">Succès</option>
          <option value="manual">Interne</option>
        </select>
        <input required placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" aria-label="Titre" />
        <input required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="admin-input" aria-label="Message" />
        <button className="admin-btn admin-btn-primary">Créer</button>
      </form>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{unread} non lue{unread > 1 ? "s" : ""}</span>
        <button onClick={async () => { await request("/api/admin/notifications/read-all", { method: "PATCH" }); items.forEach((n) => { if (!n.read) onRead(n); }); refresh(); }} className="admin-btn admin-btn-ghost !py-2">Tout marquer comme lu</button>
      </div>
      <div className="admin-list-scroll mt-4 divide-y divide-black/10 border-y border-black/10">
        {items.map((notification) => (
          <div key={notification.id} className={`flex items-start justify-between gap-4 py-4 ${notification.read ? "opacity-60" : ""}`}>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!notification.read && <span className="h-2 w-2 rounded-full bg-accent-lime" />}
                <span className="admin-badge !bg-black !text-white !border-black">{notification.type}</span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-foreground">{notification.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/80">{notification.createdAt ? new Date(notification.createdAt).toLocaleString("fr-FR") : ""}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!notification.read && <button onClick={async () => { await request(`/api/admin/notifications/${notification.id}`, { method: "PATCH" }); onRead(notification); refresh(); }} className="admin-btn admin-btn-lime !py-1.5 !px-3">Marquer lu</button>}
              <button onClick={async () => { if (window.confirm("Supprimer cette notification ?")) { await request(`/api/admin/notifications/${notification.id}`, { method: "DELETE" }); refresh(); } }} className="admin-btn admin-btn-danger !py-1.5 !px-3">Supprimer</button>
            </div>
          </div>
        ))}
        {!items.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucune notification.</p>}
      </div>
    </Panel>
  );
}

function Variants({ data, refresh }) {
  const items = Array.isArray(data) ? data : [];
  const products = useAsync(() => request("/api/admin/products?limit=100"), []);
  const [form, setForm] = useState({ product_id: "", sku: "", size: "M", color: "", price: "", stock: "0", low_stock_threshold: "5" });
  const [notice, setNotice] = useState("");
  const submitVariant = async (event) => {
    event.preventDefault();
    if (!form.product_id || !form.sku || !form.color) {
      setNotice("Renseignez le produit, le SKU et la couleur.");
      return;
    }
    await request("/api/admin/variants", { method: "POST", body: JSON.stringify(form) });
    setForm({ product_id: "", sku: "", size: "M", color: "", price: "", stock: "0", low_stock_threshold: "5" });
    setNotice("");
    refresh();
  };
  const removeVariant = async (variant) => {
    if (window.confirm(`Supprimer la variante ${variant.sku} ?`)) {
      await request(`/api/admin/variants/${variant.id}`, { method: "DELETE" });
      refresh();
    }
  };
  return (
    <Panel title="Variantes & inventaire" eyebrow="Stock par SKU">
      <form onSubmit={submitVariant} className="mt-5 grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]">
        <select required value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} className="admin-input" aria-label="Produit">
          <option value="">— Produit —</option>
          {(products.data?.data || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input required placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
        className="admin-input" aria-label="SKU" />
        <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="admin-input" aria-label="Taille">
          {["S", "M", "L", "XL", "XXL"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <input required placeholder="Couleur" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="admin-input" aria-label="Couleur" />
        <input type="number" min="0" placeholder="Prix DH" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="admin-input" aria-label="Prix" />
        <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="admin-input" aria-label="Stock" />
        <button className="admin-btn admin-btn-primary">Ajouter</button>
      </form>
      {notice && <p className="mt-3 text-sm text-destructive">{notice}</p>}
      <p className="mt-4 text-sm text-muted-foreground">Stock réel par SKU, taille et couleur. Le prix saisi est en dirhams.</p>
      <div className="admin-list-scroll mt-4 divide-y divide-black/10 border-y border-black/10">
        {items.map((variant) => {
          const low = variant.stock <= variant.lowStockThreshold;
          return (
            <div key={variant.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <strong className="font-mono text-sm text-navy">{variant.sku}</strong>
                <p className="mt-1 text-xs text-muted-foreground">{variant.color} · Taille {variant.size}{variant.price ? ` · ${Number(variant.price) / 100} DH` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <input defaultValue={variant.stock} type="number" min="0" className="admin-input !w-24 !py-2" onBlur={async (event) => { await request(`/api/admin/variants/${variant.id}`, { method: "PATCH", body: JSON.stringify({ stock: event.target.value, price: variant.price / 100, low_stock_threshold: variant.lowStockThreshold }) }); refresh(); }} aria-label="Modifier le stock" />
                <span className={`admin-badge ${low ? "!bg-destructive/10 !text-destructive !border-destructive/30" : "!bg-accent-lime/15 !text-navy !border-accent-lime/40"}`}>{low ? "Stock faible" : "Disponible"}</span>
                <button onClick={() => removeVariant(variant)} className="admin-btn admin-btn-danger !py-2" aria-label={`Supprimer ${variant.sku}`}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          );
        })}
        {!items.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucune variante.</p>}
      </div>
    </Panel>
  );
}

function ShippingZones({ data, refresh }) {
  const items = Array.isArray(data) ? data : [];
  const [form, setForm] = useState({ city: "", region: "Maroc", fee: "", free_threshold: "", delivery_time: "24-48h" });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ region: "Maroc", fee: "", free_threshold: "", delivery_time: "24-48h" });
  const save = async (event) => {
    event.preventDefault();
    await request("/api/admin/shipping-zones", { method: "POST", body: JSON.stringify({ ...form, fee: Number(form.fee), free_threshold: form.free_threshold ? Number(form.free_threshold) : 0, delivery_time: form.delivery_time }) });
    setForm({ city: "", region: "Maroc", fee: "", free_threshold: "", delivery_time: "24-48h" });
    refresh();
  };
  const saveEdit = async (event) => {
    event.preventDefault();
    await request(`/api/admin/shipping-zones/${editing}`, { method: "PATCH", body: JSON.stringify({ fee: Number(editForm.fee), free_threshold: editForm.free_threshold ? Number(editForm.free_threshold) : 0, delivery_time: editForm.delivery_time, region: editForm.region }) });
    setEditing(null);
    refresh();
  };
  const startEdit = (zone) => {
    setEditing(zone.id);
    setEditForm({ region: zone.region || "Maroc", fee: String(Number(zone.fee || 0) / 100), free_threshold: zone.freeThreshold ? String(Number(zone.freeThreshold) / 100) : "", delivery_time: zone.deliveryTime || "24-48h" });
  };
  const remove = async (zone) => {
    if (window.confirm(`Supprimer la zone ${zone.city} ?`)) {
      await request(`/api/admin/shipping-zones/${zone.id}`, { method: "DELETE" });
      refresh();
    }
  };
  return (
    <Panel title="Zones de livraison" eyebrow="Livraison">
      <form onSubmit={save} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
        <input required placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="admin-input" />
        <input placeholder="Région" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="admin-input" />
        <input required type="number" min="0" placeholder="Frais DH" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="admin-input" />
        <input type="number" min="0" placeholder="Gratuit dès (DH)" value={form.free_threshold} onChange={(e) => setForm({ ...form, free_threshold: e.target.value })} className="admin-input" />
        <input placeholder="Délai (ex: 24-48h)" value={form.delivery_time} onChange={(e) => setForm({ ...form, delivery_time: e.target.value })} className="admin-input" />
        <button className="admin-btn admin-btn-primary">Ajouter</button>
      </form>
      <div className="admin-list-scroll mt-4 divide-y divide-black/10 border-y border-black/10">
        {items.map((zone) => (
          <div key={zone.id} className="py-4">
            {editing === zone.id ? (
              <form onSubmit={saveEdit} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                <input placeholder="Région" value={editForm.region} onChange={(e) => setEditForm({ ...editForm, region: e.target.value })} className="admin-input" />
                <input required type="number" min="0" placeholder="Frais DH" value={editForm.fee} onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })} className="admin-input" />
                <input type="number" min="0" placeholder="Gratuit dès (DH)" value={editForm.free_threshold} onChange={(e) => setEditForm({ ...editForm, free_threshold: e.target.value })} className="admin-input" />
                <input placeholder="Délai" value={editForm.delivery_time} onChange={(e) => setEditForm({ ...editForm, delivery_time: e.target.value })} className="admin-input" />
                <div className="flex gap-2">
                  <button className="admin-btn admin-btn-primary">Enregistrer</button>
                  <button type="button" onClick={() => setEditing(null)} className="admin-btn admin-btn-ghost">Annuler</button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-navy">{zone.city}</strong>
                    <span className={`admin-badge ${zone.fee === 0 ? "!bg-accent-lime/15 !text-navy !border-accent-lime/40" : ""}`}>{zone.fee === 0 ? "Gratuit" : `${Number(zone.fee || 0) / 100} DH`}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{zone.region} · {zone.deliveryTime}{zone.freeThreshold ? ` · gratuit dès ${Number(zone.freeThreshold) / 100} DH` : ""}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(zone)} className="admin-btn admin-btn-ghost !py-2">Modifier</button>
                  <button onClick={() => remove(zone)} className="admin-btn admin-btn-danger !py-2">Supprimer</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!items.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucune zone.</p>}
      </div>
    </Panel>
  );
}

function Reviews({ data, refresh }) {
  const items = Array.isArray(data) ? data : [];
  const [form, setForm] = useState({ name: "", city: "", rating: "5", comment: "", product_id: "" });
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState("");
  const statusTone = { pending: "!bg-amber-100 !text-amber-800 !border-amber-300", approved: "!bg-accent-lime/15 !text-navy !border-accent-lime/40", rejected: "!bg-destructive/10 !text-destructive !border-destructive/30" };
  useEffect(() => {
    let active = true;
    request("/api/admin/products?page=1&limit=100")
      .then((r) => { if (active) setProducts(Array.isArray(r) ? r : (r?.data || [])); })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  const createReview = async (event) => {
    event.preventDefault();
    if (!form.name || !form.comment) return;
    await request("/api/admin/reviews", { method: "POST", body: JSON.stringify({ ...form, rating: Number(form.rating), status: "approved" }) });
    setForm({ name: "", city: "", rating: "5", comment: "", product_id: form.product_id });
    refresh();
  };
  const shown = productFilter ? items.filter((i) => i.productId === productFilter) : items;
  return (
    <Panel title="Avis clients" eyebrow="Contenu généré">
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="admin-input sm:w-72" aria-label="Filtrer par produit">
          <option value="">Tous les produits</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span className="text-xs text-muted-foreground">{shown.length} avis</span>
      </div>
      <form onSubmit={createReview} className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr_2fr_1fr_3fr_auto]">
        <select required value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} className="admin-input" aria-label="Produit">
          <option value="">Produit…</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input required placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" aria-label="Nom" />
        <input placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="admin-input" aria-label="Ville" />
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="admin-input" aria-label="Note">
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} étoile{r > 1 ? "s" : ""}</option>)}
        </select>
        <input required placeholder="Commentaire (publié immédiatement)" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="admin-input" aria-label="Commentaire" />
        <button className="admin-btn admin-btn-primary">Publier</button>
      </form>
      <div className="admin-list-scroll mt-4 divide-y divide-black/10 border-y border-black/10">
        {shown.map((review) => (
          <div key={review.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <strong className="text-sm text-navy">{review.name}</strong>
                <span className="text-xs text-accent-lime">{"★".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}{"☆".repeat(Math.max(0, 5 - (Number(review.rating) || 0)))}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-foreground/60">{review.product_name || "—"}</p>
              <p className="mt-1 text-sm text-foreground/80">{review.comment}</p>
              <span className={`admin-badge mt-2 ${statusTone[review.status] || ""}`}>{review.status}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {review.status !== "approved" && <button disabled={review.status === "approved"} onClick={async () => { await request(`/api/admin/reviews/${review.id}`, { method: "PATCH", body: JSON.stringify({ status: "approved" }) }); refresh(); }} className="admin-btn admin-btn-lime">Approuver</button>}
              {review.status !== "pending" && <button onClick={async () => { await request(`/api/admin/reviews/${review.id}`, { method: "PATCH", body: JSON.stringify({ status: "pending" }) }); refresh(); }} className="admin-btn admin-btn-ghost">Remettre en attente</button>}
              {review.status !== "rejected" && <button onClick={async () => { await request(`/api/admin/reviews/${review.id}`, { method: "PATCH", body: JSON.stringify({ status: "rejected" }) }); refresh(); }} className="admin-btn admin-btn-ghost">Non accepté</button>}
              <button onClick={async () => { if (window.confirm("Supprimer définitivement cet avis ?")) { await request(`/api/admin/reviews/${review.id}`, { method: "DELETE" }); refresh(); } }} className="admin-btn admin-btn-danger"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {!shown.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucun avis à modérer.</p>}
      </div>
    </Panel>
  );
}