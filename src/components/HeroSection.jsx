import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const canvasRef = useRef(null);
  const cap1Ref = useRef(null);
  const cap2Ref = useRef(null);
  const cap3Ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas3d = canvasRef.current;

    /* --- Scene --- */
    const scene = new THREE.Scene();
    const camera3 = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera3.position.set(0, 0.2, 7.2);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* --- Lighting --- */
    scene.add(new THREE.AmbientLight(0x404040, 1.3));
    const keyLight = new THREE.DirectionalLight(0xfff2df, 1.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xFF6B35, 2.0, 20);
    rimLight.position.set(-3, -1.5, 3.5);
    scene.add(rimLight);
    const coolFill = new THREE.PointLight(0x3A5A8C, 1.4, 20);
    coolFill.position.set(2, -2, -3);
    scene.add(coolFill);

    /* --- Materials --- */
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x232427, metalness: 0.75, roughness: 0.28 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x08090a, metalness: 0.2, roughness: 0.15, emissive: 0x0d0e10, emissiveIntensity: 0.4 });
    const camBumpMat = new THREE.MeshStandardMaterial({ color: 0x1a1b1d, metalness: 0.6, roughness: 0.35 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x05060a, metalness: 0.9, roughness: 0.05 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xFF6B35, emissive: 0xFF6B35, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.4 });
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.1, roughness: 0.5 });

    /* --- Phone Model --- */
    const phoneGroup = new THREE.Group();

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.1, 0.28), phoneMat);
    phoneGroup.add(body);

    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.86, 3.96, 0.02), screenMat);
    screen.position.set(0, 0, 0.15);
    phoneGroup.add(screen);

    const island = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.02), islandMat);
    island.position.set(0, 1.6, 0.17);
    phoneGroup.add(island);

    const camBump = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 0.14), camBumpMat);
    camBump.position.set(-0.32, 1.35, -0.2);
    phoneGroup.add(camBump);

    const lensPositions = [[-0.62, 1.65], [-0.02, 1.65], [-0.32, 1.05]];
    lensPositions.forEach((pos) => {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 32), camBumpMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(pos[0], pos[1], -0.28);
      phoneGroup.add(barrel);

      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 32), lensMat);
      glass.rotation.x = Math.PI / 2;
      glass.position.set(pos[0], pos[1], -0.37);
      phoneGroup.add(glass);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.015, 12, 32), accentMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(pos[0], pos[1], -0.36);
      phoneGroup.add(ring);
    });

    const actionBtn = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.1), phoneMat);
    actionBtn.position.set(-1.03, 1.1, 0);
    phoneGroup.add(actionBtn);

    const camControl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.1), accentMat);
    camControl.position.set(1.03, -1.55, 0);
    phoneGroup.add(camControl);

    const volUp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 0.1), phoneMat);
    volUp.position.set(-1.03, 0.4, 0);
    phoneGroup.add(volUp);

    const volDown = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 0.1), phoneMat);
    volDown.position.set(-1.03, -0.15, 0);
    phoneGroup.add(volDown);

    phoneGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(phoneGroup);

    /* --- Resize --- */
    function resize3D() {
      camera3.aspect = window.innerWidth / window.innerHeight;
      camera3.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize3D);

    /* --- Render Loop --- */
    const clock = new THREE.Clock();
    let rafId;
    function renderLoop() {
      const t = clock.getElapsedTime();
      phoneGroup.position.y = Math.sin(t * 0.6) * 0.05;
      renderer.render(scene, camera3);
      rafId = requestAnimationFrame(renderLoop);
    }
    renderLoop();

    /* --- ScrollTrigger --- */
    const caps = [cap1Ref.current, cap2Ref.current, cap3Ref.current];

    const st = ScrollTrigger.create({
      trigger: '#three-stage',
      start: 'top top',
      end: 'bottom top',
      scrub: reduced ? false : 1,
      pin: !reduced,
      onUpdate: (self) => {
        const p = self.progress;
        phoneGroup.rotation.y = p * Math.PI * 4;
        phoneGroup.rotation.x = Math.sin(p * Math.PI) * 0.12;
        camera3.position.z = 7.2 - p * 2.4;

        const seg = 1 / 3;
        caps.forEach((cap, i) => {
          if (!cap) return;
          const start = i * seg, end = start + seg;
          const mid = (start + end) / 2;
          const dist = Math.abs(p - mid) / (seg / 2);
          cap.style.opacity = Math.max(0, 1 - dist).toString();
        });
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize3D);
      st.kill();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="three-stage">
      <div className="stage-pin">
        <canvas id="three-canvas" ref={canvasRef} />
        <div className="stage-vignette" />

        <div className="cap" ref={cap1Ref}>
          <div className="eyebrow">Aerospace-Grade Aluminum</div>
          <h2>Forged as one piece.<br />Cooled from within.</h2>
          <p>A heat-forged unibody wraps a laser-welded vapor chamber — scroll to rotate.</p>
        </div>
        <div className="cap" ref={cap2Ref}>
          <div className="eyebrow">Ceramic Shield 2</div>
          <h2>Tougher front.<br />Shielded back.</h2>
          <p>3x better scratch resistance up front, 4x better crack resistance on the back.</p>
        </div>
        <div className="cap" ref={cap3Ref}>
          <div className="eyebrow">A19 Pro Chip</div>
          <h2>The fastest chip<br />ever in a phone.</h2>
          <p>A 6-core CPU and GPU with Neural Accelerators, built for sustained performance.</p>
        </div>

        <div className="scroll-cue">
          <span>Scroll</span>
          <span className="line" />
        </div>
      </div>
    </section>
  );
}
