import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createEvent } from '../../api/services/Event';
import { SuccesfulMessageToast } from '../../utils/Toastify.util';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';

interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    date: '',
    durationDays: 1,
    difficultyLevel: 'MODERATE',
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Cloudinary upload function
  const handleImageUpload = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Trek Sathi");
    data.append("cloud_name", "dtwunctra");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtwunctra/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error('Failed to upload image');
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, bannerImageUrl: '' }));
  };

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      SuccesfulMessageToast('Event created successfully!');
      navigate('/dashboard/events');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to create event';
      alert(`Error: ${message}`);
    },
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      let bannerImageUrl = formData.bannerImageUrl;

      // Upload image to Cloudinary if a new image is selected
      if (selectedImage) {
        bannerImageUrl = await handleImageUpload(selectedImage);
      }

      // Create event with the uploaded image URL
      const eventData = {
        ...formData,
        bannerImageUrl
      };

      mutation.mutate(eventData);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
                    <option value="EASY">Easy</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="DIFFICULT">Difficult</option>
                    <option value="EXTREME">Extreme</option>
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
                    type="number"
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
                  Banner Image
                </label>
                
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1E3A5F] transition-colors duration-200">
                  {!imagePreview ? (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mb-4">PNG, JPG, JPEG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="bannerImage"
                      />
                      <label
                        htmlFor="bannerImage"
                        className="inline-block px-6 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 cursor-pointer"
                      >
                        Choose Image
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Banner preview" 
                        className="h-48 object-cover rounded-lg border border-gray-300 mx-auto"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Existing URL input (optional) */}
                {/* <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    name="bannerImageUrl"
                    value={formData.bannerImageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div> */}
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
                disabled={isUploading || mutation.isPending}
                className="px-8 py-4 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading Image...
                  </>
                ) : mutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;