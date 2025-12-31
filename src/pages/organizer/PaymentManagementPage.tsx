// pages/organizer/PaymentManagementPage.tsx
import { useState } from 'react';
import { 
  DollarSign, TrendingUp, Calendar, Users, 
  CreditCard, Download, RefreshCw,
  FileText
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { PaymentFilter } from '../../types/paymentTypes';
import PaymentSummaryCards from '../../components/organizer/payments/PaymentSummaryCards';
import EventPaymentsTable from '../../components/organizer/payments/EventPaymentsTable';
import ParticipantPaymentsTable from '../../components/organizer/payments/ParticipantPaymentsTable';
import RevenueChart from '../../components/organizer/payments/RevenueChart';
import PaymentFilters from '../../components/organizer/payments/PaymentFilters';
import { getMockPaymentData } from '../../api/services/Payment';


const PaymentManagementPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'participants'>('overview');
  const [filters, setFilters] = useState<PaymentFilter>({
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    status: 'ALL'
  });
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: paymentData, isLoading, refetch } = useQuery({
    queryKey: ['organizerPayments', filters],
    queryFn: () => getMockPaymentData(),
    // queryFn: () => fetchPaymentDashboard(filters),
    staleTime: 5 * 60 * 1000,
  });

  const handleFilterChange = (newFilters: Partial<PaymentFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEventSelect = (eventId: number | null) => {
    setSelectedEventId(eventId);
    if (eventId) {
      setActiveTab('participants');
    }
  };

  const handleExportPayments = () => {
    // Export functionality
    alert('Exporting payment data...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="space-y-8">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                Payment Management
              </h1>
              <p className="text-gray-600">
                Track payments, revenue, and participant transactions
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleExportPayments}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => {
                setActiveTab('overview');
                setSelectedEventId(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-[#1E3A5F] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
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
              By Events
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'participants'
                  ? 'bg-[#1E3A5F] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              By Participants
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PaymentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            events={paymentData?.events || []}
          />
        </div>

        {/* Summary Cards */}
        {paymentData?.summary && (
          <div className="mb-8">
            <PaymentSummaryCards summary={paymentData.summary} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'events' ? (
              <EventPaymentsTable
                events={paymentData?.events || []}
                onEventSelect={handleEventSelect}
                selectedEventId={selectedEventId}
              />
            ) : activeTab === 'participants' ? (
              <ParticipantPaymentsTable
                payments={paymentData?.participantPayments || []}
                eventId={selectedEventId}
              />
            ) : (
              <>
                {/* Revenue Chart */}
                {paymentData?.revenueChart && (
                  <RevenueChart data={paymentData.revenueChart} />
                )}
                
                {/* Recent Payments */}
                {paymentData?.recentPayments && (
                  <ParticipantPaymentsTable
                    payments={paymentData.recentPayments}
                    compact={true}
                    title="Recent Payments"
                  />
                )}
              </>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Payment Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-6">Payment Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-bold text-gray-900">{paymentData?.events.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Participants</span>
                  <span className="font-bold text-gray-900">
                    {paymentData?.summary?.totalParticipants || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Payment</span>
                  <span className="font-bold text-green-600">
                    ${paymentData?.summary?.averagePayment?.toFixed(2) || '0.00'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-bold text-purple-600">
                    {paymentData?.summary?.platformFee || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-6">Payment Methods</h3>
              
              <div className="space-y-3">
                {[
                  { method: 'Credit Card', percentage: 65, color: 'bg-blue-500' },
                  { method: 'PayPal', percentage: 25, color: 'bg-blue-400' },
                  { method: 'Bank Transfer', percentage: 8, color: 'bg-green-500' },
                  { method: 'Cash', percentage: 2, color: 'bg-gray-400' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span>{item.method}</span>
                      </div>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2a4a7a] rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-colors flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span>Generate Invoice</span>
                </button>
                
                <button className="w-full px-4 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-colors flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  <span>Download Reports</span>
                </button>
                
                <button className="w-full px-4 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-colors flex items-center gap-3">
                  <DollarSign className="w-5 h-5" />
                  <span>Request Payout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPage;