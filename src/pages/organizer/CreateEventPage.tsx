import { useState } from 'react';

interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: 'Easy' | 'Moderate' | 'Hard' | 'Extreme';
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
const CreateEventPage = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    date: '',
    durationDays: 1,
    difficultyLevel: 'Moderate',
    price: 0,
    maxParticipants: 10,
    bannerImageUrl: '',
    meetingPoint: '',
    meetingTime: '',
    contactPerson: '',
    contactEmail: '',
    includedServices: [''],
    requirements: ['']
  });

  const [currentService, setCurrentService] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationDays' || name === 'price' || name === 'maxParticipants' 
        ? Number(value) 
        : value
    }));
  };

  const addIncludedService = () => {
    if (currentService.trim()) {
      setFormData(prev => ({
        ...prev,
        includedServices: [...prev.includedServices, currentService.trim()]
      }));
      setCurrentService('');
    }
  };

  const removeIncludedService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Event created:', formData);
    alert('Event created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Create New Event</h1>
          <p className="text-gray-600">Organize your next hiking adventure</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-8">
            {/* Basic Information Section */}
            <section>
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                    placeholder="Enter event title"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe your event in detail"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                    placeholder="Where is the event?"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Difficult">Difficult</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Pricing & Capacity Section */}
            <section>
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-200">
                Pricing & Capacity
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Person ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Participants *
                  </label>
                  <input
                    type="text"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </section>

            {/* Meeting Information Section */}
            <section>
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-200">
                Meeting Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meeting Point */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Point *
                  </label>
                  <input
                    type="text"
                    name="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                    placeholder="Where will participants meet?"
                  />
                </div>

                {/* Meeting Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Time *
                  </label>
                  <input
                    type="time"
                    name="meetingTime"
                    value={formData.meetingTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </section>

            {/* Contact Information Section */}
            <section>
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-200">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                    placeholder="Who should participants contact?"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </section>

            {/* Media Section */}
            <section>
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-200">
                Media
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  name="bannerImageUrl"
                  value={formData.bannerImageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.bannerImageUrl && (
                  <div className="mt-3">
                    <img 
                      src={formData.bannerImageUrl} 
                      alt="Banner preview" 
                      className="h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Included Services Section */}
            <section>
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-200">
                Included Services
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentService}
                    onChange={(e) => setCurrentService(e.target.value)}
                    placeholder="Add a service (e.g., Professional Guide, Equipment)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={addIncludedService}
                    className="px-6 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                
                {/* Services List */}
                <div className="space-y-2">
                  {formData.includedServices.map((service, index) => (
                    service && (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="text-gray-700">{service}</span>
                        <button
                          type="button"
                          onClick={() => removeIncludedService(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>

            {/* Requirements Section */}
            <section>
              <h2 className="text-xl font-semibold text-[#1E3A5F] mb-4 pb-2 border-b border-gray-200">
                Participant Requirements
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    placeholder="Add a requirement (e.g., Hiking boots, Water bottle)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-6 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                
                {/* Requirements List */}
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    requirement && (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="text-gray-700">{requirement}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="px-8 py-4 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium text-lg"
              >
                Create Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage