// components/hiker/dashboard/RecentActivityFeed.tsx
import { 
    Calendar, CreditCard, MessageSquare, 
    CheckCircle, Star, Clock, ExternalLink 
  } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';
import type { RecentActivity } from '../../../types/HikerTypes';
  
  interface RecentActivityFeedProps {
    activities: RecentActivity[];
    compact?: boolean;
  }
  
  const RecentActivityFeed = ({ activities, compact = false }: RecentActivityFeedProps) => {
    const navigate = useNavigate();
  
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'REGISTRATION':
          return <Calendar className="w-5 h-5" />;
        case 'PAYMENT':
          return <CreditCard className="w-5 h-5" />;
        case 'MESSAGE':
          return <MessageSquare className="w-5 h-5" />;
        case 'REVIEW':
          return <Star className="w-5 h-5" />;
        case 'BOOKING':
          return <CheckCircle className="w-5 h-5" />;
        default:
          return <Calendar className="w-5 h-5" />;
      }
    };
  
    const getActivityColor = (type: string) => {
      switch (type) {
        case 'REGISTRATION': return 'bg-blue-500';
        case 'PAYMENT': return 'bg-green-500';
        case 'MESSAGE': return 'bg-purple-500';
        case 'REVIEW': return 'bg-yellow-500';
        case 'BOOKING': return 'bg-orange-500';
        default: return 'bg-gray-500';
      }
    };
  
    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
  
      if (diffHours < 1) {
        return 'Just now';
      } else if (diffHours < 24) {
        return `${Math.floor(diffHours)}h ago`;
      } else if (diffHours < 168) {
        return `${Math.floor(diffHours / 24)}d ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };
  
    const handleActivityClick = (activity: RecentActivity) => {
      if (activity.eventId) {
        navigate(`/events/${activity.eventId}`);
      }
    };
  
    if (activities.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
            <p className="text-gray-600">Your activity will appear here</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${compact ? 'p-4' : 'p-6'}`}>
        {!compact && (
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        )}
  
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${
                !activity.isRead ? 'bg-blue-50 hover:bg-blue-100' : ''
              }`}
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} bg-opacity-10 mt-0.5`}>
                <div className={getActivityColor(activity.type).replace('bg-', 'text-')}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                  {!compact && !activity.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                  {activity.eventId && (
                    <>
                      <span className="text-gray-300">•</span>
                      <button className="text-xs text-[#1E3A5F] hover:text-[#2a4a7a] flex items-center gap-1">
                        View Event
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {!compact && activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/activity')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              View All Activity
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default RecentActivityFeed;