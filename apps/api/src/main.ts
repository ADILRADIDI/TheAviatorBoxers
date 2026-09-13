

import "reflect-metadata";
import { randomUUID } from "node:crypto";
import { NestFactory } from "@nestjs/core";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module.js";
import { adminSessions, adminUserRoles, adminUsers, createDatabase, permissions, rolePermissions } from "@aviator/db";
import { eq, sql } from "drizzle-orm";
import { hashSessionToken } from "./admin-auth.js";
import { auditContext } from "./audit-context.js";
import { canAccess, permissionFor } from "./authorization.js";
import { metrics } from "./metrics.js";

const port = Number(process.env.API_PORT || 3001);
const { db } = createDatabase(process.env.DATABASE_URL);

const DOMAIN_ERRORS = new Set([
  "EMPTY_ORDER",
  "INVALID_ITEM",
  "PRODUCT_UNAVAILABLE",
  "STOCK_UNAVAILABLE",
  "VARIANT_STOCK_UNAVAILABLE",
  "COUPON_INVALID",
  "COUPON_UNAVAILABLE",
  "IDEMPOTENCY_KEY_REQUIRED",
]);

@Catch()
class DomainErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const message = exception instanceof Error ? exception.message : "Erreur interne";
    const status = DOMAIN_ERRORS.has(message) ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = { message, statusCode: status };
    if (typeof response.status === "function" && typeof response.send === "function") {
      response.status(status).send(payload);
    } else {
      response.writeHead(status, { "content-type": "application/json" });
      response.end(JSON.stringify(payload));
    }
  }
}

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({ logger: process.env.NODE_ENV !== "test" }),
);
await app.register((await import("@fastify/multipart")).default, { limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

app.enableCors({ origin: true, credentials: true, allowedHeaders: ["Content-Type", "x-admin-token"], methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] });

app.useGlobalFilters(new DomainErrorFilter());

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 600;
function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }
  if (entry.count >= LOGIN_MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

app.use(async (request: any, response: any, next: () => void) => {
  if (typeof response.setHeader === "function") {
    response.setHeader("x-content-type-options", "nosniff");
    response.setHeader("x-frame-options", "SAMEORIGIN");
    response.setHeader("referrer-policy", "strict-origin-when-cross-origin");
    response.setHeader("permissions-policy", "geolocation=(), microphone=(), camera=()");
  }
  if (request.method === "POST" && request.url.startsWith("/api/admin/login")) {
    const ip = request.ip || request.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || "unknown";
    if (!checkLoginRateLimit(ip)) {
      response.writeHead(429, { "content-type": "application/json" });
      response.end(JSON.stringify({ message: "Trop de tentatives de connexion. Réessayez dans 15 minutes." }));
      return;
    }
  }
  metrics.requests += 1;
  const requestId = request.headers["x-request-id"] || randomUUID();
  if (typeof response.setHeader === "function") {
    response.setHeader("x-request-id", requestId);
  }
  const startedAt = Date.now();
  const resStream = response.raw || response;
  if (typeof resStream.once === "function") {
    resStream.once("finish", () => { if (response.statusCode >= 500) metrics.errors += 1; console.log(JSON.stringify({ type: "http.request", request_id: requestId, method: request.method, path: request.url.split("?")[0], status: response.statusCode, duration_ms: Date.now() - startedAt, user_id: request.admin?.userId || null })); });
  }
  if (request.method === "OPTIONS") {
    next();
    return;
  }
  if (request.url.startsWith("/api/admin") && request.url !== "/api/admin/login") {
    const token = request.headers["x-admin-token"] || "";
    const [session] = token ? await db.select().from(adminSessions).where(eq(adminSessions.tokenHash, hashSessionToken(token))) : [];
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ message: "Authentification admin requise" }));
      return;
    }
    const userRoles = await db.select({ roleId: adminUserRoles.roleId }).from(adminUserRoles).where(eq(adminUserRoles.userId, session.userId));
    const roleIds = userRoles.map((item) => item.roleId);
    const rolePermissionRows = roleIds.length ? await db.select({ permissionId: rolePermissions.permissionId }).from(rolePermissions).where(sqlIn(rolePermissions.roleId, roleIds)) : [];
    const permissionIds = rolePermissionRows.map((item) => item.permissionId);
    const required = permissionFor(request.url, request.method);
    const granted = permissionIds.length ? await db.select({ key: permissions.key }).from(permissions).where(sqlIn(permissions.id, permissionIds)) : [];
    if (!canAccess(granted.map((permission) => permission.key), required)) {
      response.writeHead(403, { "content-type": "application/json" });
      response.end(JSON.stringify({ message: "Permission insuffisante", permission: required }));
      return;
    }
    const [admin] = await db.select({ email: adminUsers.email }).from(adminUsers).where(eq(adminUsers.id, session.userId));
    request.admin = { userId: session.userId, permission: required };
    return auditContext.run({ userId: session.userId, actor: admin?.email || session.userId, permission: required, ipAddress: request.ip || request.headers["x-forwarded-for"]?.split(",")[0], userAgent: request.headers["user-agent"] }, next);
  }
  next();
});

function sqlIn(column: any, values: string[]) {
  return values.length === 1 ? eq(column, values[0]) : sql`${column} IN (${sql.join(values.map((value) => sql`${value}`), sql`, `)})`;
}
await app.listen({ host: "0.0.0.0", port });

console.log(`Aviator API listening on port ${port}`);