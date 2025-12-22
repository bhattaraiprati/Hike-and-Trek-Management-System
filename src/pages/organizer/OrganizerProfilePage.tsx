// pages/organizer/OrganizerProfilePage.tsx
import { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Edit, Save, X, Camera, Award,
  Briefcase, Globe, Link as LinkIcon, Shield,
  FileText, BarChart,  TrendingUp,
  CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

import { SuccesfulMessageToast, ErrorMessageToast } from '../../utils/Toastify.util';
import {
  getOrganizerProfile,
  updateOrganizerProfile,
  type OrganizerProfile,
} from "../../api/services/Profile";

const OrganizerProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"profile" | "password" | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileData, setProfileData] = useState<OrganizerProfile | null>(null);

  // Fetch organizer profile
  const { data: organizerProfile, isLoading } = useQuery({
    queryKey: ['organizerProfile', user?.id],
    queryFn: () => getOrganizerProfile(Number(user?.id || 0)),
    enabled: !!user?.id,
  });

  // Helper to upload a single image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Trek Sathi");
    formData.append("cloud_name", "dtwunctra");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dtwunctra/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await res.json();
    return data.secure_url || data.url;
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<OrganizerProfile>) => 
      updateOrganizerProfile(Number(user?.id || 0), data),
    onSuccess: () => {
      SuccesfulMessageToast('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['organizerProfile', user?.id] });
      setIsEditing(false);
      setEditMode(null);
    },
    onError: () => {
      ErrorMessageToast('Failed to update profile');
    },
  });

  useEffect(() => {
    if (organizerProfile) {
      setProfileData(organizerProfile);
    }
  }, [organizerProfile]);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleBannerImageClick = () => {
    bannerFileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file || !profileData) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === 'profile') {
      setProfileImage(file);
      setProfileData({
        ...profileData,
        profileImage: previewUrl,
      });
    } else {
      setBannerImage(file);
      setProfileData({
        ...profileData,
        bannerImage: previewUrl,
      });
    }
  };

  const handleInputChange = (field: keyof OrganizerProfile, value: any) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        [field]: value
      });
    }
  };

  const handleSpecializationChange = (index: number, value: string) => {
    if (profileData) {
      const newSpecialization = [...profileData.specialization];
      newSpecialization[index] = value;
      setProfileData({
        ...profileData,
        specialization: newSpecialization
      });
    }
  };

  const addSpecialization = () => {
    if (profileData) {
      setProfileData({
        ...profileData,
        specialization: [...profileData.specialization, '']
      });
    }
  };

  const removeSpecialization = (index: number) => {
    if (profileData) {
      const newSpecialization = profileData.specialization.filter((_, i) => i !== index);
      setProfileData({
        ...profileData,
        specialization: newSpecialization
      });
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    try {
      let profileImageUrl = profileData.profileImage;
      let bannerImageUrl = profileData.bannerImage;

      // Upload selected images (if any) to Cloudinary first
      if (profileImage) {
        profileImageUrl = await uploadImageToCloudinary(profileImage);
      }
      if (bannerImage) {
        bannerImageUrl = await uploadImageToCloudinary(bannerImage);
      }

      updateProfileMutation.mutate({
        ...profileData,
        profileImage: profileImageUrl,
        bannerImage: bannerImageUrl,
      });
    } catch (error) {
      ErrorMessageToast('Failed to upload images');
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Verified Organizer'
        };
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-4 h-4" />,
          text: 'Verification Pending'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Not Verified'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            {/* Banner skeleton */}
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            
            {/* Profile skeleton */}
            <div className="relative">
              <div className="absolute -top-16 left-8 w-32 h-32 bg-gray-300 rounded-full border-8 border-white"></div>
              <div className="pt-20 pl-8">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const verification = getVerificationBadge(profileData?.verificationStatus || 'UNVERIFIED');

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a] rounded-2xl overflow-hidden mb-20 md:mb-24">
          {profileData?.bannerImage ? (
            <img
              src={profileData.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a]" />
          )}
          
          {/* Banner upload overlay */}
          {isEditing && (
            <button
              onClick={handleBannerImageClick}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
            >
              <div className="bg-white bg-opacity-90 p-3 rounded-full">
                <Camera className="w-6 h-6 text-[#1E3A5F]" />
              </div>
              <input
                ref={bannerFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'banner')}
                className="hidden"
              />
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="relative flex flex-col md:flex-row px-4 md:px-8">
          {/* Profile Image */}
          <div className="absolute -top-20 md:-top-34 left-4 md:left-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#1E3A5F] to-[#2a4a7a] rounded-full border-8 border-white overflow-hidden">
                {profileData?.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt={profileData?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              
              {/* Profile image upload */}
              {isEditing && (
                <button
                  onClick={handleProfileImageClick}
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-5 h-5 text-[#1E3A5F]" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profile')}
                    className="hidden"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-10 md:pt-0 pl-0 md:pl-48">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {profileData?.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${verification.color}`}>
                    {verification.icon}
                    {verification.text}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{profileData?.experienceYears}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData?.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {profileData?.memberSince ? new Date(profileData.memberSince).getFullYear() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditMode(null);
                        setProfileData(organizerProfile || null);
                        setProfileImage(null);
                        setBannerImage(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 px-4 md:px-8">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About Me
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#1E3A5F] hover:text-[#2a4a7a] flex items-center gap-1 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData?.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent resize-none"
                      placeholder="Tell us about yourself and your experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <div className="space-y-2">
                      {profileData?.specialization.map((spec, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={spec}
                            onChange={(e) => handleSpecializationChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                            placeholder="Add a specialization"
                          />
                          {profileData.specialization.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSpecialization(index)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSpecialization}
                        className="text-[#1E3A5F] hover:text-[#2a4a7a] text-sm flex items-center gap-1"
                      >
                        + Add another specialization
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {profileData?.bio ? (
                    <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio added yet</p>
                  )}
                  
                  {profileData?.specialization && profileData.specialization.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Specialization</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-50 text-[#1E3A5F] rounded-full text-sm font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4" />
                      {profileData?.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4" />
                      {profileData?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData?.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  ) : profileData?.website ? (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#1E3A5F] hover:text-[#2a4a7a] hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      {profileData.website}
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">No website added</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links (if editing) */}
            {isEditing && profileData?.socialLinks && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Social Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={url || ''}
                        onChange={(e) => handleInputChange('socialLinks', {
                          ...profileData.socialLinks,
                          [platform]: e.target.value
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                        placeholder={`https://${platform}.com/username`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Quick Info */}
          <div className="space-y-8">

              {/* Verification Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification
              </h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${verification.color} flex items-center gap-3`}>
                  {verification.icon}
                  <div>
                    <div className="font-medium">{verification.text}</div>
                    <div className="text-sm opacity-90 mt-1">
                    {profileData?.verificationStatus === 'SUCCESS' 
                        ? 'Your account is verified and trusted'
                        : profileData?.verificationStatus === 'PENDING'
                        ? 'Verification under review'
                        : 'Complete profile to get verified'}
                    </div>
                  </div>
                </div>
                
                {profileData?.verificationStatus !== 'SUCCESS' && (
                  <button className="w-full px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Request Verification
                  </button>
                )}
              </div>
            </div>



            {/* Stats Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Statistics
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#1E3A5F]">
                      {profileData?.totalEvents || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Events</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {profileData?.completedEvents || 0}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {profileData?.totalParticipants || 0}
                    </div>
                    <div className="text-sm text-gray-600">Participants</div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-baseline gap-1">
                      <div className="text-2xl font-bold text-yellow-600">
                        {profileData?.averageRating || 0}
                      </div>
                      <div className="text-sm text-yellow-500">/5.0</div>
                    </div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Quick Info */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Organizer Info
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{profileData?.experienceYears} years</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Upcoming Events</span>
                  <span className="font-medium text-green-600">{profileData?.upcomingEvents || 0}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Repeat Clients</span>
                  <span className="font-medium text-purple-600">{profileData?.stats?.repeatClients || 0}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-[#1E3A5F]">${profileData?.stats?.totalRevenue?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div> */}

            {/* Social Links Display (non-editing mode) */}
            {!isEditing && profileData?.socialLinks && Object.values(profileData.socialLinks).some(Boolean) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Social Profiles
                </h2>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(profileData.socialLinks)
                    .filter(([_, url]) => url)
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          {platform === 'facebook' && (
                            <span className="text-blue-600">f</span>
                          )}
                          {platform === 'instagram' && (
                            <span className="text-pink-600">ig</span>
                          )}
                          {platform === 'twitter' && (
                            <span className="text-blue-400">𝕏</span>
                          )}
                          {platform === 'linkedin' && (
                            <span className="text-blue-700">in</span>
                          )}
                        </div>
                        <span className="text-sm font-medium capitalize">{platform}</span>
                      </a>
                    ))}
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfilePage;