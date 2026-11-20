import React, { useEffect, useState } from 'react';
import { api, today } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const indicators = [
  ['Emisiones de CO₂', 'co2_total_kg', 'kg'],
  ['Distancia planificada', 'distancia_total_km', 'km'],
  ['Combustible ahorrado', 'combustible_ahorrado_l', 'L'],
  ['Entregas en ventana', 'cumplimiento_ventanas_porcentaje', '%'],
  ['Compensación equivalente', 'arboles_equivalentes', 'árboles/año']
];
export const Dashboard = () => {
  const { user } = useAuth();
  const [start, setStart] = useState(() => today().slice(0, 8) + '01');
  const [end, setEnd] = useState(today);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    api.getDashboardMetrics(start, end).then(data => { if (active) setMetrics(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [start, end, revision]);
  return <section className="operations-page" aria-labelledby="dashboard-title">
    <div className="page-heading"><div><p className="eyebrow">CENTRO DE OPERACIONES / IMPACTO</p><h2 id="dashboard-title">Resumen de operación</h2><p>Rutas, entregas e impacto del periodo seleccionado.</p></div>{['ADMINISTRADOR', 'OPERADOR'].includes(user?.rol) && <Link className="btn-primary" to="/rutas">Ver rutas →</Link>}</div>
    <div className="filter-bar glass-panel">
      <label>Desde<input className="form-input" type="date" value={start} max={end} onChange={e => setStart(e.target.value)} required /></label>
      <label>Hasta<input className="form-input" type="date" value={end} min={start} onChange={e => setEnd(e.target.value)} required /></label>
      <button className="btn-secondary" onClick={() => setRevision(v => v + 1)}>Actualizar</button>
      <Link className="btn-secondary" to="/reportes">Descargar reporte</Link>
    </div>
    {loading ? <p role="status" className="status-panel">Cargando indicadores…</p> : error ? <p role="alert" className="status-panel form-error">{error}</p> : metrics && <>
      {metrics.sin_datos && <p role="status" className="status-panel">Sin datos para el periodo seleccionado.</p>}
      <div className="metric-grid" data-testid="metrics">{indicators.map(([label, key, unit]) => <article className="metric-card glass-card" key={key}><h3>{label}</h3><p data-metric={key}>{metrics[key] ?? 0}<span>{unit}</span></p></article>)}</div>
      <div className="operation-summary glass-panel"><p><strong>{metrics.rutas_totales}</strong> rutas <span>·</span> <strong>{metrics.pedidos_totales}</strong> pedidos <span>·</span> <strong>{metrics.pedidos_entregados}</strong> entregas confirmadas</p><p>Ahorro frente al orden secuencial: {metrics.ahorro_vs_secuencial_porcentaje ?? 0} %.</p><p>{metrics.rutas_con_base} rutas con comparación; {metrics.rutas_sin_base} sin base registrada. El ahorro es una estimación de planificación.</p></div>
      {metrics.por_vehiculo?.length > 0 && <div className="table-panel glass-panel"><table><caption>Detalle por ruta y vehículo</caption><thead><tr>{['Fecha', 'Vehículo', 'Distancia (km)', 'CO₂ (kg)'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{metrics.por_vehiculo.map((r, i) => <tr key={i}><td>{r.fecha}</td><td>{r.placa}</td><td>{r.distancia_km}</td><td>{r.co2_kg}</td></tr>)}</tbody></table></div>}
    </>}
  </section>;
};
