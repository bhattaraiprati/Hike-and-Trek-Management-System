import axios from 'axios';
import { urlLink } from '../axiosConfig';
import type {
    PaymentDashboardDTO,
    PaymentFilterDTO,
    ParticipantPaymentDTO,
    Page
} from '../../types/organizerPaymentTypes';

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getPaymentDashboard = async (
    organizerId: number,
    filters?: PaymentFilterDTO
): Promise<PaymentDashboardDTO> => {
    // If complex filters are provided that require POST body, use POST
    if (filters && (filters.dateRange || filters.eventId)) {
        const response = await axios.post<PaymentDashboardDTO>(
            `${urlLink}/organizer/payments/dashboard/${organizerId}`,
            filters,
            getAuthHeader()
        );
        return response.data;
    }

    // Otherwise use GET with query params for simple defaults
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod);

    const response = await axios.get<PaymentDashboardDTO>(
        `${urlLink}/organizer/payments/dashboard/${organizerId}`,
        {
            ...getAuthHeader(),
            params
        }
    );
    return response.data;
};

export const getPayments = async (
    organizerId: number,
    page: number = 0,
    size: number = 10,
    filters?: PaymentFilterDTO
): Promise<Page<ParticipantPaymentDTO>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
        if (filters.eventId) params.append('eventId', filters.eventId.toString());
        if (filters.dateRange?.from) params.append('fromDate', filters.dateRange.from);
        if (filters.dateRange?.to) params.append('toDate', filters.dateRange.to);
    }

    const response = await axios.get<Page<ParticipantPaymentDTO>>(
        `${urlLink}/organizer/payments/${organizerId}`,
        {
            ...getAuthHeader(),
            params
        }
    );
    return response.data;
};

export const exportPayments = async (organizerId: number): Promise<Blob> => {
    const response = await axios.get(
        `${urlLink}/organizer/payments/${organizerId}/export`,
        {
            ...getAuthHeader(),
            responseType: 'blob'
        }
    );
    return response.data;
};
