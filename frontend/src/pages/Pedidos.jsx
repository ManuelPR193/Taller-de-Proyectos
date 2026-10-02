import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Package, Plus, MapPin, Clock, AlertCircle, Zap, Building, CheckCircle, X } from 'lucide-react';

export const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    cliente_id: '',
    latitud: -12.0528,
    longitud: -75.2104,
    punto_referencia: '',
    peso_kg: 150.0,
    volumen_m3: 0.8,
    prioridad: 'ESTANDAR',
    tipo_producto: 'NO_PERECEDERO',
    ventana_inicio: '09:00',
    ventana_fin: '13:00'
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getOrders(), api.getClients()])
      .then(([oData, cData]) => {
        setOrders(oData);
        setClients(cData);
        if (cData.length > 0 && !form.cliente_id) {
          setForm(f => ({
            ...f,
            cliente_id: cData[0].cliente_id,
            latitud: cData[0].latitud,
            longitud: cData[0].longitud
          }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClientChange = (cliId) => {
    const selected = clients.find(c => c.cliente_id === cliId);
    if (selected) {
      setForm(f => ({
        ...f,
        cliente_id: cliId,
        latitud: selected.latitud,
        longitud: selected.longitud,
        punto_referencia: selected.direccion_referencia || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const inicioDt = `${todayStr}T${form.ventana_inicio}:00Z`;
      const finDt = `${todayStr}T${form.ventana_fin}:00Z`;

      await api.createOrder({
        cliente_id: form.cliente_id,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        punto_referencia: form.punto_referencia,
        peso_kg: parseFloat(form.peso_kg),
        volumen_m3: parseFloat(form.volumen_m3),
        prioridad: form.prioridad,
        tipo_producto: form.tipo_producto,
        ventana_inicio: inicioDt,
        ventana_fin: finDt
      });
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (priorityFilter === 'ALL') return true;
    return o.prioridad === priorityFilter;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-amber-400" /> Registro de Pedidos Georreferenciados (RF-002)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Pedidos para bodegas y mercados de Huancayo, El Tambo, Chilca y Pilcomayo con ventanas de tiempo.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Nuevo Pedido
        </button>
      </div>

      {/* Priority Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'EXPRESS', 'ESTANDAR', 'ECONOMICO'].map(p => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              priorityFilter === p
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p === 'ALL' ? 'Todos los Pedidos' : p}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map(o => (
          <div key={o.pedido_id} className="glass-card p-5 space-y-3.5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white text-base leading-tight">
                {o.cliente?.nombre_negocio || 'Bodega'}
              </h3>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${
                o.prioridad === 'EXPRESS'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}>
                {o.prioridad}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-start gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="truncate">{o.punto_referencia || 'Sin referencia registrada'}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                <span>Distrito: <strong className="text-white font-semibold">{o.cliente?.distrito || 'Huancayo'}</strong></span>
                <span>Peso: <strong className="text-white font-semibold">{o.peso_kg} kg</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Ventana:
              </span>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                {new Date(o.ventana_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(o.ventana_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 border-slate-700 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" /> Nuevo Pedido Georreferenciado
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Cliente / Bodega Destino</label>
                <select
                  value={form.cliente_id}
                  onChange={e => handleClientChange(e.target.value)}
                  className="form-input bg-slate-900"
                >
                  {clients.map(c => (
                    <option key={c.cliente_id} value={c.cliente_id}>
                      {c.nombre_negocio} ({c.distrito})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Latitud GPS</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={form.latitud}
                    onChange={e => setForm({ ...form, latitud: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Longitud GPS</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={form.longitud}
                    onChange={e => setForm({ ...form, longitud: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Punto de Referencia (Dirección Local)</label>
                <input
                  type="text"
                  placeholder="Ej. Frente al Mercado Mayorista, paradero Molinos"
                  value={form.punto_referencia}
                  onChange={e => setForm({ ...form, punto_referencia: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.peso_kg}
                    onChange={e => setForm({ ...form, peso_kg: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Prioridad</label>
                  <select
                    value={form.prioridad}
                    onChange={e => setForm({ ...form, prioridad: e.target.value })}
                    className="form-input bg-slate-900"
                  >
                    <option value="EXPRESS">EXPRESS (Urgente)</option>
                    <option value="ESTANDAR">ESTÁNDAR</option>
                    <option value="ECONOMICO">ECONÓMICO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hora Inicio Ventana</label>
                  <input
                    type="time"
                    required
                    value={form.ventana_inicio}
                    onChange={e => setForm({ ...form, ventana_inicio: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hora Fin Ventana</label>
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
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
