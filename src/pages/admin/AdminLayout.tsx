import { Outlet } from "react-router-dom";
import { AdminHeader } from "../../components/admin/layout/AdminHeader";
import { AdminSidebar } from "../../components/admin/layout/AdminSidebar";
import { useState } from "react";


const AdminLayout = () => {
   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  

  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex">
        <AdminSidebar 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-x-hidden
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-2'}`}   
        >
          <AdminHeader
            onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet/>
            
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout