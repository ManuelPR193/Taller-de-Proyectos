import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const report = resolve(root, 'frontend/playwright-report/index.html');
const output = resolve(root, 'docs/03 Implementacion/Sprint 4/evidencias/reporte-playwright-local.png');
await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(report).href, { waitUntil: 'load' });
  await page.screenshot({ path: output, fullPage: true });
  console.log(output);
} finally {
  await browser.close();
}
