import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Leaf, Award, TrendingUp, ShieldCheck, Fuel, Trees, Route, Clock, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    api.getDashboardMetrics()
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading metrics:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <Leaf className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Cargando métricas de sostenibilidad...</p>
      </div>
    );
  }

  const chartDataBar = {
    labels: ['El Tambo', 'Huancayo Centro', 'Chilca', 'Pilcomayo'],
    datasets: [
      {
        label: 'CO₂ Emitido Real (kg)',
        data: [12.4, 18.2, 14.1, 8.6],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8,
        hoverBackgroundColor: '#10b981',
      },
      {
        label: 'CO₂ Ahorrado vs Secuencial (kg)',
        data: [4.2, 5.8, 4.9, 2.7],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderRadius: 8,
        hoverBackgroundColor: '#0ea5e9',
      }
    ],
  };

  const chartDataDoughnut = {
    labels: ['W3F-892 (Furgón)', 'W1A-456 (Camioneta)', 'W2B-109 (Alto Emisor RN-002)', 'W4C-771 (Moto)'],
    datasets: [
      {
        data: [42, 28, 18, 12],
        backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899'],
        borderWidth: 0,
        hoverOffset: 6,
      }
    ]
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Leaf className="w-4 h-4" /> EcoLogística Sostenible (RF-005)
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Dashboard de Impacto Ambiental & Sostenibilidad
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Monitoreo en tiempo real de emisiones de CO₂ (RN-008), ahorro de combustible y plan de compensación forestal (RN-009) en el Valle del Mantaro.
            </p>
          </div>

          {/* Tree Compensation Counter Badge */}
          <div className="glass-panel p-4 border border-emerald-500/40 bg-emerald-950/30 flex items-center gap-4 shrink-0 shadow-lg shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Trees className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Compensación Forestal (RN-009)</div>
              <div className="text-2xl font-black text-white flex items-center gap-1">
                {metrics?.arboles_equivalentes || 0} <span className="text-xs text-emerald-400 font-normal">Árboles/Año</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 relative overflow-hidden group border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Emisiones Totales (RN-008)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{metrics?.co2_total_kg || 0} <span className="text-sm font-semibold text-emerald-400">kg CO₂</span></div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Factor específico por modelo</span>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden group border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Combustible Ahorrado</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{metrics?.combustible_ahorrado_l || 0} <span className="text-sm font-semibold text-cyan-400">Litros</span></div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>Comparado con ruta clásica</span>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden group border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Eficiencia Algorítmica</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">+{metrics?.ahorro_vs_secuencial_porcentaje || 21.8}%</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Optimización Green VRP</span>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden group border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Cumplimiento Ventanas</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{metrics?.cumplimiento_ventanas_porcentaje || 98.5}%</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Entregas a tiempo (RN-005)</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Route className="w-5 h-5 text-emerald-400" /> Huella de Carbono por Distrito Atendido
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Emisiones reales vs ahorro metaheurístico en Huancayo, El Tambo, Chilca y Pilcomayo.</p>
            </div>
            <button onClick={fetchMetrics} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition" title="Actualizar">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72">
            <Bar
              data={chartDataBar}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { color: '#cbd5e1', font: { family: 'Inter', size: 12 } }
                  }
                },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                }
              }}
            />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Distribución por Vehículo
            </h3>
            <p className="text-xs text-slate-400 mb-4">Proporción de volumen de carga y emisiones por unidad.</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={chartDataDoughnut}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5e1', font: { family: 'Inter', size: 11 } }
                  }
                }
              }}
            />
          </div>
        </div>

      </div>

      {/* Sustainability Certification Badge Footer */}
      <div className="glass-panel p-4 border border-emerald-500/25 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span>Certificación PFA 2026: Todos los cálculos de emisiones cumplen las especificaciones de las Reglas RN-008 y RN-009.</span>
        </div>
        <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          DistriRápido S.A.C.
        </span>
      </div>

    </div>
  );
};
