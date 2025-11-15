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

interface OTPVerification {
  email: string;
  otp: string;
}

interface ResendOTP {
  email: string;
}

export const loginForm = async (data: LoginData) => {
  const response = await axios.post(`${urlLink}/api/auth/login`, data);
  return response.data;
};

export const registerForm = async (registerData: RegisterForm) => {
  const response = await axios.post(`${urlLink}/api/auth/register`, registerData);
  return response.data;
};

export const verifyOTP = async (data: OTPVerification) => {
  const response = await axios.post(`${urlLink}/api/auth/verify-otp`, data);
  return response.data;
};

export const resendOTP = async (data: ResendOTP) => {
  const response = await axios.post(`${urlLink}/api/auth/resend-otp`, null, {
    params: { email: data.email }
  });
  return response.data;
};