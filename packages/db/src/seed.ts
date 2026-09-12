import { config } from "dotenv";
import { randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";
import { sql } from "drizzle-orm";
import { createDatabase } from "./index.js";
import { adminUserRoles, adminUsers, appSettings, categories, cmsPages, coupons, orders, paymentMethods, permissions, productVariants, products, promotions, rolePermissions, roles, reviews, shippingZones } from "./schema.js";

const scrypt = promisify(nodeScrypt);
async function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const derived = await scrypt(password, salt, 64) as Buffer; return `scrypt$${salt}$${derived.toString("hex")}`; }

config({ path: "../../.env" });

const { db, pool } = createDatabase(process.env.DATABASE_URL);

const permissionDefinitions = [
  ["dashboard.view", "dashboard", "Voir le tableau de bord"], ["products.view", "products", "Voir les produits"], ["products.create", "products", "Créer les produits"], ["products.update", "products", "Modifier les produits"], ["products.delete", "products", "Supprimer les produits"],
  ["categories.view", "categories", "Voir les catégories"], ["categories.create", "categories", "Créer les catégories"], ["categories.update", "categories", "Modifier les catégories"], ["categories.delete", "categories", "Supprimer les catégories"], ["inventory.view", "inventory", "Voir le stock"], ["inventory.update", "inventory", "Modifier le stock"], ["inventory.adjust", "inventory", "Ajuster le stock"],
  ["orders.view", "orders", "Voir les commandes"], ["orders.update", "orders", "Modifier les commandes"], ["orders.cancel", "orders", "Annuler les commandes"], ["orders.refund", "orders", "Rembourser les commandes"], ["customers.view", "customers", "Voir les clients"], ["returns.view", "returns", "Voir les retours"], ["returns.update", "returns", "Modifier les retours"], ["variants.view", "variants", "Voir les variantes"], ["variants.update", "variants", "Modifier les variantes"], ["reviews.view", "reviews", "Voir les avis"], ["reviews.update", "reviews", "Modérer les avis"], ["discounts.view", "discounts", "Voir les remises"], ["discounts.create", "discounts", "Créer les remises"], ["discounts.update", "discounts", "Modifier les remises"], ["discounts.delete", "discounts", "Supprimer les remises"],
    ["promotions.view", "promotions", "Voir les promotions"], ["promotions.create", "promotions", "Créer les promotions"], ["promotions.update", "promotions", "Modifier les promotions"], ["promotions.delete", "promotions", "Supprimer les promotions"], ["cms.create", "cms", "Créer les pages CMS"], ["cms.update", "cms", "Modifier les pages CMS"], ["cms.delete", "cms", "Supprimer les pages CMS"], ["shipping.view", "shipping", "Voir la livraison"], ["shipping.create", "shipping", "Créer les zones"], ["shipping.update", "shipping", "Modifier les zones"], ["shipping.delete", "shipping", "Supprimer les zones"], ["cms.view", "cms", "Voir le CMS"], ["media.view", "media", "Voir les médias"], ["media.upload", "media", "Importer des médias"], ["analytics.view", "analytics", "Voir les analytics"], ["reports.view", "reports", "Voir les rapports"], ["reports.export", "reports", "Exporter les rapports"], ["users.view", "users", "Voir les utilisateurs"], ["users.create", "users", "Créer les utilisateurs"], ["users.update", "users", "Modifier les utilisateurs"], ["users.delete", "users", "Supprimer les utilisateurs"], ["roles.view", "roles", "Voir les rôles"], ["roles.create", "roles", "Créer les rôles"], ["roles.update", "roles", "Modifier les rôles"], ["roles.delete", "roles", "Supprimer les rôles"], ["settings.view", "settings", "Voir les réglages"], ["settings.update", "settings", "Modifier les réglages"], ["payments.view", "payments", "Voir les moyens de paiement"], ["payments.update", "payments", "Modifier les moyens de paiement"], ["audit_logs.view", "audit_logs", "Voir le journal"], ["notifications.view", "notifications", "Voir les notifications"],
] as const;
await db.insert(permissions).values(permissionDefinitions.map(([key, module, label]) => ({ key, module, label }))).onConflictDoNothing({ target: permissions.key });
await db.insert(permissions).values({ key: "media.delete", module: "media", label: "Supprimer les médias" }).onConflictDoNothing({ target: permissions.key });
await db.insert(roles).values(["SUPER_ADMIN", "ADMIN", "MANAGER", "SALES", "WAREHOUSE", "MARKETING", "CONTENT_EDITOR"].map((name) => ({ name, description: `Rôle ${name}` }))).onConflictDoNothing({ target: roles.name });
const [superRole] = await db.select().from(roles).where(sql`upper(${roles.name}) = 'SUPER_ADMIN'`);
const permissionRows = await db.select().from(permissions);
if (superRole && permissionRows.length) await db.insert(rolePermissions).values(permissionRows.map((permission) => ({ roleId: superRole.id, permissionId: permission.id }))).onConflictDoNothing();
const adminEmail = (process.env.ADMIN_EMAIL || "admin@theaviator.local").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword) throw new Error("ADMIN_PASSWORD is required to seed the admin account");
const [admin] = await db.insert(adminUsers).values({ email: adminEmail, passwordHash: await hashPassword(adminPassword), name: "Administrateur The Aviator" }).onConflictDoNothing({ target: adminUsers.email }).returning();
const existingAdmin = admin || (await db.select().from(adminUsers).where(sql`${adminUsers.email} = ${adminEmail}`))[0];
if (existingAdmin && superRole) await db.insert(adminUserRoles).values({ userId: existingAdmin.id, roleId: superRole.id }).onConflictDoNothing();

