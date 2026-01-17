import axios from 'axios';
import { urlLink } from '../axiosConfig';
import type { AdminDashboardDTO } from '../../types/adminDashboardTypes';

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
 * GET /admin/dashboard
 * Get platform-wide dashboard analytics
 */
export const getDashboardData = async (): Promise<AdminDashboardDTO> => {
    const response = await axios.get<AdminDashboardDTO>(
        `${urlLink}/admin/dashboard`,
        getAuthHeader()
    );
    return response.data;
};
