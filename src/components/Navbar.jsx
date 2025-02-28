import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { EVENTS } from "../utils/constant";
import { selectAuthError, selectAuthLoading } from "../redux/slices/authSlice";
import AlertPopup from "./AlertPopup";  // ✅ Import AlertPopup
import "../styles/Navbar.css";
import Quess from "../assets/quesslogo.png";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);  // ✅ Get error state from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    setShowModal(false);
    dispatch({ type: EVENTS.USER_SIGNOUT, payload: { navigate } });
  };
console.log('ERROR HERE------------',error);

  return (
    <>
      <nav className="navbar bg-white shadow-lg p-4 flex items-center">
        <img className="w-22 h-10 mr-2" src={Quess} alt="logo" />
        
        <div className="user-info">
          <h4 className="username">{user ? user.username : "Guest"}</h4>
          <FaRegUserCircle size={30} color="gray" className="user-icon" />
          <CiLogout size={25} className="logout-icon" onClick={handleLogout} />
        </div>
      </nav>

   
      {error && <AlertPopup message={error} type="failed" />}

      {/* 🔹 Show Loader when Logging Out */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
        </div>
      )}

      {/* 🔹 Logout Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>Confirm</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
