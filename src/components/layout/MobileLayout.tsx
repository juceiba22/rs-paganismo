import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

export default function MobileLayout() {
  const location = useLocation();
  const hideBottomNav = ['/login', '/register', '/onboarding', '/pending'].includes(location.pathname);

  return (
    <div className="mobile-layout">
      <main className="mobile-content">
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}
