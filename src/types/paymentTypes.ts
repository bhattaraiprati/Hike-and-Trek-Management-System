// types/paymentTypes.ts
export interface PaymentSummary {
  totalIncome: number;
  pendingPayments: number;
  completedPayments: number;
  refundedPayments: number;
  averagePayment: number;
  monthlyGrowth: number;
  currency: string;
  platformFee: number;
  totalParticipants: number;

}

export interface EventPayment {
  id: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  totalRevenue: number;
  totalParticipants: number;
  paidParticipants: number;
  pendingPayments: number;
  averagePaymentPerPerson: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  organizerShare: number;
  platformFee: number;
}

export interface ParticipantPayment {
  id: number;
  participantId: number;
  participantName: string;
  participantEmail: string;
  eventId: number;
  eventTitle: string;
  paymentDate: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CREDIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH';
  transactionId: string;
  numberOfParticipants: number;
  receiptUrl?: string;
  notes?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  events: number;
  participants: number;
  growth: number;
}

export interface PaymentFilter {
  dateRange: {
    from: string;
    to: string;
  };
  status: 'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  eventId?: number;
  paymentMethod?: string;
}