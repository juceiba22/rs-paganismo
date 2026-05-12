import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { currentUser, appUser, signInWithGoogle, signInWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && currentUser) {
    if (!appUser || !appUser.name) return <Navigate to="/onboarding" replace />;
    if (appUser.role === 'pending') return <Navigate to="/pending" replace />;
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
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err?.message ?? String(err);
      if (msg.includes('wrong-password') || msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        setError('Tu contraseña no es correcta. Vuelve a comprobarla.');
      } else {
        setError('Ocurrió un error. Inténtalo de nuevo.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0a0a0a] border border-neutral-800 py-8 px-4 sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <h2 className="text-center text-4xl font-ritual font-bold text-white">Paganismo</h2>
          </div>

          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div>
              <input
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder-neutral-500"
                type="email"
                placeholder="Teléfono, usuario o correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder-neutral-500"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:opacity-50"
            >
              {busy ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0a0a0a] text-neutral-500 font-semibold uppercase">O</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogle}
                disabled={busy}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-blue-500 bg-transparent hover:text-white focus:outline-none disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Iniciar sesión con Google
              </button>
            </div>
            <div className="mt-4 text-center">
               <a href="#" className="text-xs text-neutral-300">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-[#0a0a0a] border border-neutral-800 py-4 px-4 sm:rounded-lg text-center">
          <p className="text-sm text-white">
            ¿No tienes una cuenta? <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
