import { createHmac, timingSafeEqual } from "node:crypto";

const secret = process.env.ADMIN_SECRET || "aviator-local-admin-secret-change-before-production";

export function createAdminToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isValidAdminToken(token: string) {
  try {
    const [payload, signature] = token.split(".");
    const expected = createHmac("sha256", secret).update(payload).digest("base64url");
    if (!payload || !signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}