await db.insert(categories).values({ name: "Boxers", slug: "boxers", description: "Boxers premium pour hommes." }).onConflictDoNothing({ target: categories.slug });

const productRows = [
  { name: "Aviator Essential Navy", slug: "aviator-essential-navy", price: 14900, stock: 40, colorName: "Navy", sizes: ["S", "M", "L", "XL", "XXL"], featured: true, images: ["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1200&q=85"] },
  { name: "Aviator Essential Noir", slug: "aviator-essential-noir", price: 14900, stock: 35, colorName: "Noir", sizes: ["S", "M", "L", "XL", "XXL"], featured: true, images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85"] },
  { name: "Pack Signature 2 pièces", slug: "pack-signature-2", price: 26900, stock: 20, colorName: "Bleu", sizes: ["M", "L", "XL"], featured: true, images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85"] },
];

for (const product of productRows) {
  const [saved] = await db.insert(products).values(product).onConflictDoUpdate({ target: products.slug, set: { images: product.images, stock: product.stock, price: product.price, colorName: product.colorName, sizes: product.sizes, featured: product.featured } }).returning();
  for (const size of product.sizes) {
    await db.insert(productVariants).values({ productId: saved.id, sku: `${product.slug}-${size}`.toUpperCase(), size, color: product.colorName, price: product.price, stock: Math.max(1, Math.floor(product.stock / product.sizes.length)) }).onConflictDoNothing({ target: productVariants.sku });
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
  { code: "PACK10", discountType: "percentage", value: 10, minCart: 0, packOnly: true },
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
const navy = seededProducts.find((product) => product.slug === "aviator-essential-navy");
if (navy) {
  await db.insert(reviews).values({ productId: navy.id, name: "Youssef E.", city: "Casablanca", rating: 5, comment: "Coupe confortable et tissu agréable. La livraison a été rapide.", status: "pending", verified: false }).onConflictDoNothing();
}
await db.insert(orders).values({ orderNumber: "AVT-SEED-001", idempotencyKey: "seed-order-001", firstName: "Youssef", lastName: "El Amrani", phone: "0612345678", city: "Casablanca", address: "12 rue du Commerce", items: [{ product_id: navy?.id, name: "Aviator Essential Navy", quantity: 1, price: 149 }], subtotal: 14900, shippingFee: 0, discount: 0, total: 14900, paymentMethod: "cod", status: "nouvelle" }).onConflictDoNothing({ target: orders.orderNumber });

await db.insert(paymentMethods).values([
  { code: "cod", name: "Paiement à la livraison", description: "Payez en espèces à la réception de votre commande.", instructions: "Préparez le montant exact ; notre livreur vous contacte avant la livraison.", active: true, sortOrder: 0 },
  { code: "cmi", name: "Paiement en ligne par carte (CMI)", description: "Paiement sécurisé par carte bancaire marocaine.", instructions: "Vous serez redirigé vers la plateforme sécurisée du CMI après validation.", active: false, sortOrder: 1 },
]).onConflictDoNothing({ target: paymentMethods.code });
await db.insert(appSettings).values([
  { key: "seo", value: { site_title: "THE AVIATOR — Boxers Premium pour Hommes", site_description: "Boxers premium pour hommes. 95% coton, 5% Lycra. Paiement à la livraison. Livraison 24-48h partout au Maroc." } },
  { key: "tracking", value: { google_analytics_id: "", meta_pixel_id: "", tiktok_pixel_id: "" } },
]).onConflictDoNothing({ target: appSettings.key });
await db.execute(sql`UPDATE products SET created_at = COALESCE(created_at, NOW())`);
await pool.end();
console.log("Database seeded with Aviator catalog, shipping, coupons and promotion.");