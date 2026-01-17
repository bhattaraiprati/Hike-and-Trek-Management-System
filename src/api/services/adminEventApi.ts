import axios from 'axios';
import { urlLink } from '../axiosConfig';
import type { AdminEventDTO, EventStatus, EventStatsDTO, EventParticipantDTO } from '../../types/adminEventTypes';
import type { Page } from '../../types/adminUserTypes';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/**
 * GET /admin/events
 * Get paginated list of events with filtering
 */
export const getAllEvents = async (
    page: number = 0,
    size: number = 10,
    status: EventStatus = 'ALL',
    search: string = ''
): Promise<Page<AdminEventDTO>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('status', status);
    if (search) params.append('search', search);

    const response = await axios.get<Page<AdminEventDTO>>(
        `${urlLink}/admin/events`,
        {
            ...getAuthHeader(),
            params: params,
        }
    );
    return response.data;
};

/**
 * GET /admin/events/stats
 * Get dashboard statistics
 */
export const getEventStats = async (): Promise<EventStatsDTO> => {
    const response = await axios.get<EventStatsDTO>(
        `${urlLink}/admin/events/stats`,
        getAuthHeader()
    );
    return response.data;
};

/**
 * GET /admin/events/{id}/participants
 * Get list of registered participants for an event
 */
export const getEventParticipants = async (eventId: number): Promise<EventParticipantDTO[]> => {
    const response = await axios.get<EventParticipantDTO[]>(
        `${urlLink}/admin/events/${eventId}/participants`,
        getAuthHeader()
    );
    return response.data;
};

/**
 * PATCH /admin/events/{id}/status
 * Update event status
 */
export const updateEventStatus = async (
    id: number,
    status: EventStatus
): Promise<AdminEventDTO> => {
    const response = await axios.patch<AdminEventDTO>(
        `${urlLink}/admin/events/${id}/status`,
        null, // No body
        {
            ...getAuthHeader(),
            params: { status }
        }
    );
    return response.data;
};
