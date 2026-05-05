import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { usePosts } from '../hooks/usePosts';
import { useFiles } from '../hooks/useFiles';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import PostCard from '../components/feed/PostCard';
import PostComposer from '../components/feed/PostComposer';
import FileUploader from '../components/files/FileUploader';
import FileCard from '../components/files/FileCard';
import './ProjectDetailPage.css';

type Tab = 'invocaciones' | 'archivos';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { posts, loading: postsLoading, createPost, deletePost } = usePosts(id);
  const { files, loading: filesLoading, uploading, uploadFile, deleteFile } = useFiles(id);
  const [tab, setTab] = useState<Tab>('invocaciones');

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="app-layout">
        <Header title="Ritual" right={
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/rituales')}>←</button>
        } />
        <main className="page-content">
          <div className="loader"><div className="loader-ring" /></div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header
        title={project.title}
        subtitle={`${project.members.length} miembro${project.members.length !== 1 ? 's' : ''}`}
        right={
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/rituales')}>←</button>
        }
      />
      <main className="page-content page-enter">
        <div className="project-detail__info card">
          <div className="project-detail__icon">⬡</div>
          <p className="project-detail__desc">{project.description || 'Sin descripción.'}</p>
        </div>

        <div className="project-tabs">
          <button
            className={`project-tab${tab === 'invocaciones' ? ' project-tab--active' : ''}`}
            onClick={() => setTab('invocaciones')}
          >Invocaciones</button>
          <button
            className={`project-tab${tab === 'archivos' ? ' project-tab--active' : ''}`}
            onClick={() => setTab('archivos')}
          >Archivos</button>
        </div>

        {tab === 'invocaciones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PostComposer
              onSubmit={(content, img, link) =>
                createPost(content, img, link, project.id, project.title)
              }
            />
            {postsLoading ? (
              <div className="loader"><div className="loader-ring" /></div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◈</div>
                <h3>Sin invocaciones en este ritual</h3>
              </div>
            ) : (
              posts.map((p) => (
                <PostCard key={p.id} post={p} onDelete={deletePost} />
              ))
            )}
          </div>
        )}

        {tab === 'archivos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FileUploader
              uploading={uploading}
              onUpload={(file) => uploadFile(file, project.id, project.title)}
            />
            {filesLoading ? (
              <div className="loader"><div className="loader-ring" /></div>
            ) : files.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">⬙</div>
                <h3>Sin archivos en este ritual</h3>
              </div>
            ) : (
              files.map((f) => (
                <FileCard key={f.id} file={f} onDelete={deleteFile} />
              ))
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
