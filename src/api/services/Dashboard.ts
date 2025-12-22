import axios from "axios";
import { urlLink } from "../axiosConfig";

// Types matching your React component
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  participants: number;
  maxParticipants: number;
  image: string;
}

export interface Registration {
  id: number;
  name: string;
  event: string;
  date: string;
  contact: string;
  status: 'Confirmed' | 'Pending';
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface Notification {
  id: number;
  type: 'system' | 'admin' | 'alert';
  title: string;
  message: string;
  time: string;
}

export interface DashboardData {
  stats: {
    totalEvents: number;
    totalParticipants: number;
    newReviews: number;
    totalEarnings: number;
  };
  upcomingEvents: Event[];
  recentRegistrations: Registration[];
  reviews: Review[];
  notifications: Notification[];
}

// Map backend difficulty enum to frontend
const mapDifficulty = (difficulty: string): 'Easy' | 'Moderate' | 'Hard' => {
  const upper = difficulty.toUpperCase();
  if (upper === 'EASY') return 'Easy';
  if (upper === 'MODERATE' || upper === 'MEDIUM') return 'Moderate';
  if (upper === 'HARD' || upper === 'DIFFICULT') return 'Hard';
  return 'Easy'; // default
};

// Map backend registration status to frontend
const mapRegistrationStatus = (status: string): 'Confirmed' | 'Pending' => {
  const upper = status.toUpperCase();
  if (upper === 'CONFIRMED' || upper === 'APPROVED' || upper === 'SUCCESS') {
    return 'Confirmed';
  }
  return 'Pending';
};

// Map backend notification type to frontend
const mapNotificationType = (type: string): 'system' | 'admin' | 'alert' => {
  const upper = type.toUpperCase();
  if (upper.includes('ALERT') || upper.includes('WARNING')) return 'alert';
  if (upper.includes('ADMIN') || upper.includes('MESSAGE')) return 'admin';
  return 'system';
};

// Format date for display
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateStr;
  }
};

// Format time for display
const formatTime = (timeStr: string | null): string => {
  if (!timeStr) return '';
  try {
    // Handle LocalTime format (HH:mm:ss) or full datetime
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0]);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    }
    return timeStr;
  } catch {
    return timeStr;
  }
};

// Format relative time (e.g., "2 days ago")
const formatRelativeTime = (dateStr: string | null): string => {
  if (!dateStr) return 'Unknown';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
};

/**
 * Fetch organizer dashboard data
 * @param userId - The organizer's user ID
 * @returns Dashboard data including stats, events, registrations, reviews, and notifications
 */
export const getOrganizerDashboard = async (userId: number): Promise<DashboardData> => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get<any>(
    `${urlLink}/auth/organizer/dashboard/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    stats: {
      totalEvents: data.stats?.totalEvents || 0,
      totalParticipants: data.stats?.totalParticipants || 0,
      newReviews: data.stats?.newReviews || 0,
      totalEarnings: data.stats?.totalEarnings || 0,
    },
    upcomingEvents: (data.upcomingEvents || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      date: formatDate(event.date),
      time: formatTime(event.time),
      difficulty: mapDifficulty(event.difficulty || 'EASY'),
      participants: event.participants || 0,
      maxParticipants: event.maxParticipants || 0,
      image: event.image || '/api/placeholder/300/200',
    })),
    recentRegistrations: (data.recentRegistrations || []).map((reg: any) => ({
      id: reg.id,
      name: reg.name || 'Unknown',
      event: reg.event || 'Unknown Event',
      date: formatDate(reg.registrationDate),
      contact: reg.contact || reg.email || 'N/A',
      status: mapRegistrationStatus(reg.status || 'PENDING'),
    })),
    reviews: (data.reviews || []).map((review: any) => ({
      id: review.id,
      rating: review.rating || 0,
      comment: review.comment || '',
      author: review.author || 'Anonymous',
      date: formatRelativeTime(review.date),
    })),
    notifications: (data.notifications || []).map((notif: any) => ({
      id: notif.id,
      type: mapNotificationType(notif.type || 'SYSTEM'),
      title: notif.title || 'Notification',
      message: notif.message || '',
      time: formatRelativeTime(notif.time),
    })),
  };
};

