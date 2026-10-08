import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Truck, Users, Package, MapPin, BarChart3, FileText, UserCheck, LogOut, ShieldCheck, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';

export const Navbar = () => {
  const { user, switchRole, logoutUser } = useAuth();
  const navigate = useNavigate();

  const roleColors = {
    ADMINISTRADOR: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    OPERADOR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    CONDUCTOR: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    CLIENTE: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    AUDITOR: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    // Navigate automatically to the primary portal for that role
    switch (newRole) {
      case 'ADMINISTRADOR':
        navigate('/');
        break;
      case 'OPERADOR':
        navigate('/rutas');
        break;
      case 'CONDUCTOR':
        navigate('/modo-conductor');
        break;
      case 'AUDITOR':
        navigate('/portal-auditor');
        break;
      case 'CLIENTE':
        navigate('/portal-cliente');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/90 px-6 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform hover:rotate-6 transition">
            <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              EcoLogística <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">Huancayo</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">DistriRápido S.A.C. — Valle del Mantaro</p>
          </div>
        </div>

        {/* Navigation Links Tailored to the Current Role */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          
          {/* ADMINISTRADOR Navigation */}
          {user?.rol === 'ADMINISTRADOR' && (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Admin Dashboard
              </NavLink>
              <NavLink
                to="/rutas"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <MapPin className="w-4 h-4 text-teal-400" /> Rutas Optimizadas
              </NavLink>
              <NavLink
                to="/vehiculos"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Truck className="w-4 h-4 text-blue-400" /> Flota
              </NavLink>
              <NavLink
                to="/conductores"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Users className="w-4 h-4 text-indigo-400" /> Conductores
              </NavLink>
              <NavLink
                to="/pedidos"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Package className="w-4 h-4 text-amber-400" /> Pedidos
              </NavLink>
              <NavLink
                to="/portal-auditor"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" /> Auditoría
              </NavLink>
              <NavLink
                to="/reportes"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <FileText className="w-4 h-4 text-rose-400" /> Reportes PDF
              </NavLink>
            </>
          )}

          {/* OPERADOR LOGISTICO Navigation */}
          {user?.rol === 'OPERADOR' && (
            <>
              <NavLink
                to="/rutas"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <MapPin className="w-4 h-4 text-teal-400" /> Despacho de Rutas
              </NavLink>
              <NavLink
                to="/pedidos"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Package className="w-4 h-4 text-amber-400" /> Pedidos Georreferenciados
              </NavLink>
              <NavLink
                to="/vehiculos"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Truck className="w-4 h-4 text-blue-400" /> Flota
              </NavLink>
              <NavLink
                to="/conductores"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Users className="w-4 h-4 text-indigo-400" /> Conductores
              </NavLink>
            </>
          )}

          {/* CONDUCTOR Navigation */}
          {user?.rol === 'CONDUCTOR' && (
            <>
              <NavLink
                to="/modo-conductor"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <UserCheck className="w-4 h-4 text-blue-400" /> Cockpit Conductor
              </NavLink>
              <NavLink
                to="/reportes"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <FileText className="w-4 h-4 text-rose-400" /> Mis Reportes
              </NavLink>
            </>
          )}

          {/* AUDITOR Navigation */}
          {user?.rol === 'AUDITOR' && (
            <>
              <NavLink
                to="/portal-auditor"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" /> Portal Auditoría GEI
              </NavLink>
              <NavLink
                to="/reportes"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <FileText className="w-4 h-4 text-rose-400" /> Descargar Certificados PDF
              </NavLink>
            </>
          )}

          {/* CLIENTE Navigation */}
          {user?.rol === 'CLIENTE' && (
            <>
              <NavLink
                to="/portal-cliente"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" /> Mis Pedidos & Rastreo Live
              </NavLink>
            </>
          )}

        </nav>

        {/* User Profile & Interactive Role Selector */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4 shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-xs text-slate-950 flex items-center justify-center shadow-md">
            {getInitials(user?.nombre_completo)}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate max-w-[130px]">{user?.nombre_completo || 'Usuario'}</span>
              <button
                onClick={logoutUser}
                title="Cerrar Sesión"
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Role Switcher Select */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-400 font-medium">Cambiar Rol:</span>
              <select
                value={user?.rol || 'ADMINISTRADOR'}
                onChange={(e) => handleRoleChange(e.target.value)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border outline-none cursor-pointer bg-slate-900 transition ${roleColors[user?.rol] || 'bg-slate-800 text-white'}`}
              >
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="OPERADOR">OPERADOR LOGÍSTICO</option>
                <option value="CONDUCTOR">CONDUCTOR FLOTA</option>
                <option value="AUDITOR">AUDITOR AMBIENTAL</option>
                <option value="CLIENTE">CLIENTE FINAL / BODEGA</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
