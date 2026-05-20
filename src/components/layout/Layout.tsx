import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AIBot } from '../ai/AIBot';
import { useApp } from '../../context/AppContext';

export function Layout() {
  const { sidebarCollapsed, toggleSidebar } = useApp();

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[272px]'
        }`}
      >
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
      {/* AI Bot */}
      <AIBot />
    </div>
  );
}