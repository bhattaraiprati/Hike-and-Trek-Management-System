import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Compass, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import type { HikerDashboardData } from '../../types/HikerTypes';
import WelcomeBanner from '../../components/hiker/DashboardLayout/WelcomeBanner';
import StatsCards from '../../components/hiker/DashboardLayout/StatsCards';
import UpcomingAdventures from '../../components/hiker/DashboardLayout/UpcomingAdventures';
import RecommendedEvents from '../../components/hiker/DashboardLayout/RecommendedEvents';
import RecentActivityFeed from '../../components/hiker/DashboardLayout/RecentActivityFeed';
import QuickActionCards from '../../components/hiker/DashboardLayout/QuickActionCards';
import { fetchHikerDashboard } from '../../api/services/HikerDashborard';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'activity'>('overview');

  const { 
    data: dashboardData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery<HikerDashboardData>({
    queryKey: ['hikerDashboard'],
    queryFn: fetchHikerDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: true,
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome Banner Skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
          
          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="space-y-8">
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2a4a7a] transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Banner */}
        {dashboardData.userInfo && (
          <WelcomeBanner userInfo={dashboardData.userInfo} />
        )}

        {/* Stats Cards */}
        {dashboardData.stats && (
          <div className="mb-8">
            <StatsCards stats={dashboardData.stats} />
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Compass className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'events'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                My Events
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'activity'
                    ? 'bg-[#1E3A5F] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Activity
              </button>
            </div>

            {dashboardData.stats?.unreadNotifications > 0 && (
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {dashboardData.stats.unreadNotifications}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'events' ? (
              dashboardData.upcomingAdventures && (
                <UpcomingAdventures adventures={dashboardData.upcomingAdventures} />
              )
            ) : (
              <>
                {dashboardData.upcomingAdventures && (
                  <UpcomingAdventures 
                    adventures={dashboardData.upcomingAdventures} 
                    showTitle={activeTab === 'overview'}
                  />
                )}
                
                {dashboardData.recommendedEvents && activeTab === 'overview' && (
                  <RecommendedEvents events={dashboardData.recommendedEvents} />
                )}
              </>
            )}

            {activeTab === 'activity' && dashboardData.recentActivities && (
              <RecentActivityFeed activities={dashboardData.recentActivities} />
            )}
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-8">
            {/* {dashboardData.quickActions && (
              <QuickActionCards actions={dashboardData.quickActions} />
            )} */}

            {dashboardData.recentActivities && activeTab !== 'activity' && (
              <RecentActivityFeed 
                activities={dashboardData.recentActivities.slice(0, 5)}
                compact={true}
              />
            )}

            {activeTab === 'overview' && dashboardData.recommendedEvents && (
              <RecommendedEvents 
                events={dashboardData.recommendedEvents.slice(0, 2)} 
                compact={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;