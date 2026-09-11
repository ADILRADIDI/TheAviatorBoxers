import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { createDatabase } from "./index.js";
import { categories, coupons, orders, productVariants, products, promotions, reviews, shippingZones } from "./schema.js";

config({ path: "../../.env" });

const { db, pool } = createDatabase(process.env.DATABASE_URL);

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
await db.insert(orders).values({ orderNumber: "AVT-SEED-001", firstName: "Youssef", lastName: "El Amrani", phone: "0612345678", city: "Casablanca", address: "12 rue du Commerce", items: [{ product_id: navy?.id, name: "Aviator Essential Navy", quantity: 1, price: 149 }], subtotal: 14900, shippingFee: 0, discount: 0, total: 14900, paymentMethod: "cod", status: "nouvelle" }).onConflictDoNothing({ target: orders.orderNumber });

await db.execute(sql`UPDATE products SET created_at = COALESCE(created_at, NOW())`);
await pool.end();
console.log("Database seeded with Aviator catalog, shipping, coupons and promotion.");