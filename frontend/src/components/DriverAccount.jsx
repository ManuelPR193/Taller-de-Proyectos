import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export function DriverAccount({ drivers }) {
  const { user } = useAuth();
  const [driverId, setDriverId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (user?.rol !== 'ADMINISTRADOR') return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const response = await api.linkDriver(driverId, email);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className="glass-panel p-5 space-y-3" onSubmit={handleSubmit}>
      <h3 className="font-bold">Vincular cuenta de conductor</h3>
      <p className="text-slate-300">
        Asigne una cuenta existente con rol conductor para que solo vea sus rutas.
      </p>
      <label className="block">
        Conductor
        <select
          className="form-input"
          required
          value={driverId}
          onChange={(event) => setDriverId(event.target.value)}
        >
          <option value="">Seleccione un conductor</option>
          {drivers.map((driver) => (
            <option key={driver.conductor_id} value={driver.conductor_id}>
              {driver.nombre}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        Correo de la cuenta
        <input
          className="form-input"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <button type="submit" className="btn-primary">Vincular cuenta</button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}
