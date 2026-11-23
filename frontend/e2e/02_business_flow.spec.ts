import { test, expect } from '@playwright/test';

test.describe('Flujos de negocio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('admin@distrirapido.pe');
    await page.locator('input[type="password"]').first().fill('admin123');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('muestra el mapa en la pantalla de rutas', async ({ page }) => {
    await page.locator('nav a[href="/rutas"]').click();
    await expect(page).toHaveURL(/\/rutas$/);
    await expect(page.locator('.leaflet-container')).toBeVisible();
    await expect(page.locator('.leaflet-control-attribution')).toBeVisible();
  });

  test('permite navegar entre rutas y conductores', async ({ page }) => {
    await page.locator('nav a[href="/rutas"]').click();
    await expect(page).toHaveURL(/\/rutas$/);
    await expect(page.getByRole('heading', { name: /Generador y Visualizador de Rutas/ })).toBeVisible();
    await page.locator('nav a[href="/conductores"]').click();
    await expect(page).toHaveURL(/\/conductores$/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('carga indicadores de sostenibilidad desde la API', async ({ page, request }) => {
    await expect(page.locator('[data-testid="metrics"]')).toBeVisible();
    await expect(page.locator('[data-metric="co2_total_kg"]')).toBeVisible();
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    const response = await request.get('http://127.0.0.1:8000/api/v1/dashboard/metrics?fecha_inicio=2026-11-01&fecha_fin=2026-11-20', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toHaveProperty('co2_total_kg');
  });
});
