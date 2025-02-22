import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

import "../styles/Navbar.css";
import Quess from "../assets/quesslogo.png";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    setShowModal(false);
    navigate("/signin"); // Redirect to sign-in page
  };

  return (
    <>
      <nav className="navbar bg-white shadow-lg p-4 flex items-center">
        <img className="w-22 h-10 mr-2" src={Quess} alt="logo" />

        <div className="user-info">
          <h4 className="username">vijay209</h4>
          <FaRegUserCircle size={30} color="gray" className="user-icon" />
          <CiLogout size={25} className="logout-icon" onClick={handleLogout} />
        </div>
      </nav>

      {/* Confirmation Modal */}
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
