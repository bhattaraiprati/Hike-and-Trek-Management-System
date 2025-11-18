import React from 'react';

// Types
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  participants: number;
  maxParticipants: number;
  image: string;
}

interface Registration {
  id: string;
  name: string;
  event: string;
  date: string;
  contact: string;
  status: 'Confirmed' | 'Pending';
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface Notification {
  id: string;
  type: 'system' | 'admin' | 'alert';
  title: string;
  message: string;
  time: string;
}

const OrganizerDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const organizerName = "Alex Morgan";
  
  const stats = {
    totalEvents: 12,
    totalParticipants: 348,
    newReviews: 8,
    totalEarnings: 12560
  };

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Sunrise Mountain Trail',
      date: 'Nov 25, 2024',
      time: '05:30 AM',
      difficulty: 'Moderate',
      participants: 23,
      maxParticipants: 40,
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Forest Waterfall Hike',
      date: 'Nov 28, 2024',
      time: '08:00 AM',
      difficulty: 'Easy',
      participants: 18,
      maxParticipants: 25,
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Alpine Summit Challenge',
      date: 'Dec 2, 2024',
      time: '06:00 AM',
      difficulty: 'Hard',
      participants: 12,
      maxParticipants: 15,
      image: '/api/placeholder/300/200'
    }
  ];

  const recentRegistrations: Registration[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      event: 'Sunrise Mountain Trail',
      date: 'Nov 20, 2024',
      contact: 'sarah@email.com',
      status: 'Confirmed'
    },
    {
      id: '2',
      name: 'Mike Chen',
      event: 'Forest Waterfall Hike',
      date: 'Nov 19, 2024',
      contact: 'mike@email.com',
      status: 'Pending'
    },
    {
      id: '3',
      name: 'Emma Davis',
      event: 'Alpine Summit Challenge',
      date: 'Nov 18, 2024',
      contact: 'emma@email.com',
      status: 'Confirmed'
    }
  ];

  const reviews: Review[] = [
    {
      id: '1',
      rating: 5,
      comment: 'Amazing trail and excellent guidance! Will definitely join again.',
      author: 'James Wilson',
      date: '2 days ago'
    },
    {
      id: '2',
      rating: 4,
      comment: 'Beautiful scenery and well-organized event.',
      author: 'Lisa Brown',
      date: '3 days ago'
    }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'alert',
      title: 'Weather Alert',
      message: 'Heavy rain predicted for Forest Waterfall Hike',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'admin',
      title: 'New Feature',
      message: 'Participant messaging system is now available',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      message: 'Dashboard performance improvements completed',
      time: '2 days ago'
    }
  ];

  const chartData = [30, 45, 35, 55, 40, 60, 75, 65, 70, 80, 65, 85];

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
                {upcomingEvents.map((event) => (
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
                ))}
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
                    {recentRegistrations.map((reg) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Event Performance Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-[#1B4332] mb-6">
                Event Performance
              </h2>
              
              <div className="h-48 flex items-end justify-between space-x-1">
                {chartData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-[#2C5F8D] rounded-t transition-all hover:bg-[#1E3A5F]"
                      style={{ height: `${value}%` }}
                    />
                    <span className="font-body text-xs text-[#495057] mt-2">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-body text-sm text-[#495057] text-center mt-4">
                Registration trend over last 12 events
              </p>
            </div>

            {/* Review Highlights */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <h2 className="font-heading text-xl font-semibold text-[#1B4332] mr-3">
                  Reviews
                </h2>
                <div className="flex items-center bg-[#1B4332] text-white px-3 py-1 rounded-full">
                  <span className="font-heading font-semibold mr-1">4.8</span>
                  <span>⭐</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {reviews.map((review) => (
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
                ))}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-[#1B4332] mb-4">
                Notifications
              </h2>
              
              <div className="space-y-3">
                {notifications.map((notification) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;