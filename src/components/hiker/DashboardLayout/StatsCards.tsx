// components/hiker/dashboard/StatsCards.tsx
import { Calendar, CheckCircle, MapPin, Bell } from 'lucide-react';
import type { HikerStats } from '../../../types/HikerTypes';


interface StatsCardsProps {
  stats: HikerStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const statCards = [
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-blue-500',
      change: '+2 this month',
      description: 'Scheduled adventures',
    },
    {
      title: 'Completed Trips',
      value: stats.completedTrips,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-500',
      change: `${Math.round((stats.completedTrips / stats.totalEvents) * 100)}% success rate`,
      description: 'Finished successfully',
    },
    {
      title: 'Distance Covered',
      value: `${stats.totalDistance} km`,
      icon: <MapPin className="w-5 h-5" />,
      color: 'bg-purple-500',
      change: '+45km this month',
      description: 'Total kilometers hiked',
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications,
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-orange-500',
      change: 'Unread messages',
      description: 'Require your attention',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
              <div className={stat.color.replace('bg-', 'text-')}>
                {stat.icon}
              </div>
            </div>
            {/*  */}
            {stat.title === 'Notifications' && stat.value ? (
              <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {stat.value} new
              </span>
            ) : (
              <span className="text-xs font-medium text-gray-500">
                {stat.change}
              </span>
            )}
          </div>
          
          <div className="mb-2">
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-lg font-medium text-gray-900">{stat.title}</div>
          </div>
          
          <div className="text-sm text-gray-600">{stat.description}</div>
          
          {stat.title === 'Distance Covered' && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  style={{ width: `${Math.min((stats.totalDistance / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Progress towards 500km goal
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;