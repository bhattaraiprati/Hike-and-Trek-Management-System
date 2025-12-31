import axios from "axios";
import { urlLink } from "../axiosConfig";

export interface EventRegisterDTO {
  eventId: number;
  userId: number;
  contactName: string;
  contact: string;
  email: string;
  participants: ParticipantDTO[];
  amount: number;
  method: 'ESEWA' | 'STRIPE' | 'KHALTI' | 'CARD';
}

export interface ParticipantDTO {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
}

export interface StripePaymentResponse {
  sessionId: string;
  sessionUrl: string;
  status: string;
  registrationId: number;
  message: string;
}

// Create Stripe Checkout Session
export const createStripeCheckoutSession = async (
  payload: EventRegisterDTO
): Promise<StripePaymentResponse> => {
  const response = await axios.post(
    `${urlLink}/hiker/payment/stripe/create-checkout-session`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// Verify Stripe Payment (called from success page)
export const verifyStripePayment = async (sessionId: string) => {
  const response = await axios.get(
    `${urlLink}/hiker/payment/stripe/verify`,
    {
      params: { session_id: sessionId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};