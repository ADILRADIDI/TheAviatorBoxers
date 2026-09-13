

import { adminSessions, adminUserRoles, adminUsers, auditLogs, categories, cmsPages, coupons, createDatabase, inventoryMovements, mediaAssets, notifications, orders, permissions, productVariants, products, promotions, returnRequests, reviews, rolePermissions, roles, shippingZones, siteSettings } from "@aviator/db";
import { createWriteStream, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";
import * as XLSX from "xlsx";
import { Body, Controller, Delete, Get, Module, Param, Patch, Post, Put, Query, Req, Res } from "@nestjs/common";
import { and, desc, eq, sql } from "drizzle-orm";
import { healthResponse } from "./health.js";
import { createSessionToken, hashPassword, hashSessionToken, verifyPassword } from "./admin-auth.js";
import { auditContext } from "./audit-context.js";
import { metricsText } from "./metrics.js";

const { db } = createDatabase(process.env.DATABASE_URL);
const mediaRoot = process.env.MEDIA_ROOT || join(process.cwd(), "storage", "media");
mkdirSync(mediaRoot, { recursive: true });
const DEFAULT_SITE_SETTINGS: Record<string, unknown> = {
  store_name: "THE AVIATOR",
  tagline: "Le confort, avec une autre dimension.",
  description: "Boxers premium pour hommes, conçus pour offrir confort, maintien et style au quotidien.",
  email: "contact@theaviatorboxer.com",
  phone: "06 91 57 31 92",
  whatsapp_number: "212691573192",
  address: "Casablanca, Maroc",
  instagram: "https://instagram.com/theaviatorboxer",
  facebook: "https://facebook.com/theaviatorboxer",
  tiktok: "",
  youtube: "",
  trust_items: [
    { title: "Tissus premium", subtitle: "95% coton / 5% Lycra" },
    { title: "Livraison 24-48h", subtitle: "Partout au Maroc" },
    { title: "Paiement à la livraison", subtitle: "Payez à réception" },
    { title: "Qualité contrôlée", subtitle: "Normes internationales" },
  ],
  footer_columns: [
    { title: "Boutique", links: [{ label: "Collection", to: "/collection" }, { label: "Composer un pack", to: "/packs" }, { label: "Guide des tailles", to: "/guide-des-tailles" }, { label: "Avis clients", to: "/avis" }] },
    { title: "Informations", links: [{ label: "À propos", to: "/a-propos" }, { label: "Qualité & certifications", to: "/qualite" }, { label: "Livraison & retours", to: "/livraison-retours" }, { label: "Paiement", to: "/paiement" }] },
    { title: "Aide", links: [{ label: "FAQ", to: "/faq" }, { label: "Contact", to: "/contact" }, { label: "Conditions générales", to: "/cgv" }, { label: "Confidentialité", to: "/confidentialite" }] },
  ],
};
const csvEscape = (value: unknown) => {
  const normalized = value !== null && typeof value === "object" ? JSON.stringify(value) : value;
  return `"${String(normalized ?? "").replaceAll('"', '""')}"`;
};

function listPage<T extends Record<string, any>>(rows: T[], query: { page?: string; limit?: string; search?: string; status?: string; city?: string; module?: string }) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const search = query.search?.trim().toLowerCase();
  const filtered = rows.filter((row) => (!search || JSON.stringify(row).toLowerCase().includes(search)) && (!query.status || row.status === query.status) && (!query.city || row.city === query.city) && (!query.module || row.module === query.module));
  return { data: filtered.slice((page - 1) * limit, page * limit), page, limit, total: filtered.length, pages: Math.max(1, Math.ceil(filtered.length / limit)) };
}

async function audit(action: string, entity: string, entityId: string, metadata: unknown = {}) {
  const context = auditContext.getStore();
  await db.insert(auditLogs).values({ actor: context?.actor || "system", actorUserId: context?.userId, action, entity, entityId, metadata, ipAddress: context?.ipAddress, userAgent: context?.userAgent, permission: context?.permission });
}

async function notify(type: string, title: string, message: string) {
  await db.insert(notifications).values({ type, title, message });
}

