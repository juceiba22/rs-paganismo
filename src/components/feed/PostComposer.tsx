import React, { useState, useRef } from 'react';
import { useProjects } from '../../hooks/useProjects';
import './PostComposer.css';

interface Props {
  onSubmit: (content: string, image?: File, linkURL?: string, projectId?: string, projectTitle?: string) => Promise<void>;
}

export default function PostComposer({ onSubmit }: Props) {
  const { projects } = useProjects();
  const [content, setContent] = useState('');
  const [linkURL, setLinkURL] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedProject = projects.find((p) => p.id === projectId);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    await onSubmit(
      content.trim(),
      image ?? undefined,
      linkURL.trim() || undefined,
      projectId || undefined,
      selectedProject?.title
    );
    setContent('');
    setLinkURL('');
    setImage(null);
    setImagePreview(null);
    setProjectId('');
    setShowLink(false);
    setExpanded(false);
    setBusy(false);
  };

  return (
    <div className="post-composer card">
      <form onSubmit={handleSubmit}>
        <textarea
          className="post-composer__textarea input"
          placeholder="¿Qué invocas hoy?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setExpanded(true)}
          rows={expanded ? 4 : 2}
        />

        {imagePreview && (
          <div className="post-composer__preview">
            <img src={imagePreview} alt="preview" />
            <button type="button" className="btn btn-icon preview-remove" onClick={removeImage}>✕</button>
          </div>
        )}

        {showLink && (
          <div className="field" style={{ marginTop: 8 }}>
            <input
              className="input"
              type="url"
              placeholder="https://..."
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
            />
          </div>
        )}

        {expanded && projects.length > 0 && (
          <div className="field" style={{ marginTop: 8 }}>
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

        {expanded && (
          <div className="post-composer__actions">
            <div className="flex gap-8">
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                title="Imagen"
                onClick={() => fileRef.current?.click()}
              >⬙</button>
              <button
                type="button"
                className={`btn btn-ghost btn-icon${showLink ? ' btn-active' : ''}`}
                title="Enlace"
                onClick={() => setShowLink((v) => !v)}
              >⬡</button>
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={busy || !content.trim()}
            >
              {busy ? '...' : 'Invocar'}
            </button>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImage}
        />
      </form>
    </div>
  );
}
