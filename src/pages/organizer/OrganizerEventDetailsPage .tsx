import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Users,  
  User,  Edit, Eye, Send, Star,
  CheckCircle, AlertCircle, Download,  ArrowLeft,
  BarChart,  Heart, CheckCheck,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getEventById } from '../../api/services/Event';

interface EventDetails {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string; // LocalDate
  durationDays: number;
  difficultyLevel: 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
  price: number;
  maxParticipants: number;
  meetingPoint: string;
  meetingTime: string; // LocalTime
  contactPerson: string;
  contactEmail: string;
  bannerImageUrl: string;
  includedServices: string[];
  requirements: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'COMPLETED';
  createdAt: string; // LocalDateTime
  updatedAt: string; // LocalDateTime
  
  // Statistics
  currentParticipants: number;
  registrationRate: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
  
  // Organizer info
  organizer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    totalEvents: number;
    rating: number;
  };
  
  // Registrations
  registrations: EventRegistration[];
  
  // Reviews
  reviews: Review[];
}

interface EventRegistration {
  id: number;
  registrationDate: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  contact: string;
  contactName: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  payment: {
    id: number;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    method: string;
  };
  participants: EventParticipant[];
}

interface EventParticipant {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  attendanceStatus: 'PENDING' | 'PRESENT' | 'ABSENT';
}

interface Review {
  id: number;
  user: {
    name: string;
    profileImage?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}

const OrganizerEventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
//   const [event, setEvent] = useState<EventDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'reviews'>('overview');

//   useEffect(() => {
//     // Mock data - replace with API call
//     const mockEvent: EventDetails = {
//       id: 1,
//       title: 'Sunrise Mountain Trek',
//       description: 'Experience the breathtaking sunrise from the peak of Mount Serenity. This guided trek takes you through lush forests, rocky terrain, and offers panoramic views of the valley below. Perfect for nature lovers and photography enthusiasts.',
//       location: 'Mount Serenity, Alpine Range',
//       date: '2024-06-15',
//       durationDays: 2,
//       difficultyLevel: 'MODERATE',
//       price: 129,
//       maxParticipants: 20,
//       meetingPoint: 'Alpine Base Camp Parking Lot',
//       meetingTime: '05:30:00',
//       contactPerson: 'Sarah Johnson',
//       contactEmail: 'sarah@alpineadventures.com',
//       bannerImageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
//       includedServices: [
//         'Professional Guide',
//         'Safety Equipment',
//         'First Aid Kit',
//         'Snacks & Water',
//         'Photography Service',
//         'Certificate of Completion'
//       ],
//       requirements: [
//         'Hiking boots',
//         'Waterproof jacket',
//         '2L water minimum',
//         'Day backpack',
//         'Physical fitness certificate',
//         'ID proof'
//       ],
//       status: 'ACTIVE',
//       createdAt: '2024-01-15T10:30:00',
//       updatedAt: '2024-05-20T14:45:00',
      
//       // Statistics
//       currentParticipants: 15,
//       registrationRate: 75,
//       totalRevenue: 1935,
//       averageRating: 4.7,
//       reviewCount: 24,
      
//       // Organizer info
//       organizer: {
//         id: 1,
//         name: 'Alpine Adventures',
//         email: 'info@alpineadventures.com',
//         phone: '+977-9841234567',
//         totalEvents: 24,
//         rating: 4.8
//       },
      
//       // Registrations
//       registrations: [
//         {
//           id: 1,
//           registrationDate: '2024-05-20T09:15:00',
//           user: { id: 1, name: 'John Doe', email: 'john@example.com' },
//           contact: '+977-9841234567',
//           contactName: 'John Doe',
//           email: 'john@example.com',
//           status: 'CONFIRMED',
//           payment: {
//             id: 1,
//             amount: 258,
//             status: 'COMPLETED',
//             method: 'eSewa'
//           },
//           participants: [
//             { id: 1, name: 'John Doe', gender: 'MALE', nationality: 'Nepalese', attendanceStatus: 'PENDING' },
//             { id: 2, name: 'Jane Doe', gender: 'FEMALE', nationality: 'Nepalese', attendanceStatus: 'PENDING' }
//           ]
//         },
//         {
//           id: 2,
//           registrationDate: '2024-05-18T14:30:00',
//           user: { id: 2, name: 'Mike Wilson', email: 'mike@example.com' },
//           contact: '+977-9851234567',
//           contactName: 'Mike Wilson',
//           email: 'mike@example.com',
//           status: 'CONFIRMED',
//           payment: {
//             id: 2,
//             amount: 129,
//             status: 'COMPLETED',
//             method: 'Khalti'
//           },
//           participants: [
//             { id: 3, name: 'Mike Wilson', gender: 'MALE', nationality: 'Nepalese', attendanceStatus: 'PENDING' }
//           ]
//         }
//       ],
      
//       // Reviews
//       reviews: [
//         {
//           id: 1,
//           user: { name: 'Raj Kumar', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
//           rating: 5,
//           comment: 'Amazing experience! The guides were professional and the views were breathtaking.',
//           createdAt: '2024-04-15T16:20:00',
//           likes: 12
//         },
//         {
//           id: 2,
//           user: { name: 'Emily Chen' },
//           rating: 4,
//           comment: 'Well organized event. Would recommend to anyone looking for adventure.',
//           createdAt: '2024-04-10T11:45:00',
//           likes: 8
//         }
//       ]
//     };

//     setTimeout(() => {
//       setEvent(mockEvent);
//     //   setLoading(false);
//     }, 1000);
//   }, [eventId]);

