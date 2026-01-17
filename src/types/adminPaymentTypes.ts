// Payment Status Enum
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'RELEASED' | 'ALL';

// Payment Method Enum
export type PaymentMethod = 'ESEWA' | 'STRIPE' | 'CARD' | 'ALL';

// Nested User Info
interface PaymentUserInfo {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

// Nested Event Info
interface PaymentEventInfo {
    id: number;
    title: string;
    date: string;
    location: string;
}

// Nested Organizer Info
interface PaymentOrganizerInfo {
    id: number;
    name: string;
    organization: string; // organization_name in backend might be mapped to organization in DTO
    email: string;
}

// Nested Registration Info
interface PaymentRegistrationInfo {
    id: number;
    participants: number;
    bookingDate: string;
}

// Main Admin Payment DTO
export interface AdminPaymentDTO {
    id: number; // Backend sends int, but keeping number is safe
    transactionId: string;
    amount: number;
    fee: number;
    netAmount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    paymentDate: string; // ISO String

    // Release info
    releasedDate?: string;
    releaseNotes?: string;
    releasedBy?: PaymentUserInfo;

    // Verification info
    verifiedAt?: string;
    verifiedBy?: PaymentUserInfo;

    user: PaymentUserInfo;
    event: PaymentEventInfo;
    organizer: PaymentOrganizerInfo;
    registration: PaymentRegistrationInfo;
}

// Payment Statistics DTO
export interface PaymentStatsDTO {
    totalRevenue: number;
    pendingPayments: number;
    completedPayments: number;
    releasedPayments: number;
    totalFee: number;
    netRevenue: number;
    todayRevenue: number;
    averagePayment: number;
}

// Organizer Balance DTO
export interface OrganizerBalanceDTO {
    organizerId: number;
    organizerName: string;
    organization: string;
    pendingAmount: number;
    releasedAmount: number;
    totalBalance: number;
    pendingPayments: number;
}
