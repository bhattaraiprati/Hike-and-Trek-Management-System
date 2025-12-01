import { useState } from 'react';

interface EventData {
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: 'Easy' | 'Moderate' | 'Difficult' | 'Expert';
  price: number;
  maxParticipants: number;
  bannerImageUrl: string;
  meetingPoint: string;
  meetingTime: string;
  contactPerson: string;
  contactEmail: string;
  includedServices: string[];
  requirements: string[];
}
const EventRegistration = () => {
   const [isRegistered, setIsRegistered] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(1);

  const eventData: EventData = {
    title: "Sunrise Mountain Trek",
    description: "Experience the breathtaking sunrise from the peak of Mount Serenity. This guided trek takes you through lush forests, rocky terrain, and offers panoramic views of the valley below.",
    location: "Mount Serenity, Alpine Range",
    date: "2024-06-15",
    durationDays: 2,
    difficultyLevel: "Moderate",
    price: 129,
    maxParticipants: 20,
    bannerImageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    meetingPoint: "Alpine Base Camp Parking Lot",
    meetingTime: "05:30 AM",
    contactPerson: "Sarah Johnson",
    contactEmail: "sarah@alpineadventures.com",
    includedServices: [
      "Professional Guide",
      "Safety Equipment",
      "First Aid Kit",
      "Snacks & Water",
      "Photography Service",
      "Certificate of Completion"
    ],
    requirements: [
      "Hiking boots",
      "Waterproof jacket",
      "2L water minimum",
      "Day backpack",
      "Physical fitness certificate",
      "ID proof"
    ]
  };

  const handleRegistration = () => {
    setIsRegistered(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Adventure Awaits</h1>
          <p className="text-gray-600">Register for your next hiking adventure</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Banner Image */}
          <div className="h-64 bg-gray-200 overflow-hidden">
            <img 
              src={eventData.bannerImageUrl} 
              alt={eventData.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            {/* Event Title and Basic Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                {eventData.title}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {eventData.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Location:</span>
                  {eventData.location}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Date:</span>
                  {new Date(eventData.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Duration:</span>
                  {eventData.durationDays} days
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    eventData.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                    eventData.difficultyLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    eventData.difficultyLevel === 'Difficult' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {eventData.difficultyLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Details */}
              <div className="space-y-6">
                {/* Meeting Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Meeting Information</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Meeting Point:</span>
                      <span className="font-medium">{eventData.meetingPoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meeting Time:</span>
                      <span className="font-medium">{eventData.meetingTime}</span>
                    </div>
                  </div>
                </div>

                {/* Included Services */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Included Services</h3>
                  <ul className="space-y-2">
                    {eventData.includedServices.map((service, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-[#1E3A5F] rounded-full mr-3"></div>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {eventData.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-[#1E3A5F] rounded-full mr-3"></div>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Contact</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Contact Person:</span>
                      <span className="font-medium">{eventData.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium text-[#1E3A5F]">{eventData.contactEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Registration */}
              <div className="bg-gray-50 rounded-xl p-6">
                {!isRegistered ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#1E3A5F] mb-2">
                        ${eventData.price}
                      </div>
                      <div className="text-sm text-gray-600">per person</div>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                      {eventData.maxParticipants - participantsCount} spots remaining
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Participants
                        </label>
                        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
                          <button
                            onClick={() => setParticipantsCount(Math.max(1, participantsCount - 1))}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="font-medium text-lg">{participantsCount}</span>
                          <button
                            onClick={() => setParticipantsCount(Math.min(eventData.maxParticipants, participantsCount + 1))}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Participants</span>
                          <span className="font-medium">{participantsCount} x ${eventData.price}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg text-[#1E3A5F]">
                          <span>Total</span>
                          <span>${eventData.price * participantsCount}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleRegistration}
                        className="w-full bg-[#1E3A5F] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2a4a7a] transition-colors duration-200"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Registration Successful!</h3>
                    <p className="text-gray-600 mb-4">
                      You have successfully registered for {eventData.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Confirmation email has been sent to your registered email address.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventRegistration