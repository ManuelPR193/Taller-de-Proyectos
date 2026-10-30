import React, { lazy, Suspense, useEffect, useState } from 'react';

import { api, today } from '../services/api';

const RouteMap = lazy(() =>
  import('../components/InteractiveMap').then((module) => ({
    default: module.InteractiveMap,
  })),
);

export const ModoConductor = () => {
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  function loadRoutes() {
    setLoading(true);
    api.getRoutes(today())
      .then((response) => {
        setRoutes(response);
        setSelected((currentId) =>
          response.some((route) => route.ruta_id === currentId)
            ? currentId
            : response[0]?.ruta_id || '',
        );
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadRoutes, []);

  const selectedRoute = routes.find((route) => route.ruta_id === selected);

  async function deliver(detail) {
    setBusy(true);
    setError('');
    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('GPS no disponible'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
        });
      });
      await api.confirmDelivery(
        detail.ruta_detalle_id,
        position.coords.latitude,
        position.coords.longitude,
      );
      loadRoutes();
    } catch (deliveryError) {
      setError(
        deliveryError.message
          || 'No se pudo confirmar la entrega. Permita el acceso a su ubicación.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-bold">Mi ruta del día</h2>
      <p className="text-slate-300">{today()} · Solo rutas asignadas a su cuenta.</p>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">Cargando rutas...</p>
      ) : !selectedRoute ? (
        <p className="glass-panel p-5">
          No hay rutas asignadas para su usuario en esta jornada. Si corresponde, solicite al
          administrador vincular su cuenta al conductor.
        </p>
      ) : (
        <>
          <label className="block">
            Ruta asignada
            <select
              className="form-input"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
            >
              {routes.map((route) => (
                <option key={route.ruta_id} value={route.ruta_id}>
                  {route.vehiculo?.placa} · {route.estado}
                </option>
              ))}
            </select>
          </label>
          <p>
            {selectedRoute.conductor?.nombre} · {selectedRoute.distancia_total_km} km ·{' '}
            {selectedRoute.conductor?.horas_conducidas_dia ?? 0} horas conducidas
          </p>
          <ol className="space-y-3">
            {selectedRoute.detalles.map((detail) => (
              <li
                className="glass-panel p-4 flex flex-wrap gap-4 justify-between items-center"
                key={detail.ruta_detalle_id}
              >
                <span>
                  Parada {detail.orden_visita}:{' '}
                  {detail.pedido?.cliente?.nombre_negocio || 'Entrega'}
                </span>
                {detail.hora_real_entrega ? (
                  <strong>Entregado</strong>
                ) : (
                  <button
                    className="btn-primary"
                    disabled={busy}
                    onClick={() => deliver(detail)}
                  >
                    Confirmar entrega {detail.orden_visita} con GPS
                  </button>
                )}
              </li>
            ))}
          </ol>
          <Suspense fallback={<p>Cargando mapa; la lista de paradas ya está disponible.</p>}>
            <RouteMap routes={[selectedRoute]} />
          </Suspense>
        </>
      )}
    </section>
  );
};
