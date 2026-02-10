import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  User, Calendar, Heart, MapPin, 
  Star, Camera,  Clock, 
   TrendingUp, 
  ChevronRight, LogOut,
  WalletCards,
  UserStar,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProfileUrl, uploadImage } from '../../api/services/authApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllEventsByUserId, getUpcommingEvents } from '../../api/services/Event';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';
import ReviewModal from '../../components/hiker/popup/ReviewModal';
import type { PendingReview, Review, ReviewStats } from '../../types/HikerTypes';

import { fetchMyReviews, fetchPendingReviews, submitReview, updateReview } from '../../api/services/ReviewApi';
import { getFavoriteEvents, getRecentActivity, toggleFavourite } from '../../api/services/Profile';
import { toast } from 'react-toastify';
import type { FavouriteEvent } from '../../types/Profile';


interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  meetingTime: string;
  participants: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bannerImageUrl: string;
}

export type BookingStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
export type DifficultyLevel = 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
export type PaymentMethod = 'esewa' | 'khalti' | 'cash' | 'bank_transfer';
export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

// Nested interfaces
export interface BookingOrganizer {
  name: string;
}

export interface BookingEvent {
  id: number;
  title: string;
  location: string;
  date: string; // ISO date string "2025-11-30"
  durationDays: number;
  status: BookingStatus;
  difficultyLevel: DifficultyLevel;
  price: number;
  bannerImageUrl: string;
  meetingPoint: string;
  meetingTime: string; // Time string "06:00:00"
  organizer: BookingOrganizer;
}

export interface BookingParticipant {
  count: number;
}

export interface BookingPayment {
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
}

// Main booking interface
export interface BookingResponse {
  bookingId: number;
  bookingDate: string; // ISO datetime string
  event: BookingEvent;
  participants: BookingParticipant[];
  payment: BookingPayment;
}

// For API response with array
export type BookingListResponse = BookingResponse[];


const HikerProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'favorites'| 'review' | 'payment'>('overview');
    const [preview, setPreview] = useState<string | null>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewStats, setReviewStats] = useState<ReviewStats>({
      totalReviews: 0,
      averageRating: 0,
      helpfulReviews: 0,
      pendingReviews: 0
    });
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [selectedPendingReview, setSelectedPendingReview] = useState<PendingReview | null>(null);
    const isSubmittingReview = false;
    const [showAllPending, setShowAllPending] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);


  const { 
    data: favoriteEvents = [], 
  } = useQuery({
    queryKey: ["favoriteEvents"],
    queryFn: getFavoriteEvents,
    staleTime: 30 * 1000, // 1 minute
  });

  const toggleMutation = useMutation({
    mutationFn: toggleFavourite,
    onMutate: async (eventId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["favoriteEvents"] });
      
      const previous = queryClient.getQueryData<FavouriteEvent[]>(["favoriteEvents"]);
      
      queryClient.setQueryData<FavouriteEvent[]>(["favoriteEvents"], (old = []) =>
        old.filter(e => e.eventId !== eventId)
      );
      
      return { previous };
    },
    
    onSettled: () => {
      // Refetch anyway (safe net)
      queryClient.invalidateQueries({ queryKey: ["favoriteEvents"] });
    },
    onSuccess: (isNowFavourite) => {
      if (!isNowFavourite) {
        toast.success("Removed from wishlist");
      }
    }
  });

  const handleToggleFavourite = (eventId: number) => {
    toggleMutation.mutate(eventId);
  };


  const {data: profileImageUrl} = useQuery({
    queryKey: ["profileUrl", user?.id],
    queryFn: () => getProfileUrl(Number(user?.id || 0) ),
    enabled: !!user?.id,
   
  })

  const {data: upcomingEventsData} = useQuery({
    queryKey: ["upcomingEvents", user?.id],
    queryFn: () => getUpcommingEvents(Number(user?.id || 0) ),
    enabled: !!user?.id,
    
  })

  const {data: EventHistoryData} = useQuery({
    queryKey: ["eventHistory", user?.id],
    queryFn: () => fetchAllEventsByUserId(Number(user?.id || 0), status='ALL' ),
    enabled: !!user?.id,
    
  })

  const { data: myReviews = [] } = useQuery<Review[]>({
  queryKey: ['myReviews'],
  queryFn: fetchMyReviews,
  enabled: activeTab === 'review'
});


const { data: pendingReviewsData = [] } = useQuery<PendingReview[]>({
  queryKey: ['pendingReviews'],
  queryFn: fetchPendingReviews,
  enabled: activeTab === 'review'
});

const { 
  data: recentActivityData = [], 
  isLoading: isLoadingActivity,
  isError: isActivityError 
} = useQuery({
  queryKey: ['recentActivity'],
  queryFn: getRecentActivity,
  staleTime: 30000,
});

