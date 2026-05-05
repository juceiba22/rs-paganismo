import React from 'react';
import type { AppEvent } from '../../types';
import { useAuth } from '../../context/AuthContext';
import './EventCard.css';

function formatDate(d: Date): string {
  return d.toLocaleDateString('es', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

interface Props {
  event: AppEvent;
  onDelete: (id: string) => void;
  past?: boolean;
}

export default function EventCard({ event, onDelete, past }: Props) {
  const { appUser } = useAuth();
  const canDelete = appUser?.uid === event.createdBy || appUser?.role === 'admin';

  return (
    <div className={`event-card card${past ? ' event-card--past' : ''}`}>
      <div className="event-card__date-col">
        <span className="event-card__day">{event.datetime.getDate()}</span>
        <span className="event-card__month">
          {event.datetime.toLocaleDateString('es', { month: 'short' })}
        </span>
      </div>
      <div className="event-card__body">
        <h3 className="event-card__title font-ritual">{event.title}</h3>
        <p className="event-card__time text-xs text-muted">
          {formatDate(event.datetime)} · {formatTime(event.datetime)}
        </p>
        {event.description && (
          <p className="event-card__desc">{event.description}</p>
        )}
        {event.projectTitle && (
          <span className="tag" style={{ marginTop: 6 }}>⬡ {event.projectTitle}</span>
        )}
      </div>
      {canDelete && (
        <button
          className="btn btn-icon event-card__delete text-muted"
          onClick={() => onDelete(event.id)}
          title="Eliminar"
        >✕</button>
      )}
    </div>
  );
}
