import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Calendar, MapPin, Users, Clock, Eye, Star, ChevronRight,
  MessageCircle, Phone, Download, Share2, X, ChevronLeft,
  AlertCircle, CheckCircle, User
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllEventsByUserId } from '../../api/services/Event';
import { useAuth } from '../../context/AuthContext';

interface EnhancedBooking {
  bookingId: number;
  bookingDate: string;
  contactName: string;
  contactPhone: string;
  event: {
    id: number;
    title: string;
    location: string;
    date: string;
    durationDays: number;
    status: string; // DRAFT, ACTIVE, INACTIVE, COMPLETED, CANCEL
    difficultyLevel: string;
    price: number;
    maxParticipants?: number;
    bannerImageUrl: string;
    meetingPoint: string;
    meetingTime: string;
    description?: string;
    includedServices: string[];
    requirements: string[];
    organizer: {
      name: string;
      phone: string;
    };
  };
  participants: { count: number }[];
  payment: {
    method: string;
    amount: number;
    status: string;
  };
  reviewSummary?: {
    averageRating: number;
    totalReviews: number;
    hasReviewed: boolean;
  };
  chatRoom?: {
    id: number;
    unreadMessages: number;
    lastMessageAt: string;
  };
  actions: {
    canCancel: boolean;
    canReview: boolean;
    canReschedule: boolean;
  };
}

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomStatus, setSelectedCustomStatus] = useState('ALL'); // New filter
   const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedBooking, setSelectedBooking] = useState<EnhancedBooking | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Fetch all bookings (no status param needed anymore unless backend supports filtering)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bookings', user?.id, selectedStatus],
    queryFn: () => fetchAllEventsByUserId(Number(user?.id), selectedStatus),
    enabled: !!user?.id && !!selectedStatus,
  });

  const bookingsData = data || [];

  // Derive custom status for display and filtering
  const getCustomStatus = (eventStatus: string): string => {
    switch (eventStatus) {
      case 'ACTIVE':
      case 'INACTIVE':
        return 'UPCOMING';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'CANCEL':
        return 'CANCELLED';
      case 'DRAFT':
        return 'DRAFT';
      default:
        return 'UPCOMING';
    }
  };

  const getCustomStatusColor = (customStatus: string) => {
    switch (customStatus) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Stats based on custom status
  const stats = useMemo(() => {
    const total = bookingsData.length;
    const totalSpent = bookingsData.reduce((sum: number, b: EnhancedBooking) => sum + b.payment.amount, 0);

    const upcoming = bookingsData.filter((b: EnhancedBooking) => {
      const status = getCustomStatus(b.event.status);
      return status === 'UPCOMING';
    }).length;

    const completed = bookingsData.filter((b: EnhancedBooking) => getCustomStatus(b.event.status) === 'COMPLETED').length;
    const cancelled = bookingsData.filter((b: EnhancedBooking) => getCustomStatus(b.event.status) === 'CANCELLED').length;
    const draft = bookingsData.filter((b: EnhancedBooking) => getCustomStatus(b.event.status) === 'DRAFT').length;

    return { total, totalSpent, upcoming, completed, cancelled, draft };
  }, [bookingsData]);

  // Filtering
  const filteredBookings = useMemo(() => {
    return bookingsData.filter((booking: EnhancedBooking) => {
      const matchesSearch =
        booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toString().includes(searchTerm);

      const customStatus = getCustomStatus(booking.event.status);

      const matchesStatus =
        selectedCustomStatus === 'ALL' ||
        (selectedCustomStatus === 'UPCOMING' && customStatus === 'UPCOMING') ||
        (selectedCustomStatus === 'COMPLETED' && customStatus === 'COMPLETED') ||
        (selectedCustomStatus === 'CANCELLED' && customStatus === 'CANCELLED') ||
        (selectedCustomStatus === 'DRAFT' && customStatus === 'DRAFT');

      return matchesSearch && matchesStatus;
    });
  }, [bookingsData, searchTerm, selectedCustomStatus]);

  const handleViewDetails = (bookingId: number) => {
    navigate(`/hiker-dashboard/booking-confirmation/${bookingId}`);
  };

  const handleWriteReview = (bookingId: number) => {
    navigate(`/hiker/write-review/${bookingId}`);
  };

  const handleJoinChat = (chatRoomId: number) => {
    navigate(`/hiker/chat/${chatRoomId}`);
  };

  const openDrawer = (booking: EnhancedBooking) => {
    setSelectedBooking(booking);
    setShowDrawer(true);
  };

  // Loading & Error
  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your bookings...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Bookings</h2>
        <p className="text-gray-600 mb-4">Unable to load your bookings. Please try again.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a]">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your adventure bookings</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">NPR {stats.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Total Spent</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600 mt-1">Upcoming</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600 mt-1">Cancelled</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by event, location, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-1E3A5F focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="SUCCESS">Completed</option>
                <option value="CANCEL">Cancelled</option>
                <option value="PENDING">Pending</option>
              </select>
              <select
                value={selectedCustomStatus}
                onChange={(e) => setSelectedCustomStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
              >
                <option value="ALL">All Bookings</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-3 ${view === 'grid' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-3 ${view === 'list' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCustomStatus !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Start exploring adventures and make your first booking!'}
            </p>
            <button
              onClick={() => navigate('/hiker-dashboard/explore')}
              className="px-6 py-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2a4a7a] font-medium"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map((booking: EnhancedBooking) => {
                  const customStatus = getCustomStatus(booking.event.status);
                  return (
                    <div key={booking.bookingId} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="relative">
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={booking.event.bannerImageUrl}
                            alt={booking.event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                            }}
                          />
                        </div>
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getCustomStatusColor(customStatus)}`}>
                          {customStatus}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors">
                            {booking.event.title}
                          </h3>
                          <span className="text-xl font-bold text-[#1E3A5F]">
                            NPR {booking.payment.amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{booking.event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            {booking.participants[0]?.count || 1} participant{booking.participants[0]?.count !== 1 ? 's' : ''}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm">
                            <span className="text-gray-600">Booking ID</span>
                            <span className="font-mono font-medium ml-1">#{booking.bookingId}</span>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            {booking.payment.method.toUpperCase()} · Paid ✓
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(booking.bookingId)}
                            className="flex-1 px-4 py-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2a4a7a] font-medium text-sm flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {booking.actions?.canReview && (
                            <button
                              onClick={() => handleWriteReview(booking.bookingId)}
                              className="px-4 py-3 border border-green-300 text-green-600 rounded-xl hover:bg-green-50 text-sm flex items-center justify-center gap-1"
                            >
                              <Star className="w-4 h-4" />
                              Review
                            </button>
                          )}

                          {booking.chatRoom && (
                            <button
                              onClick={() => handleJoinChat(booking.chatRoom!.id)}
                              className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </button>
                          )}

                          <button
                            onClick={() => openDrawer(booking)}
                            className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // List View remains similar – status badge updated
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Location</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.map((booking: EnhancedBooking) => {
                        const customStatus = getCustomStatus(booking.event.status);
                        return (
                          <tr key={booking.bookingId} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={booking.event.bannerImageUrl}
                                  alt={booking.event.title}
                                  className="w-12 h-12 rounded-lg object-cover mr-4"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                                  }}
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{booking.event.title}</div>
                                  <div className="text-xs text-gray-500">ID #{booking.bookingId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(booking.event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-sm text-gray-500">{booking.event.location}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {booking.participants[0]?.count || 1} participant{booking.participants[0]?.count !== 1 ? 's' : ''}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              NPR {booking.payment.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{booking.payment.method.toUpperCase()}</div>
                              <div className="text-xs font-medium text-green-600">Paid ✓</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCustomStatusColor(customStatus)}`}>
                                {customStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleViewDetails(booking.bookingId)}
                                  className="text-[#1E3A5F] hover:text-[#2a4a7a] font-medium text-sm flex items-center gap-1"
                                >
                                  View <ChevronRight className="w-4 h-4" />
                                </button>
                                {booking.chatRoom && (
                                  <button
                                    onClick={() => handleJoinChat(booking.chatRoom!.id)}
                                    className="text-indigo-500 hover:text-indigo-600"
                                    title="Chat"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Drawer remains unchanged */}
        {showDrawer && selectedBooking && (
          // ... (same drawer code as before)
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center p-4">
            {/* Drawer content – unchanged */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;