import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Map,
  MessageSquare,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mountain,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen, 
  onMobileClose, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Detect mobile & auto-close on resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && isMobileOpen) onMobileClose();
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobileOpen, onMobileClose]);

  // Menu items with proper routes for hiker
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard',      icon: LayoutDashboard, to: '/hiker-dashboard' },
    { id: 'events',    label: 'Events',         icon: Calendar,        to: '/hiker-dashboard/events' },
    { id: 'explore',   label: 'Explore',        icon: Map,             to: '/hiker-dashboard/explore' },
    { id: 'messages',  label: 'Messages',       icon: MessageSquare,   to: '/hiker-dashboard/messages' },
    { id: 'profile',   label: 'Profile',        icon: User,            to: '/hiker-dashboard/profile' },
    // { id: 'settings',  label: 'Settings',       icon: Settings,        to: '/hiker-dashboard/settings' },
  ];

  // Same active logic as OrganizerSidebar
  const isMenuItemActive = (itemPath: string) => {
    if (itemPath === '/hiker-dashboard') {
      return location.pathname === '/hiker-dashboard';
    }
    return location.pathname.startsWith(itemPath);
  };

  // Close on outside click (mobile)
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileOpen && isMobile) onMobileClose();
    };
    if (isMobileOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen, isMobile, onMobileClose]);

  // Reusable menu item renderer (identical to OrganizerSidebar)
  const renderMenuItem = (item: typeof menuItems[0]) => {
    const Icon = item.icon;
    const isActive = isMenuItemActive(item.to);

    return (
      <Link
        key={item.id}
        to={item.to}
        onClick={() => isMobile && onMobileClose()}
        className={`
          w-full flex items-center rounded-xl p-3 transition-all duration-200 group relative
          ${isActive
            ? 'bg-[#1B4332]/10 text-[#1B4332] border-l-4 border-[#1B4332]'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#1B4332]'
          }
          ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
        `}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-[#1B4332]' : 'text-[#1E3A5F]'}`} />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}

        {/* Active indicator when collapsed */}
        {isCollapsed && isActive && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-6 bg-[#FF6B35] rounded-l-full" />
        )}

        {/* Tooltip when collapsed */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
            {item.label}
          </div>
        )}
      </Link>
    );
  };

  // ────────────────────── Mobile View ──────────────────────
  if (isMobile) {
    return (
      <>
        {isMobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
        )}

        <aside
          className={`
            fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 shadow-xl
            transition-transform duration-300 ease-in-out w-64
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1B4332] to-[#1E3A5F] rounded-lg flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">HikeSathi</span>
              </div>
              <button
                onClick={onMobileClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">{menuItems.map(renderMenuItem)}</div>
            </nav>

            {/* User */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#1E3A5F] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">John Smith</p>
                  <p className="text-xs text-gray-500 truncate">Pro Hiker</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // ────────────────────── Desktop View ──────────────────────
  return (
    <aside
      className={`
        fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out flex flex-col shadow-sm z-30 overflow-hidden
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1B4332] to-[#1E3A5F] rounded-lg flex items-center justify-center">
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HikeSathi</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-[#1B4332] to-[#1E3A5F] rounded-lg flex items-center justify-center mx-auto">
              <Mountain className="w-5 h-5 text-white" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">{menuItems.map(renderMenuItem)}</div>
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#1E3A5F] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">Pro Hiker</p>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1B4332] to-[#1E3A5F] rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;