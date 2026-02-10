import { useState, useEffect, useCallback } from 'react';
import { 
    DollarSign, Calendar, Users, Download, 
    ChevronLeft, ChevronRight, Loader2,
    CreditCard, CheckCircle, Clock, XCircle, RefreshCw,
    TrendingUp, BarChart3, Search, Eye, FileText, ArrowUpDown, 
    Percent, Award, User
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { jwtDecode } from 'jwt-decode';
import * as organizerPaymentApi from '../../api/services/organizerPaymentApi';
import type { 
    PaymentDashboardDTO, 
    ParticipantPaymentDTO, 
    PaymentFilterDTO,
    EventPaymentDTO
} from '../../types/organizerPaymentTypes';

const OrganizerPaymentPage = () => {
    const [organizerId, setOrganizerId] = useState<number | null>(null);
    const [dashboardData, setDashboardData] = useState<PaymentDashboardDTO | null>(null);
    const [payments, setPayments] = useState<ParticipantPaymentDTO[]>([]);
    const [events, setEvents] = useState<EventPaymentDTO[]>([]);
    
    // Loading & Error
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [methodFilter, setMethodFilter] = useState<string>('ALL');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [eventFilter, setEventFilter] = useState<number | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // UI States
    const [selectedPayment, setSelectedPayment] = useState<ParticipantPaymentDTO | null>(null);
    const [viewMode, setViewMode] = useState<'DASHBOARD' | 'PAYMENTS' | 'EVENTS'>('DASHBOARD');
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Get Organizer ID from Token
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded: any = jwtDecode(token);
                setOrganizerId(decoded.id); 
            }
        } catch (e) {
            console.error("Failed to decode token", e);
            setError("Authentication failed. Please login again.");
        }
    }, []);

    const fetchDashboard = useCallback(async () => {
        if (!organizerId) return;
        setLoadingDashboard(true);
        try {
            const filters: PaymentFilterDTO = {
                dateRange: (dateRange.from && dateRange.to) ? dateRange : undefined,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                paymentMethod: methodFilter !== 'ALL' ? methodFilter : undefined,
                eventId: eventFilter !== 'ALL' ? eventFilter : undefined
            };
            const data = await organizerPaymentApi.getPaymentDashboard(organizerId, filters);
            setDashboardData(data);
            setEvents(data.events || []);
        } catch (err) {
            console.error("Failed to fetch dashboard", err);
            setError("Failed to load dashboard data.");
        } finally {
            setLoadingDashboard(false);
        }
    }, [organizerId, statusFilter, methodFilter, dateRange, eventFilter]);

    const fetchPayments = useCallback(async () => {
        if (!organizerId) return;
        setLoadingPayments(true);
        try {
            const filters: PaymentFilterDTO = {
                dateRange: (dateRange.from && dateRange.to) ? dateRange : undefined,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                paymentMethod: methodFilter !== 'ALL' ? methodFilter : undefined,
                eventId: eventFilter !== 'ALL' ? eventFilter : undefined
            };
            const data = await organizerPaymentApi.getPayments(organizerId, page, size, filters);
            setPayments(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error("Failed to fetch payments", err);
            setError("Failed to load payment history.");
        } finally {
            setLoadingPayments(false);
        }
    }, [organizerId, page, size, statusFilter, methodFilter, dateRange, eventFilter]);

    useEffect(() => {
        if (organizerId) {
            fetchDashboard();
            fetchPayments();
        }
    }, [organizerId, fetchDashboard, fetchPayments]);

    // Handle Export
    const handleExport = async () => {
        if (!organizerId) return;
        try {
            const blob = await organizerPaymentApi.exportPayments(organizerId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            console.error("Export failed", err);
            alert("Failed to export payments.");
        }
    };

    // Format Helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'RELEASED':
            case 'COMPLETED':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Released' };
            case 'PENDING':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4" />, label: 'Pending' };
            case 'FAILED':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Failed' };
            case 'REFUNDED':
                return { bg: 'bg-purple-100', text: 'text-purple-800', icon: <RefreshCw className="w-4 h-4" />, label: 'Refunded' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: null, label: status };
        }
    };

    const getEventStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' };
            case 'COMPLETED':
                return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' };
            case 'CANCELLED':
                return { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
        }
    };

    const getPaymentMethodBadge = (method: string) => {
        switch (method) {
            case 'STRIPE':
                return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Stripe' };
            case 'ESEWA':
                return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'eSewa' };
            case 'CREDIT_CARD':
            case 'CARD':
                return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Card' };
            case 'BANK_TRANSFER':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Bank Transfer' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', label: method };
        }
    };

    // Calculate Net Earnings (after platform fee)
    const calculateNetEarnings = () => {
        if (!dashboardData?.summary) return 0;
        const platformFeePercent = dashboardData.summary.platformFee || 10;
        return dashboardData.summary.totalIncome * (1 - platformFeePercent / 100);
    };

    // Filter payments based on search
    const filteredPayments = payments.filter(payment => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            payment.participantName.toLowerCase().includes(query) ||
            payment.participantEmail.toLowerCase().includes(query) ||
            payment.eventTitle.toLowerCase().includes(query) ||
            payment.transactionId.toLowerCase().includes(query)
        );
    });

    // Sort payments
    const sortedPayments = [...filteredPayments].sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        
        switch (sortBy) {
            case 'date':
                return multiplier * (new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());
            case 'amount':
                return multiplier * (a.amount - b.amount);
            case 'name':
                return multiplier * a.participantName.localeCompare(b.participantName);
            default:
                return 0;
        }
    });

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 text-white p-4 rounded-xl shadow-xl">
                    <p className="text-xs text-gray-400 mb-2">{label}</p>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-xs">Revenue:</span>
                            <span className="font-bold text-white">{formatCurrency(payload[0].value)}</span>
                        </div>
                        {payload[0].payload.participants && (
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-xs">Participants:</span>
                                <span className="font-bold text-blue-400">{payload[0].payload.participants}</span>
                            </div>
                        )}
                        {payload[0].payload.events && (
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-xs">Events:</span>
                                <span className="font-bold text-green-400">{payload[0].payload.events}</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    if (error && !dashboardData && payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Dashboard</h1>
                    <p className="text-gray-600">Track your earnings, participants, and payment history</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button 
                        onClick={() => {
                            fetchDashboard();
                            fetchPayments();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2C5F8D] shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setViewMode('DASHBOARD')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'DASHBOARD' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Dashboard
                </button>
                <button
                    onClick={() => setViewMode('PAYMENTS')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'PAYMENTS' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Payment History
                </button>
                <button
                    onClick={() => setViewMode('EVENTS')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'EVENTS' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Events Summary
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, event, or transaction ID..."
                                className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <select 
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="RELEASED">Released</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>

                        <select 
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                        >
                            <option value="ALL">All Events</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.eventTitle} (#{event.id})
                                </option>
                            ))}
                        </select>

                        <select 
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                            value={methodFilter}
                            onChange={(e) => setMethodFilter(e.target.value)}
                        >
                            <option value="ALL">All Methods</option>
                            <option value="STRIPE">Stripe</option>
                            <option value="ESEWA">eSewa</option>
                            <option value="CARD">Card</option>
                        </select>

                        <div className="flex gap-2">
                            <input 
                                type="date" 
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                                value={dateRange.from}
                                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                placeholder="From"
                            />
                            <input 
                                type="date" 
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                                value={dateRange.to}
                                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                placeholder="To"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard View */}
            {viewMode === 'DASHBOARD' && (
                <>
                    {loadingDashboard ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
                        </div>
                    ) : dashboardData?.summary && (
                        <>
                            {/* Main Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total Gross Income</p>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {formatCurrency(dashboardData.summary.totalIncome)}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {dashboardData.summary.totalParticipants} participants
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <DollarSign className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Net Earnings</p>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {formatCurrency(calculateNetEarnings())}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                                <Percent className="w-3 h-3" />
                                                {dashboardData.summary.platformFee}% platform fee
                                            </p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <TrendingUp className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Completed Payments</p>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {dashboardData.summary.completedPayments}
                                            </h3>
                                            <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                {dashboardData.summary.monthlyGrowth}% growth
                                            </div>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <CheckCircle className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Avg Payment</p>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {formatCurrency(dashboardData.summary.averagePayment)}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                per participant
                                            </p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <Award className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Revenue Chart with Recharts */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
                                            <p className="text-sm text-gray-500">Last 6 months</p>
                                        </div>
                                    </div>
                                    {dashboardData?.revenueChart && dashboardData.revenueChart.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={dashboardData.revenueChart} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis 
                                                    dataKey="month" 
                                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                                    axisLine={{ stroke: '#e5e7eb' }}
                                                />
                                                <YAxis 
                                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                                    axisLine={{ stroke: '#e5e7eb' }}
                                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                                />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                                <Bar 
                                                    dataKey="revenue" 
                                                    fill="#1E3A5F" 
                                                    radius={[8, 8, 0, 0]}
                                                    maxBarSize={60}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-400">
                                            No revenue data available
                                        </div>
                                    )}
                                </div>

                                {/* Recent Payments */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                                        <button 
                                            onClick={() => setViewMode('PAYMENTS')}
                                            className="text-sm text-[#1E3A5F] hover:underline"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {dashboardData?.recentPayments?.slice(0, 5).map(payment => (
                                            <div 
                                                key={payment.id} 
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                onClick={() => setSelectedPayment(payment)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${payment.status === 'RELEASED' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{payment.participantName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                                                            <span className={`px-1.5 py-0.5 rounded text-xs ${getPaymentMethodBadge(payment.paymentMethod).bg} ${getPaymentMethodBadge(payment.paymentMethod).text}`}>
                                                                {getPaymentMethodBadge(payment.paymentMethod).label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</span>
                                            </div>
                                        ))}
                                        {(!dashboardData?.recentPayments || dashboardData.recentPayments.length === 0) && (
                                            <p className="text-sm text-gray-500 text-center py-8">No recent activity</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Payment History View */}
            {viewMode === 'PAYMENTS' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
                            <p className="text-sm text-gray-600">All transactions for your events</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select 
                                className="text-sm border-gray-300 rounded-lg focus:ring-[#1E3A5F] focus:border-[#1E3A5F]"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="name">Name</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <ArrowUpDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {loadingPayments ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
                        </div>
                    ) : (
                        <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Participant</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment Details</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-3">
                                                    <CreditCard className="w-12 h-12 text-gray-300" />
                                                    <p className="text-gray-600">No payment records found.</p>
                                                    <p className="text-sm text-gray-500">Try adjusting your filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : sortedPayments.map((payment) => {
                                        const statusBadge = getStatusBadge(payment.status);
                                        const methodBadge = getPaymentMethodBadge(payment.paymentMethod);
                                        return (
                                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] flex items-center justify-center text-white font-bold">
                                                            {payment.participantName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{payment.participantName}</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{payment.participantEmail}</p>
                                                            <p className="text-xs text-gray-400">{payment.numberOfParticipants} participant(s)</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-900">{payment.eventTitle}</p>
                                                    <p className="text-xs text-gray-500">ID: #{payment.eventId}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDateTime(payment.paymentDate)}
                                                        </p>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${methodBadge.bg} ${methodBadge.text}`}>
                                                            <CreditCard className="w-3 h-3" />
                                                            {methodBadge.label}
                                                        </span>
                                                        {payment.transactionId && (
                                                            <p className="text-xs text-gray-500 truncate max-w-[160px]" title={payment.transactionId}>
                                                                ID: {payment.transactionId.substring(0, 20)}...
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                                        {statusBadge.icon}
                                                        {statusBadge.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Net: {formatCurrency(payment.amount * 0.9)}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setSelectedPayment(payment)}
                                                        className="p-2 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600 mb-4 md:mb-0">
                                Showing <span className="font-medium">{page * size + 1}</span> to{' '}
                                <span className="font-medium">{Math.min((page + 1) * size, totalElements)}</span> of{' '}
                                <span className="font-medium">{totalElements}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <div className="flex items-center">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i;
                                        } else if (page < 3) {
                                            pageNum = i;
                                        } else if (page > totalPages - 4) {
                                            pageNum = totalPages - 5 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 border ${page === pageNum ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'border-gray-300 hover:bg-gray-50'} rounded-lg mx-1`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white flex items-center gap-1"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            )}

            {/* Events Summary View */}
            {viewMode === 'EVENTS' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Events Summary</h3>
                        <p className="text-sm text-gray-600">Revenue breakdown by event</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Participants</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Avg/Person</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Your Share</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map(event => {
                                    const statusBadge = getEventStatusBadge(event.status);
                                    return (
                                        <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{event.eventTitle}</p>
                                                <p className="text-xs text-gray-500">ID: #{event.id}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900">{formatDate(event.eventDate)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">{event.paidParticipants}/{event.totalParticipants}</span>
                                                    <span className="text-xs text-gray-500">paid</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{formatCurrency(event.totalRevenue)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900">{formatCurrency(event.averagePaymentPerPerson)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-green-600">{formatCurrency(event.organizerShare)}</p>
                                                <p className="text-xs text-gray-500">after {dashboardData?.summary.platformFee || 10}% fee</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payment Details Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                                    <p className="text-gray-600">Transaction ID: {selectedPayment.transactionId.substring(0, 30)}...</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPayment(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Amount</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Platform Fee ({dashboardData?.summary.platformFee || 10}%)</p>
                                            <p className="text-xl font-bold text-purple-600">
                                                {formatCurrency(selectedPayment.amount * ((dashboardData?.summary.platformFee || 10) / 100))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-600">Net Amount to You</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {formatCurrency(selectedPayment.amount * (1 - ((dashboardData?.summary.platformFee || 10) / 100)))}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Participant</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] flex items-center justify-center text-white font-bold text-lg">
                                                    {selectedPayment.participantName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{selectedPayment.participantName}</p>
                                                    <p className="text-sm text-gray-600">{selectedPayment.participantEmail}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Participants</p>
                                                <p className="font-medium">{selectedPayment.numberOfParticipants} person(s)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedPayment.eventTitle}</p>
                                                <p className="text-sm text-gray-600">Event ID: #{selectedPayment.eventId}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Payment Method</p>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPaymentMethodBadge(selectedPayment.paymentMethod).bg} ${getPaymentMethodBadge(selectedPayment.paymentMethod).text}`}>
                                                    {getPaymentMethodBadge(selectedPayment.paymentMethod).label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Timeline</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">Payment Received</p>
                                                <p className="text-sm text-gray-600">{formatDateTime(selectedPayment.paymentDate)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">Payment Status</p>
                                                <p className="text-sm text-gray-600">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(selectedPayment.status).bg} ${getStatusBadge(selectedPayment.status).text}`}>
                                                        {getStatusBadge(selectedPayment.status).label}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setSelectedPayment(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                    {selectedPayment.receiptUrl && (
                                        <a
                                            href={selectedPayment.receiptUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2C5F8D] flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Receipt
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerPaymentPage;