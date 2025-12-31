export interface HikerDashboardData {
  userInfo: UserInfo;
  stats: HikerStats;
  upcomingAdventures: UpcomingAdventure[];
  recommendedEvents: RecommendedEvent[];
  recentActivities: RecentActivity[];
  quickActions: QuickAction[];
}

// User Info
export interface UserInfo {
  name: string;
  email: string;
  avatar: string | null;
  membershipLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  streak: number;
}

// Stats
export interface HikerStats {
  upcomingEvents: number;
  completedTrips: number;
  totalEvents: number;
  totalDistance: number;
  unreadNotifications: number;
}

// Upcoming Adventure
export interface UpcomingAdventure {
  id: number;
  title: string;
  location: string;
  date: string; // ISO date string
  difficulty: 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
  status: 'CONFIRMED' | 'PAYMENT_PENDING' | 'WAITING_LIST';
  imageUrl: string | null;
  organizer: string;
  meetingPoint: string | null;
  price: number;
  daysUntil: number;
}

// Recommended Event
export interface RecommendedEvent {
  id: number;
  title: string;
  location: string;
  startDate: string; // ISO date string
  difficulty: 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
  imageUrl: string | null;
  rating: number;
  totalRatings: number;
  participants: number;
  maxParticipants: number;
  price: number;
  duration: string;
  matchPercentage: number;
}

// Recent Activity
export interface RecentActivity {
  id: number;
  type: 'REGISTRATION' | 'PAYMENT' | 'MESSAGE' | 'REVIEW' | 'BOOKING';
  title: string;
  description: string;
  timestamp: string; // ISO datetime string
  eventId: number | null;
  isRead: boolean;
}

// Quick Action
export interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  count?: number;
}

// types/hikerTypes.ts
export interface Review {
  id: number;
  eventId: number;
  eventTitle: string;
  eventImage: string;
  organizerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  images?: string[];
  isHelpful?: boolean;
}

export interface PendingReview {
  id: number;
  eventId: number;
  eventTitle: string;
  eventImage: string;
  organizerName: string;
  completedDate: string;
  daysUntilExpiry: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  helpfulReviews: number;
  pendingReviews: number;
}