import React, { useState } from 'react';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';

export default function EventsPage() {
  const { upcoming, past, loading, createEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app-layout">
      <Header
        title="Ceremonias"
        subtitle="Eventos del colectivo"
        right={
          <button
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '7px 14px' }}
            onClick={() => setShowForm(true)}
          >
            + Ceremonia
          </button>
        }
      />
      <main className="page-content page-enter">
        {loading ? (
          <div className="loader"><div className="loader-ring" /></div>
        ) : (
          <>
            <div className="section-header">
              <span className="section-title">Próximas</span>
            </div>
            {upcoming.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px' }}>
                <div className="empty-state-icon">◑</div>
                <h3>Sin ceremonias próximas</h3>
                <p>Crea un ensayo, función o reunión.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {upcoming.map((e) => (
                  <EventCard key={e.id} event={e} onDelete={deleteEvent} />
                ))}
              </div>
            )}

            {past.length > 0 && (
              <>
                <div className="section-header" style={{ marginTop: 8 }}>
                  <span className="section-title" style={{ opacity: 0.5 }}>Pasadas</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {past.slice(0, 5).map((e) => (
                    <EventCard key={e.id} event={e} onDelete={deleteEvent} past />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <BottomNav />

      {showForm && (
        <EventForm
          onClose={() => setShowForm(false)}
          onSubmit={async (title, desc, datetime, projectId, projectTitle) => {
            await createEvent(title, desc, datetime, projectId, projectTitle);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
