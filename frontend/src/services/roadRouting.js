// The backend computes Dijkstra paths; GeoJSON uses [longitude, latitude].
const apiBase = import.meta.env?.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://127.0.0.1:8000/api/v1' : '/api/v1');
const endpoint = `${apiBase.replace(/\/$/, '')}/roads/path`;
const cache = new Map();

export function routePoints(route, depot) {
  const stops = [...(route.detalles || [])].sort((a, b) => a.orden_visita - b.orden_visita);
  return [[depot.lat, depot.lng], ...stops.map(d => [d.latitud, d.longitud]), [depot.lat, depot.lng]];
}

export async function getRoadRoute(points, signal) {
  if (points.length < 2 || points.some(([lat, lng]) =>
    !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)) {
    throw new Error('Coordenadas de ruta inválidas');
  }
  const coordinates = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
  if (cache.has(coordinates)) return cache.get(coordinates);
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  const timeout = setTimeout(cancel, 15000);
  try {
    const response = await fetch(`${endpoint}?coordinates=${encodeURIComponent(coordinates)}`, {
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Servicio de rutas no disponible');
    const geometry = data.routes?.[0]?.geometry;
    if (data.code !== 'Ok' || geometry?.type !== 'LineString' || geometry.coordinates.length < 2) {
      throw new Error('No se encontró un recorrido por calles');
    }
    const positions = geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    if (positions.some(([lat, lng]) => !Number.isFinite(lat) || !Number.isFinite(lng))) {
      throw new Error('Geometría de ruta inválida');
    }
    if (cache.size >= 100) cache.delete(cache.keys().next().value);
    cache.set(coordinates, positions);
    return positions;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}

export async function getRoadSegments(points, signal) {
  const coordinates = points.map(([lat,lng]) => `${lng},${lat}`).join(';');
  const response = await fetch(`${endpoint}?coordinates=${encodeURIComponent(coordinates)}`, {signal});
  const data = await response.json();
  if (!response.ok || !data.routes?.[0]?.segments) throw new Error('No se pudo cargar el mapa');
  return data.routes[0].segments.map(s => s.coordinates.map(([lng,lat]) => [lat,lng]));
}
