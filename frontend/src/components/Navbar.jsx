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
  ['/portal-cliente', 'Mis pedidos', ['CLIENTE']]
];
export const Navbar = () => {
  const { user, logoutUser } = useAuth();
  return <header className="operations-nav">
    <div className="operations-nav-inner">
      <div className="operations-nav-top">
        <h1 className="operations-wordmark"><span className="brand-symbol">E</span><span>EcoLogística <strong>Huancayo</strong></span></h1>
        <div className="operations-account"><span>{user.nombre_completo || user.email} <small>{user.rol}</small></span><button className="btn-secondary" title="Cerrar sesión" onClick={logoutUser}>Cerrar sesión</button></div>
      </div>
      <nav aria-label="Navegación principal" className="operations-links">
        {LINKS.filter(([, , roles]) => roles.includes(user.rol)).map(([path, label]) => <NavLink key={path} to={path} end className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>)}
      </nav>
    </div>
  </header>;
};
