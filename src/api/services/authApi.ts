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