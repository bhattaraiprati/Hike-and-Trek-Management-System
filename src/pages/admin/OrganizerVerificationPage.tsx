// OrganizerVerificationPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, XCircle, Eye, FileText, 
  Calendar, User, Building, MapPin, 
  Phone, Clock, Shield, 
  AlertCircle, Search, Download, Loader2
} from 'lucide-react';
import {
  getOrganizers,
  getOrganizerStats,
  getOrganizerDetails,
  approveOrganizer,
  rejectOrganizer,
} from '../../api/services/adminOrganizerApi';
import type {
  AdminOrganizerStatsDTO,
  ApprovalStatus,
  OrganizerVerificationDetailDTO,
  OrganizerVerificationListDTO,
} from '../../types/adminTypes';
import ConfirmModal from '../../components/common/ConfirmModal';

const OrganizerVerificationPage = () => {
  // State for organizers list
  const [organizers, setOrganizers] = useState<OrganizerVerificationListDTO[]>([]);
  const [stats, setStats] = useState<AdminOrganizerStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [filterStatus, setFilterStatus] = useState<'ALL' | ApprovalStatus>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // State for modals
  const [selectedOrganizer, setSelectedOrganizer] = useState<OrganizerVerificationDetailDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<number | null>(null);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        variant: 'danger' as 'danger' | 'primary' | 'success',
        buttonText: 'Confirm'
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch organizers when filter or search changes
  const fetchOrganizers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const status = filterStatus === 'ALL' ? undefined : filterStatus;
      const search = debouncedSearch.trim() || undefined;
      const data = await getOrganizers(status, search);
      setOrganizers(data);
    } catch (err: any) {
      console.error('Error fetching organizers:', err);
      setError(err.response?.data?.message || 'Failed to load organizers');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, debouncedSearch]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await getOrganizerStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Initial load and refresh on filter/search change
  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle view details
  const handleViewDetails = async (organizerId: number) => {
    try {
      setDetailLoading(true);
      const details = await getOrganizerDetails(organizerId);
      setSelectedOrganizer(details);
    } catch (err: any) {
      console.error('Error fetching organizer details:', err);
      alert(err.response?.data?.message || 'Failed to load organizer details');
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle approval
  const handleApprove = async (organizerId: number) => {
    setConfirmModal({
        isOpen: true,
        title: 'Approve Organizer',
        message: 'Are you sure you want to approve this organizer?',
        variant: 'success',
        buttonText: 'Approve',
        onConfirm: async () => {
            try {
                setActionLoading(true);
                await approveOrganizer(organizerId);
                // Refresh data
                fetchOrganizers();
                fetchStats();
                // Close modal if open
                if (selectedOrganizer?.id === organizerId) {
                    setSelectedOrganizer(null);
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                // Consider adding a toast notification here instead of alert in future
            } catch (err: any) {
                console.error('Error approving organizer:', err);
                alert(err.response?.data?.message || 'Failed to approve organizer');
            } finally {
                setActionLoading(false);
            }
        }
    });
  };

  // Open rejection modal
  const openRejectModal = (organizerId: number) => {
    setPendingRejectId(organizerId);
    setShowModal(true);
    setRejectionReason('');
  };

  // Handle rejection
  const handleReject = async () => {
    if (!pendingRejectId) return;

    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    setConfirmModal({
        isOpen: true,
        title: 'Reject Organizer',
        message: 'Are you sure you want to reject this organizer? This action cannot be undone.',
        variant: 'danger',
        buttonText: 'Reject',
        onConfirm: async () => {
             try {
                setActionLoading(true);
                await rejectOrganizer(pendingRejectId, rejectionReason.trim());
                setShowModal(false);
                setRejectionReason('');
                setPendingRejectId(null);
                // Refresh data
                fetchOrganizers();
                fetchStats();
                // Close detail modal if open
                if (selectedOrganizer?.id === pendingRejectId) {
                    setSelectedOrganizer(null);
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
             } catch (err: any) {
                console.error('Error rejecting organizer:', err);
                alert(err.response?.data?.message || 'Failed to reject organizer');
             } finally {
                setActionLoading(false);
             }
        }
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' };
      case 'APPROVED':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' };
      case 'REJECTED':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Verification</h1>
            <p className="text-gray-600 mt-2">Review and verify new organizer registrations</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button> */}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Organizers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalOrganizers ?? '-'}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats?.pendingCount ?? '-'}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats?.approvedCount ?? '-'}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats?.rejectedCount ?? '-'}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
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
                placeholder="Search organizers by name, email, or organization..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg ${filterStatus === 'ALL' ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <Clock className="w-4 h-4" />
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('SUCCESS')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'SUCCESS' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <CheckCircle className="w-4 h-4" />
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('DECLINE')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'DECLINE' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <XCircle className="w-4 h-4" />
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
          <button
            onClick={fetchOrganizers}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Organizers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            <span className="ml-2 text-gray-500">Loading organizers...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Organizer</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Organization</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Contact</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Registered</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {organizers.map((organizer) => {
                  const status = getStatusBadge(organizer.approvalStatus);
                  return (
                    <tr key={organizer.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 pr-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {organizer.profileImage ? (
                              <img 
                                src={organizer.profileImage} 
                                alt={organizer.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{organizer.fullName}</p>
                            <p className="text-sm text-gray-600">{organizer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 pr-0">
                        <p className="font-medium text-gray-900">{organizer.organizationName}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 h-3" />
                          {organizer.address}
                        </div>
                      </td>
                      <td className="py-4 px-6 pr-0">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            {organizer.phone}
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <User className="w-3 h-3" />
                            {organizer.contactPerson}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 pr-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                        {organizer.verifiedOn && (
                          <p className="text-xs text-gray-500 mt-1">
                            Verified: {formatDate(organizer.verifiedOn)}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6 pr-0">
                        <p className="text-gray-900">{formatDate(organizer.createdAt)}</p>
                        {organizer.eventsCount !== undefined && (
                          <p className="text-sm text-gray-600 mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {organizer.eventsCount} events
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6 pr-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(organizer.id)}
                            disabled={detailLoading}
                            className="p-2 text-gray-600 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={organizer.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Documents"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                          
                          {organizer.approvalStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(organizer.id)}
                                disabled={actionLoading}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-50"
                                title="Approve Organizer"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openRejectModal(organizer.id)}
                                disabled={actionLoading}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                title="Reject Organizer"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && organizers.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No organizers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrganizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Organizer Details</h2>
                  <p className="text-gray-600">{selectedOrganizer.organizationName}</p>
                </div>
                <button
                  onClick={() => setSelectedOrganizer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Cover Image */}
              {selectedOrganizer.coverImage && (
                <div className="mb-6">
                  <img 
                    src={selectedOrganizer.coverImage} 
                    alt={selectedOrganizer.organizationName}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">ORGANIZATION INFO</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-600">Organization Name</label>
                        <p className="font-medium">{selectedOrganizer.organizationName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Contact Person</label>
                        <p className="font-medium">{selectedOrganizer.contactPerson}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Address</label>
                        <p className="font-medium">{selectedOrganizer.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">USER ACCOUNT</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {selectedOrganizer.profileImage ? (
                          <img 
                            src={selectedOrganizer.profileImage} 
                            alt={selectedOrganizer.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{selectedOrganizer.fullName}</p>
                        <p className="text-sm text-gray-600">{selectedOrganizer.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">CONTACT DETAILS</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Phone Number</p>
                          <p className="font-medium">{selectedOrganizer.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-gray-600">Verification Documents</label>
                          <a 
                            href={selectedOrganizer.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#1E3A5F] hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            View Document
                          </a>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                          <p className="text-sm text-yellow-800">Business license and guide certification attached</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">STATUS</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedOrganizer.approvalStatus).bg} ${getStatusBadge(selectedOrganizer.approvalStatus).text}`}>
                          {getStatusBadge(selectedOrganizer.approvalStatus).label}
                        </span>
                        <p className="text-sm text-gray-600">
                          Registered: {formatDate(selectedOrganizer.createdAt)}
                        </p>
                      </div>
                      
                      {selectedOrganizer.verifiedBy && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">Verified by</p>
                          <p className="font-medium">{selectedOrganizer.verifiedBy.fullName}</p>
                          <p className="text-xs text-gray-500">
                            on {selectedOrganizer.verifiedOn ? formatDate(selectedOrganizer.verifiedOn) : 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">ABOUT THE ORGANIZATION</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedOrganizer.about}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedOrganizer(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {(selectedOrganizer.approvalStatus === 'PENDING' || selectedOrganizer.approvalStatus === 'DECLINE') && (
                  <>
                { selectedOrganizer.approvalStatus === 'PENDING' && ( 
                    <button
                      onClick={() => openRejectModal(selectedOrganizer.id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Organizer
                    </button>
                )}
                    <button
                      onClick={() => handleApprove(selectedOrganizer.id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve Organizer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reject Organizer</h3>
                  <p className="text-gray-600 mt-1">Please provide a reason for rejecting this organizer application.</p>
                </div>
              </div>
              
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setRejectionReason('');
                    setPendingRejectId(null);
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Reject Organizer
                </button>
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

export default OrganizerVerificationPage;