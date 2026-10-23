"""Read-only end-to-end check of the road geometry rendered by the running app."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    errors, routing = [], []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("response", lambda response: routing.append(response)
            if "/roads/path?" in response.url else None)
    page.goto("http://127.0.0.1:8000/rutas", wait_until="domcontentloaded")
    page.locator("form").first.locator('button[type="submit"]').click()
    page.wait_for_selector(".leaflet-container")
    page.wait_for_function("""() => !document.body.innerText.includes('Calculando recorridos por calles')
        && document.querySelectorAll('.leaflet-overlay-pane path').length > 0""", timeout=90000)
    paths = page.locator(".leaflet-overlay-pane path").evaluate_all("""elements => elements.map(el => ({
        commands: (el.getAttribute('d') || '').length,
        dash: el.getAttribute('stroke-dasharray')
    }))""")
    assert not errors, errors
    assert routing and all(response.status == 200 for response in routing)
    geometry_sizes = [len(response.json()["routes"][0]["geometry"]["coordinates"]) for response in routing]
    assert all(size > 20 for size in geometry_sizes), geometry_sizes
    assert all(not path["dash"] for path in paths), paths
    assert max(path["commands"] for path in paths) > 200, paths
    assert "No se pudo cargar el recorrido" not in page.locator("body").inner_text()
    page.screenshot(path=str(Path(__file__).parents[1] / "venv" / "road-map.png"), full_page=True)
    print(json.dumps({"routing_responses": [r.status for r in routing], "geometry_points": geometry_sizes, "rendered_paths": len(paths), "errors": errors}))
    browser.close()
