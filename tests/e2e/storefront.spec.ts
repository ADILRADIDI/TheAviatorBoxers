import { test, expect } from "@playwright/test";

test("client can browse collection and checkout page", async ({ page }) => {
  await page.goto("/collection");
  await expect(page).toHaveTitle(/AVIATOR/i);
  await expect(page.getByRole("heading", { name: /Tous nos produits/i })).toBeVisible();
  await page.goto("/panier");
  await expect(page.getByRole("heading", { name: /panier/i })).toBeVisible();
});

test("admin requires login before data access", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /Connexion sécurisée/i })).toBeVisible();
  await page.getByLabel("Email").fill("admin@theaviator.local");
  await page.getByLabel("Mot de passe").fill("change-me-admin");
  await page.getByRole("button", { name: /Ouvrir le back-office/i }).click();
  await expect(page.getByText("Back-office")).toBeVisible();
});

test("core client routes fit a 320px viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-320", "This assertion targets the mobile viewport project.");
  for (const route of ["/", "/collection", "/panier", "/checkout"]) {
    await page.goto(route);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }
});

