import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getRoleBasedRoute } from "../utils/getRoleBasedRoute";

export const useRedirectIfAuthenticated = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      const route = getRoleBasedRoute(user.role);
      navigate(route, { replace: true });
    }
  }, [user, navigate]);
};