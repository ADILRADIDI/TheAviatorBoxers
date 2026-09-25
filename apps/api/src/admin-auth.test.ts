import { beforeAll, describe, expect, it } from "vitest";
import { createAdminToken, hashPassword, isValidAdminToken, verifyPassword } from "./admin-auth.js";

describe("admin authentication", () => {
  beforeAll(() => { process.env.ADMIN_SECRET = "test-admin-secret"; });
  it("creates a token accepted by the API verifier", () => {
    const token = createAdminToken("admin@theaviator.local");
    expect(isValidAdminToken(token)).toBe(true);
  });

  it("rejects tampered tokens", () => {
    const token = createAdminToken("admin@theaviator.local");
    expect(isValidAdminToken(`${token}tampered`)).toBe(false);
    expect(isValidAdminToken("invalid-token")).toBe(false);
  });

  it("hashes passwords and rejects the wrong password", async () => {
    const encoded = await hashPassword("secret-password");
    expect(encoded.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("secret-password", encoded)).toBe(true);
    expect(await verifyPassword("wrong-password", encoded)).toBe(false);
  });
});
