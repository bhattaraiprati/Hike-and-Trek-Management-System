import axios from "axios";
import { urlLink } from "../axiosConfig";

export interface EventCreateRequest {
  title: string;
  description: string;
  location: string;
  date: string; // ISO date string
  durationDays: number;
  difficultyLevel: string; // Must be EASY/MODERATE/DIFFICULT/EXTREME
  price: number;
  maxParticipants: number;
  meetingPoint: string;
  meetingTime: string; // HH:mm
  contactPerson: string;
  contactEmail: string;
  bannerImageUrl?: string;
  includedServices?: string[];
  requirements?: string[];
}

export const createEvent = async (data: EventCreateRequest) => {
  const response = await axios.post(`${urlLink}/event/register-event`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming JWT is stored
    },
  });
  return response.data;
}