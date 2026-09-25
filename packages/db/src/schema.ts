import { boolean, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roles = pgTable("admin_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const permissions = pgTable("admin_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  module: text("module").notNull(),
  label: text("label").notNull(),
});

export const rolePermissions = pgTable("admin_role_permissions", {
  roleId: uuid("role_id").notNull().references(() => roles.id),
  permissionId: uuid("permission_id").notNull().references(() => permissions.id),
}, (table) => ({ pk: primaryKey({ columns: [table.roleId, table.permissionId] }) }));

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminUserRoles = pgTable("admin_user_roles", {
  userId: uuid("user_id").notNull().references(() => adminUsers.id),
  roleId: uuid("role_id").notNull().references(() => roles.id),
}, (table) => ({ pk: primaryKey({ columns: [table.userId, table.roleId] }) }));

export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => adminUsers.id),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id),
  price: integer("price_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  images: jsonb("images").notNull().default([]),
  colorName: text("color_name"),
  sizes: jsonb("sizes").notNull().default(["M", "L", "XL", "XXL"]),
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

export const colors = pgTable("colors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  hex: text("hex").notNull(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull(),
  beforeStock: integer("before_stock").notNull(),
  afterStock: integer("after_stock").notNull(),
  reason: text("reason").notNull(),
  note: text("note"),
  actorUserId: uuid("actor_user_id").references(() => adminUsers.id),
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
  maxDiscount: integer("max_discount_cents"),
  minCart: integer("min_cart_cents").notNull().default(0),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  packOnly: boolean("pack_only").notNull().default(false),
  productIds: jsonb("product_ids").notNull().default([]),
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
  tissu: integer("tissu"),
  service: integer("service"),
  livraison: integer("livraison"),
  qualite: integer("qualite"),
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
  idempotencyKey: text("idempotency_key").notNull().unique(),
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
  stockRestored: boolean("stock_restored").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actor: text("actor").notNull(),
  actorUserId: uuid("actor_user_id").references(() => adminUsers.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  permission: text("permission"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const returnRequests = pgTable("return_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  phone: text("phone").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("requested"),
  stockRestored: boolean("stock_restored").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cmsPages = pgTable("cms_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  titleFr: text("title_fr").notNull(),
  titleDarija: text("title_darija"),
  contentFr: text("content_fr").notNull().default(""),
  contentDarija: text("content_darija").notNull().default(""),
  status: text("status").notNull().default("draft"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  canonicalUrl: text("canonical_url"),
  mediaUrl: text("media_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: text("filename").notNull().unique(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});