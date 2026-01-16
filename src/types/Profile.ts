// 1. Types (strongly recommended)
export interface FavouriteEvent {
  favouriteId: number;
  eventId: number;
  title: string;
  description: string;
  location: string;
  date: string;           // "2026-02-15"
  difficulty: string;     // "DIFFICULT" | "MODERATE" | "EASY"
  price: number;
  imageUrl: string;       // ← use this instead of bannerImageUrl
  organizerName: string;
  maxParticipants: number;
  currentParticipants: number;
  rating: number;
  totalRatings: number;
  addedAt: string;
  isAvailable: boolean;
  isRegistered: boolean;
}

export interface FavouritesPageResponse {
  favourites: FavouriteEvent[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}