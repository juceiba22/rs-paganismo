import React from 'react';
import type { AppFile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import './FileCard.css';

const TYPE_ICONS: Record<string, string> = {
  audio: '♩',
  video: '▶',
  document: '⬙',
  image: '◈',
};

function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

interface Props {
  file: AppFile;
  onDelete: (id: string, fileName: string) => void;
}

export default function FileCard({ file, onDelete }: Props) {
  const { appUser } = useAuth();
  const canDelete = appUser?.uid === file.uploadedBy || appUser?.role === 'admin';
  const icon = TYPE_ICONS[file.type] ?? '⬙';

  return (
    <div className="file-card card">
      <div className="file-card__icon">{icon}</div>
      <div className="file-card__body">
        <a
          className="file-card__name"
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          title={file.name}
        >
          {file.name}
        </a>
        <p className="file-card__meta text-xs text-muted">
          {fileSize(file.size)} · {timeAgo(file.createdAt)}
          {file.projectTitle && ` · ${file.projectTitle}`}
        </p>
      </div>
      {canDelete && (
        <button
          className="btn btn-icon file-card__delete text-muted"
          onClick={() => onDelete(file.id, file.name)}
          title="Eliminar"
        >✕</button>
      )}
    </div>
  );
}
