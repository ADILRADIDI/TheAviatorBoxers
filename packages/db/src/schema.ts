import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  price: integer("price_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  images: jsonb("images").notNull().default([]),
  colorName: text("color_name"),
  sizes: jsonb("sizes").notNull().default(["S", "M", "L", "XL", "XXL"]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  sku: text("sku").notNull().unique(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  price: integer("price_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const shippingZones = pgTable("shipping_zones", {
  id: uuid("id").defaultRandom().primaryKey(),
  city: text("city").notNull().unique(),
  region: text("region"),
  fee: integer("fee_cents").notNull().default(3500),
  freeThreshold: integer("free_threshold_cents"),
  deliveryTime: text("delivery_time").notNull().default("24-48h"),
  active: boolean("active").notNull().default(true),
});

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(),
  value: integer("value").notNull(),
  minCart: integer("min_cart_cents").notNull().default(0),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  packOnly: boolean("pack_only").notNull().default(false),
  active: boolean("active").notNull().default(true),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id),
  name: text("name").notNull(),
  city: text("city"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  status: text("status").notNull().default("pending"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const promotions = pgTable("promotions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  active: boolean("active").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  titleFr: text("title_fr").notNull(),
  titleDarija: text("title_darija"),
  subtitleFr: text("subtitle_fr"),
  subtitleDarija: text("subtitle_darija"),
  badgeFr: text("badge_fr"),
  badgeDarija: text("badge_darija"),
  imageUrl: text("image_url"),
  backgroundColor: text("background_color").notNull().default("#00285E"),
  textColor: text("text_color").notNull().default("#FFFFFF"),
  accentColor: text("accent_color").notNull().default("#C7D400"),
  couponCode: text("coupon_code"),
  ctaLabelFr: text("cta_label_fr"),
  ctaLabelDarija: text("cta_label_darija"),
  ctaUrl: text("cta_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city").notNull(),
  address: text("address").notNull(),
  neighborhood: text("neighborhood"),
  notes: text("notes"),
  items: jsonb("items").notNull(),
  subtotal: integer("subtotal_cents").notNull(),
  shippingFee: integer("shipping_fee_cents").notNull(),
  discount: integer("discount_cents").notNull().default(0),
  total: integer("total_cents").notNull(),
  paymentMethod: text("payment_method").notNull().default("cod"),
  couponCode: text("coupon_code"),
  status: text("status").notNull().default("nouvelle"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});