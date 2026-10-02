import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

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

export const InteractiveMap = ({ routes = [], orders = [], depot = { lat: -12.0656, lng: -75.2048 } }) => {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer
        center={[depot.lat, depot.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
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

        {/* Order Markers */}
        {orders.map((ord) => {
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
                    Peso: <b>{ord.peso_kg} kg</b> | Estado: <b className="text-emerald-700">{ord.estado}</b>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Polylines (RF-004) */}
        {routes.map((route, idx) => {
          if (!route.detalles || route.detalles.length === 0) return null;
          const points = [
            [depot.lat, depot.lng],
            ...route.detalles.map(d => [d.latitud, d.longitud]),
            [depot.lat, depot.lng]
          ];
          const pathColor = routeColors[idx % routeColors.length];

          return (
            <Polyline
              key={route.ruta_id || idx}
              positions={points}
              pathOptions={{ color: pathColor, weight: 4, opacity: 0.8, dashArray: '6, 6' }}
            />
          );
        })}
      </MapContainer>

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
