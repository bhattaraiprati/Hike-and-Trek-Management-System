// api/services/Hiker.ts
import axios from 'axios';
import type { HikerDashboardData } from '../../types/HikerTypes';
import { urlLink } from '../axiosConfig';


// Main dashboard data fetch
export const fetchHikerDashboard = async (): Promise<HikerDashboardData> => {
  const response = await axios.get(`${urlLink}/hiker/dashboard`,
    {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });
  return response.data;
};

// Optional: Separate endpoints for lazy loading
export const fetchHikerStats = async () => {
  const response = await axios.get(`${urlLink}/hiker/dashboard/stats`,
    {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  }
  );
  return response.data;
};

export const fetchUpcomingEvents = async () => {
  const response = await axios.get(`${urlLink}/hiker/dashboard/upcoming-events`,
    {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  }
  );
  return response.data;
};

export const fetchRecommendedEvents = async () => {
  const response = await axios.get(`${urlLink}/hiker/dashboard/recommended`,
    {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });
  return response.data;
};

export const fetchRecentActivity = async () => {
  const response = await axios.get(`${urlLink}/hiker/dashboard/activity`,
    {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });
  return response.data;
};

// export const fetchHikerDashboard = async (): Promise<HikerDashboardData> => {
//   // In real implementation, this would be an API call
//   // For now, return comprehensive mock data
//   return {
//     userInfo: {
//       name: 'Alex Johnson',
//       avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
//       membershipLevel: 'INTERMEDIATE',
//       streak: 15,
//     },
//     stats: {
//       upcomingEvents: 3,
//       completedTrips: 12,
//       totalDistance: 342,
//       unreadNotifications: 5,
//       totalEvents: 15,
//       averageRating: 4.8,
//     },
//     upcomingAdventures: [
//       {
//         id: 1,
//         title: 'Everest Base Camp Trek',
//         location: 'Khumbu Region, Nepal',
//         date: '2024-06-15',
//         imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
//         status: 'CONFIRMED',
//         difficulty: 'EXTREME',
//         daysUntil: 45,
//         organizer: 'Himalayan Adventures',
//         price: 1299,
//         meetingPoint: 'Kathmandu Airport',
//       },
//       {
//         id: 2,
//         title: 'Annapurna Circuit Trek',
//         location: 'Pokhara, Nepal',
//         date: '2024-05-20',
//         imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
//         status: 'PAYMENT_PENDING',
//         difficulty: 'DIFFICULT',
//         daysUntil: 20,
//         organizer: 'Mountain Guides Nepal',
//         price: 899,
//         meetingPoint: 'Pokhara Bus Park',
//       },
//       {
//         id: 3,
//         title: 'Langtang Valley Hike',
//         location: 'Langtang, Nepal',
//         date: '2024-07-10',
//         imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
//         status: 'WAITING_LIST',
//         difficulty: 'MODERATE',
//         daysUntil: 70,
//         organizer: 'Trek Nepal',
//         price: 499,
//         meetingPoint: 'Kathmandu City Center',
//       },
//     ],
//     recentActivities: [
//       {
//         id: 1,
//         type: 'REGISTRATION',
//         title: 'Registered for Everest Base Camp',
//         description: 'Successfully registered for Everest Base Camp Trek',
//         timestamp: '2024-04-10T14:30:00',
//         icon: 'Calendar',
//         color: 'text-blue-500',
//         eventId: 1,
//         isRead: true,
//       },
//       {
//         id: 2,
//         type: 'PAYMENT',
//         title: 'Payment Received',
//         description: 'Payment of $499 for Langtang Valley received',
//         timestamp: '2024-04-09T10:15:00',
//         icon: 'CreditCard',
//         color: 'text-green-500',
//         eventId: 3,
//         isRead: false,
//       },
//       {
//         id: 3,
//         type: 'MESSAGE',
//         title: 'New Message from Organizer',
//         description: 'Himalayan Adventures sent you a message',
//         timestamp: '2024-04-08T16:45:00',
//         icon: 'MessageSquare',
//         color: 'text-purple-500',
//         eventId: 1,
//         isRead: false,
//       },
//       {
//         id: 4,
//         type: 'REVIEW',
//         title: 'Review Published',
//         description: 'Your review for Annapurna Circuit was published',
//         timestamp: '2024-04-07T11:20:00',
//         icon: 'Star',
//         color: 'text-yellow-500',
//         eventId: 2,
//         isRead: true,
//       },
//       {
//         id: 5,
//         type: 'BOOKING',
//         title: 'Booking Confirmed',
//         description: 'Your booking for Mardi Himal is confirmed',
//         timestamp: '2024-04-06T09:30:00',
//         icon: 'CheckCircle',
//         color: 'text-orange-500',
//         eventId: 4,
//         isRead: true,
//       },
//     ],
//     recommendedEvents: [
//       {
//         id: 4,
//         title: 'Mardi Himal Trek',
//         location: 'Annapurna Region',
//         price: 399,
//         duration: '5-7 days',
//         difficulty: 'MODERATE',
//         rating: 4.9,
//         totalRatings: 127,
//         participants: 8,
//         maxParticipants: 12,
//         imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
//         organizer: 'Annapurna Treks',
//         matchPercentage: 92,
//         startDate: '2024-06-01',
//       },
//       {
//         id: 5,
//         title: 'Upper Mustang Trek',
//         location: 'Mustang Region',
//         price: 1499,
//         duration: '12-14 days',
//         difficulty: 'DIFFICULT',
//         rating: 4.7,
//         totalRatings: 89,
//         participants: 6,
//         maxParticipants: 10,
//         imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
//         organizer: 'Forbidden Kingdom Treks',
//         matchPercentage: 78,
//         startDate: '2024-07-15',
//       },
//       {
//         id: 6,
//         title: 'Ghorepani Poon Hill Trek',
//         location: 'Pokhara Region',
//         price: 299,
//         duration: '4-5 days',
//         difficulty: 'EASY',
//         rating: 4.5,
//         totalRatings: 256,
//         participants: 15,
//         maxParticipants: 20,
//         imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
//         organizer: 'Sunrise Treks',
//         matchPercentage: 85,
//         startDate: '2024-05-25',
//       },
//     ],
//     quickActions: [],
//   };
// };