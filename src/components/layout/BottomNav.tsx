import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

const NAV_ITEMS = [
  { path: '/',           icon: '◈', label: 'Inicio' },
  { path: '/rituales',   icon: '⬡', label: 'Rituales' },
  { path: '/ceremonias', icon: '◑', label: 'Ceremonias' },
  { path: '/archivos',   icon: '⬙', label: 'Archivos' },
  { path: '/perfil',     icon: '◎', label: 'Perfil' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            className={`bottom-nav__item${active ? ' bottom-nav__item--active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
