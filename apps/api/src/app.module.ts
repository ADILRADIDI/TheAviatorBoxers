import { Body, Controller, Delete, Get, Module, Param, Patch, Post, Query } from "@nestjs/common";
import { createDatabase } from "@aviator/db";
import { eq, sql } from "drizzle-orm";
import { categories, coupons, orders, productVariants, products, promotions, reviews, shippingZones } from "@aviator/db";
import { healthResponse } from "./health.js";
import { createAdminToken } from "./admin-auth.js";

const { db } = createDatabase(process.env.DATABASE_URL);

@Controller()
class AppController {
  @Post("api/admin/login")
  adminLogin(@Body() body: { email?: string; password?: string }) {
    const email = process.env.ADMIN_EMAIL || "admin@theaviator.local";
    const password = process.env.ADMIN_PASSWORD || "change-me-admin";
    if (body.email !== email || body.password !== password) return { authenticated: false };
    return { authenticated: true, token: createAdminToken(email), name: "Administrateur The Aviator" };
  }
  @Get("health")
  health() {
    return healthResponse();
  }

  @Get("api/products")
  async productList() {
    const rows = await db.select().from(products).orderBy(products.createdAt);
    return rows.map((row) => ({ ...row, price: row.price / 100, compare_at_price: null, status: "active", color_name: row.colorName, sizes: row.sizes || ["S", "M", "L", "XL", "XXL"], featured: row.featured, images: row.images || [], category: "boxer" }));
  }

  @Get("api/products/:slug")
  async product(@Param("slug") slug: string) {
    const rows = await db.select().from(products).where(eq(products.slug, slug));
    const row = rows[0];
    return row ? { ...row, price: row.price / 100, status: "active", color_name: row.colorName, sizes: row.sizes || ["S", "M", "L", "XL", "XXL"], featured: row.featured, images: row.images || [], category: "boxer" } : null;
  }

  @Get("api/shipping-zones")
  async shipping(@Query("city") city?: string) {
    const rows = city ? await db.select().from(shippingZones).where(eq(shippingZones.city, city)) : await db.select().from(shippingZones);
    return rows.map((row) => ({ ...row, fee: row.fee / 100, free_threshold: row.freeThreshold ? row.freeThreshold / 100 : 0, delivery_time: row.deliveryTime }));
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
    return row;
  }

  @Get("api/coupons/:code")
  async coupon(@Param("code") code: string) {
    const rows = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase()));
    const row = rows[0];
    if (!row || !row.active || (row.expiresAt && row.expiresAt < new Date()) || (row.usageLimit !== null && row.usedCount >= row.usageLimit)) return { valid: false };
    return { valid: true, coupon: { ...row, min_cart: row.minCart / 100, discount_type: row.discountType, expires_at: row.expiresAt } };
  }

  @Post("api/orders")
  async createOrder(@Body() body: any) {
    const orderNumber = `AVT-${Date.now().toString(36).toUpperCase()}`;
    const row = await db.transaction(async (transaction) => {
      for (const item of body.items || []) {
        if (!item.product_id) continue;
        const updated = await transaction.update(products).set({ stock: sql`${products.stock} - ${Number(item.quantity || 0)}` }).where(sql`${products.id} = ${item.product_id} AND ${products.stock} >= ${Number(item.quantity || 0)}`).returning({ id: products.id });
        if (!updated.length) throw new Error("STOCK_UNAVAILABLE");
      }
      if (body.coupon_code) {
        const updatedCoupons = await transaction.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(sql`${coupons.code} = ${String(body.coupon_code).toUpperCase()} AND ${coupons.active} = true AND (${coupons.usageLimit} IS NULL OR ${coupons.usedCount} < ${coupons.usageLimit})`).returning({ id: coupons.id });
        if (!updatedCoupons.length) throw new Error("COUPON_UNAVAILABLE");
      }
      const [created] = await transaction.insert(orders).values({ orderNumber, firstName: body.first_name, lastName: body.last_name, phone: body.phone, email: body.email, city: body.city, address: body.address, neighborhood: body.neighborhood, notes: body.notes, items: body.items, subtotal: Math.round(body.subtotal * 100), shippingFee: Math.round(body.shipping_fee * 100), discount: Math.round((body.discount || 0) * 100), total: Math.round(body.total * 100), paymentMethod: "cod", couponCode: body.coupon_code, status: "nouvelle" }).returning();
      return created;
    });
    return { ...row, id: row.id, order_number: row.orderNumber, total: row.total / 100, subtotal: row.subtotal / 100, shipping_fee: row.shippingFee / 100, discount: row.discount / 100 };
  }

  @Get("api/orders/:orderNumber")
  async findOrder(@Param("orderNumber") orderNumber: string, @Query("phone") phone?: string) {
    const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    const row = rows[0];
    if (!row || !phone || row.phone.replace(/[\s-]/g, "") !== phone.replace(/[\s-]/g, "")) return null;
    return { ...row, order_number: row.orderNumber, total: row.total / 100, subtotal: row.subtotal / 100, shipping_fee: row.shippingFee / 100, discount: row.discount / 100 };
  }

  @Get("api/admin/orders")
  async adminOrders() {
    return db.select().from(orders).orderBy(orders.createdAt);
  }

  @Get("api/admin/products")
  async adminProducts() {
    const rows = await db.select().from(products).orderBy(products.createdAt);
    return rows.map((row) => ({ ...row, price: row.price / 100, color_name: row.colorName, sizes: row.sizes || [], images: row.images || [] }));
  }

  @Get("api/admin/customers")
  async adminCustomers() {
    const rows = await db.select().from(orders).orderBy(orders.createdAt);
    const customers = new Map<string, any>();
    for (const order of rows) {
      const key = order.phone.replace(/[\s-]/g, "");
      const current = customers.get(key) || { phone: order.phone, name: `${order.firstName} ${order.lastName}`.trim(), city: order.city, orders: 0, totalSpent: 0, lastOrder: order.createdAt };
      current.orders += 1;
      current.totalSpent += order.total;
      if (order.createdAt > current.lastOrder) current.lastOrder = order.createdAt;
      customers.set(key, current);
    }
    return [...customers.values()].map((customer) => ({ ...customer, totalSpent: customer.totalSpent / 100, averageOrder: customer.totalSpent / 100 / customer.orders }));
  }

  @Get("api/admin/categories")
  async adminCategories() { return db.select().from(categories).orderBy(categories.sortOrder); }

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
  async adminVariants(@Query("product_id") productId?: string) {
    const rows = productId ? await db.select().from(productVariants).where(eq(productVariants.productId, productId)) : await db.select().from(productVariants);
    return rows;
  }

  @Patch("api/admin/variants/:id")
  async updateVariant(@Param("id") id: string, @Body() body: any) {
    const [row] = await db.update(productVariants).set({ stock: Number(body.stock), price: Math.round(Number(body.price || 0) * 100), lowStockThreshold: Number(body.low_stock_threshold || 5), active: body.active !== false }).where(eq(productVariants.id, id)).returning();
    return row;
  }

  @Get("api/admin/dashboard")
  async dashboard() {
    const [allOrders, allProducts, pendingReviews] = await Promise.all([
      db.select().from(orders),
      db.select().from(products),
      db.select().from(reviews).where(eq(reviews.status, "pending")),
    ]);
    return {
      orders: allOrders.length,
      customers: new Set(allOrders.map((order) => order.phone)).size,
      revenue: allOrders.filter((order) => order.status !== "annulee").reduce((sum, order) => sum + order.total, 0) / 100,
      averageOrder: allOrders.length ? allOrders.reduce((sum, order) => sum + order.total, 0) / 100 / allOrders.length : 0,
      lowStock: allProducts.filter((product) => product.stock < 5).length,
      pendingReviews: pendingReviews.length,
    };
  }

  @Patch("api/admin/orders/:id")
  async updateOrder(@Param("id") id: string, @Body() body: { status: string }) {
    const [row] = await db.update(orders).set({ status: body.status }).where(eq(orders.id, id)).returning();
    return row;
  }

  @Delete("api/admin/orders/:id")
  async deleteOrder(@Param("id") id: string) { await db.delete(orders).where(eq(orders.id, id)); return { ok: true }; }

  @Post("api/admin/products")
  async createProduct(@Body() body: any) {
    const [row] = await db.insert(products).values({ name: body.name, slug: body.slug, price: Math.round(Number(body.price) * 100), stock: Number(body.stock || 0), images: body.images || [], colorName: body.color_name, sizes: body.sizes || ["S", "M", "L", "XL", "XXL"], featured: Boolean(body.featured) }).returning();
    return row;
  }

  @Patch("api/admin/products/:id")
  async updateProduct(@Param("id") id: string, @Body() body: any) {
    const [row] = await db.update(products).set({ name: body.name, price: Math.round(Number(body.price) * 100), stock: Number(body.stock || 0), images: body.images || [], colorName: body.color_name, sizes: body.sizes || ["S", "M", "L", "XL", "XXL"], featured: Boolean(body.featured) }).where(eq(products.id, id)).returning();
    return row;
  }

  @Get("api/admin/shipping-zones")
  async adminShippingZones() { return db.select().from(shippingZones).orderBy(shippingZones.city); }

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
    return { ok: true };
  }

  @Get("api/admin/coupons")
  async adminCoupons() {
    return db.select().from(coupons).orderBy(coupons.code);
  }

  @Post("api/admin/coupons")
  async createCoupon(@Body() body: any) {
    const [row] = await db.insert(coupons).values({ code: body.code.toUpperCase(), discountType: body.discount_type, value: Number(body.value), minCart: Number(body.min_cart || 0), usageLimit: body.usage_limit ? Number(body.usage_limit) : null, packOnly: Boolean(body.pack_only), active: true }).returning();
    return row;
  }

  @Patch("api/admin/coupons/:id")
  async updateCoupon(@Param("id") id: string, @Body() body: any) {
    const [row] = await db.update(coupons).set({ active: Boolean(body.active) }).where(eq(coupons.id, id)).returning();
    return row;
  }

  @Delete("api/admin/coupons/:id")
  async deleteCoupon(@Param("id") id: string) { await db.delete(coupons).where(eq(coupons.id, id)); return { ok: true }; }

  @Get("api/admin/promotions")
  async adminPromotions() {
    return db.select().from(promotions).orderBy(promotions.sortOrder);
  }

  @Patch("api/admin/promotions/:id")
  async updatePromotion(@Param("id") id: string, @Body() body: any) {
    const [row] = await db.update(promotions).set({ active: Boolean(body.active), titleFr: body.title_fr, titleDarija: body.title_darija, subtitleFr: body.subtitle_fr, subtitleDarija: body.subtitle_darija, backgroundColor: body.background_color, textColor: body.text_color, accentColor: body.accent_color, imageUrl: body.image_url, couponCode: body.coupon_code }).where(eq(promotions.id, id)).returning();
    return row;
  }

  @Post("api/admin/promotions")
  async createPromotion(@Body() body: any) { const [row] = await db.insert(promotions).values({ name: body.name, slug: body.slug, titleFr: body.title_fr, titleDarija: body.title_darija, subtitleFr: body.subtitle_fr, subtitleDarija: body.subtitle_darija, backgroundColor: body.background_color || "#00285E", textColor: body.text_color || "#FFFFFF", accentColor: body.accent_color || "#C7D400", imageUrl: body.image_url, couponCode: body.coupon_code, ctaLabelFr: body.cta_label_fr, ctaLabelDarija: body.cta_label_darija, ctaUrl: body.cta_url, active: body.active !== false }).returning(); return row; }

  @Delete("api/admin/promotions/:id")
  async deletePromotion(@Param("id") id: string) { await db.delete(promotions).where(eq(promotions.id, id)); return { ok: true }; }

  @Get("api/admin/reviews")
  async adminReviews() {
    return db.select().from(reviews).orderBy(reviews.createdAt);
  }

  @Patch("api/admin/reviews/:id")
  async moderateReview(@Param("id") id: string, @Body() body: { status: string }) {
    const [row] = await db.update(reviews).set({ status: body.status }).where(eq(reviews.id, id)).returning();
    return row;
  }

  @Delete("api/admin/reviews/:id")
  async deleteReview(@Param("id") id: string) { await db.delete(reviews).where(eq(reviews.id, id)); return { ok: true }; }
}

@Module({
  controllers: [AppController],
})
export class AppModule {}