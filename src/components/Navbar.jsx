
import { FaRegUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";
import Quess from '../assets/quesslogo.png';

const Navbar = () => {
  return (
    <nav className="navbar bg-white shadow-lg p-4 flex items-center">
      <img className="w-22 h-10 mr-2" src={Quess} alt="logo" />
    
      <div className="cart-icon">
        <FaRegUserCircle size={30} color="gray" />
      </div>
    </nav>
  );
};

export default Navbar;
