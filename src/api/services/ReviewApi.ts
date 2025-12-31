import axios from "axios";
import { urlLink } from "../axiosConfig";



  // Add API functions
export const fetchMyReviews = async () => {
  const res = await axios.get(`${urlLink}/reviews/my-reviews`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
};

 export const fetchPendingReviews = async () => {
  const res = await axios.get(`${urlLink}/reviews/pending`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
};

export const submitReview = async (data: { eventId: number; rating: number; comment: string }) => {
  const res = await axios.post(`${urlLink}/reviews`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
};

export const updateReview = async (id: number, data: { rating: number; comment: string }) => {
  const res = await axios.put(`${urlLink}/reviews/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data;
};