// components/Auth/EmailVerificationPopup.tsx
import React from 'react';
import { X, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface EmailVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResendEmail: () => void;
  isResending?: boolean;
  resendSuccess?: boolean;
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({
  isOpen,
  onClose,
  email,
  onResendEmail,
  isResending = false,
  resendSuccess = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#2C5F8D] rounded-2xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
              <p className="text-sm text-gray-600">Almost there!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Check Your Email
            </h3>
            <p className="text-gray-600">
              We've sent a verification link to:
            </p>
            <p className="text-[#1B4332] font-medium">{email}</p>
            <p className="text-sm text-gray-500">
              Click the link in the email to verify your account and complete your registration.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-sm text-blue-800">Check your email inbox</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-sm text-blue-800">Click the verification link</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-sm text-blue-800">Start exploring HikeSathi</span>
            </div>
          </div>

          {/* Resend Email Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Didn't receive the email?</span>
            </div>
            
            {resendSuccess ? (
              <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700">Verification email sent successfully!</span>
              </div>
            ) : (
              <button
                onClick={onResendEmail}
                disabled={isResending}
                className="w-full py-3 px-4 border-2 border-[#1B4332] text-[#1B4332] rounded-2xl font-semibold hover:bg-[#1B4332] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </span>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                If you don't see the email in your inbox, please check your spam folder. 
                The verification link will expire in 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Continue to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPopup;