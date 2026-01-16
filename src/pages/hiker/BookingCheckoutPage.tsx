import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, User, Mail, Phone, Globe, ShieldCheck } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getEventById, registerEvent } from '../../api/services/Event';
import { useAuth } from '../../context/AuthContext';
import { createStripeCheckoutSession } from '../../api/services/Payment';

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
  type: 'esewa' | 'stripe';
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

interface ParticipantDTO {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
}

interface EventRegisterDTO {
  eventId: number;
  userId: number;
  contactName: string;
  contact: string;
  email: string;
  participants: ParticipantDTO[];
  amount: number;
  method: 'ESEWA' |  'STRIPE';
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

  const { user } = useAuth(); // Get logged-in user
const [isSubmitting, setIsSubmitting] = useState(false);

const registerMutation = useMutation({
  mutationFn: registerEvent,
  onSuccess: (paymentRequest: any) => {
    // This is the EsewaPaymentRequest object returned from backend
    console.log('Registration successful, redirecting to eSewa with:', paymentRequest);
    handleEsewaRedirect(paymentRequest);
  },
  onError: (error: any) => {
    console.error('Registration failed:', error);
    alert(error.response?.data?.message || 'Payment initiation failed. Please try again.');
    setIsSubmitting(false);
  },
});


const handleEsewaRedirect = (paymentRequest: any) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

  // Use exact field names as expected by eSewa (snake_case)
  const fields: Record<string, string> = {
    amount: paymentRequest.amount,
    tax_amount: paymentRequest.tax_amount,
    total_amount: paymentRequest.total_amount,
    transaction_uuid: paymentRequest.transaction_uuid,
    product_code: paymentRequest.product_code,
    product_service_charge: paymentRequest.product_service_charge,
    product_delivery_charge: paymentRequest.product_delivery_charge,
    success_url: paymentRequest.success_url,
    failure_url: paymentRequest.failure_url,
    signed_field_names: paymentRequest.signed_field_names,
    signature: paymentRequest.signature,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  form.submit();
};

  
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'esewa' ,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});


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
  // if (!validateStep3()) return;

  if (!user?.id) {
    alert('You must be logged in to book an event.');
    navigate('/login');
    return;
  }

  setIsSubmitting(true);

  const totalAmount = eventInfo.price * participants.length;

  // Map participants to backend format
  const backendParticipants = participants.map(p => ({
    name: `${p.title} ${p.firstName} ${p.lastName}`.trim(),
    gender: p.title === 'Mrs' ? 'FEMALE' : 'MALE' as 'MALE' | 'FEMALE',
    nationality: p.nationality === 'Nepalese' ? 'Nepali' : 
                 p.nationality === 'Indian' ? 'Indian' : 'Other',
  }));

  const payload: EventRegisterDTO = {
    eventId: Number(eventId),
    userId: Number(user.id),
    contactName: billingInfo.contactName,
    contact: billingInfo.contactPhone.replace(/\D/g, ''), // Clean phone
    email: billingInfo.contactEmail,
    participants: backendParticipants,
    amount: totalAmount,
    method: paymentMethod.type === 'stripe' ? 'STRIPE' : 
            paymentMethod.type === 'esewa' ? 'ESEWA' : 'ESEWA',
  };

  try {
    if (paymentMethod.type === 'stripe') {
      // Handle Stripe Payment
      const stripeResponse = await createStripeCheckoutSession(payload);
      console.log('Stripe session created:', stripeResponse);
      
      // Redirect to Stripe Checkout
      window.location.href = stripeResponse.sessionUrl;
      
    } else if (paymentMethod.type === 'esewa') {
      // Handle eSewa Payment (existing code)
      registerMutation.mutate(payload);
    }
  } catch (error: any) {
    console.error('Payment initiation failed:', error);
    alert(error.response?.data?.error || 'Payment initiation failed. Please try again.');
    setIsSubmitting(false);
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
                        onClick={() => updatePaymentMethod('type', 'stripe')}
                        className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                          paymentMethod.type === 'stripe'
                            ? 'border-[#1E3A5F] bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="font-medium">Card</span>
                      </button>
                      
                     
                    </div>
                  </div>


                  {/* Payment Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Payment Instructions:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {paymentMethod.type === 'esewa' && (
                        <li>• Payment will be redirected to eSewa for secure processing</li>
                      )}
                      {paymentMethod.type === 'stripe' && (
                        <li>• Enter your card details for secure payment processing</li>
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
                      disabled={isSubmitting || registerMutation.isPending}
                      className={`px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center gap-2 ${
                        isSubmitting || registerMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting || registerMutation.isPending ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay NPR{totalAmount}
                        </>
                      )}
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
                      <span className="font-medium">NPR{eventInfo.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium">{participants.length} × NPR{eventInfo.price}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount</span>
                        <span className="text-[#1E3A5F]">NPR{totalAmount}</span>
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