import axios from 'axios';
import { urlLink } from '../axiosConfig';
import type { AdminPaymentDTO, PaymentStatsDTO, OrganizerBalanceDTO, PaymentStatus, PaymentMethod } from '../../types/adminPaymentTypes';
import type { Page } from '../../types/adminUserTypes'; // Reusing Page interface

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
 * GET /admin/payments
 * Get paginated list of payments with filtering
 */
export const getAllPayments = async (
    page: number = 0,
    size: number = 10,
    status: PaymentStatus = 'ALL',
    method: PaymentMethod = 'ALL',
    search: string = '',
    startDate: string = '',
    endDate: string = ''
): Promise<Page<AdminPaymentDTO>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('status', status);
    params.append('method', method);
    if (search) params.append('search', search);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axios.get<Page<AdminPaymentDTO>>(
        `${urlLink}/admin/payments`,
        {
            ...getAuthHeader(),
            params: params,
        }
    );
    return response.data;
};

/**
 * GET /admin/payments/stats
 * Get payment statistics
 */
export const getPaymentStats = async (): Promise<PaymentStatsDTO> => {
    const response = await axios.get<PaymentStatsDTO>(
        `${urlLink}/admin/payments/stats`,
        getAuthHeader()
    );
    return response.data;
};

/**
 * GET /admin/payments/balances
 * Get organizer balances
 */
export const getOrganizerBalances = async (): Promise<OrganizerBalanceDTO[]> => {
    const response = await axios.get<OrganizerBalanceDTO[]>(
        `${urlLink}/admin/payments/balances`,
        getAuthHeader()
    );
    return response.data;
};

/**
 * POST /admin/payments/{id}/verify
 * Verify a payment
 */
export const verifyPayment = async (id: number): Promise<AdminPaymentDTO> => {
    const response = await axios.post<AdminPaymentDTO>(
        `${urlLink}/admin/payments/${id}/verify`,
        {},
        getAuthHeader()
    );
    return response.data;
};

/**
 * POST /admin/payments/{id}/release
 * Release payment to organizer
 */
export const releasePayment = async (id: number, notes: string): Promise<AdminPaymentDTO> => {
    const response = await axios.post<AdminPaymentDTO>(
        `${urlLink}/admin/payments/${id}/release`,
        { notes },
        getAuthHeader()
    );
    return response.data;
};

/**
 * POST /admin/payments/release/bulk
 * Bulk release payments
 */
export const bulkRelease = async (paymentIds: number[]): Promise<any> => {
    const response = await axios.post(
        `${urlLink}/admin/payments/release/bulk`,
        paymentIds,
        getAuthHeader()
    );
    return response.data;
};
