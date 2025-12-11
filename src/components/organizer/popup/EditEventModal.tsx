import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  
  Clock, 
 
  AlertCircle,
  Trash2,
  Plus,
  Mail,
  User,
  Users,
  DollarSign,
  Image
} from 'lucide-react';
import type { Event } from '../../../types/eventTypes';

// Update the Event interface to match your API


export interface EditEventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: Event) => void;
}

const EditEventModal = ({ event, isOpen, onClose, onSave}: EditEventModalProps) => {
  const [formData, setFormData] = useState<Event>(event);
  const [currentService, setCurrentService] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(event);
    setErrors({});
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationDays' || name === 'price' || name === 'maxParticipants' 
        ? Number(value) 
        : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (formData.durationDays < 1) newErrors.durationDays = 'Duration must be at least 1 day';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (formData.maxParticipants < 1) newErrors.maxParticipants = 'Must have at least 1 participant';
    if (formData.maxParticipants < (formData.currentParticipants || 0)) {
      newErrors.maxParticipants = `Cannot be less than current participants (${formData.currentParticipants || 0})`;
    }
    if (!formData.meetingPoint.trim()) newErrors.meetingPoint = 'Meeting point is required';
    if (!formData.meetingTime) newErrors.meetingTime = 'Meeting time is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Valid email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A5F]">Edit Event</h2>
              <p className="text-gray-600 mt-1">Update your event details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 resize-none ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your event in detail"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData?.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Where is the event?"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData?.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    value={formData?.durationDays}
                    onChange={handleInputChange}
                    min="1"
                    max="30"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.durationDays ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.durationDays && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.durationDays}
                    </p>
                  )}
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficultyLevel"
                    value={formData?.difficultyLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="DIFFICULT">Difficult</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>
            </section>

           {/* Pricing & Capacity */}
            <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing & Capacity
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Person ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData?.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Maximum Participants *
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData?.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.maxParticipants ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.maxParticipants && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.maxParticipants}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Current participants: {formData?.currentParticipants}
                  </p>
                </div>
              </div>
            </section>

            {/* Meeting Information */}
            <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Meeting Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meeting Point */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Point *
                  </label>
                  <input
                    type="text"
                    name="meetingPoint"
                    value={formData?.meetingPoint}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.meetingPoint ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Where will participants meet?"
                  />
                  {errors.meetingPoint && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.meetingPoint}
                    </p>
                  )}
                </div>

                {/* Meeting Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Time *
                  </label>
                  <input
                    type="time"
                    name="meetingTime"
                    value={formData?.meetingTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.meetingTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.meetingTime && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.meetingTime}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData?.contactPerson}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.contactPerson ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Who should participants contact?"
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData?.contactEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                      errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="contact@example.com"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.contactEmail}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Media */}
            <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Media
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  name="bannerImageUrl"
                  value={formData?.bannerImageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                />
                {formData?.bannerImageUrl && (
                  <div className="mt-3">
                    <img 
                      src={formData?.bannerImageUrl} 
                      alt="Banner preview" 
                      className="h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Included Services */}
            <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">
                Included Services
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentService}
                    onChange={(e) => setCurrentService(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addIncludedService)}
                    placeholder="Add a service (e.g., Professional Guide, Equipment)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={addIncludedService}
                    className="px-4 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium flex items-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Services List */}
                <div className="space-y-2">
                  {formData?.includedServices.map((service, index) => (
                    service && (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="text-gray-700">{service}</span>
                        <button
                          type="button"
                          onClick={() => removeIncludedService(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">
                Participant Requirements
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addRequirement)}
                    placeholder="Add a requirement (e.g., Hiking boots, Water bottle)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium flex items-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Requirements List */}
                <div className="space-y-2">
                  {formData?.requirements.map((requirement, index) => (
                    requirement && (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="text-gray-700">{requirement}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>
            
            {/* Status */}
            {/* <section>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">
                Event Status
              </h3>
              <select
                name="status"
                value={formData?.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </section> */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;