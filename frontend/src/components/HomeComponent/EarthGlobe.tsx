import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Photoreal classroom-style Earth with political/topo color map + glossy lighting.
 */
export default function EarthGlobe() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let raf = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let fling = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 3.15;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const globe = new THREE.Group();
    // Classroom globe axial tilt
    globe.rotation.z = THREE.MathUtils.degToRad(23.4);
    scene.add(globe);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    // Key light from top-right for the glossy highlight
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(4.2, 2.8, 3.2);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x9ec9ff, 0.35);
    fill.position.set(-3, -1, 2);
    scene.add(fill);

    const loader = new THREE.TextureLoader();
    const map = loader.load(
      "/globe/earth-blue-marble.jpg",
      () => {
        if (!disposed) paint();
      },
    );
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const earthMat = new THREE.MeshPhongMaterial({
      map,
      shininess: 28,
      specular: new THREE.Color(0x335577),
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMat);
    globe.add(earth);

    // Soft atmosphere rim
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x6eb6ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmos = new THREE.Mesh(new THREE.SphereGeometry(1.035, 64, 64), atmosMat);
    globe.add(atmos);

    // Subtle specular ocean sheen layer
    const sheen = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x1a6bb5,
        transparent: true,
        opacity: 0.08,
        shininess: 90,
        specular: new THREE.Color(0xffffff),
      }),
    );
    globe.add(sheen);

    function measure() {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    function paint() {
      measure();
      renderer.render(scene, camera);
    }

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      fling = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      host.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      globe.rotation.y += dx * 0.005;
      globe.rotation.x = THREE.MathUtils.clamp(
        globe.rotation.x + dy * 0.003,
        -0.7,
        0.7,
      );
      fling = dx * 0.005;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        host.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);
    host.addEventListener("pointerleave", onPointerUp);

    const ro = new ResizeObserver(() => paint());
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(host);

    const clock = new THREE.Clock();
    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(0.05, clock.getDelta());
      if (!dragging) {
        globe.rotation.y += (0.08 + fling) * dt;
        fling *= 0.95;
      }
      renderer.render(scene, camera);
    };
    measure();
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("pointerleave", onPointerUp);
      map.dispose();
      earth.geometry.dispose();
      earthMat.dispose();
      atmos.geometry.dispose();
      atmosMat.dispose();
      sheen.geometry.dispose();
      (sheen.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
      aria-hidden
    />
  );
}
