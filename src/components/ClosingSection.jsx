import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ClosingSection() {
  useEffect(() => {
    const anims = gsap.utils.toArray('.reveal').map((el) =>
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    );

    return () => {
      anims.forEach((a) => {
        a.scrollTrigger?.kill();
        a.kill();
      });
    };
  }, []);

  return (
    <section id="closing">
      <div className="closing-hero">
        <h2 className="reveal">
          Pro, in<br />every direction.
        </h2>
        <p className="reveal">
          Available in Cosmic Orange, Silver, and Deep Blue — up to 2TB of storage.
        </p>
        <div className="cta-row reveal">
          <button className="btn primary">Explore iPhone 17 Pro Max</button>
          <button className="btn">Watch the film</button>
        </div>
      </div>
      <footer>
        <span>iPhone 17 PRO MAX — A19 PRO</span>
        <span>SCROLL JOURNEY — 1200VH</span>
      </footer>
    </section>
  );
}
