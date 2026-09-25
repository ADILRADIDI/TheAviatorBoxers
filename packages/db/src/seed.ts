// Global db definition removed; db is obtained from createDatabase

import { config } from "dotenv";
import { randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";
import { sql } from "drizzle-orm";
import { createDatabase } from "./index.js";
import { adminUserRoles, adminUsers, categories, cmsPages, colors, coupons, inventoryMovements, orders, permissions, productVariants, products, promotions, rolePermissions, roles, reviews, shippingZones, siteSettings } from "./schema.js";

const scrypt = promisify(nodeScrypt);
async function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const derived = await scrypt(password, salt, 64) as Buffer; return `scrypt$${salt}$${derived.toString("hex")}`; }

config({ path: "../../.env" });

const { db, pool } = createDatabase(process.env.DATABASE_URL);

const permissionDefinitions = [
  ["dashboard.view", "dashboard", "Voir le tableau de bord"], ["products.view", "products", "Voir les produits"], ["products.create", "products", "Créer les produits"], ["products.update", "products", "Modifier les produits"], ["products.delete", "products", "Supprimer les produits"],
  ["categories.view", "categories", "Voir les catégories"], ["categories.create", "categories", "Créer les catégories"], ["categories.update", "categories", "Modifier les catégories"], ["categories.delete", "categories", "Supprimer les catégories"], ["inventory.view", "inventory", "Voir le stock"], ["inventory.update", "inventory", "Modifier le stock"], ["inventory.adjust", "inventory", "Ajuster le stock"],
  ["orders.view", "orders", "Voir les commandes"], ["orders.update", "orders", "Modifier les commandes"], ["orders.cancel", "orders", "Annuler les commandes"], ["orders.refund", "orders", "Rembourser les commandes"], ["customers.view", "customers", "Voir les clients"], ["returns.view", "returns", "Voir les retours"], ["returns.update", "returns", "Modifier les retours"], ["variants.view", "variants", "Voir les variantes"], ["variants.update", "variants", "Modifier les variantes"], ["reviews.view", "reviews", "Voir les avis"], ["reviews.update", "reviews", "Modérer les avis"], ["discounts.view", "discounts", "Voir les remises"], ["discounts.create", "discounts", "Créer les remises"], ["discounts.update", "discounts", "Modifier les remises"], ["discounts.delete", "discounts", "Supprimer les remises"],
    ["promotions.view", "promotions", "Voir les promotions"], ["promotions.create", "promotions", "Créer les promotions"], ["promotions.update", "promotions", "Modifier les promotions"], ["promotions.delete", "promotions", "Supprimer les promotions"], ["cms.create", "cms", "Créer les pages CMS"], ["cms.update", "cms", "Modifier les pages CMS"], ["cms.delete", "cms", "Supprimer les pages CMS"], ["shipping.view", "shipping", "Voir la livraison"], ["shipping.create", "shipping", "Créer les zones"], ["shipping.update", "shipping", "Modifier les zones"], ["shipping.delete", "shipping", "Supprimer les zones"], ["cms.view", "cms", "Voir le CMS"], ["media.view", "media", "Voir les médias"], ["media.upload", "media", "Importer des médias"], ["analytics.view", "analytics", "Voir les analytics"], ["reports.view", "reports", "Voir les rapports"], ["reports.export", "reports", "Exporter les rapports"], ["users.view", "users", "Voir les utilisateurs"], ["users.create", "users", "Créer les utilisateurs"], ["users.update", "users", "Modifier les utilisateurs"], ["users.delete", "users", "Supprimer les utilisateurs"], ["roles.view", "roles", "Voir les rôles"], ["roles.create", "roles", "Créer les rôles"], ["roles.update", "roles", "Modifier les rôles"], ["roles.delete", "roles", "Supprimer les rôles"], ["settings.view", "settings", "Voir les réglages"], ["settings.update", "settings", "Modifier les réglages"], ["audit_logs.view", "audit_logs", "Voir le journal"], ["notifications.view", "notifications", "Voir les notifications"],
] as const;
await db.insert(permissions).values(permissionDefinitions.map(([key, module, label]) => ({ key, module, label }))).onConflictDoNothing({ target: permissions.key });
await db.insert(permissions).values({ key: "media.delete", module: "media", label: "Supprimer les médias" }).onConflictDoNothing({ target: permissions.key });
await db.insert(permissions).values({ key: "media.update", module: "media", label: "Modifier les médias" }).onConflictDoNothing({ target: permissions.key });
await db.insert(roles).values(["SUPER_ADMIN", "ADMIN", "MANAGER", "SALES", "WAREHOUSE", "MARKETING", "CONTENT_EDITOR"].map((name) => ({ name, description: `Rôle ${name}` }))).onConflictDoNothing({ target: roles.name });
const [superRole] = await db.select().from(roles).where(sql`upper(${roles.name}) = 'SUPER_ADMIN'`);
const permissionRows = await db.select().from(permissions);
if (superRole && permissionRows.length) await db.insert(rolePermissions).values(permissionRows.map((permission: any) => ({ roleId: superRole.id, permissionId: permission.id }))).onConflictDoNothing();
const adminEmail = (process.env.ADMIN_EMAIL || "admin@theaviator.local").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "Aviator-Admin2026!";
const [admin] = await db.insert(adminUsers).values({ email: adminEmail, passwordHash: await hashPassword(adminPassword), name: "Administrateur The Aviator" }).onConflictDoNothing({ target: adminUsers.email }).returning();
const existingAdmin = admin || (await db.select().from(adminUsers).where(sql`${adminUsers.email} = ${adminEmail}`))[0];
if (existingAdmin && superRole) await db.insert(adminUserRoles).values({ userId: existingAdmin.id, roleId: superRole.id }).onConflictDoNothing();

