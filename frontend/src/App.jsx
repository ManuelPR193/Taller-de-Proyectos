import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Rutas } from './pages/Rutas';
import { Vehiculos } from './pages/Vehiculos';
import { Conductores } from './pages/Conductores';
import { Pedidos } from './pages/Pedidos';
import { ModoConductor } from './pages/ModoConductor';
import { PortalAuditor } from './pages/PortalAuditor';
import { PortalCliente } from './pages/PortalCliente';
import { Reportes } from './pages/Reportes';
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

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/rutas" element={<Rutas />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/conductores" element={<Conductores />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/modo-conductor" element={<ModoConductor />} />
          <Route path="/portal-auditor" element={<PortalAuditor />} />
          <Route path="/portal-cliente" element={<PortalCliente />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 bg-slate-950/80 backdrop-blur-md">
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
