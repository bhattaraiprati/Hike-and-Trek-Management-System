import axios from "axios";
import { urlLink } from "../axiosConfig";
import  type {
    AdminOrganizerStatsDTO,
    ApprovalStatus,
    OrganizerRejectionDTO,
    OrganizerVerificationDetailDTO,
    OrganizerVerificationListDTO,
} from "../../types/adminTypes";

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
 * GET /admin/organizers
 * List organizers with optional status filter and search
 */
export const getOrganizers = async (
    status?: ApprovalStatus,
    search?: string
): Promise<OrganizerVerificationListDTO[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const queryString = params.toString();
    const url = `${urlLink}/admin/organizers${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get<OrganizerVerificationListDTO[]>(url, getAuthHeader());
    return response.data;
};

/**
 * GET /admin/organizers/stats
 * Get verification statistics
 */
export const getOrganizerStats = async (): Promise<AdminOrganizerStatsDTO> => {
    const response = await axios.get<AdminOrganizerStatsDTO>(
        `${urlLink}/admin/organizers/stats`,
        getAuthHeader()
    );
    return response.data;
};

/**
 * GET /admin/organizers/{id}
 * Get organizer details
 */
export const getOrganizerDetails = async (
    id: number
): Promise<OrganizerVerificationDetailDTO> => {
    const response = await axios.get<OrganizerVerificationDetailDTO>(
        `${urlLink}/admin/organizers/${id}`,
        getAuthHeader()
    );
    return response.data;
};

/**
 * PUT /admin/organizers/{id}/approve
 * Approve organizer
 */
export const approveOrganizer = async (
    id: number
): Promise<OrganizerVerificationListDTO> => {
    const response = await axios.put<OrganizerVerificationListDTO>(
        `${urlLink}/admin/organizers/${id}/approve`,
        {},
        getAuthHeader()
    );
    return response.data;
};

/**
 * PUT /admin/organizers/{id}/reject
 * Reject organizer with reason
 */
export const rejectOrganizer = async (
    id: number,
    reason: string
): Promise<OrganizerVerificationListDTO> => {
    const body: OrganizerRejectionDTO = { reason };
    const response = await axios.put<OrganizerVerificationListDTO>(
        `${urlLink}/admin/organizers/${id}/reject`,
        body,
        getAuthHeader()
    );
    return response.data;
};
