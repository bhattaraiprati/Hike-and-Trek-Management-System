import { useState } from "react";
import Header from "./layout/Header"
import Sidebar from "./layout/Sidebar"


const DashboardPage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <Header/>
       <div className="flex">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            {/* {children} */}
          </div>
        </main>
      </div>
    </div>
    </>
  )
}

export default DashboardPage