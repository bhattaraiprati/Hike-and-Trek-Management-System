import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import OTPVerificationPopup from '../../components/auth/OTPVerificationPopup';
import { Loader2, Mail, Upload, X } from 'lucide-react';
import { registerOrganizer, resendOTP, verifyOTP } from '../../api/services/authApi';

interface OrganizerFormData {
  fullName: string;
  organizationName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  documentUrl: string;
  about: string;
}

const OrganizerRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
   const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<OrganizerFormData>({
    fullName: '',
    organizationName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    documentUrl: '',
    about: ''
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // OTP Flow States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // API Mutations
  const registerMutation = useMutation<unknown, any, OrganizerFormData>({
    mutationFn: registerOrganizer,
    onSuccess: () => {
      setShowConfirmModal(false);
      setShowOTPModal(true);
    },
    onError: (error: any) => {
      setShowConfirmModal(false);
      if (error.response?.status === 409) {
        setErrors({ email: 'User with this email already exists' });
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    }
  });

  const verifyOTPMutation = useMutation<unknown, any, { email: string; otp: string }>({
    mutationFn: verifyOTP,
    onSuccess: () => {
      setRegistrationSuccess(true);
      setShowOTPModal(false);
      // Show success message
      alert('Registration completed successfully! Your account is pending approval.');
    },
    onError: (error: any) => {
      console.log(error)
      // Error will be handled in OTPVerificationPopup
    }
  });

  const resendOTPMutation = useMutation<unknown, any, { email: string }>({
    mutationFn: resendOTP,
    onError: (error: any) => {
      console.log(error)
      // Error will be handled in OTPVerificationPopup
    }
  });

  const removeDocument = () => {
    setDocumentFile(null);
    setFormData(prev => ({
      ...prev,
      document_url: ''
    }));
    // Clear the file input
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, document: 'Please upload a valid file (PDF, DOC, DOCX, JPG, PNG)' }));
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, document: 'File size must be less than 10MB' }));
        return;
      }

      setDocumentFile(file);
      setIsUploading(true);
      
      try {
        // Auto-upload file and set URL
        const documentUrl = await handleImageUpload(file, 'document');
        if (documentUrl) {
          setFormData(prev => ({
            ...prev,
            documentUrl: documentUrl
          }));
          // Clear any previous document errors
          setErrors(prev => ({ ...prev, document: '' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, document: 'Failed to upload document' }));
      } finally {
        setIsUploading(false);
      }
    }
  };


  const handleImageUpload = async (file: File, type: string) => {
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
      const result = await response.json();

      // Update the corresponding image path in the form state
      if (type === "document") {
        setFormData((prev) => ({
          ...prev,
          document_url: result.url,
        }));
      }

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors(prev => ({ ...prev, document: 'Failed to upload document' }));
      return null;
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
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.documentUrl) newErrors.document = 'Verification document is required';
    if (!formData.about.trim()) newErrors.about = 'Description is required';
    else if (formData.about.length > 250) newErrors.about = 'Description must be less than 250 characters';

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
        // Show confirmation modal instead of directly submitting
        setShowConfirmModal(true);
      }
    }
  };

  const sentOTP = () => {
    // Submit registration data which will trigger OTP sending
    registerMutation.mutate(formData);
  };

  const handleVerifyOTP = (otp: string) => {
    verifyOTPMutation.mutate({
      email: formData.email,
      otp: otp
    });
  };

  const handleResendOTP = () => {
    resendOTPMutation.mutate({
      email: formData.email
    });
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your organizer account has been created and is pending approval. 
            We'll notify you once your account is verified.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.phone 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="+977 "
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Upload Verification Document
              </label>
              
              {!documentFile ? (
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
                    disabled={isUploading}
                  />
                  <label htmlFor="document-upload" className="cursor-pointer block">
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
                        <p className="text-sm text-gray-600">Uploading document...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload verification document
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max. 10MB)</p>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {documentFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(documentFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={formData.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        onClick={removeDocument}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {formData.documentUrl && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Document uploaded successfully
                    </p>
                  )}
                </div>
              )}
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
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                          errors.about 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                        }`}
                        placeholder="Tell us about your organization and experience with outdoor events..."
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        {errors.about && <span className="text-red-500">{errors.about}</span>}
                        <span>{formData.about.length}/250 characters</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
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
                  <a href="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors duration-300">
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#2C5F8D] rounded-2xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Confirm Email</h2>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 mb-2">
              We will send a 6-digit OTP to:
            </p>
            <p className="text-[#1B4332] font-medium text-lg mb-6">
              {formData.email}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={sentOTP}
                disabled={registerMutation.status === 'pending'}
                className="flex-1 py-3 bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {registerMutation.status === 'pending' ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <OTPVerificationPopup
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={formData.email}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        isVerifying={verifyOTPMutation.status === 'pending'}
        isResending={resendOTPMutation.status === 'pending'}
        resendSuccess={resendOTPMutation.status === 'success'}
        error={verifyOTPMutation.error?.response?.data?.message || resendOTPMutation.error?.response?.data?.message}
      />
    </div>
  );
};

export default OrganizerRegistration;