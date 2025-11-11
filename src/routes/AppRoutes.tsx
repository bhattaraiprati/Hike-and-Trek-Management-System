import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import LandingPage from "../pages/LandingPage"
import OrganizerRegistration from "../pages/organizer/OrganizerRegistration"

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<OrganizerRegistration />} />
      </Routes>

    </>
  )
}

export default AppRoutes;