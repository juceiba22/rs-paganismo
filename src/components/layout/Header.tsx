import React from 'react';
import './Header.css';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export default function Header({ title, subtitle, right }: Props) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__text">
          <span className="app-header__title font-ritual">{title}</span>
          {subtitle && <span className="app-header__subtitle">{subtitle}</span>}
        </div>
        {right && <div className="app-header__right">{right}</div>}
      </div>
    </header>
  );
}
