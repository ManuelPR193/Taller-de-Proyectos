import React, { useState } from 'react';
import { api, today } from '../services/api';
export const Reportes = () => {
  const [start, setStart] = useState(() => `${today().slice(0, 8)}01`);
  const [end, setEnd] = useState(today);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function download(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api.downloadPDF(start, end);
      setMessage('Reporte generado. La descarga está lista.');
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div className="glass-panel p-6">
        <h2 className="text-3xl font-bold">Reporte de sostenibilidad</h2>
        <p className="mt-3 text-slate-300">
          Emisiones, distancia, ahorro estimado, cumplimiento de entregas y compensación
          equivalente, con los días sin información identificados.
        </p>
      </div>
      <form onSubmit={download} className="glass-panel p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            Desde
            <input
              className="form-input mt-1"
              type="date"
              required
              max={end}
              value={start}
              onChange={(event) => setStart(event.target.value)}
            />
          </label>
          <label>
            Hasta
            <input
              className="form-input mt-1"
              type="date"
              required
              min={start}
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            />
          </label>
        </div>
        <p className="text-slate-300">
          Seleccione hasta 367 días. El reporte utiliza los mismos cálculos que el dashboard.
        </p>
        <button className="btn-primary" disabled={busy}>
          {busy ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
        {error && <p role="alert" className="text-red-200">{error}</p>}
        {message && <p role="status">{message}</p>}
      </form>
    </section>
  );
};
