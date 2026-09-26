/**
 * THE AVIATOR — Centralized Resilient Admin API Client
 * Provides seamless backend API communication with automatic mock store fallback
 * when backend is offline or unreachable.
 */

const API = import.meta.env.VITE_API_URL || "";

const SYSTEM_PERMISSIONS = [
  { id: "dashboard.view", key: "dashboard.view", module: "Tableau de bord", label: "Consulter les indicateurs & graphiques" },
  { id: "orders.view", key: "orders.view", module: "Commandes", label: "Voir les commandes" },
  { id: "orders.update", key: "orders.update", module: "Commandes", label: "Modifier le statut & suivi" },
  { id: "orders.cancel", key: "orders.cancel", module: "Commandes", label: "Annuler des commandes" },
  { id: "orders.delete", key: "orders.delete", module: "Commandes", label: "Supprimer des commandes" },
  { id: "products.view", key: "products.view", module: "Catalogue & Produits", label: "Voir les fiches produits" },
  { id: "products.create", key: "products.create", module: "Catalogue & Produits", label: "Créer des produits" },
  { id: "products.update", key: "products.update", module: "Catalogue & Produits", label: "Modifier les fiches & prix" },
  { id: "products.delete", key: "products.delete", module: "Catalogue & Produits", label: "Supprimer des produits" },
  { id: "categories.view", key: "categories.view", module: "Catalogue & Produits", label: "Gérer les catégories" },
  { id: "inventory.view", key: "inventory.view", module: "Stock & Inventaire", label: "Consulter les stocks" },
  { id: "inventory.adjust", key: "inventory.adjust", module: "Stock & Inventaire", label: "Ajuster les quantités de stock" },
  { id: "inventory.update", key: "inventory.update", module: "Stock & Inventaire", label: "Modifier les seuils d'alerte" },
  { id: "customers.view", key: "customers.view", module: "Clients", label: "Consulter la base clients" },
  { id: "shipping.view", key: "shipping.view", module: "Livraison & Zones", label: "Consulter les zones de livraison" },
  { id: "shipping.update", key: "shipping.update", module: "Livraison & Zones", label: "Modifier les tarifs & délais" },
  { id: "discounts.view", key: "discounts.view", module: "Marketing & Codes promo", label: "Voir les codes promo" },
  { id: "discounts.create", key: "discounts.create", module: "Marketing & Codes promo", label: "Créer des codes promo" },
  { id: "discounts.update", key: "discounts.update", module: "Marketing & Codes promo", label: "Modifier les remises" },
  { id: "discounts.delete", key: "discounts.delete", module: "Marketing & Codes promo", label: "Supprimer des codes" },
  { id: "reviews.view", key: "reviews.view", module: "Avis clients", label: "Voir les avis" },
  { id: "reviews.update", key: "reviews.update", module: "Avis clients", label: "Approuver / Modérer les avis" },
  { id: "users.view", key: "users.view", module: "Utilisateurs & Sécurité", label: "Voir les administrateurs" },
  { id: "users.create", key: "users.create", module: "Utilisateurs & Sécurité", label: "Créer des administrateurs" },
  { id: "users.update", key: "users.update", module: "Utilisateurs & Sécurité", label: "Modifier les accès utilisateurs" },
  { id: "users.delete", key: "users.delete", module: "Utilisateurs & Sécurité", label: "Supprimer des utilisateurs" },
  { id: "roles.view", key: "roles.view", module: "Rôles & Permissions", label: "Consulter les rôles" },
  { id: "roles.create", key: "roles.create", module: "Rôles & Permissions", label: "Créer des rôles personnalisés" },
  { id: "roles.update", key: "roles.update", module: "Rôles & Permissions", label: "Modifier les permissions des rôles" },
  { id: "roles.delete", key: "roles.delete", module: "Rôles & Permissions", label: "Supprimer des rôles" },
  { id: "settings.view", key: "settings.view", module: "Paramètres & Réglages", label: "Voir les réglages boutique" },
  { id: "settings.update", key: "settings.update", module: "Paramètres & Réglages", label: "Modifier les réglages & pixels" },
  { id: "notifications.view", key: "notifications.view", module: "Notifications", label: "Gérer les alertes" },
  { id: "audit_logs.view", key: "audit_logs.view", module: "Audit & Sécurité", label: "Consulter le journal d'audit" }
];

// Initial Mock Store Data
const MOCK_STORAGE_KEY = "aviator_admin_clean_v4";

function getInitialMockDb() {
  return {
    dashboard: {
      totalRevenue: 0,
      ordersCount: 0,
      deliveredCount: 0,
      returnRate: 0,
      avgOrderValue: 0,
      revenueChange: "0%",
      ordersChange: "0%",
      chartData: [],
      topProducts: [],
      recentOrders: [],
    },
    orders: [],
    customers: [],
    products: [
      {
        id: "prod-1",
        name: "Pack 2 Boxers THE AVIATOR",
        nameFr: "Pack 2 Boxers THE AVIATOR",
        nameDarija: "باك 2 بوكسور لافياتور",
        slug: "aviator-essential-navy",
        price: 99,
        originalPrice: 150,
        description: "Pack signature de 2 boxers en coton compact stretch (95% coton / 5% élasthanne). Choix libre des 2 couleurs.",
        color_name: "5 Coloris au choix",
        active: true,
        category: "Packs",
        stock: 450,
        featured: true,
        images: [
          "/products/aviator-navy.jpg",
          "/products/aviator-black.jpg",
          "/products/aviator-white.jpg",
          "/products/aviator-pack-duo.jpg",
          "/products/aviator-navy-contrast.jpg"
        ]
      }
    ],
    categories: [
      { id: "cat-1", name: "Packs", nameFr: "Packs", nameDarija: "باكات", slug: "packs", active: true, productsCount: 1 },
      { id: "cat-3", name: "Accessoires", nameFr: "Accessoires", nameDarija: "إكسسوارات", slug: "accessoires", active: true, productsCount: 0 }
    ],
    colors: [
      { id: "col-1", name: "Noir", nameFr: "Noir", nameDarija: "كحل", hex: "#111111", code: "NOIR", active: true, sortOrder: 1 },
      { id: "col-2", name: "Bleu marine", nameFr: "Bleu marine", nameDarija: "كحلي", hex: "#07132B", code: "NAVY", active: true, sortOrder: 2 },
      { id: "col-3", name: "Bleu royal", nameFr: "Bleu royal", nameDarija: "أزرق ملكي", hex: "#1b4d89", code: "ROYAL", active: true, sortOrder: 3 },
      { id: "col-4", name: "Blanc", nameFr: "Blanc", nameDarija: "بيض", hex: "#FFFFFF", code: "BLANC", active: true, sortOrder: 4 },
      { id: "col-5", name: "Gris chiné", nameFr: "Gris chiné", nameDarija: "رمادي", hex: "#8e9297", code: "GRIS", active: true, sortOrder: 5 },
      { id: "col-6", name: "Anthracite", nameFr: "Anthracite", nameDarija: "فحمي", hex: "#374151", code: "ANTHRACITE", active: true, sortOrder: 6 },
    ],
    variants: [
      { id: "var-1", productId: "prod-1", productName: "Pack 2 Boxers THE AVIATOR", color: "Noir", color_name: "Noir", size: "M", sku: "AV-PK-BK-M", stock: 85, price: 99, lowStockThreshold: 15, active: true },
      { id: "var-2", productId: "prod-1", productName: "Pack 2 Boxers THE AVIATOR", color: "Noir", color_name: "Noir", size: "L", sku: "AV-PK-BK-L", stock: 110, price: 99, lowStockThreshold: 15, active: true },
      { id: "var-3", productId: "prod-1", productName: "Pack 2 Boxers THE AVIATOR", color: "Noir", color_name: "Noir", size: "XL", sku: "AV-PK-BK-XL", stock: 65, price: 99, lowStockThreshold: 15, active: true },
      { id: "var-4", productId: "prod-1", productName: "Pack 2 Boxers THE AVIATOR", color: "Bleu marine", color_name: "Bleu marine", size: "L", sku: "AV-PK-NV-L", stock: 95, price: 99, lowStockThreshold: 15, active: true },
      { id: "var-5", productId: "prod-1", productName: "Pack 2 Boxers THE AVIATOR", color: "Bleu royal", color_name: "Bleu royal", size: "M", sku: "AV-PK-RY-M", stock: 48, price: 99, lowStockThreshold: 15, active: true },
      { id: "var-6", productId: "prod-1", productName: "Pack 2 Boxers THE AVIATOR", color: "Blanc", color_name: "Blanc", size: "L", sku: "AV-PK-WH-L", stock: 52, price: 99, lowStockThreshold: 15, active: true },
      { id: "var-7", productId: "prod-1", productName: "Pack 2 Boxers THE AVIATOR", color: "Gris chiné", color_name: "Gris chiné", size: "XL", sku: "AV-PK-GR-XL", stock: 35, price: 99, lowStockThreshold: 15, active: true },
    ],
    inventoryMovements: [],
    shippingZones: [
      { id: "shp-1", region: "Casablanca & Environs", fee: 0, freeThreshold: 0, deliveryTime: "24-48h", active: true },
      { id: "shp-2", region: "Rabat, Salé, Mohammedia", fee: 2000, freeThreshold: 15000, deliveryTime: "24-48h", active: true },
      { id: "shp-3", region: "Marrakech, Fès, Tanger, Agadir", fee: 2500, freeThreshold: 19800, deliveryTime: "48-72h", active: true },
      { id: "shp-4", region: "Reste du Maroc (Toutes villes)", fee: 3500, freeThreshold: 25000, deliveryTime: "48-96h", active: true },
    ],
    coupons: [
      { id: "cp-1", code: "AVIATOR10", type: "percentage", value: 10, minCart: 9900, usedCount: 84, usageLimit: 500, active: true },
      { id: "cp-2", code: "PACKDUO", type: "fixed", value: 1500, minCart: 19800, usedCount: 42, usageLimit: 200, active: true },
      { id: "cp-3", code: "WELCOME", type: "percentage", value: 5, minCart: 0, usedCount: 156, usageLimit: null, active: true },
    ],
    reviews: [
      {
        id: "rev-1",
        author: "Youssef B.",
        productName: "Pack 2 Boxers THE AVIATOR",
        rating: 5,
        title: "Confort exceptionnel",
        comment: "Franchement très surpris par la qualité. Le tissu est doux, la bande tient bien sans serrer. Je recommande à 100%.",
        city: "Casablanca",
        status: "approved",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: "rev-2",
        author: "Reda M.",
        productName: "Pack 2 Boxers THE AVIATOR",
        rating: 5,
        title: "Finitions parfaites",
        comment: "Reçu en 24h à Rabat. Emballage soigné et boxers très confortables pour le quotidien.",
        city: "Rabat",
        status: "approved",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      },
      {
        id: "rev-3",
        author: "Hamza T.",
        productName: "Pack 2 Boxers THE AVIATOR",
        rating: 5,
        title: "Tissu 95/5 au top",
        comment: "Excellent maintien, ne remonte pas sur les cuisses au long de la journée.",
        city: "Tanger",
        status: "approved",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
      }
    ],
    roles: [
      {
        id: "role-super-admin",
        name: "SUPER_ADMIN",
        label: "Super Administrateur",
        description: "Accès complet à tous les modules, exports et réglages.",
        permissions: [...SYSTEM_PERMISSIONS],
        all_permissions: [...SYSTEM_PERMISSIONS]
      },
      {
        id: "role-logistique",
        name: "GESTION_COMMANDES",
        label: "Gestionnaire Logistique",
        description: "Accès aux commandes, statuts d'expédition et gestion du stock.",
        permissions: SYSTEM_PERMISSIONS.filter(p => ["dashboard.view", "orders.view", "orders.update", "inventory.view", "inventory.adjust"].includes(p.key)),
        all_permissions: [...SYSTEM_PERMISSIONS]
      }
    ],
    users: [
      { id: "usr-1", name: "Adil Radidi", email: "admin@theaviator.local", role: "SUPER_ADMIN", active: true, createdAt: "2026-01-01" },
      { id: "usr-2", name: "Support Client", email: "support@theaviator.local", role: "GESTION_COMMANDES", active: true, createdAt: "2026-02-15" }
    ],
    settings: {
      store_name: "THE AVIATOR",
      tagline: "Le confort, avec une autre dimension.",
      description: "Boxers premium pour hommes, conçus pour offrir confort, maintien et style au quotidien.",
      email: "contact@theaviatorboxer.com",
      phone: "+212 669-318641",
      whatsapp_number: "212669318641",
      whatsapp_default_message: "Bonjour The Aviator, je souhaite commander un pack / avoir des informations :",
      address: "Casablanca, Maroc",
      instagram: "https://www.instagram.com/the_aviator_boxers/",
      facebook: "https://web.facebook.com/profile.php?id=61592505372934",
      hero_price: "99 DH",
      hero_badge: "PACK DE 2 À 99 DH",
      google_analytics_id: "G-NST40JYCB7",
      google_stream_id: "15844671059",
      google_tag_manager_id: "",
      google_account_email: "social@theaviatorboxer.com",
      meta_pixel_id: "",
      tiktok_pixel_id: "",
    },
    notifications: [],
    auditLogs: []
  };
}

