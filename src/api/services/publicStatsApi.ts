import axios from 'axios';
import { urlLink } from '../axiosConfig';
import type { PlatformStatsDTO } from '../../types/publicStatsTypes';

/**
 * GET /public/stats
 * Get platform-wide statistics for public pages
 */
export const getPlatformStats = async (): Promise<PlatformStatsDTO> => {
    const response = await axios.get<PlatformStatsDTO>(`${urlLink}/public/stats`);
    return response.data;
};
