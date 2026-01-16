// components/hiker/dashboard/UpcomingAdventures.tsx
import { Calendar, MapPin, Users, Clock, AlertCircle, CreditCard } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import type { UpcomingAdventure } from '../../../types/HikerTypes';

interface UpcomingAdventuresProps {
  adventures: UpcomingAdventure[];
  showTitle?: boolean;
}

const UpcomingAdventures = ({ adventures, showTitle = true }: UpcomingAdventuresProps) => {
  const navigate = useNavigate();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Calendar className="w-3.5 h-3.5" />,
          text: 'Confirmed'
        };
      case 'PAYMENT_PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <CreditCard className="w-3.5 h-3.5" />,
          text: 'Payment Pending'
        };
      case 'WAITING_LIST':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Users className="w-3.5 h-3.5" />,
          text: 'Waiting List'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          text: 'Pending'
        };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-orange-100 text-orange-800';
      case 'EXTREME': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountdownText = (daysUntil: number) => {
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil < 7) return `In ${daysUntil} days`;
    if (daysUntil < 30) return `In ${Math.floor(daysUntil / 7)} weeks`;
    return `In ${Math.floor(daysUntil / 30)} months`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const handleViewDetails = (adventureId: number) => {
    navigate(`/hiker-dashboard/booking-confirmation/${adventureId}`);
  };

  if (adventures.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Adventures</h3>
          <p className="text-gray-600 mb-6">You haven't registered for any events yet.</p>
          <button
            onClick={() => navigate('/events/explore')}
            className="px-6 py-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2a4a7a] transition-colors font-medium"
          >
            Explore Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1E3A5F]" />
            Upcoming Adventures
          </h2>
          <button
            onClick={() => navigate('/events/my-events')}
            className="text-sm text-[#1E3A5F] hover:text-[#2a4a7a] font-medium"
          >
            View All ({adventures.length})
          </button>
        </div>
      )}

      <div className="space-y-4">
        {adventures.map((adventure) => {
          const status = getStatusConfig(adventure.status);
          const countdownText = getCountdownText(adventure.daysUntil);
          
          return (
            <div
              key={adventure.id}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:border-[#1E3A5F] transition-all duration-300 cursor-pointer"
              onClick={() => handleViewDetails(adventure.bookingId)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Event Image */}
                <div className="md:w-48 flex-shrink-0">
                  <div className="relative h-48 md:h-full">
                    <img
                      src={adventure.imageUrl || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'}
                      alt={adventure.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-1">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-small border ${status.color} flex items-center gap-1.5`}>
                        {status.icon}
                        {status.text}
                      </span>
                    </div>
                    <div className="absolute top-3 right-1">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-small ${getDifficultyColor(adventure.difficulty)}`}>
                        {adventure.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1 p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1E3A5F]">
                        {adventure.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {adventure.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(adventure.date)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium text-blue-600">{countdownText}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 mb-4">
                        Organized by <span className="font-medium">{adventure.organizer}</span>
                        {adventure.meetingPoint && (
                          <> • Meeting at {adventure.meetingPoint}</>
                        )}
                      </div>
                    </div>

                    <div className="md:text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPrice(adventure.price)}
                      </div>
                      <div className="text-sm text-gray-600">per person</div>
                    </div>
                  </div>

                  {/* Progress Bar for Waiting List */}
                  {adventure.status === 'WAITING_LIST' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Position in waiting list</span>
                        <span>#5</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: '40%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {adventures.length >= 3 && (
        <div className="mt-6 pt-5 border-t border-gray-200">
          <button
            onClick={() => navigate('/events/my-events')}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-700 rounded-xl hover:border-[#1E3A5F] hover:text-[#1E3A5F] transition-colors font-medium"
          >
            + View All {adventures.length} Adventures
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingAdventures;