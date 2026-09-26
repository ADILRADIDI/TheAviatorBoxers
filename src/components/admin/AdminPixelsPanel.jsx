import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle, ExternalLink, Zap, Shield, Play, RefreshCw, BarChart2, Activity } from "lucide-react";
import { adminRequest as request } from "@/lib/adminApi";
import { track, Events } from "@/lib/analytics";

function GoogleAnalyticsLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#E37400" />
      <path fill="#FFFFFF" d="M12 5v14M7 11v8M17 8v11" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="7" cy="19" r="1" fill="#FFFFFF" />
      <circle cx="12" cy="19" r="1" fill="#FFFFFF" />
      <circle cx="17" cy="19" r="1" fill="#FFFFFF" />
    </svg>
  );
}

function MetaLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-[#1877F2]" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-white" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.1 8.1 0 004.83 1.57V7.12a4.85 4.85 0 01-1.07-.43z" />
    </svg>
  );
}

const DEFAULTS = {
  google_analytics_id: "G-NST40JYCB7",
  google_stream_id: "15844671059",
  google_tag_manager_id: "",
  google_account_email: "social@theaviatorboxer.com",
  meta_pixel_id: "",
  meta_capi_token: "",
  meta_test_code: "",
  tiktok_pixel_id: "",
  tiktok_access_token: "",
};

