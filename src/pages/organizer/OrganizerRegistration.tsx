// components/Registration/OrganizerRegistration.tsx
import React, { useState } from 'react';

const OrganizerRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    organizationName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    description: ''
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!documentFile) newErrors.document = 'Verification document is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length > 250) newErrors.description = 'Description must be less than 250 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else {
      if (validateStep2()) {
        console.log('Registration submitted:', { ...formData, documentFile });
        // Show success message
        alert('Registration submitted successfully! We will review your application shortly.');
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
            {/* Left Column - Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Header */}
              <div className="text-center lg:text-left mb-8">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Hiking & Trek Event Portal</h1>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Organizer Registration</h2>
                <p className="text-gray-600">Join our community of trusted outdoor adventure organizers</p>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Step {currentStep} of 2</span>
                  <span className="text-sm text-gray-500">{currentStep === 1 ? 'Basic Information' : 'Organization Details'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentStep * 50}%` }}
                  ></div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 ? (
                  /* Step 1: Basic Information */
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Full Name / Contact Person
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.fullName 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Organization Name
                      </label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.organizationName 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="Enter your organization name"
                      />
                      {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.email 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.password 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="Create a strong password"
                      />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                  </div>
                ) : (
                  /* Step 2: Organization Details */
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.phoneNumber 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Address / Location
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.address 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="Enter your organization address"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Upload Verification Document
                      </label>
                      <div 
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                          errors.document 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                        }`}
                      >
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          id="document-upload"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="document-upload" className="cursor-pointer">
                          <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-600">
                            {documentFile ? documentFile.name : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG, PNG (Max. 10MB)</p>
                        </label>
                      </div>
                      {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Short Description / About Organization
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                          errors.description 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="Tell us about your organization and experience with outdoor events..."
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        {errors.description && <span className="text-red-500">{errors.description}</span>}
                        <span>{formData.description.length}/250 characters</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex space-x-4 pt-4">
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {currentStep === 1 ? 'Continue' : 'Register as Organizer'}
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <a href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors duration-300">
                    Login here
                  </a>
                </p>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="hidden lg:block relative bg-gradient-to-br from-green-600 to-emerald-800">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80")'
                }}
              ></div>
              <div className="relative z-10 h-full flex items-center justify-center p-12">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Join Our Trusted Organizer Network</h3>
                  <p className="text-white/80 leading-relaxed">
                    Connect with thousands of outdoor enthusiasts and create unforgettable hiking experiences. 
                    Your journey to becoming a certified organizer starts here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegistration;