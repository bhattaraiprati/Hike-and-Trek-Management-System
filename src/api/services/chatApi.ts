import axios from "axios";
import { urlLink } from "../axiosConfig";


export interface  ChatRoomResponse {
  roomId: number;
  roomName: string;
  type: 'direct' | 'group' | 'event';
  eventTitle?: string;
  participantCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface ChatMessageResponse {
  messageId: number;
  chatRoomId: number;
  content: string;
  senderId: number;
  senderName: string;
  timestamp: string;
}

export const fetchChatRooms = async (): Promise<ChatRoomResponse[]> => {
  const response = await axios.get(`${urlLink}/chat/rooms`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const fetchChatMessages = async (roomId: number, limit = 50): Promise<ChatMessageResponse[]> => {
  const response = await axios.get(`${urlLink}/chat/rooms/${roomId}/messages`, {
    params: { limit },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getUserChatRooms = async (): Promise<ChatRoomResponse> => {
  const response = await axios.get(`${urlLink}/chat/rooms`, {
    headers: {  

      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
} 
export const getRoomStatus = async (eventId: number) => {
  const response = await axios.get(`${urlLink}/chat/rooms/${eventId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response;
};

export const createChatRoom = async (eventId: number, name: string) => {
  const response = await axios.post(`${urlLink}/chat/rooms/create/${eventId}`, null, {
    params: { name },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};