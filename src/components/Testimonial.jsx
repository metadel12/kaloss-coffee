import React from "react";
import "./Testimonial.css"; // Link to the external CSS below

function Testimonial() {
  return (
    <div className="testimonial-container">
      {/* First Customer Testimonial */}
      <div className="wrap animate pop">
        <div className="overlay">
        
          <div className="overlay-content animate slide-left delay-2">
            <h1 className="animate slide-left pop delay-4">Customer</h1>
            <p className="animate slide-left pop delay-5" style={{ color: 'white', marginBottom: '2.5rem' }}>
              Testimonial
            </p>
          </div>
          <div
            className="image-content animate slide delay-5"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde')",
            }}
          ></div>
          <div className="dots animate">
            <div className="dot animate slide-up delay-6"></div>
            <div className="dot animate slide-up delay-7"></div>
            <div className="dot animate slide-up delay-8"></div>
          </div>
        </div>
        <div className="text">
          <p>
            <img className="inset" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="Happy customer 1" />
            “The coffee from this shop is divine! It’s like waking up in a forest full of fresh aromas.”
          </p>
          <p>— <strong>Mesfin Ayele</strong>, Addis Ababa</p>
          <img className="tree" src="https://images.unsplash.com/photo-1511920170033-f8396924c348" alt="Coffee Cup" />
        </div>
      </div>

      {/* Second Customer Testimonial */}
      <div className="wrap animate pop">
        <div className="overlay">
          <div className="overlay-content animate slide-left delay-2">
            <h1 className="animate slide-left pop delay-4">Customer</h1>
            <p className="animate slide-left pop delay-5" style={{ color: 'white', marginBottom: '2.5rem' }}>
              Testimonial
            </p>
          </div>
          <div
            className="image-content animate slide delay-5"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d')",
            }}
          ></div>
          <div className="dots animate">
            <div className="dot animate slide-up delay-6"></div>
            <div className="dot animate slide-up delay-7"></div>
            <div className="dot animate slide-up delay-8"></div>
          </div>
        </div>
        <div className="text">
          <p>
            <img className="inset" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" alt="Happy customer 2" />
            “Their blend of Ethiopian beans is so smooth and full-bodied. I’m hooked!”
          </p>
          <p>— <strong>Hanna Tesfaye</strong>, Bahir Dar</p>
          <img className="tree" src="https://images.unsplash.com/photo-1510626176961-4b37d0a1a3c1" alt="Coffee Cup" />
        </div>
      </div>

      {/* Third Customer Testimonial */}
      <div className="wrap animate pop">
        <div className="overlay">
          <div className="overlay-content animate slide-left delay-2">
            <h1 className="animate slide-left pop delay-4">Customer</h1>
            <p className="animate slide-left pop delay-5" style={{ color: 'white', marginBottom: '2.5rem' }}>
              Testimonial
            </p>
          </div>
          <div
            className="image-content animate slide delay-5"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1527980965255-d3b416303d12')",
            }}
          ></div>
          <div className="dots animate">
            <div className="dot animate slide-up delay-6"></div>
            <div className="dot animate slide-up delay-7"></div>
            <div className="dot animate slide-up delay-8"></div>
          </div>
        </div>
        <div className="text">
          <p>
            <img className="inset" src="https://images.unsplash.com/photo-1527980965255-d3b416303d12" alt="Happy customer 3" />
            “Kaloss Coffee is my favorite! The beans are always fresh and full of flavor.”
          </p>
          <p>— <strong>Robel Mengesha</strong>, Hawassa</p>
          <img className="tree" src="https://images.unsplash.com/photo-1577979749830-0e58bafd896d" alt="Coffee Cup" />
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
