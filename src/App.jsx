import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Exam from "./pages/Exam";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./pages/NotFound";
import {  loginSuccess } from "./redux/slices/authSlice";

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation();
  const dispatch = useDispatch();


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (storedUser && accessToken) {
      dispatch(
        loginSuccess({
          user: JSON.parse(storedUser),
          accessToken,
          refreshToken,
        })
      );
    }
  }, [dispatch]);

  return (
    <>
      {location.pathname !== "/signin" &&
        location.pathname !== "/signup" &&
        !location.pathname.startsWith("/exam") && <Navbar />}

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/exam/:id" element={<Exam />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
