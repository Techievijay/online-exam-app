import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {


  return (
    <nav className="navbar">
      <h2 className="logo">ShopKart</h2>
      <div className="cart-icon">
        <FaShoppingCart size={30} />
        
      </div>
    </nav>
  );
};

export default Navbar;
