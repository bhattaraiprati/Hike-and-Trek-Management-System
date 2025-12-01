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
  const response = await axios.post(`${urlLink}/organizer/event/register-event`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export const getOrganizerEvents = async (organizerId: string) => {
  const response = await axios.get(`${urlLink}/organizer/event/organizer/${organizerId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });
  return response.data; 

}

export const updateEvent = async (eventId: number, data: Partial<EventCreateRequest>) => {
  const response = await axios.put(`${urlLink}/organizer/event/${eventId}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });
  return response.data;
} 

export const getAllEvents = async () => {

  const response = await axios.get(`${urlLink}/event/all`, {  
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });
  return response.data; 
 }

 export const getEventById = async (eventId: number) => {
  const response = await axios.get(`${urlLink}/event/${eventId}`, {  
    headers: {  

      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });
  return response.data;
} 