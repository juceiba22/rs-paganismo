import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';

interface Props {
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    datetime: Date,
    projectId?: string,
    projectTitle?: string
  ) => Promise<void>;
}

export default function EventForm({ onClose, onSubmit }: Props) {
  const { projects } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState('');
  const [projectId, setProjectId] = useState('');
  const [busy, setBusy] = useState(false);

  const selectedProject = projects.find((p) => p.id === projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !datetime) return;
    setBusy(true);
    await onSubmit(
      title.trim(),
      description.trim(),
      new Date(datetime),
      projectId || undefined,
      selectedProject?.title
    );
    setBusy(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-header">
          <h2 className="modal-title font-ritual">Nueva Ceremonia</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="field">
            <label>Título</label>
            <input
              className="input"
              type="text"
              placeholder="Ej: Ensayo — Acto III"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label>Fecha y hora</label>
            <input
              className="input"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Descripción (opcional)</label>
            <textarea
              className="input"
              placeholder="Detalles del evento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {projects.length > 0 && (
            <div className="field">
              <label>Ritual relacionado (opcional)</label>
              <select
                className="input select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">Sin ritual</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-8 justify-end">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={busy || !title.trim() || !datetime}
            >
              {busy ? 'Creando...' : 'Crear Ceremonia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
