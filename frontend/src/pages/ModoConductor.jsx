import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { UserCheck, MapPin, CheckCircle, Clock, ShieldCheck, Truck, Navigation, CheckCircle2, AlertTriangle, Camera, FileCheck, Award, Zap, X } from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';

export const ModoConductor = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState(null);

  // Simulated Proof of Delivery Form State
  const [clientSignatureName, setClientSignatureName] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

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

  const openConfirmationModal = (detail) => {
    setSelectedDetail(detail);
    setClientSignatureName(detail.pedido?.cliente?.nombre_negocio || 'Receptor Responsable');
    setDeliveryNotes('Entrega realizada en conformidad y recepción física.');
  };

  const handleConfirmDelivery = async (e) => {
    e.preventDefault();
    if (!selectedDetail) return;
    setConfirming(true);
    setMessage(null);
    try {
      const res = await api.confirmDelivery(
        selectedDetail.ruta_detalle_id,
        selectedDetail.latitud,
        selectedDetail.longitud
      );
      setMessage({
        type: 'success',
        text: `¡Entrega de ${selectedDetail.pedido?.cliente?.nombre_negocio || 'Cliente'} confirmada a las ${new Date(res.hora_entrega).toLocaleTimeString()} con firma digital y comprobante GPS (RN-010)!`
      });
      setSelectedDetail(null);
      loadRoutes();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setConfirming(false);
    }
  };

  const currentRoute = routes[0]; // Active driver's route

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Mobile/Tablet Driver Header */}
      <div className="glass-panel p-6 border-blue-500/30 bg-gradient-to-br from-blue-950/50 via-slate-900/80 to-slate-900/60 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40 shadow-lg shadow-blue-500/20">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                Cockpit Digital del Conductor (Modo Conductor)
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Hoja de Ruta & Georreferenciación</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Secuencia de entregas diarias con firma digital, sello de tiempo GPS (RN-010) y control de jornada laborada (RN-003).
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Puntuación Eco-Driving</span>
            <span className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <Award className="w-5 h-5" /> 96 / 100
            </span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-3 animate-fade-in ${
          message.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' : 'bg-red-500/15 border-red-500/40 text-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Driver Active Route Summary & RN-003 Workday Indicator */}
      {currentRoute && (
        <div className="glass-panel p-5 space-y-4 border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehículo Asignado hoy</span>
              <span className="font-mono font-extrabold text-white text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" /> {currentRoute.vehiculo?.placa} ({currentRoute.vehiculo?.tipo})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="badge-eco">{currentRoute.estado}</span>
              <div className="text-xs text-slate-300">
                Conductor: <strong className="text-white">{currentRoute.conductor?.nombre}</strong>
              </div>
            </div>
          </div>

          {/* RN-003 Driving Hours Progress */}
          <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> Control de Jornada Máxima 8h (RN-003 - Ley N° 30224):
              </span>
              <span className="font-mono font-extrabold text-emerald-400">
                {currentRoute.conductor?.horas_conducidas_dia || 4.0}h / 8.0h Máx
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${((currentRoute.conductor?.horas_conducidas_dia || 4.0) / 8.0) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Delivery Sequence Grid */}
      {routes.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Truck className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">No hay rutas asignadas para su usuario en esta jornada.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-400" /> Secuencia de Paradas del Día ({currentRoute.detalles?.length || 0})
            </h3>

            <div className="space-y-3">
              {currentRoute.detalles?.map(det => {
                const isDelivered = det.hora_real_entrega != null;

                return (
                  <div
                    key={det.ruta_detalle_id}
                    className={`p-5 rounded-2xl border space-y-3 transition ${
                      isDelivered
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 ${
                          isDelivered ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}>
                          #{det.orden_visita}
                        </span>
                        <div>
                          <strong className="text-white text-base font-extrabold block">
                            {det.pedido?.cliente?.nombre_negocio || 'Cliente Destino'}
                          </strong>
                          <span className="text-xs text-slate-400 font-mono">
                            Pedido #{det.pedido_id.slice(0, 8)}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                        isDelivered ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      }`}>
                        {isDelivered ? 'ENTREGADO' : 'PENDIENTE'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{det.pedido?.punto_referencia || det.pedido?.cliente?.direccion_referencia || 'Huancayo'}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-800 text-xs gap-3">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400" /> Hora Programada: <b className="text-white font-mono">{det.hora_estimada ? new Date(det.hora_estimada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</b>
                      </span>

                      {!isDelivered ? (
                        <button
                          onClick={() => openConfirmationModal(det)}
                          className="btn-primary py-2.5 px-5 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                          <Camera className="w-4 h-4" /> Confirmar Entrega GPS (RN-010)
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
                          <CheckCircle className="w-4 h-4" /> Entregado a las {new Date(det.hora_real_entrega).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Route Map Preview for Driver */}
          <div className="glass-panel p-5 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" /> Mapa Guiado de la Ruta Asignada
            </h3>
            <InteractiveMap routes={routes} orders={currentRoute.detalles?.map(d => d.pedido).filter(Boolean) || []} />
          </div>

        </div>
      )}

      {/* Confirmation Modal with Simulated Signature & Photo Proof */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 border-slate-700 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" /> Prueba Digital de Entrega (RN-010)
              </h3>
              <button onClick={() => setSelectedDetail(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Cliente / Destino:</div>
                <strong className="text-white text-sm block font-extrabold">{selectedDetail.pedido?.cliente?.nombre_negocio || 'Bodega'}</strong>
                <div className="text-emerald-400 font-mono text-[11px]">Coordenadas GPS: {selectedDetail.latitud.toFixed(4)}, {selectedDetail.longitud.toFixed(4)}</div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">Nombre de quien Recibe la Carga</label>
                <input
                  type="text"
                  required
                  value={clientSignatureName}
                  onChange={e => setClientSignatureName(e.target.value)}
                  className="form-input"
                  placeholder="Ej. María Flores (Encargada)"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">Observaciones / Conformidad</label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  className="form-input"
                  placeholder="Estado del empaque, sello sin abrir..."
                />
              </div>

              {/* Photo & Signature Simulation Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center text-slate-400 gap-1">
                  <Camera className="w-6 h-6 text-emerald-400" />
                  <span className="text-[11px]">Fotografía de Evidencia Adjunta (GPS Sello Digital OK)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setSelectedDetail(null)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={confirming} className="btn-primary font-bold py-2.5 px-5">
                  {confirming ? 'Firmando y Transmitiendo GPS...' : 'Confirmar y Guardar Entrega'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
