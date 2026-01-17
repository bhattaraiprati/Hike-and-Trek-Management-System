// AdminPaymentManagementPage.tsx
import { useState, useEffect } from 'react';
import {
  DollarSign, CheckCircle, Clock, AlertCircle,
  Search, Download, TrendingUp,
  Building,
  ArrowRight, RefreshCw, BarChart3, CreditCard, User, MapPin, Percent,
  ChevronLeft, ChevronRight, Loader
} from 'lucide-react';

import type { AdminPaymentDTO, PaymentStatsDTO, OrganizerBalanceDTO, PaymentStatus, PaymentMethod } from '../../types/adminPaymentTypes';
import * as adminPaymentApi from '../../api/services/adminPaymentApi';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminPaymentManagementPage = () => {
    // State
    const [payments, setPayments] = useState<AdminPaymentDTO[]>([]);
    const [organizerBalances, setOrganizerBalances] = useState<OrganizerBalanceDTO[]>([]);
    
    // Stats State - Default values to avoid null checks initially
    const [stats, setStats] = useState<PaymentStatsDTO>({
        totalRevenue: 0,
        pendingPayments: 0,
        completedPayments: 0,
        releasedPayments: 0,
        totalFee: 0,
        netRevenue: 0,
        todayRevenue: 0,
        averagePayment: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filterStatus, setFilterStatus] = useState<PaymentStatus>('ALL');
    // const [filterPaymentMethod, setFilterPaymentMethod] = useState<PaymentMethod>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    
    // Pagination
    const [page, setPage] = useState(0);
    // const [size, setSize] = useState(10);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Modals & Selection
    const [selectedPayment, setSelectedPayment] = useState<AdminPaymentDTO | null>(null);
    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [releaseNotes, setReleaseNotes] = useState('');
    const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'PAYMENTS' | 'BALANCES'>('PAYMENTS');

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        variant: 'danger' as 'danger' | 'primary' | 'success',
        buttonText: 'Confirm'
    });

    // Fetch Initial Data
    useEffect(() => {
        fetchStats();
        fetchBalances();
    }, []);

    // Fetch Payments on Filter Change
    useEffect(() => {
        fetchPayments();
    }, [page, size, filterStatus, /* filterPaymentMethod, */ dateRange]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 0) setPage(0);
            else fetchPayments();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchStats = async () => {
        try {
            const data = await adminPaymentApi.getPaymentStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    const fetchBalances = async () => {
        try {
            const data = await adminPaymentApi.getOrganizerBalances();
            setOrganizerBalances(data);
        } catch (err) {
            console.error("Failed to fetch balances", err);
        }
    };

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminPaymentApi.getAllPayments(
                page,
                size,
                filterStatus,
                // filterPaymentMethod,
                'ALL' as PaymentMethod, // Using default for now as filter is unused
                searchQuery,
                dateRange.start,
                dateRange.end
            );
            setPayments(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error("Failed to fetch payments", err);
            setError("Failed to load payments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-3 h-3" />, label: 'Pending' };
            case 'COMPLETED':
                return { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Verified' };
            case 'RELEASED':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: <ArrowRight className="w-3 h-3" />, label: 'Released' };
            case 'FAILED':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertCircle className="w-3 h-3" />, label: 'Failed' };
            case 'REFUNDED':
                return { bg: 'bg-purple-100', text: 'text-purple-800', icon: <RefreshCw className="w-3 h-3" />, label: 'Refunded' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: null, label: status };
        }
    };

    // Get payment method badge
    const getMethodBadge = (method: string) => {
        switch (method) {
            case 'ESEWA':
                return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'eSewa' };
            case 'STRIPE':
                return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Stripe' };
            case 'CARD':
                return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Card' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', label: method };
        }
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Handle payment verification
    const handleVerifyPayment = async (paymentId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Verify Payment',
            message: 'Are you sure you want to verify this payment?',
            variant: 'primary',
            buttonText: 'Verify',
            onConfirm: async () => {
                try {
                    const updatedPayment = await adminPaymentApi.verifyPayment(paymentId);
                    setPayments(prev => prev.map(p => p.id === paymentId ? updatedPayment : p));
                    fetchStats(); // Refresh stats
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (err) {
                    console.error("Failed to verify payment", err);
                    alert("Failed to verify payment");
                }
            }
        });
    };

    // Handle payment release
    const handleReleasePayment = async () => {
        if (!selectedPayment) return;
        if (!releaseNotes.trim()) {
            alert('Please add release notes');
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Release Payment',
            message: 'Are you sure you want to release this payment to the organizer?',
            variant: 'success',
            buttonText: 'Release',
            onConfirm: async () => {
                try {
                    const updatedPayment = await adminPaymentApi.releasePayment(selectedPayment.id, releaseNotes);
                    setPayments(prev => prev.map(p => p.id === selectedPayment.id ? updatedPayment : p));
                    fetchStats();
                    fetchBalances(); // Refresh balances
                    
                    setShowReleaseModal(false);
                    setReleaseNotes('');
                    setSelectedPayment(null);
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (err) {
                    console.error("Failed to release payment", err);
                    alert("Failed to release payment");
                }
            }
        });
    };

    // Bulk release payments
    const handleBulkRelease = async () => {
        if (selectedPayments.length === 0) {
            alert('Please select payments to release');
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Bulk Release Payments',
            message: `Are you sure you want to release ${selectedPayments.length} selected payments?`,
            variant: 'success',
            buttonText: 'Release All',
            onConfirm: async () => {
                 try {
                    await adminPaymentApi.bulkRelease(selectedPayments);
                    fetchPayments(); // Refresh list to get updated statuses
                    fetchStats();
                    fetchBalances();
                    setSelectedPayments([]);
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    alert("Bulk release initiated successfully");
                 } catch (err) {
                     console.error("Failed to bulk release", err);
                     alert("Failed to perform bulk release");
                 }
            }
        });
    };

    // Toggle payment selection
    const togglePaymentSelection = (paymentId: number) => {
        setSelectedPayments(prev =>
            prev.includes(paymentId)
                ? prev.filter(id => id !== paymentId)
                : [...prev, paymentId]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                        <p className="text-gray-600 mt-2">Manage payments, verify transactions, and release funds to organizers</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex flex-wrap gap-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">NPR {stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Platform Fee</p>
                                <p className="text-xl font-bold text-purple-600 mt-1">NPR {stats.totalFee.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Percent className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Net Revenue</p>
                                <p className="text-xl font-bold text-indigo-600 mt-1">NPR {stats.netRevenue.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Today</p>
                                <p className="text-xl font-bold text-blue-600 mt-1">NPR {stats.todayRevenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-1">Revenue</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => setViewMode('PAYMENTS')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'PAYMENTS' ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Payment Transactions
                </button>
                <button
                    onClick={() => setViewMode('BALANCES')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'BALANCES' ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                    <Building className="w-4 h-4 inline mr-2" />
                    Organizer Balances
                </button>
            </div>

            {/* Filters */}
            {viewMode === 'PAYMENTS' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by transaction ID, user, organizer, or event..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFilterStatus('ALL'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg ${filterStatus === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => { setFilterStatus('PENDING'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <Clock className="w-4 h-4" />
                            Pending
                        </button>
                        <button
                            onClick={() => { setFilterStatus('SUCCESS'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'SUCCESS' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            Verified
                        </button>
                    </div>

                    {/* Date Range */}
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            placeholder="Start date"
                        />
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            placeholder="End date"
                        />
                    </div>
                </div>
            </div>
            )}

            {/* Bulk Actions */}
            {viewMode === 'PAYMENTS' && selectedPayments.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900">
                                {selectedPayments.length} payment{selectedPayments.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleBulkRelease}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                            >
                                <ArrowRight className="w-4 h-4" />
                                Release Selected
                            </button>
                            <button
                                onClick={() => setSelectedPayments([])}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payments Table */}
            {viewMode === 'PAYMENTS' ? (
                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                         <div className="flex justify-center items-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-[#1E3A5F]" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            {error}
                            <button onClick={fetchPayments} className="ml-2 underline hover:text-red-800">Retry</button>
                        </div>
                    ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 w-12">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            checked={selectedPayments.length === payments.length && payments.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedPayments(payments.map(p => p.id));
                                                } else {
                                                    setSelectedPayments([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Transaction</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">User & Event</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Organizer</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[140px]">Amount</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Status</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Method</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-8 text-center text-gray-500">
                                            No payments found.
                                        </td>
                                    </tr>
                                ) : payments.map((payment) => {
                                    const statusBadge = getStatusBadge(payment.status);
                                    
                                    return (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            {/* Checkbox */}
                                            <td className="py-4 px-4">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={selectedPayments.includes(payment.id)}
                                                    onChange={() => togglePaymentSelection(payment.id)}
                                                />
                                            </td>

                                            {/* Transaction Info */}
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-gray-900">{payment.transactionId}</p>
                                                    <div className="text-sm text-gray-600">
                                                        <p className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {payment.registration?.participants} participant{payment.registration?.participants !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* User & Event Info */}
                                            <td className="py-4 px-4">
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="font-medium text-gray-900 truncate">{payment.user?.name}</p>
                                                        <p className="text-sm text-gray-600 truncate">{payment.user?.email}</p>
                                                    </div>
                                                    <div className="pt-2 border-t border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{payment.event?.title}</p>
                                                        <p className="text-xs text-gray-600 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {payment.event?.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Organizer Info */}
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-gray-900 truncate">{payment.organizer?.organization}</p>
                                                    <p className="text-sm text-gray-600 truncate">{payment.organizer?.name}</p>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-lg text-gray-900">NPR{payment.amount}</p>
                                                    <div className="text-sm space-y-0.5">
                                                        <p className="text-gray-600">
                                                            Fee: <span className="font-medium">NPR{payment.fee}</span>
                                                        </p>
                                                        <p className="text-green-600 font-medium">
                                                            Net: NPR{payment.netAmount}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} flex items-center gap-1 w-fit`}>
                                                    {statusBadge.icon}
                                                    {statusBadge.label}
                                                </span>
                                            </td>

                                            {/* Method */}
                                            <td className="py-4 px-4">
                                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                                    {payment.paymentMethod}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-gray-600">{formatDate(payment.paymentDate)}</p>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-5 pr-0">
                                                <div className="flex items-center gap-2">
                                                    {payment.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleVerifyPayment(payment.id)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Verify Payment"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    
                                                    {payment.status === 'SUCCESS' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPayment(payment);
                                                                setShowReleaseModal(true);
                                                            }}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                            title="Release Funds"
                                                        >
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex justify-between flex-1 sm:hidden">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{page * size + 1}</span> to <span className="font-medium">{Math.min((page + 1) * size, totalElements)}</span> of{' '}
                                    <span className="font-medium">{totalElements}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                        Page {page + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </>
                )}
                </div>
            ) : (
                /* Organizer Balances View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizerBalances.map((balance) => (
                        <div key={balance.organizerId} className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {balance.organization.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{balance.organization}</h3>
                                        <p className="text-sm text-gray-600">{balance.organizerName}</p>
                                    </div>
                                </div>
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
                                    #{balance.organizerId}
                                </span>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Total Revenue</span>
                                    <span className="font-bold text-gray-900">NPR{balance.totalBalance}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm text-green-700">Released</span>
                                    <span className="font-bold text-green-700">NPR{balance.releasedAmount}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-sm text-yellow-700">Pending</span>
                                    <span className="font-bold text-yellow-700">NPR{balance.pendingAmount}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    {balance.pendingPayments} pending payment{balance.pendingPayments !== 1 ? 's' : ''}
                                </span>
                                <button
                                    onClick={() => {
                                        // Filter payments for this organizer
                                        setSearchQuery(balance.organization);
                                        setViewMode('PAYMENTS');
                                    }}
                                    className="text-[#1E3A5F] font-medium hover:underline"
                                >
                                    View History
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {organizerBalances.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                            No organizer balances found.
                        </div>
                    )}
                </div>
            )}

            {/* Release Payment Modal */}
            {showReleaseModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Release Payment</h2>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Amount</span>
                                <span className="font-medium">NPR{selectedPayment.netAmount}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Organizer</span>
                                <span className="font-medium">{selectedPayment.organizer.organization}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Transaction</span>
                                <span className="font-medium text-xs">{selectedPayment.transactionId}</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Release Notes
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                                rows={3}
                                placeholder="Enter transfer details (e.g., Bank Ref ID)..."
                                value={releaseNotes}
                                onChange={(e) => setReleaseNotes(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowReleaseModal(false);
                                    setReleaseNotes('');
                                    setSelectedPayment(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReleasePayment}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Confirm Release
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                buttonText={confirmModal.buttonText}
                variant={confirmModal.variant}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />
    </div>
    );
};

export default AdminPaymentManagementPage;