import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../redux/slices/authSlice";

const PrivateRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

 
  if (user?.role === "admin" && location.pathname !== "/dashboard") {
    return <Navigate to="/dashboard" replace />;
  }

  if (location.pathname === "/dashboard" && (!user?.role || user.role !== "admin")) {
    return <Navigate to="/" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
