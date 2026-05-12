import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { currentUser, appUser, signUpWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && currentUser) {
    if (!appUser || !appUser.name) return <Navigate to="/onboarding" replace />;
    if (appUser.role === 'pending') return <Navigate to="/pending" replace />;
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signUpWithEmail(email, password, username, displayName);
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err.message || String(err);
      if (msg.includes('email-already-in-use')) {
        setError('Este correo ya está registrado.');
      } else if (msg.includes('invalid-email')) {
        setError('El correo electrónico no es válido.');
      } else if (msg.includes('weak-password')) {
        setError('La contraseña es demasiado débil (mínimo 6 caracteres).');
      } else {
        setError(msg || 'Ocurrió un error. Inténtalo de nuevo.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-ritual font-bold text-white mb-2">Paganismo</h2>
        <p className="text-center text-sm text-neutral-400">Regístrate para ver fotos y videos</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0a0a0a] border border-neutral-800 py-8 px-4 sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder-neutral-500"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder-neutral-500"
                type="text"
                placeholder="Nombre completo"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder-neutral-500"
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
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
                minLength={6}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:opacity-50"
            >
              {busy ? 'Cargando...' : 'Registrarte'}
            </button>
          </form>
        </div>

        <div className="mt-4 bg-[#0a0a0a] border border-neutral-800 py-4 px-4 sm:rounded-lg text-center">
          <p className="text-sm text-neutral-400">
            ¿Tienes una cuenta? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
