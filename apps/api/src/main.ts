import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module.js";
import { isValidAdminToken } from "./admin-auth.js";

const port = Number(process.env.API_PORT || 3001);

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({ logger: process.env.NODE_ENV !== "test" }),
);

app.enableCors({ origin: true, credentials: true, allowedHeaders: ["Content-Type", "x-admin-token"], methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] });
app.use((request: any, response: any, next: () => void) => {
  if (request.method === "OPTIONS") {
    next();
    return;
  }
  if (request.url.startsWith("/api/admin") && request.url !== "/api/admin/login") {
    if (!isValidAdminToken(request.headers["x-admin-token"] || "")) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ message: "Authentification admin requise" }));
      return;
    }
  }
  next();
});
await app.listen({ host: "0.0.0.0", port });

console.log(`Aviator API listening on port ${port}`);