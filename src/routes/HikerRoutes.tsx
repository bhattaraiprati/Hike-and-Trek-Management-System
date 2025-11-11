import { Route, Routes } from "react-router-dom"
import DashboardPage from "../pages/hiker/DashboardPage"

const HikerRoutes = () => {
  return (
    <>
    <Routes>
      <Route path="/dashboard" element={<DashboardPage/>} /> 
    </Routes>
    </>
  )
}

export default HikerRoutes