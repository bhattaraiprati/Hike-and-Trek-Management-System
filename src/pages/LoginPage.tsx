import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  loginForm,
  registerForm,
  verifyOTP,
  resendOTP,
} from "../api/services/authApi";
import OTPVerificationPopup from "../components/auth/OTPVerificationPopup";
import {
  Zap,
  Loader2,
  Mail,
  X,
} from "lucide-react";
import { urlLink } from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useRedirectIfAuthenticated } from "../hooks/useRedirectIfAuthenticated";
import { useAuth } from "../context/AuthContext";

interface DecodedToken {
  sub?: string;
  email?: string;
  name: string;
  role: string;
  id: string;
}

const LoginPage = () => {
  useRedirectIfAuthenticated();

  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  // Helper function to redirect based on role
  const redirectBasedOnRole = (token: string) => {
    // Decode token to get user role
    try {
      const payload = jwtDecode<DecodedToken>(token);
      const userRole = payload.role;

      console.log("Decoded user role:", userRole);

      // Redirect based on role
      switch (userRole) {
        case "ORGANIZER":
          navigate("/dashboard-organizer");
          break;
        case "HIKER":
          navigate("/dashboard");
          break;
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/");
    }
  };

  const loginMutation = useMutation({
    mutationFn: loginForm,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log("Token stored in localStorage", data.token);
      // Use auth context login
      login(data.token);
      
      // Redirect based on role
      redirectBasedOnRole(data.token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerForm,
    onSuccess: (_, variables) => {
      setPendingVerificationEmail(variables.email as string);
      setShowOTPPopup(true);
      setShowConfirmModal(false);
    },
    onError: () => {
      setShowConfirmModal(false);
      setShowOTPPopup(false);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      setShowOTPPopup(false);
      setShowConfirmModal(false); 
      setIsLogin(true);
      setFormData({ email: "", password: "", confirmPassword: "", name: "" });
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: resendOTP,
    onSuccess: () => {},
  });

  const currentMutation = isLogin ? loginMutation : registerMutation;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
      return;
    }

    // Register flow
    if (formData.password !== formData.confirmPassword) {
      // you could show a toast here
      return;
    }
    setShowConfirmModal(true);
  };

  const sentOTP = () => {
    confirmRegister();
    setShowConfirmModal(false);
  }

  const confirmRegister = () => {
    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  const handleVerifyOTP = (otp: string) => {
    verifyOTPMutation.mutate({ 
      email: pendingVerificationEmail, 
      otp: otp
    });
  };

  const handleResendOTP = () => {
    resendOTPMutation.mutate({ email: pendingVerificationEmail });
  };

  const closeOTPPopup = () => {
    setShowOTPPopup(false);
    setShowConfirmModal(false);
    setPendingVerificationEmail("");
    setFormData(p => ({ ...p, email: "", password: "", name: "", confirmPassword: "" }));
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "google") {
      window.location.href = `${urlLink}/oauth2/authorization/google`;
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332]/10 to-[#2C5F8D]/10" />
          </div>
        </div>

        {/* Form Card */}
        <div className="relative mt-6 z-10 w-full max-w-md mx-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1B4332] to-[#2C5F8D] rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {isLogin ? "Welcome Back" : "Join HikeSathi"}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to continue your adventure"
                  : "Create your account to start exploring"}
              </p>
            </div>

            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  !isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Global error */}
            {currentMutation.isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">
                  {(currentMutation.error as any)?.response?.data?.message ||
                    `${isLogin ? "Login" : "Registration"} failed. Please try again.`}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                    disabled={currentMutation.isPending}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                  disabled={currentMutation.isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  disabled={currentMutation.isPending}
                />
              </div>

              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                    required
                    disabled={currentMutation.isPending}
                  />
                </div>
              )}

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#1B4332] border-gray-300 rounded focus:ring-[#1B4332]"
                    disabled={currentMutation.isPending}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>

                {isLogin && (
                  <a
                    href="#"
                    className="text-sm text-[#1B4332] hover:text-[#2D5016] transition-colors"
                  >
                    Forgot password?
                  </a>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={currentMutation.isPending}
                className="w-full bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {currentMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">Or continue with</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin("google")}
                disabled={currentMutation.isPending}
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-all group disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Google
                </span>
              </button>

              <button
                onClick={() => handleSocialLogin("facebook")}
                disabled={currentMutation.isPending}
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-all group disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Facebook
                </span>
              </button>
            </div>

            {/* Footer switch */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    currentMutation.reset();
                  }}
                  disabled={currentMutation.isPending}
                  className="text-[#1B4332] font-semibold hover:text-[#2D5016] transition-colors disabled:opacity-50"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Legal */}
          <div className="text-center mt-6">
            <p className="text-sm text-white/80">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-white hover:text-gray-200 underline transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-white hover:text-gray-200 underline transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ---------- OTP Confirmation Modal ---------- */}
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
                disabled={registerMutation.isPending}
                className="flex-1 py-3 bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {registerMutation.isPending ? (
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

      {/* ---------- OTP Entry Popup ---------- */}
      <OTPVerificationPopup
        isOpen={showOTPPopup}
        onClose={closeOTPPopup}
        email={pendingVerificationEmail}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        isVerifying={verifyOTPMutation.isPending}
        isResending={resendOTPMutation.isPending}
        resendSuccess={resendOTPMutation.isSuccess}
        error={(verifyOTPMutation.error as any)?.response?.data?.message}
      />
    </>
  );
};

export default LoginPage;