  const {data : eventData, isLoading, error} = useQuery({
    queryKey: ['organizerEventDetails', eventId],
    queryFn: () => getEventById(Number(eventId)),
    enabled: !!eventId,
  })

  const event = eventData as EventDetails;



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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600';
      case 'PENDING': return 'text-yellow-600';
      case 'FAILED': return 'text-red-600';
      case 'REFUNDED': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const handleEditEvent = () => {
    navigate(`/organizer/events/${eventId}/edit`);
  };

  const handleViewParticipants = () => {
    navigate(`/organizer/events/${eventId}/participants`);
  };

  const handleSendEmail = () => {
  };

  const handleExportData = () => {
    // Export functionality
    alert('Event data exported successfully!');
  };

//   const handlePrint = () => {
//     window.print();
//   };

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

  const totalParticipants = event.registrations?.reduce((sum, reg) => sum + reg.participants.length, 0);

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
                onClick={handleEditEvent}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Event
              </button>
              <button
                onClick={handleViewParticipants}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Participants
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
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

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors duration-200 ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-[#1E3A5F] text-[#1E3A5F]'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BarChart className="w-4 h-4" />
                      Overview
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('participants')}
                    className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors duration-200 ${
                      activeTab === 'participants'
                        ? 'border-b-2 border-[#1E3A5F] text-[#1E3A5F]'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      Participants ({totalParticipants})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors duration-200 ${
                      activeTab === 'reviews'
                        ? 'border-b-2 border-[#1E3A5F] text-[#1E3A5F]'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4" />
                      Reviews ({event?.reviewCount})
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-[#1E3A5F] mb-1">{totalParticipants}/{event?.maxParticipants}</div>
                        <div className="text-sm text-gray-600">Participants</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600 mb-1">{event?.registrationRate}%</div>
                        <div className="text-sm text-gray-600">Registration Rate</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600 mb-1">${event?.totalRevenue}</div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">{event?.averageRating}</div>
                        <div className="text-sm text-gray-600">Avg Rating</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Registration Progress</span>
                        <span>{event?.registrationRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#1E3A5F] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${event?.registrationRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">New Registration</div>
                              <div className="text-sm text-gray-600">John Doe registered 2 participants</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">2 hours ago</div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCheck className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Payment Received</div>
                              <div className="text-sm text-gray-600">Mike Wilson completed payment</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">1 day ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Participants Tab */}
                {activeTab === 'participants' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Registered Participants ({totalParticipants})</h4>
                      <button
                        onClick={handleExportData}
                        className="text-sm text-[#1E3A5F] hover:text-[#2a4a7a] flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Export List
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {event?.registrations.map((registration) => (
                        <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{registration.user.name}</div>
                              <div className="text-sm text-gray-600">{registration.email}</div>
                              <div className="text-sm text-gray-600">{registration.contact}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRegistrationStatusColor(registration.status)}`}>
                                {registration.status}
                              </span>
                              <span className={`text-sm font-medium ${getPaymentStatusColor(registration.payment.status)}`}>
                                {registration.payment.method} • {registration.payment.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="text-sm text-gray-600 mb-2">
                              Registered on {new Date(registration.registrationDate).toLocaleDateString()}
                            </div>
                            <div className="space-y-2">
                              {registration.participants.map((participant) => (
                                <div key={participant.id} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{participant.name}</span>
                                    <span className="text-gray-600">({participant.nationality})</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(participant.attendanceStatus)}`}>
                                    {participant.attendanceStatus}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-gray-900">{event?.averageRating}</div>
                        <div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.floor(event?.averageRating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">{event?.reviewCount} reviews</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {event?.reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {review.user.profileImage ? (
                                <img
                                  src={review.user.profileImage}
                                  alt={review.user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white font-medium">
                                  {review.user.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{review.user.name}</div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-gray-800">
                              <Heart className="w-4 h-4" />
                              {review.likes} likes
                            </button>
                            <button className="hover:text-gray-800">Reply</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  onClick={handleViewParticipants}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                >
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Manage Participants</div>
                    <div className="text-sm text-gray-600">View and manage registrations</div>
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
    </div>
    );
};
export default OrganizerEventDetailsPage; 
