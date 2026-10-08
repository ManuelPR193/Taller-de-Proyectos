import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, MapPin, Clock, Truck, Plus, Search, CheckCircle2, ShieldCheck, Sparkles, Navigation, AlertCircle, ShoppingBag } from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';

export const PortalCliente = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  // Form for client to create an order
  const [form, setForm] = useState({
    nombre_negocio: '',
    distrito: 'El Tambo',
    contacto: '',
    direccion_referencia: '',
    latitud: -12.0528,
    longitud: -75.2104,
    peso_kg: 50,
    volumen_m3: 0.3,
    prioridad: 'ESTANDAR',
    tipo_producto: 'ALIMENTOS',
    ventana_inicio: '08:30',
    ventana_fin: '12:30'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [oData, cData, rData] = await Promise.all([
        api.getOrders(),
        api.getClients(),
        api.getRoutes()
      ]);
      setOrders(oData);
      setClients(cData);
      setRoutes(rData);
      if (oData.length > 0 && !selectedOrder) {
        setSelectedOrder(oData[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    try {
      // 1. First ensure or create client record
      let existingClient = clients.find(c => c.nombre_negocio.toLowerCase() === form.nombre_negocio.toLowerCase());
      let clientId = existingClient?.cliente_id;

      if (!clientId) {
        const newClient = await api.createClient({
          nombre_negocio: form.nombre_negocio,
          distrito: form.distrito,
          contacto: form.contacto,
          direccion_referencia: form.direccion_referencia,
          latitud: parseFloat(form.latitud),
          longitud: parseFloat(form.longitud)
        });
        clientId = newClient.cliente_id;
      }

      // 2. Create Order
      const todayStr = new Date().toISOString().split('T')[0];
      const inicioDt = `${todayStr}T${form.ventana_inicio}:00`;
      const finDt = `${todayStr}T${form.ventana_fin}:00`;


      const newOrder = await api.createOrder({
        cliente_id: clientId,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        punto_referencia: form.direccion_referencia || `Atención en ${form.distrito}`,
        peso_kg: parseFloat(form.peso_kg),
        volumen_m3: parseFloat(form.volumen_m3),
        prioridad: form.prioridad,
        tipo_producto: form.tipo_producto,
        ventana_inicio: inicioDt,
        ventana_fin: finDt
      });

      setSuccessMsg(`¡Pedido registado con éxito! Código de seguimiento: #${newOrder.pedido_id.slice(0, 8)}`);
      setShowNewOrderModal(false);
      loadData();
    } catch (err) {
      setError(err.message || "Error registrando pedido");
    }
  };

  // Find routing detail for selected order if assigned
  let assignedRouteInfo = null;
  if (selectedOrder) {
    for (const r of routes) {
      const detail = r.detalles?.find(d => d.pedido_id === selectedOrder.pedido_id);
      if (detail) {
        assignedRouteInfo = { route: r, detail };
        break;
      }
    }
  }

  const districtCoords = {
    'Huancayo Centro': { lat: -12.0656, lng: -75.2048 },
    'El Tambo': { lat: -12.0528, lng: -75.2104 },
    'Chilca': { lat: -12.0881, lng: -75.2012 },
    'Pilcomayo': { lat: -12.0490, lng: -75.2420 }
  };

  const handleDistrictSelect = (dist) => {
    const coords = districtCoords[dist] || districtCoords['El Tambo'];
    setForm(f => ({
      ...f,
      distrito: dist,
      latitud: coords.lat,
      longitud: coords.lng
    }));
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header Banner for Client Portal */}
      <div className="glass-panel p-6 border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4" /> Portal del Cliente & Bodegas del Valle del Mantaro
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Gestión de Pedidos & Rastreo Satelital en Tiempo Real
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Solicite despachos con flota ecológica DistriRápido S.A.C., consulte el estado de entrega y verifique su impacto ambiental positivo.
            </p>
          </div>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="btn-primary bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold py-3.5 px-6 shrink-0 shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <Plus className="w-5 h-5" /> Solicitar Nuevo Despacho
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Order List & Tracking Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Client Orders List */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" /> Mis Pedidos ({orders.length})
            </h3>
            <span className="text-xs text-slate-400">Actualizado live</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400 text-xs">Cargando pedidos...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No hay pedidos registrados.</div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {orders.map(ord => {
                const isSelected = selectedOrder?.pedido_id === ord.pedido_id;
                return (
                  <div
                    key={ord.pedido_id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <strong className="text-white text-sm truncate max-w-[160px]">
                        {ord.cliente?.nombre_negocio || 'Bodega'}
                      </strong>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        ord.estado === 'ENTREGADO' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : ord.estado === 'ASIGNADO'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      }`}>
                        {ord.estado}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{ord.punto_referencia || ord.cliente?.distrito}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                      <span>Prioridad: <b className={ord.prioridad === 'EXPRESS' ? 'text-red-400' : 'text-slate-200'}>{ord.prioridad}</b></span>
                      <span>Peso: <b className="text-white">{ord.peso_kg} kg</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Tracking & Status Cockpit */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <div className="glass-panel p-6 space-y-6 border-slate-700">
              
              {/* Order Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                    Código de Rastreo: #{selectedOrder.pedido_id.slice(0, 8)}
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-1">
                    {selectedOrder.cliente?.nombre_negocio || 'Bodega Destino'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {selectedOrder.punto_referencia} ({selectedOrder.cliente?.distrito || 'Huancayo'})
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center shrink-0">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Estado Actual</span>
                  <span className="text-base font-extrabold text-emerald-400">{selectedOrder.estado}</span>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Línea de Tiempo del Despacho Sostenible:
                </span>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  
                  {/* Step 1 */}
                  <div className={`p-3 rounded-xl border ${
                    selectedOrder.estado === 'PENDIENTE' || selectedOrder.estado === 'ASIGNADO' || selectedOrder.estado === 'ENTREGADO'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold text-white text-xs mb-1">1. Registrado</div>
                    <div className="text-[10px]">Orden recibida en sistema</div>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3 rounded-xl border ${
                    selectedOrder.estado === 'ASIGNADO' || selectedOrder.estado === 'ENTREGADO'
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold text-white text-xs mb-1">2. En Ruta Optimizada</div>
                    <div className="text-[10px]">Asignado a vehículo eco</div>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-3 rounded-xl border ${
                    selectedOrder.estado === 'ENTREGADO'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}>
                    <div className="font-bold text-white text-xs mb-1">3. Entregado con Exito</div>
                    <div className="text-[10px]">Confirmación GPS RN-010</div>
                  </div>

                </div>
              </div>

              {/* Driver & Vehicle Details if Assigned */}
              {assignedRouteInfo ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">Unidad Asignada</span>
                    <strong className="text-white font-bold text-sm flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      {assignedRouteInfo.route.vehiculo?.placa} ({assignedRouteInfo.route.vehiculo?.tipo})
                    </strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">Conductor a Cargo</span>
                    <strong className="text-white font-bold text-sm">
                      {assignedRouteInfo.route.conductor?.nombre || 'Conductor Flota'}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>El algoritmo VRPTW está calculando el mejor vehículo y horario para su entrega.</span>
                </div>
              )}

              {/* Map Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-400" /> Ubicación del Pedido en el Mapa de Huancayo
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    Lat: {selectedOrder.latitud.toFixed(4)}, Lng: {selectedOrder.longitud.toFixed(4)}
                  </span>
                </div>
                <InteractiveMap orders={[selectedOrder]} routes={assignedRouteInfo ? [assignedRouteInfo.route] : []} />
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400 text-sm">
              Seleccione un pedido a la izquierda para ver su rastreo en tiempo real.
            </div>
          )}
        </div>

      </div>

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 border-slate-700 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" /> Solicitar Nuevo Despacho de Mercadería
              </h3>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nombre de su Negocio / Bodega</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Bodega San Martín"
                  value={form.nombre_negocio}
                  onChange={e => setForm({ ...form, nombre_negocio: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Distrito de Huancayo</label>
                  <select
                    value={form.distrito}
                    onChange={e => handleDistrictSelect(e.target.value)}
                    className="form-input bg-slate-900"
                  >
                    <option value="El Tambo">El Tambo</option>
                    <option value="Huancayo Centro">Huancayo Centro</option>
                    <option value="Chilca">Chilca</option>
                    <option value="Pilcomayo">Pilcomayo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Teléfono de Contacto</label>
                  <input
                    type="text"
                    placeholder="964000111"
                    value={form.contacto}
                    onChange={e => setForm({ ...form, contacto: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Dirección Exacta o Referencia Local</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Av. Ferrocarril 1240, frente a la farmacia"
                  value={form.direccion_referencia}
                  onChange={e => setForm({ ...form, direccion_referencia: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Peso Aproximado (kg)</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={form.peso_kg}
                    onChange={e => setForm({ ...form, peso_kg: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Tipo de Servicio</label>
                  <select
                    value={form.prioridad}
                    onChange={e => setForm({ ...form, prioridad: e.target.value })}
                    className="form-input bg-slate-900"
                  >
                    <option value="ESTANDAR">ESTÁNDAR (Planificado)</option>
                    <option value="EXPRESS">EXPRESS (Despacho de Urgencia RN-004)</option>
                    <option value="ECONOMICO">ECONÓMICO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hora Preferida Recepción (Inicio)</label>
                  <input
                    type="time"
                    required
                    value={form.ventana_inicio}
                    onChange={e => setForm({ ...form, ventana_inicio: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hora Máxima Recepción (Fin)</label>
                  <input
                    type="time"
                    required
                    value={form.ventana_fin}
                    onChange={e => setForm({ ...form, ventana_fin: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowNewOrderModal(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Confirmar y Enviar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
