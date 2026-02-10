// UserManagementPage.tsx
import { useState, useEffect } from 'react';
import {
  Users, Search, MoreVertical,
  Mail, Phone, User, Shield, Calendar,
  CheckCircle, AlertCircle,
  /* Lock, */ Unlock, Eye,
   Ban,
  Star, DollarSign, ChevronLeft, ChevronRight, Loader
} from 'lucide-react';
import type { UserManagementDTO } from '../../types/adminUserTypes';
import * as adminUserApi from '../../api/services/adminUserApi';
import ConfirmModal from '../../components/common/ConfirmModal';

const UserManagementPage = () => {
    // State for data
    const [users, setUsers] = useState<UserManagementDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    // State for filtering & pagination
    const [filterRole, setFilterRole] = useState<'ALL' | 'HIKER' | 'ORGANIZER' | 'ADMIN'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    // const [size, setSize] = useState(10);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [selectedUser, setSelectedUser] = useState<UserManagementDTO | null>(null);

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        variant: 'danger' as 'danger' | 'primary' | 'success',
        buttonText: 'Confirm'
    });

    // Fetch users when dependencies change
    useEffect(() => {
        fetchUsers();
    }, [page, size, filterRole, filterStatus]); // searchQuery usually handled with debounce or manual trigger to avoid too many calls

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
             // Reset page to 0 when search changes
            if (page !== 0) {
                setPage(0);
            } else {
                fetchUsers();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);


    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminUserApi.getAllUsers(
                page, 
                size, 
                filterRole, 
                filterStatus, 
                searchQuery
            );
            setUsers(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Get role badge color
    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'HIKER':
                return { bg: 'bg-blue-100', text: 'text-blue-800', icon: '👤', label: 'Hiker' };
            case 'ORGANIZER':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: '🏢', label: 'Organizer' };
            case 'ADMIN':
                return { bg: 'bg-purple-100', text: 'text-purple-800', icon: '👑', label: 'Admin' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '👤', label: role };
        }
    };

    // Get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Active' };
            case 'INACTIVE':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <AlertCircle className="w-3 h-3" />, label: 'Inactive' };
            case 'SUSPENDED':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: <Ban className="w-3 h-3" />, label: 'Suspended' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: null, label: status };
        }
    };

    // Get auth provider badge
    const getProviderBadge = (provider: string) => {
        switch (provider) {
            case 'GOOGLE':
                return { bg: 'bg-red-50', text: 'text-red-700', label: 'Google' };
            case 'FACEBOOK':
                return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Facebook' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Email' };
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

    // Format time
    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle status change
    const handleStatusChange = async (userId: number, newStatus: string) => {
        try {
             const updatedUser = await adminUserApi.updateUserStatus(userId, newStatus);
             // Update local state
             setUsers(prev => prev.map(user => 
                 user.id === userId ? updatedUser : user
             ));
             // Also update selected user if open
             if (selectedUser?.id === userId) {
                 setSelectedUser(updatedUser);
             }
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update user status");
        }
    };

    // Reset password
    // const resetPassword = (userId: number) => {
    //     setConfirmModal({
    //         isOpen: true,
    //         title: 'Reset Password',
    //         message: 'Are you sure you want to reset password for this user? A temporary password will be emailed to them.',
    //         variant: 'danger',
    //         buttonText: 'Reset Password',
    //         onConfirm: () => {
    //             // API call would go here
    //             alert(`Password reset initiated for user ${userId}`);
    //             setConfirmModal(prev => ({ ...prev, isOpen: false }));
    //         }
    //     });
    // };
    
    // NOTE: Stats calculation is currently client-side based on loaded users which is incorrect for paginated data.
    // Ideally backend should provide stats endpoint. For now, I will remove or mock stats based on current page or request backend for stats.
    // Given the request didn't include a Stats API, I will simplify the stats section or leave it as placeholders.
    // I'll leave placeholders for now as we only fetch a page of users.
    const stats = {
        total: totalElements, // We know total from page response
        // Others we don't know without a stats API, so I'll put placeholders or remove logic that depends on 'users' array which is only 1 page
        hikers: '-', 
        organizers: '-',
        active: '-',
        inactive: '-',
        suspended: '-',
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-2">Manage all user accounts and permissions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Users
                        </button> */}
                    </div>
                </div>

                {/* Stats Grid - Simplified as we don't have full stats API yet */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                   <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    {/* Hiding other stats tiles as they require separate API call */}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or phone..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFilterRole('ALL'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg ${filterRole === 'ALL' ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            All Roles
                        </button>
                        <button
                            onClick={() => { setFilterRole('HIKER'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterRole === 'HIKER' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <User className="w-4 h-4" />
                            Hikers
                        </button>
                        <button
                            onClick={() => { setFilterRole('ORGANIZER'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterRole === 'ORGANIZER' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <Shield className="w-4 h-4" />
                            Organizers
                        </button>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFilterStatus('ALL'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg ${filterStatus === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            All Status
                        </button>
                        <button
                            onClick={() => { setFilterStatus('ACTIVE'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'ACTIVE' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            Active
                        </button>
                        <button
                            onClick={() => { setFilterStatus('INACTIVE'); setPage(0); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <AlertCircle className="w-4 h-4" />
                            Inactive
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-[#1E3A5F]" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        {error}
                        <button onClick={() => fetchUsers()} className="ml-2 underline hover:text-red-800">Retry</button>
                    </div>
                ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">User</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Role</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Status</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[100px]">Auth</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[140px]">Activity</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[140px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => {
                                    const roleBadge = getRoleBadge(user.role);
                                    const statusBadge = getStatusBadge(user.status);
                                    const providerBadge = getProviderBadge(user.providerType);

                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            {/* User Info - Compact Version */}
                                            <td className="py-4 px-4 pr-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                        {user.profileImage ? (
                                                            <img
                                                                src={user.profileImage}
                                                                alt={user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                                            {user.role === 'ADMIN' && (
                                                                <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full flex-shrink-0">Admin</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.phone}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role - Compact */}
                                            <td className="py-4 px-4 pr-0">
                                                <div className="space-y-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text} inline-block`}>
                                                        {roleBadge.icon} {roleBadge.label}
                                                    </span>
                                                    {user.organizer && (
                                                        <div className="text-xs text-gray-600">
                                                            <div className="truncate max-w-[110px]">{user.organizer.organizationName}</div>
                                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${user.organizer.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {user.organizer.approvalStatus}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status - Compact */}
                                            <td className="py-4 px-4 pr-0">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        {statusBadge.icon}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                                            {statusBadge.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(user.createdAt)}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Auth Provider - Compact */}
                                            <td className="py-4 px-4 pr-0">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${providerBadge.bg} ${providerBadge.text}`}>
                                                    {providerBadge.label}
                                                </span>
                                            </td>

                                            {/* Activity - Compact */}
                                            <td className="py-4 px-4 pr-0">
                                                <div className="space-y-1">
                                                    {user.role === 'HIKER' ? (
                                                        <>
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                                <span className="truncate">{user.totalBookings || 0} bookings</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Star className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                                <span className="truncate">{user.reviewsCount || 0} reviews</span>
                                                            </div>
                                                        </>
                                                    ) : user.role === 'ORGANIZER' ? (
                                                        <div className="text-sm">
                                                            {user.organizer?.approvalStatus === 'SUCCESS' ? (
                                                                <span className="text-green-600 text-xs">✓ Verified</span>
                                                            ) : (
                                                                <span className="text-yellow-600 text-xs">⏳ Pending</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray-600">Admin</div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions - Compact */}
                                            <td className="py-4 px-4 pr-0">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        className="p-1.5 text-gray-600 hover:text-[#1E3A5F] hover:bg-gray-100 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                
                                                   {/* Status Actions Dropdown */}
                                                    <div className="relative group focus-within:z-10" tabIndex={-1}>
                                                        <button
                                                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded focus:outline-none"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>

                                                        <div
                                                            className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200
                                                                    hidden
                                                                    group-focus-within:block
                                                                    transition-all duration-150 z-10"
                                                        >
                                                            <div className="py-1">
                                                                {user.status === 'ACTIVE' ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setConfirmModal({
                                                                                isOpen: true,
                                                                                title: 'Deactivate User',
                                                                                message: `Are you sure you want to mark ${user.name} as inactive?`,
                                                                                variant: 'danger',
                                                                                buttonText: 'Deactivate',
                                                                                onConfirm: () => {
                                                                                    handleStatusChange(user.id, 'INACTIVE');
                                                                                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                                                                }
                                                                            })}
                                                                            className="w-full text-left px-3 py-2 text-xs text-yellow-700 hover:bg-yellow-50 flex items-center gap-2"
                                                                        >
                                                                            <AlertCircle className="w-3 h-3" />
                                                                            Mark Inactive
                                                                        </button>
                                                                    </>
                                                                ) : user.status === 'INACTIVE' ? (
                                                                    <button
                                                                        onClick={() => setConfirmModal({
                                                                            isOpen: true,
                                                                            title: 'Activate User',
                                                                            message: `Are you sure you want to activate ${user.name}?`,
                                                                            variant: 'success',
                                                                            buttonText: 'Activate',
                                                                            onConfirm: () => {
                                                                                handleStatusChange(user.id, 'ACTIVE');
                                                                                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                                                            }
                                                                        })}
                                                                        className="w-full text-left px-3 py-2 text-xs text-green-700 hover:bg-green-50 flex items-center gap-2"
                                                                    >
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        Activate
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setConfirmModal({
                                                                            isOpen: true,
                                                                            title: 'Unsuspend User',
                                                                            message: `Are you sure you want to unsuspend ${user.name}?`,
                                                                            variant: 'success',
                                                                            buttonText: 'Unsuspend',
                                                                            onConfirm: () => {
                                                                                handleStatusChange(user.id, 'ACTIVE');
                                                                                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                                                            }
                                                                        })}
                                                                        className="w-full text-left px-3 py-2 text-xs text-green-700 hover:bg-green-50 flex items-center gap-2"
                                                                    >
                                                                        <Unlock className="w-3 h-3" />
                                                                        Unsuspend
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No users found matching your criteria.</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
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
                                    
                                    {/* Simplified pagination numbers - can be improved to show range */}
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

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                                    <p className="text-gray-600">Complete user information and activity</p>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* User Profile Section */}
                            <div className="flex items-start gap-6 mb-8">
                                {/* Profile Image */}
                                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                                    {selectedUser.profileImage ? (
                                        <img
                                            src={selectedUser.profileImage}
                                            alt={selectedUser.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                            <User className="w-10 h-10" />
                                        </div>
                                    )}
                                </div>

                                {/* Basic Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(selectedUser.role).bg} ${getRoleBadge(selectedUser.role).text}`}>
                                                {getRoleBadge(selectedUser.role).label}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedUser.status).bg} ${getStatusBadge(selectedUser.status).text}`}>
                                                {getStatusBadge(selectedUser.status).label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-gray-600">
                                        <p className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {selectedUser.email}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {selectedUser.phone}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${getProviderBadge(selectedUser.providerType).bg} ${getProviderBadge(selectedUser.providerType).text}`}>
                                                {getProviderBadge(selectedUser.providerType).label} Authentication
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Account Information */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">ACCOUNT INFORMATION</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">User ID</span>
                                                <span className="font-medium">#{selectedUser.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Joined Date</span>
                                                <span className="font-medium">{formatDate(selectedUser.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Last Login</span>
                                                <span className="font-medium">{formatDate(selectedUser.lastLogin)} {formatTime(selectedUser.lastLogin)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Organizer Details (if applicable) */}
                                    {selectedUser.organizer && (
                                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                            <h3 className="text-sm font-medium text-green-700 mb-3">ORGANIZER DETAILS</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs text-green-600">Organization</label>
                                                    <p className="font-medium">{selectedUser.organizer.organizationName}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-green-600">Approval Status</label>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedUser.organizer.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {selectedUser.organizer.approvalStatus}
                                                        </span>
                                                        {selectedUser.organizer.approvalStatus === 'PENDING' && (
                                                            <button className="text-xs text-blue-600 hover:underline">
                                                                Review Application
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Activity Stats */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">ACTIVITY STATISTICS</h3>
                                        <div className="space-y-4">
                                            {selectedUser.role === 'HIKER' ? (
                                                <>
                                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600">Total Bookings</p>
                                                                <p className="text-lg font-bold">{selectedUser.totalBookings || 0}</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-sm text-[#1E3A5F] hover:underline">
                                                            View All
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                <Star className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600">Reviews Given</p>
                                                                <p className="text-lg font-bold">{selectedUser.reviewsCount || 0}</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-sm text-[#1E3A5F] hover:underline">
                                                            View All
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                                <DollarSign className="w-5 h-5 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600">Total Spent</p>
                                                                <p className="text-lg font-bold">${selectedUser.totalSpent || 0}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : selectedUser.role === 'ORGANIZER' ? (
                                                <div className="p-3 bg-white rounded-lg">
                                                    <p className="text-sm text-gray-600">Organizer account</p>
                                                    <p className="text-gray-700 mt-1">
                                                        {selectedUser.organizer?.approvalStatus === 'APPROVED'
                                                            ? 'This organizer can create and manage events.'
                                                            : 'This organizer is pending verification and cannot create events yet.'
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-white rounded-lg">
                                                    <p className="text-sm text-gray-600">Administrator Account</p>
                                                    <p className="text-gray-700 mt-1">Full system access and administrative privileges.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
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

export default UserManagementPage;