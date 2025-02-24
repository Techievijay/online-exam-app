import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../redux/slices/authSlice";

const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  // If the user just registered, restrict access to only "/signin"
  if (user && location.pathname !== "/signin") {
    return <Navigate to="/signin" replace />;
  }

  // If already authenticated, redirect to home
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
