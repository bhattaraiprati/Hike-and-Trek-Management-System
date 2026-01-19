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

export const AdminHeader: React.FC<HeaderProps> = ({ onMenuToggle }) => {
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

          </div>

          {/* Right Section - Navigation Icons */}
          <div className="flex items-center space-x-4">
            
            {/* <NotificationDropdown /> */}

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
                  <p className="text-xs text-gray-500">Admin</p>
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

