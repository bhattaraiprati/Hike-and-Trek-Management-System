import { AlertTriangle, RotateCcw, Home, MessageCircleWarning } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const errorMessages: Record<string, { title: string; description: string }> = {
  payment_failed: {
    title: "Payment Failed",
    description:
      "We couldn't complete your payment. Your card or wallet was not charged. Please try again or use a different payment method.",
  },
  cancelled: {
    title: "Payment Cancelled",
    description:
      "You cancelled the payment. No charges were made. You can resume checkout when you're ready.",
  },
};

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const errorKey = searchParams.get("error") || "payment_failed";
  const status = searchParams.get("status") || "failed";
  const message = errorMessages[errorKey] ?? errorMessages.payment_failed;

  const handleRetry = () => {
    navigate("/hiker-dashboard/explore");
  };

  const handleGoHome = () => {
    navigate("/hiker-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="bg-red-50 border-b border-red-100 px-6 py-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-red-700 font-semibold">
              {status === "failed" ? "Payment Failed" : "Payment Status"}
            </p>
            <h1 className="text-xl font-bold text-[#1E3A5F]">{message.title}</h1>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">{message.description}</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <MessageCircleWarning className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">What you can do next</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Retry the payment to confirm your booking.</li>
                <li>Use an alternative payment method if available.</li>
                <li>Contact support if this keeps happening.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Payment
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;

