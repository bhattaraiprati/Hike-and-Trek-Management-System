export type EventStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'ACTIVE' 
  | 'INACTIVE' 
  | 'CANCELLED' 
  | 'COMPLETED';

export type DifficultyLevel = 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME' | 'EXPERT';

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: DifficultyLevel;
  price: number;
  maxParticipants: number;
  meetingPoint: string;
  meetingTime: string;
  contactPerson: string;
  contactEmail: string;
  bannerImageUrl: string;
  includedServices: string[];
  requirements: string[];
  status: EventStatus;
  currentParticipants?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Full event details returned by API (has stats, registrations, reviews)
export interface EventDetails extends Event {
  // Statistics
  currentParticipants: number;
  registrationRate: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;

  // Nested data
  eventRegistration: EventRegistration[];
  reviews: Review[];

  // Organizer info (optional)
  organizer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    totalEvents: number;
    rating: number;
  };
}

export interface EventRegistration {
  id: number;
  registrationDate: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  contact: string;
  contactName: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  payment: {
    id: number;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    method: string;
    transactionDate: string;
  };
  eventParticipants: EventParticipant[];
}

export interface EventParticipant {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'REGISTERED';
}

export interface Review {
  id: number;
  user: {
    name: string;
    profileImage?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}