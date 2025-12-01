import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, User, Mail, Phone, Globe, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getEventById } from '../../api/services/Event';

interface Participant {
  id: number;
  title: 'Mr' | 'Mrs' ;
  firstName: string;
  lastName: string;
  nationality: 'Nepalese' | 'Indian' | 'Foreigner';
}

interface BillingInfo {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

interface PaymentMethod {
  type: 'esewa' | 'card' | 'khalti' ;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

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
  // Add other fields from OrganizerRecord
}

interface EventInfo {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  durationDays: number;
  difficultyLevel: 'Easy' | 'Moderate' | 'Difficult' | 'Expert';
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
  organizer: OrganizerData; // Make sure this matches your API response
}

const BookingCheckoutPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const participantsCountFromState = location.state?.participantsCount || 1;
  const [participants, setParticipants] = useState<Participant[]>(() => {
    return Array.from({ length: participantsCountFromState }, (_, index) => ({
      id: index + 1,
      title: 'Mr' as const,
      firstName: '',
      lastName: '',
      nationality: 'Nepalese' as const,
    }));
  });

    const { data: eventInfo, isLoading } = useQuery<EventInfo>({
    queryKey: ['eventDetails', eventId],
    queryFn: () => getEventById(Number(eventId)),
    enabled: !!eventId, // Only run if eventId exists
  });

  
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'esewa'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock event data - replace with actual API call
//   const eventInfo: EventInfo = {
//     id: 1,
//     title: 'Sunrise Mountain Trek',
//     date: '2024-06-15',
//     price: 129,
//     organizer: 'TrekNepal Adventures',
//     bannerImageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
//   };

// Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state - event not found
  if (!eventInfo) {
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

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: participants.length + 1,
      title: 'Mr',
      firstName: '',
      lastName: '',
      nationality: 'Nepalese',
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const updateParticipant = (id: number, field: keyof Participant, value: any) => {
    setParticipants(participants.map(participant =>
      participant.id === id ? { ...participant, [field]: value } : participant
    ));
    // Clear error when user starts typing
    if (errors[`participant-${id}-${field}`]) {
      setErrors(prev => ({ ...prev, [`participant-${id}-${field}`]: '' }));
    }
  };

  const updateBillingInfo = (field: keyof BillingInfo, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updatePaymentMethod = (field: keyof PaymentMethod, value: any) => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    participants.forEach((participant, index) => {
      if (!participant.firstName.trim()) {
        newErrors[`participant-${participant.id}-firstName`] = `Participant ${index + 1}: First name is required`;
      }
      if (!participant.lastName.trim()) {
        newErrors[`participant-${participant.id}-lastName`] = `Participant ${index + 1}: Last name is required`;
      }
      
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!billingInfo.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    if (!billingInfo.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^[0-9]{10}$/.test(billingInfo.contactPhone.replace(/\D/g, ''))) {
      newErrors.contactPhone = 'Enter a valid 10-digit phone number';
    }
    if (!billingInfo.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(billingInfo.contactEmail)) {
      newErrors.contactEmail = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod.type === 'card') {
      if (!paymentMethod.cardNumber || paymentMethod.cardNumber.replace(/\D/g, '').length !== 16) {
        newErrors.cardNumber = 'Enter a valid 16-digit card number';
      }
      if (!paymentMethod.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
        newErrors.expiryDate = 'Enter expiry date in MM/YY format';
      }
      if (!paymentMethod.cvv || paymentMethod.cvv.length !== 3) {
        newErrors.cvv = 'Enter a valid 3-digit CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmitPayment = async () => {
    if (currentStep === 3 && validateStep3()) {
      // TODO: Integrate with payment gateway
      console.log('Payment submitted:', {
        eventId,
        participants,
        billingInfo,
        paymentMethod,
        totalAmount: eventInfo?.price * participants.length
      });

      // Simulate payment processing
      setTimeout(() => {
        alert('Payment successful! Booking confirmed.');
        navigate(`/hiker/booking-confirmation/${eventId}`);
      }, 2000);
    }
  };

  const totalAmount = eventInfo.price * participants.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/hiker-dashboard/event/${eventId}`)}
            className="flex items-center gap-2 text-[#1E3A5F] hover:text-[#2a4a7a] transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Event
          </button>
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Secure your spot for {eventInfo.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Checkout Steps */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === currentStep
                          ? 'bg-[#1E3A5F] text-white'
                          : step < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      <span className={`text-sm font-medium ${
                        step === currentStep ? 'text-[#1E3A5F]' : 'text-gray-600'
                      }`}>
                        {step === 1 ? 'Participants' : step === 2 ? 'Billing' : 'Payment'}
                      </span>
                      {step < 3 && (
                        <div className="w-12 h-0.5 bg-gray-300 ml-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 1: Participant Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1E3A5F]">Participant Details</h2>
                  <span className="text-sm text-gray-500">Required for all participants</span>
                </div>

                <div className="space-y-6">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900">Participant {index + 1}</h3>
                        {participants.length > 1 && (
                          <button
                            onClick={() => removeParticipant(participant.id)}
                            className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <select
                            value={participant.title}
                            onChange={(e) => updateParticipant(participant.id, 'title', e.target.value as Participant['title'])}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                          >
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            
                          </select>
                        </div>

                        {/* Nationality */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            Nationality
                          </label>
                          <select
                            value={participant.nationality}
                            onChange={(e) => updateParticipant(participant.id, 'nationality', e.target.value as Participant['nationality'])}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200"
                          >
                            <option value="Nepalese">Nepalese</option>
                            <option value="Indian">Indian</option>
                            <option value="Foreigner">Foreigner</option>
                          </select>
                        </div>

                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={participant.firstName}
                            onChange={(e) => updateParticipant(participant.id, 'firstName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                              errors[`participant-${participant.id}-firstName`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter first name"
                          />
                          {errors[`participant-${participant.id}-firstName`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`participant-${participant.id}-firstName`]}</p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={participant.lastName}
                            onChange={(e) => updateParticipant(participant.id, 'lastName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                              errors[`participant-${participant.id}-lastName`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter last name"
                          />
                          {errors[`participant-${participant.id}-lastName`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`participant-${participant.id}-lastName`]}</p>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addParticipant}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#1E3A5F] hover:text-[#1E3A5F] transition-colors duration-200"
                  >
                    + Add Another Participant
                  </button>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleNextStep}
                      className="px-8 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium"
                    >
                      Continue to Billing
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Billing Information */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1E3A5F]">Billing Information</h2>
                  <span className="text-sm text-gray-500">Contact details for booking confirmation</span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.contactName}
                        onChange={(e) => updateBillingInfo('contactName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                          errors.contactName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter contact person's name"
                      />
                      {errors.contactName && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                      )}
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        value={billingInfo.contactPhone}
                        onChange={(e) => updateBillingInfo('contactPhone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                          errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="98XXXXXXXX"
                      />
                      {errors.contactPhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                      )}
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        value={billingInfo.contactEmail}
                        onChange={(e) => updateBillingInfo('contactEmail', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                          errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.contactEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      ← Back to Participants
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-8 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors duration-200 font-medium"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1E3A5F]">Payment Method</h2>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <ShieldCheck className="w-4 h-4" />
                    Secure Payment
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => updatePaymentMethod('type', 'esewa')}
                        className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                          paymentMethod.type === 'esewa'
                            ? 'border-[#1E3A5F] bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Smartphone className="w-8 h-8 text-green-600 mb-2" />
                        <span className="font-medium">eSewa</span>
                      </button>
                      <button
                        onClick={() => updatePaymentMethod('type', 'card')}
                        className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                          paymentMethod.type === 'card'
                            ? 'border-[#1E3A5F] bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="font-medium">Card</span>
                      </button>
                      <button
                        onClick={() => updatePaymentMethod('type', 'khalti')}
                        className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                          paymentMethod.type === 'khalti'
                            ? 'border-[#1E3A5F] bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs mb-2">
                          KH
                        </div>
                        <span className="font-medium">Khalti</span>
                      </button>
                     
                    </div>
                  </div>

                  {/* Card Details (if card selected) */}
                  {paymentMethod.type === 'card' && (
                    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-4">Card Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            value={paymentMethod.cardNumber || ''}
                            onChange={(e) => updatePaymentMethod('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                              errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              value={paymentMethod.expiryDate || ''}
                              onChange={(e) => updatePaymentMethod('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                                errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              value={paymentMethod.cvv || ''}
                              onChange={(e) => updatePaymentMethod('cvv', e.target.value)}
                              placeholder="123"
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition-all duration-200 ${
                                errors.cvv ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Payment Instructions:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {paymentMethod.type === 'esewa' && (
                        <li>• Payment will be redirected to eSewa for secure processing</li>
                      )}
                      {paymentMethod.type === 'card' && (
                        <li>• Enter your card details for secure payment processing</li>
                      )}
                      {paymentMethod.type === 'khalti' && (
                        <li>• You will be redirected to Khalti for payment</li>
                      )}
                      
                      <li>• Booking confirmation will be sent to your email</li>
                      <li>• 24-hour cancellation policy applies</li>
                    </ul>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      ← Back to Billing
                    </button>
                    <button
                      onClick={handleSubmitPayment}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay ${totalAmount}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Event Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">Booking Summary</h3>
                  
                  <div className="flex gap-4 mb-6">
                    <img
                      src={eventInfo.bannerImageUrl}
                      alt={eventInfo.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{eventInfo.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{new Date(eventInfo.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Organizer: {eventInfo.organizer.organizationName}</p>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price per person</span>
                      <span className="font-medium">${eventInfo.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium">{participants.length} × ${eventInfo.price}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount</span>
                        <span className="text-[#1E3A5F]">${totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Participants List */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Participants ({participants.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {participants.map((participant) => (
                        <div key={participant.id} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              {participant.title} {participant.firstName} {participant.lastName}
                            </span>
                          </div>
                          <div className="text-gray-500">
                            {participant.nationality}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Secure SSL Encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckoutPage;