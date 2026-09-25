import { test, expect } from "@playwright/test";

const routes = ["returns", "activity", "notifications", "roles", "users"];
test.describe("admin refresh probe", () => {
  for (const route of routes) {
    test(`probe /admin/${route}`, async ({ page }) => {
      await page.goto(`/admin/${route}`);
      await page.getByLabel("Email").fill("admin@theaviator.local");
      await page.getByLabel("Mot de passe").fill("Aviator-Admin2026!");
      await page.getByRole("button", { name: /Ouvrir le back-office/i }).click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);
      const body = await page.locator("body").innerText();
      if (body.includes("Erreur d'affichage du panneau")) {
        const err = await page.locator("text=Erreur d'affichage du panneau").evaluate((el) => el.parentElement?.innerText);
        console.log(`[${route}] CRASH: ${err}`);
      } else {
        console.log(`[${route}] OK`);
      }
    });
  }
});
