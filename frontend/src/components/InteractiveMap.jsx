import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRoadSegments, routePoints } from '../services/roadRouting';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const styles = { BAJO: ['#15803d','Tráfico bajo'], MEDIO: ['#eab308','Tráfico medio'], ALTO: ['#dc2626','Tráfico alto'], SIN_DATOS: ['#64748b','Sin datos de tráfico'] };
const pin = number => L.divIcon({className:'stop-marker', html:`<span style="display:grid;place-items:center;background:#064e3b;color:white;border:2px solid white;border-radius:50%;width:28px;height:28px;font-weight:bold">${Number(number)}</span>`, iconSize:[28,28]});
function Fit({points}) {
  const map = useMap();
  useEffect(()=>{ if(points.length) map.fitBounds(points, {padding:[30,30],maxZoom:15}); },[map,JSON.stringify(points)]);
  return null;
}
function TrafficEditor({route, segment, refresh}) {
  const [level,setLevel]=useState('BAJO'); const [source,setSource]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  return <form className="flex flex-wrap gap-2 mt-2" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{await api.setTraffic(route,segment,level,source);refresh();}catch(e){setError(e.message);}finally{setBusy(false);}}}>
    <label className="text-sm">Nivel<select className="form-input" value={level} onChange={e=>setLevel(e.target.value)}>{['BAJO','MEDIO','ALTO'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="text-sm flex-1">Fuente de la observación<input className="form-input" value={source} onChange={e=>setSource(e.target.value)} minLength={3} maxLength={120} required placeholder="Ej. inspección del operador" /></label>
    <button type="submit" className="btn-secondary self-end" disabled={busy}>Guardar observación</button>{error&&<p role="alert">{error}</p>}
  </form>;
}
export const InteractiveMap = ({routes=[], depot={lat:-12.0656,lng:-75.2048}}) => {
  const {user}=useAuth(); const canEdit=['ADMINISTRADOR','OPERADOR'].includes(user?.rol);
  const [paths,setPaths]=useState({}); const [traffic,setTraffic]=useState({}); const [failed,setFailed]=useState(false); const [tileError,setTileError]=useState(false); const [revision,setRevision]=useState(0);
  const key=JSON.stringify(routes.map(r=>[r.ruta_id,routePoints(r,depot)]));
  useEffect(()=>{
    const controller=new AbortController(); let active=true;
    setFailed(false);setPaths({});
    const timeout=setTimeout(()=>controller.abort(),12000);
    Promise.all(routes.filter(r=>r.detalles?.length).map(async r=>{
      try {const segments=await getRoadSegments(routePoints(r,depot),controller.signal);if(active)setPaths(p=>({...p,[r.ruta_id]:segments}));}
      catch {if(active)setFailed(true);}
    })).catch(()=>{if(active)setFailed(true);}).finally(()=>clearTimeout(timeout));
    return ()=>{active=false;controller.abort();clearTimeout(timeout);};
  },[key,revision]);
  useEffect(()=>{
    let active=true;
    const refresh=()=>Promise.all(routes.map(async r=>{try{const t=await api.getTraffic(r.ruta_id);if(active)setTraffic(p=>({...p,[r.ruta_id]:t}));}catch{if(active)setTraffic(p=>({...p,[r.ruta_id]:[]}));}}));
    void refresh();const timer=setInterval(()=>{void refresh();},60000);return()=>{active=false;clearInterval(timer);};
  },[key,revision]);
  const stops=routes.flatMap(r=>r.detalles||[]);
  return <div className="space-y-4">
    {(failed||tileError)&&<div role="alert" className="p-4 rounded-lg bg-slate-800">Servicio de mapas no disponible. Puede continuar con la lista de paradas.
      <button type="button" className="btn-secondary ml-2" onClick={()=>{setTileError(false);setRevision(v=>v+1);}}>Reintentar mapa</button></div>}
    <div className="h-[400px] rounded-xl overflow-hidden" aria-label="Mapa de rutas y congestión">
      <MapContainer key={revision} center={[depot.lat,depot.lng]} zoom={13} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' eventHandlers={{tileerror:()=>setTileError(true)}} />
        <Fit points={[[depot.lat,depot.lng],...stops.map(d=>[d.latitud,d.longitud])]} />
        {routes.flatMap(r=>(paths[r.ruta_id]||[]).map((positions,i)=>{
          const state=traffic[r.ruta_id]?.[i]?.nivel||'SIN_DATOS';const [color,label]=styles[state]||styles.SIN_DATOS;
          return <Polyline key={`${r.ruta_id}-${i}`} positions={positions} pathOptions={{color,weight:6}}><Popup>Tramo {i+1}: {label}</Popup></Polyline>;
        }))}
        {stops.map(d=><Marker key={d.ruta_detalle_id} position={[d.latitud,d.longitud]} icon={pin(d.orden_visita)}><Popup>Parada {d.orden_visita}: {d.pedido?.cliente?.nombre_negocio||'Entrega'}</Popup></Marker>)}
      </MapContainer>
    </div>
    <p className="text-slate-300 text-sm">Verde: bajo · Amarillo: medio · Rojo: alto · Gris: sin datos de tráfico. Observaciones válidas durante 30 minutos.</p>
    <section aria-label="Lista de paradas y tráfico" className="space-y-3">
      {routes.map(r=><div key={r.ruta_id} className="glass-panel p-4"><h4 className="font-bold">{r.vehiculo?.placa||'Ruta'} · {r.conductor?.nombre}</h4>
        <ol className="space-y-3 mt-3">{[...[...(r.detalles||[])].sort((a,b)=>a.orden_visita-b.orden_visita),null].map((d,i)=>{
          const t=traffic[r.ruta_id]?.[i];const label=(styles[t?.nivel]||styles.SIN_DATOS)[1];
          return <li key={i} className="border-t border-slate-700 pt-3"><span>{d?`Parada ${d.orden_visita}: ${d.pedido?.cliente?.nombre_negocio||'Entrega'}`:'Regreso al depósito'} · <strong>{label}</strong></span>
            {t?.fuente&&<p className="text-sm text-slate-300">{t.fuente} · {new Date(t.observado_en+'Z').toLocaleTimeString()}</p>}
            {canEdit&&<details><summary className="cursor-pointer text-emerald-300 mt-1">Registrar tráfico observado</summary><TrafficEditor route={r.ruta_id} segment={i} refresh={()=>setRevision(v=>v+1)} /></details>}
          </li>;
        })}</ol></div>)}
      {!routes.length&&<p>No hay rutas para mostrar.</p>}
    </section>
  </div>;
};
