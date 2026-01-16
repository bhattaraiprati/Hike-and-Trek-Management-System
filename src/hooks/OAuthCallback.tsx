import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

interface DecodedToken {
  sub?: string;
  email?: string;
  name: string;
  role: string;
  id: string;
}

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=" + encodeURIComponent(error));
      return;
    }

    if (token && refreshToken) {
      try {
        // Store tokens
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Use auth context login
        login(token);
        
        // Decode token to get user role
        const payload = jwtDecode<DecodedToken>(token);
        const userRole = payload.role;

        console.log("OAuth login successful, user role:", userRole);

        // Redirect based on role
        switch (userRole) {
          case "ORGANIZER":
            navigate("/dashboard");
            break;
          case "HIKER":
            navigate("/hiker-dashboard");
            break;
          case "ADMIN":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/");
        }
      } catch (error) {
        console.error("Error processing OAuth callback:", error);
        navigate("/login?error=Invalid token");
      }
    } else {
      // No token or error found
      console.error("No token received from OAuth");
      navigate("/login?error=Authentication failed");
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B4332]/10 to-[#2C5F8D]/10">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-[#1B4332] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Completing Sign In...
        </h2>
        <p className="text-gray-600">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;