import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import { useProjects } from '../hooks/useProjects';
import ProjectForm from '../components/projects/ProjectForm';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const { projects, loading, createProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <Header
        title="Rituales"
        subtitle="Proyectos activos"
        right={
          <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '7px 14px' }}
            onClick={() => setShowForm(true)}>
            + Ritual
          </button>
        }
      />
      <main className="page-content page-enter">
        {loading ? (
          <div className="loader"><div className="loader-ring" /></div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⬡</div>
            <h3>Sin rituales aún</h3>
            <p>Crea el primer proyecto del colectivo.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p) => (
              <div
                key={p.id}
                className="project-card card"
                onClick={() => navigate(`/rituales/${p.id}`)}
              >
                <div className="project-card__icon">⬡</div>
                <h3 className="project-card__title font-ritual">{p.title}</h3>
                <p className="project-card__desc">{p.description}</p>
                <div className="project-card__footer">
                  <span className="text-xs text-muted">{p.members.length} miembro{p.members.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSubmit={async (title, desc, members) => {
            await createProject(title, desc, members);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
