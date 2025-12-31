// components/layout/header/Header.tsx
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  MapPin, 
  Settings,
  LogOut,
  Menu,
  Trash2,
  CheckCheck,
  CalendarIcon,
  Users
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotificationWebSocket } from '../../../hooks/useNotificationWebSocket';
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Notification
} from '../../../api/services/notificationApi';
import ConfirmModal from '../../common/ConfirmModal';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import { urlLink } from '../../../api/axiosConfig';
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
  const queryClient = useQueryClient();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);


  // Fetch quick search suggestions
  const { data: suggestions = [] } = useQuery<QuickSuggestion[]>({
    queryKey: ['headerSearchSuggestions', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      const res = await fetch(
        `${urlLink}/hiker/search/suggestions?query=${encodeURIComponent(debouncedQuery)}`,
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

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', 0],
    queryFn: () => fetchNotifications(0, 20),
    staleTime: 30000,
  });

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: fetchUnreadCount,
    staleTime: 10000,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // WebSocket for real-time notifications
  useNotificationWebSocket({
    onNotificationReceived: (notification) => {
      console.log('New notification received:', notification);
    },
    showToast: true,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    // Add navigation logic here based on notification type
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CONFIRMATION':
        return '🎉';
      case 'BOOKING_CANCELLED':
        return '❌';
      case 'TREK_UPDATE':
        return '🏔️';
      case 'NEW_MESSAGE':
        return '💬';
      case 'PAYMENT_SUCCESS':
        return '✅';
      case 'PAYMENT_FAILED':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const notifications = notificationsData?.content || [];

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
            
            {/* Notifications Bell */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          disabled={markAllAsReadMutation.isPending}
                          className="text-sm text-[#1B4332] hover:text-[#2D5016] font-medium flex items-center gap-1 disabled:opacity-50"
                        >
                          <CheckCheck className="w-4 h-4" />
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group ${
                            !notification.isRead ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                  {notification.title}
                                  {!notification.isRead && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                  )}
                                </h4>
                                <button
                                  onClick={(e) => handleDeleteNotification(e, notification.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                                  disabled={deleteNotificationMutation.isPending}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-[#1B4332] hover:text-[#2D5016] font-medium py-2">
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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