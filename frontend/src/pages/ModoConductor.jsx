import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { UserCheck, MapPin, CheckCircle, Clock, ShieldCheck, Truck, Navigation, CheckCircle2 } from 'lucide-react';

export const ModoConductor = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [message, setMessage] = useState(null);

  const loadRoutes = () => {
    setLoading(true);
    api.getRoutes()
      .then(data => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleConfirmDelivery = async (detail) => {
    setConfirming(detail.ruta_detalle_id);
    setMessage(null);
    try {
      const res = await api.confirmDelivery(detail.ruta_detalle_id, detail.latitud, detail.longitud);
      setMessage({ type: 'success', text: `¡Entrega registrada exitosamente a las ${new Date(res.hora_entrega).toLocaleTimeString()} con prueba GPS (RN-010)!` });
      loadRoutes();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Driver Mobile Header */}
      <div className="glass-panel p-6 border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-slate-900/80 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/40 shadow-lg shadow-blue-500/10">
          <UserCheck className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Modo Conductor — Cockpit de Entrega</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Secuencia interactiva de la jornada. Confirmación obligatoria de entregas con georreferenciación y sello de tiempo (RN-010).
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in ${
          message.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' : 'bg-red-500/15 border-red-500/40 text-red-200'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {routes.length === 0 ? (
        <div className="glass-panel p-10 text-center space-y-3">
          <Truck className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">No tienes rutas asignadas para la jornada actual.</p>
        </div>
      ) : (
        routes.map(r => (
          <div key={r.ruta_id} className="glass-panel p-6 space-y-5 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Unidad Asignada</span>
                <span className="font-mono font-extrabold text-white text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" /> {r.vehiculo?.placa} ({r.vehiculo?.tipo})
                </span>
              </div>
              <span className="badge-eco">{r.estado}</span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Secuencia de Entregas ({r.detalles?.length}):
              </span>

              {r.detalles?.map(det => {
                const isDelivered = det.hora_real_entrega != null;
                return (
                  <div
                    key={det.ruta_detalle_id}
                    className={`p-4 rounded-xl border space-y-3 transition ${
                      isDelivered 
                        ? 'bg-emerald-950/20 border-emerald-500/40' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center ${
                          isDelivered ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {det.orden_visita}
                        </span>
                        <strong className="text-white text-base">{det.pedido?.cliente?.nombre_negocio || 'Cliente'}</strong>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        isDelivered ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {isDelivered ? 'ENTREGADO' : 'PENDIENTE'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-start gap-1.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{det.pedido?.punto_referencia || det.pedido?.cliente?.direccion_referencia || 'Huancayo'}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-800/80 text-xs gap-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Hora Estimada: <b className="text-white">{det.hora_estimada ? new Date(det.hora_estimada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</b>
                      </span>

                      {!isDelivered ? (
                        <button
                          onClick={() => handleConfirmDelivery(det)}
                          disabled={confirming === det.ruta_detalle_id}
                          className="btn-primary py-2 px-4 text-xs font-bold shadow-md"
                        >
                          {confirming === det.ruta_detalle_id ? 'Verificando GPS...' : 'Confirmar Entrega (RN-010)'}
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                          <CheckCircle className="w-4 h-4" /> Entregado {new Date(det.hora_real_entrega).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

    </div>
  );
};
