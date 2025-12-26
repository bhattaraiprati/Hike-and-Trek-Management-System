// api/services/notificationApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const fetchNotifications = async (page = 0, size = 10): Promise<NotificationPage> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size }
  });
  return response.data;
};

export const fetchUnreadCount = async (): Promise<number> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.unreadCount;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.put(`${API_BASE_URL}/notifications/${id}/read`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const markAllNotificationsAsRead = async (): Promise<number> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.markedCount;
};

export const deleteNotification = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};