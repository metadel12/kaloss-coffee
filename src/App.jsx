// App.js
import React from "react";
import Header from "./components/header";
import Home from "./components/home";
import Navbar from "./components/navbar";
import DrinkCards from "./components/product";
import Testimonial3D from "./components/Testimonial";
import OurCommunity from "./components/OurCommunity";
import Footer from "./components/footer";
import "./App.css"; // For scroll-behavior and styles

function App() {
  return (
    <div className="app">
      <Navbar />

      <section id="header">
        <Header />
      </section>

      <section id="home">
        <Home />
      </section>

      <section id="product">
        <DrinkCards />
      </section>

      <section id="testimonial">
        <Testimonial3D />
      </section>

      <section id="ourcommunity">
        <OurCommunity />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}

export default App;
