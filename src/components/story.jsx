import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './story.css';

gsap.registerPlugin(ScrollTrigger);

const KalossGallery = () => {
  useEffect(() => {
    gsap.to("img", { opacity: 1, delay: 0.1 });

    let iteration = 0;
    const spacing = 0.1;
    const snap = gsap.utils.snap(spacing);
    const cards = gsap.utils.toArray('.cards li');
    const seamlessLoop = buildSeamlessLoop(cards, spacing);

    const scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: "power3",
      paused: true
    });

    const trigger = ScrollTrigger.create({
      start: 0,
      onUpdate(self) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self);
        } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
          wrapBackward(self);
        } else {
          scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
          scrub.invalidate().restart();
          self.wrapping = false;
        }
      },
      end: "+=3000",
      pin: ".gallery"
    });

    function wrapForward(trigger) {
      iteration++;
      trigger.wrapping = true;
      trigger.scroll(trigger.start + 1);
    }

    function wrapBackward(trigger) {
      iteration--;
      if (iteration < 0) {
        iteration = 9;
        seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10);
        scrub.pause();
      }
      trigger.wrapping = true;
      trigger.scroll(trigger.end - 1);
    }

    function scrubTo(totalTime) {
      let progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
      if (progress > 1) {
        wrapForward(trigger);
      } else if (progress < 0) {
        wrapBackward(trigger);
      } else {
        trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
      }
    }

    function buildSeamlessLoop(items, spacing) {
      let overlap = Math.ceil(1 / spacing),
        startTime = items.length * spacing + 0.5,
        loopTime = (items.length + overlap) * spacing + 1,
        rawSequence = gsap.timeline({ paused: true }),
        seamlessLoop = gsap.timeline({
          paused: true,
          repeat: -1,
          onRepeat() {
            this._time === this._dur && (this._tTime += this._dur - 0.01);
          }
        }),
        l = items.length + overlap * 2,
        time = 0;

      gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

      for (let i = 0; i < l; i++) {
        let index = i % items.length;
        let item = items[index];
        time = i * spacing;

        rawSequence.fromTo(item,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false },
          time
        ).fromTo(item,
          { xPercent: 400 },
          { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
          time
        );

        if (i <= items.length) {
          seamlessLoop.add("label" + i, time);
        }
      }

      rawSequence.time(startTime);

      seamlessLoop.to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: "none"
      }).fromTo(rawSequence,
        { time: overlap * spacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: "none"
        }
      );

      return seamlessLoop;
    }

    document.querySelector(".next").addEventListener("click", () =>
      scrubTo(scrub.vars.totalTime + spacing)
    );
    document.querySelector(".prev").addEventListener("click", () =>
      scrubTo(scrub.vars.totalTime - spacing)
    );
  }, []);

  return (
    <div className="gallery">
      <ul className="cards">
        <li>
          <img src="https://kaloss.coffee/images/yirgacheffe.png" alt="Yirgacheffe Coffee" />
          <div className="card-details">Yirgacheffe - ኢትቢ 450</div>
        </li>
        <li>
          <img src="https://kaloss.coffee/images/sidamo.png" alt="Sidamo Coffee" />
          <div className="card-details">Sidamo - ኢትቢ 400</div>
        </li>
        <li>
          <img src="https://kaloss.coffee/images/harrar.png" alt="Harrar Coffee" />
          <div className="card-details">Harrar - ኢትቢ 420</div>
        </li>
        <li>
          <img src="https://kaloss.coffee/images/limu.png" alt="Limu Coffee" />
          <div className="card-details">Limu - ኢትቢ 430</div>
        </li>
        <li>
          <img src="https://kaloss.coffee/images/jimma.png" alt="Jimma Coffee" />
          <div className="card-details">Jimma - ኢትቢ 390</div>
        </li>
        <li>
          <img src="https://kaloss.coffee/images/benchmaji.png" alt="Bench Maji Coffee" />
          <div className="card-details">Bench Maji - ኢትቢ 460</div>
        </li>
      </ul>
      <div className="actions">
        <button className="prev">Prev</button>
        <button className="next">Next</button>
      </div>
    </div>
  );
};

export default KalossGallery;