await db.insert(categories).values({ name: "Boxers", slug: "boxers", description: "Boxers premium pour hommes." }).onConflictDoNothing({ target: categories.slug });

// Delete legacy test products and their relations to avoid confusion
const oldProducts = await db.select({ id: products.id }).from(products).where(sql`${products.slug} != 'the-aviator-boxer'`);
if (oldProducts.length > 0) {
  const oldIds = oldProducts.map((p) => p.id);
  const oldVariants = await db.select({ id: productVariants.id }).from(productVariants).where(sql`${productVariants.productId} IN (${sql.join(oldIds.map((id) => sql`${id}`), sql`, `)})`);
  if (oldVariants.length > 0) {
    const oldVariantIds = oldVariants.map((v) => v.id);
    await db.delete(inventoryMovements).where(sql`${inventoryMovements.variantId} IN (${sql.join(oldVariantIds.map((id) => sql`${id}`), sql`, `)})`);
    await db.delete(productVariants).where(sql`${productVariants.productId} IN (${sql.join(oldIds.map((id) => sql`${id}`), sql`, `)})`);
  }
  await db.delete(reviews).where(sql`${reviews.productId} IN (${sql.join(oldIds.map((id) => sql`${id}`), sql`, `)})`);
  await db.delete(products).where(sql`${products.id} IN (${sql.join(oldIds.map((id) => sql`${id}`), sql`, `)})`);
}

const colorDefinitions = [
  { name: "Noir", hex: "#111111", sortOrder: 1 },
  { name: "Bleu marine", hex: "#07132B", sortOrder: 2 },
  { name: "Bleu royal", hex: "#1b4d89", sortOrder: 3 },
  { name: "Blanc", hex: "#FFFFFF", sortOrder: 4 },
  { name: "Gris chiné", hex: "#8e9297", sortOrder: 5 },
  { name: "Anthracite", hex: "#374151", sortOrder: 6 },
];

for (const c of colorDefinitions) {
  await db.insert(colors).values(c).onConflictDoUpdate({ target: colors.name, set: { hex: c.hex, sortOrder: c.sortOrder } });
}

const productRows: any[] = [
  {
    name: "THE AVIATOR BOXER — Pack de 2",
    slug: "the-aviator-boxer",
    price: 9900,
    stock: 250,
    colorName: "Bleu marine",
    sizes: ["M", "L", "XL", "XXL"],
    featured: true,
    description: "Pack de 2 boxers homme haut de gamme en coton peigné (95% coton / 5% élasthanne). Choix libre de vos 2 couleurs et tailles. Pensé dans chaque détail pour offrir confort, maintien et liberté de mouvement au quotidien.",
    images: [
      "/products/aviator-navy.jpg",
      "/products/aviator-black.jpg",
      "/products/aviator-white.jpg",
      "/products/aviator-pack-duo.jpg",
      "/products/aviator-navy-contrast.jpg"
    ]
  },
];

