import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, User, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, UserPlus, LogIn, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('admin@distrirapido.pe');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('CLIENTE');

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const data = await api.login(loginEmail, loginPassword);
      loginUser({
        usuario_id: data.usuario_id,
        email: data.email,
        rol: data.rol,
        nombre_completo: data.nombre_completo
      }, data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const registered = await api.register(regEmail, regPassword, regRole, regName);
      setSuccessMsg(`¡Cuenta creada con éxito para ${registered.email}! Iniciando sesión automáticamente...`);
      
      // Auto login right after registration
      setTimeout(async () => {
        try {
          const loginData = await api.login(regEmail, regPassword);
          loginUser({
            usuario_id: loginData.usuario_id,
            email: loginData.email,
            rol: loginData.rol,
            nombre_completo: loginData.nombre_completo
          }, loginData.access_token);
        } catch {
          setActiveTab('login');
          setLoginEmail(regEmail);
          setLoginPassword('');
        }
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, pass) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setError(null);
  };

  const rolesList = [{ key: 'CLIENTE', label: 'Cliente', desc: 'Consulta de pedidos y entregas' }];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background ambient glow shapes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel w-full max-w-lg p-8 border-slate-700/60 shadow-2xl relative z-10 animate-fade-in space-y-6">
        
        {/* Header branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition">
            <Leaf className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              EcoLogística <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">Huancayo</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Plataforma Inteligente de Transporte Sostenible — DistriRápido S.A.C.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); setSuccessMsg(null); }}
            className={`py-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LogIn className="w-4 h-4" /> Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); setSuccessMsg(null); }}
            className={`py-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Crear Cuenta
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <span className="font-semibold block">Atención:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-semibold">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="usuario@distrirapido.pe"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-semibold">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold mt-2 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Verificando credenciales...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Ingresar a la Plataforma</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              )}
            </button>
          </form>
        )}

        {/* FORM 2: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-semibold">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Ej. Manuel Párraga"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-semibold">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="nuevo.usuario@distrirapido.pe"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-semibold">Contraseña Segura</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Crea una contraseña (mín. 6 caract.)"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-semibold">Rol del Usuario en la Empresa</label>
              <div className="grid grid-cols-2 gap-2">
                {rolesList.map(r => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRegRole(r.key)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      regRole === r.key
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{r.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold mt-2 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Registrando usuario...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Crear Cuenta Ahora</span>
                  <UserPlus className="w-4 h-4 group-hover:scale-110 transition" />
                </div>
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Access Credentials */}
        {activeTab === 'login' && (
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium">Accesos Rápidos Demo (1-Click):</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@distrirapido.pe', 'admin123')}
                className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-left transition hover:bg-slate-800/50"
              >
                <div className="text-white font-semibold">🔑 Admin Demo</div>
                <div className="text-[10px] font-mono text-emerald-400">admin@distrirapido.pe</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('operador@distrirapido.pe', 'operador123')}
                className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-left transition hover:bg-slate-800/50"
              >
                <div className="text-white font-semibold">📦 Operador Demo</div>
                <div className="text-[10px] font-mono text-emerald-400">operador@distrirapido.pe</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('conductor@distrirapido.pe', 'conductor123')}
                className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-left transition hover:bg-slate-800/50"
              >
                <div className="text-white font-semibold">🚚 Conductor Demo</div>
                <div className="text-[10px] font-mono text-emerald-400">conductor@distrirapido.pe</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('auditor@distrirapido.pe', 'auditor123')}
                className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-left transition hover:bg-slate-800/50"
              >
                <div className="text-white font-semibold">🌿 Auditor Demo</div>
                <div className="text-[10px] font-mono text-emerald-400">auditor@distrirapido.pe</div>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
