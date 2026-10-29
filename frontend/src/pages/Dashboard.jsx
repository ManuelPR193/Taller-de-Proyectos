import React, { useEffect, useState } from 'react';
import { api, today } from '../services/api';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [start, setStart] = useState(() => today().slice(0,8)+'01');
  const [end, setEnd] = useState(today);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    api.getDashboardMetrics(start, end).then(data => { if(active) setMetrics(data); })
      .catch(e => { if(active) setError(e.message); }).finally(() => { if(active) setLoading(false); });
    return () => { active=false; };
  }, [start, end, revision]);
  const cards = [
    ['Emisiones de CO2', 'co2_total_kg', 'kg'], ['Distancia planificada', 'distancia_total_km', 'km'],
    ['Combustible ahorrado estimado', 'combustible_ahorrado_l', 'L'],
    ['Entregas dentro de ventana', 'cumplimiento_ventanas_porcentaje', '%'],
    ['Compensación equivalente', 'arboles_equivalentes', 'árboles/año']
  ];
  return <section className="space-y-6" aria-labelledby="dashboard-title">
    <div className="glass-panel p-6"><p className="text-emerald-300 text-sm">SOSTENIBILIDAD · HUANCAYO</p>
      <h2 id="dashboard-title" className="text-3xl font-bold mt-2">Impacto de nuestras rutas</h2>
      <p className="text-slate-300 mt-2">Indicadores de las rutas registradas en el periodo seleccionado.</p></div>
    <div className="glass-panel p-5 flex flex-wrap items-end gap-4">
      <label className="flex-1">Desde<input className="form-input mt-1" type="date" value={start} max={end} onChange={e=>setStart(e.target.value)} required /></label>
      <label className="flex-1">Hasta<input className="form-input mt-1" type="date" value={end} min={start} onChange={e=>setEnd(e.target.value)} required /></label>
      <button className="btn-secondary" onClick={()=>setRevision(v=>v+1)}>Actualizar</button>
      <Link className="btn-primary" to="/reportes">Descargar reporte</Link>
    </div>
    {loading ? <p role="status">Cargando indicadores...</p> : error ? <p role="alert" className="glass-panel p-5 text-red-200">{error}</p> : metrics && <>
      {metrics.sin_datos && <p role="status" className="glass-panel p-5">Sin datos para el periodo seleccionado</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="metrics">
        {cards.map(([label,key,unit])=><article key={key} className="glass-card p-5"><h3 className="text-slate-300 text-sm">{label}</h3>
          <p className="text-3xl font-bold mt-3" data-metric={key}>{metrics[key] ?? 0} <span className="text-sm text-emerald-300">{unit}</span></p></article>)}
      </div>
      <div className="glass-panel p-5 text-slate-300 space-y-2">
        <p>{metrics.rutas_totales} rutas · {metrics.pedidos_totales} pedidos · {metrics.pedidos_entregados} entregas confirmadas.</p>
        <p>Ahorro frente al orden secuencial de los mismos pedidos y vehículo: {metrics.ahorro_vs_secuencial_porcentaje ?? 0} %.</p>
        <p>{metrics.rutas_con_base} rutas con comparación; {metrics.rutas_sin_base} sin base registrada. El ahorro es una estimación de planificación, no una medición de combustible consumido.</p>
      </div>
      {metrics.por_vehiculo.length > 0 && <div className="glass-panel p-5 overflow-x-auto"><table className="w-full text-left"><caption className="text-lg font-bold text-left mb-3">Detalle por ruta y vehículo</caption>
        <thead><tr>{['Fecha','Vehículo','Distancia (km)','CO2 (kg)'].map(x=><th key={x} scope="col" className="p-2">{x}</th>)}</tr></thead>
        <tbody>{metrics.por_vehiculo.map((r,i)=><tr key={i}><td className="p-2">{r.fecha}</td><td className="p-2">{r.placa}</td><td className="p-2">{r.distancia_km}</td><td className="p-2">{r.co2_kg}</td></tr>)}</tbody></table></div>}
    </>}
  </section>;
};
