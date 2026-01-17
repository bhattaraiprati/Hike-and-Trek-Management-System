import { Outlet } from "react-router-dom"
import AIChatbotShowcase from "../components/landing/AIChatbotShowcase"
import FeaturesSection from "../components/landing/FeaturesSection"
import Footer from "../components/landing/Footer"
import HeroSection from "../components/landing/HeroSection"
import HowItWorksSection from "../components/landing/HowItWorksSection"
import Navbar from "../components/landing/Navbar"
import { useRedirectIfAuthenticated } from "../hooks/useRedirectIfAuthenticated"

const LandingPage = () => {
  useRedirectIfAuthenticated();
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <FeaturesSection/>
    <HowItWorksSection/>
    <AIChatbotShowcase/>
    <Footer/>
    <Outlet/>
    </>
  )
}

export default LandingPage