import React from 'react';
import { useAuth } from '../context/AuthContext';
import './PendingPage.css';

export default function PendingPage() {
  const { logout, appUser } = useAuth();

  return (
    <div className="pending-page">
      <div className="login-bg" />
      <div className="pending-container">
        <div className="pending-sigil">◑</div>
        <h1 className="pending-title font-ritual">Acceso Pendiente</h1>
        <p className="pending-body">
          Hola, <strong>{appUser?.name || 'creador/a'}</strong>.<br />
          Tu solicitud de acceso está siendo revisada por un administrador.<br />
          Te notificarán cuando tu cuenta sea activada.
        </p>
        <div className="pending-divider" />
        <p className="pending-hint">
          Si crees que esto es un error, contacta a un miembro del colectivo directamente.
        </p>
        <button className="btn btn-ghost" onClick={logout} style={{ marginTop: 24 }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
