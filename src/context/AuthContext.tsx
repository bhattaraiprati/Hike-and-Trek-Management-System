import { jwtDecode } from "jwt-decode";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Define types
interface User {
  email: string;
  name: string;
  role: string;
  id: string;
}

interface AuthContextType {
  authToken: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

interface DecodedToken {
  sub?: string;
  email?: string;
  name: string;
  role: string;
  id: string;
  exp: number; // Expiration time in seconds
  iat: number; // Issued at time
}

interface LoginResponse {
  token: string;
  refreshToken: string;
}

// Create context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook with type checking
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Decode token to extract user info
function decodeToken(token: string): User | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      email: decoded.sub || decoded.email || "",
      name: decoded.name,
      role: decoded.role,
      id: decoded.id,
    };
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    // Add 60 second buffer to refresh before actual expiration
    return decoded.exp < currentTime + 60;
  } catch (err) {
    console.error("Error checking token expiration:", err);
    return true;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem("refreshToken");
  });

  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    return token ? decodeToken(token) : null;
  });

  // Refresh the access token
  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    
    if (!currentRefreshToken) {
      console.log("No refresh token available");
      logout();
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/refreshToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: currentRefreshToken,
        }),
      });

      if (!response.ok) {
        localStorage.removeItem("refreshToken");
        throw new Error("Failed to refresh token");
      }

      const data: LoginResponse = await response.json();
      
      // Update tokens
      setAuthToken(data.token);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      const decodedUser = decodeToken(data.token);
      setUser(decodedUser);
      
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  }, []);

  // Handle token changes
  useEffect(() => {
    if (authToken) {
      const decodedUser = decodeToken(authToken);
      setUser(decodedUser);
      localStorage.setItem("token", authToken);
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [authToken]);

  // Verify token periodically
   useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) return;

      if (isTokenExpired(token)) {
        console.log("Token is expired or about to expire, refreshing...");
        await refreshAccessToken();
      }
    };

    // Check immediately on mount
    checkAndRefreshToken();

    // Check every 5 minutes
    const intervalId = setInterval(checkAndRefreshToken, 1 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [refreshAccessToken]);

  const logoutRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        console.log("Logout successful on server");
      }
    } catch (error) {
      console.error("Error during logout request:", error);
    }
  };  

  const login = (token: string) => {
    setAuthToken(token);
  };

  const logout = async () => {
    await logoutRequest();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    setAuthToken(null);
    window.location.href = "/login";
  };



  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;