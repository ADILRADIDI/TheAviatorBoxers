import { test, expect } from "@playwright/test";

test("client can browse collection and checkout page", async ({ page }) => {
  await page.goto("/collection");
  await expect(page).toHaveTitle(/AVIATOR/i);
  await expect(page.getByRole("heading", { name: /Tous nos produits/i })).toBeVisible();
  await page.goto("/panier");
  await expect(page.getByRole("heading", { name: /panier/i })).toBeVisible();
});

test("admin requires login before data access", async ({ page }, testInfo) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /Connexion sécurisée/i })).toBeVisible();
  await page.getByLabel("Email").fill("e2e@theaviator.local");
  await page.getByLabel("Mot de passe").fill("change-me-admin");
  await page.getByRole("button", { name: /Ouvrir le back-office/i }).click();
  await expect(page.getByText("Back-office")).toBeVisible();
  if (testInfo.project.name === "mobile-320") {
    await page.getByRole("button", { name: "Ouvrir la navigation" }).click();
  }
  await page.getByRole("button", { name: "Vue d'ensemble" }).click();
  await expect(page.getByText("Meilleures ventes")).toBeVisible();
  await expect(page.getByText("Top produits")).toBeVisible();
});

test("client can build a pack and confirm the order", async ({ page }) => {
  const productBtn = () => page.getByRole("button", { name: /Aviator Essential/ });
  await page.goto("/packs");
  await expect(page.getByRole("heading", { name: /Composez votre pack/i })).toBeVisible();
  await expect(productBtn().first()).toBeVisible();
  await productBtn().first().click();
  await expect(productBtn().first()).toBeVisible();
  await productBtn().first().click();
  const cards = page.locator("div.border.border-border.bg-background.p-6");
  await cards.nth(0).getByRole("button", { name: /^M$/ }).click();
  await cards.nth(1).getByRole("button", { name: /^L$/ }).click();
  await expect(page.getByText(/Réduction \(10%\)/)).toBeVisible();
  await page.getByRole("button", { name: /Commander/ }).click();
  await expect(page.getByRole("heading", { name: /Commande/ })).toBeVisible();
  await page.locator('input[autocomplete="name"]').fill("E2E Pack");
  await page.locator('input[type="tel"]').fill("0600000000");
  await page.locator("select").first().selectOption("Rabat");
  await page.locator('input[placeholder*="rue"]').fill("1 Avenue Test");
  await page.getByRole("button", { name: /Confirmer ma commande/ }).click();
  await expect(page.getByText(/Merci pour votre commande/i)).toBeVisible();
  await expect(page.locator("body")).toContainText(/AVT-/);
});

test("header shows À propos as second link and footer shows managed contacts", async ({ page }, testInfo) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText("social@theaviatorboxer.com")).toBeVisible();
  await expect(footer.getByText("06 91 57 31 92")).toBeVisible();
  await expect(footer.getByRole("link", { name: "À propos" })).toBeVisible();
  test.skip(testInfo.project.name === "mobile-320", "Desktop nav order is asserted on the desktop project.");
  const nav = page.getByRole("navigation");
  const navLinks = nav.getByRole("link");
  await expect(navLinks.nth(1)).toHaveText("Collection");
  await expect(navLinks.nth(2)).toHaveText("À propos");
});

test("admin can manage site settings and the storefront reflects them", async ({ page }, testInfo) => {
  await page.goto("/admin");
  await page.getByLabel("Email").fill("e2e@theaviator.local");
  await page.getByLabel("Mot de passe").fill("change-me-admin");
  await page.getByRole("button", { name: /Ouvrir le back-office/i }).click();
  if (testInfo.project.name === "mobile-320") {
    await page.getByRole("button", { name: "Ouvrir la navigation" }).click();
  }
  await page.getByRole("button", { name: "Réglages" }).click();
  const emailInput = page.getByLabel("Email");
  await expect(emailInput).toHaveValue("social@theaviatorboxer.com");
  await emailInput.fill("test-settings@theaviatorboxer.com");
  await page.getByRole("button", { name: /Enregistrer/i }).click();
  await expect(page.getByText("Modifications enregistrées.")).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("contentinfo").getByText("test-settings@theaviatorboxer.com")).toBeVisible();
  await page.evaluate(async () => {
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": localStorage.getItem("aviator_admin_token") || "" },
      body: JSON.stringify({ email: "social@theaviatorboxer.com" }),
    });
    if (!response.ok) throw new Error("Restore failed");
  });
});

test("core client routes fit a 320px viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-320", "This assertion targets the mobile viewport project.");
  for (const route of ["/", "/collection", "/panier", "/checkout"]) {
    await page.goto(route);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }
});

