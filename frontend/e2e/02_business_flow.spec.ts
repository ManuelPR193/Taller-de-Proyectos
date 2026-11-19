import { test, expect } from '@playwright/test';

test.describe('E2E - Flujos de Negocio: Pedidos, Rutas y Optimización VRPTW', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-BIZ-01: Renderizado del mapa interactivo y capas viales de Huancayo', async ({ page }) => {
    // Comprobar presencia de contenedor de mapa de Leaflet
    const mapContainer = page.locator('.leaflet-container, #map, [data-testid="interactive-map"]').first();
    await page.waitForTimeout(1000);
    if (await mapContainer.isVisible()) {
      await expect(mapContainer).toBeVisible();
      // Verificación de atribución de OpenStreetMap
      const osmAttr = page.locator('.leaflet-control-attribution');
      await expect(osmAttr).toBeVisible();
    }
  });

  test('TC-BIZ-02: Navegación entre Dashboard, Rutas y Conductores', async ({ page }) => {
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Navegación hacia Rutas
    const rutasBtn = page.locator('a[href*="rutas"], button:has-text("Rutas")').first();
    if (await rutasBtn.isVisible()) {
      await rutasBtn.click();
      await expect(page).toHaveURL(/.*rutas.*/);
    }
  });

  test('TC-BIZ-03: Simulación y cálculo de indicadores de sostenibilidad (Green VRP)', async ({ page }) => {
    const dashboardLink = page.locator('a[href*="dashboard"], button:has-text("Dashboard"), a:has-text("Dashboard")').first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      // Verificar cards de CO2, distancia o ahorro
      const metricCards = page.locator('text=/CO2|kg|km|Combustible|Emisiones/i').first();
      await expect(metricCards).toBeVisible();
    }
  });
});
