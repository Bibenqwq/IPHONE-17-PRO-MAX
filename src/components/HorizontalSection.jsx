import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    num: '01 — CHIP',
    title: 'A19 Pro',
    body: 'A 6-core CPU and 6-core GPU with Neural Accelerators, paired with a vapor chamber for sustained performance under load.',
    index: '01 / 06',
  },
  {
    num: '02 — DISPLAY',
    title: '6.9″ Super Retina XDR',
    body: 'ProMotion up to 120Hz, always-on, and up to 3,000 nits of peak outdoor brightness.',
    index: '02 / 06',
  },
  {
    num: '03 — CAMERA',
    title: 'Triple 48MP Fusion',
    body: 'Main, Ultra Wide, and Telephoto lenses working together for up to 8x optical-quality zoom.',
    index: '03 / 06',
  },
  {
    num: '04 — BATTERY',
    title: 'Built to Outlast',
    body: 'A larger cell and smarter power management stretch a full day into a long one.',
    index: '04 / 06',
  },
  {
    num: '05 — DURABILITY',
    title: 'Ceramic Shield, Front & Back',
    body: 'An aluminum unibody rated IP68, sealed against dust and water up to 6 meters.',
    index: '05 / 06',
  },
];

export default function HorizontalSection() {
  const trackRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const track = trackRef.current;

    function getScrollAmount() {
      return track.scrollWidth - window.innerWidth;
    }

    const anim = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#horizontal-section',
        start: 'top top',
        end: () => '+=' + getScrollAmount(),
        scrub: reduced ? false : 1,
        pin: !reduced,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <section id="horizontal-section">
      <div className="horizontal-track" ref={trackRef}>
        <div className="panel intro">
          <span className="spec-num">SPEC SHEET</span>
          <h3>Six reasons it fits in one hand.</h3>
          <p>Scroll horizontally through what's actually inside the body.</p>
        </div>
        {PANELS.map((p) => (
          <div className="panel" key={p.num}>
            <span className="spec-num">{p.num}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <span className="panel-index">{p.index}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
