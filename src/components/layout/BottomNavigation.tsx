import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',           icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', label: 'Inicio' },
  { path: '/search',     icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Buscar' },
  { path: '/create',     icon: 'M12 4v16m8-8H4', label: 'Crear' },
  { path: '/perfil',     icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Perfil' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 w-full bg-black border-t border-neutral-900 z-50 h-12 flex justify-around items-center px-2">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            className={`flex flex-col items-center justify-center w-full h-full text-white transition-opacity ${active ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <svg
              viewBox="0 0 24 24"
              fill={active ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={active ? '2' : '1.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              {item.path === '/perfil' ? (
                <>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </>
              ) : item.path === '/create' ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </>
              ) : item.path === '/' ? (
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              ) : item.path === '/search' ? (
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              ) : null}
            </svg>
          </button>
        );
      })}
    </nav>
  );
}
