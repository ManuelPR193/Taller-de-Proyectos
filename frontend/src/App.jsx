import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
const Rutas = lazy(() => import('./pages/Rutas').then(m => ({ default: m.Rutas })));
const Vehiculos = lazy(() => import('./pages/Vehiculos').then(m => ({ default: m.Vehiculos })));
const Conductores = lazy(() => import('./pages/Conductores').then(m => ({ default: m.Conductores })));
const Pedidos = lazy(() => import('./pages/Pedidos').then(m => ({ default: m.Pedidos })));
const ModoConductor = lazy(() => import('./pages/ModoConductor').then(m => ({ default: m.ModoConductor })));
const PortalAuditor = lazy(() => import('./pages/PortalAuditor').then(m => ({ default: m.PortalAuditor })));
const PortalCliente = lazy(() => import('./pages/PortalCliente').then(m => ({ default: m.PortalCliente })));
const Reportes = lazy(() => import('./pages/Reportes').then(m => ({ default: m.Reportes })));
import { Login } from './pages/Login';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.rol) {
    case 'ADMINISTRADOR':
      return <Dashboard />;
    case 'OPERADOR':
      return <Rutas />;
    case 'CONDUCTOR':
      return <ModoConductor />;
    case 'AUDITOR':
      return <PortalAuditor />;
    case 'CLIENTE':
      return <PortalCliente />;
    default:
      return <Dashboard />;
  }
};

const Guard = ({roles,children}) => { const {user}=useAuth(); return roles.includes(user?.rol)?children:<Navigate to="/" replace />; };

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Suspense fallback={<p role="status">Cargando vista...</p>}><Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/rutas" element={<Guard roles={['ADMINISTRADOR', 'OPERADOR']}><Rutas /></Guard>} />
          <Route path="/vehiculos" element={<Guard roles={['ADMINISTRADOR', 'OPERADOR']}><Vehiculos /></Guard>} />
          <Route path="/conductores" element={<Guard roles={['ADMINISTRADOR', 'OPERADOR']}><Conductores /></Guard>} />
          <Route path="/pedidos" element={<Guard roles={['ADMINISTRADOR', 'OPERADOR']}><Pedidos /></Guard>} />
          <Route path="/modo-conductor" element={<Guard roles={['ADMINISTRADOR', 'CONDUCTOR']}><ModoConductor /></Guard>} />
          <Route path="/portal-auditor" element={<Guard roles={['ADMINISTRADOR', 'AUDITOR']}><PortalAuditor /></Guard>} />
          <Route path="/portal-cliente" element={<Guard roles={['CLIENTE']}><PortalCliente /></Guard>} />
          <Route path="/reportes" element={<Guard roles={['ADMINISTRADOR', 'AUDITOR', 'OPERADOR']}><Reportes /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes></Suspense>
      </main>
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md">
        EcoLogística Huancayo © 2026 — Proyecto Final de Asignatura (PFA) | DistriRápido S.A.C.
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
