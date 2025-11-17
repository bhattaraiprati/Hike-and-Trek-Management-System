import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      // Store token
      localStorage.setItem("token", token);
      login(token);

      // Decode and redirect based on role
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;

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
        console.error("Error processing OAuth callback:", error);
        navigate("/login");
      }
    } else {
      // No token, redirect to login
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B4332] to-[#2C5F8D]">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
        <p className="text-white text-xl font-semibold">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;