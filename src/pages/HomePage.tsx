import React from 'react';
import Header from '../components/layout/Header';

export default function HomePage() {
  return (
    <>
      <Header title="Inicio" />
      <div className="flex items-center justify-center h-[calc(100vh-106px)]">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No hay publicaciones</h2>
          <p className="text-neutral-500">Sigue a otros miembros para ver sus publicaciones.</p>
        </div>
      </div>
    </>
  );
}
