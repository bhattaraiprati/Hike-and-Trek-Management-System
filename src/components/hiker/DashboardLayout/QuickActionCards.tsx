// components/hiker/dashboard/QuickActionCards.tsx
import { 
    Compass, MessageSquare, User, Calendar, 
    Map, Settings, Bell, Star 
  } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';
import type { QuickAction } from '../../../types/HikerTypes';

  
  interface QuickActionCardsProps {
    actions: QuickAction[];
  }
  
  const QuickActionCards = ({ actions }: QuickActionCardsProps) => {
    const navigate = useNavigate();
  
    const defaultActions: QuickAction[] = [
      {
        id: 1,
        title: 'Explore Events',
        description: 'Discover new adventures',
        icon: 'Compass',
        path: '/events/explore',
        color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      },
      {
        id: 2,
        title: 'Messages',
        description: 'Chat with organizers',
        icon: 'MessageSquare',
        path: '/messages',
        color: 'bg-gradient-to-r from-green-500 to-emerald-500',
        count: 3,
      },
      {
        id: 3,
        title: 'My Profile',
        description: 'Update your preferences',
        icon: 'User',
        path: '/profile',
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      },
      {
        id: 4,
        title: 'My Bookings',
        description: 'View all reservations',
        icon: 'Calendar',
        path: '/bookings',
        color: 'bg-gradient-to-r from-orange-500 to-red-500',
      },
    ];
  
    const displayActions = actions.length > 0 ? actions : defaultActions;
  
    const getIconComponent = (iconName: string) => {
      switch (iconName) {
        case 'Compass': return <Compass className="w-5 h-5" />;
        case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
        case 'User': return <User className="w-5 h-5" />;
        case 'Calendar': return <Calendar className="w-5 h-5" />;
        case 'Map': return <Map className="w-5 h-5" />;
        case 'Settings': return <Settings className="w-5 h-5" />;
        case 'Bell': return <Bell className="w-5 h-5" />;
        case 'Star': return <Star className="w-5 h-5" />;
        default: return <Compass className="w-5 h-5" />;
      }
    };
  
    const handleActionClick = (path: string) => {
      navigate(path);
    };
  
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {displayActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.path)}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center text-center relative">
                {/* Badge for count */}
                {action.count && action.count > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {action.count}
                  </span>
                )}
                
                <div className={`${action.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {getIconComponent(action.icon)}
                  </div>
                </div>
                
                <div className="font-medium text-white text-sm mb-1">
                  {action.title}
                </div>
                <div className="text-xs text-gray-400 line-clamp-2">
                  {action.description}
                </div>
              </div>
            </button>
          ))}
        </div>
  
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Need help planning?
            </div>
            <button 
              onClick={() => navigate('/help')}
              className="px-3 py-1.5 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors text-xs"
            >
              Get Help
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default QuickActionCards;