import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: 'Easy' | 'Moderate' | 'Difficult' | 'Expert';
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  bannerImageUrl: string;
  meetingPoint: string;
  meetingTime: string;
  contactPerson: string;
  contactEmail: string;
  includedServices: string[];
  requirements: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  registeredParticipants: {
    id: string;
    name: string;
    email: string;
    registeredAt: string;
  }[];
}

const OrganizerEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Sunrise Mountain Trek',
      description: 'Experience the breathtaking sunrise from the peak of Mount Serenity.',
      location: 'Mount Serenity, Alpine Range',
      date: '2024-06-15',
      durationDays: 2,
      difficultyLevel: 'Moderate',
      price: 129,
      maxParticipants: 20,
      currentParticipants: 15,
      bannerImageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      meetingPoint: 'Alpine Base Camp Parking Lot',
      meetingTime: '05:30 AM',
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah@alpineadventures.com',
      includedServices: ['Professional Guide', 'Safety Equipment', 'First Aid Kit'],
      requirements: ['Hiking boots', 'Waterproof jacket', '2L water minimum'],
      status: 'published',
      createdAt: '2024-01-15',
      registeredParticipants: [
        { id: '1', name: 'John Doe', email: 'john@example.com', registeredAt: '2024-01-20' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', registeredAt: '2024-01-22' }
      ]
    },
    {
      id: '2',
      title: 'Forest Valley Exploration',
      description: 'Discover hidden waterfalls and ancient forests in this guided tour.',
      location: 'Green Valley National Park',
      date: '2024-07-20',
      durationDays: 1,
      difficultyLevel: 'Easy',
      price: 79,
      maxParticipants: 15,
      currentParticipants: 8,
      bannerImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      meetingPoint: 'National Park Visitor Center',
      meetingTime: '08:00 AM',
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah@alpineadventures.com',
      includedServices: ['Professional Guide', 'Lunch', 'Photography'],
      requirements: ['Comfortable shoes', 'Camera', 'Water bottle'],
      status: 'published',
      createdAt: '2024-02-01',
      registeredParticipants: [
        { id: '1', name: 'Mike Wilson', email: 'mike@example.com', registeredAt: '2024-02-05' }
      ]
    },
    {
      id: '3',
      title: 'Advanced Rock Climbing',
      description: 'Challenging rock climbing experience for advanced adventurers.',
      location: 'Granite Peak',
      date: '2024-08-10',
      durationDays: 3,
      difficultyLevel: 'Expert',
      price: 299,
      maxParticipants: 8,
      currentParticipants: 3,
      bannerImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      meetingPoint: 'Climbing Gear Shop',
      meetingTime: '06:00 AM',
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah@alpineadventures.com',
      includedServices: ['Expert Guide', 'All Equipment', 'Accommodation', 'Meals'],
      requirements: ['Climbing experience', 'Physical fitness certificate', 'ID proof'],
      status: 'draft',
      createdAt: '2024-02-10',
      registeredParticipants: []
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'cancelled' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Difficult': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const duplicateEvent = (event: Event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copy)`,
      status: 'draft' as const,
      createdAt: new Date().toISOString().split('T')[0],
      currentParticipants: 0,
      registeredParticipants: []
    };
    setEvents([newEvent, ...events]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A5F]">My Events</h1>
              <p className="text-gray-600 mt-2">Manage and track your hiking events</p>
            </div>
            <button className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium">
              Create New Event
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-[#1E3A5F]">{events.length}</div>
              <div className="text-gray-600 text-sm">Total Events</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'published').length}
              </div>
              <div className="text-gray-600 text-sm">Active</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {events.reduce((sum, event) => sum + event.currentParticipants, 0)}
              </div>
              <div className="text-gray-600 text-sm">Total Participants</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                ${events.reduce((sum, event) => sum + (event.price * event.currentParticipants), 0)}
              </div>
              <div className="text-gray-600 text-sm">Total Revenue</div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* Search */}
              <div className="flex-1 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                />
              </div>

              {/* Filters and View Toggle */}
              <div className="flex gap-4 items-center">
                {/* Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                >
                  <option value="all">All Events</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>

                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 ${view === 'grid' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 ${view === 'list' ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Event Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={event.bannerImageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Event Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-[#1E3A5F] line-clamp-1">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium text-right">{event.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Participants:</span>
                      <span className="font-medium">{event.currentParticipants}/{event.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium text-[#1E3A5F]">${event.price}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event.difficultyLevel)}`}>
                      {event.difficultyLevel}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="text-[#1E3A5F] hover:text-[#2a4a7a] transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => duplicateEvent(event)}
                        className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={event.bannerImageUrl} 
                          alt={event.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="font-medium text-[#1E3A5F]">{event.title}</div>
                          <div className="text-sm text-gray-500">${event.price} • {event.difficultyLevel}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{event.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.currentParticipants}/{event.maxParticipants}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#1E3A5F] h-2 rounded-full" 
                          style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-[#1E3A5F] hover:text-[#2a4a7a] transition-colors duration-200">
                          Edit
                        </button>
                        <button 
                          onClick={() => setSelectedEvent(event)}
                          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first event.</p>
            <button className="bg-[#1E3A5F] text-white px-6 py-2 rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200">
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[#1E3A5F]">{selectedEvent.title}</h2>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Event Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                          {selectedEvent.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-right">{selectedEvent.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedEvent.difficultyLevel)}`}>
                          {selectedEvent.difficultyLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-[#1E3A5F]">${selectedEvent.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Participants ({selectedEvent.registeredParticipants.length})</h3>
                    <div className="space-y-2">
                      {selectedEvent.registeredParticipants.map((participant) => (
                        <div key={participant.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-sm text-gray-500">{participant.email}</div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(participant.registeredAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {selectedEvent.registeredParticipants.length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                          No participants yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Stats */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-white border border-gray-300 rounded-lg p-3 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                        Edit Event
                      </button>
                      <button className="bg-white border border-gray-300 rounded-lg p-3 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                        View Analytics
                      </button>
                      <button className="bg-white border border-gray-300 rounded-lg p-3 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                        Send Email
                      </button>
                      <button className="bg-white border border-gray-300 rounded-lg p-3 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                        Export List
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#1E3A5F] mb-3">Event Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration Rate:</span>
                        <span className="font-medium">
                          {((selectedEvent.currentParticipants / selectedEvent.maxParticipants) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-medium text-[#1E3A5F]">
                          ${selectedEvent.price * selectedEvent.currentParticipants}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spots Available:</span>
                        <span className="font-medium">
                          {selectedEvent.maxParticipants - selectedEvent.currentParticipants}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerEventsPage;