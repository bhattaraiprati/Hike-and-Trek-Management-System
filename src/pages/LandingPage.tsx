import AIChatbotShowcase from "../components/landing/AIChatbotShowcase"
import FeaturesSection from "../components/landing/FeaturesSection"
import Footer from "../components/landing/Footer"
import HeroSection from "../components/landing/HeroSection"
import HowItWorksSection from "../components/landing/HowItWorksSection"
import Navbar from "../components/landing/Navbar"

const LandingPage = () => {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <FeaturesSection/>
      <HowItWorksSection/>
      <AIChatbotShowcase/>
      <Footer/>
    </>
  )
}

export default LandingPage