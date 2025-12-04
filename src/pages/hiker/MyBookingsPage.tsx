import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search,  Calendar, MapPin, Users, Clock, Eye,  Star, ChevronRight} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllEventsByUserId } from '../../api/services/Event';
import { useAuth } from '../../context/AuthContext';

interface Booking {
  id: string;
  bookingDate: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  event: {
    id: number;
    title: string;
    date: string;
    durationDays: number;
    location: string;
    bannerImageUrl: string;
    meetingPoint: string;
    meetingTime: string;
    organizer: string;
    difficultyLevel: 'Easy' | 'Moderate' | 'Difficult' | 'Expert';
  };
  participants: {
    count: number;
    list: string[];
  };
  payment: {
    amount: number;
    method: 'esewa' | 'card' | 'khalti' | 'cash';
    status: 'paid' | 'pending' | 'refunded';
  };
  canCancel: boolean;
  canReview: boolean;
  reviewSubmitted?: boolean;
}

const MyBookingsPage = () => {
    const {user} = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('upcoming');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
//   const [selectedBookings, setSelectedBookings] = useState<string[]>([]);


    const {data, isLoading, error} = useQuery({
        queryKey: ['bookings'],
        queryFn: () => fetchAllEventsByUserId(Number(user?.id)), // Replace 0 with a fallback or handle undefined user ID
        enabled: !!user?.id,
        retry: 1
    })
    useEffect(() => {
        if (data) {
            
        }
      }, [data]);
  // Mock booking data
  const bookingsData: Booking[] = [
    {
      id: 'BK202406151234',
      bookingDate: '2024-05-20',
      status: 'upcoming',
      event: {
        id: 1,
        title: 'Sunrise Mountain Trek',
        date: '2024-06-15',
        durationDays: 2,
        location: 'Mount Serenity, Alpine Range',
        bannerImageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        meetingPoint: 'Alpine Base Camp Parking Lot',
        meetingTime: '05:30 AM',
        organizer: 'TrekNepal Adventures',
        difficultyLevel: 'Moderate'
      },
      participants: {
        count: 2,
        list: ['John Doe', 'Jane Doe']
      },
      payment: {
        amount: 258,
        method: 'esewa',
        status: 'paid'
      },
      canCancel: true,
      canReview: false
    },
    {
      id: 'BK202407200567',
      bookingDate: '2024-04-15',
      status: 'completed',
      event: {
        id: 2,
        title: 'Forest Valley Exploration',
        date: '2024-05-20',
        durationDays: 1,
        location: 'Green Valley National Park',
        bannerImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        meetingPoint: 'National Park Visitor Center',
        meetingTime: '08:00 AM',
        organizer: 'Forest Tours',
        difficultyLevel: 'Easy'
      },
      participants: {
        count: 1,
        list: ['John Doe']
      },
      payment: {
        amount: 79,
        method: 'card',
        status: 'paid'
      },
      canCancel: false,
      canReview: true,
      reviewSubmitted: false
    },
    {
      id: 'BK202408100891',
      bookingDate: '2024-06-01',
      status: 'upcoming',
      event: {
        id: 3,
        title: 'Advanced Rock Climbing',
        date: '2024-08-10',
        durationDays: 3,
        location: 'Granite Peak',
        bannerImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        meetingPoint: 'Climbing Gear Shop',
        meetingTime: '06:00 AM',
        organizer: 'Climb Experts',
        difficultyLevel: 'Difficult'
      },
      participants: {
        count: 1,
        list: ['John Doe']
      },
      payment: {
        amount: 299,
        method: 'khalti',
        status: 'paid'
      },
      canCancel: true,
      canReview: false
    },
    {
      id: 'BK202406080345',
      bookingDate: '2024-05-10',
      status: 'cancelled',
      event: {
        id: 4,
        title: 'Coastal Cliff Walk',
        date: '2024-06-08',
        durationDays: 1,
        location: 'Ocean View Cliffs',
        bannerImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        meetingPoint: 'Coastal Visitor Center',
        meetingTime: '09:00 AM',
        organizer: 'Coastal Walks',
        difficultyLevel: 'Easy'
      },
      participants: {
        count: 3,
        list: ['John Doe', 'Alice Smith', 'Bob Johnson']
      },
      payment: {
        amount: 195,
        method: 'cash',
        status: 'refunded'
      },
      canCancel: false,
      canReview: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'esewa': return 'eSewa';
      case 'card': return 'Card';
      case 'khalti': return 'Khalti';
      case 'cash': return 'Cash';
      default: return method;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'refunded': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filterBookings = () => {
    return bookingsData.filter(booking => {
      const matchesSearch = booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
      
      const matchesDate = selectedDateFilter === 'all' || 
                         (selectedDateFilter === 'upcoming' && booking.status === 'upcoming') ||
                         (selectedDateFilter === 'past' && booking.status === 'completed') ||
                         (selectedDateFilter === 'month' && isWithinMonth(booking.event.date));

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const isWithinMonth = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);
    return eventDate >= now && eventDate <= nextMonth;
  };

  const filteredBookings = filterBookings();



  const handleWriteReview = (bookingId: string) => {
    navigate(`/hiker/write-review/${bookingId}`);
  };

  const handleViewDetails = (bookingId: string) => {
    navigate(`/hiker/booking/${bookingId}`);
  };



  const stats = {
    total: bookingsData.length,
    upcoming: bookingsData.filter(b => b.status === 'upcoming').length,
    completed: bookingsData.filter(b => b.status === 'completed').length,
    cancelled: bookingsData.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your adventure bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookings by event, location, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>

              {/* Date Filter */}
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming Only</option>
                <option value="past">Past Events</option>
                <option value="month">Next 30 Days</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 ${view === 'grid' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 ${view === 'list' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

       
        </div>

        {/* Bookings Grid/List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedStatus !== 'all' ? 'Try adjusting your search criteria' : 'Start exploring adventures and make your first booking!'}
            </p>
            <button
              onClick={() => navigate('/hiker/explore')}
              className="px-6 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium"
            >
              Explore Events
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Booking Header */}
                <div className="relative">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={booking.event.bannerImageUrl}
                      alt={booking.event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                   
                  </div>
                
                </div>

                {/* Booking Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{booking.event.title}</h3>
                    <span className="text-lg font-bold text-[#1E3A5F]">${booking.payment.amount}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{booking.event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {booking.participants.count} participant{booking.participants.count !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {booking.event.durationDays} day{booking.event.durationDays > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Booking ID: </span>
                      <span className="font-mono font-medium">{booking.id}</span>
                    </div>
                    <div className={`text-sm font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                      {getPaymentMethodText(booking.payment.method)} • {booking.payment.status}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(booking.id)}
                      className="flex-1 px-3 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
            
                  </div>

                  {/* Additional Actions */}
                  <div className="flex gap-0 mt-3">
          
                    {booking.canReview && !booking.reviewSubmitted && (
                      <button
                        onClick={() => handleWriteReview(booking.id)}
                        className="flex-1 px-3 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 text-sm flex items-center justify-center gap-1"
                      >
                        <Star className="w-4 h-4" />
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
         
                  <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
            
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={booking.event.bannerImageUrl}
                          alt={booking.event.title}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{booking.event.title}</div>
                          <div className="text-xs text-gray-500">ID: {booking.id}</div>
                          <div className="text-xs text-gray-500">{booking.event.organizer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(booking.event.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">{booking.event.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.participants.count} person{booking.participants.count !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${booking.payment.amount} total
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getPaymentMethodText(booking.payment.method)}
                      </div>
                      <div className={`text-xs font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                        {booking.payment.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(booking.id)}
                          className="text-[#1E3A5F] hover:text-[#2a4a7a] transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                        >
                          View
                          <ChevronRight className="w-4 h-4" />
                        </button>
                  
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (optional) */}
        {filteredBookings.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                Previous
              </button>
              <button className="px-3 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;