import { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Search, 
  Eye, MoreVertical,
  CheckCircle,  XCircle, Clock,
  ChevronLeft, ChevronRight, Loader,
   TrendingUp,  RotateCcw
} from 'lucide-react';
import type { AdminEventDTO, EventStatus, EventStatsDTO, EventParticipantDTO } from '../../types/adminEventTypes';
import * as adminEventApi from '../../api/services/adminEventApi';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminEventManagementPage = () => {
    // State
    const [events, setEvents] = useState<AdminEventDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters and Pagination
    const [filterStatus, setFilterStatus] = useState<EventStatus>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    // const [size, setSize] = useState(10);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Stats
    const [stats, setStats] = useState<EventStatsDTO>({
        totalEvents: 0,
        activeEvents: 0,
        completedEvents: 0,
        cancelledEvents: 0
    });

    // Modal
    const [selectedEvent, setSelectedEvent] = useState<AdminEventDTO | null>(null);
    const [participants, setParticipants] = useState<EventParticipantDTO[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    
    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        variant: 'danger' as 'danger' | 'primary' | 'success',
        buttonText: 'Confirm'
    });

    // Fetch initial data
    useEffect(() => {
        fetchStats();
    }, []);

    // Fetch participants when modal opens
    useEffect(() => {
        if (selectedEvent) {
            fetchParticipants(selectedEvent.id);
        }
    }, [selectedEvent]);

    // Fetch events on filter change
    useEffect(() => {
        fetchEvents();
    }, [page, size, filterStatus]); // searchQuery debounce handled separately

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 0) setPage(0);
            else fetchEvents();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchStats = async () => {
        try {
            const data = await adminEventApi.getEventStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch event stats", err);
        }
    };

    const fetchParticipants = async (eventId: number) => {
        setLoadingParticipants(true);
        try {
            const data = await adminEventApi.getEventParticipants(eventId);
            setParticipants(data);
        } catch (err) {
            console.error("Failed to fetch participants", err);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminEventApi.getAllEvents(
                page,
                size,
                filterStatus,
                searchQuery
            );
            setEvents(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error("Failed to fetch events", err);
            setError("Failed to load events. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: EventStatus) => {
        try {
            const updatedEvent = await adminEventApi.updateEventStatus(id, newStatus);
            setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
            
            // Update selected event if modal is open
            if (selectedEvent?.id === id) {
                setSelectedEvent(updatedEvent);
            }
            fetchStats(); // Refresh stats
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update event status");
        }
    };

    const confirmStatusChange = (id: number, newStatus: EventStatus) => {
        let title = "Update Status";
        let message = `Are you sure you want to change status to ${newStatus}?`;
        let variant: 'danger' | 'primary' | 'success' = 'primary';
        let buttonText = "Update";

        if (newStatus === 'CANCELLED') {
            title = "Cancel Event";
            message = "Are you sure you want to cancel this event? This action cannot be easily undone.";
            variant = 'danger';
            buttonText = "Cancel Event";
        } else if (newStatus === 'PUBLISHED') {
            title = "Publish Event";
            message = "Are you sure you want to publish this event? It will be visible to all users.";
            variant = 'success';
            buttonText = "Publish";
        }

        setConfirmModal({
            isOpen: true,
            title,
            message,
            variant,
            buttonText,
            onConfirm: () => handleStatusChange(id, newStatus)
        });
    };

    // Helper functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Published' };
            case 'DRAFT':
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Clock className="w-3 h-3" />, label: 'Draft' };
            case 'CANCELLED':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-3 h-3" />, label: 'Cancelled' };
            case 'COMPLETED':
                return { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Completed' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: null, label: status };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
                        <p className="text-gray-600 mt-2">Oversee all trekking events and expeditions</p>
                    </div>
                     <div className="flex items-center gap-2">
                        {/* <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Events
                        </button> */}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                     <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Events</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeEvents}</p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                     <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedEvents}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>
                     <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Cancelled</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelledEvents}</p>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search events by title, location or organizer..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Status Filter */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        {(['ALL', 'PUBLISHED', 'DRAFT', 'CANCELLED', 'COMPLETED'] as const).map((status) => (
                             <button
                                key={status}
                                onClick={() => { setFilterStatus(status); setPage(0); }}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    filterStatus === status 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-[#1E3A5F]" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        {error}
                        <button onClick={fetchEvents} className="ml-2 underline hover:text-red-800">Retry</button>
                    </div>
                ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[250px]">Event</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[150px]">Organizer</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[100px]">Price</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Status</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[120px]">Participants</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 min-w-[100px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {events.map((event) => {
                                    const statusBadge = getStatusBadge(event.status);
                                    
                                    return (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            {/* Event Info */}
                                            <td className="py-4 px-4 pr-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                                        {event.imageUrl ? (
                                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                                <Calendar className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-[16px] text-gray-900 truncate max-w-[180px]" title={event.title}>{event.title}</h3>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <MapPin className="w-3 h-3" />
                                                            <span className="truncate max-w-[150px]">{event.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Organizer */}
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-[16px] text-gray-900 truncate">{event.organizer.organizationName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{event.organizer.name}</p>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-4">
                                                <div className="text-sm text-gray-900">{formatDate(event.startDate)}</div>
                                                <div className="text-xs text-gray-500">{formatDate(event.endDate)}</div>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-4">
                                                <div className="font-medium text-[16px] text-gray-900">${event.price}</div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} flex items-center gap-1 w-fit`}>
                                                    {statusBadge.icon}
                                                    {statusBadge.label}
                                                </span>
                                            </td>

                                            {/* Participants */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-full bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                                                        <div 
                                                            className="bg-blue-600 h-1.5 rounded-full" 
                                                            style={{ width: `${Math.min(100, (event.currentParticipants / event.maxParticipants) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-600">{event.currentParticipants}/{event.maxParticipants}</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1">
                                                     <button
                                                        onClick={() => setSelectedEvent(event)}
                                                        className="p-1.5 text-gray-600 hover:text-[#1E3A5F] hover:bg-gray-100 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    
                                                    {/* Action Menu */}
                                                     <div className="relative group focus-within:z-10" tabIndex={-1}>
                                                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded focus:outline-none">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                         <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-focus-within:block z-10">
                                                            <div className="py-1">
                                                                 {event.status === 'PUBLISHED' && (
                                                                     <button
                                                                        onClick={() => confirmStatusChange(event.id, 'CANCELLED')}
                                                                        className="w-full text-left px-3 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center gap-2"
                                                                    >
                                                                        <XCircle className="w-3 h-3" />
                                                                        Cancel Event
                                                                    </button>
                                                                )}
                                                                {event.status === 'DRAFT' && (
                                                                    <button
                                                                        onClick={() => confirmStatusChange(event.id, 'PUBLISHED')}
                                                                        className="w-full text-left px-3 py-2 text-xs text-green-700 hover:bg-green-50 flex items-center gap-2"
                                                                    >
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        Publish
                                                                    </button>
                                                                )}
                                                                 {event.status === 'CANCELLED' && (
                                                                    <button
                                                                        onClick={() => confirmStatusChange(event.id, 'DRAFT')}
                                                                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                                    >
                                                                        <Clock className="w-3 h-3" />
                                                                        Revert to Draft
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

            {/* Event Details Modal */}
            {selectedEvent && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative h-64 bg-gray-200">
                            {selectedEvent.imageUrl ? (
                                <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <Calendar className="w-16 h-16" />
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white text-gray-800"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-4 left-6">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedEvent.status).bg} ${getStatusBadge(selectedEvent.status).text} flex items-center gap-2 w-fit shadow-sm border border-white/20 backdrop-blur-sm`}>
                                     {getStatusBadge(selectedEvent.status).icon}
                                     {getStatusBadge(selectedEvent.status).label}
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{selectedEvent.title}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedEvent.location}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-[#1E3A5F]">${selectedEvent.price}</div>
                                    <div className="text-sm text-gray-500">per person</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">About the Event</h3>
                                        <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-500 mb-1">Difficulty</p>
                                            <p className="font-semibold">{selectedEvent.difficultyLevel || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-500 mb-1">Category</p>
                                            <p className="font-semibold">{selectedEvent.category || 'Trekking'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                        <h3 className="font-bold text-blue-900 mb-4">Organizer</h3>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                                {selectedEvent.organizer.organizationName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{selectedEvent.organizer.organizationName}</p>
                                                <p className="text-sm text-gray-600">{selectedEvent.organizer.name}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p>{selectedEvent.organizer.email}</p>
                                            <p>{selectedEvent.organizer.phone}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4">Registration Status</h3>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="text-gray-600">Participants</span>
                                            <span className="font-medium">{selectedEvent.currentParticipants} / {selectedEvent.maxParticipants}</span>
                                        </div>
                                         <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                            <div 
                                                className="bg-[#1E3A5F] h-2 rounded-full" 
                                                style={{ width: `${Math.min(100, (selectedEvent.currentParticipants / selectedEvent.maxParticipants) * 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {selectedEvent.status === 'PUBLISHED' && (
                                                <button 
                                                    onClick={() => confirmStatusChange(selectedEvent.id, 'CANCELLED')}
                                                    className="w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                                                >
                                                    Cancel Event
                                                </button>
                                            )}
                                            {selectedEvent.status === 'CANCELLED' && (
                                                <button 
                                                    onClick={() => confirmStatusChange(selectedEvent.id, 'PUBLISHED')}
                                                    className="w-full py-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 text-sm font-medium flex items-center justify-center gap-2"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                    Reopen Event
                                                </button>
                                            )}
                                        </div>
                                        
                                        {/* Participants List */}
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <h4 className="font-bold text-gray-900 mb-3 text-sm">Registered Participants</h4>
                                            {loadingParticipants ? (
                                                <div className="flex justify-center py-4">
                                                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                                                </div>
                                            ) : participants.length > 0 ? (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                    {participants.map((p) => (
                                                        <div key={p.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{p.name}</p>
                                                                <p className="text-xs text-gray-500">{p.email}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {p.status}
                                                                </span>
                                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(p.bookingDate).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No participants yet.</p>
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

export default AdminEventManagementPage;
