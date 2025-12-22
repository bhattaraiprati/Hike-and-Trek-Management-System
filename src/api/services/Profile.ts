import axios from "axios";
import { urlLink } from "../axiosConfig";

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