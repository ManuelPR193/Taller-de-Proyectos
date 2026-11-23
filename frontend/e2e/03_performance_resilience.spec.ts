import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

test.describe('Rendimiento, disponibilidad y resiliencia', () => {
  test('registra tiempos reales de navegación y pintura', async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      (window as any).__lcp = null;
      try {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) (window as any).__lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch { /* El navegador puede no exponer LCP. */ }
    });
    const response = await page.goto('/login', { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await page.waitForTimeout(500);
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      return {
        ttfb_ms: nav.responseStart - nav.requestStart,
        dom_content_loaded_ms: nav.domContentLoadedEventEnd - nav.startTime,
        load_ms: nav.loadEventEnd - nav.startTime,
        fcp_ms: fcp?.startTime ?? null,
        lcp_ms: (window as any).__lcp,
      };
    });
    expect(metrics.ttfb_ms).toBeGreaterThanOrEqual(0);
    expect(metrics.dom_content_loaded_ms).toBeGreaterThan(0);
    await writeFile(testInfo.outputPath('navigation-metrics.json'), JSON.stringify({ browser: testInfo.project.name, url: page.url(), metrics }, null, 2));
    console.log('NAVIGATION_METRICS', JSON.stringify({ browser: testInfo.project.name, metrics }));
  });

  test('la API de salud responde 200 con estado online', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8000/api/health', { timeout: 5000 });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('online');
  });

  test('un fallo de la API muestra un error sin colapsar el panel', async ({ page }) => {
    await page.route('**/api/v1/dashboard/metrics*', route => route.abort('failed'));
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('admin@distrirapido.pe');
    await page.locator('input[type="password"]').first().fill('admin123');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Resumen de operación/ })).toBeVisible();
  });
});
