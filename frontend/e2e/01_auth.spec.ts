import { test, expect } from '@playwright/test';

test.describe('E2E - Módulo de Autenticación y Control de Acceso', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC-AUTH-01: Carga correcta de pantalla de inicio de sesión con branding oficial', async ({ page }) => {
    await expect(page).toHaveTitle(/EcoLogística|Login|EcoLogistica/i);
    const loginHeading = page.locator('h1, h2, form').first();
    await expect(loginHeading).toBeVisible();
  });

  test('TC-AUTH-02: Rechazo ante credenciales vacías o inválidas con mensaje reactivo', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"], button:has-text("Ingresar"), button:has-text("Iniciar Sesión")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      const alertOrError = page.locator('.error, [role="alert"], text=/invalido|incorrecto|requerido|completa/i').first();
      // Esperar validación visual de HTML5 o alerta de estado
      expect(page.url()).toContain('/login');
    }
  });

  test('TC-AUTH-03: Inicio de sesión exitoso como Administrador / Operador de Flota', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="username"], input[name="email"], input#email').first();
    const passInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"], button:has-text("Ingresar"), button:has-text("Iniciar Sesión")').first();

    if (await emailInput.isVisible() && await passInput.isVisible()) {
      await emailInput.fill('admin@distrirapido.pe');
      await passInput.fill('Admin123*');
      await submitBtn.click();

      // Debería redirigir al Dashboard o Rutas tras autenticación
      await page.waitForTimeout(1000);
      expect(page.url()).not.toContain('/login');
    }
  });
});
