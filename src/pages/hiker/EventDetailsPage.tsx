import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Star, Users, ShieldCheck, Calendar } from 'lucide-react';
import { getEventById } from '../../api/services/Event';
import  { DIFFICULTY_LABEL} from '../../types/eventTypes';
import type { Difficulty } from '../../types/eventTypes';

interface OrganizerData {
  id: number;
  organizationName: string;
  contactPerson: string;
  phone: string;
  about: string;
  isVerified: boolean;
  totalEvents: number;
  totalParticipants: number;
  rating: number;
  reviewCount: number;
}

interface EventData {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: Difficulty;
  price: number;
  maxParticipants: number;
  currentParticipants?: number;
  bannerImageUrl: string;
  meetingPoint: string;
  meetingTime: string;
  contactPerson: string;
  contactEmail: string;
  includedServices: string[];
  requirements: string[];
  organizer: OrganizerData;
}

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("Fetching event with ID:", eventId);
        if (!eventId) return;
        const data = await getEventById(Number(eventId));
        setEvent(data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Mock organizer data - replace with actual API data
  // const mockOrganizer: OrganizerData = {
  //   id: 1,
  //   name: 'TrekNepal Adventures',
  //   logoUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  //   description: 'Professional adventure organizers with 10+ years of experience in Himalayan treks and mountain expeditions.',
  //   isVerified: true,
  //   totalEvents: 24,
  //   totalParticipants: 356,
  //   rating: 4.8,
  //   reviewCount: 128,
  //   contactPerson: 'Raj Sharma',
  //   contactEmail: 'raj@treknepal.com',
  //   joinDate: '2018-05-15'
  // };

  // Use actual organizer data or mock data
  const organizer = event?.organizer;

  const DIFFICULTY_COLOR: Record<Difficulty, string> = {
    EASY: 'bg-green-100 text-green-800',
    MODERATE: 'bg-yellow-100 text-yellow-800',
    DIFFICULT: 'bg-orange-100 text-orange-800',
    EXTREME: 'bg-red-100 text-red-800',
  };

  const handleRegistration = () => {
    // TODO: Connect to real registration API
    navigate(`/hiker-dashboard/event/${eventId}/checkout`, { state: { participantsCount: participantsCount } });
    setIsRegistered(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
          <span className="text-lg text-gray-600">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Event Not Found</h2>
          <button
            onClick={() => navigate('/hiker-dashboard/explore')}
            className="text-[#1E3A5F] hover:underline"
          >
            ← Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const spotsLeft = event.maxParticipants - (event.currentParticipants || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">{event.title}</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#1E3A5F] hover:underline text-sm flex items-center justify-center gap-1 mx-auto"
          >
            <span>←</span> Back to Explore
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-80 bg-gray-200 relative">
            <img
              src={event.bannerImageUrl || '/placeholder-event.jpg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-8">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">{event.durationDays} days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Difficulty:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${DIFFICULTY_COLOR[event.difficultyLevel]}`}>
                  {DIFFICULTY_LABEL[event.difficultyLevel]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Event Details */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Event Details Sections */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Meeting Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Meeting Point:</span>
                        <span className="font-medium text-right">{event.meetingPoint}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Meeting Time:</span>
                        <span className="font-medium">{event.meetingTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Included Services</h3>
                      <ul className="space-y-2">
                        {event.includedServices.map((s, i) => (
                          <li key={i} className="flex items-center text-sm bg-gray-50 p-1 rounded-lg">
                            <div className="w-2 h-2 bg-[#1E3A5F] rounded-full mr-3 flex-shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {event.requirements.map((r, i) => (
                          <li key={i} className="flex items-center text-sm bg-gray-50 p-1 rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Organizer Details Card */}
                {organizer && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-300">
                      About the Organizer
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center md:items-start">
                        <div className="relative mb-4">
                          {/* Note: You don't have logoUrl in your entity, consider adding it */}
                          <img
                            // src={organizer?.logoUrl || '/default-organizer-logo.png'}
                            src={'/default-organizer-logo.png'}
                            alt={organizer.organizationName}
                            className="w-24 h-24 rounded-xl object-cover border-2 border-white shadow-md"
                          />
                          {organizer.isVerified && (
                            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 text-center md:text-left">
                          {organizer.organizationName}
                        </h4>
                        {organizer.isVerified && (
                          <span className="inline-flex items-center gap-1 mt-1 text-sm text-blue-600 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            Verified Organizer
                          </span>
                        )}
                      </div>
                      
                      {/* Organizer Stats */}
                      <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {/* Rating */}
                          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-bold text-lg">{organizer.rating.toFixed(1)}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {organizer.reviewCount} reviews
                            </div>
                          </div>

                          {/* Events Organized */}
                          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Calendar className="w-4 h-4 text-[#1E3A5F]" />
                              <span className="font-bold text-lg">{organizer.totalEvents}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              events organized
                            </div>
                          </div>

                          {/* Participants Served */}
                          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Users className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-lg">{organizer.totalParticipants}+</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              participants served
                            </div>
                          </div>
                        </div>

                        {/* Organizer Description */}
                        {organizer.about && (
                          <p className="text-sm text-gray-600 mb-4">
                            {organizer.about}
                          </p>
                        )}

                        {/* Contact Info */}
                        <div className="text-sm space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Contact Person:</span>
                            <span className="font-medium">{organizer.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Phone:</span>
                            <a 
                              href={`tel:${organizer.phone}`}
                              className="text-[#1E3A5F] hover:underline font-medium"
                            >
                              {organizer.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Registration Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
                  {!isRegistered ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-[#1E3A5F]">${event.price}</div>
                        <div className="text-sm text-gray-600">per person</div>
                      </div>

                      <div className="text-center mb-6">
                        <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                          spotsLeft > 10 ? 'bg-green-100 text-green-800' :
                          spotsLeft > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully Booked'}
                        </div>
                      </div>

                      {spotsLeft > 0 && (
                        <>
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Number of Participants</label>
                            <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-3">
                              <button
                                onClick={() => setParticipantsCount(Math.max(1, participantsCount - 1))}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                disabled={participantsCount <= 1}
                              >
                                -
                              </button>
                              <span className="text-2xl font-bold mx-6">{participantsCount}</span>
                              <button
                                onClick={() => setParticipantsCount(Math.min(spotsLeft, participantsCount + 1))}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                disabled={participantsCount >= spotsLeft}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-600">Price per person</span>
                              <span className="font-medium">${event.price}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-600">Participants</span>
                              <span className="font-medium">{participantsCount} × ${event.price}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <div className="flex justify-between items-center font-bold text-lg text-[#1E3A5F]">
                                <span>Total Amount</span>
                                <span>${event.price * participantsCount}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleRegistration}
                            className="w-full bg-[#1E3A5F] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2a4a7a] transition-colors duration-200 shadow-md hover:shadow-lg"
                          >
                            Register Now
                          </button>

                          <p className="text-xs text-gray-500 text-center mt-4">
                            Secure payment • 24-hour cancellation policy
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">Registration Successful!</h3>
                      <p className="text-gray-600 mb-4">
                        You're all set for <span className="font-medium">{event.title}</span>
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-green-800">
                          Confirmation email has been sent to your registered email address.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/hiker-dashboard/my-bookings')}
                        className="text-[#1E3A5F] hover:underline font-medium"
                      >
                        View My Bookings →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;