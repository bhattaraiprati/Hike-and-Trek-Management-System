import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
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

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    return token ? decodeToken(token) : null;
  });

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
    const timeoutId = setTimeout(() => {
      const verifyToken = async () => {
        try {
          // await checkAuth();
          // Token is valid, you can optionally update state here
        } catch (error) {
          // Token is invalid or there was an error
          localStorage.removeItem("token");
          setAuthToken(null);
          setUser(null);
          console.error("Authentication failed:", error);
        }
      };

      // Only verify if there's a token
      if (localStorage.getItem("token")) {
        verifyToken();
      }
    }, 2000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array - runs once on mount

  const login = (token: string) => {
    setAuthToken(token);
  };

  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;