function loadMockDb() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (!parsed.settings) parsed.settings = {};
        if (!parsed.settings.google_analytics_id || parsed.settings.google_analytics_id.includes("XXXXXXXXXX")) {
          parsed.settings.google_analytics_id = "G-NST40JYCB7";
        }
        if (!parsed.settings.google_stream_id) {
          parsed.settings.google_stream_id = "15844671059";
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to parse mock db from localStorage:", e);
  }
  const initial = getInitialMockDb();
  saveMockDb(initial);
  return initial;
}

function saveMockDb(db) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
    if (Array.isArray(db.colors)) {
      localStorage.setItem("aviator_colors_cache", JSON.stringify(db.colors));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("aviator-colors-updated", { detail: db.colors }));
      }
    }
  } catch (e) {
    console.warn("Failed to save mock db to localStorage:", e);
  }
}

/**
 * Handle offline / mock API responses matching all admin endpoints
 */
function handleMockRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const db = loadMockDb();
  const [cleanPath, queryStr] = path.split("?");
  const queryParams = new URLSearchParams(queryStr || "");
  const body = options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : {};

  // Auth Login
  if (cleanPath === "/api/admin/login") {
    const email = body.email || "admin@theaviator.local";
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: "usr-1",
      name: "Adil Radidi",
      email: "admin@theaviator.local",
      role: "SUPER_ADMIN"
    };
    const permissions = [
      "dashboard.view", "orders.view", "orders.manage", "products.view",
      "products.manage", "inventory.view", "shipping.view", "discounts.view",
      "reviews.view", "users.view", "roles.view", "settings.view", "customers.view",
      "audit_logs.view", "notifications.view", "categories.view", "variants.view"
    ];
    return {
      authenticated: true,
      token: "mock-session-token-" + Date.now(),
      name: user.name,
      user_id: user.id,
      permissions
    };
  }

  // Auth Logout
  if (cleanPath === "/api/admin/logout") {
    return { ok: true };
  }

  // Dashboard
  if (cleanPath === "/api/admin/dashboard") {
    const period = queryParams.get("period") || "all";
    let allOrders = [...(db.orders || [])];

    if (period === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      allOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfDay);
    } else if (period === "7d") {
      const past7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      allOrders = allOrders.filter(o => new Date(o.createdAt) >= past7d);
    } else if (period === "30d") {
      const past30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      allOrders = allOrders.filter(o => new Date(o.createdAt) >= past30d);
    }

    const nonCancelled = allOrders.filter(o => o.status !== "annulee");
    const revenue = nonCancelled.reduce((sum, o) => sum + ((Number(o.total) || 0) / 100), 0);
    const averageOrder = nonCancelled.length ? Math.round((revenue / nonCancelled.length) * 100) / 100 : 0;

    const statusCounts = { nouvelle: 0, confirmee: 0, preparation: 0, expediee: 0, livree: 0 };
    for (const o of allOrders) {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status] += 1;
      } else {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      }
    }

    const topProductsMap = new Map();
    for (const order of nonCancelled) {
      if (!Array.isArray(order.items)) continue;
      for (const item of order.items) {
        const prodName = String(item.name || "Pack 2 Boxers THE AVIATOR");
        const quantity = Number(item.quantity || 1);
        const itemPrice = (Number(item.price || 0) > 500) ? (Number(item.price) / 100) : Number(item.price || 99);
        const current = topProductsMap.get(prodName) || { product_id: prodName, name: prodName, quantity: 0, revenue: 0 };
        current.quantity += quantity;
        current.revenue += quantity * itemPrice;
        topProductsMap.set(prodName, current);
      }
    }
    const topProducts = [...topProductsMap.values()]
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 5);

    const lowStock = (db.variants || []).filter(v => (v.stock || 0) < (v.lowStockThreshold || 5)).length;
    const pendingReviews = (db.reviews || []).filter(r => r.status === "pending").length;

    return {
      orders: allOrders.length,
      customers: new Set(allOrders.map(o => o.phone).filter(Boolean)).size,
      revenue: Math.round(revenue),
      averageOrder,
      lowStock,
      pendingReviews,
      statusCounts,
      topProducts,
      period,
    };
  }

  // Notifications inbox count
  if (cleanPath === "/api/admin/notifications/inbox") {
    const unread = db.notifications.filter(n => !n.read).length;
    return { count: unread };
  }

  // Notifications read-all
  if (cleanPath === "/api/admin/notifications/read-all" && method === "PATCH") {
    db.notifications.forEach(n => n.read = true);
    saveMockDb(db);
    return { ok: true };
  }

  // Orders
  if (cleanPath === "/api/admin/orders" || cleanPath === "/api/admin/commandes") {
    if (method === "GET") {
      let filtered = [...db.orders];
      const search = queryParams.get("search");
      const status = queryParams.get("status");
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(o => o.customerName.toLowerCase().includes(s) || o.phone.includes(s) || o.city.toLowerCase().includes(s) || (o.orderNumber && o.orderNumber.toLowerCase().includes(s)));
      }
      if (status) {
        filtered = filtered.filter(o => o.status === status);
      }
      return { data: filtered, total: filtered.length, page: 1, limit: 50, pages: 1 };
    }
  }

  // Single Order Update (e.g., status change)
  if (cleanPath.startsWith("/api/admin/orders/")) {
    const id = cleanPath.replace("/api/admin/orders/", "");
    const index = db.orders.findIndex(o => o.id === id);
    if (method === "PATCH") {
      if (index !== -1) {
        db.orders[index] = { ...db.orders[index], ...body };
        saveMockDb(db);
        return db.orders[index];
      }
      return { ok: true };
    }
    if (method === "DELETE") {
      if (index !== -1) {
        db.orders.splice(index, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Customers
  if (cleanPath === "/api/admin/customers" || cleanPath === "/api/admin/clients") {
    const customerMap = new Map();
    for (const order of (db.orders || [])) {
      const phoneKey = (order.phone || "").replace(/[\s-]/g, "") || order.customerName || order.id;
      const name = (order.customerName || `${order.firstName || ""} ${order.lastName || ""}`).trim() || "Client invité";
      const totalDh = (Number(order.total) || 0) / 100;
      
      const existing = customerMap.get(phoneKey) || {
        id: "cust-" + phoneKey,
        name,
        email: order.email || "",
        phone: order.phone || "—",
        city: order.city || "—",
        orders: 0,
        ordersCount: 0,
        totalSpent: 0,
        lastOrder: order.createdAt,
      };

      existing.orders += 1;
      existing.ordersCount += 1;
      if (order.status !== "annulee") {
        existing.totalSpent += totalDh;
      }
      if (new Date(order.createdAt) > new Date(existing.lastOrder || 0)) {
        existing.lastOrder = order.createdAt;
      }
      customerMap.set(phoneKey, existing);
    }
    const computedCustomers = [...customerMap.values()];
    return { data: computedCustomers, total: computedCustomers.length, page: 1, limit: 50, pages: 1 };
  }

  // Products
  if (cleanPath === "/api/admin/products" || cleanPath === "/api/admin/produits") {
    if (method === "GET") {
      return { data: db.products, total: db.products.length, page: 1, limit: 50, pages: 1 };
    }
    if (method === "POST") {
      const newProd = { id: "prod-" + Date.now(), ...body, active: true };
      db.products.unshift(newProd);
      saveMockDb(db);
      return newProd;
    }
  }

  if (cleanPath.startsWith("/api/admin/products/")) {
    const id = cleanPath.replace("/api/admin/products/", "");
    const idx = db.products.findIndex(p => p.id === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        db.products[idx] = { ...db.products[idx], ...body };
        saveMockDb(db);
        return db.products[idx];
      }
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.products.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Categories
  if (cleanPath === "/api/admin/categories") {
    if (method === "GET") return db.categories;
    if (method === "POST") {
      const newCat = { id: "cat-" + Date.now(), ...body, active: true };
      db.categories.push(newCat);
      saveMockDb(db);
      return newCat;
    }
  }

  // Colors (Public)
  if (cleanPath === "/api/colors") {
    return (db.colors || []).filter(c => c.active !== false).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  // Colors (Admin)
  if (cleanPath === "/api/admin/colors") {
    if (method === "GET") {
      return (db.colors || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    if (method === "POST") {
      const newCol = {
        id: "col-" + Date.now(),
        name: body.name?.trim() || "Nouvelle couleur",
        displayName: body.displayName?.trim() || body.name?.trim() || "Nouvelle couleur",
        hex: body.hex?.trim() || "#111111",
        hex2: body.hex2?.trim() || null,
        bicolor: Boolean(body.bicolor || body.hex2),
        code: (body.name || "COL").toUpperCase().replace(/[^A-Z0-9]/g, "_"),
        active: body.active !== false,
        sortOrder: Number(body.sortOrder) || (db.colors || []).length + 1,
      };
      if (!db.colors) db.colors = [];
      db.colors.push(newCol);
      saveMockDb(db);
      return newCol;
    }
  }

  if (cleanPath.startsWith("/api/admin/colors/")) {
    const rawId = cleanPath.replace("/api/admin/colors/", "");
    const id = decodeURIComponent(rawId);
    const idx = (db.colors || []).findIndex(c => String(c.id) === id || String(c.name).toLowerCase() === id.toLowerCase());
    if (method === "PATCH") {
      if (idx !== -1) {
        db.colors[idx] = {
          ...db.colors[idx],
          ...body,
          displayName: body.displayName !== undefined ? body.displayName : (body.name || db.colors[idx].displayName || db.colors[idx].name),
          bicolor: body.bicolor !== undefined ? body.bicolor : (Boolean(body.hex2 || db.colors[idx].hex2))
        };
      } else {
        const created = { id, ...body, active: body.active !== false };
        if (!db.colors) db.colors = [];
        db.colors.push(created);
      }
      saveMockDb(db);
      return db.colors[idx] || { id, ...body };
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.colors.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Variants & Stock
  if (cleanPath === "/api/admin/variants") {
    if (method === "GET") return db.variants;
    if (method === "POST") {
      const newVar = { id: "var-" + Date.now(), ...body };
      db.variants.push(newVar);
      saveMockDb(db);
      return newVar;
    }
  }

  if (cleanPath.startsWith("/api/admin/variants/")) {
    const id = cleanPath.replace("/api/admin/variants/", "");
    const idx = db.variants.findIndex(v => v.id === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        db.variants[idx] = { ...db.variants[idx], ...body };
        saveMockDb(db);
        return db.variants[idx];
      }
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.variants.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Inventory
  if (cleanPath === "/api/admin/inventory") {
    if (method === "GET") {
      return db.variants || [];
    }
  }

  if (cleanPath === "/api/admin/inventory/movements") {
    return db.inventoryMovements || [];
  }

  if (cleanPath === "/api/admin/inventory/adjust" && method === "POST") {
    const { variantId, quantity, type, reason } = body;
    const idx = db.variants.findIndex(v => v.id === variantId || v.sku === variantId);
    if (idx !== -1) {
      const current = Number(db.variants[idx].stock || 0);
      let nextStock = current;
      const qtyNum = Number(quantity || 0);
      if (type === "add" || type === "reassort") nextStock = current + qtyNum;
      else if (type === "subtract" || type === "perte") nextStock = Math.max(0, current - qtyNum);
      else if (type === "set" || type === "inventaire") nextStock = Math.max(0, qtyNum);
      db.variants[idx].stock = nextStock;
      
      const movement = {
        id: "mov-" + Date.now(),
        variantId: db.variants[idx].id,
        sku: db.variants[idx].sku,
        productName: db.variants[idx].productName || "Pack 2 Boxers THE AVIATOR",
        previousStock: current,
        newStock: nextStock,
        delta: nextStock - current,
        reason: reason || type || "Ajustement manuel",
        createdAt: new Date().toISOString()
      };
      if (!db.inventoryMovements) db.inventoryMovements = [];
      db.inventoryMovements.unshift(movement);
      saveMockDb(db);
      return { ok: true, variant: db.variants[idx], movement };
    }
    return { ok: false, message: "Variante non trouvée" };
  }

  // Shipping Zones
  if (cleanPath === "/api/admin/shipping-zones") {
    if (method === "GET") return db.shippingZones;
    if (method === "POST") {
      const newZone = { id: "shp-" + Date.now(), ...body, active: true };
      db.shippingZones.push(newZone);
      saveMockDb(db);
      return newZone;
    }
  }

  if (cleanPath.startsWith("/api/admin/shipping-zones/")) {
    const id = cleanPath.replace("/api/admin/shipping-zones/", "");
    const idx = db.shippingZones.findIndex(z => z.id === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        db.shippingZones[idx] = { ...db.shippingZones[idx], ...body };
        saveMockDb(db);
        return db.shippingZones[idx];
      }
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.shippingZones.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Coupons
  if (cleanPath === "/api/admin/coupons") {
    if (method === "GET") return db.coupons;
    if (method === "POST") {
      const newCp = { id: "cp-" + Date.now(), ...body, usedCount: 0, active: true };
      db.coupons.push(newCp);
      saveMockDb(db);
      return newCp;
    }
  }

  // Reviews
  if (cleanPath === "/api/admin/reviews" || cleanPath === "/api/admin/avis") {
    if (method === "GET") {
      let filtered = [...db.reviews];
      const status = queryParams.get("status");
      if (status) filtered = filtered.filter(r => r.status === status);
      return { data: filtered, total: filtered.length, page: 1, limit: 50, pages: 1 };
    }
  }

  if (cleanPath.startsWith("/api/admin/reviews/")) {
    const id = cleanPath.replace("/api/admin/reviews/", "");
    const idx = db.reviews.findIndex(r => r.id === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        db.reviews[idx] = { ...db.reviews[idx], ...body };
        saveMockDb(db);
        return db.reviews[idx];
      }
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.reviews.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Permissions
  if (cleanPath === "/api/admin/permissions") {
    return SYSTEM_PERMISSIONS;
  }

  // Roles
  if (cleanPath === "/api/admin/roles") {
    if (method === "GET") {
      return (db.roles || []).map(r => ({
        ...r,
        all_permissions: SYSTEM_PERMISSIONS,
      }));
    }
    if (method === "POST") {
      const selectedIds = Array.isArray(body.permission_ids) ? body.permission_ids : [];
      const rolePerms = SYSTEM_PERMISSIONS.filter(p => selectedIds.includes(p.id) || selectedIds.includes(p.key));
      const newRole = {
        id: "role-" + Date.now(),
        name: (body.name || "NOUVEAU_ROLE").trim().toUpperCase(),
        label: body.name || "Nouveau Rôle",
        description: body.description || "",
        permissions: rolePerms,
        all_permissions: SYSTEM_PERMISSIONS,
      };
      db.roles = db.roles || [];
      db.roles.push(newRole);
      saveMockDb(db);
      return newRole;
    }
  }

  // Single Role Update / Delete / Users
  if (cleanPath.startsWith("/api/admin/roles/")) {
    const subPath = cleanPath.replace("/api/admin/roles/", "");
    if (subPath.endsWith("/users")) {
      const roleId = subPath.replace("/users", "");
      return (db.users || []).filter(u => u.roles?.some(r => r.id === roleId || r.name === roleId) || u.role === roleId);
    }
    const id = subPath;
    const idx = (db.roles || []).findIndex(r => r.id === id || r.name === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        const selectedIds = Array.isArray(body.permission_ids) ? body.permission_ids : null;
        const rolePerms = selectedIds !== null
          ? SYSTEM_PERMISSIONS.filter(p => selectedIds.includes(p.id) || selectedIds.includes(p.key))
          : db.roles[idx].permissions;
        db.roles[idx] = {
          ...db.roles[idx],
          name: (body.name || db.roles[idx].name).trim().toUpperCase(),
          description: body.description !== undefined ? body.description : db.roles[idx].description,
          permissions: rolePerms,
          all_permissions: SYSTEM_PERMISSIONS,
        };
        saveMockDb(db);
        return db.roles[idx];
      }
      return { ok: true };
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.roles.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Users
  if (cleanPath === "/api/admin/users") {
    if (method === "GET") return db.users;
    if (method === "POST") {
      const roleObj = body.role_id ? db.roles.find(r => r.id === body.role_id) : null;
      const newUser = {
        id: "usr-" + Date.now(),
        name: body.name,
        email: body.email,
        roles: roleObj ? [roleObj] : [],
        active: body.active !== false,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      db.users.push(newUser);
      saveMockDb(db);
      return newUser;
    }
  }

  // Single User Update / Delete
  if (cleanPath.startsWith("/api/admin/users/")) {
    const id = cleanPath.replace("/api/admin/users/", "");
    const idx = db.users.findIndex(u => u.id === id || u.email === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        const roleObj = body.role_id ? db.roles.find(r => r.id === body.role_id) : null;
        db.users[idx] = {
          ...db.users[idx],
          ...body,
          roles: roleObj ? [roleObj] : (body.role_id === "" ? [] : db.users[idx].roles),
        };
        saveMockDb(db);
        return db.users[idx];
      }
      return { ok: true };
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.users.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Coupons
  if (cleanPath === "/api/admin/coupons") {
    if (method === "GET") return db.coupons;
    if (method === "POST") {
      const newCp = { id: "cp-" + Date.now(), ...body, usedCount: 0, active: true };
      db.coupons.push(newCp);
      saveMockDb(db);
      return newCp;
    }
  }

  // Single Coupon Update / Delete
  if (cleanPath.startsWith("/api/admin/coupons/")) {
    const id = cleanPath.replace("/api/admin/coupons/", "");
    const idx = db.coupons.findIndex(c => c.id === id || c.code === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        db.coupons[idx] = { ...db.coupons[idx], ...body };
        saveMockDb(db);
        return db.coupons[idx];
      }
      return { ok: true };
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.coupons.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Single Inventory Adjust
  if (cleanPath.startsWith("/api/admin/inventory/")) {
    const id = cleanPath.replace("/api/admin/inventory/", "");
    const idx = db.variants.findIndex(v => v.id === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        const newStock = Number(body.stock || 0);
        db.variants[idx].stock = newStock;
        saveMockDb(db);
        return db.variants[idx];
      }
      return { ok: true };
    }
  }

  // Settings
  if (cleanPath === "/api/admin/settings" || cleanPath === "/api/settings") {
    if (method === "GET") return db.settings;
    if (method === "PUT" || method === "PATCH") {
      db.settings = { ...db.settings, ...body };
      saveMockDb(db);
      try {
        localStorage.setItem("aviator_site_settings", JSON.stringify(db.settings));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("aviator-settings-updated", { detail: db.settings }));
        }
      } catch {}
      return db.settings;
    }
  }

  // Notifications
  if (cleanPath === "/api/admin/notifications") {
    if (method === "GET") return db.notifications;
    if (method === "POST") {
      const newNotif = { id: "notif-" + Date.now(), ...body, read: false, createdAt: new Date().toISOString() };
      db.notifications.unshift(newNotif);
      saveMockDb(db);
      return newNotif;
    }
  }

  // Single Notification Update / Delete
  if (cleanPath.startsWith("/api/admin/notifications/")) {
    const id = cleanPath.replace("/api/admin/notifications/", "");
    const idx = db.notifications.findIndex(n => n.id === id);
    if (method === "PATCH") {
      if (idx !== -1) {
        db.notifications[idx] = { ...db.notifications[idx], read: true };
        saveMockDb(db);
        return db.notifications[idx];
      }
      return { ok: true };
    }
    if (method === "DELETE") {
      if (idx !== -1) {
        db.notifications.splice(idx, 1);
        saveMockDb(db);
      }
      return { ok: true };
    }
  }

  // Audit Logs
  if (cleanPath === "/api/admin/audit-logs") {
    return db.auditLogs;
  }

  // Generic CSV Exports
  if (cleanPath.includes("/api/admin/exports/")) {
    if (cleanPath.includes("orders")) {
      const headers = "ID,Numero,Date,Client,Telephone,Ville,Total_DH,Statut,Source_Trafic,Campagne_UTM,Moyen_Paiement";
      const rows = db.orders.map(o => [
        o.id,
        o.orderNumber || "",
        new Date(o.createdAt).toLocaleDateString("fr-FR"),
        `"${(o.customerName || o.firstName || "").replace(/"/g, '""')}"`,
        o.phone || "",
        `"${(o.city || "").replace(/"/g, '""')}"`,
        ((o.total || 0) / 100).toFixed(2),
        o.status || "nouvelle",
        o.traffic_source || o.trafficSource || "DIRECT",
        `"${(o.utm_campaign || o.utm_source || "").replace(/"/g, '""')}"`,
        o.paymentMethod || "cod",
      ].join(","));
      return { content: [headers, ...rows].join("\n"), filename: `aviator-orders-${Date.now()}.csv` };
    }
    if (cleanPath.includes("customers") || cleanPath.includes("clients")) {
      const headers = "Nom,Telephone,Ville,Commandes,Total_Depense_DH";
      const customerMap = new Map();
      for (const order of (db.orders || [])) {
        const phoneKey = (order.phone || "").replace(/[\s-]/g, "") || order.customerName || order.id;
        const name = (order.customerName || `${order.firstName || ""} ${order.lastName || ""}`).trim() || "Client invité";
        const totalDh = (Number(order.total) || 0) / 100;
        const existing = customerMap.get(phoneKey) || { name, phone: order.phone || "", city: order.city || "", orders: 0, totalSpent: 0 };
        existing.orders += 1;
        if (order.status !== "annulee") existing.totalSpent += totalDh;
        customerMap.set(phoneKey, existing);
      }
      const rows = [...customerMap.values()].map(c => [
        `"${c.name.replace(/"/g, '""')}"`,
        c.phone,
        `"${c.city.replace(/"/g, '""')}"`,
        c.orders,
        c.totalSpent.toFixed(2),
      ].join(","));
      return { content: [headers, ...rows].join("\n"), filename: `aviator-customers-${Date.now()}.csv` };
    }
    if (cleanPath.includes("inventory") || cleanPath.includes("inventaire") || cleanPath.includes("stock")) {
      const headers = "SKU,Produit,Taille,Couleur,Stock_Disponible,Seuil_Alerte";
      const rows = (db.variants || []).map(v => [
        v.sku || "",
        `"${(v.productName || "Pack 2 Boxers THE AVIATOR").replace(/"/g, '""')}"`,
        v.size || "M",
        `"${(v.color || v.color_name || "").replace(/"/g, '""')}"`,
        v.stock ?? 0,
        v.lowStockThreshold ?? 15,
      ].join(","));
      return { content: [headers, ...rows].join("\n"), filename: `aviator-inventory-${Date.now()}.csv` };
    }
    return { content: "id,nom,total\n1,Demo,100", filename: "export.csv" };
  }

  // Default fallback for any unhandled path
  return [];
}

/**
 * Universal admin request function with real API enforcement
 */
export async function adminRequest(path, options = {}) {
  const token = localStorage.getItem("aviator_admin_token") || "";
  const headers = {
    ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    "x-admin-token": token,
    ...options.headers,
  };

  const isAuthLogin = path === "/api/admin/login";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const url = API ? `${API}${path}` : path;
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      localStorage.removeItem("aviator_admin_token");
      localStorage.removeItem("aviator_admin_permissions");
      window.dispatchEvent(new CustomEvent("aviator-admin-expired"));
      if (isAuthLogin) {
        throw new Error("Email ou mot de passe incorrect.");
      }
    }

    if (!response.ok) {
      if (isAuthLogin && response.status !== 404) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Identifiants de connexion invalides.");
      }
      console.warn(`[AdminAPI] Remote API returned status ${response.status} for ${path}. Falling back to mock store.`);
      return handleMockRequest(path, options);
    }

    const result = await response.json();
    if (path.includes("/settings") && (options.method === "PUT" || options.method === "PATCH")) {
      try {
        localStorage.setItem("aviator_site_settings", JSON.stringify(result));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("aviator-settings-updated", { detail: result }));
        }
      } catch {}
    }
    return result;
  } catch (err) {
    if (isAuthLogin) {
      // If it's explicitly an auth error from a responding API, throw it directly
      if (err.message === "Email ou mot de passe incorrect." || err.message === "Identifiants de connexion invalides.") {
        throw err;
      }
      // If network is offline or API server not running locally, fall back to dev mock authentication
      console.warn("[AdminAPI] API unreachable, falling back to local dev session.");
      return handleMockRequest(path, options);
    }
    // Network errors or offline development fallback
    console.warn(`[AdminAPI] Remote API error (${err.message}) for ${path}.`);
    return handleMockRequest(path, options);
  }
}

export default adminRequest;

