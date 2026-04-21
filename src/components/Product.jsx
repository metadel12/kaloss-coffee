// App.jsx
import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./meti.css";

function DrinkCards() {
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const sliderElement = $(sliderRef.current);
    sliderElement.slick({
      dots: false,
      nav: false,
      arrows: false,
      infinite: true,
      speed: 1200,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      adaptiveHeight: true,
      autoplay: true,
      draggable: false,
      pauseOnFocus: false,
      pauseOnHover: false,
    });

    sliderElement.find(".slick-current").addClass("initialAnimation");

    const transitionSetup = {
      target: ".slick-list",
      enterClass: "u-scale-out",
      doTransition: function () {
        const slideContainer = sliderElement.find(this.target)[0];
        slideContainer.classList.add(this.enterClass);
        sliderElement.find(".slick-current").removeClass("animateIn");
      },
      exitTransition: function () {
        const slideContainer = sliderElement.find(this.target)[0];
        setTimeout(() => {
          slideContainer.classList.remove(this.enterClass);
          sliderElement.find(".slick-current").addClass("animateIn");
        }, 2000);
      },
    };

    let i = 0;
    sliderElement.on(
      "beforeChange",
      function (event /*, slick, currentSlide, nextSlide*/) {
        if (i === 0) {
          event.preventDefault();
          transitionSetup.doTransition();
          i++;
        } else {
          i = 0;
          transitionSetup.exitTransition();
        }

        sliderElement.slick("slickNext");
        sliderElement.find(".slick-current").removeClass("initialAnimation");
      }
    );

    return () => {
      sliderElement.slick("unslick");
      sliderElement.off("beforeChange");
    };
  }, []);

  return (
    <div className="kaloss-app">
      <header className="c-header">
        <h1 className="c-header__title">Kaloss Coffee</h1>
        <nav className="c-navigation">
          <ul className="c-navigation__list">
            <li className="c-navigation__list-item c-navigation__list-item--active">
              <a href="#" title="">
                Our Coffees
              </a>
            </li>
            <li className="c-navigation__list-item">
              <a href="#" title="">
                Brewing Guides
              </a>
            </li>
            <li className="c-navigation__list-item">
              <a href="#" title="">
                Coffee Origins
              </a>
            </li>
          </ul>
        </nav>
        <div className="c-cta"></div>
      </header>

      <div className="c-socials">
        <ul className="c-socials__list">
          <li className="c-socials__list-item">
            <a href="" title="">
              <svg
                height="512"
                viewBox="0 0 24 24"
                width="512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 24h9v-8.25H9V12h3V9c0-2.486 2.014-4.5 4.5-4.5h3v3.75H18c-.828 0-1.5-.078-1.5.75v3h3.75l-1.5 3.75H16.5V24H21c1.654 0 3-1.346 3-3V3c0-1.655-1.346-3-3-3H3C1.345 0 0 1.345 0 3v18c0 1.654 1.345 3 3 3z" />
              </svg>
            </a>
          </li>
          <li className="c-socials__list-item">
            <a href="" title="">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z" />
              </svg>
            </a>
          </li>
          <li className="c-socials__list-item">
            <a href="" title="">
              <svg
                height="512pt"
                viewBox="0 0 512 512.00006"
                width="512pt"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M261.039062 512c-1.695312 0-3.390624 0-5.097656-.007812-40.132812.097656-77.214844-.921876-113.277344-3.117188-33.0625-2.011719-63.242187-13.4375-87.28125-33.039062-23.195312-18.914063-39.035156-44.488282-47.078124-76.003907-7-27.4375-7.371094-54.371093-7.726563-80.421875C.320312 300.71875.0546875 278.570312 0 256.046875c.0546875-22.617187.320312-44.765625.578125-63.457031.355469-26.046875.726563-52.980469 7.726563-80.421875C16.347656 80.652344 32.1875 55.078125 55.382812 36.164062 79.421875 16.5625 109.601562 5.136719 142.667969 3.125 178.730469.933594 215.820312-.0898438 256.039062.0078125 296.183594-.078125 333.253906.933594 369.316406 3.125c33.0625 2.011719 63.242188 13.4375 87.28125 33.039062 23.199219 18.914063 39.035156 44.488282 47.078125 76.003907 7 27.4375 7.371094 54.375 7.726563 80.421875.257812 18.691406.527344 40.839844.578125 63.363281v.09375c-.050781 22.523437-.320313 44.671875-.578125 63.363281-.355469 26.046875-.722656 52.980469-7.726563 80.421875-8.042969 31.515625-23.878906 57.089844-47.078125 76.003907-24.039062 19.601562-54.21875 31.027343-87.28125 33.039062C334.781250 510.976562 299.304688 512 261.039062 512zm-5.097656-40.007812c39.480469.09375 75.730469-.902344 110.945313-3.042969 25-1.519531 46.675781-9.632813 64.433593-24.113281 16.414063-13.386719 27.71875-31.855469 33.597657-54.894532 5.828125-22.839844 6.164062-47.363281 6.488281-71.078125.253906-18.566406.519531-40.558593.574219-62.863281-.054688-22.308594-.320313-44.296875-.574219-62.863281-.324219-23.714844-.660156-48.238281-6.488281-71.082031-5.878907-23.039063-17.183594-41.507813-33.597657-54.894532-17.757812-14.476562-39.433593-22.589844-64.433593-24.109375-35.214844-2.144531-71.464844-3.132812-110.851563-3.046875-39.472656-.09375-75.726562.902344-110.941406 3.046875-25 1.519531-46.675781 9.632813-64.433594 24.109375-16.414062 13.386719-27.71875 31.855469-33.597656 54.894532-5.828125 22.84375-6.164062 47.363281-6.488281 71.082031-.253907 18.582031-.519531 40.585937-.574219 62.910156.054688 22.226563.320312 44.234375.574219 62.816406.324219 23.714844.660156 48.238281 6.488281 71.078125 5.878906 23.039063 17.183594 41.507813 33.597656 54.894532 17.757813 14.476562 39.433594 22.589843 64.433594 24.109374 35.214844 2.144532 71.476562 3.144532 110.847656 3.046876zM254.988281 381c-68.921875 0-125-56.074219-125-125s56.078125-125 125-125c68.925781 0 125 56.074219 125 125s-56.074219 125-125 125zm0-210c-46.867187 0-85 38.132812-85 85s38.132813 85 85 85c46.871094 0 85-38.132812 85-85s-38.128906-85-85-85zm139-80c-16.566406 0-30 13.429688-30 30s13.433594 30 30 30c16.570313 0 30-13.429688 30-30s-13.429687-30-30-30zm0 0" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <section className="c-slider">
        <div className="c-slider-init" ref={sliderRef}>
          {/* Signature Blend Slide */}
          <div
            className="c-slide--signature"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            }}
          >
            <div className="c-slide-content">
              <div className="c-wrap c-wrap--line">
                <h2 className="c-slide__title">
                  Kaloss
                  <span className="c-slide__title--large">Signature Blend</span>
                </h2>
              </div>
              <div className="c-wrap c-wrap--small">
                <div className="c-slide__info">
                  <h3 className="c-slide__subtitle">Premium Arabica Beans</h3>
                  <p className="c-slide__body">
                    Our signature blend combines beans from volcanic highlands
                    with notes of dark chocolate and caramel. Sustainably
                    sourced from Indonesian farms.
                  </p>
                  <button className="coffee-cta">Shop Now</button>
                </div>
              </div>
            </div>
          </div>

          {/* Single Origin Series Slide */}
          <div
            className="c-slide--single-origin"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2086&q=80")',
            }}
          >
            <div className="c-slide-content">
              <div className="c-wrap c-wrap--line">
                <h2 className="c-slide__title">
                  Single
                  <span className="c-slide__title--medium">Origin Series</span>
                </h2>
              </div>
              <div className="c-wrap c-wrap--small">
                <div className="c-slide__info">
                  <h3 className="c-slide__subtitle">Ethiopian Yirgacheffe</h3>
                  <p className="c-slide__body">
                    Experience the birthplace of coffee with our single-origin
                    Ethiopian beans. Floral notes with hints of berry and citrus
                    create a bright, complex cup.
                  </p>
                  <button className="coffee-cta">Discover Origins</button>
                </div>
              </div>
            </div>
          </div>

          {/* Art of Brewing Slide */}
          <div
            className="c-slide--brewing"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80")',
            }}
          >
            <div className="c-slide-content">
              <div className="c-wrap c-wrap--line">
                <h2 className="c-slide__title">
                  Art of
                  <span className="c-slide__title--large">Brewing</span>
                </h2>
              </div>
              <div className="c-wrap c-wrap--small">
                <div className="c-slide__info">
                  <h3 className="c-slide__subtitle">Perfect Your Technique</h3>
                  <p className="c-slide__body">
                    Learn professional brewing methods to extract the full
                    flavor potential from your Kaloss beans. From pour-over to
                    espresso, we guide you to perfection.
                  </p>
                  <button className="coffee-cta">Learn Methods</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="coffee-features">
        <div className="feature-card">
          <div className="feature-icon">☕</div>
          <h3>Freshly Roasted</h3>
          <p>Small batch roasted to order for maximum freshness</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌱</div>
          <h3>Sustainable</h3>
          <p>Ethically sourced from Rainforest Alliance farms</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Free Shipping</h3>
          <p>On all orders over $50 in the continental US</p>
        </div>
      </div>
    </div>
  );
}

export default DrinkCards;
