import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import type { AppUser } from '../../types';
import './ProjectForm.css';

interface Props {
  onClose: () => void;
  onSubmit: (title: string, description: string, members: string[]) => Promise<void>;
}

export default function ProjectForm({ onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as AppUser[];
      setAllUsers(users.filter((u) => u.role !== 'pending'));
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const toggleMember = (uid: string) => {
    setSelectedMembers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    await onSubmit(title.trim(), description.trim(), selectedMembers);
    setBusy(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-header">
          <h2 className="modal-title font-ritual">Nuevo Ritual</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="field">
            <label>Nombre del ritual</label>
            <input
              className="input"
              type="text"
              placeholder="Ej: Álbum de invierno"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              className="input"
              placeholder="¿De qué trata este ritual?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="field">
            <label>Miembros</label>
            {loading ? (
              <div className="loader"><div className="loader-ring" style={{ width: 20, height: 20 }} /></div>
            ) : (
              <div className="member-list">
                {allUsers.map((u) => (
                  <label key={u.uid} className={`member-item${selectedMembers.includes(u.uid) ? ' member-item--selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(u.uid)}
                      onChange={() => toggleMember(u.uid)}
                      style={{ display: 'none' }}
                    />
                    <span className="member-item__name">{u.name}</span>
                    <span className="member-item__role text-xs text-muted">{u.artisticRole}</span>
                    {selectedMembers.includes(u.uid) && <span className="member-item__check">✓</span>}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-8 justify-end">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" type="submit" disabled={busy || !title.trim()}>
              {busy ? 'Creando...' : 'Crear Ritual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
