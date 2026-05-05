import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { currentUser, appUser, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && currentUser && appUser) {
    if (appUser.role === 'pending') return <Navigate to="/pending" replace />;
    if (!appUser.name) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/" replace />;
  }

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try { await signInWithGoogle(); }
    catch { setError('Error al iniciar sesión con Google.'); }
    finally { setBusy(false); }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await signInWithEmail(email, password);
      else await signUpWithEmail(email, password);
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const msg = (err as { message?: string })?.message ?? String(err);
      
      if (msg.includes('wrong-password') || msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        setError('Credenciales incorrectas.');
      } else if (msg.includes('email-already-in-use')) {
        setError('Este correo ya está registrado.');
      } else if (msg.includes('invalid-email')) {
        setError('El correo electrónico no es válido.');
      } else if (msg.includes('weak-password')) {
        setError('La contraseña es demasiado débil (mínimo 6 caracteres).');
      } else if (msg.includes('permission-denied')) {
        setError('No tienes permisos suficientes.');
      } else {
        setError(msg || 'Ocurrió un error. Inténtalo de nuevo.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-container">
        <div className="login-brand">
          <div className="login-sigil">⬡</div>
          <h1 className="login-title font-ritual">Paganismo</h1>
          <p className="login-tagline">Comunidad creativa cerrada</p>
        </div>

        <div className="login-card card">
          <div className="login-tabs">
            <button
              className={`login-tab${mode === 'login' ? ' login-tab--active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >Ingresar</button>
            <button
              className={`login-tab${mode === 'register' ? ' login-tab--active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >Registrarse</button>
          </div>

          <button
            className="btn btn-ghost google-btn"
            onClick={handleGoogle}
            disabled={busy}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="divider-text">o</div>

          <form className="login-form" onSubmit={handleEmailSubmit}>
            <div className="field">
              <label>Correo electrónico</label>
              <input
                className="input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="login-error">{error}</p>}
            <button className="btn btn-primary w-full" type="submit" disabled={busy}>
              {busy ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="login-notice">
          Acceso restringido · Solo miembros invitados
        </p>
      </div>
    </div>
  );
}
