export interface PaymentSummaryDTO {
    totalIncome: number;
    completedPayments: number;
    pendingPayments: number;
    refundedPayments: number;
    monthlyGrowth: number;
    currency: string;
    totalParticipants: number;
    averagePayment: number;
    platformFee: number;
    // totalRevenue: number; // Removed as JSON has totalIncome
    // pendingAmount: number; // Removed as JSON has pendingPayments count
    // releasedAmount: number; // Removed as JSON has completedPayments count
    // totalEvents: number; // Not in JSON summary, though in events array
}

export interface EventPaymentDTO {
    id: number;
    eventId: number;
    eventTitle: string;
    eventDate: string; // LocalDate yyyy-MM-dd
    totalParticipants: number;
    paidParticipants: number;
    totalRevenue: number;
    averagePaymentPerPerson: number;
    organizerShare: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface ParticipantPaymentDTO {
    id: number;
    participantName: string;
    participantEmail: string;
    eventId: number;
    eventTitle: string;
    numberOfParticipants: number;
    paymentDate: string; // LocalDateTime ISO
    amount: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'RELEASED';
    paymentMethod: 'CREDIT_CARD' | 'ESEWA' | 'BANK_TRANSFER' | 'CASH' | 'STRIPE';
    transactionId: string;
    receiptUrl: string;
}

export interface MonthlyRevenueDTO {
    month: string;
    revenue: number;
    growth: number;
    events: number;
    participants: number;
}

export interface PaymentDashboardDTO {
    summary: PaymentSummaryDTO;
    events: EventPaymentDTO[];
    participantPayments: ParticipantPaymentDTO[];
    recentPayments: ParticipantPaymentDTO[];
    revenueChart: MonthlyRevenueDTO[];
}

export interface PaymentFilterDTO {
    dateRange?: {
        from: string;
        to: string;
    };
    status?: string;
    paymentMethod?: string;
    eventId?: number;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
