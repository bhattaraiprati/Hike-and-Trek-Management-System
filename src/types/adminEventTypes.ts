import type { Page } from './adminUserTypes';

export type EventStatus = 'PUBLISHED' | 'DRAFT' | 'CANCELLED' | 'COMPLETED' | 'ALL';

export interface EventOrganizerDTO {
    id: number;
    name: string;
    organizationName: string;
    email: string;
    phone?: string;
}

export interface EventParticipantDTO {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone?: string;
    bookingDate: string;
    status: 'CONFIRMED' | 'CANCELLED';
}

export interface AdminEventDTO {
    id: number;
    title: string;
    description: string;
    location: string;
    startDate: string; // ISO String
    endDate: string; // ISO String
    price: number;
    maxParticipants: number;
    currentParticipants: number;
    status: EventStatus;
    imageUrl?: string;
    category?: string;
    difficultyLevel?: 'EASY' | 'MODERATE' | 'DIFFICULT';

    organizer: EventOrganizerDTO;

    createdAt: string;
    updatedAt: string;
}

export interface EventStatsDTO {
    totalEvents: number;
    activeEvents: number;
    completedEvents: number;
    cancelledEvents: number;
}
