// components/layout/header/Header.tsx
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  User, 
  ChevronDown, 
  MapPin, 
  Settings,
  LogOut,
  Menu,
  CalendarIcon,
  Users
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotificationWebSocket } from '../../../hooks/useNotificationWebSocket';

import ConfirmModal from '../../common/ConfirmModal';

import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import { urlLink } from '../../../api/axiosConfig';
import { NotificationDropdown } from '../../common/NotificationDropdown';
interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

interface QuickSuggestion {
  type: 'EVENT' | 'ORGANIZER' | 'LOCATION';
  text: string;
  value: string;
  icon: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // <-- For navigation

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);


  // Fetch quick search suggestions
  const { data: suggestions = [] } = useQuery<QuickSuggestion[]>({
    queryKey: ['headerSearchSuggestions', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      const res = await fetch(
        `${urlLink}/search/suggestions?query=${encodeURIComponent(debouncedQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );
      if (!res.ok) return [];
      return res.json();
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: QuickSuggestion) => {
    setSearchQuery('');
    setIsSearchFocused(false);

    if (suggestion.type === 'EVENT') {
      navigate(`/hiker-dashboard/event/${suggestion.value}`);
    } else if (suggestion.type === 'LOCATION') {
      navigate(`/hiker-dashboard/explore?location=${encodeURIComponent(suggestion.value)}`);
    } else if (suggestion.type === 'ORGANIZER') {
      navigate(`/hiker-dashboard/organizer/${suggestion.value}`);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'EVENT': return <CalendarIcon className="w-4 h-4 text-blue-600" />;
      case 'ORGANIZER': return <Users className="w-4 h-4 text-green-600" />;
      case 'LOCATION': return <MapPin className="w-4 h-4 text-purple-600" />;
      default: return <Search className="w-4 h-4 text-gray-500" />;
    }
  };


  // WebSocket for real-time notifications
  useNotificationWebSocket({
    onNotificationReceived: (notification) => {
      console.log('New notification received:', notification);
    },
    showToast: true,
  });


  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Enhanced Search Bar */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search events, locations, organizers..."
                  className="w-full md:w-96 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-300 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Real Search Suggestions Dropdown */}
              {isSearchFocused && (searchQuery.length >= 2 || suggestions.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  {suggestions.length === 0 && searchQuery.length >= 2 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p>No results found</p>
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Start typing to search...
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        Suggestions
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getSuggestionIcon(suggestion.type)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{suggestion.text}</div>
                            <div className="text-xs text-gray-500 capitalize">{suggestion.type.toLowerCase()}</div>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            navigate(`/hiker-dashboard/explore?query=${encodeURIComponent(searchQuery)}`);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-center py-3 text-sm font-medium text-[#1E3A5F] hover:bg-gray-50"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Navigation Icons */}
          <div className="flex items-center space-x-4">
            
            <NotificationDropdown />
            

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-1 rounded-2xl hover:bg-gray-100 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#1B4332] to-[#2C5F8D] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Hiker</p>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <a href="/profile" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Profile</span>
                    </a>
                    
                    <a href="/settings" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Settings</span>
                    </a>
                  </div>

                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Are you sure you want to logout?"
        message="You will be signed out of your account and need to log in again to continue."
        buttonText="Logout"
      />
    </nav>
  );
};

export default Header;