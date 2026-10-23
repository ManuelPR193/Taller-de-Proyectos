"""Read-only browser smoke audit of the running application (requires playwright)."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

output = {"pages": [], "errors": [], "failed_requests": []}
with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda error: output["errors"].append(str(error)))
    page.on("requestfailed", lambda request: output["failed_requests"].append({"url": request.url, "error": request.failure}))
    page.goto("http://127.0.0.1:8000", wait_until="domcontentloaded")
    assert page.locator('input[type="password"]').count() == 1
    page.locator('form').first.locator('button[type="submit"]').click()
    page.wait_for_selector('main')
    for route in ("/", "/rutas", "/vehiculos", "/conductores", "/pedidos", "/modo-conductor", "/portal-auditor", "/portal-cliente", "/reportes"):
        response = page.goto("http://127.0.0.1:8000" + route, wait_until="domcontentloaded")
        page.wait_for_timeout(1800)
        output["pages"].append({"route": route, "status": response.status, "text": page.locator("main").inner_text()[:180],
                                "root_children": page.locator("#root > *").count()})
    page.goto("http://127.0.0.1:8000", wait_until="domcontentloaded")
    page.screenshot(path=str(Path(__file__).parents[1] / "venv" / "audit-dashboard.png"), full_page=True)
    page.get_by_title("Cerrar Sesión").click()
    output["logout_shows_login"] = page.locator('input[type="password"]').count() > 0
    page.reload(wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    output["reload_restores_admin_without_login"] = page.locator('input[type="password"]').count() == 0
    assert not output["errors"], output["errors"]
    assert output["logout_shows_login"]
    assert not output["reload_restores_admin_without_login"]
    browser.close()
print(json.dumps(output, ensure_ascii=True, indent=2))