const submitMutation = useMutation({
  mutationFn: (data: { rating: number; comment: string; images?: string[] }) => {
    if (selectedReview) {
      return updateReview(selectedReview.id, data);
    } else if (selectedPendingReview) {
      return submitReview({ ...data, eventId: selectedPendingReview.eventId });
    }
    throw new Error('No review selected');
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    queryClient.invalidateQueries({ queryKey: ['pendingReviews'] });
    setShowReviewModal(false);
  }
});


  const handleEventView = (eventId: number) => {
    navigate(`/hiker-dashboard/booking-confirmation/${eventId}`);
  };

  const handleUpcomingEventView = () => {
    navigate(`/hiker-dashboard/events`);
  };

  const upcomingEvents: UpcomingEvent[] = upcomingEventsData || [];
  const eventHistory: BookingResponse[] = EventHistoryData || [];
  const displayImage = preview || profileImageUrl ;

  const handleImageUpload = async (file: File, type: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Trek Sathi");
    data.append("cloud_name", "dtwunctra");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtwunctra/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      
      if(response.status == 200){
        uploadImage({id: user?.id?.toString()|| "", image: result.url});
      }
      // Update the corresponding image path in the form state
      if (type === "document") {
        setPreview(result.url);
      }

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      // setErrors(prev => ({ ...prev, document: 'Failed to upload document' }));
      return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'HIKER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Difficult': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityColor = (type: string): string => {
  const colors: Record<string, string> = {
    PAYMENT: 'border-green-200 bg-green-50/50',
    REGISTRATION: 'border-blue-200 bg-blue-50/50',
    REVIEW: 'border-yellow-200 bg-yellow-50/50',
    BOOKING_CONFIRMATION: 'border-green-200 bg-green-50/50',
    BOOKING_CANCELLED: 'border-red-200 bg-red-50/50',
    EVENT_APPROVED: 'border-green-200 bg-green-50/50',
    EVENT_REJECTED: 'border-red-200 bg-red-50/50',
    NEW_PARTICIPANT: 'border-purple-200 bg-purple-50/50',
    PAYMENT_RECEIVED: 'border-emerald-200 bg-emerald-50/50',
    TREK_UPDATE: 'border-indigo-200 bg-indigo-50/50',
    NEW_MESSAGE: 'border-blue-200 bg-blue-50/50',
  };
  return colors[type] || 'border-gray-200 bg-gray-50/50';
};
const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    PAYMENT: '💰',
    REGISTRATION: '📝',
    REVIEW: '⭐',
    BOOKING_CONFIRMATION: '✅',
    BOOKING_CANCELLED: '❌',
    EVENT_APPROVED: '✅',
    EVENT_REJECTED: '❌',
    NEW_PARTICIPANT: '👤',
    PAYMENT_RECEIVED: '💵',
    TREK_UPDATE: '🏔️',
    NEW_MESSAGE: '💬',
  };
  return icons[type] || '📌';
};


  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  // Add these event handlers
const handleWriteReview = (pendingReview: PendingReview) => {
  setSelectedPendingReview(pendingReview);
  setSelectedReview(null);
  setShowReviewModal(true);
};

const handleEditReview = (review: Review) => {
  setSelectedReview(review);
  setSelectedPendingReview(null);
  setShowReviewModal(true);
};



  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{

    const file = event.target.files?.[0];

    if (file){
      console.log('Selected file:', file);
      // Handle file upload here
      handleImageUpload(file, "document");
      // e.g., convert to base64, preview, upload to server
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Preview URL:', reader.result);
        setPreview(reader.result as string);
        // Set preview image if needed
      };
      reader.readAsDataURL(file);
    }

  };

  // Add this useEffect to load reviews data
useEffect(() => {
  if (activeTab === 'review') {
    // Calculate stats
    const avgRating = myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length || 0;
    const helpfulCount = myReviews.filter(r => r.isHelpful).length;
    
    setReviewStats({
      totalReviews: myReviews.length,
      averageRating: avgRating,
      helpfulReviews: helpfulCount,
      pendingReviews: pendingReviewsData.length
    });
    setPendingReviews(pendingReviewsData);
    setReviews(myReviews);
  }
}, [activeTab, myReviews, pendingReviewsData]);

