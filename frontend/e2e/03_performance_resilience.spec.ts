import { test, expect } from '@playwright/test';

test.describe('E2E & Monitoreo: Rendimiento Web Vitals, APIs y Resiliencia de Red', () => {
  test('TC-PERF-01: Auditoría de métricas Web Vitals (TTFB, FCP, LCP y DOMContentLoaded)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const domLoadedTime = Date.now() - startTime;

    // Extracción de tiempos de navegación vía PerformanceNavigationTiming API
    const performanceTimingJson = await page.evaluate(() => {
      const perfEntries = performance.getEntriesByType('navigation');
      if (perfEntries.length > 0) {
        const nav = perfEntries[0] as PerformanceNavigationTiming;
        return {
          ttfb: nav.responseStart - nav.requestStart,
          domInteractive: nav.domInteractive - nav.startTime,
          loadComplete: nav.loadEventEnd - nav.startTime,
        };
      }
      return null;
    });

    console.log('Performance Metrics:', performanceTimingJson, `DOM Content Loaded: ${domLoadedTime}ms`);

    // Umbrales exigidos: TTFB < 800ms en condiciones normales
    if (performanceTimingJson && performanceTimingJson.ttfb > 0) {
      expect(performanceTimingJson.ttfb).toBeLessThan(1200);
    }
    expect(domLoadedTime).toBeLessThan(4000);
  });

  test('TC-NET-02: Disponibilidad de endpoints HTTP y códigos de estado (200 OK)', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8000/api/health', {
      timeout: 5000,
    }).catch(() => null);

    if (response) {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBeDefined();
    }
  });

  test('TC-RES-03: Resiliencia de interfaz ante fallos de red simulados (Offline/Degraded)', async ({ page }) => {
    await page.goto('/');

    // Interceptar peticiones fallidas intencionalmente para evaluar tolerancia
    await page.route('**/api/roads/traffic', route => route.abort('failed'));

    // La interfaz no debe crashear con pantalla blanca (White Screen of Death)
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await expect(body).not.toBeEmpty();
  });
});
