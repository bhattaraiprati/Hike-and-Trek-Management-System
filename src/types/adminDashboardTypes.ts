export interface DashboardStatsDTO {
    totalUsers: number;
    activeUsers: number;
    totalOrganizers: number;
    pendingOrganizers: number;
    totalEvents: number;
    activeEvents: number;
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number; // percentage
    userGrowth: number; // percentage
    eventGrowth: number; // percentage
}

export interface RevenueChartDTO {
    month: string;
    revenue: number;
    organizerEarnings: number;
    platformFees: number;
}

export interface UserGrowthDTO {
    month: string;
    hikers: number;
    organizers: number;
}

export interface RecentActivityDTO {
    id: number;
    type: 'USER_REGISTER' | 'EVENT_CREATE' | 'PAYMENT' | 'REVIEW' | 'REPORT';
    title: string;
    description: string;
    timestamp: string;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';
    relatedId?: number; // userId, eventId, etc.
}

export interface AdminDashboardDTO {
    stats: DashboardStatsDTO;
    revenueChart: RevenueChartDTO[];
    userGrowth: UserGrowthDTO[];
    recentActivities: RecentActivityDTO[];
}
