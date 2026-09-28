import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TrailerSection.css';

gsap.registerPlugin(ScrollTrigger);

const TrailerSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'center center',
          scrub: 1
        },
        x: -100,
        opacity: 0
      });

      gsap.from(posterRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'center center',
          scrub: 1
        },
        x: 100,
        scale: 0.9,
        opacity: 0,
        rotation: 5
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="trailer-section container" ref={sectionRef}>
      <div className="trailer-content" ref={textRef}>
        <h2 className="section-title">
          DIRECTED <br/> BY <span className="text-primary">SHAWN LEVY</span>
        </h2>
        <div className="trailer-details">
          <div className="detail-item">
            <span className="detail-label">Trailer</span>
            <span className="detail-value">1:47"</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Release</span>
            <span className="detail-value bg-primary">MAY 6</span>
          </div>
        </div>
        <p className="trailer-quote">
          "Hugh Jackman said he really was done playing the character of Logan/Wolverine after 2017's 'Logan'."
        </p>
      </div>
      
      <div className="trailer-poster-wrapper">
        <img 
          src="/images/poster.png" 
          alt="Deadpool Poster" 
          className="trailer-poster" 
          ref={posterRef}
        />
        <div className="play-button">
           <div className="play-icon"></div>
        </div>
      </div>
    </section>
  );
};

export default TrailerSection;
