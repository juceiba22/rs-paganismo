import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import type { ArtisticRole } from '../types';
import './OnboardingPage.css';

const ROLES: { value: ArtisticRole; label: string; icon: string }[] = [
  { value: 'musician', label: 'Músico/a', icon: '♩' },
  { value: 'actor',    label: 'Actor/Actriz', icon: '◉' },
  { value: 'visual',   label: 'Arte Visual', icon: '◈' },
  { value: 'other',    label: 'Otro', icon: '◌' },
];

export default function OnboardingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.displayName ?? '');
  const [artisticRole, setArtisticRole] = useState<ArtisticRole>('other');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Por favor ingresa tu nombre.'); return; }
    if (!currentUser) return;
    setBusy(true);
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        email: currentUser.email ?? '',
        photoURL: currentUser.photoURL ?? '',
        role: 'extended',
        artisticRole,
        createdAt: serverTimestamp(),
      }, { merge: true });
      navigate('/');
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="login-bg" />
      <div className="onboarding-container">
        <div className="login-brand">
          <div className="login-sigil">◈</div>
          <h1 className="login-title font-ritual">Bienvenido/a</h1>
          <p className="login-tagline">Cuéntanos sobre ti</p>
        </div>

        <form className="card onboarding-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Tu nombre</label>
            <input
              className="input"
              type="text"
              placeholder="Cómo te conocemos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Tu disciplina</label>
            <div className="role-grid">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-card${artisticRole === r.value ? ' role-card--active' : ''}`}
                  onClick={() => setArtisticRole(r.value)}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn btn-primary w-full" type="submit" disabled={busy}>
            {busy ? 'Guardando...' : 'Continuar'}
          </button>
          <p className="onboarding-note">
            Tu cuenta quedará pendiente de aprobación por un administrador.
          </p>
        </form>
      </div>
    </div>
  );
}
