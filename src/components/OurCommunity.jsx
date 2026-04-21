import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./OurCommunity.css";

gsap.registerPlugin(ScrollTrigger);

const OurCommunity = () => {
  useEffect(() => {
    const animateFrom = (elem, direction = 1) => {
      let x = 0;
      let y = direction * 100;

      if (elem.classList.contains("gs_reveal_fromLeft")) {
        x = -100;
        y = 0;
      } else if (elem.classList.contains("gs_reveal_fromRight")) {
        x = 100;
        y = 0;
      }

      gsap.fromTo(
        elem,
        { x, y, autoAlpha: 0 },
        {
          duration: 1.25,
          x: 0,
          y: 0,
          autoAlpha: 1,
          ease: "expo",
          overwrite: "auto",
        }
      );
    };

    const hide = (elem) => {
      gsap.set(elem, { autoAlpha: 0 });
    };

    const revealElements = document.querySelectorAll(".gs_reveal");
    revealElements.forEach((elem) => {
      hide(elem);
      ScrollTrigger.create({
        trigger: elem,
        onEnter: () => animateFrom(elem),
        onEnterBack: () => animateFrom(elem, -1),
        onLeave: () => hide(elem),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="our-community-page">
      <div className="content">
        <div className="content__hero">
          <h1 className="content__heading gs_reveal">
            The Kaloss Coffee Community
          </h1>
        </div>

        <div className="features">
          {/* Feature 1 */}
          <div className="features__item features__item--left gs_reveal gs_reveal_fromLeft">
            <div className="features__image">
              <div className="features__card">
                <img
                  className="features__img"
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Ethiopian Highlands"
                />
              </div>
            </div>
            <div className="features__content">
              <h2 className="features__title gs_reveal">Our Coffee Origins</h2>
              <p className="features__description gs_reveal">
                Sourced from the misty highlands of Ethiopia
                <br />
                Where coffee cherries ripen under volcanic soil
                <br />
                Hand-picked by generational farmers
                <br />
                Each bean carries centuries of tradition
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="features__item features__item--right gs_reveal gs_reveal_fromRight">
            <div className="features__image">
              <div className="features__card">
                <img
                  className="features__img"
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Artisanal Roasting"
                />
              </div>
            </div>
            <div className="features__content">
              <h2 className="features__title gs_reveal">Artisanal Roasting</h2>
              <p className="features__description gs_reveal">
                Small-batch roasted to perfection
                <br />
                Temperature-controlled drum roasting
                <br />
                Unlocking complex flavor profiles
                <br />
                From citrus notes to chocolate undertones
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="features__item features__item--left gs_reveal gs_reveal_fromLeft">
            <div className="features__image">
              <div className="features__card">
                <img
                  className="features__img"
                  src="https://images.unsplash.com/photo-1554119921-6c2e1f6c6d97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Community Events"
                />
              </div>
            </div>
            <div className="features__content">
              <h2 className="features__title gs_reveal">Brewing Workshops</h2>
              <p className="features__description gs_reveal">
                Monthly coffee craftsmanship sessions
                <br />
                Learn pour-over techniques from our masters
                <br />
                Latte art competitions every quarter
                <br />
                Share knowledge with fellow enthusiasts
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="features__item features__item--right gs_reveal gs_reveal_fromRight">
            <div className="features__image">
              <div className="features__card">
                <img
                  className="features__img"
                  src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Sustainable Farming"
                />
              </div>
            </div>
            <div className="features__content">
              <h2 className="features__title gs_reveal">Sustainable Roots</h2>
              <p className="features__description gs_reveal">
                Direct trade with farming cooperatives
                <br />
                15% premium above fair-trade standards
                <br />
                Reforestation initiatives in coffee regions
                <br />
                Water conservation in every process
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
};

export default OurCommunity;
