import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllEvents } from '../../api/services/Event';
import { Search, Filter, MapPin, Calendar, Users, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../components/common/Pagination';
import { DIFFICULTY_LABEL } from '../../types/eventTypes';
import type {  Difficulty } from '../../types/eventTypes';


// interface PaginationMetadata {
//   currentPage: number;
//   totalPages: number;
//   pageSize: number;
//   totalElements: number;
//   hasNext: boolean;
//   hasPrevious: boolean;
// }

// interface PaginatedResponse<T> {
//   data: T[];
//   pagination: PaginationMetadata;
// }
interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: Difficulty;
  price: number;
  maxParticipants: number;
  participantCount: number;
  bannerImageUrl: string;
  meetingPoint: string;
  meetingTime: string;
  contactPerson: string;
  contactEmail: string;
  includedServices: string[];
  requirements: string[];
  status: 'APPROVED';
  organizer: {
    id: number;
    name: string;
    rating: number;
    totalEvents: number;
  };
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
}

const ExploreEventsPage = () => {

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [dateRange, setDateRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['allEvents', currentPage],
    queryFn: () => getAllEvents(currentPage, 10),
  });



  const eventsData = events.data || [];
  const pagination = events?.pagination;

  // Filter and sort events
  const filteredEvents = eventsData
    .filter((event: Event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
                               event.difficultyLevel === selectedDifficulty;
      
      const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
      
      const matchesDate = dateRange === 'all' || 
                         (dateRange === 'upcoming' && new Date(event.date) >= new Date()) ||
                         (dateRange === 'this-weekend' && isThisWeekend(event.date)) ||
                         (dateRange === 'this-month' && isThisMonth(event.date));
      
      return matchesSearch && matchesDifficulty && matchesPrice && matchesDate;
    })
    .sort((a: Event, b: Event) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'participants':
          return b.participantCount - a.participantCount;
        case 'latest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Helper functions for date filtering
  function isThisWeekend(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + (6 - today.getDay()));
    const nextSunday = new Date(nextSaturday);
    nextSunday.setDate(nextSaturday.getDate() + 1);
    
    return date >= nextSaturday && date <= nextSunday;
  }

  function isThisMonth(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  const DIFFICULTY_COLOR: Record<Difficulty, string> = {
    EASY: 'bg-green-100 text-green-800',
    MODERATE: 'bg-yellow-100 text-yellow-800',
    DIFFICULT: 'bg-orange-100 text-orange-800',
    EXTREME: 'bg-red-100 text-red-800',
  };

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleEventView = (id: number) => { 
    navigate(`/hiker-dashboard/event/${id}`);

  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading events...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">Error loading events. Please try again.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#1E3A5F] mb-4">Explore Adventures</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing hiking and trekking experiences curated by professional organizers
            </p>
          </div>

          {/* Search and Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events, locations, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 items-center">
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

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="participants">Most Popular</option>
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                    >
                      <option value="all">All Levels</option>
                      <option value="EASY">{DIFFICULTY_LABEL.EASY}</option>
                      <option value="MODERATE">{DIFFICULTY_LABEL.MODERATE}</option>
                      <option value="DIFFICULT">{DIFFICULTY_LABEL.DIFFICULT}</option>
                      <option value="EXTREME">{DIFFICULTY_LABEL.EXTREME}</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                    >
                      <option value="all">Any Date</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="this-weekend">This Weekend</option>
                      <option value="this-month">This Month</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredEvents.length}</span> events
            </p>
            <div className="flex gap-2">
              {/* Quick Filter Chips */}
              {selectedDifficulty !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {DIFFICULTY_LABEL[selectedDifficulty as Difficulty]}
                </span>
              )}
              {priceRange[1] < 500 && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Under ${priceRange[1]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: Event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {event.isFeatured && (
                  <div className="bg-[#1E3A5F] text-white px-3 py-1 text-xs font-medium absolute top-3 left-3 rounded-full z-10">
                    Featured
                  </div>
                )}
                <div className="relative">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={event.bannerImageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => toggleFavorite(event.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
                        favorites.includes(event.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-600 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(event.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1">{event.title}</h3>
                    <span className="text-xl font-bold text-[#1E3A5F] ml-2">${event.price}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.durationDays} day{event.durationDays > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.participantCount}/{event.maxParticipants} spots <span></span>
                        <span className='text-red-600 text-sm'> {event.maxParticipants - event.participantCount} left</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLOR[event.difficultyLevel]}`}>
                        {DIFFICULTY_LABEL[event.difficultyLevel]}
                      </span>
                      {/* <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">4.5</span>
                        <span className="text-sm text-gray-500">200</span>
                      </div> */}
                    </div>
                    <button onClick={() => handleEventView(event.id)} className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredEvents.map((event: Event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 md:flex-shrink-0">
                    <div className="h-48 md:h-full bg-gray-200 overflow-hidden">
                      <img 
                        src={event.bannerImageUrl} 
                        alt={event.title}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {event.isFeatured && (
                          <span className="bg-[#1E3A5F] text-white px-2 py-1 text-xs font-medium rounded-full">
                              Featured
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLOR[event.difficultyLevel]}`}>
                            {DIFFICULTY_LABEL[event.difficultyLevel]}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => toggleFavorite(event.id)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            favorites.includes(event.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(event.id) ? 'fill-current' : ''}`} />
                        </button>
                       
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.durationDays} day{event.durationDays > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{event.participantCount}/{event.maxParticipants} spots {event.maxParticipants - event.participantCount} <span className='text-red-600 font-bold text-sm'>left</span></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-gray-700">{event.rating}</span>
                          <span className="text-gray-500">({event.reviewCount} reviews)</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          By <span className="font-medium">{event.organizer?.name}</span>
                        </div>
                      </div> */}
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-[#1E3A5F]">${event.price}</span>
                        <button onClick={() => handleEventView(event.id)} className="px-6 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more adventures.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('all');
                setPriceRange([0, 500]);
                setDateRange('all');
              }}
              className="px-6 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}


        
         {pagination && (
        <Pagination 
          pagination={pagination} 
          onPageChange={setCurrentPage}
          itemName="events"
        />
      )}
      </div>
    </div>
  );
};

export default ExploreEventsPage;