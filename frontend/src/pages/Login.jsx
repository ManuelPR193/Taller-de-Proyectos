import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { loginUser } = useAuth();
  const demo = import.meta.env.DEV;
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState(demo ? 'admin@distrirapido.pe' : '');
  const [password, setPassword] = useState(demo ? 'admin123' : '');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const enter = data => loginUser({ usuario_id: data.usuario_id, email: data.email, rol: data.rol, nombre_completo: data.nombre_completo }, data.access_token);
  const submit = async event => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (tab === 'register') await api.register(email, password, 'CLIENTE', name);
      enter(await api.login(email, password));
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <main className="login-shell">
    <section className="login-story" aria-label="EcoLogística Huancayo">
      <div className="brand-mark"><span className="brand-symbol">E</span><span>EcoLogística<br /><strong>Huancayo</strong></span></div>
      <div className="login-story-copy" data-enter>
        <p className="eyebrow">CENTRO DE OPERACIONES · HUANCAYO</p>
        <h1>La operación, en una sola vista.</h1>
        <p>Planifica rutas, sigue entregas y consulta el impacto de cada recorrido con información de la operación.</p>
      </div>
      <div className="login-story-foot"><span>RUTAS</span><span>PEDIDOS</span><span>FLOTA</span></div>
    </section>
    <section className="login-access" aria-labelledby="access-title">
      <div className="login-form-wrap">
        <p className="eyebrow">ACCESO A LA PLATAFORMA</p>
        <h2 id="access-title">{tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta de cliente'}</h2>
        <p className="muted">{tab === 'login' ? 'Ingresa con tu cuenta para continuar.' : 'Consulta tus pedidos y entregas desde tu cuenta.'}</p>
        <div className="login-tabs" role="group" aria-label="Tipo de acceso">
          <button type="button" aria-pressed={tab === 'login'} onClick={() => { setTab('login'); setError(''); }}>Ingresar</button>
          <button type="button" aria-pressed={tab === 'register'} onClick={() => { setTab('register'); setError(''); }}>Crear cuenta</button>
        </div>
        <form onSubmit={submit} className="login-form">
          {tab === 'register' && <label>Nombre completo<input className="form-input" required value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>}
          <label>Correo electrónico<input className="form-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
          <label>Contraseña<input className="form-input" type="password" required minLength={tab === 'register' ? 6 : undefined} value={password} onChange={e => setPassword(e.target.value)} autoComplete={tab === 'register' ? 'new-password' : 'current-password'} /></label>
          {error && <p role="alert" className="form-error">{error}</p>}
          <button type="submit" className="btn-primary login-submit" disabled={busy}>{busy ? 'Procesando…' : tab === 'login' ? 'Ingresar a la plataforma →' : 'Crear cuenta e ingresar →'}</button>
        </form>
        {demo && tab === 'login' && <div className="demo-access"><p>ACCESOS DE DESARROLLO</p><div>{[['Administrador', 'admin@distrirapido.pe', 'admin123'], ['Operador', 'operador@distrirapido.pe', 'operador123'], ['Conductor', 'conductor@distrirapido.pe', 'conductor123'], ['Auditor', 'auditor@distrirapido.pe', 'auditor123']].map(([role, mail, pass]) => <button key={role} type="button" onClick={() => { setEmail(mail); setPassword(pass); setError(''); }}>{role}</button>)}</div></div>}
      </div>
    </section>
  </main>;
};
