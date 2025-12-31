import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { verifyStripePayment } from '../../api/services/Payment';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationId, setRegistrationId] = useState<number | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('Invalid payment session');
      setVerifying(false);
      return;
    }

    verifyPayment(sessionId);
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log('Verifying payment for session:', sessionId);
      const response = await verifyStripePayment(sessionId);
      console.log('Verification response:', response);
      
      setRegistrationId(response.registrationId);
      setVerifying(false);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.response?.data?.error || 'Payment verification failed');
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600">Please wait while we confirm your booking</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/hiker-dashboard/explore')}
              className="w-full px-6 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors"
            >
              Back to Events
            </button>
            <button
              onClick={() => navigate('/hiker-dashboard/events')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful! 🎉
        </h2>
        <p className="text-gray-600 mb-2">
          Your booking has been confirmed.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Booking ID: <span className="font-mono font-semibold">#{registrationId}</span>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/hiker-dashboard/booking-confirmation/${registrationId}`)}
            className="w-full px-6 py-3 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors font-medium"
          >
            View Booking Details
          </button>
          <button
            onClick={() => navigate('/hiker-dashboard/events')}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            My Bookings
          </button>
          <button
            onClick={() => navigate('/hiker-dashboard/explore')}
            className="w-full px-6 py-3 text-[#1E3A5F] hover:text-[#2a4a7a] transition-colors"
          >
            Continue Exploring →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;