for (const product of productRows as any[]) {
  const [saved] = await db.insert(products).values(product).onConflictDoUpdate({ target: products.slug, set: { name: product.name, description: product.description, images: product.images, stock: product.stock, price: product.price, colorName: product.colorName, sizes: product.sizes, featured: product.featured } }).returning();
  
  for (const col of colorDefinitions) {
    for (const size of product.sizes) {
      const sku = `AVT-PK2-${col.name.slice(0, 3).toUpperCase()}-${size}`;
      await db.insert(productVariants).values({ productId: saved.id, sku, size, color: col.name, price: product.price, stock: 25 }).onConflictDoUpdate({ target: productVariants.sku, set: { price: product.price, stock: 25 } });
    }
  }
}
await db.insert(shippingZones).values([
  { city: "Casablanca", region: "Casablanca-Settat", fee: 0, freeThreshold: 0, deliveryTime: "24h" },
  { city: "Rabat", region: "Rabat-Salé-Kénitra", fee: 3500, deliveryTime: "24-48h" },
  { city: "Marrakech", region: "Marrakech-Safi", fee: 4000, deliveryTime: "24-48h" },
  { city: "Tanger", region: "Tanger-Tétouan-Al Hoceïma", fee: 4000, deliveryTime: "24-48h" },
  { city: "Agadir", region: "Souss-Massa", fee: 4500, deliveryTime: "48-72h" },
]).onConflictDoNothing({ target: shippingZones.city });
await db.insert(coupons).values([
  { code: "TEST10", discountType: "percentage", value: 10, minCart: 0 },
  { code: "PACK10", discountType: "percentage", value: 10, minCart: 24900 },
]).onConflictDoNothing({ target: coupons.code });
await db.insert(promotions).values({
  name: "Bienvenue The Aviator",
  slug: "bienvenue-aviator",
  titleFr: "Le confort, avec une autre dimension.",
  titleDarija: "الراحة بمستوى جديد",
  subtitleFr: "Livraison gratuite à Casablanca. Paiement à la livraison partout au Maroc.",
  subtitleDarija: "التوصيل فابور فكازا وخلص ملي يوصلك الطلب فالمغرب كامل.",
  badgeFr: "Offre de bienvenue",
  badgeDarija: "عرض الترحيب",
  couponCode: "TEST10",
  ctaLabelFr: "Découvrir la collection",
  ctaLabelDarija: "شوف المجموعة",
  ctaUrl: "/collection",
}).onConflictDoNothing({ target: promotions.slug });

const seededProducts = await db.select().from(products);
const flagship = seededProducts.find((product) => product.slug === "the-aviator-boxer" || product.slug === "aviator-essential-navy");
if (flagship) {
  await db.insert(reviews).values({ productId: flagship.id, name: "Youssef E.", city: "Casablanca", rating: 5, comment: "Coupe confortable et tissu très agréable. La livraison à Casablanca a été super rapide.", status: "approved", verified: true, tissu: 5, service: 5, livraison: 5, qualite: 5 }).onConflictDoNothing();
}
const existingOrders = await db.select({ id: orders.id }).from(orders).where(sql`${orders.orderNumber} = 'AVT-2026-001' OR ${orders.idempotencyKey} = 'seed-order-001'`);
if (existingOrders.length === 0) {
  await db.insert(orders).values({ orderNumber: "AVT-2026-001", idempotencyKey: "seed-order-001", firstName: "Youssef", lastName: "El Amrani", phone: "0661234567", city: "Casablanca", address: "25 Bd d'Anfa, Étage 3", items: [{ product_id: flagship?.id, name: "THE AVIATOR BOXER — Pack de 2", quantity: 1, price: 99 }], subtotal: 9900, shippingFee: 0, discount: 0, total: 9900, paymentMethod: "cod", status: "nouvelle" });
}


await db.insert(siteSettings).values({
  key: "site",
  value: {
    store_name: "THE AVIATOR",
    tagline: "Le confort, avec une autre dimension.",
    description: "Boxers premium pour hommes, conçus pour offrir confort, maintien et style au quotidien.",
    email: "social@theaviatorboxer.com",
    phone: "+212 669-318641",
    whatsapp_number: "212669318641",
    address: "Casablanca, Maroc",
    instagram: "https://instagram.com/theaviatorboxer",
    facebook: "https://facebook.com/theaviatorboxer",
    tiktok: "",
    youtube: "",
    trust_items: [
      { title: "Tissus premium", subtitle: "95% coton / 5% Lycra" },
      { title: "Livraison gratuite", subtitle: "Sur Casablanca" },
      { title: "Paiement à la livraison", subtitle: "Payez à réception" },
      { title: "Qualité contrôlée", subtitle: "Normes internationales" },
    ],
    footer_columns: [
      { title: "Boutique", links: [{ label: "Collection", to: "/collection" }, { label: "Composer un pack", to: "/packs" }, { label: "Guide des tailles", to: "/guide-des-tailles" }, { label: "Avis clients", to: "/avis" }] },
      { title: "Informations", links: [{ label: "À propos", to: "/a-propos" }, { label: "Livraison & retours", to: "/livraison-retours" }, { label: "Paiement", to: "/paiement" }] },
      { title: "Aide", links: [{ label: "FAQ", to: "/faq" }, { label: "Contact", to: "/contact" }, { label: "Conditions générales", to: "/cgv" }, { label: "Confidentialité", to: "/confidentialite" }] },
    ],
  },
}).onConflictDoNothing({ target: siteSettings.key });

await db.execute(sql`UPDATE products SET created_at = COALESCE(created_at, NOW())`);
await pool.end();
console.log("Database seeded with Aviator catalog, shipping, coupons and promotion.");