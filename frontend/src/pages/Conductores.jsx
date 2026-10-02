import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, Plus, ShieldCheck, Clock, AlertCircle, Phone, CreditCard, Award, X } from 'lucide-react';

export const Conductores = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    categoria_licencia: 'A-IIb',
    anios_experiencia: 5,
    horas_conducidas_dia: 4.0,
    contacto: ''
  });

  const loadDrivers = () => {
    setLoading(true);
    api.getDrivers()
      .then(data => {
        setDrivers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createDriver({
        ...form,
        anios_experiencia: parseInt(form.anios_experiencia, 10),
        horas_conducidas_dia: parseFloat(form.horas_conducidas_dia)
      });
      setShowModal(false);
      setForm({
        nombre: '',
        dni: '',
        categoria_licencia: 'A-IIb',
        anios_experiencia: 5,
        horas_conducidas_dia: 4.0,
        contacto: ''
      });
      loadDrivers();
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
            <Users className="w-6 h-6 text-indigo-400" /> Registro y Gestión de Conductores (RF-008)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Personal de conducción con validación estricta de jornada laboral máxima de 8 horas (RN-003 - Ley N° 30224).
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Registrar Conductor
        </button>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map(d => {
          const hoursPct = Math.min((d.horas_conducidas_dia / 8.0) * 100, 100);
          const isOverLimit = d.horas_conducidas_dia > 8.0;

          return (
            <div key={d.conductor_id} className="glass-card p-5 space-y-3.5 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">{d.nombre}</h3>
                <span className="badge-eco">{d.categoria_licencia}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> DNI:</span>
                  <span className="font-mono font-bold text-white">{d.dni}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Experiencia:</span>
                  <span className="font-bold text-white">{d.anios_experiencia} años</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Contacto:</span>
                  <span className="font-medium text-slate-200">{d.contacto || 'No especificado'}</span>
                </div>
              </div>

              {/* RN-003 Driving Hours Progress Bar */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Jornada (RN-003):
                  </span>
                  <span className={`font-bold ${isOverLimit ? 'text-red-400' : 'text-emerald-400'}`}>
                    {d.horas_conducidas_dia}h / 8.0h máx
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverLimit
                        ? 'bg-red-500'
                        : hoursPct > 75
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${hoursPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 border-slate-700 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> Nuevo Conductor
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
                <label className="block text-slate-300 mb-1 font-semibold">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Mendoza Alarcón"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">DNI (8 dígitos)</label>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    placeholder="45892301"
                    value={form.dni}
                    onChange={e => setForm({ ...form, dni: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Categoría Licencia</label>
                  <select
                    value={form.categoria_licencia}
                    onChange={e => setForm({ ...form, categoria_licencia: e.target.value })}
                    className="form-input bg-slate-900"
                  >
                    <option value="A-IIa">A-IIa</option>
                    <option value="A-IIb">A-IIb</option>
                    <option value="A-IIIa">A-IIIa</option>
                    <option value="A-IIIb">A-IIIb</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Años Experiencia</label>
                  <input
                    type="number"
                    required
                    value={form.anios_experiencia}
                    onChange={e => setForm({ ...form, anios_experiencia: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Horas Conducidas/Día (RN-003)</label>
                  <input
                    type="number"
                    step="0.5"
                    max="8.0"
                    required
                    value={form.horas_conducidas_dia}
                    onChange={e => setForm({ ...form, horas_conducidas_dia: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Teléfono / Contacto</label>
                <input
                  type="text"
                  placeholder="964123456"
                  value={form.contacto}
                  onChange={e => setForm({ ...form, contacto: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Conductor</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