@Controller()
class AppController {
  @Post("api/admin/login")
  async adminLogin(@Body() body: { email?: string; password?: string }) {
    const [user] = body.email ? await db.select().from(adminUsers).where(eq(adminUsers.email, body.email.toLowerCase().trim())) : [];
    if (!user?.active || !body.password || !(await verifyPassword(body.password, user.passwordHash))) {
      await db.insert(auditLogs).values({ actor: body.email || "unknown", action: "admin.login.failed", entity: "admin_session", metadata: { email: body.email } });
      return { authenticated: false };
    }
    const token = createSessionToken();
    await db.insert(adminSessions).values({ userId: user.id, tokenHash: hashSessionToken(token), expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) });
    const assignments = await db.select().from(adminUserRoles).where(eq(adminUserRoles.userId, user.id));
    const roleIds = assignments.map((assignment) => assignment.roleId);
    const rolePermissionRows = roleIds.length ? await db.select().from(rolePermissions).where(sql`${rolePermissions.roleId} IN (${sql.join(roleIds.map((id) => sql`${id}`), sql`, `)})`) : [];
    const permissionIds = rolePermissionRows.map((assignment) => assignment.permissionId);
    const effectivePermissions = permissionIds.length ? await db.select({ key: permissions.key }).from(permissions).where(sql`${permissions.id} IN (${sql.join(permissionIds.map((id) => sql`${id}`), sql`, `)})`) : [];
    await db.insert(auditLogs).values({ actor: user.email, actorUserId: user.id, action: "admin.login.succeeded", entity: "admin_session", entityId: user.id, metadata: { permissions: effectivePermissions.length } });
    return { authenticated: true, token, name: user.name, user_id: user.id, permissions: effectivePermissions.map((permission) => permission.key) };
  }

  @Post("api/admin/logout")
  async adminLogout(@Body() body: { token?: string }) {
    if (body.token) await db.update(adminSessions).set({ revokedAt: new Date() }).where(eq(adminSessions.tokenHash, hashSessionToken(body.token)));
    await audit("admin.logout", "admin_session", "current");
    return { ok: true };
  }

  @Get("api/admin/roles")
  async adminRoles() {
    const roleRows = await db.select().from(roles).orderBy(roles.name);
    const permissionRows = await db.select().from(permissions).orderBy(permissions.module, permissions.key);
    const assignments = await db.select().from(rolePermissions);
    return roleRows.map((role) => ({ ...role, permissions: assignments.filter((item) => item.roleId === role.id).map((item) => permissionRows.find((permission) => permission.id === item.permissionId)).filter(Boolean), all_permissions: permissionRows }));
  }

  @Post("api/admin/roles")
  async createRole(@Body() body: { name: string; description?: string; permission_ids?: string[] }) {
    const [role] = await db.insert(roles).values({ name: body.name.trim().toUpperCase(), description: body.description }).returning();
    if (Array.isArray(body.permission_ids) && body.permission_ids.length) await db.insert(rolePermissions).values(body.permission_ids.map((permissionId) => ({ roleId: role.id, permissionId })));
    await audit("role.created", "role", role.id, { name: role.name });
    return role;
  }

  @Patch("api/admin/roles/:id")
  async updateRole(@Param("id") id: string, @Body() body: { name?: string; description?: string; permission_ids?: string[] }) {
    const [role] = await db.update(roles).set({ name: body.name?.trim().toUpperCase(), description: body.description }).where(eq(roles.id, id)).returning();
    if (Array.isArray(body.permission_ids)) {
      await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
      if (body.permission_ids.length) await db.insert(rolePermissions).values(body.permission_ids.map((permissionId) => ({ roleId: id, permissionId })));
    }
    await audit("role.updated", "role", id, { name: role?.name });
    return role;
  }

  @Delete("api/admin/roles/:id")
  async deleteRole(@Param("id") id: string) { await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id)); await db.delete(roles).where(eq(roles.id, id)); await audit("role.deleted", "role", id); return { ok: true }; }

  @Get("api/admin/permissions")
  async adminPermissions() { return db.select().from(permissions).orderBy(permissions.module, permissions.key); }

  @Get("api/admin/users")
  async adminUsersList() {
    const users = await db.select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name, active: adminUsers.active, createdAt: adminUsers.createdAt }).from(adminUsers).orderBy(adminUsers.email);
    const assignments = await db.select().from(adminUserRoles);
    const roleRows = await db.select().from(roles);
    return users.map((user) => ({ ...user, roles: assignments.filter((item) => item.userId === user.id).map((item) => roleRows.find((role) => role.id === item.roleId)).filter(Boolean) }));
  }

  @Post("api/admin/users")
  async createAdminUser(@Body() body: { email: string; name: string; password: string; role_id?: string }) {
    if (!body.email || !body.name || !body.password || body.password.length < 12) throw new Error("PASSWORD_TOO_SHORT");
    const [user] = await db.insert(adminUsers).values({ email: body.email.toLowerCase().trim(), name: body.name.trim(), passwordHash: await hashPassword(body.password) }).returning();
    if (body.role_id) await db.insert(adminUserRoles).values({ userId: user.id, roleId: body.role_id });
    await audit("admin_user.created", "admin_user", user.id, { email: user.email });
    return { ...user, passwordHash: undefined };
  }

  @Patch("api/admin/users/:id")
  async updateAdminUser(@Param("id") id: string, @Body() body: { name?: string; active?: boolean; password?: string; role_id?: string }) {
    const values: any = { name: body.name, active: body.active };
    if (body.password) { if (body.password.length < 12) throw new Error("PASSWORD_TOO_SHORT"); values.passwordHash = await hashPassword(body.password); }
    const [user] = await db.update(adminUsers).set(values).where(eq(adminUsers.id, id)).returning();
    if (body.role_id) { await db.delete(adminUserRoles).where(eq(adminUserRoles.userId, id)); await db.insert(adminUserRoles).values({ userId: id, roleId: body.role_id }); }
    await audit("admin_user.updated", "admin_user", id, { active: body.active, role_id: body.role_id });
    return { ...user, passwordHash: undefined };
  }

  @Delete("api/admin/users/:id")
  async deleteAdminUser(@Param("id") id: string) {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    const [superRole] = await db.select().from(roles).where(eq(roles.name, "SUPER_ADMIN"));
    const assignments = superRole ? await db.select().from(adminUserRoles).where(eq(adminUserRoles.roleId, superRole.id)) : [];
    if (superRole && assignments.length <= 1 && assignments.some((item) => item.userId === id)) throw new Error("LAST_SUPER_ADMIN");
    await db.delete(adminUserRoles).where(eq(adminUserRoles.userId, id)); await db.delete(adminSessions).where(eq(adminSessions.userId, id)); await db.delete(adminUsers).where(eq(adminUsers.id, id));
    await audit("admin_user.deleted", "admin_user", id, { email: user?.email });
    return { ok: true };
  }

  @Get("api/admin/roles/:id/users")
  async roleUsers(@Param("id") id: string) {
    const assignments = await db.select().from(adminUserRoles).where(eq(adminUserRoles.roleId, id));
    const users = await db.select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name, active: adminUsers.active }).from(adminUsers);
    return assignments.map((assignment) => users.find((user) => user.id === assignment.userId)).filter(Boolean);
  }
    @Get("api/pages/:slug")
    async publicPage(@Param("slug") slug: string) { const [page] = await db.select().from(cmsPages).where(sql`${cmsPages.slug} = ${slug} AND ${cmsPages.status} = 'published'`); return page || null; }

    @Get("api/admin/cms/pages")
    async cmsList(@Query() query: any) { return listPage(await db.select().from(cmsPages).orderBy(cmsPages.updatedAt), query); }

    @Post("api/admin/cms/pages")
    async cmsCreate(@Body() body: any) { const [page] = await db.insert(cmsPages).values({ slug: body.slug, titleFr: body.title_fr, titleDarija: body.title_darija, contentFr: body.content_fr || "", contentDarija: body.content_darija || "", status: body.status || "draft", seoTitle: body.seo_title, seoDescription: body.seo_description, canonicalUrl: body.canonical_url, mediaUrl: body.media_url, publishedAt: body.status === "published" ? new Date() : null }).returning(); await audit("cms.page.created", "cms_page", page.id, { slug: page.slug }); return page; }

    @Patch("api/admin/cms/pages/:id")
    async cmsUpdate(@Param("id") id: string, @Body() body: any) { const [page] = await db.update(cmsPages).set({ slug: body.slug, titleFr: body.title_fr, titleDarija: body.title_darija, contentFr: body.content_fr, contentDarija: body.content_darija, status: body.status, seoTitle: body.seo_title, seoDescription: body.seo_description, canonicalUrl: body.canonical_url, mediaUrl: body.media_url, publishedAt: body.status === "published" ? new Date() : null, updatedAt: new Date() }).where(eq(cmsPages.id, id)).returning(); await audit("cms.page.updated", "cms_page", id, { status: body.status }); return page; }

    @Delete("api/admin/cms/pages/:id")
    async cmsDelete(@Param("id") id: string) { await db.delete(cmsPages).where(eq(cmsPages.id, id)); await audit("cms.page.deleted", "cms_page", id); return { ok: true }; }

    @Get("api/admin/media")
    async mediaList(@Query() query: any) { return listPage(await db.select().from(mediaAssets).orderBy(mediaAssets.createdAt), query); }

    @Post("api/admin/media")
    async mediaUpload(@Req() request: any) {
      const part = await request.file();
      if (!part) throw new Error("MEDIA_FILE_REQUIRED");
      const allowed = new Map([["image/jpeg", ".jpg"], ["image/png", ".png"], ["image/webp", ".webp"], ["image/gif", ".gif"]]);
      const extension = allowed.get(part.mimetype);
      if (!extension) throw new Error("MEDIA_TYPE_NOT_ALLOWED");
      const filename = `${randomUUID()}${extension}`;
      const destination = join(mediaRoot, filename);
      await pipeline(part.file, createWriteStream(destination));
      const stat = await import("node:fs/promises").then((fs) => fs.stat(destination));
      if (stat.size > 5 * 1024 * 1024) { await import("node:fs/promises").then((fs) => fs.unlink(destination)); throw new Error("MEDIA_TOO_LARGE"); }
      const [asset] = await db.insert(mediaAssets).values({ filename, originalName: part.filename, mimeType: part.mimetype, sizeBytes: stat.size, url: `/media/${filename}` }).returning();
      await audit("media.uploaded", "media_asset", asset.id, { mimeType: part.mimetype, sizeBytes: stat.size });
      return asset;
    }

    @Delete("api/admin/media/:id")
    async mediaDelete(@Param("id") id: string) { const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)); if (asset) await import("node:fs/promises").then((fs) => fs.unlink(join(mediaRoot, asset.filename)).catch(() => undefined)); await db.delete(mediaAssets).where(eq(mediaAssets.id, id)); await audit("media.deleted", "media_asset", id); return { ok: true }; }

    @Get("media/:filename")
    async mediaFile(@Param("filename") filename: string, @Res() response: any) { if (!/^[a-f0-9-]+\.(jpg|png|webp|gif)$/.test(filename)) return response.status(404).send({ message: "Not found" }); const asset = (await db.select().from(mediaAssets).where(eq(mediaAssets.filename, filename)))[0]; if (!asset) return response.status(404).send({ message: "Not found" }); return response.type(asset.mimeType).send((await import("node:fs")).createReadStream(join(mediaRoot, filename))); }

    @Patch("api/admin/media/:id")
    async mediaUpdate(@Param("id") id: string, @Body() body: { alt_text?: string }) { const [asset] = await db.update(mediaAssets).set({ altText: body.alt_text }).where(eq(mediaAssets.id, id)).returning(); await audit("media.updated", "media_asset", id, { altText: body.alt_text }); return asset; }

    @Get("api/settings")
    async publicSettings() {
      const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "site"));
      return { ...DEFAULT_SITE_SETTINGS, ...((rows[0]?.value as Record<string, unknown>) || {}) };
    }

    @Get("api/admin/settings")
    async adminSettings() {
      const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "site"));
      return { ...DEFAULT_SITE_SETTINGS, ...((rows[0]?.value as Record<string, unknown>) || {}) };
    }

    @Put("api/admin/settings")
    async updateSettings(@Body() body: Record<string, unknown>) {
      const merged = { ...DEFAULT_SITE_SETTINGS, ...body };
      const [row] = await db.insert(siteSettings).values({ key: "site", value: merged, updatedAt: new Date() }).onConflictDoUpdate({ target: siteSettings.key, set: { value: merged, updatedAt: new Date() } }).returning();
      await audit("settings.updated", "site_settings", row.key, { fields: Object.keys(body) });
      return { ...DEFAULT_SITE_SETTINGS, ...(row.value as Record<string, unknown>) };
    }

  @Get("health")
  health() {
    return healthResponse();
  }
  
  @Get("ready")
  readiness() { return { status: "ready", service: "api" }; }
  
  @Get("metrics")
  metrics(@Res() response: any) { return response.type("text/plain").send(metricsText()); }

  @Get("api/products")
  async productList() {
    const rows = await db.select().from(products).orderBy(products.createdAt);
    const reviewStats = await db
      .select({ productId: reviews.productId, count: sql<number>`count(*)::int`, rating: sql<number>`round(avg(${reviews.rating})::numeric,1)` })
      .from(reviews)
      .where(eq(reviews.status, "approved"))
      .groupBy(reviews.productId);
    const statsMap = new Map(reviewStats.map((s) => [s.productId, s]));
    return rows.map((row) => { const stat = statsMap.get(row.id); return { ...row, price: row.price / 100, compare_at_price: null, status: "active", color_name: row.colorName, sizes: row.sizes || ["S", "M", "L", "XL", "XXL"], featured: row.featured, images: row.images || [], category: "boxer", category_id: row.categoryId, description: row.description || "", review_count: stat?.count ?? 0, rating: stat?.rating != null ? Number(stat.rating) : null }; });
  }

  @Get("api/products/:slug")
  async product(@Param("slug") slug: string) {
    const rows = await db.select().from(products).where(eq(products.slug, slug));
    const row = rows[0];
    let reviewCount = 0;
    let reviewRating: number | null = null;
    if (row) {
      const s = await db
        .select({ count: sql<number>`count(*)::int`, rating: sql<number>`round(avg(${reviews.rating})::numeric,1)` })
        .from(reviews)
        .where(and(eq(reviews.productId, row.id), eq(reviews.status, "approved")));
      const agg = s[0];
      reviewCount = agg?.count ?? 0;
      reviewRating = agg?.rating ?? null;
    }
    return row ? { ...row, price: row.price / 100, status: "active", color_name: row.colorName, sizes: row.sizes || ["S", "M", "L", "XL", "XXL"], featured: row.featured, images: row.images || [], category: "boxer", category_id: row.categoryId, description: row.description || "", review_count: reviewCount, rating: reviewRating != null ? Number(reviewRating) : null } : null;
  }

  @Get("api/shipping-zones")
  async shipping(@Query("city") city?: string) {
    const rows = city ? await db.select().from(shippingZones).where(eq(shippingZones.city, city)) : await db.select().from(shippingZones);
    return rows.map((row) => ({ ...row, fee: row.fee / 100, free_threshold: row.freeThreshold ? row.freeThreshold / 100 : 0, delivery_time: row.deliveryTime }));
  }

  @Get("robots.txt")
  robots(@Res() response: any) {
    const siteUrl = process.env.SITE_URL || "https://theaviatorboxer.com";
    return response.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout\nSitemap: ${siteUrl}/sitemap.xml\n`);
  }

  @Get("sitemap.xml")
  async sitemap(@Res() response: any) {
    const siteUrl = process.env.SITE_URL || "https://theaviatorboxer.com";
    const rows = await db.select().from(products);
    const staticPaths = ["/", "/collection", "/packs", "/a-propos", "/qualite", "/avis", "/contact", "/livraison-retours", "/guide-des-tailles", "/paiement", "/faq", "/cgv", "/confidentialite"];
    const productPaths = rows.map((row) => `/produit/${row.slug}`);
    const urls = [...staticPaths, ...productPaths];
    const xml = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">", ...urls.map((path) => `<url><loc>${siteUrl}${path}</loc><changefreq>weekly</changefreq></url>`), "</urlset>"].join("\n");
    return response.type("application/xml").send(xml);
  }

  @Get("api/promotions/active")
  async activePromotion() {
    const rows = await db.select().from(promotions).where(eq(promotions.active, true)).orderBy(promotions.sortOrder);
    const now = Date.now();
    return rows.find((row) => (!row.startsAt || row.startsAt.getTime() <= now) && (!row.endsAt || row.endsAt.getTime() >= now)) || null;
  }

  @Get("api/reviews")
  async reviewList(@Query("product_id") productId?: string) {
    const rows = productId ? await db.select().from(reviews).where(eq(reviews.productId, productId)) : await db.select().from(reviews);
    return rows.filter((row) => row.status === "approved").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  @Post("api/reviews")
  async createReview(@Body() body: { name: string; city?: string; rating: number; comment: string; product_id?: string }) {
    const [row] = await db.insert(reviews).values({ name: body.name, city: body.city, rating: body.rating, comment: body.comment, productId: body.product_id, status: "pending", verified: false }).returning();
    await notify("review.pending", "Nouvel avis à modérer", `${body.name} a envoyé un avis ${body.rating}/5.`);
    return row;
  }

  @Get("api/coupons/:code")
  async coupon(@Param("code") code: string, @Query("has_pack") hasPack?: string, @Query("product_ids") productIdsQuery?: string) {
    const rows = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase()));
    const row = rows[0];
    const requestedProductIds = productIdsQuery?.split(",").filter(Boolean) || [];
    const targetedProductIds = Array.isArray(row?.productIds) ? row.productIds.map(String) : [];
    if (!row || !row.active || (row.expiresAt && row.expiresAt < new Date()) || (row.usageLimit !== null && row.usedCount >= row.usageLimit) || (row.packOnly && hasPack !== "true") || (targetedProductIds.length > 0 && requestedProductIds.some((id) => !targetedProductIds.includes(id)))) return { valid: false, message: row?.packOnly ? "Ce code est réservé aux packs." : "Ce code ne s'applique pas à ces produits." };
    return { valid: true, coupon: { ...row, value: row.discountType === "fixed" ? row.value / 100 : row.value, min_cart: row.minCart / 100, max_discount: row.maxDiscount === null ? null : row.maxDiscount / 100, discount_type: row.discountType, pack_only: row.packOnly, product_ids: targetedProductIds, expires_at: row.expiresAt } };
  }

  @Post("api/orders")
  async createOrder(@Body() body: any) {
    const idempotencyKey = String(body.idempotency_key || "").trim();
    if (!idempotencyKey || idempotencyKey.length > 120) throw new Error("IDEMPOTENCY_KEY_REQUIRED");
    const existingRows = await db.select().from(orders).where(eq(orders.idempotencyKey, idempotencyKey));
    const existing = existingRows[0];
    if (existing) return { ...existing, id: existing.id, order_number: existing.orderNumber, total: existing.total / 100, subtotal: existing.subtotal / 100, shipping_fee: existing.shippingFee / 100, discount: existing.discount / 100 };
    const orderNumber = `AVT-${Date.now().toString(36).toUpperCase()}`;
    const row = await db.transaction(async (transaction) => {
      const requestedItems = Array.isArray(body.items) ? body.items : [];
      if (!requestedItems.length) throw new Error("EMPTY_ORDER");
      const resolvedItems: Array<Record<string, unknown>> = [];
      let subtotalCents = 0;
      let containsPack = false;
      for (const item of requestedItems) {
        const quantity = Number(item.quantity || 0);
        if (!item.product_id || !Number.isInteger(quantity) || quantity < 1) throw new Error("INVALID_ITEM");
        const [product] = await transaction.select().from(products).where(eq(products.id, item.product_id));
        if (!product) throw new Error("PRODUCT_UNAVAILABLE");
        const variantRows = item.size && item.color
          ? await transaction.select().from(productVariants).where(sql`${productVariants.productId} = ${item.product_id} AND ${productVariants.size} = ${item.size} AND ${productVariants.color} = ${item.color} AND ${productVariants.active} = true`)
          : [];
        if (variantRows.length) {
          const updatedVariant = await transaction.update(productVariants).set({ stock: sql`${productVariants.stock} - ${quantity}` }).where(sql`${productVariants.id} = ${variantRows[0].id} AND ${productVariants.stock} >= ${quantity}`).returning({ id: productVariants.id });
          if (!updatedVariant.length) throw new Error("VARIANT_STOCK_UNAVAILABLE");
        }
        const updated = await transaction.update(products).set({ stock: sql`${products.stock} - ${quantity}` }).where(sql`${products.id} = ${item.product_id} AND ${products.stock} >= ${quantity}`).returning({ id: products.id });
        if (!updated.length) throw new Error("STOCK_UNAVAILABLE");
        const lineTotal = product.price * quantity;
        subtotalCents += lineTotal;
        containsPack ||= product.slug.includes("pack") || product.name.toLowerCase().includes("pack");
        resolvedItems.push({ product_id: product.id, name: product.name, color: product.colorName, size: item.size, quantity, price: product.price / 100 });
      }

      const [zone] = body.city ? await transaction.select().from(shippingZones).where(eq(shippingZones.city, body.city)) : [];
      const discountCoupon = body.coupon_code ? String(body.coupon_code).trim().toUpperCase() : "";
      let discountCents = 0;
      let couponDiscountType = "";
      if (discountCoupon) {
        const [coupon] = await transaction.select().from(coupons).where(eq(coupons.code, discountCoupon));
        const targetedProductIds = Array.isArray(coupon?.productIds) ? coupon.productIds.map(String) : [];
        const orderProductIds = resolvedItems.map((item) => String(item.product_id));
        if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date()) || (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) || subtotalCents < coupon.minCart || (coupon.packOnly && !containsPack) || (targetedProductIds.length > 0 && orderProductIds.some((id) => !targetedProductIds.includes(id)))) throw new Error("COUPON_INVALID");
        couponDiscountType = coupon.discountType;
        if (coupon.discountType === "percentage") discountCents = Math.round((subtotalCents * coupon.value) / 100);
        if (coupon.discountType === "fixed") discountCents = coupon.value;
        if (coupon.maxDiscount !== null) discountCents = Math.min(discountCents, coupon.maxDiscount);
        discountCents = Math.min(Math.max(0, discountCents), subtotalCents);
        const updatedCoupons = await transaction.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(sql`${coupons.id} = ${coupon.id} AND ${coupons.active} = true AND (${coupons.usageLimit} IS NULL OR ${coupons.usedCount} < ${coupons.usageLimit})`).returning({ id: coupons.id });
        if (!updatedCoupons.length) throw new Error("COUPON_UNAVAILABLE");
      }
      const netSubtotalCents = subtotalCents - discountCents;
      const thresholdReached = zone?.freeThreshold !== null && zone?.freeThreshold !== undefined && netSubtotalCents >= zone.freeThreshold;
      const shippingCents = couponDiscountType === "free_shipping" || thresholdReached ? 0 : zone?.fee ?? 3500;
      const totalCents = Math.max(0, netSubtotalCents + shippingCents);
      const [created] = await transaction.insert(orders).values({ orderNumber, idempotencyKey, firstName: body.first_name, lastName: body.last_name || "", phone: body.phone, email: body.email, city: body.city, address: body.address, neighborhood: body.neighborhood, notes: body.notes, items: resolvedItems, subtotal: subtotalCents, shippingFee: shippingCents, discount: discountCents, total: totalCents, paymentMethod: "cod", couponCode: discountCoupon || null, status: "nouvelle" }).returning();
      await transaction.insert(notifications).values({ type: "order.created", title: "Nouvelle commande", message: `${created.orderNumber} · ${created.total / 100} DH` });
      return created;
    });
    return { ...row, id: row.id, order_number: row.orderNumber, total: row.total / 100, subtotal: row.subtotal / 100, shipping_fee: row.shippingFee / 100, discount: row.discount / 100 };
  }

  @Get("api/orders/:orderNumber")
  async findOrder(@Param("orderNumber") orderNumber: string, @Query("phone") phone?: string) {
    const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    const row = rows[0];
    if (!row?.phone || !phone || row.phone.replace(/[\s-]/g, "") !== phone.replace(/[\s-]/g, "")) return null;
    const returns = await db.select().from(returnRequests).where(eq(returnRequests.orderId, row.id));
    return { ...row, order_number: row.orderNumber, total: row.total / 100, subtotal: row.subtotal / 100, shipping_fee: row.shippingFee / 100, discount: row.discount / 100, return_request: returns[0] || null };
  }

  @Post("api/returns")
  async createReturn(@Body() body: { order_number: string; phone: string; reason: string; notes?: string }) {
    const found = await db.select().from(orders).where(eq(orders.orderNumber, body.order_number));
    const order = found[0];
    if (!order?.phone || order.phone.replace(/[\s-]/g, "") !== body.phone.replace(/[\s-]/g, "") || order.status !== "livree") return { accepted: false };
    const existing = await db.select().from(returnRequests).where(eq(returnRequests.orderId, order.id));
    if (existing[0]) return { accepted: false, duplicate: true, request: existing[0] };
    const [row] = await db.insert(returnRequests).values({ orderId: order.id, phone: body.phone, reason: body.reason, notes: body.notes }).returning();
    await notify("return.requested", "Nouvelle demande de retour", `Commande ${order.orderNumber} · ${body.reason}`);
    return { accepted: true, request: row };
  }

  @Get("api/admin/returns")
  async adminReturns(@Query() query: any) { return listPage(await db.select().from(returnRequests).orderBy(returnRequests.createdAt), query); }

  @Patch("api/admin/returns/:id")
  async updateReturn(@Param("id") id: string, @Body() body: { status: string }) {
    const row = await db.transaction(async (transaction) => {
      const [current] = await transaction.select().from(returnRequests).where(eq(returnRequests.id, id));
      if (!current) return undefined;
      if (body.status === "approved" && !current.stockRestored) {
        const [order] = await transaction.select().from(orders).where(eq(orders.id, current.orderId));
        if (order && Array.isArray(order.items)) for (const item of order.items) {
          const quantity = Number(item.quantity || 0);
          if (!item.product_id || !Number.isInteger(quantity) || quantity < 1) continue;
          await transaction.update(products).set({ stock: sql`${products.stock} + ${quantity}` }).where(eq(products.id, item.product_id));
          if (item.size && item.color) await transaction.update(productVariants).set({ stock: sql`${productVariants.stock} + ${quantity}` }).where(sql`${productVariants.productId} = ${item.product_id} AND ${productVariants.size} = ${item.size} AND ${productVariants.color} = ${item.color}`);
        }
      }
      const [updated] = await transaction.update(returnRequests).set({ status: body.status, stockRestored: current.stockRestored || body.status === "approved" }).where(eq(returnRequests.id, id)).returning();
      return updated;
    });
    if (row) { await audit("return.status.updated", "return_request", id, { status: body.status, stock_restored: row.stockRestored }); if (body.status === "approved") await notify("return.approved", "Retour accepté", `Demande ${id} acceptée et stock restauré.`); }
    return row;
  }

  @Delete("api/admin/returns/:id")
  async deleteReturn(@Param("id") id: string) { await db.delete(returnRequests).where(eq(returnRequests.id, id)); await audit("return.deleted", "return_request", id); return { ok: true }; }

  @Get("api/admin/orders")
  async adminOrders(@Query() query: any) {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return listPage(rows, query);
  }

  @Get("api/admin/audit-logs")
  async auditLogList(@Query() query: any) { return listPage(await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)), query); }

  @Get("api/admin/exports/orders.csv")
  async exportOrders() {
    const rows = await db.select().from(orders).orderBy(orders.createdAt);
    return {
      filename: "aviator-orders.csv",
      contentType: "text/csv; charset=utf-8",
      content: ["order_number,customer,phone,city,total,status,created_at", ...rows.map((row) => [row.orderNumber, `${row.firstName} ${row.lastName}`, row.phone, row.city, row.total / 100, row.status, row.createdAt.toISOString()].map(csvEscape).join(","))].join("\n"),
    };
  }

  @Get("api/admin/exports/products.csv")
  async exportProducts() { const rows = await db.select().from(products); return { filename: "aviator-products.csv", contentType: "text/csv; charset=utf-8", content: ["name,slug,price,stock,color", ...rows.map((row) => [row.name, row.slug, row.price / 100, row.stock, row.colorName].map(csvEscape).join(","))].join("\n") }; }

  @Get("api/admin/exports/customers.csv")
  async exportCustomers() { const rows = await db.select().from(orders); const grouped = new Map<string, any>(); for (const row of rows) { const key = row.phone.replace(/[\s-]/g, ""); const current = grouped.get(key) || { phone: row.phone, name: `${row.firstName} ${row.lastName}`.trim(), city: row.city, orders: 0, total: 0 }; current.orders += 1; current.total += row.total; grouped.set(key, current); } return { filename: "aviator-customers.csv", contentType: "text/csv; charset=utf-8", content: ["name,phone,city,orders,total", ...[...grouped.values()].map((row) => [row.name, row.phone, row.city, row.orders, row.total / 100].map(csvEscape).join(","))].join("\n") }; }

  @Get("api/admin/exports/inventory.csv")
  async exportInventory() { const rows = await db.select().from(productVariants); return { filename: "aviator-inventory.csv", contentType: "text/csv; charset=utf-8", content: ["sku,product_id,size,color,stock,low_stock_threshold,active", ...rows.map((row) => [row.sku, row.productId, row.size, row.color, row.stock, row.lowStockThreshold, row.active].map(csvEscape).join(","))].join("\n") }; }

  @Get("api/admin/exports/sales.csv")
  async exportSales(@Query() query: any) { const rows = (await db.select().from(orders)).filter((row) => (!query.status || row.status === query.status) && (!query.city || row.city === query.city) && (!query.from || row.createdAt >= new Date(query.from)) && (!query.to || row.createdAt <= new Date(query.to))); return { filename: "aviator-sales.csv", contentType: "text/csv; charset=utf-8", content: ["order_number,city,status,total,created_at", ...rows.map((row) => [row.orderNumber, row.city, row.status, row.total / 100, row.createdAt.toISOString()].map(csvEscape).join(","))].join("\n") }; }

  @Get("api/admin/exports/sales.xlsx")
  async exportSalesXlsx(@Query() query: any, @Res() response: any) { const rows = (await db.select().from(orders)).filter((row) => (!query.status || row.status === query.status) && (!query.city || row.city === query.city) && (!query.from || row.createdAt >= new Date(query.from)) && (!query.to || row.createdAt <= new Date(query.to))).map((row) => ({ order_number: row.orderNumber, city: row.city, status: row.status, total_mad: row.total / 100, created_at: row.createdAt.toISOString() })); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Sales"); const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }); return response.header("content-disposition", "attachment; filename=aviator-sales.xlsx").type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").send(buffer); }

  @Get("api/admin/notifications")
  async notificationList(@Query() query: any) { return listPage(await db.select().from(notifications).orderBy(desc(notifications.createdAt)), query); }

  @Get("api/admin/notifications/inbox")
  async notificationInbox() {
    const rows = await db.select().from(notifications).orderBy(desc(notifications.createdAt));
    return { count: rows.filter((row) => !row.read).length, items: rows.slice(0, 8) };
  }

  @Patch("api/admin/notifications/read-all")
  async markAllNotifications() { const rows = await db.update(notifications).set({ read: true }).returning(); return { ok: true, updated: rows.length }; }

  @Patch("api/admin/notifications/:id")
  async markNotification(@Param("id") id: string) { const [row] = await db.update(notifications).set({ read: true }).where(eq(notifications.id, id)).returning(); return row; }

  @Post("api/admin/notifications")
  async createNotification(@Body() body: { type?: string; title: string; message: string }) { const [row] = await db.insert(notifications).values({ type: body.type || "manual", title: body.title, message: body.message }).returning(); await audit("notification.created", "notification", row.id, { title: row.title }); return row; }

  @Delete("api/admin/notifications/:id")
  async deleteNotification(@Param("id") id: string) { await db.delete(notifications).where(eq(notifications.id, id)); return { ok: true }; }

  @Get("api/admin/products")
  async adminProducts(@Query("page") pageQuery = "1", @Query("limit") limitQuery = "20") {
    const page = Math.max(1, Number(pageQuery) || 1);
    const limit = Math.min(100, Math.max(1, Number(limitQuery) || 20));
    const rows = await db.select().from(products).orderBy(desc(products.createdAt));
    return { data: rows.slice((page - 1) * limit, page * limit).map((row) => ({ ...row, price: row.price / 100, color_name: row.colorName, sizes: row.sizes || [], images: row.images || [], category_id: row.categoryId, description: row.description || "" })), page, limit, total: rows.length, pages: Math.max(1, Math.ceil(rows.length / limit)) };
  }

  @Get("api/admin/customers")
  async adminCustomers(@Query() query: any) {
    const rows = await db.select().from(orders).orderBy(orders.createdAt);
    const customers = new Map<string, any>();
    for (const order of rows) {
      const key = order.phone.replace(/[\s-]/g, "");
      const current = customers.get(key) || { phone: order.phone, name: `${order.firstName} ${order.lastName}`.trim(), city: order.city, orders: 0, totalSpent: 0, lastOrder: order.createdAt };
      current.orders += 1;
      current.totalSpent += Number(order.total) || 0;
      if (order.createdAt > current.lastOrder) current.lastOrder = order.createdAt;
      customers.set(key, current);
    }
    return listPage([...customers.values()].map((customer) => ({ ...customer, totalSpent: customer.totalSpent / 100, averageOrder: customer.totalSpent / 100 / customer.orders })), query);
  }

  @Get("api/admin/categories")
  async adminCategories(@Query() query: any) { return listPage(await db.select().from(categories).orderBy(categories.sortOrder), query); }

  @Post("api/admin/categories")
  async createCategory(@Body() body: { name: string; slug: string; description?: string }) {
    const [row] = await db.insert(categories).values(body).returning();
    return row;
  }

  @Patch("api/admin/categories/:id")
  async updateCategory(@Param("id") id: string, @Body() body: { name?: string; description?: string; active?: boolean }) {
    const [row] = await db.update(categories).set(body).where(eq(categories.id, id)).returning();
    return row;
  }

  @Delete("api/admin/categories/:id")
  async deleteCategory(@Param("id") id: string) { await db.delete(categories).where(eq(categories.id, id)); return { ok: true }; }

  @Get("api/admin/variants")
  async adminVariants(@Query() query: any) {
    const rows = query.product_id ? await db.select().from(productVariants).where(eq(productVariants.productId, query.product_id)) : await db.select().from(productVariants);
    return listPage(rows, query);
  }

  @Get("api/admin/inventory")
  async inventory(@Query() query: any) { const rows = await db.select().from(productVariants); return listPage(rows, query); }

  @Get("api/admin/inventory/movements")
  async inventoryMovementsList(@Query() query: any) { return listPage(await db.select().from(inventoryMovements).orderBy(inventoryMovements.createdAt), query); }

  @Patch("api/admin/inventory/:id")
  async adjustInventory(@Param("id") id: string, @Body() body: { stock: number; reason: string; note?: string }) {
    if (!body.reason?.trim() || !Number.isInteger(Number(body.stock)) || Number(body.stock) < 0) throw new Error("INVALID_STOCK_ADJUSTMENT");
    const updated = await db.transaction(async (transaction) => {
      const [variant] = await transaction.select().from(productVariants).where(eq(productVariants.id, id));
      if (!variant) return undefined;
      const before = variant.stock; const after = Number(body.stock); const delta = after - before;
      const [saved] = await transaction.update(productVariants).set({ stock: after }).where(eq(productVariants.id, id)).returning();
      const context = auditContext.getStore();
      await transaction.insert(inventoryMovements).values({ variantId: id, type: delta >= 0 ? "increase" : "decrease", quantity: delta, beforeStock: before, afterStock: after, reason: body.reason.trim(), note: body.note, actorUserId: context?.userId });
      return saved;
    });
    if (updated) await audit("inventory.adjusted", "product_variant", id, { stock: updated.stock, reason: body.reason });
    return updated;
  }

  @Patch("api/admin/variants/:id")
  async updateVariant(@Param("id") id: string, @Body() body: any) {
    const [row] = await db.update(productVariants).set({ stock: Number(body.stock), price: Math.round(Number(body.price || 0) * 100), lowStockThreshold: Number(body.low_stock_threshold || 5), active: body.active !== false }).where(eq(productVariants.id, id)).returning();
    return row;
  }

  @Post("api/admin/variants")
  async createVariant(@Body() body: { product_id: string; sku: string; size: string; color: string; price: number; stock?: number; low_stock_threshold?: number }) {
    if (!body.product_id || !body.sku || !body.size || !body.color) throw new Error("VARIANT_FIELDS_REQUIRED");
    const [row] = await db.insert(productVariants).values({ productId: body.product_id, sku: body.sku.toUpperCase(), size: body.size, color: body.color, price: Math.round(Number(body.price || 0) * 100), stock: Number(body.stock || 0), lowStockThreshold: Number(body.low_stock_threshold || 5), active: true }).returning();
    await audit("variant.created", "product_variant", row.id, { sku: row.sku });
    return row;
  }

  @Delete("api/admin/variants/:id")
  async deleteVariant(@Param("id") id: string) { await db.delete(productVariants).where(eq(productVariants.id, id)); await audit("variant.deleted", "product_variant", id); return { ok: true }; }

  @Get("api/admin/dashboard")
  async dashboard(@Query("period") period = "all") {
    let allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allProducts = await db.select().from(products);
    const pendingReviews = await db.select().from(reviews).where(eq(reviews.status, "pending"));

    if (period === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      allOrders = allOrders.filter((o) => new Date(o.createdAt) >= startOfDay);
    } else if (period === "7d") {
      const past7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      allOrders = allOrders.filter((o) => new Date(o.createdAt) >= past7d);
    } else if (period === "30d") {
      const past30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      allOrders = allOrders.filter((o) => new Date(o.createdAt) >= past30d);
    }

    const nonCancelled = allOrders.filter((order) => order.status !== "annulee");
    const revenue = nonCancelled.reduce((sum, order) => sum + (Number(order.total) || 0), 0) / 100;
    const averageOrder = nonCancelled.length ? revenue / nonCancelled.length : 0;

    const statusCounts = allOrders.reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const topProductsMap = new Map<string, { product_id: string; name: string; quantity: number; revenue: number }>();
    for (const order of nonCancelled) {
      if (!Array.isArray(order.items)) continue;
      for (const item of order.items) {
        const productId = String(item.product_id ?? item.productId ?? "?");
        const quantity = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const current = topProductsMap.get(productId) || { product_id: productId, name: String(item.name || "Produit"), quantity: 0, revenue: 0 };
        current.quantity += quantity;
        current.revenue += quantity * price;
        topProductsMap.set(productId, current);
      }
    }
    const topProducts = [...topProductsMap.values()]
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 5);

    return {
      orders: allOrders.length,
      customers: new Set(allOrders.map((order) => order.phone)).size,
      revenue,
      averageOrder: Math.round(averageOrder * 100) / 100,
      lowStock: allProducts.filter((product) => product.stock < 5).length,
      pendingReviews: pendingReviews.length,
      statusCounts,
      topProducts,
      period,
    };
  }

  @Patch("api/admin/orders/:id")
  async updateOrder(@Param("id") id: string, @Body() body: { status: string }) {
    let wasCancelled = false;
    const row = await db.transaction(async (transaction) => {
      const [current] = await transaction.select().from(orders).where(eq(orders.id, id));
      if (!current) return undefined;
      wasCancelled = current.status === "annulee";
      const shouldRestore = body.status === "annulee" && current.status !== "annulee" && !current.stockRestored;
      if (shouldRestore && Array.isArray(current.items)) {
        for (const item of current.items) {
          const quantity = Number(item.quantity || 0);
          if (!item.product_id || !Number.isInteger(quantity) || quantity < 1) continue;
          await transaction.update(products).set({ stock: sql`${products.stock} + ${quantity}` }).where(eq(products.id, item.product_id));
          if (item.size && item.color) {
            await transaction.update(productVariants).set({ stock: sql`${productVariants.stock} + ${quantity}` }).where(sql`${productVariants.productId} = ${item.product_id} AND ${productVariants.size} = ${item.size} AND ${productVariants.color} = ${item.color}`);
          }
        }
      }
      const [updated] = await transaction.update(orders).set({ status: body.status, stockRestored: current.stockRestored || shouldRestore }).where(eq(orders.id, id)).returning();
      return updated;
    });
    if (!row) return null;
    if (body.status === "annulee" && !wasCancelled) await notify("order.cancelled", "Commande annulée", `${row.orderNumber} a été annulée.`);
    await audit("order.status.updated", "order", id, { status: body.status });
    return row;
  }

  @Delete("api/admin/orders/:id")
  async deleteOrder(@Param("id") id: string) { await db.delete(orders).where(eq(orders.id, id)); await audit("order.deleted", "order", id); return { ok: true }; }

  @Post("api/admin/products")
  async createProduct(@Body() body: any) {
    const [row] = await db.insert(products).values({
      name: body.name,
      slug: body.slug,
      price: Math.round(Number(body.price) * 100),
      stock: Number(body.stock || 0),
      images: body.images || [],
      colorName: body.color_name,
      sizes: body.sizes || ["S", "M", "L", "XL", "XXL"],
      featured: Boolean(body.featured),
      description: body.description || null,
      categoryId: body.category_id || null,
    }).returning();
    await audit("product.created", "product", row.id, { name: row.name });
    return row;
  }

  @Patch("api/admin/products/:id")
  async updateProduct(@Param("id") id: string, @Body() body: any) {
    const updateData: any = {
      name: body.name,
      price: Math.round(Number(body.price) * 100),
      stock: Number(body.stock || 0),
      images: body.images || [],
      colorName: body.color_name,
      sizes: body.sizes || ["S", "M", "L", "XL", "XXL"],
      featured: Boolean(body.featured),
    };
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.category_id !== undefined) updateData.categoryId = body.category_id || null;

    const [row] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    await audit("product.updated", "product", id, { name: row?.name });
    return row;
  }

  @Get("api/admin/shipping-zones")
  async adminShippingZones(@Query() query: any) { return listPage(await db.select().from(shippingZones).orderBy(shippingZones.city), query); }

  @Patch("api/admin/shipping-zones/:id")
  async updateShippingZone(@Param("id") id: string, @Body() body: any) {
    const [row] = await db.update(shippingZones).set({ fee: Math.round(Number(body.fee || 0) * 100), freeThreshold: Math.round(Number(body.free_threshold || 0) * 100), deliveryTime: body.delivery_time, active: Boolean(body.active) }).where(eq(shippingZones.id, id)).returning();
    return row;
  }

  @Post("api/admin/shipping-zones")
  async createShippingZone(@Body() body: any) { const [row] = await db.insert(shippingZones).values({ city: body.city, region: body.region, fee: Math.round(Number(body.fee || 0) * 100), freeThreshold: Math.round(Number(body.free_threshold || 0) * 100), deliveryTime: body.delivery_time || "24-48h", active: body.active !== false }).returning(); return row; }

  @Delete("api/admin/shipping-zones/:id")
  async deleteShippingZone(@Param("id") id: string) { await db.delete(shippingZones).where(eq(shippingZones.id, id)); return { ok: true }; }

  @Delete("api/admin/products/:id")
  async deleteProduct(@Param("id") id: string) {
    await db.delete(products).where(eq(products.id, id));
    await audit("product.deleted", "product", id);
    return { ok: true };
  }

  @Get("api/admin/coupons")
  async adminCoupons(@Query() query: any) {
    return listPage(await db.select().from(coupons).orderBy(coupons.code), query);
  }

  @Post("api/admin/coupons")
  async createCoupon(@Body() body: any) {
    const isFixed = body.discount_type === "fixed";
    const [row] = await db.insert(coupons).values({
      code: body.code.toUpperCase(),
      discountType: body.discount_type,
      value: isFixed ? Math.round(Number(body.value) * 100) : Number(body.value),
      maxDiscount: body.max_discount ? Math.round(Number(body.max_discount) * 100) : null,
      minCart: Math.round(Number(body.min_cart || 0) * 100),
      usageLimit: body.usage_limit ? Number(body.usage_limit) : null,
      packOnly: Boolean(body.pack_only),
      productIds: Array.isArray(body.product_ids) ? body.product_ids : [],
      expiresAt: body.expires_at ? new Date(body.expires_at) : null,
      active: body.active !== false,
    }).returning();
    return row;
  }

  @Patch("api/admin/coupons/:id")
  async updateCoupon(@Param("id") id: string, @Body() body: any) {
    const isFixed = body.discount_type === "fixed";
    const [row] = await db.update(coupons).set({
      code: body.code?.toUpperCase(),
      discountType: body.discount_type,
      value: body.value !== undefined ? (isFixed ? Math.round(Number(body.value) * 100) : Number(body.value)) : undefined,
      maxDiscount: body.max_discount ? Math.round(Number(body.max_discount) * 100) : null,
      minCart: body.min_cart !== undefined ? Math.round(Number(body.min_cart) * 100) : undefined,
      usageLimit: body.usage_limit !== undefined ? (body.usage_limit ? Number(body.usage_limit) : null) : undefined,
      packOnly: body.pack_only !== undefined ? Boolean(body.pack_only) : undefined,
      productIds: body.product_ids !== undefined ? body.product_ids : undefined,
      expiresAt: body.expires_at !== undefined ? (body.expires_at ? new Date(body.expires_at) : null) : undefined,
      active: body.active !== undefined ? Boolean(body.active) : undefined,
    }).where(eq(coupons.id, id)).returning();
    await audit("coupon.updated", "coupon", id, { code: row?.code });
    return row;
  }

  @Delete("api/admin/coupons/:id")
  async deleteCoupon(@Param("id") id: string) { await db.delete(coupons).where(eq(coupons.id, id)); return { ok: true }; }

  @Get("api/admin/promotions")
  async adminPromotions(@Query() query: any) {
    return listPage(await db.select().from(promotions).orderBy(promotions.sortOrder), query);
  }

  @Patch("api/admin/promotions/:id")
  async updatePromotion(@Param("id") id: string, @Body() body: any) {
    const [row] = await db.update(promotions).set({ active: Boolean(body.active), titleFr: body.title_fr, titleDarija: body.title_darija, subtitleFr: body.subtitle_fr, subtitleDarija: body.subtitle_darija, backgroundColor: body.background_color, textColor: body.text_color, accentColor: body.accent_color, imageUrl: body.image_url, couponCode: body.coupon_code }).where(eq(promotions.id, id)).returning();
    await audit("promotion.updated", "promotion", id, { active: body.active });
    return row;
  }

  @Post("api/admin/promotions")
  async createPromotion(@Body() body: any) { const [row] = await db.insert(promotions).values({ name: body.name, slug: body.slug, titleFr: body.title_fr, titleDarija: body.title_darija, subtitleFr: body.subtitle_fr, subtitleDarija: body.subtitle_darija, backgroundColor: body.background_color || "#00285E", textColor: body.text_color || "#FFFFFF", accentColor: body.accent_color || "#C7D400", imageUrl: body.image_url, couponCode: body.coupon_code, ctaLabelFr: body.cta_label_fr, ctaLabelDarija: body.cta_label_darija, ctaUrl: body.cta_url, active: body.active !== false }).returning(); return row; }

  @Delete("api/admin/promotions/:id")
  async deletePromotion(@Param("id") id: string) { await db.delete(promotions).where(eq(promotions.id, id)); return { ok: true }; }

  @Get("api/admin/reviews")
  async adminReviews(@Query() query: any) {
    const rows = await db
      .select({ review: reviews, productName: products.name })
      .from(reviews)
      .leftJoin(products, eq(products.id, reviews.productId))
      .orderBy(reviews.createdAt);
    const mappedRows = rows.map((r) => ({ ...r.review, product_name: r.productName ?? "" }));
    return listPage(query.product_id ? mappedRows.filter((r) => r.productId === query.product_id) : mappedRows, query);
  }

  @Patch("api/admin/reviews/:id")
  async moderateReview(@Param("id") id: string, @Body() body: { status: string }) {
    const [row] = await db.update(reviews).set({ status: body.status }).where(eq(reviews.id, id)).returning();
    await audit("review.moderated", "review", id, { status: body.status });
    return row;
  }

  @Post("api/admin/reviews")
  async createReviewAdmin(@Body() body: { name: string; city?: string; rating: number; comment: string; product_id?: string; status?: string }) {
    const status = body.status || "approved";
    const [row] = await db.insert(reviews).values({ name: body.name, city: body.city, rating: Math.max(1, Math.min(5, Number(body.rating) || 5)), comment: body.comment, productId: body.product_id, status, verified: status === "approved" }).returning();
    await audit("review.created", "review", row.id, { rating: row.rating, status });
    return row;
  }

  @Delete("api/admin/reviews/:id")
  async deleteReview(@Param("id") id: string) { await db.delete(reviews).where(eq(reviews.id, id)); return { ok: true }; }
}

@Module({
  controllers: [AppController],
})
export class AppModule {}