import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import type { AppUser, UserRole } from '../types';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import './ProfilePage.css';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  core: 'Miembro Central',
  extended: 'Miembro Extendido',
  pending: 'Pendiente',
};

const ARTISTIC_LABELS: Record<string, string> = {
  musician: 'Músico/a',
  actor: 'Actor/Actriz',
  visual: 'Arte Visual',
  other: 'Otro',
};

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { appUser, logout, isAdmin } = useAuth();
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    getDocs(collection(db, 'users')).then((snap) => {
      setAllUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as AppUser[]);
      setLoadingUsers(false);
    });
  }, [isAdmin]);

  const changeRole = async (uid: string, role: UserRole) => {
    await updateDoc(doc(db, 'users', uid), { role });
    setAllUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
  };

  if (!appUser) return null;

  const pendingUsers = allUsers.filter((u) => u.role === 'pending');
  const activeUsers = allUsers.filter((u) => u.role !== 'pending');

  return (
    <div className="app-layout">
      <Header title="Perfil" />
      <main className="page-content page-enter">

        <div className="profile-card card">
          <div className="avatar avatar-lg">
            {appUser.photoURL
              ? <img src={appUser.photoURL} alt={appUser.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : initials(appUser.name)}
          </div>
          <div className="profile-card__info">
            <h2 className="profile-card__name font-ritual">{appUser.name}</h2>
            <p className="profile-card__email text-muted text-sm">{appUser.email}</p>
            <div className="flex gap-8 mt-4">
              <span className={`badge badge-${appUser.role}`}>{ROLE_LABELS[appUser.role]}</span>
              <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-soft)' }}>
                {ARTISTIC_LABELS[appUser.artisticRole]}
              </span>
            </div>
          </div>
        </div>

        <button className="btn btn-ghost w-full mt-16" onClick={logout}>
          Cerrar sesión
        </button>

        {isAdmin && (
          <div className="admin-panel mt-24">
            <div className="section-header">
              <span className="section-title">Panel de Administración</span>
            </div>

            {loadingUsers ? (
              <div className="loader"><div className="loader-ring" /></div>
            ) : (
              <>
                {pendingUsers.length > 0 && (
                  <div className="admin-section">
                    <p className="admin-section__label">Solicitudes pendientes ({pendingUsers.length})</p>
                    {pendingUsers.map((u) => (
                      <div key={u.uid} className="admin-user-row card">
                        <div className="avatar">{initials(u.name || u.email)}</div>
                        <div className="admin-user-row__info">
                          <span className="font-500 text-sm">{u.name || '(sin nombre)'}</span>
                          <span className="text-xs text-muted">{u.email}</span>
                        </div>
                        <div className="flex gap-8">
                          <button
                            className="btn btn-primary"
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                            onClick={() => changeRole(u.uid, 'extended')}
                          >Reactivar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="admin-section">
                  <p className="admin-section__label">Miembros activos</p>
                  {activeUsers.map((u) => (
                    <div key={u.uid} className="admin-user-row card">
                      <div className="avatar">{initials(u.name || u.email)}</div>
                      <div className="admin-user-row__info">
                        <span className="font-500 text-sm">{u.name}</span>
                        <span className="text-xs text-muted">{u.email}</span>
                      </div>
                      <select
                        className="input select"
                        value={u.role}
                        onChange={(e) => changeRole(u.uid, e.target.value as UserRole)}
                        style={{ width: 'auto', fontSize: '0.78rem', padding: '5px 28px 5px 8px' }}
                      >
                        <option value="admin">Admin</option>
                        <option value="core">Central</option>
                        <option value="extended">Extendido</option>
                        <option value="pending">Pendiente</option>
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
