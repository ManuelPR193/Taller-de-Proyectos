import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Leaf, Trees, ShieldCheck, Download, Award, FileText, BarChart3, ArrowUpRight, Zap, RefreshCw, Layers } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export const PortalAuditor = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [downloading, setDownloading] = useState(false);

  // Simulation State
  const [simKm, setSimKm] = useState(120);
  const [simVehicleType, setSimVehicleType] = useState('FURGON_EURO5');

  const fetchMetrics = () => {
    setLoading(true);
    api.getDashboardMetrics(startDate, endDate)
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate]);

  const handleDownloadPDF = () => {
    setDownloading(true);
    const pdfUrl = `${api.getPDFReportUrl()}?fecha_inicio=${startDate}&fecha_fin=${endDate}`;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', `Certificado_Auditoria_ISO14064_Huancayo_${startDate}_${endDate}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  };

  // Calculations for eco simulator
  const factors = {
    'FURGON_EURO5': 0.22,
    'CAMIONETA_DIESEL': 0.28,
    'ALTO_EMISOR_OLD': 0.38,
    'MOTO_ECOLOGICA': 0.08
  };

  const currentFactor = factors[simVehicleType] || 0.22;
  const co2Emitted = roundToTwo(simKm * currentFactor);
  const co2Baseline = roundToTwo(simKm * 0.38);
  const co2Saved = roundToTwo(Math.max(0, co2Baseline - co2Emitted));

  function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
  }

  const districtData = {
    labels: ['El Tambo', 'Huancayo Centro', 'Chilca', 'Pilcomayo'],
    datasets: [
      {
        label: 'Emisiones Reales (kg CO₂)',
        data: [14.2, 19.8, 12.5, 7.3],
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 8,
      },
      {
        label: 'Ahorro Metaheurística VRPTW (kg CO₂)',
        data: [5.1, 6.4, 4.2, 2.9],
        backgroundColor: 'rgba(14, 165, 233, 0.85)',
        borderRadius: 8,
      }
    ]
  };

  const isoCategoryData = {
    labels: ['Scope 1 (Emisiones Directas Flota)', 'Scope 2 (Energía Eléctrica Recarga)', 'Compensación Forestal'],
    datasets: [
      {
        data: [68, 12, 20],
        backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b'],
        borderWidth: 0,
      }
    ]
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900/80 to-slate-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Portal del Auditor Ambiental & Certificación ISO 14064
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Auditoría de Huella de Carbono & Eficiencia Energética
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Evaluación rigurosa de emisiones de GEI, ahorro de combustible diésel y cumplimiento del estándar normativo RN-008 & RN-009 en el Valle del Mantaro.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold py-3.5 px-6 shrink-0 shadow-lg shadow-teal-500/20 hover:scale-105 transition flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>{downloading ? 'Generando PDF...' : 'Emitir Certificado PDF'}</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 text-xs border-slate-800">
        <div className="flex items-center gap-4">
          <span className="font-bold text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-teal-400" /> Rango de Auditoría:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="form-input py-1.5 px-3 bg-slate-900 text-xs"
            />
            <span className="text-slate-500">hasta</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="form-input py-1.5 px-3 bg-slate-900 text-xs"
            />
          </div>
        </div>

        <button
          onClick={fetchMetrics}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4 text-teal-400" /> Actualizar Datos
        </button>
      </div>

      {/* Audit KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 border-l-4 border-l-teal-500">
          <div className="text-slate-400 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>CO₂ Emitido Total (RN-008)</span>
            <Leaf className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics?.co2_total_kg || 0} <span className="text-sm font-semibold text-teal-400">kg</span></div>
          <p className="text-[11px] text-slate-400 mt-2">Basado en factores específicos por unidad</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="text-slate-400 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Compensación Forestal (RN-009)</span>
            <Trees className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics?.arboles_equivalentes || 0} <span className="text-sm font-semibold text-emerald-400">Árboles/Año</span></div>
          <p className="text-[11px] text-slate-400 mt-2">Capacidad absorción: 22kg CO₂/árbol</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-cyan-500">
          <div className="text-slate-400 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Combustible Reducido</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics?.combustible_ahorrado_l || 0} <span className="text-sm font-semibold text-cyan-400">Litros</span></div>
          <p className="text-[11px] text-slate-400 mt-2">Ahorro vs ruteo tradicional</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="text-slate-400 text-xs font-semibold mb-1 flex items-center justify-between">
            <span>Índice de Eficiencia Green VRP</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">+{metrics?.ahorro_vs_secuencial_porcentaje || 21.8}%</div>
          <p className="text-[11px] text-slate-400 mt-2">Optimización metaheurística</p>
        </div>

      </div>

      {/* Analytics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" /> Emisiones por Distrito en el Valle del Mantaro
          </h3>
          <p className="text-xs text-slate-400 mb-4">Métricas comparativas por zona urbana auditada.</p>
          <div className="h-72">
            <Bar
              data={districtData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#cbd5e1' } } },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                }
              }}
            />
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Desglose Estándar ISO 14064
            </h3>
            <p className="text-xs text-slate-400 mb-4">Distribución por categoría de alcance de GEI.</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={isoCategoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10 } } } }
              }}
            />
          </div>
        </div>

      </div>

      {/* Interactive Emission Simulator for Auditor */}
      <div className="glass-panel p-6 border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Simulador Interactivo de Emisiones de Flota (Auditoría Técnica)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calcule el impacto ambiental proyectado al cambiar parámetros de recorrido y tipo de vehículo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-xs">
          
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Distancia Recorrida Proyectada: {simKm} km</label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={simKm}
                onChange={e => setSimKm(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipo de Vehículo Auditado</label>
              <select
                value={simVehicleType}
                onChange={e => setSimVehicleType(e.target.value)}
                className="form-input bg-slate-900"
              >
                <option value="FURGON_EURO5">Furgón Estándar (0.22 kg CO₂/km)</option>
                <option value="CAMIONETA_DIESEL">Camioneta Diésel (0.28 kg CO₂/km)</option>
                <option value="ALTO_EMISOR_OLD">Alto Emisor &gt;15 años RN-002 (0.38 kg CO₂/km)</option>
                <option value="MOTO_ECOLOGICA">Motocicleta Reparto (0.08 kg CO₂/km)</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-3 gap-3 text-center">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Emisión Calculada</span>
              <strong className="text-emerald-400 text-2xl font-black">{co2Emitted} kg</strong>
              <span className="text-[10px] text-slate-500 block mt-1">CO₂ Proyectado</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Línea Base Antigua</span>
              <strong className="text-slate-400 text-2xl font-black">{co2Baseline} kg</strong>
              <span className="text-[10px] text-slate-500 block mt-1">Sin Optimización</span>
            </div>

            <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/40">
              <span className="text-emerald-400 text-[10px] uppercase font-bold block">Ahorro Neto Estimado</span>
              <strong className="text-emerald-300 text-2xl font-black">-{co2Saved} kg</strong>
              <span className="text-[10px] text-emerald-400 block mt-1">CO₂ Evitado</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
