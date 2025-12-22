import axios from "axios";
import { urlLink } from "../axiosConfig";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface OrganizerRegistrationDTO {
  fullName: string;
  organizationName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  documentUrl: string;
  about: string;
}

interface OTPVerification {
  email: string;
  otp: string;
}

interface ResendOTP {
  email: string;
}
export interface uploadImage{
  id:String,
  image: String
}

export const loginForm = async (data: LoginData) => {
  const response = await axios.post(`${urlLink}/auth/login`, data);
  return response.data;
};

export const registerForm = async (registerData: RegisterForm) => {
  const response = await axios.post(`${urlLink}/auth/register`, registerData);
  return response.data;
};

export const registerOrganizer = async (data: OrganizerRegistrationDTO) => {
  const response = await axios.post(`${urlLink}/auth/organizer_register`, data);
  return response.data;
};

export const verifyOTP = async (data: OTPVerification) => {
  const response = await axios.post(`${urlLink}/auth/verify-otp`, data);
  return response.data;
};

export const resendOTP = async (data: ResendOTP) => {
  const response = await axios.post(`${urlLink}/auth/resend-otp`, null, {
    params: { email: data.email }
  });
  return response.data;
};

export const checkAuth = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${urlLink}/event/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const uploadImage = async (data:uploadImage) => {
  const response = await axios.post(`${urlLink}/auth/uploadImage`, data);
  return response.data;
}

export const getProfileUrl = async (id:Number) => {
  const response = await axios.get(`${urlLink}/auth/getProfileImage`, {
    params: { id: id }
  });
  return response.data;
}