const handleSubmitReview = async (reviewData: {
  rating: number;
  comment: string;
  images?: string[];
}) => {
  submitMutation.mutate(reviewData);
};

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              {/* Profile Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={displayImage}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileInputChange}
                    />
                    <button onClick={handleFileInput}  type="button" className=" absolute bottom-0 right-6 p-2 bg-[#1E3A5F] text-white rounded-full hover:bg-[#2a4a7a] transition-colors duration-200">
                      
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-sm text-gray-600 text-center mb-2">{user?.email}</p>
                <div className={`px-3 py-1 rounded-full text-sm font-medium text-center ${getLevelColor(user?.role|| "HIKER")}`}>
                  {user?.role}
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'overview'
                          ? 'bg-[#1E3A5F] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile Overview</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'events'
                          ? 'bg-[#1E3A5F] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>My Events</span>
                      <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {upcomingEvents.length}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'favorites'
                          ? 'bg-[#1E3A5F] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Wishlist</span>
                      <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {favoriteEvents.length}
                      </span>
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => setActiveTab('review')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'review'
                          ? 'bg-[#1E3A5F] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <UserStar className="w-5 h-5" />
                      <span>Reviews</span>
                      <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {reviews.length}
                      </span>
                    </button>
                  </li>

                   <li>
                    <button
                      onClick={() => setActiveTab('payment')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'payment'
                          ? 'bg-[#1E3A5F] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <WalletCards className="w-5 h-5" />
                      <span>Payment History</span>
                      <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {eventHistory.length}
                      </span>
                    </button>
                  </li>
                  
                </ul>
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-[#1E3A5F]">Recent Activity</h3>
                      {!isLoadingActivity && recentActivityData.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {recentActivityData.length} {recentActivityData.length === 1 ? 'activity' : 'activities'}
                        </span>
                      )}
                    </div>

                    {/* Loading State */}
                    {isLoadingActivity && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
                      </div>
                    )}

                    {/* Error State */}
                    {isActivityError && !isLoadingActivity && (
                      <div className="text-center py-12">
                        <p className="text-red-600 text-sm">
                          Failed to load recent activity. Please try again later.
                        </p>
                      </div>
                    )}

                    {/* Empty State */}
                    {!isLoadingActivity && !isActivityError && recentActivityData.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏔️</div>
                        <p className="text-gray-500 text-sm">No recent activity yet</p>
                        <p className="text-gray-400 text-xs mt-2">
                          Start exploring treks to see your activity here
                        </p>
                      </div>
                    )}

                    {/* Activity List */}
                    {!isLoadingActivity && !isActivityError && recentActivityData.length > 0 && (
                      <div className="space-y-3">
                        {recentActivityData.map((activity: any) => (
                          <div 
                            key={`${activity.type}-${activity.id}-${activity.timestamp}`}
                            className={`flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group ${getActivityColor(activity.type)}`}
                          >
                            <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                              {getActivityIcon(activity.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 mb-1">
                                {activity.title}
                              </div>
                              <div className="text-sm text-gray-600 line-clamp-1">
                                {activity.description}
                              </div>
                            </div>
                            
                            <div className="text-right flex-shrink-0">
                              <div className="text-xs text-gray-500 mb-1">
                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* View All Button */}
                    {!isLoadingActivity && recentActivityData.length >= 10 && (
                      <div className="mt-6 text-center">
                        <button className="text-sm text-[#1E3A5F] hover:text-[#2C5F8D] font-medium hover:underline">
                          View all activity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* My Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-8">
                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F]">Upcoming Events ({upcomingEvents.length})</h3>
                    <button onClick={() =>handleUpcomingEventView()} className="text-[#1E3A5F] hover:text-[#2a4a7a] text-sm font-medium flex items-center gap-1">
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="h-40 bg-gray-200">
                          <img
                            src={event.bannerImageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{event.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.meetingTime}
                            </div>
                          </div>
                          <button onClick={() => handleEventView(event.id)} className="w-full px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F]">Event History ({eventHistory.length})</h3>
                    <button className="text-[#1E3A5F] hover:text-[#2a4a7a] text-sm font-medium flex items-center gap-1">
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {eventHistory.map((events) => (
                          <tr key={events.bookingId} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={events.event.bannerImageUrl}
                                  alt={events.event.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{events.event.title}</div>
                                  <div className="text-sm text-gray-500">{events.event.organizer.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {new Date(events.event.date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                {/* <span className="font-medium">{events.rating}</span> */}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(events.event.difficultyLevel)}`}>
                                {events.event.difficultyLevel}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button className="text-[#1E3A5F] hover:text-[#2a4a7a] text-sm">
                                  View
                                </button>
                                {/* {!events.reviewSubmitted && (
                                  <button className="text-green-600 hover:text-green-800 text-sm">
                                    Write Review
                                  </button>
                                )} */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

             {/* Wishlist Tab */}
            {activeTab === 'review' && (
                  <div className="space-y-8">
                    {/* Review Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Star className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{reviewStats.totalReviews}</div>
                            <div className="text-sm text-gray-600">Total Reviews</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{reviewStats.averageRating.toFixed(1)}</div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{reviewStats.pendingReviews}</div>
                            <div className="text-sm text-gray-600">Pending Reviews</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pending Reviews Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1E3A5F]">Pending Reviews</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Share your experience from recent treks ({pendingReviews.length} remaining)
                          </p>
                        </div>
                        {pendingReviews.length > 0 && (
                          <button
                            onClick={() => setShowAllPending(!showAllPending)}
                            className="text-sm text-[#1E3A5F] hover:text-[#2a4a7a]"
                          >
                            {showAllPending ? 'Show Less' : 'View All'}
                          </button>
                        )}
                      </div>
                      
                      {pendingReviews.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h4>
                          <p className="text-gray-600">You've reviewed all your completed treks.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {(showAllPending ? pendingReviews : pendingReviews.slice(0, 3)).map((pendingReview) => (
                            <div
                              key={pendingReview.id}
                              className="border border-gray-200 rounded-xl p-4 hover:border-[#1E3A5F] transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={pendingReview.eventImage}
                                    alt={pendingReview.eventTitle}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{pendingReview.eventTitle}</h4>
                                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                    <span>Organizer: {pendingReview.organizerName}</span>
                                    <span>•</span>
                                    <span>Completed: {new Date(pendingReview.completedDate).toLocaleDateString()}</span>
                                  </div>
                                  {pendingReview.daysUntilExpiry <= 7 && (
                                    <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
                                      <AlertCircle className="w-4 h-4" />
                                      <span>Expires in {pendingReview.daysUntilExpiry} days</span>
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => handleWriteReview(pendingReview)}
                                  className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors whitespace-nowrap"
                                >
                                  Write Review
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* My Reviews Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1E3A5F]">My Reviews ({reviews.length})</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Your feedback helps other hikers
                          </p>
                        </div>
                        {reviews.length > 0 && (
                          <button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="text-sm text-[#1E3A5F] hover:text-[#2a4a7a]"
                          >
                            {showAllReviews ? 'Show Less' : 'View All'}
                          </button>
                        )}
                      </div>
                      
                      {reviews.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                          <p className="text-gray-600">Start reviewing your completed treks to help the community.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={review.eventImage}
                                      alt={review.eventTitle}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{review.eventTitle}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span>Organizer: {review.organizerName}</span>
                                      <span>•</span>
                                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                  Edit
                                </button>
                              </div>
                              
                              {/* Rating */}
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-5 h-5 ${
                                        star <= review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{review.rating}/5</span>
                              </div>
                              
                              {/* Comment */}
                              <p className="text-gray-700 mb-4">{review.comment}</p>
                              
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

            {/* Wishlist Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[#1E3A5F]">
                    My Wishlist ({favoriteEvents.length})
                  </h3>
                  
                </div>

                {favoriteEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Your wishlist is empty
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {favoriteEvents.map((event) => (
                      <div 
                        key={event.favouriteId} 
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="relative">
                          <div className="h-40 bg-gray-200">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = "/fallback-event.jpg" }}
                            />
                          </div>

                          <button
                            onClick={() => handleToggleFavourite(event.eventId)}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                            disabled={toggleMutation.isPending}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-1">
                            {event.title}
                          </h4>

                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty)}`}>
                                {event.difficulty}
                              </span>
                              <span className="text-red-600 text-xs">
                                {event.maxParticipants - event.currentParticipants} spots left
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-bold text-[#1E3A5F]">
                              ${event.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.organizerName}
                            </div>
                          </div>

                          <button className="w-full px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 text-sm">
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-[#1E3A5F]">Payment History</h3>
                    <button className="text-[#1E3A5F] hover:text-[#2a4a7a] text-sm font-medium"> 
                      View All
                    </button>
                  </div>
                   <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th> 
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">  
                        {eventHistory.map((booking) => (
                          <tr key={booking.bookingId} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-900">{booking.bookingId}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={booking.event.bannerImageUrl}
                                  alt={booking.event.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{booking.event.title}</div>
                                  <div className="text-sm text-gray-500">{booking.event.organizer.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">${booking.payment.amount.toFixed(2)}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.payment.status === 'success' ? 'bg-green-100 text-green-800' :
                                booking.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.payment.status}
                              </span>
                            </td>
                          </tr> 
                        ))}
                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
              )}
          </div>
        </div>
      </div>
    </div>

   <ReviewModal
  isOpen={showReviewModal}
  onClose={() => {
    setShowReviewModal(false);
    setSelectedReview(null);
    setSelectedPendingReview(null);
  }}
  pendingReview={selectedPendingReview}
  existingReview={selectedReview}
  onSubmit={handleSubmitReview}
  isSubmitting={isSubmittingReview}
/>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          setIsLogoutModalOpen(false);
          await logout();
        }}
        title=" Are you sure you want to logout?"
        message=" You will be signed out of your account and need to log in again to
          continue."
          buttonText="Logout"
      />
  </>
  );
};

export default HikerProfilePage;