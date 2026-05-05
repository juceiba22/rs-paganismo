import React, { useState } from 'react';
import { useComments } from '../../hooks/usePosts';
import { useAuth } from '../../context/AuthContext';
import type { Comment } from '../../types';

interface Props {
  postId: string;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function CommentThread({ postId }: Props) {
  const { comments, addComment } = useComments(postId);
  const { appUser } = useAuth();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    await addComment(text.trim());
    setText('');
    setBusy(false);
  };

  return (
    <div className="comment-thread">
      <div className="comment-list">
        {comments.map((c: Comment) => (
          <div key={c.id} className="comment">
            <div className="avatar avatar-sm">
              {c.authorPhoto
                ? <img src={c.authorPhoto} alt={c.authorName} />
                : initials(c.authorName)}
            </div>
            <div className="comment__body">
              <div className="comment__header">
                <span className="comment__author text-sm font-500">{c.authorName}</span>
                <span className="comment__time text-xs text-muted">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="comment__text">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Escribe un comentario..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={busy || !text.trim()}
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >↵</button>
      </form>
    </div>
  );
}
