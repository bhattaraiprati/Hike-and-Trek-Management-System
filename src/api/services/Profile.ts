import axios from "axios";
import { urlLink } from "../axiosConfig";
import type { FavouriteEvent, FavouritesPageResponse } from "../../types/Profile";

export interface OrganizerProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  website?: string;
  experienceYears: number;
  specialization: string[];
  profileImage?: string;
  bannerImage?: string;
  totalEvents: number;
  completedEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  averageRating: number;
  memberSince: string;
  verificationStatus: "SUCCESS" | "PENDING" | "UNVERIFIED";
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  stats: {
    totalRevenue: number;
    repeatClients: number;
    satisfactionRate: number;
  };
}

// Map backend status (e.g. APPROVED/PENDING/REJECTED) to UI enum
const mapVerificationStatus = (
  status: string
): OrganizerProfile["verificationStatus"] => {
  if (status === "APPROVED" || status === "SUCCESS") return "SUCCESS";
  if (status === "PENDING") return "PENDING";
  return "UNVERIFIED";
};

export const getOrganizerProfile = async (
  userId: number
): Promise<OrganizerProfile> => {
  const { data } = await axios.get<any>(
    `${urlLink}/auth/organizer/profile/${userId}`
  );

  return {
    ...data,
    specialization: data.specialization ?? [],
    stats: data.stats ?? {
      totalRevenue: 0,
      repeatClients: 0,
      satisfactionRate: 0,
    },
    verificationStatus: mapVerificationStatus(data.verificationStatus),
  };
};

export const updateOrganizerProfile = async (
  userId: number,
  payload: Partial<OrganizerProfile>
): Promise<OrganizerProfile> => {
  const body = {
    name: payload.name,
    phone: payload.phone,
    bio: payload.bio,
    location: payload.location,
    profileImage: payload.profileImage,
    bannerImage: payload.bannerImage,
  };

  const { data } = await axios.put<any>(
    `${urlLink}/auth/organizer/profile/${userId}`,
    body
  );

  return {
    ...data,
    specialization: data.specialization ?? [],
    stats: data.stats ?? {
      totalRevenue: 0,
      repeatClients: 0,
      satisfactionRate: 0,
    },
    verificationStatus: mapVerificationStatus(data.verificationStatus),
  };
};

export const handleAddtoFavorites = async (
  eventId: number
) => {
  const response  = await axios.post(
    `${urlLink}/hiker/favourites`,
    {eventId},{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const handleGetAllFavorites = async () => {
  const response  = await axios.get(
    `${urlLink}/hiker/favourites`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    }
  );
  return response.data;
}

export const toggleFavorite = async (eventId: number) => {
  const response = await axios.post(
    `${urlLink}/hiker/favourites/toggle/${eventId}`,
    {}, // empty body
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await axios.get(
    `${urlLink}/hiker/dashboard/activity`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },  

    }
  );
  return response.data;
};

export const getFavoriteEvents = async (): Promise<FavouriteEvent[]> => {
  const { data }: { data: FavouritesPageResponse } = await axios.get(
    `${urlLink}/hiker/favourites?page=0&size=20`, // adjust size if needed
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },  

    }
  );
  return data.favourites;
};

export const toggleFavourite = async (eventId: number): Promise<boolean> => {
  try {
    const { data } = await axios.post(
      `${urlLink}/hiker/favourites/toggle/${eventId}`,
      {}, // empty body
      {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },  

    }
    );
    
    // Usually backend returns message that contains "added" or "removed"
    const isNowFavourite = data.message?.toLowerCase().includes("added") ?? false;
    return isNowFavourite;
  } catch (error) {
    console.error("Toggle favourite failed:", error);
    throw error;
  }
};

// Optional - more explicit remove
export const removeFavourite = async (eventId: number) => {
  await axios.delete(
    `${urlLink}/hiker/favourites/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },  

    }
  );
};
