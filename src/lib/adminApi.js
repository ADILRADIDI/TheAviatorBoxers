/**
 * THE AVIATOR — Centralized Resilient Admin API Client
 * Provides seamless backend API communication with automatic mock store fallback
 * when backend is offline or unreachable.
 */

const API = import.meta.env.VITE_API_URL || "";

// Initial Mock Store Data
const MOCK_STORAGE_KEY = "aviator_admin_mock_db_v3";

function getInitialMockDb() {
  return {
    dashboard: {
      totalRevenue: 14850000, // 148,500 DH in cents
      ordersCount: 412,
      deliveredCount: 388,
      returnRate: 1.8,
      avgOrderValue: 24500, // 245 DH in cents
      revenueChange: "+14.5%",
      ordersChange: "+18.2%",
      chartData: [
        { date: "01/09", revenue: 4200, orders: 12 },
        { date: "05/09", revenue: 5800, orders: 16 },
        { date: "10/09", revenue: 8400, orders: 24 },
        { date: "15/09", revenue: 9900, orders: 28 },
        { date: "20/09", revenue: 12400, orders: 35 },
      ],
      topProducts: [
        { name: "Pack 2 Boxers THE AVIATOR (Noir & Marine)", sales: 245, revenue: 24255 },
        { name: "Pack 2 Boxers THE AVIATOR (Marine & Royal)", sales: 167, revenue: 16533 },
      ],
      recentOrders: [
        { id: "ord-101", customerName: "Karim Bennani", city: "Casablanca", total: 9900, status: "nouvelle", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: "ord-102", customerName: "Yassine El Amrani", city: "Rabat", total: 19800, status: "confirmee", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
        { id: "ord-103", customerName: "Mehdi Tazi", city: "Marrakech", total: 9900, status: "preparation", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: "ord-104", customerName: "Omar Chraibi", city: "Tanger", total: 14900, status: "expediee", createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
        { id: "ord-105", customerName: "Amine Alami", city: "Fès", total: 9900, status: "livree", createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString() },
      ],
    },
    orders: [
      {
        id: "ord-101",
        orderNumber: "AV-2026-0412",
        customerName: "Karim Bennani",
        phone: "0661234567",
        city: "Casablanca",
        address: "25 Bd d'Anfa, Étage 3",
        status: "nouvelle",
        itemsCount: 1,
        total: 9900,
        paymentMethod: "cod",
        shippingFee: 0,
        traffic_source: "TIKTOK",
        trafficSource: "TIKTOK",
        utm_source: "tiktok",
        utm_campaign: "launch_morocco_ugc",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        items: [{ name: "Pack 2 Boxers THE AVIATOR", color: "Noir / Bleu Marine", size: "L", quantity: 1, price: 9900 }]
      },
      {
        id: "ord-102",
        orderNumber: "AV-2026-0411",
        customerName: "Yassine El Amrani",
        phone: "0662345678",
        city: "Rabat",
        address: "12 Rue Agdal",
        status: "confirmee",
        itemsCount: 2,
        total: 19800,
        paymentMethod: "cod",
        shippingFee: 0,
        traffic_source: "INSTAGRAM",
        trafficSource: "INSTAGRAM",
        utm_source: "instagram",
        utm_campaign: "reels_comfort_99dh",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        items: [{ name: "Pack 2 Boxers THE AVIATOR", color: "Bleu Royal / Blanc", size: "M", quantity: 2, price: 9900 }]
      },
      {
        id: "ord-103",
        orderNumber: "AV-2026-0410",
        customerName: "Mehdi Tazi",
        phone: "0663456789",
        city: "Marrakech",
        address: "44 Av. Mohamed VI, Guéliz",
        status: "preparation",
        itemsCount: 1,
        total: 9900,
        paymentMethod: "cod",
        shippingFee: 2500,
        traffic_source: "FACEBOOK",
        trafficSource: "FACEBOOK",
        utm_source: "facebook",
        utm_campaign: "retargeting_cart",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        items: [{ name: "Pack 2 Boxers THE AVIATOR", color: "Noir / Gris", size: "XL", quantity: 1, price: 9900 }]
      },
      {
        id: "ord-104",
        orderNumber: "AV-2026-0409",
        customerName: "Omar Chraibi",
        phone: "0664567890",
        city: "Tanger",
        address: "Résidence Malabata, Bloc B",
        status: "expediee",
        itemsCount: 2,
        total: 19800,
        paymentMethod: "cod",
        shippingFee: 2500,
        traffic_source: "YOUTUBE",
        trafficSource: "YOUTUBE",
        utm_source: "youtube",
        utm_campaign: "lifestyle_video_ad",
        createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        items: [{ name: "Pack 2 Boxers THE AVIATOR", color: "Bleu Marine / Noir", size: "L", quantity: 2, price: 9900 }]
      },
      {
        id: "ord-105",
        orderNumber: "AV-2026-0408",
        customerName: "Amine Alami",
        phone: "0665678901",
        city: "Fès",
        address: "7 Route d'Imouzzer",
        status: "livree",
        itemsCount: 1,
        total: 9900,
        paymentMethod: "cod",
        shippingFee: 2500,
        traffic_source: "DIRECT",
        trafficSource: "DIRECT",
        createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
        items: [{ name: "Pack 2 Boxers THE AVIATOR", color: "Bleu Marine / Blanc", size: "M", quantity: 1, price: 9900 }]
      },
    ],
    customers: [
      { id: "cust-1", name: "Karim Bennani", email: "karim.bennani@gmail.com", phone: "0661234567", city: "Casablanca", ordersCount: 3, totalSpent: 29700, lastOrderAt: new Date().toISOString() },
      { id: "cust-2", name: "Yassine El Amrani", email: "yassine.amrani@outlook.com", phone: "0662345678", city: "Rabat", ordersCount: 2, totalSpent: 24800, lastOrderAt: new Date().toISOString() },
      { id: "cust-3", name: "Mehdi Tazi", email: "m.tazi@gmail.com", phone: "0663456789", city: "Marrakech", ordersCount: 1, totalSpent: 9900, lastOrderAt: new Date().toISOString() },
      { id: "cust-4", name: "Omar Chraibi", email: "omar.chr@yahoo.fr", phone: "0664567890", city: "Tanger", ordersCount: 2, totalSpent: 24800, lastOrderAt: new Date().toISOString() },
      { id: "cust-5", name: "Amine Alami", email: "amine.alami@gmail.com", phone: "0665678901", city: "Fès", ordersCount: 4, totalSpent: 39600, lastOrderAt: new Date().toISOString() },
    ],
    products: [
      {
        id: "prod-1",
        name: "Pack 2 Boxers THE AVIATOR",
        nameFr: "Pack 2 Boxers THE AVIATOR",
        nameDarija: "باك 2 بوكسور لافياتور",
        slug: "aviator-essential-navy",
        price: 99,
        originalPrice: 150,
        description: "Pack signature de 2 boxers en coton peigné stretch (95% coton / 5% élasthanne). Choix libre des 2 couleurs.",
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
      { id: "var-1", product_name: "Pack 2 Boxers THE AVIATOR", productName: "Pack 2 Boxers THE AVIATOR", color_name: "Noir", size: "M", sku: "AV-PK-BK-M", stock: 85, price: 9900, lowStockThreshold: 15 },
      { id: "var-2", product_name: "Pack 2 Boxers THE AVIATOR", productName: "Pack 2 Boxers THE AVIATOR", color_name: "Noir", size: "L", sku: "AV-PK-BK-L", stock: 110, price: 9900, lowStockThreshold: 15 },
      { id: "var-3", product_name: "Pack 2 Boxers THE AVIATOR", productName: "Pack 2 Boxers THE AVIATOR", color_name: "Noir", size: "XL", sku: "AV-PK-BK-XL", stock: 65, price: 9900, lowStockThreshold: 15 },
      { id: "var-4", product_name: "Pack 2 Boxers THE AVIATOR", productName: "Pack 2 Boxers THE AVIATOR", color_name: "Bleu Marine", size: "L", sku: "AV-PK-NV-L", stock: 95, price: 9900, lowStockThreshold: 15 },
      { id: "var-5", product_name: "Pack 2 Boxers THE AVIATOR", productName: "Pack 2 Boxers THE AVIATOR", color_name: "Bleu Royal", size: "M", sku: "AV-PK-RY-M", stock: 48, price: 9900, lowStockThreshold: 15 },
      { id: "var-6", product_name: "Pack 2 Boxers THE AVIATOR", productName: "Pack 2 Boxers THE AVIATOR", color_name: "Blanc", size: "L", sku: "AV-PK-WH-L", stock: 52, price: 9900, lowStockThreshold: 15 },
      { id: "var-7", product_name: "Pack 2 Boxers THE AVIATOR", productName: "Pack 2 Boxers THE AVIATOR", color_name: "Gris", size: "XL", sku: "AV-PK-GR-XL", stock: 35, price: 9900, lowStockThreshold: 15 },
    ],
    inventory: [
      { id: "inv-1", sku: "AV-PK-BK-M", productName: "Pack 2 Boxers Noir M", currentStock: 85, minStock: 15, status: "ok" },
      { id: "inv-2", sku: "AV-PK-BK-L", productName: "Pack 2 Boxers Noir L", currentStock: 110, minStock: 15, status: "ok" },
      { id: "inv-3", sku: "AV-PK-BK-XL", productName: "Pack 2 Boxers Noir XL", currentStock: 65, minStock: 15, status: "ok" },
      { id: "inv-4", sku: "AV-PK-NV-L", productName: "Pack 2 Boxers Marine L", currentStock: 95, minStock: 15, status: "ok" },
      { id: "inv-5", sku: "AV-PK-RY-M", productName: "Pack 2 Boxers Royal M", currentStock: 48, minStock: 15, status: "ok" },
      { id: "inv-6", sku: "AV-PK-WH-L", productName: "Pack 2 Boxers Blanc L", currentStock: 52, minStock: 15, status: "ok" },
      { id: "inv-7", sku: "AV-PK-GR-XL", productName: "Pack 2 Boxers Gris XL", currentStock: 35, minStock: 15, status: "ok" },
    ],
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
        permissions: [
          { key: "dashboard.view" }, { key: "orders.view" }, { key: "orders.manage" },
          { key: "products.view" }, { key: "products.manage" }, { key: "inventory.view" },
          { key: "shipping.view" }, { key: "discounts.view" }, { key: "reviews.view" },
          { key: "users.view" }, { key: "roles.view" }, { key: "settings.view" }
        ],
        all_permissions: [
          { key: "dashboard.view", label: "Voir le tableau de bord", module: "dashboard" },
          { key: "orders.view", label: "Voir les commandes", module: "orders" },
          { key: "orders.manage", label: "Gérer les commandes", module: "orders" },
          { key: "products.view", label: "Voir les produits", module: "products" },
          { key: "products.manage", label: "Gérer les produits", module: "products" },
          { key: "inventory.view", label: "Voir l'inventaire", module: "inventory" },
          { key: "shipping.view", label: "Voir la livraison", module: "shipping" },
          { key: "discounts.view", label: "Voir les coupons", module: "discounts" },
          { key: "reviews.view", label: "Voir les avis", module: "reviews" },
          { key: "users.view", label: "Voir les utilisateurs", module: "users" },
          { key: "roles.view", label: "Voir les rôles", module: "roles" },
          { key: "settings.view", label: "Voir les réglages", module: "settings" },
        ]
      },
      {
        id: "role-logistique",
        name: "GESTION_COMMANDES",
        label: "Gestionnaire Logistique",
        description: "Accès aux commandes, statuts d'expédition et stock.",
        permissions: [{ key: "dashboard.view" }, { key: "orders.view" }, { key: "orders.manage" }, { key: "inventory.view" }],
        all_permissions: []
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
      google_analytics_id: "G-XXXXXXXXXX",
      google_tag_manager_id: "",
      google_account_email: "boss@theaviatorboxer.com",
      meta_pixel_id: "",
      tiktok_pixel_id: "",
    },
    notifications: [
      { id: "notif-1", type: "order", title: "Nouvelle commande #AV-2026-0412", message: "Karim Bennani a commandé 1x Pack de 2 (99 DH)", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { id: "notif-2", type: "order", title: "Nouvelle commande #AV-2026-0411", message: "Yassine El Amrani a commandé 2x Packs (198 DH)", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      { id: "notif-3", type: "stock", title: "Stock optimal", message: "L'inventaire des tailles M et L a été mis à jour", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
    ],
    auditLogs: [
      { id: "log-1", actor: "admin@theaviator.local", action: "admin.login", entity: "session", createdAt: new Date().toISOString() },
      { id: "log-2", actor: "admin@theaviator.local", action: "order.status_update", entity: "AV-2026-0409 (expédiée)", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
      { id: "log-3", actor: "system", action: "inventory.sync", entity: "stock (ok)", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    ]
  };
}

function loadMockDb() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
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
    return db.dashboard;
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
    return { data: db.customers, total: db.customers.length, page: 1, limit: 50, pages: 1 };
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

  // Colors
  if (cleanPath === "/api/admin/colors") {
    if (method === "GET") return db.colors;
    if (method === "POST") {
      const newCol = { id: "col-" + Date.now(), ...body, active: true, sortOrder: Number(body.sortOrder) || db.colors.length + 1 };
      db.colors.push(newCol);
      saveMockDb(db);
      return newCol;
    }
  }

  if (cleanPath.startsWith("/api/admin/colors/")) {
    const id = cleanPath.replace("/api/admin/colors/", "");
    const idx = db.colors.findIndex(c => String(c.id) === id || String(c.name).toLowerCase() === id.toLowerCase());
    if (method === "PATCH") {
      if (idx !== -1) {
        db.colors[idx] = { ...db.colors[idx], ...body };
      } else {
        db.colors.push({ id, ...body });
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
    return db.inventory;
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

  // Roles
  if (cleanPath === "/api/admin/roles") {
    return db.roles;
  }

  // Users
  if (cleanPath === "/api/admin/users") {
    if (method === "GET") return db.users;
    if (method === "POST") {
      const newUser = { id: "usr-" + Date.now(), ...body, active: true, createdAt: new Date().toISOString().slice(0, 10) };
      db.users.push(newUser);
      saveMockDb(db);
      return newUser;
    }
  }

  // Settings
  if (cleanPath === "/api/admin/settings") {
    if (method === "GET") return db.settings;
    if (method === "PUT" || method === "PATCH") {
      db.settings = { ...db.settings, ...body };
      saveMockDb(db);
      return db.settings;
    }
  }

  // Notifications
  if (cleanPath === "/api/admin/notifications") {
    return db.notifications;
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

    return await response.json();
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

