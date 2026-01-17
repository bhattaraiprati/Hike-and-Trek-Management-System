// Enum for User Role
export type UserRole = 'HIKER' | 'ORGANIZER' | 'ADMIN' | 'ALL';

// Enum for User Status
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ALL';

// Enum for Provider Type
export type ProviderType = 'LOCAL' | 'GOOGLE' | 'FACEBOOK';

// Organizer info nested in UserDTO
export interface UserOrganizerDTO {
    id: number;
    organization_name: string; // Changed to match backend or likely naming convention, need to be careful with snake_case vs camelCase. 
    // Backend Java usually returns camelCase unless @JsonProperty is used. The user provided React code used snake_case for organization_name. 
    // The provided UserManagementDTO in Java doesn't show fields, but standard Spring Boot strategy is camelCase.
    // However, looking at the previous viewed file `UserManagementPage.tsx`, it uses `organization_name`.
    // Let's assume the backend DTO likely uses `organizationName` but maybe the frontend mocks used snake_case.
    // I will use camelCase which is standard for Java -> TS, but I'll add a comment.
    // Wait, the user provided `UserManagementDTO` java class name but not content. 
    // I'll stick to what the `UserManagementPage.tsx` was using for now or consistent with standard Java mapping.
    // Actually, let's look at `UserManagementPage.tsx` again. It uses `organization_name`.
    // Let's stick to camelCase as it is more likely what Spring Boot produces by default, and I will fix the usage in the component.
    organizationName: string;
    approvalStatus: string;
}

// Event Registration info nested in UserDTO
export interface UserEventRegistrationDTO {
    id: number;
    status: string;
    event: {
        title: string;
    };
}

// Main User Management DTO
export interface UserManagementDTO {
    id: number;
    email: string;
    name: string;
    phone: string;
    profileImage?: string;
    providerId?: string;
    providerType: ProviderType;
    role: UserRole;
    status: UserStatus;
    createdAt?: string;
    lastLogin?: string;

    // Optional fields depending on role/data
    organizer?: UserOrganizerDTO;
    eventRegistration?: UserEventRegistrationDTO[];

    totalBookings?: number;
    totalSpent?: number;
    reviewsCount?: number;
}

// Pageable Response Interface
export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // current page
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
