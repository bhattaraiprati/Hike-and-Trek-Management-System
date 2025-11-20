export const getRoleBasedRoute = (role: string): string => {
  const roleRoutes: Record<string, string> = {
    ORGANIZER: "/dashboard",
    HIKER: "/hiker-dashboard",
    ADMIN: "/admin-dashboard",
  };

  return roleRoutes[role] || "/";
};