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
import HikerLayout from "../pages/hiker/HikerLayout";
import ExploreEventsPage from "../pages/hiker/ExploreEventsPage";
import EventDetailsPage from "../pages/hiker/EventDetailsPage";
import BookingCheckoutPage from "../pages/hiker/BookingCheckoutPage";

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
          <Route index element={<OrganizerDashboard />} />
          
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
        <Route path="/hiker-dashboard" element={<HikerLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="explore" element={<ExploreEventsPage />} />
          <Route path="event/:eventId" element={<EventDetailsPage />} />
          <Route path="event/:eventId/checkout" element={<BookingCheckoutPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;