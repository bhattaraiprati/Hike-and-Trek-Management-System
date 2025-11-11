// components/Navigation/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Map,
  Calendar,
  MessageCircle,
  Users,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Plus,
  Star,
  Trophy,
  Bookmark
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'explore', label: 'Explore Trails', icon: Map, badge: 'New' },
    { id: 'events', label: 'My Events', icon: Calendar, badge: '3' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: '12' },
    { id: 'community', label: 'Community', icon: Users, badge: null },
    { id: 'stats', label: 'Activity Stats', icon: BarChart3, badge: null },
    { id: 'saved', label: 'Saved Trails', icon: Bookmark, badge: null },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: null },
  ];

  const bottomMenuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen) {
        onMobileClose();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen, onMobileClose]);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    // Close mobile sidebar when item is clicked
    if (window.innerWidth < 1024) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-gradient-to-b from-[#1B4332] to-[#1E3A5F]
          text-white transition-all duration-300 ease-in-out
          border-r border-white/10
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-orange-500 rounded-lg flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">TrailBlazer</span>
              </div>
            )}
            
            {isCollapsed && (
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-orange-500 rounded-lg flex items-center justify-center mx-auto">
                <Mountain className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Collapse Toggle Button - Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Close Button - Mobile */}
            <button
              onClick={onMobileClose}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Create Event Button */}
          <div className={`p-4 border-b border-white/10 ${isCollapsed ? 'px-3' : ''}`}>
            <button className={`
              w-full bg-gradient-to-r from-[#FF6B35] to-orange-500 
              text-white font-semibold rounded-xl 
              hover:shadow-lg transform hover:scale-105 
              transition-all duration-300
              flex items-center justify-center space-x-2
              ${isCollapsed ? 'py-3' : 'py-3 px-4'}
            `}>
              <Plus className="w-4 h-4" />
              {!isCollapsed && <span>Create Event</span>}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center rounded-xl p-3
                      transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
                    `}
                  >
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF6B35]' : ''}`} />
                      {item.badge && (
                        <span className={`
                          absolute -top-2 -right-2 min-w-4 h-4 
                          bg-[#FF6B35] text-white text-xs 
                          rounded-full flex items-center justify-center
                          px-1
                          ${isCollapsed ? 'scale-75' : ''}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <span className="font-medium flex-1 text-left">{item.label}</span>
                        {isActive && (
                          <div className="w-1 h-6 bg-[#FF6B35] rounded-full"></div>
                        )}
                      </>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        {item.label}
                        {item.badge && ` (${item.badge})`}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats Section - Only show when expanded */}
            {!isCollapsed && (
              <div className="p-4 border-t border-white/10">
                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-white/90">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">Hikes Completed</span>
                      <span className="text-sm font-semibold">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">KM Covered</span>
                      <span className="text-sm font-semibold">156km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">Badges</span>
                      <span className="text-sm font-semibold">8</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10 space-y-2">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center rounded-xl p-3
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF6B35]' : ''}`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}

            {/* User Profile Summary - Only show when expanded */}
            {!isCollapsed && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    JS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">John Smith</p>
                    <p className="text-xs text-white/60 truncate">Pro Hiker</p>
                  </div>
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
            )}

            {isCollapsed && (
              <div className="flex justify-center pt-4 border-t border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  JS
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;