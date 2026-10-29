import React from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LINKS = [
  ['/', 'Dashboard', ['ADMINISTRADOR']],
  ['/rutas', 'Rutas', ['ADMINISTRADOR', 'OPERADOR']],
  ['/vehiculos', 'Flota', ['ADMINISTRADOR', 'OPERADOR']],
  ['/conductores', 'Conductores', ['ADMINISTRADOR', 'OPERADOR']],
  ['/pedidos', 'Pedidos', ['ADMINISTRADOR', 'OPERADOR']],
  ['/modo-conductor', 'Mi ruta', ['CONDUCTOR']],
  ['/portal-auditor', 'Auditoría', ['ADMINISTRADOR', 'AUDITOR']],
  ['/reportes', 'Reportes', ['ADMINISTRADOR', 'AUDITOR', 'OPERADOR']],
  ['/portal-cliente', 'Mis pedidos', ['CLIENTE']],
];

export const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <header className="border-b border-slate-700 p-4 bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-wrap justify-between gap-3">
          <h1 className="text-xl font-bold">
            EcoLogística <span className="text-emerald-300">Huancayo</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>{user.nombre_completo || user.email} · {user.rol}</span>
            <button className="btn-secondary" title="Cerrar sesión" onClick={logoutUser}>
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav aria-label="Navegación principal" className="flex flex-wrap gap-2">
          {LINKS.filter(([, , roles]) => roles.includes(user.rol)).map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg ${
                  isActive
                    ? 'bg-emerald-900 text-white'
                    : 'text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
