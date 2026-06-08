import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Building2,
  Tags,
  FileText,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const allNavItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard & AI' },
  { path: '/library', icon: Package, label: 'Material Library' },
  { path: '/create', icon: PlusCircle, label: 'Create Material' },
  { path: '/suppliers', icon: Building2, label: 'Supplier Management', adminOnly: true },
  { path: '/categories', icon: Tags, label: 'Categories' },
  { path: '/logs', icon: FileText, label: 'Audit Logs', adminOnly: true },
  { path: '/settings', icon: SettingsIcon, label: 'Settings', adminOnly: true },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter nav items based on role
  const navItems = allNavItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  // User initials
  const initials = user?.displayName
    ?.split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const roleLabel = user?.role === 'admin' ? 'ADMIN' : 'SUPPLIER';

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#334155] to-[#1e293b] z-40 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[272px]'
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-[#64748b] rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-bold text-lg leading-tight">Material Library</span>
              <span className="text-white/60 text-xs">v1.0.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                    isActive
                      ? 'bg-white/20 text-white border-l-4 border-[#3b82f6]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium text-sm truncate">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-[#1a3a5c]" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-[#1a3a5c]" />
        )}
      </button>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">{initials}</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden flex-1 min-w-0">
              <span className="text-white font-medium text-sm truncate">{user?.displayName}</span>
              <span className="text-white/60 text-xs">{roleLabel}</span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center text-white/60 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
