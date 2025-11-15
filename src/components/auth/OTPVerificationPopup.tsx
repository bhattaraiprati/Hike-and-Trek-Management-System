import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Mail,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface OTPVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerifyOTP: (otp: string) => void;
  onResendOTP: () => void;
  isVerifying?: boolean;
  isResending?: boolean;
  resendSuccess?: boolean;
  error?: string;
}

const OTPVerificationPopup: React.FC<OTPVerificationPopupProps> = ({
  isOpen,
  onClose,
  email,
  onVerifyOTP,
  onResendOTP,
  isVerifying = false,
  isResending = false,
  resendSuccess = false,
  error = '',
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimer(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Reset timer when OTP is resent successfully
  useEffect(() => {
    if (resendSuccess) {
      setTimer(300);
      setCanResend(false);
    }
  }, [resendSuccess]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleOtpChange = (i: number, v: string) => {
    // Only allow digits
    if (!/^\d*$/.test(v)) return;

    const newOtp = [...otp];
    newOtp[i] = v.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (v && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((digit) => digit !== '') && i === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    // Only allow digits
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if complete
    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = (otpString?: string) => {
    const code = otpString || otp.join('');
    if (code.length === 6) {
      onVerifyOTP(code);
    }
  };

  const handleResend = () => {
    if (canResend && !isResending) {
      onResendOTP();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#2C5F8D] rounded-2xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
              <p className="text-sm text-gray-600">Enter the OTP sent to your email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">We sent a 6-digit code to:</p>
            <p className="text-[#1B4332] font-medium text-lg">{email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message for Resend */}
          {resendSuccess && !error && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">New OTP sent successfully!</p>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {timer > 0 ? (
                <>
                  Time remaining: <span className="font-semibold text-[#1B4332]">{formatTime(timer)}</span>
                </>
              ) : (
                <span className="text-red-600 font-semibold">OTP expired</span>
              )}
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={otp.join('').length !== 6 || isVerifying}
            className="w-full py-3 bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center space-y-2">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center justify-center space-x-2 mx-auto text-[#1B4332] hover:text-[#2D5016] disabled:opacity-50 transition-colors"
              >
                <RotateCcw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                <span className="font-semibold">
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </span>
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Didn't receive the code? Wait {formatTime(timer)} to resend
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Check your spam folder if you don't see the email. The OTP is valid for 5 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Back to registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPopup;