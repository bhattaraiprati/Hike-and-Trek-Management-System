import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import LandingPage from "../pages/LandingPage"
import OrganizerRegistration from "../pages/organizer/OrganizerRegistration"
import ProtectedRoute from "./ProtectedRoute";
import { OrganizerLayout } from "../pages/organizer/OrganizerLayout";
import DashboardPage from "../pages/hiker/DashboardPage";
import OAuthCallback from "../hooks/OAuthCallback";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import CreateEventPage from "../pages/organizer/CreateEventPage";
import OrganizerEventsPage from "../pages/organizer/OrganizerEventsPage";

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
        <Route path="/dashboard" element={<OrganizerLayout />}>
          {/* Dashboard home - exact match */}
          <Route index element={<OrganizerDashboard />} />
          
          {/* Other organizer routes */}
          <Route path="events" element={<OrganizerEventsPage />} />
          <Route path="register" element={<CreateEventPage />} />
          <Route path="participants" element={<div>Participants Page</div>} />
          <Route path="messages" element={<div>Messages Page</div>} />
          <Route path="profile" element={<div>Profile Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Route>

      {/* Protected Hiker Routes */}
      <Route element={<ProtectedRoute allowedRoles={["HIKER"]} />}>
        <Route path="/hiker-dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;