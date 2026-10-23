import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getRoadRoute, routePoints } from '../services/roadRouting';

// Fix default Leaflet icon paths in React
const depotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const expressIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const routeColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

function MapResize() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    map.invalidateSize();
    return () => observer.disconnect();
  }, [map]);
  return null;
}

const createStopPin = (num, color) => {
  return L.divIcon({
    className: 'custom-stop-pin',
    html: `<div style="background-color: ${color}; color: #ffffff; font-weight: 800; font-size: 11px; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);">${num}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export const InteractiveMap = ({ routes = [], orders = [], depot = { lat: -12.0656, lng: -75.2048 } }) => {
  const routeKeys = routes.map(route => route.detalles?.length ? JSON.stringify(routePoints(route, depot)) : null);
  const requestKey = JSON.stringify([...new Set(routeKeys.filter(Boolean))]);
  const [roadPaths, setRoadPaths] = useState({});
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const keys = JSON.parse(requestKey);
    setRoadPaths({});
    // Query sequentially to avoid flooding the routing service with a whole fleet.
    async function load() {
      for (const key of keys) {
        if (controller.signal.aborted) return;
        try {
          const positions = await getRoadRoute(JSON.parse(key), controller.signal);
          if (!controller.signal.aborted) setRoadPaths(current => ({ ...current, [key]: { positions } }));
        } catch {
          if (!controller.signal.aborted) setRoadPaths(current => ({ ...current, [key]: { error: true } }));
        }
      }
    }
    load();
    return () => controller.abort();
  }, [requestKey, retry]);
  const pending = routeKeys.filter(key => key && !roadPaths[key]).length;
  const failed = routeKeys.filter(key => key && roadPaths[key]?.error).length;
  // Collect order IDs that are already in route details to avoid duplicate plain markers
  const assignedOrderIds = new Set();
  routes.forEach(r => {
    (r.detalles || []).forEach(d => assignedOrderIds.add(d.pedido_id));
  });

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer
        center={[depot.lat, depot.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapResize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Depot Marker */}
        <Marker position={[depot.lat, depot.lng]} icon={depotIcon}>
          <Popup>
            <div className="text-slate-900 font-sans p-1">
              <strong className="text-emerald-700 text-sm">Almacén Central DistriRápido</strong><br />
              <span className="text-xs">Plaza Constitución, Huancayo</span><br />
              <span className="text-[10px] text-slate-500">Punto de partida de la flota</span>
            </div>
          </Popup>
        </Marker>

        {/* Unassigned Order Markers */}
        {orders.filter(ord => !assignedOrderIds.has(ord.pedido_id)).map((ord) => {
          const isExpress = ord.prioridad === 'EXPRESS';
          return (
            <Marker
              key={ord.pedido_id}
              position={[ord.latitud, ord.longitud]}
              icon={isExpress ? expressIcon : deliveryIcon}
            >
              <Popup>
                <div className="text-slate-900 font-sans p-1">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-semibold">{ord.cliente?.nombre_negocio || 'Cliente'}</strong>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isExpress ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {ord.prioridad}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{ord.punto_referencia || 'Sin referencia'}</p>
                  <div className="text-[11px] mt-1 text-slate-500">
                    Peso: <b>{ord.peso_kg} kg</b> | Estado: <b className="text-amber-700">{ord.estado}</b>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Polylines and Stop Markers (RF-004) */}
        {routes.map((route, idx) => {
          if (!route.detalles || route.detalles.length === 0) return null;
          const points = roadPaths[routeKeys[idx]]?.positions;
          const pathColor = routeColors[idx % routeColors.length];

          return (
            <React.Fragment key={route.ruta_id || idx}>
              {points && <Polyline
                positions={points}
                pathOptions={{ color: '#ffffff', weight: 9, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
              />}
              {points && <Polyline
                positions={points}
                pathOptions={{ color: pathColor, weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
              />}
              {route.detalles.map((det) => (
                <Marker
                  key={det.ruta_detalle_id}
                  position={[det.latitud, det.longitud]}
                  icon={createStopPin(det.orden_visita, pathColor)}
                >
                  <Popup>
                    <div className="text-slate-900 font-sans p-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center" style={{ backgroundColor: pathColor }}>
                          {det.orden_visita}
                        </span>
                        <strong className="text-sm font-semibold">{det.pedido?.cliente?.nombre_negocio || 'Cliente'}</strong>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Vehículo: <b>{route.vehiculo?.placa}</b> ({route.conductor?.nombre || 'Conductor'})
                      </div>
                      <div className="text-[11px] mt-1 text-emerald-700 font-semibold">
                        Est: {det.hora_estimada ? new Date(det.hora_estimada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {(pending > 0 || failed > 0) && (
        <div role="status" className="absolute top-4 right-4 left-16 z-[1000] bg-slate-950/90 text-white text-xs p-3 rounded-lg shadow-lg">
          {pending > 0 && <div>Calculando recorridos por calles… ({pending})</div>}
          {failed > 0 && <div>
            No se pudo cargar el recorrido de {failed} ruta(s). Se muestran sus paradas.
            <button type="button" className="ml-2 underline font-semibold" onClick={() => setRetry(value => value + 1)}>Reintentar</button>
          </div>}
        </div>
      )}

      {/* Legend Badge Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 rounded-lg text-xs space-y-1.5 shadow-xl">
        <div className="font-semibold text-white mb-1">Leyenda del Mapa (RF-004)</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300">Almacén Central (Plaza Constitución)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-slate-300">Punto de Entrega Estándar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-slate-300">Entrega Express Urgente (RN-004)</span>
        </div>
      </div>
    </div>
  );
};

