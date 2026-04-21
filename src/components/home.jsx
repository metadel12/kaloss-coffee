import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import "./Home.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

function Home() {
  return (
    <div className="tow">
      <div className="lftTwo">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#FA4D56"
            d="M23.9,-36.7C35.1,-30,51.2,-30.3,59.4,-23.8C67.7,-17.2,68.2,-3.6,67.6,10.6C66.9,24.9,65.1,39.9,55.8,45.6C46.6,51.4,29.8,47.8,17.5,44.6C5.2,41.3,-2.6,38.3,-15.1,39.9C-27.7,41.6,-45,47.8,-49.2,42.7C-53.3,37.7,-44.4,21.4,-45,7.4C-45.6,-6.7,-55.8,-18.4,-55,-27.1C-54.1,-35.9,-42.3,-41.6,-31.3,-48.4C-20.3,-55.2,-10.1,-63.1,-1.9,-60.1C6.3,-57.2,12.7,-43.4,23.9,-36.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="rthTow">
        <p>
          Welcome to Kaloss Coffee – Where Culture Meets Quality. Kaloss Coffee
          is a proudly Ethiopian-born brand rooted in tradition, quality, and
          experience. We source our beans from rich, highland farms, and our
          roasting process brings out the true essence of Ethiopian coffee
          heritage. But what makes us truly unique is our approach: blending
          traditional coffee artistry . Whether you're enjoying our coffee from
          afar or visiting our interactive website, Kaloss is more than a
          drink—it's a cultural journey. Join us in celebrating the aroma,
          taste, and story of every bean we serve.
        </p>
      </div>
      <TextScramble />
    </div>
  );
}

function TextScramble() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const textRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const textElements = textRefs.current;

    const cursorTl = gsap.timeline({ repeat: -1 });
    cursorTl
      .to(cursor, {
        opacity: 0,
        duration: 0.5,
        ease: "none",
        delay: 0.2,
      })
      .to(cursor, {
        opacity: 1,
        duration: 0.5,
        ease: "none",
        delay: 0.2,
      });

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    tl.to(textElements[0].current, {
      scrambleText: {
        text: "Welcome to kaloss coffee.",
        chars: "lowerCase",
      },
      duration: 2,
    })
      .to(textElements[1].current, {
        scrambleText: {
          text: "I have a headache don't talk to me i need my coffee i don't want tea don't give me decaf it makes me angry just wake up and everything is annoying i just want my coffee coffee coffee oh oh ",
          chars: "XO",
          speed: 0.4,
        },
        duration: 2,
      })
      .to(textElements[2].current, {
        scrambleText: { text: " coffee,", chars: "" },
        duration: 2,
      })
      .to(textElements[3].current, {
        scrambleText: { text: "", chars: "", speed: 0.3 },
        duration: 1,
      })
      .to(textElements[4].current, {
        scrambleText: {
          text: "or kaloss.",
          chars: "lowerCase",
          speed: 0.3,
        },
        duration: 1.5,
      })
      .add(cursorTl);

    const restart = () => tl.restart();
    container?.addEventListener("click", restart);

    return () => {
      tl.kill();
      cursorTl.kill();
      container?.removeEventListener("click", restart);
    };
  }, []); // Safe because refs never change

  return (
    <div ref={containerRef} className="scrambleContainer">
      <div className="scrambleText">
        <span ref={textRefs.current[0]}></span>
        <br />
        <span ref={textRefs.current[1]}></span>
        <span ref={textRefs.current[2]}></span>
        <span ref={textRefs.current[3]}></span>
        <span ref={textRefs.current[4]}></span>
        <span ref={cursorRef} className="scrambleCursor">
          |
        </span>
      </div>
      {/* <div className="home-links">
          <a href="#product" className="home-btn">See Our Products</a>
          <a href="#ourcommunity" className="home-btn">Join Our Community</a>
          <a href="#testimonial" className="home-btn">What People Say</a>
        </div> */}
    </div>
  );
}

export default Home;
