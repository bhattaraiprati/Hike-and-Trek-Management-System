import axios from 'axios';
import { urlLink } from '../axiosConfig';
import type { UserManagementDTO, Page } from '../../types/adminUserTypes';

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
 * GET /admin/users
 * Get paginated list of users with filtering
 */
export const getAllUsers = async (
    page: number = 0,
    size: number = 10,
    role: string = 'ALL',
    status: string = 'ALL',
    search: string = ''
): Promise<Page<UserManagementDTO>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('role', role);
    params.append('status', status);
    if (search) params.append('search', search);

    const response = await axios.get<Page<UserManagementDTO>>(
        `${urlLink}/admin/users`,
        {
            ...getAuthHeader(),
            params: params, // Axios handles params serialization nicely too, but using URLSearchParams is fine.
        }
    );
    return response.data;
};

/**
 * PATCH /admin/users/{id}/status
 * Update user status
 */
export const updateUserStatus = async (
    id: number,
    status: string
): Promise<UserManagementDTO> => {
    const response = await axios.patch<UserManagementDTO>(
        `${urlLink}/admin/users/${id}/status`,
        null, // PATCH body is empty as per controller signature, status is a param
        {
            ...getAuthHeader(),
            params: { status }
        }
    );
    return response.data;
};
