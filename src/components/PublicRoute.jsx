import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/authSlice";

const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If user is logged in, redirect to home page
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
