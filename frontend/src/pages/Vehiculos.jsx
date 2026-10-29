import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Truck, Plus, AlertCircle, ShieldAlert, CheckCircle2, Fuel, Gauge, Calendar, X } from 'lucide-react';

export const Vehiculos = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    placa: '',
    tipo: 'CAMIONETA',
    capacidad_kg: 800,
    consumo_km_l: 12.5,
    factor_emision_co2: 0.22,
    anio_fabricacion: 2022
  });

  const loadVehicles = () => {
    setLoading(true);
    api.getVehicles()
      .then(data => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createVehicle({
        ...form,
        capacidad_kg: parseFloat(form.capacidad_kg),
        consumo_km_l: parseFloat(form.consumo_km_l),
        factor_emision_co2: parseFloat(form.factor_emision_co2),
        anio_fabricacion: parseInt(form.anio_fabricacion, 10)
      });
      setShowModal(false);
      setForm({
        placa: '',
        tipo: 'CAMIONETA',
        capacidad_kg: 800,
        consumo_km_l: 12.5,
        factor_emision_co2: 0.22,
        anio_fabricacion: 2022
      });
      loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    if (filterType === 'ALL') return true;
    return v.tipo === filterType;
  });

  const changeStatus = async (vehicle, estado) => {
    setError(null);
    try {
      const result = await api.updateVehicleStatus(vehicle.vehiculo_id, estado);
      if (result.advertencia) setError(result.advertencia);
      loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">

      {/* Header Banner */}
      <div className="glass-panel p-6 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-blue-400" /> Gestión de Flota de Vehículos (RF-001)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Registro de unidades con factor de emisión de CO₂ y control automático de antigüedad (RN-002).
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Registrar Vehículo
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'FURGON', 'CAMIONETA', 'MOTO'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterType === t
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t === 'ALL' ? 'Todos los Vehículos' : t}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map(v => (
          <div
            key={v.vehiculo_id}
            className={`glass-card p-5 space-y-3.5 relative overflow-hidden ${
              v.es_alto_emisor ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-900/80' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-xl text-white tracking-wider">{v.placa}</span>
              <span className="badge-eco">{v.tipo}</span>
            </div>

            {/* RN-002 Warning Badge */}
            {v.es_alto_emisor && (
              <div className="badge-warning flex items-center gap-1.5 w-full justify-center py-1">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Alto Factor Emisión (RN-002: &gt;15 años)</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Capacidad</span>
                <strong className="text-white font-bold">{v.capacidad_kg} kg</strong>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Consumo</span>
                <strong className="text-white font-bold">{v.consumo_km_l} km/L</strong>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Factor CO₂</span>
                <strong className="text-emerald-400 font-bold">{v.factor_emision_co2} kg/km</strong>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Año Fab.</span>
                <strong className="text-white font-bold">{v.anio_fabricacion}</strong>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Estado: <strong className="text-emerald-300">{v.estado}</strong></span>
              </span>
            </div>
            <button type="button" className="btn-secondary w-full text-xs"
              onClick={() => changeStatus(v, v.estado === 'MANTENIMIENTO' ? 'DISPONIBLE' : 'MANTENIMIENTO')}>
              {v.estado === 'MANTENIMIENTO' ? 'Marcar disponible' : 'Reportar avería y reasignar'}
            </button>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 border-slate-700 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" /> Nuevo Vehículo de Flota
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
                <label className="block text-slate-300 mb-1 font-semibold">Placa del Vehículo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. W3F-892"
                  value={form.placa}
                  onChange={e => setForm({ ...form, placa: e.target.value })}
                  className="form-input uppercase font-mono tracking-wider"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Tipo de Vehículo</label>
                <select
                  value={form.tipo}
                  onChange={e => setForm({ ...form, tipo: e.target.value })}
                  className="form-input bg-slate-900"
                >
                  <option value="CAMIONETA">CAMIONETA</option>
                  <option value="FURGON">FURGÓN</option>
                  <option value="MOTO">MOTOCICLETA</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Capacidad (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.capacidad_kg}
                    onChange={e => setForm({ ...form, capacidad_kg: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Consumo (km/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.consumo_km_l}
                    onChange={e => setForm({ ...form, consumo_km_l: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Factor CO₂ (kg/km)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.factor_emision_co2}
                    onChange={e => setForm({ ...form, factor_emision_co2: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Año Fabricación</label>
                  <input
                    type="number"
                    required
                    value={form.anio_fabricacion}
                    onChange={e => setForm({ ...form, anio_fabricacion: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Vehículo</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
