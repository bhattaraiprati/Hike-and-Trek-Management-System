// Admin Organizer Types based on backend DTOs

export type ApprovalStatus = 'PENDING' | 'SUCCESS' | 'DECLINE';

// Stats DTO
export interface AdminOrganizerStatsDTO {
    totalOrganizers: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

// VerifiedBy DTO (nested in detail)
export interface VerifiedByDTO {
    id: number;
    email: string;
    fullName: string;
}

// List DTO - for table display
export interface OrganizerVerificationListDTO {
    id: number;
    // User details
    userId: number;
    email: string;
    fullName: string;
    profileImage?: string;
    // Organizer details
    organizationName: string;
    contactPerson: string;
    address: string;
    phone: string;
    documentUrl: string;
    // Status
    approvalStatus: ApprovalStatus;
    verifiedByName?: string;
    verifiedOn?: string;
    createdAt: string;
    // Stats
    eventsCount: number;
}

// Detail DTO - for modal view
export interface OrganizerVerificationDetailDTO {
    id: number;
    // User details
    userId: number;
    email: string;
    fullName: string;
    profileImage?: string;
    // Organizer details
    organizationName: string;
    contactPerson: string;
    address: string;
    phone: string;
    coverImage?: string;
    documentUrl: string;
    about: string;
    // Status
    approvalStatus: ApprovalStatus;
    verifiedBy?: VerifiedByDTO;
    verifiedOn?: string;
    createdAt: string;
    // Stats
    eventsCount: number;
}

// Rejection request body
export interface OrganizerRejectionDTO {
    reason: string;
}
