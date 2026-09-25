import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle, ExternalLink, Zap, Shield, Play, RefreshCw, BarChart2 } from "lucide-react";
import { adminRequest as request } from "@/lib/adminApi";
import { track, Events } from "@/lib/analytics";

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
  meta_pixel_id: "",
  meta_capi_token: "",
  meta_test_code: "",
  tiktok_pixel_id: "",
  tiktok_access_token: "",
  google_analytics_id: "",
  google_tag_manager_id: "",
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
        if (active) setForm({ ...DEFAULTS, ...data });
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
      setMessage("Configuration des Pixels enregistrée avec succès.");
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
      setTestLog((prev) => [`[${timestamp}] Event envoyé : PageView (Meta + TikTok)`, ...prev.slice(0, 4)]);
    } else if (eventName === "AddToCart") {
      track(Events.ADD_TO_CART, { content_ids: ["duo-pack"], value: 99, currency: "MAD", quantity: 1 });
      setTestLog((prev) => [`[${timestamp}] Event envoyé : AddToCart (99 MAD)`, ...prev.slice(0, 4)]);
    } else if (eventName === "Purchase") {
      track(Events.PURCHASE, { value: 99, currency: "MAD", quantity: 1, order_id: "TEST-" + Math.floor(Math.random() * 10000) });
      setTestLog((prev) => [`[${timestamp}] Event envoyé : Purchase / CompletePayment (99 MAD)`, ...prev.slice(0, 4)]);
    }
  };

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
          <p className="admin-section-title">Tracking & Publicité</p>
          <h2 className="admin-h2 mt-1">Configuration des Pixels Meta & TikTok</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Gérez le suivi des conversions Facebook / Instagram (Meta Pixel) et TikTok Ads pour vos campagnes.
          </p>
        </div>
        <button onClick={save} className="admin-btn admin-btn-primary" disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Enregistrement..." : "Enregistrer les Pixels"}
        </button>
      </div>

      {error && <div className="admin-card border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      {message && <div className="admin-card border-accent-lime/40 bg-accent-lime/10 p-4 text-sm text-navy">{message}</div>}

      {/* Grid: 2 Pixels (Meta + TikTok) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. META PIXEL CARD */}
        <div className="admin-card p-6 border-t-4 border-t-[#1877F2] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2]/10">
                  <MetaLogo />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-navy">Meta Pixel (Facebook & Instagram)</h3>
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

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  ID du Pixel Meta <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.meta_pixel_id ?? ""}
                  onChange={set("meta_pixel_id")}
                  placeholder="Ex: 123456789012345"
                  className="admin-input font-mono"
                />
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  Trouvez votre ID dans le <em>Gestionnaire d'événements Meta</em>.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Code d'événement de test (Optionnel)
                </label>
                <input
                  type="text"
                  value={form.meta_test_code ?? ""}
                  onChange={set("meta_test_code")}
                  placeholder="Ex: TEST12345"
                  className="admin-input font-mono"
                />
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  Pour vérifier la réception des événements en direct dans Meta.
                </span>
              </div>
            </div>

            {/* Events mapped */}
            <div className="mt-5 rounded-md bg-muted/40 p-3.5 text-xs space-y-1.5">
              <p className="font-bold text-navy text-[11px] uppercase tracking-wider">Événements automatiques trackés :</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground font-mono">
                <span>✓ PageView (Toutes pages)</span>
                <span>✓ ViewContent (Boxer)</span>
                <span>✓ AddToCart (Panier)</span>
                <span>✓ InitiateCheckout (Commande)</span>
                <span>✓ Purchase (Achat MAD)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs">
            <a
              href="https://business.facebook.com/events_manager2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#1877F2] font-bold hover:underline"
            >
              Ouvrir Meta Events Manager <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 2. TIKTOK PIXEL CARD */}
        <div className="admin-card p-6 border-t-4 border-t-[#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                  <TikTokLogo />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-navy">TikTok Pixel</h3>
                  <p className="text-xs text-muted-foreground">Suivi des campagnes TikTok For Business</p>
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

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  ID du Pixel TikTok <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.tiktok_pixel_id ?? ""}
                  onChange={set("tiktok_pixel_id")}
                  placeholder="Ex: C123456789012345678"
                  className="admin-input font-mono"
                />
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  Trouvez votre ID dans le <em>Gestionnaire d'événements TikTok</em>.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Jeton d'accès API TikTok (Optionnel)
                </label>
                <input
                  type="password"
                  value={form.tiktok_access_token ?? ""}
                  onChange={set("tiktok_access_token")}
                  placeholder="••••••••••••••••••••••••"
                  className="admin-input font-mono"
                />
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  Pour l'API Events TikTok (serveur à serveur).
                </span>
              </div>
            </div>

            {/* Events mapped */}
            <div className="mt-5 rounded-md bg-muted/40 p-3.5 text-xs space-y-1.5">
              <p className="font-bold text-navy text-[11px] uppercase tracking-wider">Événements automatiques trackés :</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground font-mono">
                <span>✓ Pageview (Toutes pages)</span>
                <span>✓ ViewContent (Boxer)</span>
                <span>✓ AddToCart (Panier)</span>
                <span>✓ InitiateCheckout (Commande)</span>
                <span>✓ CompletePayment (Achat)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs">
            <a
              href="https://ads.tiktok.com/marketing_api/apps/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-navy font-bold hover:underline"
            >
              Ouvrir TikTok Ads Manager <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. TEST & DIAGNOSTICS SECTION */}
      <div className="admin-card p-6 border-l-4 border-l-[#C7D400]">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-navy" />
          <h3 className="font-heading font-extrabold text-base text-navy">Testeur d'événements en direct</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Cliquez sur les boutons ci-dessous pour déclencher un événement dans votre navigateur et vérifier que vos extensions Chrome <em>Meta Pixel Helper</em> et <em>TikTok Pixel Helper</em> captent bien les signaux :
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
            <Play className="h-3.5 w-3.5" /> Déclencher AddToCart
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
            <p className="font-bold text-[10px] uppercase text-muted-foreground">Journal de test :</p>
            {testLog.map((log, i) => (
              <p key={i} className="text-emerald-700">{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
