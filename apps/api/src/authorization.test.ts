import { describe, expect, it } from "vitest";
import { canAccess, permissionFor } from "./authorization.js";

describe("admin authorization policy", () => {
  it.each([
    ["GET", "/api/admin/products", "products.view"],
    ["POST", "/api/admin/products", "products.create"],
    ["DELETE", "/api/admin/products/id", "products.delete"],
    ["GET", "/api/admin/roles", "roles.view"],
    ["POST", "/api/admin/roles", "roles.create"],
    ["POST", "/api/admin/media", "media.upload"],
    ["GET", "/api/admin/exports/sales.xlsx", "reports.export"],
  ])("maps %s %s to %s", (method, url, required) => expect(permissionFor(url, method)).toBe(required));

  it("denies missing permissions with the same predicate used by middleware", () => {
    expect(canAccess(["products.view"], "products.delete")).toBe(false);
    expect(canAccess(["products.delete"], "products.delete")).toBe(true);
    expect(canAccess([], null)).toBe(true);
  });
});
