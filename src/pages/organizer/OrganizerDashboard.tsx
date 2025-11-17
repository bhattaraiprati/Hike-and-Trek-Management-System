import { useState } from 'react'
import OrganizerSidebar from '../../components/organizer/layout/OrganizerSidebar';
import OrganizerHeader from '../../components/organizer/layout/OrganizerHeader';

export const OrganizerDashboard = () => {
   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex">
        <OrganizerSidebar 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          <OrganizerHeader
            onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Your dashboard content goes here */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
            <p className="text-gray-600">Start exploring your hiking adventures!</p>
          </main>
        </div>
      </div>
    </div>
  )
}

