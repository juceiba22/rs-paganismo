import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import type { AppUser, UserRole } from '../types';
import Header from '../components/layout/Header';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  core: 'Miembro Central',
  extended: 'Miembro Extendido',
  pending: 'Pendiente',
};

function initials(name: string) {
  if (!name) return '';
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
    <>
      <Header 
        title={appUser.username || appUser.name.replace(/\s+/g, '').toLowerCase() || 'perfil'} 
        right={
          <button onClick={logout} className="text-sm font-semibold text-neutral-300 hover:text-white">
            Salir
          </button>
        }
      />
      <div className="bg-black text-white min-h-screen pb-20">
        {/* Profile Header */}
        <div className="px-4 py-6 border-b border-neutral-900">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-800 flex-shrink-0 flex items-center justify-center border border-neutral-800">
              {appUser.avatarUrl || appUser.photoURL ? (
                <img src={appUser.avatarUrl || appUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-neutral-500">{initials(appUser.displayName || appUser.name)}</span>
              )}
            </div>
            <div className="flex-1 flex justify-between text-center">
              <div>
                <div className="font-semibold text-lg">0</div>
                <div className="text-xs text-neutral-400">publicaciones</div>
              </div>
              <div>
                <div className="font-semibold text-lg">0</div>
                <div className="text-xs text-neutral-400">seguidores</div>
              </div>
              <div>
                <div className="font-semibold text-lg">0</div>
                <div className="text-xs text-neutral-400">seguidos</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-semibold text-sm">{appUser.displayName || appUser.name}</h2>
            <div className="flex gap-2 mt-1 mb-2">
              <span className="text-xs bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded-sm">{ROLE_LABELS[appUser.role]}</span>
            </div>
            {appUser.bio && <p className="text-sm text-neutral-200">{appUser.bio}</p>}
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors border border-neutral-800">
              Editar perfil
            </button>
            <button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors border border-neutral-800">
              Compartir perfil
            </button>
          </div>
        </div>

        {/* Content Tabs Placeholder */}
        <div className="flex border-b border-neutral-900">
          <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-white text-white">
            <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>

        {/* Grid Placeholder */}
        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {/* Empty grid items */}
        </div>

        {isAdmin && (
          <div className="mt-8 px-4">
            <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wider">Panel de Administración</h3>
            {loadingUsers ? (
              <div className="text-center py-4 text-neutral-500 text-sm">Cargando usuarios...</div>
            ) : (
              <div className="space-y-6">
                {pendingUsers.length > 0 && (
                  <div>
                    <h4 className="text-sm text-red-400 mb-2">Solicitudes pendientes ({pendingUsers.length})</h4>
                    <div className="space-y-2">
                      {pendingUsers.map((u) => (
                        <div key={u.uid} className="flex items-center justify-between bg-neutral-900 p-3 rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold">
                              {initials(u.displayName || u.name || u.email)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{u.displayName || u.name || '(sin nombre)'}</div>
                              <div className="text-xs text-neutral-500">{u.email}</div>
                            </div>
                          </div>
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded"
                            onClick={() => changeRole(u.uid, 'extended')}
                          >
                            Aprobar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm text-neutral-300 mb-2">Miembros activos</h4>
                  <div className="space-y-2">
                    {activeUsers.map((u) => (
                      <div key={u.uid} className="flex items-center justify-between bg-neutral-900 p-3 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold">
                            {initials(u.displayName || u.name || u.email)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{u.username || u.displayName || u.name}</div>
                            <div className="text-xs text-neutral-500">{u.email}</div>
                          </div>
                        </div>
                        <select
                          className="bg-black border border-neutral-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-neutral-500"
                          value={u.role}
                          onChange={(e) => changeRole(u.uid, e.target.value as UserRole)}
                        >
                          <option value="admin">Admin</option>
                          <option value="core">Central</option>
                          <option value="extended">Extendido</option>
                          <option value="pending">Pendiente</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
