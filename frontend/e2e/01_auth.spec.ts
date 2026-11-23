import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('muestra el formulario de acceso', async ({ page }) => {
    await expect(page).toHaveTitle(/EcoLogística|EcoLogistica/i);
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
  });

  test('impide enviar credenciales vacías', async ({ page }) => {
    const email = page.locator('input[type="email"]').first();
    await email.fill('');
    await page.locator('input[type="password"]').first().fill('');
    await page.locator('button[type="submit"]').first().click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    await expect(page.locator('nav')).toHaveCount(0);
  });

  test('inicia sesión con el usuario de prueba', async ({ page }) => {
    await page.locator('input[type="email"]').first().fill('admin@distrirapido.pe');
    await page.locator('input[type="password"]').first().fill('admin123');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });
});
