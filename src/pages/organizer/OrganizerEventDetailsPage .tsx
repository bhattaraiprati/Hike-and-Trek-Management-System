import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, 
    Edit, Eye, Send, Star,
  CheckCircle, AlertCircle, Download,  ArrowLeft,
  ShieldOff,
  Trash,
  ShieldCheck,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEventDetails, UpdateEventStatus, updateEvent } from '../../api/services/Event';
import EditEventModal from '../../components/organizer/popup/EditEventModal';
import { SuccesfulMessageToast } from '../../utils/Toastify.util';
import { useAuth } from '../../context/AuthContext';
import type { Event, EventDetails } from '../../types/eventTypes';
import ViewParticipantsSlider from '../../components/organizer/popup/ViewParticipantsSlider';
import BulkEmailModal from '../../components/organizer/popup/BulkEmailModal';




const OrganizerEventDetailsPage = () => {
  const { user } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const organizerId = user?.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);

  const {data : eventData, isLoading, error} = useQuery({
    queryKey: ['organizerEventDetails', eventId],
    queryFn: () => getEventDetails(Number(eventId)),
    enabled: !!eventId,
    retry: 1,
  })  

  const event = eventData as EventDetails;

  const updateEventMutation = useMutation({
    mutationFn: (updatedEvent: Event) => updateEvent(updatedEvent.id, updatedEvent),
    onSuccess: () => {
      // Invalidate and refetch events query
      SuccesfulMessageToast("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['organizerEvents', organizerId] });
    },
  });

  const updateEventStatusMutation = useMutation({
    mutationFn: (Status: String) => UpdateEventStatus(Number(eventId), Status),
    onSuccess: () => {
      // Invalidate and refetch events query
      SuccesfulMessageToast("Event status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['organizerEventDetails', eventId] });
    },
  });

  const handleSaveEvent = (updatedEvent: Event) => {
    updateEventMutation.mutate(updatedEvent);
    setEditingEvent(null);
  };
   const handleEventStatus = (status: String) => {
    updateEventStatusMutation.mutate(status);
  };
  const handleViewParticipants = () => {
  setShowParticipantsPanel(true);
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'CANCELLED': return 'Cancelled';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-orange-100 text-orange-800';
      case 'EXTREME': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'Easy';
      case 'MODERATE': return 'Moderate';
      case 'DIFFICULT': return 'Difficult';
      case 'EXTREME': return 'Extreme';
      default: return difficulty;
    }
  };


  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const handleEditEvent = () => {
    navigate(`/organizer/events/${eventId}/edit`);
  };


  const handleSendEmail = () => {
    setShowBulkEmailModal(true);

  };

  const handleExportData = () => {
    // Export functionality
    alert('Event data exported successfully!');
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Event Not Found</h2>
          <button
            onClick={() => navigate('/dashboard/events')}
            className="text-[#1E3A5F] hover:underline"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const totalParticipants = event.eventRegistration?.reduce((sum, reg) => sum + reg.eventParticipants.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/events')}
            className="flex items-center gap-2 text-[#1E3A5F] hover:text-[#2a4a7a] transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[#1E3A5F]">{event?.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event?.status || '')}`}>
                  {getStatusText(event?.status || '')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(event?.date || '').toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event?.location}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>setEditingEvent(event)}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Event
              </button>
              <button
                onClick={() => handleViewParticipants()}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >

                <Eye className="w-4 h-4" />
                View Participants
              </button>
              {event?.status !== 'INACTIVE' ? (
              <button
                onClick={() => handleEventStatus('INACTIVE')}
                className="px-4 py-2 bg-red-500 text-white border border-red-300 text-gray-700 rounded-lg hover:bg-red-400 transition-colors duration-200 flex items-center gap-2"
              >
                <ShieldOff className="w-4 h-4" />
                In-Active Event
              </button>
              ) : (
              <button
                onClick={() => handleEventStatus('ACTIVE')}
                className="px-4 py-2 bg-[#1E3A5F] text-white border border-[#1E3A5F] text-gray-700 rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Active Event
              </button>
              )}

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Banner Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img
                  src={event?.bannerImageUrl}
                  alt={event?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-6">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[16px] font-bold text-gray-700 mb-1">Description</label>
                    <p className="text-gray-700">{event?.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-[16px] font-bold text-gray-700 mb-1">Meeting Information</label>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Point:</span>
                        <span className="font-medium">{event?.meetingPoint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{formatTime(event?.meetingTime || '')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[16px] font-bold text-gray-700 mb-1">Basic Information</label>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{event?.durationDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event?.difficultyLevel || '')}`}>
                          {getDifficultyText(event?.difficultyLevel || '')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-[#1E3A5F]">${event?.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[16px] font-bold text-gray-700 mb-1">Contact Information</label>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Person:</span>
                        <span className="font-medium">{event?.contactPerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Email:</span>
                        <a href={`mailto:${event?.contactEmail}`} className="text-[#1E3A5F] hover:underline font-medium">
                          {event?.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Included Services & Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Included Services</h4>
                  <ul className="space-y-2">
                    {event?.includedServices.map((service, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {event?.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Stats & Actions */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-6">Event Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-bold text-gray-900">{totalParticipants}/{event?.maxParticipants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Registration Rate</span>
                  <span className="font-bold text-green-600">{event?.registrationRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-purple-600">${event?.totalRevenue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-yellow-600">{event?.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleEditEvent}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                >
                  <Edit className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Edit Event Details</div>
                    <div className="text-sm text-gray-600">Update event information</div>
                  </div>
                </button>
                
                
                <button
                  onClick={handleSendEmail}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                >
                  <Send className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Send Bulk Email</div>
                    <div className="text-sm text-gray-600">Email all participants</div>
                  </div>
                </button>
                
                <button
                  onClick={handleExportData}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                >
                  <Download className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Export Data</div>
                    <div className="text-sm text-gray-600">Download participant list</div>
                  </div>
                </button>

                <button
                  onClick={() => handleViewParticipants()}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                >
                  <Trash className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Delete Event</div>
                    <div className="text-sm text-gray-600">Remove this event permanently</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Event Metadata */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-6">Event Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Event ID</span>
                  <span className="font-medium">#{event?.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(event?.createdAt || "").toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {new Date(event?.updatedAt || "").toLocaleDateString()}
                  </span>
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>

       <ViewParticipantsSlider 
        isOpen={showParticipantsPanel}
        onClose={() => setShowParticipantsPanel(false)}
        eventId={eventId || ''}
        eventData={eventData}
        isLoading={isLoading}
      />
      <BulkEmailModal 
        isOpen={showBulkEmailModal}
        onClose={() => setShowBulkEmailModal(false)}
        eventId={eventId || ''}
        eventData={eventData}
        isLoading={isLoading}
      />
      <EditEventModal
              event={editingEvent!}
              isOpen={!!editingEvent}
              onClose={() => setEditingEvent(null)}
              onSave={handleSaveEvent}
              
            />
    </div>
    );
};
export default OrganizerEventDetailsPage; 