export default function AdminPixelsPanel() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [testLog, setTestLog] = useState([]);

  useEffect(() => {
    let active = true;
    request("/api/admin/settings")
      .then((data) => {
        if (active) {
          setForm({
            ...DEFAULTS,
            ...data,
            google_analytics_id: data.google_analytics_id && !data.google_analytics_id.includes("XXXXXXXXXX") ? data.google_analytics_id : "G-NST40JYCB7",
            google_stream_id: data.google_stream_id || "15844671059",
          });
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const save = async (event) => {
    if (event) event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await request("/api/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setMessage("Configuration Google Analytics & Pixels enregistrée et synchronisée en temps réel.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEvent = (eventName) => {
    const timestamp = new Date().toLocaleTimeString();
    if (eventName === "PageView") {
      track(Events.PAGE_VIEW, { path: "/notre-boxer", title: "Test PageView" });
      setTestLog((prev) => [`[${timestamp}] Event envoyé : PageView (GA4 + Meta + TikTok)`, ...prev.slice(0, 4)]);
    } else if (eventName === "AddToCart") {
      track(Events.ADD_TO_CART, { content_ids: ["the-aviator-boxer"], value: 99, currency: "MAD", quantity: 1, item_name: "Pack 2 Boxers THE AVIATOR" });
      setTestLog((prev) => [`[${timestamp}] Event envoyé : AddToCart (99 MAD)`, ...prev.slice(0, 4)]);
    } else if (eventName === "Purchase") {
      track(Events.PURCHASE, { value: 99, currency: "MAD", quantity: 1, transaction_id: "AVT-TEST-" + Math.floor(Math.random() * 10000) });
      setTestLog((prev) => [`[${timestamp}] Event envoyé : Purchase (99 MAD)`, ...prev.slice(0, 4)]);
    }
  };

  const hasGA = Boolean(form.google_analytics_id && form.google_analytics_id.trim() && !form.google_analytics_id.includes("XXXXXXXXXX"));
  const hasMeta = Boolean(form.meta_pixel_id && form.meta_pixel_id.trim());
  const hasTikTok = Boolean(form.tiktok_pixel_id && form.tiktok_pixel_id.trim());

  if (loading) {
    return (
      <div className="admin-card p-6">
        <div className="grid gap-4">
          <div className="admin-skeleton h-24" />
          <div className="admin-skeleton h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="admin-section-title">Tracking, Audiences & Visibilité</p>
          <h2 className="admin-h2 mt-1">Google Analytics 4 & Pixels Publicitaires</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Contrôlez et gérez en direct vos tags de suivi (Google Analytics 4, Meta Pixel et TikTok Ads).
          </p>
        </div>
        <button onClick={save} className="admin-btn admin-btn-primary" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Enregistrement..." : "Enregistrer la configuration"}
        </button>
      </div>

      {error && <div className="admin-card border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      {message && <div className="admin-card border-accent-lime/40 bg-accent-lime/10 p-4 text-sm text-navy">{message}</div>}

      {/* Grid: 3 Cards (Google Analytics + Meta + TikTok) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 1. GOOGLE ANALYTICS 4 CARD */}
        <div className="admin-card p-6 border-t-4 border-t-[#E37400] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E37400]/10">
                  <GoogleAnalyticsLogo />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-navy">Google Analytics 4 (GA4)</h3>
                  <p className="text-xs text-muted-foreground">Mesure du trafic & e-commerce</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  hasGA ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {hasGA ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {hasGA ? "Actif" : "Inactif"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  ID de mesure GA4 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.google_analytics_id ?? ""}
                  onChange={set("google_analytics_id")}
                  placeholder="G-NST40JYCB7"
                  className="admin-input font-mono text-xs"
                />
                <span className="mt-1 block text-[10px] text-muted-foreground">
                  Identifiant de mesure du flux Web (ex: G-NST40JYCB7).
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Numéro de flux (Stream ID)
                </label>
                <input
                  type="text"
                  value={form.google_stream_id ?? ""}
                  onChange={set("google_stream_id")}
                  placeholder="15844671059"
                  className="admin-input font-mono text-xs"
                />
                <span className="mt-1 block text-[10px] text-muted-foreground">
                  Flux de données Web Google Analytics (ex: 15844671059).
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Google Tag Manager (Optionnel)
                </label>
                <input
                  type="text"
                  value={form.google_tag_manager_id ?? ""}
                  onChange={set("google_tag_manager_id")}
                  placeholder="GTM-XXXXXXX"
                  className="admin-input font-mono text-xs"
                />
              </div>
            </div>

            {/* Events mapped */}
            <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs space-y-1">
              <p className="font-bold text-navy text-[10px] uppercase tracking-wider">Événements GA4 trackés :</p>
              <div className="grid grid-cols-1 gap-0.5 text-[11px] text-muted-foreground font-mono">
                <span>✓ page_view (Visiteurs réels)</span>
                <span>✓ view_item (Fiches boxers)</span>
                <span>✓ add_to_cart (Sélection pack)</span>
                <span>✓ purchase (Commandes MAD)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#E37400] font-bold hover:underline"
            >
              Console Google Analytics <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 2. META PIXEL CARD */}
        <div className="admin-card p-6 border-t-4 border-t-[#1877F2] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2]/10">
                  <MetaLogo />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-navy">Meta Pixel (Facebook/Insta)</h3>
                  <p className="text-xs text-muted-foreground">Suivi des publicités Meta Ads</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  hasMeta ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {hasMeta ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {hasMeta ? "Actif" : "Non configuré"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  ID du Pixel Meta
                </label>
                <input
                  type="text"
                  value={form.meta_pixel_id ?? ""}
                  onChange={set("meta_pixel_id")}
                  placeholder="Ex: 123456789012345"
                  className="admin-input font-mono text-xs"
                />
                <span className="mt-1 block text-[10px] text-muted-foreground">
                  Gestionnaire d'événements Meta.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Code de test (Optionnel)
                </label>
                <input
                  type="text"
                  value={form.meta_test_code ?? ""}
                  onChange={set("meta_test_code")}
                  placeholder="TEST12345"
                  className="admin-input font-mono text-xs"
                />
              </div>
            </div>

            {/* Events mapped */}
            <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs space-y-1">
              <p className="font-bold text-navy text-[10px] uppercase tracking-wider">Événements Meta trackés :</p>
              <div className="grid grid-cols-1 gap-0.5 text-[11px] text-muted-foreground font-mono">
                <span>✓ PageView (Global)</span>
                <span>✓ ViewContent (Produit)</span>
                <span>✓ AddToCart (Panier)</span>
                <span>✓ Purchase (Achat MAD)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
            <a
              href="https://business.facebook.com/events_manager2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#1877F2] font-bold hover:underline"
            >
              Meta Events Manager <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 3. TIKTOK PIXEL CARD */}
        <div className="admin-card p-6 border-t-4 border-t-[#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                  <TikTokLogo />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-navy">TikTok Pixel</h3>
                  <p className="text-xs text-muted-foreground">Suivi TikTok For Business</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  hasTikTok ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {hasTikTok ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {hasTikTok ? "Actif" : "Non configuré"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  ID du Pixel TikTok
                </label>
                <input
                  type="text"
                  value={form.tiktok_pixel_id ?? ""}
                  onChange={set("tiktok_pixel_id")}
                  placeholder="Ex: C123456789012345678"
                  className="admin-input font-mono text-xs"
                />
                <span className="mt-1 block text-[10px] text-muted-foreground">
                  Gestionnaire d'événements TikTok.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Jeton d'accès API (Optionnel)
                </label>
                <input
                  type="password"
                  value={form.tiktok_access_token ?? ""}
                  onChange={set("tiktok_access_token")}
                  placeholder="••••••••••••••••"
                  className="admin-input font-mono text-xs"
                />
              </div>
            </div>

            {/* Events mapped */}
            <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs space-y-1">
              <p className="font-bold text-navy text-[10px] uppercase tracking-wider">Événements TikTok trackés :</p>
              <div className="grid grid-cols-1 gap-0.5 text-[11px] text-muted-foreground font-mono">
                <span>✓ Pageview (Global)</span>
                <span>✓ ViewContent (Produit)</span>
                <span>✓ AddToCart (Panier)</span>
                <span>✓ CompletePayment (Achat)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
            <a
              href="https://ads.tiktok.com/marketing_api/apps/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-navy font-bold hover:underline"
            >
              TikTok Ads Manager <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. TEST & DIAGNOSTICS SECTION */}
      <div className="admin-card p-6 border-l-4 border-l-[#C7D400]">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-navy" />
          <h3 className="font-heading font-extrabold text-base text-navy">Testeur d'événements en direct (GA4, Meta & TikTok)</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Cliquez sur les boutons ci-dessous pour déclencher un événement en direct et vérifier dans <strong>Google Analytics Temps Réel</strong> ou via l'extension <em>Google Tag Assistant / Meta Pixel Helper</em> :
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleTestEvent("PageView")}
            className="admin-btn admin-btn-secondary text-xs"
          >
            <Play className="h-3.5 w-3.5" /> Déclencher PageView
          </button>
          <button
            type="button"
            onClick={() => handleTestEvent("AddToCart")}
            className="admin-btn admin-btn-secondary text-xs"
          >
            <Play className="h-3.5 w-3.5" /> Déclencher AddToCart (99 DH)
          </button>
          <button
            type="button"
            onClick={() => handleTestEvent("Purchase")}
            className="admin-btn admin-btn-secondary text-xs"
          >
            <Play className="h-3.5 w-3.5" /> Déclencher Purchase (99 DH)
          </button>
        </div>

        {testLog.length > 0 && (
          <div className="mt-4 p-3 bg-black/5 rounded-md font-mono text-xs text-navy space-y-1">
            <p className="font-bold text-[10px] uppercase text-muted-foreground">Journal des signaux envoyés :</p>
            {testLog.map((log, i) => (
              <p key={i} className="text-emerald-700">{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
