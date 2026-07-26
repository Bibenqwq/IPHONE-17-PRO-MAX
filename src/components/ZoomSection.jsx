import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LENS_RINGS = 6;
const ZOOM_LEVELS = ['1.0x', '2.0x', '3.0x', '4.0x', '6.0x', '8.0x'];

function drawZoomFrame(ctx, progress, zW, zH) {
  ctx.clearRect(0, 0, zW, zH);

  const cx = zW / 2, cy = zH / 2;
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(zW, zH) * 0.6);
  bgGrad.addColorStop(0, 'rgba(58,90,140,0.22)');
  bgGrad.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, zW, zH);

  const maxR = Math.min(zW, zH) * 0.32;

  for (let i = 0; i < LENS_RINGS; i++) {
    const t = i / (LENS_RINGS - 1);
    const baseR = maxR * (0.35 + t * 0.65);
    const drift = progress * (i - LENS_RINGS / 2) * 6;
    const r = baseR - progress * maxR * 0.18 * t;

    ctx.save();
    ctx.translate(cx, cy + drift);
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(r, 4), 0, Math.PI * 2);
    const alpha = 0.5 - t * 0.35;
    ctx.strokeStyle = `rgba(184,186,190,${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  const openR = maxR * 0.3 + progress * maxR * 0.08;
  const glintGrad = ctx.createRadialGradient(cx - openR * 0.25, cy - openR * 0.25, 0, cx, cy, openR);
  glintGrad.addColorStop(0, 'rgba(255,107,53,0.9)');
  glintGrad.addColorStop(0.4, 'rgba(58,90,140,0.2)');
  glintGrad.addColorStop(1, 'rgba(0,0,0,0.9)');
  ctx.beginPath();
  ctx.arc(cx, cy, openR, 0, Math.PI * 2);
  ctx.fillStyle = glintGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, maxR * 1.15, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,107,53,0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

export default function ZoomSection() {
  const canvasRef = useRef(null);
  const [zoomLabel, setZoomLabel] = useState('1.0x');
  const progressRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let zW, zH, dpr;

    function resizeZoom() {
      dpr = Math.min(window.devicePixelRatio, 2);
      zW = window.innerWidth;
      zH = window.innerHeight;
      canvas.width = zW * dpr;
      canvas.height = zH * dpr;
      canvas.style.width = zW + 'px';
      canvas.style.height = zH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function handleResize() {
      resizeZoom();
      drawZoomFrame(ctx, progressRef.current, zW, zH);
    }

    resizeZoom();
    drawZoomFrame(ctx, 0, zW, zH);
    window.addEventListener('resize', handleResize);

    const st = ScrollTrigger.create({
      trigger: '#frame-sequence',
      start: 'top top',
      end: 'bottom top',
      scrub: reduced ? false : true,
      pin: !reduced,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        drawZoomFrame(ctx, self.progress, zW, zH);
        const idx = Math.min(ZOOM_LEVELS.length - 1, Math.floor(self.progress * (ZOOM_LEVELS.length - 1) + 0.001));
        setZoomLabel(ZOOM_LEVELS[idx]);
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      st.kill();
    };
  }, []);

  return (
    <section id="frame-sequence">
      <div className="frame-pin">
        <canvas id="zoom-canvas" ref={canvasRef} />
        <div className="zoom-readout">
          TELEPHOTO <span>{zoomLabel}</span>
        </div>
        <div className="frame-caption">
          <div className="eyebrow">Triple 48MP Fusion Camera</div>
          <h2>Reach further.<br />Lose nothing.</h2>
        </div>
      </div>
    </section>
  );
}
