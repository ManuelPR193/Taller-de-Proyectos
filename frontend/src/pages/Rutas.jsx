import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { InteractiveMap } from '../components/InteractiveMap';
import { Play, Zap, CheckCircle2, AlertTriangle, Truck, Clock, Sparkles, Navigation, Layers, ShieldCheck } from 'lucide-react';

export const Rutas = () => {
  const [routes, setRoutes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getRoutes(), api.getOrders()])
      .then(([rData, oData]) => {
        setRoutes(rData);
        setOrders(oData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading routes data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateRoutes = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const result = await api.generateRoutes();
      setMessage({ type: 'success', text: `¡Metaheurística VRPTW ejecutada con éxito! Se generaron ${result.length} rutas optimizadas.` });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || "Error generando rutas." });
    } finally {
      setGenerating(false);
    }
  };

  const handleInsertExpress = async (orderId) => {
    try {
      const res = await api.insertExpressOrder(orderId);
      setMessage({ type: 'success', text: res.message });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const pendingExpressOrders = orders.filter(o => o.estado === 'PENDIENTE' && o.prioridad === 'EXPRESS');

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Action Header */}
      <div className="glass-panel p-6 border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-emerald-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Algoritmo VRPTW & Green VRP (RF-003)
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Generador y Visualizador de Rutas Optimizadas</h2>
          <p className="text-slate-300 text-sm max-w-2xl">
            Cálculo de itinerarios eficientes con restricciones de ventanas de tiempo, capacidad (RN-006) y antigüedad de flota (RN-002).
          </p>
        </div>

        <button
          onClick={handleGenerateRoutes}
          disabled={generating}
          className="btn-primary py-3.5 px-6 text-sm font-bold flex items-center gap-2.5 shrink-0 shadow-lg shadow-emerald-500/25 group"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Ejecutando Metaheurística (RF-003)...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition" />
              <span>Generar Rutas Optimizadas</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-3 animate-fade-in ${
          message.type === 'success' 
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' 
            : 'bg-red-500/15 border-red-500/40 text-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Re-optimization Dynamic Express Panel (RF-007 / RN-004) */}
      {pendingExpressOrders.length > 0 && (
        <div className="glass-panel p-5 border-amber-500/40 bg-gradient-to-r from-amber-950/30 to-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-200 flex items-center gap-2">
                Re-optimización Dinámica Requerida (RN-004)
              </div>
              <div className="text-xs text-amber-300/80 mt-0.5">
                Existen {pendingExpressOrders.length} pedido(s) con prioridad "EXPRESS" pendientes de inserción en rutas activas.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pendingExpressOrders.map(ord => (
              <button
                key={ord.pedido_id}
                onClick={() => handleInsertExpress(ord.pedido_id)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Insertar Express ({ord.cliente?.nombre_negocio || 'Pedido'})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map View Section (RF-004) */}
      <div className="glass-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" /> Visualización Geoespacial en Mapa (RF-004)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Huancayo & Valle del Mantaro</span>
        </div>
        {loading ? (
          <div className="h-[480px] flex items-center justify-center text-slate-400 bg-slate-900/50 rounded-xl">
            Cargando georreferenciación en mapa...
          </div>
        ) : (
          <InteractiveMap routes={routes} orders={orders} />
        )}
      </div>

      {/* Route Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Detalle de Rutas Planificadas ({routes.length})
          </h3>
        </div>

        {routes.length === 0 ? (
          <div className="glass-panel p-10 text-center space-y-3">
            <Truck className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm font-medium">
              No hay rutas generadas aún. Presione el botón "Generar Rutas Optimizadas" arriba para ejecutar el algoritmo VRPTW.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route, idx) => (
              <div key={route.ruta_id} className="glass-card p-5 space-y-4 relative group">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                    <span className="font-bold text-white text-base">Ruta #{idx + 1} — {route.vehiculo?.placa}</span>
                  </div>
                  <span className="badge-eco">{route.estado}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Distancia</span>
                    <strong className="text-emerald-400 font-bold text-sm">{route.distancia_total_km} km</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Emisión CO₂</span>
                    <strong className="text-cyan-400 font-bold text-sm">{route.co2_total_kg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Combustible</span>
                    <strong className="text-amber-400 font-bold text-sm">{route.combustible_estimado_l} L</strong>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Conductor:</span>
                    <span className="font-semibold text-white">{route.conductor?.nombre || 'No asignado'} ({route.conductor?.categoria_licencia})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehículo:</span>
                    <span className="font-semibold text-white">{route.vehiculo?.tipo} (Cap: {route.vehiculo?.capacidad_kg} kg)</span>
                  </div>
                </div>

                {/* Paradas sequence */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">
                    Secuencia de Paradas ({route.detalles?.length || 0}):
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {route.detalles?.map(det => (
                      <div key={det.ruta_detalle_id} className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 hover:border-slate-700 transition">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold flex items-center justify-center border border-emerald-500/40">
                            {det.orden_visita}
                          </span>
                          <span className="text-slate-200 font-medium">{det.pedido?.cliente?.nombre_negocio || 'Cliente'}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded">
                          Est: {det.hora_estimada ? new Date(det.hora_estimada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
