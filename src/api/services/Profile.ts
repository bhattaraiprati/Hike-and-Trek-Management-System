// api/services/Organizer.ts

import axios from "axios";

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
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
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

export const getOrganizerProfile = async (organizerId: number): Promise<OrganizerProfile> => {
  const response = await axios.get(`/api/organizers/${organizerId}/profile`);
  return response.data;
};

export const updateOrganizerProfile = async (organizerId: number, data: Partial<OrganizerProfile>): Promise<OrganizerProfile> => {
  const response = await axios.put(`/api/organizers/${organizerId}/profile`, data);
  return response.data;
};

export const getOrganizerStats = async (organizerId: number) => {
  const response = await axios.get(`/api/organizers/${organizerId}/stats`);
  return response.data;
};

export const getOrganizerEvents = async (organizerId: number, status?: string) => {
  const response = await axios.get(`/api/organizers/${organizerId}/events`, {
    params: { status }
  });
  return response.data;
};