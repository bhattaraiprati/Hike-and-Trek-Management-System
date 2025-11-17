export const getRoleBasedRoute = (role: string): string => {
  const roleRoutes: Record<string, string> = {
    ORGANIZER: "/dashboard-organizer",
    HIKER: "/dashboard",
    ADMIN: "/admin-dashboard",
  };

  return roleRoutes[role] || "/";
};