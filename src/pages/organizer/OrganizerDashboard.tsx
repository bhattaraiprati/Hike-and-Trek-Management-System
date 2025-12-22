import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getOrganizerDashboard, type DashboardData } from '../../api/services/Dashboard';

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['organizerDashboard', user?.id],
    queryFn: () => getOrganizerDashboard(Number(user?.id || 0)),
    enabled: !!user?.id,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-[#2D5016]';
      case 'Moderate': return 'bg-[#1B4332]';
      case 'Hard': return 'bg-[#1E3A5F]';
      default: return 'bg-[#495057]';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Confirmed' ? 'bg-[#2D5016]' : 'bg-[#FF6B35]';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return '⚠️';
      case 'admin': return '💬';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  // Calculate average rating from reviews
  const averageRating = dashboardData?.reviews.length
    ? (dashboardData.reviews.reduce((sum, r) => sum + r.rating, 0) / dashboardData.reviews.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-sans">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-sans">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600">Failed to load dashboard data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, upcomingEvents, recentRegistrations, reviews, notifications } = dashboardData;
  const organizerName = user?.name || 'Organizer';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-[#1B4332] mb-2">
            Hello, {organizerName} 👋
          </h1>
          <p className="font-body text-[#495057] text-lg">
            Here is your event activity overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Events Created', value: stats.totalEvents },
            { label: 'Total Participants', value: stats.totalParticipants },
            { label: 'New Reviews', value: stats.newReviews },
            { label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}` }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-body text-[#495057] text-sm mb-2">{stat.label}</h3>
              <p className="font-heading text-2xl font-semibold text-[#1B4332]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl font-semibold text-[#1B4332]">
                  Upcoming Events
                </h2>
                <button className="font-body text-sm text-[#1B4332] hover:text-[#2D5016] transition-colors">
                  View All
                </button>
              </div>
              
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {upcomingEvents.length === 0 ? (
                  <div className="w-full text-center py-8 text-gray-500">
                    No upcoming events
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="min-w-[280px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-heading font-semibold text-[#1B4332]">
                          {event.title}
                        </h3>
                        <span className={`${getDifficultyColor(event.difficulty)} text-white text-xs px-2 py-1 rounded-full font-body`}>
                          {event.difficulty}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-[#495057] text-sm font-body">
                          <span className="mr-2">📅</span>
                          {event.date} • {event.time}
                        </div>
                        <div className="flex items-center text-[#495057] text-sm font-body">
                          <span className="mr-2">👥</span>
                          {event.participants}/{event.maxParticipants} participants
                        </div>
                      </div>
                      
                      <button className="w-full bg-[#1B4332] text-white font-body text-sm py-2 rounded-lg hover:bg-[#2D5016] transition-colors">
                        Manage Event
                      </button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-[#1B4332] mb-6">
                Recent Registrations
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left font-body text-sm text-[#495057] pb-3">Name</th>
                      <th className="text-left font-body text-sm text-[#495057] pb-3">Event</th>
                      <th className="text-left font-body text-sm text-[#495057] pb-3">Registration Date</th>
                      <th className="text-left font-body text-sm text-[#495057] pb-3">Contact</th>
                      <th className="text-left font-body text-sm text-[#495057] pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No recent registrations
                        </td>
                      </tr>
                    ) : (
                      recentRegistrations.map((reg) => (
                      <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-body text-[#1B4332]">{reg.name}</td>
                        <td className="py-3 font-body text-[#495057] text-sm">{reg.event}</td>
                        <td className="py-3 font-body text-[#495057] text-sm">{reg.date}</td>
                        <td className="py-3 font-body text-[#495057] text-sm">{reg.contact}</td>
                        <td className="py-3">
                          <span className={`${getStatusColor(reg.status)} text-white text-xs px-2 py-1 rounded-full font-body`}>
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
           

            {/* Review Highlights */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <h2 className="font-heading text-xl font-semibold text-[#1B4332] mr-3">
                  Reviews
                </h2>
                <div className="flex items-center bg-[#1B4332] text-white px-3 py-1 rounded-full">
                  <span className="font-heading font-semibold mr-1">{averageRating}</span>
                  <span>⭐</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No reviews yet
                  </div>
                ) : (
                  reviews.map((review) => (
                  <div key={review.id} className="border-l-4 border-[#2D5016] pl-4 py-1">
                    <div className="flex items-center mb-1">
                      <span className="font-body text-sm text-[#495057] mr-2">
                        {'⭐'.repeat(review.rating)}
                      </span>
                      <span className="font-body text-xs text-[#495057]">{review.date}</span>
                    </div>
                    <p className="font-body text-sm text-[#1B4332] mb-1">
                      "{review.comment}"
                    </p>
                    <p className="font-body text-xs text-[#495057]">- {review.author}</p>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-[#1B4332] mb-4">
                Notifications
              </h2>
              
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg mr-3 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-body text-sm font-semibold text-[#1B4332]">
                        {notification.title}
                      </h3>
                      <p className="font-body text-xs text-[#495057]">
                        {notification.message}
                      </p>
                      <p className="font-body text-xs text-[#495057] mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;