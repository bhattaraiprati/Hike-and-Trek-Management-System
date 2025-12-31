// src/components/search/AdvancedSearch.tsx

import { useState } from 'react';
import {
  Search, Calendar, MapPin, 
  Filter, X,  User, Star, Users,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';

interface SearchFilters {
  query: string;
  difficultyLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  minDuration?: number;
  maxDuration?: number;
  location?: string;
  organizerName?: string;
  organizerId?: number;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: string;
}

interface SearchResult {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  bannerImageUrl: string;
  status: string;
  organizer: {
    id: number;
    name: string;
    organizationName: string;
    rating: number;
    totalEvents: number;
  };
  averageRating: number;
  reviewCount: number;
}

interface SearchResponse {
  results: SearchResult[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface QuickSuggestion {
  type: 'EVENT' | 'ORGANIZER' | 'LOCATION';
  text: string;
  value: string;
  icon: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    page: 0,
    size: 12,
    sortBy: 'date',
    sortDirection: 'ASC'
  });

  const debouncedQuery = useDebounce(filters.query, 500);

  // Quick search suggestions
  const { data: suggestions = [] } = useQuery<QuickSuggestion[]>({
    queryKey: ['searchSuggestions', debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.length < 2) return [];
      const response = await fetch(
        `${API_BASE_URL}/api/search/suggestions?query=${encodeURIComponent(debouncedQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return response.json();
    },
    enabled: debouncedQuery.length >= 2
  });

  // Main search results
  const { data: searchResponse, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/api/search?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: true // Always enable, even with empty query to show all active events
  });

  const results = searchResponse?.results || [];
  const pagination = {
    currentPage: searchResponse?.currentPage || 0,
    totalPages: searchResponse?.totalPages || 1,
    hasNext: searchResponse?.hasNext || false,
    hasPrevious: searchResponse?.hasPrevious || false
  };

  const handleSuggestionClick = (suggestion: QuickSuggestion) => {
    if (suggestion.type === 'EVENT') {
      navigate(`/hiker-dashboard/event/${suggestion.value}`);
    } else if (suggestion.type === 'ORGANIZER') {
      setFilters(prev => ({ ...prev, organizerId: Number(suggestion.value), query: '' }));
      setShowFilters(false);
    } else if (suggestion.type === 'LOCATION') {
      setFilters(prev => ({ ...prev, location: suggestion.value, query: '' }));
      setShowFilters(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EVENT': return <Calendar className="w-4 h-4" />;
      case 'ORGANIZER': return <User className="w-4 h-4" />;
      case 'LOCATION': return <MapPin className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-orange-100 text-orange-800';
      case 'EXTREME': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      page: 0,
      size: 12,
      sortBy: 'date',
      sortDirection: 'ASC'
    });
    setShowFilters(false);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E3A5F] mb-2">Explore Adventures</h1>
          <p className="text-gray-600">Discover amazing trekking and hiking events near you</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value, page: 0 }))}
                placeholder="Search events, locations, or organizers..."
                className="w-full pl-14 pr-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-medium transition-all ${
                showFilters
                  ? 'bg-[#1E3A5F] text-white shadow-lg'
                  : 'bg-white border-2 border-gray-300 hover:border-[#1E3A5F]'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters {Object.keys(filters).some(k => filters[k as keyof SearchFilters] && k !== 'page' && k !== 'size' && k !== 'sortBy' && k !== 'sortDirection') && '(Active)'}
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-3 bg-gray-100 rounded-xl">
                    {getIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{suggestion.text}</div>
                    <div className="text-sm text-gray-500 capitalize">{suggestion.type.toLowerCase()}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={filters.difficultyLevel || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, difficultyLevel: e.target.value || undefined, page: 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]"
                >
                  <option value="">All Levels</option>
                  <option value="EASY">Easy</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="DIFFICULT">Difficult</option>
                  <option value="EXTREME">Extreme</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (NPR)</label>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined, page: 0 }))}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (NPR)</label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 0 }))}
                  placeholder="Any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || undefined, page: 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || undefined, page: 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined, page: 0 }))}
                  placeholder="e.g., Pokhara, Annapurna"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {searchResponse && (
                  <span>{searchResponse.totalElements} events found</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2 font-medium"
                >
                  <X className="w-5 h-5" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg">Failed to load events. Please try again later.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No events found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search query or filters to see more results.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {results.map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/hiker-dashboard/event/${event.id}`)}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.bannerImageUrl || 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold ${getDifficultyColor(event.difficultyLevel)}`}>
                      {event.difficultyLevel}
                    </div>
                    {event.averageRating > 0 && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-sm">{event.averageRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-600">({event.reviewCount})</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-[#1E3A5F]" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-[#1E3A5F]" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-5 h-5 text-[#1E3A5F]" />
                          <span>{event.currentParticipants}/{event.maxParticipants} joined</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-[#1E3A5F]">NPR {event.price.toLocaleString()}</span>
                      </div>
                      <button className="px-6 py-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2a4a7a] font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevious}
                  className="px-5 py-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + Math.max(0, pagination.currentPage - 2);
                    if (pageNum >= pagination.totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          pageNum === pagination.currentPage
                            ? 'bg-[#1E3A5F] text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-5 py-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};