import "reflect-metadata";
import { randomUUID } from "node:crypto";
import { NestFactory } from "@nestjs/core";
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


const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({ logger: process.env.NODE_ENV !== "test" }),
);
await app.register((await import("@fastify/multipart")).default, { limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

app.enableCors({ origin: true, credentials: true, allowedHeaders: ["Content-Type", "x-admin-token"], methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] });
  metrics.requests += 1;
app.use(async (request: any, response: any, next: () => void) => {
  const requestId = request.headers["x-request-id"] || randomUUID();
  response.header("x-request-id", requestId);
  const startedAt = Date.now();
  response.raw?.once?.("finish", () => { if (response.statusCode >= 500) metrics.errors += 1; console.log(JSON.stringify({ type: "http.request", request_id: requestId, method: request.method, path: request.url.split("?")[0], status: response.statusCode, duration_ms: Date.now() - startedAt, user_id: request.admin?.userId || null })); });
  if (request.method === "OPTIONS") {
    next();
    return;
  }
  if (request.url.startsWith("/api/admin") && request.url !== "/api/admin/login") {
    const token = request.headers["x-admin-token"] || "";
    const [session] = await db.select().from(adminSessions).where(eq(adminSessions.tokenHash, hashSessionToken(token)));
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