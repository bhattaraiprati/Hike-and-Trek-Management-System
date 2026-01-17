import { useState, useRef } from 'react';
import {  
  User, 
  ChevronDown, 
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { NotificationDropdown } from '../../common/NotificationDropdown';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

const OrganizerHeader: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const { user } = useAuth();

  const userMenuRef = useRef<HTMLDivElement>(null);


  // const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section - Mobile Menu & Search */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search Bar */}
            {/* <div ref={searchRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search an event or participant..."
                  className="w-full md:w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all duration-300 text-sm placeholder-gray-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>

             
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-2">
                    <div className="flex items-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Quick Actions
                    </div>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>Find trails near me</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Browse upcoming events</span>
                    </button>
                  </div>
                </div>
              )}
            </div> */}
          </div>

          {/* Right Section - Navigation Icons */}
          <div className="flex items-center space-x-4">
            
            <NotificationDropdown />
            {/* Notifications Bell */}
            {/* <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button className="text-sm text-[#1B4332] hover:text-[#2D5016] font-medium">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 mt-2 rounded-full ${
                            notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-[#1B4332] hover:text-[#2D5016] font-medium py-2">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div> */}

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
                  <p className="text-xs text-gray-500">Organizer</p>
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
                    <a onClick={() => navigate("/dashboard/profile")} className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Profile</span>
                    </a>
                    
                  </div>

                  <div className="p-2 border-t border-gray-200">
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
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
    </nav>
  );
};

export default OrganizerHeader;