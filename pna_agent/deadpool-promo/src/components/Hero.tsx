import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const characterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.2
      });

      gsap.from(characterRef.current, {
        scale: 1.2,
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.4
      });

      // Scroll Animation
      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 200,
        scale: 0.8,
        opacity: 0.2
      });

      gsap.to(characterRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: 100,
        scale: 1.1
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-background"></div>
      
      <div className="hero-content container">
        <div className="hero-cast-list">
          <span>Ryan Reynolds</span>
          <span>Karan Soni</span>
          <span>Emma Corrin</span>
          <span>Hugh Jackman</span>
        </div>
        
        <h1 className="hero-title" ref={titleRef}>DEADPOOL</h1>
        
        <div className="hero-bottom flex-between">
          <div className="hero-story">
            <h4>Deadpool III: Story</h4>
            <p>Wolverine joins the "merc with a mouth" in the third installment of the Deadpool film franchise.</p>
          </div>
          
          <button className="btn hero-btn">BOOK NOW</button>
        </div>
      </div>
      
      <img 
        src="/images/hero.png" 
        alt="Hero Character" 
        className="hero-character" 
        ref={characterRef}
      />
    </section>
  );
};

export default Hero;
