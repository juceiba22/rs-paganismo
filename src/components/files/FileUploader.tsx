import React, { useRef } from 'react';
import './FileUploader.css';

interface Props {
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
}

export default function FileUploader({ uploading, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="file-uploader card">
      <div className="file-uploader__content">
        <span className="file-uploader__icon">⬙</span>
        <div className="file-uploader__text">
          <p className="font-500">Subir archivo</p>
          <p className="text-xs text-muted">Audio, video, PDF, imágenes</p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          style={{ fontSize: '0.82rem', padding: '8px 14px' }}
        >
          {uploading ? 'Subiendo...' : 'Elegir'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept="audio/*,video/*,.pdf,.doc,.docx,image/*"
        onChange={handleChange}
      />
    </div>
  );
}
