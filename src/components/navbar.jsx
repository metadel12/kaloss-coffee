// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const navbarRef = useRef(null);
  const menuItems = ["home", "product", "testimonial", "ourcommunity"];

  // 3D transform effect on navbar
  useEffect(() => {
    const navbar = navbarRef.current;

    const handleMouseMove = (e) => {
      if (!navbar) return;

      const { left, top, width, height } = navbar.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / width) * 10;
      const rotateX = (mouseY / height) * -10;

      gsap.to(navbar, {
        duration: 0.5,
        rotateX,
        rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(navbar, {
        duration: 1,
        rotateX: 0,
        rotateY: 0,
        ease: "elastic.out(1, 0.5)",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    if (navbar) {
      navbar.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (navbar) {
        navbar.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Animate menu items on open
  useEffect(() => {
    if (menuOpen) {
      gsap.from(".menu-items a", {
        duration: 0.5,
        x: -100,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClickMenuItem = (item) => {
    setActiveItem(item);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar-container" ref={navbarRef}>
      <div className="navbar-3d-layer"></div>

      <div className="logo">
        <span className="logo-3d">Kaloss</span>
        <span className="logo-sub">COFFEE</span>
      </div>

      <div className={`menu-items ${menuOpen ? "open" : ""}`}>
        {menuItems.map((item) => (
          <a
            key={item}
            href={`#${item}`}
            className={`menu-item ${activeItem === item ? "active" : ""}`}
            onClick={() => handleClickMenuItem(item)}
          >
            <span className="menu-text">
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
            <span className="menu-hover-effect"></span>
          </a>
        ))}
      </div>

      <div className="nav-actions">
        <button className="reservation-btn">
          <span>Reserve</span>
          <div className="btn-hover-effect"></div>
        </button>

        <div
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={handleMenuToggle}
        >
          <div className="bar top"></div>
          <div className="bar middle"></div>
          <div className="bar bottom"></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
