// components/hiker/dashboard/RecommendedEvents.tsx
import { Star, MapPin, Users, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RecommendedEvent } from '../../../types/HikerTypes';


interface RecommendedEventsProps {
  events: RecommendedEvent[];
  compact?: boolean;
}

const RecommendedEvents = ({ events, compact = false }: RecommendedEventsProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-orange-100 text-orange-800';
      case 'EXTREME': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (percentage >= 75) return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/hiker-dashboard/event/${eventId}`);
  };

  const handleExploreAll = () => {
    navigate('/hiker-dashboard/explore');
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations</h3>
          <p className="text-gray-600">Complete your profile to get personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1E3A5F]" />
          Recommended For You
        </h2>
        <button
          onClick={handleExploreAll}
          className="text-sm text-[#1E3A5F] hover:text-[#2a4a7a] font-medium flex items-center gap-1"
        >
          See All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#1E3A5F] hover:shadow-md transition-all group cursor-pointer"
            onClick={() => handleViewEvent(event.id)}
          >
            {/* Event Image with Match Badge */}
            <div className="relative h-40">
              <img
                src={event.imageUrl || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <div className={`px-3 py-1.5 rounded-full text-white text-xs font-medium ${getMatchColor(event.matchPercentage)}`}>
                  {event.matchPercentage}% Match
                </div>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty)}`}>
                  {event.difficulty}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#1E3A5F] line-clamp-1">
                {event.title}
              </h3>
              
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(event.startDate)}
                </div>
              </div>

              {/* Rating and Participants */}
              <div className="flex items-center justify-between mb-4">
                
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {event.participants}/{event.maxParticipants}
                  </span>
                </div>
              </div>

              {/* Price and Duration */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${event.price}
                  </div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-gray-900">{event.duration}</div>
                  <div className="text-xs text-gray-500">duration</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="mt-6">
          <button
            onClick={handleExploreAll}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            Explore More Events
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendedEvents;