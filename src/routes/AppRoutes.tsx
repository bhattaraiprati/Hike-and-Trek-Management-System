import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import LandingPage from "../pages/LandingPage"
import OrganizerRegistration from "../pages/organizer/OrganizerRegistration"
import ProtectedRoute from "./ProtectedRoute";
import { OrganizerDashboard } from "../pages/organizer/OrganizerDashboard";
import DashboardPage from "../pages/hiker/DashboardPage";
import OAuthCallback from "../hooks/OAuthCallback";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<OrganizerRegistration />} />
      <Route path="/register" element={<LoginPage />} />

      <Route path="/oauth/callback" element={<OAuthCallback />} />

      {/* Protected Organizer Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
        <Route path="/dashboard-organizer" element={<OrganizerDashboard />} />
      </Route>

      {/* Protected Hiker Routes */}
      <Route element={<ProtectedRoute allowedRoles={["HIKER"]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Routes accessible by both roles */}
      <Route element={<ProtectedRoute allowedRoles={["ORGANIZER", "HIKER"]} />}>
        {/* Add shared protected routes here if needed */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;