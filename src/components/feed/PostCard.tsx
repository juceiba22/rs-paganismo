import React, { useState } from 'react';
import type { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import CommentThread from './CommentThread';
import './PostCard.css';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

interface Props {
  post: Post;
  onDelete?: (id: string) => void;
}

export default function PostCard({ post, onDelete }: Props) {
  const { appUser } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const canDelete = appUser?.uid === post.authorId || appUser?.role === 'admin';

  return (
    <article className="post-card card page-enter">
      <div className="post-card__header">
        <div className="avatar">
          {post.authorPhoto
            ? <img src={post.authorPhoto} alt={post.authorName} />
            : initials(post.authorName)}
        </div>
        <div className="post-card__meta">
          <span className="post-card__author">{post.authorName}</span>
          <span className="post-card__time text-muted text-xs">{timeAgo(post.createdAt)}</span>
        </div>
        {canDelete && (
          <button
            className="btn btn-icon post-card__delete text-muted"
            onClick={() => onDelete?.(post.id)}
            title="Eliminar"
          >✕</button>
        )}
      </div>

      {post.projectTitle && (
        <div className="post-card__project-tag">
          <span className="tag">⬡ {post.projectTitle}</span>
        </div>
      )}

      <p className="post-card__content">{post.content}</p>

      {post.imageURL && (
        <img className="post-card__image" src={post.imageURL} alt="imagen" />
      )}

      {post.linkURL && (
        <a
          className="post-card__link"
          href={post.linkURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="post-card__link-icon">⬡</span>
          <span>{post.linkURL}</span>
        </a>
      )}

      <div className="post-card__footer">
        <button
          className="post-card__comments-btn"
          onClick={() => setExpanded((v) => !v)}
        >
          <span>◎</span>
          <span>{post.commentCount} {post.commentCount === 1 ? 'comentario' : 'comentarios'}</span>
        </button>
      </div>

      {expanded && <CommentThread postId={post.id} />}
    </article>
  );
}
