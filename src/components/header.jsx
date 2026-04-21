import React from "react";
import "./header.css";
import packet from "../assets/packet2.jpg"; // import matches variable name 'packet'

function Header() {
  return (
    <div className="header-container">
      {/* Left Side: Animated Inspirational Texts */}
      <div className="text-section">
        <div className="text-container">
          <div>Inspiring Every Brew</div>
          <div>From Ethiopia to the World</div>
          <div>Your Morning, Elevated</div>
          <div>Awaken the Senses</div>
          <div>Freshly Roasted, Naturally Rich</div>
        </div>
      </div>

      {/* Right Side: Image + Decorations */}
      <div className="image-section">
        <div className="top-right-text">Coffee</div>
        <img
          src={packet} /* <-- use 'packet' here */
          alt="Kaloss Coffee Packet"
          className="coffee-packet"
        />
      </div>
    </div>
  );
}

export default Header;
