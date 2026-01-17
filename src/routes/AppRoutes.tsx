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
import BookingConfirmationPage from "../pages/hiker/BookingConfirmationPage";
import PaymentFailurePage from "../pages/hiker/PaymentFailurePage";
import MyBookingsPage from "../pages/hiker/MyBookingsPage";
import HikerProfilePage from "../pages/hiker/HikerProfilePage";
import OrganizerEventDetailsPage from "../pages/organizer/OrganizerEventDetailsPage ";
import ChatInterface from "../components/chat/ChatInterface";
import OrganizerProfilePage from "../pages/organizer/OrganizerProfilePage";
import PaymentSuccessPage from "../pages/hiker/PaymentSuccessPage";
import AdminLayout from "../pages/admin/AdminLayout";
import OrganizerPaymentPage from "../pages/organizer/OrganizerPaymentPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import OrganizerVerificationPage from "../pages/admin/OrganizerVerificationPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import AdminPaymentManagementPage from "../pages/admin/AdminPaymentManagementPage";
import AdminEventManagementPage from "../pages/admin/AdminEventManagementPage";
import AboutPage from "../pages/AboutPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<OrganizerRegistration />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected Organizer Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
        <Route path="/dashboard" element={<OrganizerLayout />}>
          <Route index element={<OrganizerDashboard />} />

          <Route path="events" element={<OrganizerEventsPage />} />
          <Route path="events/:eventId" element={<OrganizerEventDetailsPage />} />
          <Route path="register" element={<CreateEventPage />} />
          {/* <Route path="participants" element={<OrganizerEventDetailsPage />} /> */}
          <Route path="messages" element={<ChatInterface/>} />
          <Route path="payments" element={<OrganizerPaymentPage />} />
          <Route path="profile" element={<OrganizerProfilePage />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Route>

      {/* Protected Hiker Routes */}
      <Route element={<ProtectedRoute allowedRoles={["HIKER"]} />}>
        <Route path="/hiker-dashboard" element={<HikerLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="events" element={<MyBookingsPage />} />
          <Route path="explore" element={<ExploreEventsPage />} />
          <Route path="profile" element={<HikerProfilePage />} />
          <Route path="event/:eventId" element={<EventDetailsPage />} />
          <Route path="event/:eventId/checkout" element={<BookingCheckoutPage />} />
          <Route path="messages" element={<ChatInterface/>} />
          <Route path="booking-confirmation" element={<PaymentFailurePage />} />
          <Route path="booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="organizer-verification" element={<OrganizerVerificationPage />} />
          <Route path="userManagement" element={<UserManagementPage />} />
          <Route path="payments" element={<AdminPaymentManagementPage />} />
          <Route path="events" element={<AdminEventManagementPage />} />


        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;