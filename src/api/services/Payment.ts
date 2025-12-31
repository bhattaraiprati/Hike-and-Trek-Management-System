import axios from "axios";
import { urlLink } from "../axiosConfig";
import type { EventPayment, MonthlyRevenue, ParticipantPayment, PaymentFilter, PaymentSummary } from "../../types/paymentTypes";

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

// Fetch Payment Summary for Organizer Dashboard

// api/services/Payment.ts
interface PaymentDashboardResponse {
  summary: PaymentSummary;
  events: EventPayment[];
  participantPayments: ParticipantPayment[];
  recentPayments: ParticipantPayment[];
  revenueChart: MonthlyRevenue[];
}

export const fetchPaymentDashboard = async (filters: PaymentFilter): Promise<PaymentDashboardResponse> => {
  const response = await axios.get('/api/organizer/payments/dashboard', {
    params: filters
  });
  return response.data;
};

export const fetchEventPayments = async (eventId: number) => {
  const response = await axios.get(`/api/organizer/events/${eventId}/payments`);
  return response.data;
};

export const exportPayments = async (filters: PaymentFilter) => {
  const response = await axios.get('/api/organizer/payments/export', {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};

export const sendPaymentReminder = async (paymentId: number) => {
  const response = await axios.post(`/api/organizer/payments/${paymentId}/reminder`);
  return response.data;
};

// Mock data for development
export const getMockPaymentData = (): PaymentDashboardResponse => {
  return {
    summary: {
      totalIncome: 45280,
      pendingPayments: 1560,
      completedPayments: 43720,
      refundedPayments: 320,
      averagePayment: 189.33,
      monthlyGrowth: 12.5,
      currency: 'USD',
      totalParticipants: 239,
      platformFee: 10
    },
    events: [
      {
        id: 1,
        eventId: 101,
        eventTitle: 'Everest Base Camp Trek',
        eventDate: '2024-06-15',
        totalRevenue: 12990,
        totalParticipants: 10,
        paidParticipants: 10,
        pendingPayments: 0,
        averagePaymentPerPerson: 1299,
        status: 'ACTIVE',
        organizerShare: 11691,
        platformFee: 1299
      },
      {
        id: 2,
        eventId: 102,
        eventTitle: 'Annapurna Circuit',
        eventDate: '2024-05-20',
        totalRevenue: 8990,
        totalParticipants: 12,
        paidParticipants: 10,
        pendingPayments: 2,
        averagePaymentPerPerson: 899,
        status: 'ACTIVE',
        organizerShare: 8091,
        platformFee: 899
      },
      {
        id: 3,
        eventId: 103,
        eventTitle: 'Langtang Valley Trek',
        eventDate: '2024-04-10',
        totalRevenue: 7475,
        totalParticipants: 15,
        paidParticipants: 15,
        pendingPayments: 0,
        averagePaymentPerPerson: 499,
        status: 'COMPLETED',
        organizerShare: 6727.5,
        platformFee: 747.5
      }
    ],
    participantPayments: [
      {
        id: 1,
        participantId: 201,
        participantName: 'John Smith',
        participantEmail: 'john@example.com',
        eventId: 101,
        eventTitle: 'Everest Base Camp Trek',
        paymentDate: '2024-03-15',
        amount: 1299,
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        transactionId: 'TXN-001-ECB',
        numberOfParticipants: 1,
        receiptUrl: 'https://example.com/receipts/txn-001.pdf'
      },
      {
        id: 2,
        participantId: 202,
        participantName: 'Sarah Johnson',
        participantEmail: 'sarah@example.com',
        eventId: 101,
        eventTitle: 'Everest Base Camp Trek',
        paymentDate: '2024-03-20',
        amount: 2598,
        status: 'COMPLETED',
        paymentMethod: 'PAYPAL',
        transactionId: 'TXN-002-ECB',
        numberOfParticipants: 2,
        receiptUrl: 'https://example.com/receipts/txn-002.pdf'
      },
      {
        id: 3,
        participantId: 203,
        participantName: 'Mike Wilson',
        participantEmail: 'mike@example.com',
        eventId: 102,
        eventTitle: 'Annapurna Circuit',
        paymentDate: '2024-03-10',
        amount: 899,
        status: 'PENDING',
        paymentMethod: 'BANK_TRANSFER',
        transactionId: 'TXN-003-AC',
        numberOfParticipants: 1
      }
    ],
    recentPayments: [
      {
        id: 4,
        participantId: 204,
        participantName: 'Emma Davis',
        participantEmail: 'emma@example.com',
        eventId: 103,
        eventTitle: 'Langtang Valley Trek',
        paymentDate: '2024-04-01',
        amount: 998,
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        transactionId: 'TXN-004-LVT',
        numberOfParticipants: 2
      },
      {
        id: 5,
        participantId: 205,
        participantName: 'Robert Brown',
        participantEmail: 'robert@example.com',
        eventId: 101,
        eventTitle: 'Everest Base Camp Trek',
        paymentDate: '2024-03-28',
        amount: 1299,
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        transactionId: 'TXN-005-ECB',
        numberOfParticipants: 1
      }
    ],
    revenueChart: [
      { month: 'Nov 23', revenue: 8500, events: 4, participants: 45, growth: 5.2 },
      { month: 'Dec 23', revenue: 9200, events: 5, participants: 48, growth: 8.2 },
      { month: 'Jan 24', revenue: 12500, events: 6, participants: 62, growth: 35.9 },
      { month: 'Feb 24', revenue: 11800, events: 5, participants: 59, growth: -5.6 },
      { month: 'Mar 24', revenue: 15200, events: 7, participants: 76, growth: 28.8 },
      { month: 'Apr 24', revenue: 18900, events: 8, participants: 95, growth: 24.3 }
    ]
  };
};