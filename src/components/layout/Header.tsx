import React, { ReactNode } from 'react';
import { Bell, LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#e2e8f0] px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-xl font-bold text-[#1a3a5c] flex items-center gap-2">
            {title}
            {subtitle && (
              <span className="text-xs bg-[#f0f4f8] text-[#64748b] px-2 py-0.5 rounded">
                {subtitle}
              </span>
            )}
          </h1>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-4">
          {actions && <div className="flex items-center gap-2">{actions}</div>}

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[#f0f4f8] transition-colors">
            <Bell className="w-5 h-5 text-[#64748b]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full"></span>
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#f0f4f8] transition-colors">
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">AD</span>
            </div>
            <span className="text-sm text-[#0f172a]">Logout</span>
            <LogOut className="w-4 h-4 text-[#64748b]" />
          </button>
        </div>
      </div>
    </header>
  );
}