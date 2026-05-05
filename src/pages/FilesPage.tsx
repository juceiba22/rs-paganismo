import React from 'react';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import { useFiles } from '../hooks/useFiles';
import FileCard from '../components/files/FileCard';
import FileUploader from '../components/files/FileUploader';

export default function FilesPage() {
  const { files, loading, uploading, uploadFile, deleteFile } = useFiles();

  return (
    <div className="app-layout">
      <Header title="Archivos" subtitle="Material del colectivo" />
      <main className="page-content page-enter">
        <FileUploader uploading={uploading} onUpload={uploadFile} />
        <div className="mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            <div className="loader"><div className="loader-ring" /></div>
          ) : files.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⬙</div>
              <h3>Sin archivos aún</h3>
              <p>Sube audio, video, documentos o imágenes.</p>
            </div>
          ) : (
            files.map((f) => (
              <FileCard key={f.id} file={f} onDelete={deleteFile} />
            ))
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
