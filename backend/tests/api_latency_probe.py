"""Local API latency sample. Run only with seeded development data."""

import json
import math
import os
import statistics
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx


BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")
REPEATS = int(os.getenv("API_PROBE_REPEATS", "20"))


def sample(client, method, path, **kwargs):
    values = []
    for _ in range(REPEATS):
        start = time.perf_counter()
        response = client.request(method, path, **kwargs)
        elapsed = (time.perf_counter() - start) * 1000
        response.raise_for_status()
        values.append(round(elapsed, 2))
    ordered = sorted(values)
    return {
        "requests": REPEATS,
        "min_ms": ordered[0],
        "median_ms": round(statistics.median(ordered), 2),
        "p95_ms": ordered[math.ceil(0.95 * len(ordered)) - 1],
        "max_ms": ordered[-1],
    }


def main():
    if REPEATS < 2:
        raise ValueError("API_PROBE_REPEATS must be at least 2")
    with httpx.Client(base_url=BASE_URL, timeout=15) as client:
        health = sample(client, "GET", "/api/health")
        email = os.getenv("E2E_EMAIL", "admin@distrirapido.pe")
        password = os.getenv("E2E_PASSWORD", "admin123")
        auth = sample(client, "POST", "/api/v1/auth/login", json={"email": email, "password": password})
        token = client.post("/api/v1/auth/login", json={"email": email, "password": password}).raise_for_status().json()["access_token"]
        vehicles = sample(client, "GET", "/api/v1/vehicles/", headers={"Authorization": f"Bearer {token}"})
    result = {
        "scope": "local development server; no production uptime or external network latency",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "base_url": BASE_URL,
        "endpoints": {"GET /api/health": health, "POST /api/v1/auth/login": auth, "GET /api/v1/vehicles/": vehicles},
    }
    output = Path(__file__).resolve().parent.parent / "test-artifacts" / "api-latency-local.json"
    output.parent.mkdir(exist_ok=True)
    output.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
