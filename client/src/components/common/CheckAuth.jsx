import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (!location.pathname.includes("/admin") && !isAuthenticated) {
    return <>{children}</>;
  }
  
  // Nếu chưa login
  if (!isAuthenticated) {
    if (location.pathname.includes("/login") || location.pathname.includes("/register")) {
      return <>{children}</>; // cho phép vào login/register
    }
    return <Navigate to="/auth/login" />; // ép về login
  }

  // Nếu đã login và đang cố vào /login hoặc /register
  if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register"))) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/" />;
  }

  // Nếu là user thường mà vào /admin
  if (user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
