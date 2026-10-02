import React, { useState } from 'react';
import { api } from '../services/api';
import { FileText, Download, ShieldCheck, CheckCircle2, Calendar, FileSpreadsheet, Sparkles } from 'lucide-react';

export const Reportes = () => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setDownloading(true);
    const pdfUrl = `${api.getPDFReportUrl()}?fecha_inicio=${startDate}&fecha_fin=${endDate}`;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', `Reporte_Sostenibilidad_Huancayo_${startDate}_${endDate}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-slate-800 space-y-3 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-emerald-950/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Generador de Reportes de Sostenibilidad (RF-006)</h2>
            <p className="text-slate-300 text-sm mt-0.5">Exportación oficial en formato PDF descargable para auditorías normativas y ambientales.</p>
          </div>
        </div>
      </div>

      {/* Date Filter & Export Box */}
      <div className="glass-panel p-6 space-y-6 border-emerald-500/30">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Parámetros del Reporte de Emisiones y Ciclo de Vida
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" /> Fecha Inicio del Periodo
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="form-input bg-slate-900"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" /> Fecha Fin del Periodo
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="form-input bg-slate-900"
            />
          </div>
        </div>

        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Contenido Certificado del Documento PDF:
          </div>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Resumen de Huella de Carbono Total (kg CO₂ emitidos - RN-008)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Litros de Combustible Ahorrados mediante la Metaheurística Green VRP</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Plan de Compensación de Árboles Equivalentes para Huancayo (RN-009)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Desglose por vehículo, placa, conductor y kilómetros recorridos</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Certificación de cumplimiento de jornada laboral máxima de 8 horas (RN-003)</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn-primary w-full py-4 text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25"
        >
          {downloading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Generando y Descargando PDF (RF-006)...</span>
            </div>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Descargar Reporte PDF de Sostenibilidad</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
