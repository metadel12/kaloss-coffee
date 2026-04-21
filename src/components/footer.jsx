// src/components/Footer.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text } from '@react-three/drei';
import './Footer.css';

const CoffeeScene = () => {
  const coffeeRef = useRef();
  const beanRef1 = useRef();
  const beanRef2 = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    coffeeRef.current.rotation.y = time * 0.2;
    beanRef1.current.position.y = Math.sin(time * 2) * 0.1 + 0.5;
    beanRef2.current.position.y = Math.sin(time * 2 + 1) * 0.1 + 0.5;
  });

  return (
    <>
      <ambientLight intensity={0.8} color="#f9d71c" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#f9d71c" />
      <pointLight position={[-5, 3, 2]} intensity={0.5} color="#e25822" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <mesh ref={coffeeRef} position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.7, 1.5, 32]} />
            <meshStandardMaterial color="#f0f0f0" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.75, 0.65, 0.5, 32]} />
            <meshStandardMaterial color="#7B3F00" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial color="#f0f0f0" metalness={0.8} roughness={0.2} />
          </mesh>
        </mesh>
      </Float>

      <mesh ref={beanRef1} position={[-1.2, 0.5, 0]} rotation={[0.5, 0, 0.8]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3E2723" roughness={0.7} />
      </mesh>

      <mesh ref={beanRef2} position={[1.2, 0.5, -0.5]} rotation={[0.3, 0.5, -0.5]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4E342E" roughness={0.7} />
      </mesh>

      <Text
        position={[0, -2.5, 0]}
        color="#f9d71c"
        fontSize={0.4}
        maxWidth={4}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
      >
        Kaloss Coffee
      </Text>

      <Stars radius={50} depth={30} count={2000} factor={4} saturation={0} fade />
    </>
  );
};

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-3d">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
          <CoffeeScene />
        </Canvas>
      </div>

      <div className="footer-overlay"></div>

      <div className="footer-content">
        <div className="footer-column">
          <h3 className="footer-title">Kaloss Coffee</h3>
          <p className="footer-text">
            Premium coffee experiences crafted with passion. Fresh from the highlands of Ethiopia,
            roasted to perfection for your daily ritual.
          </p>
          <div className="social-icons">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
              <a
                key={platform}
                href="#"
                className="social-icon"
                aria-label={platform}
              >
                <div className="social-icon-circle"></div>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">Shop</h4>
          <ul className="footer-list">
            {['Coffee Blends', 'Single Origin', 'Equipment', 'Subscriptions', 'Merchandise'].map((item) => (
              <li key={item} className="footer-list-item">
                <a href="#" className="footer-link">
                  <span className="bullet">•</span> {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">Company</h4>
          <ul className="footer-list">
            {['Our Story', 'Sustainability', 'Roasting Process', 'Locations', 'Careers'].map((item) => (
              <li key={item} className="footer-list-item">
                <a href="#" className="footer-link">
                  <span className="bullet">•</span> {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">Newsletter</h4>
          <p className="footer-text small-text">
            Subscribe to receive updates, special offers, and brewing tips.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-copy">&copy; 2025 Kaloss Coffee. All rights reserved.</div>
          <div className="footer-bottom-links">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy', 'Contact'].map((item) => (
              <a key={item} href="#" className="footer-bottom-link">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
