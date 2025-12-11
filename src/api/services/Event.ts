import axios from "axios";
import { urlLink } from "../axiosConfig";
import type { EventRegistrationResponse } from "../../pages/hiker/BookingConfirmationPage";

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

export interface ParticipantDTO {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
}

export interface EventRegisterDTO {
  eventId: number;
  userId: number;
  contactName: string;
  contact: string;
  email: string;
  participants: ParticipantDTO[];
  amount: number;
  method: 'ESEWA' | 'KHALTI' | 'CARD';
}

export const createEvent = async (data: EventCreateRequest) => {
  const response = await axios.post(`${urlLink}/organizer/event/register-event`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export const getOrganizerEvents = async (organizerId: number) => {
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

export const getAllEvents = async (page: number, size: number) => {

  const response = await axios.get(`${urlLink}/event/all`, {  
    params: { page, size },
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

export const registerEvent = async (data: EventRegisterDTO) => {
  const response = await axios.post(`${urlLink}/event/register/event`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const fetchBookingDetails = async (id: number): Promise<EventRegistrationResponse> => {
  const response = await axios.get<EventRegistrationResponse>(`${urlLink}/hiker/registration/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  console.log("Fetched booking details:", response.data);
  return response.data;
};

export const fetchAllEventsByUserId = async (userId: number, status: string) => {
  const response = await axios.get(`${urlLink}/hiker/registration/events/${userId}`, {
    params: { status },
    headers: {  
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data; 
}

export const getUpcommingEvents = async (id:Number) => {
  const response = await axios.get(`${urlLink}/hiker/registration/upcoming`,{
    params: { id },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data; 
}

export const getEventDetails = async (eventId: number) => {
  const response = await axios.get(`${urlLink}/organizer/event/allEventsDetails/${eventId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}