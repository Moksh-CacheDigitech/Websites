import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LAYER } from "./geo";
import { buildEarthCloud, detectPerformanceTier } from "./buildEarthCloud";

export interface ParticleEarthProps {
  particleColor?: string;
  lineColor?: string;
  particleSize?: number;
  lineOpacity?: number;
  autoRotationSpeed?: number;
  assembleOnLoad?: boolean;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createDotTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.65)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Cinematic WebGL particle Earth - wireframe + additive cyan dots.
 * Full-bleed absolute fill of its parent. Client-only.
 */
export function ParticleEarth({
  particleColor = "#22d3ee",
  lineColor = "#67e8f9",
  particleSize = 0.14,
  lineOpacity = 0.18,
  autoRotationSpeed = 0.85,
  assembleOnLoad = true,
  className = "",
}: ParticleEarthProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let raf = 0;
    const reduced = prefersReducedMotion();
    const tier = detectPerformanceTier();
    const cloud = buildEarthCloud({
      tier,
      includeSriLanka: true,
      connectWorldLines: tier !== "low",
    });

    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    // Slightly above equatorial view
    camera.position.set(0, 0.38, 3.15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: tier === "high",
      alpha: true,
      powerPreference: tier === "low" ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier === "high" ? 2 : 1.5));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      display: "block",
      width: "100%",
      height: "100%",
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
    });

    const root = new THREE.Group();
    // Face India toward camera initially (India ~78E, 22N)
    root.rotation.y = THREE.MathUtils.degToRad(-78);
    root.rotation.x = THREE.MathUtils.degToRad(8);
    scene.add(root);

    const n = cloud.layers.length;
    const targetPos = cloud.positions;
    const startPos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      // Fly in from depth toward camera
      const spread = 1.2 + Math.random() * 2.4;
      startPos[i3] = (Math.random() - 0.5) * spread;
      startPos[i3 + 1] = (Math.random() - 0.5) * spread;
      startPos[i3 + 2] = 2.2 + Math.random() * 3.5;
    }

    const livePos = new Float32Array(reduced || !assembleOnLoad ? targetPos : startPos);

    // Split into layer geometries for size/opacity control
    const layerSets: Record<number, number[]> = {
      [LAYER.SHELL]: [],
      [LAYER.WORLD]: [],
      [LAYER.INDIA]: [],
      [LAYER.SRI_LANKA]: [],
    };
    for (let i = 0; i < n; i++) layerSets[cloud.layers[i]].push(i);

    const map = createDotTexture();
    const pointsGroups: {
      mesh: THREE.Points;
      indices: number[];
      attr: THREE.BufferAttribute;
    }[] = [];

    const makePoints = (
      indices: number[],
      sizeMul: number,
      opacity: number,
      color: string
    ) => {
      if (!indices.length) return;
      const arr = new Float32Array(indices.length * 3);
      for (let k = 0; k < indices.length; k++) {
        const i3 = indices[k] * 3;
        arr[k * 3] = livePos[i3];
        arr[k * 3 + 1] = livePos[i3 + 1];
        arr[k * 3 + 2] = livePos[i3 + 2];
      }
      const geo = new THREE.BufferGeometry();
      const attr = new THREE.BufferAttribute(arr, 3);
      attr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute("position", attr);
      const mat = new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size: particleSize * sizeMul,
        map,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const mesh = new THREE.Points(geo, mat);
      root.add(mesh);
      pointsGroups.push({ mesh, indices, attr });
    };

    makePoints(layerSets[LAYER.SHELL], 0.55, 0.22, particleColor);
    makePoints(layerSets[LAYER.WORLD], 0.95, 0.55, particleColor);
    makePoints(layerSets[LAYER.INDIA], 1.45, 0.92, "#67e8f9");
    makePoints(layerSets[LAYER.SRI_LANKA], 1.25, 0.8, "#a5f3fc");

    // Lines
    let lineMesh: THREE.LineSegments | null = null;
    if (cloud.lineIndices.length) {
      const lineArr = new Float32Array(cloud.lineIndices.length * 3);
      const writeLines = (src: Float32Array) => {
        for (let i = 0; i < cloud.lineIndices.length; i++) {
          const pi = cloud.lineIndices[i] * 3;
          const o = i * 3;
          lineArr[o] = src[pi];
          lineArr[o + 1] = src[pi + 1];
          lineArr[o + 2] = src[pi + 2];
        }
      };
      writeLines(livePos);
      const lineGeo = new THREE.BufferGeometry();
      const lineAttr = new THREE.BufferAttribute(lineArr, 3);
      lineAttr.setUsage(THREE.DynamicDrawUsage);
      lineGeo.setAttribute("position", lineAttr);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(lineColor),
        transparent: true,
        opacity: lineOpacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      lineMesh = new THREE.LineSegments(lineGeo, lineMat);
      root.add(lineMesh);
      (lineMesh as THREE.LineSegments & { __attr?: THREE.BufferAttribute }).__attr = lineAttr;
    }

    const syncFromLive = () => {
      for (const g of pointsGroups) {
        const arr = g.attr.array as Float32Array;
        for (let k = 0; k < g.indices.length; k++) {
          const i3 = g.indices[k] * 3;
          arr[k * 3] = livePos[i3];
          arr[k * 3 + 1] = livePos[i3 + 1];
          arr[k * 3 + 2] = livePos[i3 + 2];
        }
        g.attr.needsUpdate = true;
      }
      if (lineMesh) {
        const attr = (lineMesh as THREE.LineSegments & { __attr?: THREE.BufferAttribute }).__attr;
        if (attr) {
          const arr = attr.array as Float32Array;
          for (let i = 0; i < cloud.lineIndices.length; i++) {
            const pi = cloud.lineIndices[i] * 3;
            const o = i * 3;
            arr[o] = livePos[pi];
            arr[o + 1] = livePos[pi + 1];
            arr[o + 2] = livePos[pi + 2];
          }
          attr.needsUpdate = true;
        }
      }
    };

    const clock = new THREE.Clock();
    const assembleDuration = 3.4;
    let assembleT = reduced || !assembleOnLoad ? 1 : 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const onResize = () => {
      if (!mount || disposed) return;
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());

      if (assembleT < 1) {
        assembleT = Math.min(1, assembleT + dt / assembleDuration);
        const e = easeOutCubic(assembleT);
        for (let i = 0; i < n * 3; i++) {
          livePos[i] = startPos[i] + (targetPos[i] - startPos[i]) * e;
        }
        syncFromLive();
        if (lineMesh) {
          const mat = lineMesh.material as THREE.LineBasicMaterial;
          mat.opacity = lineOpacity * e;
        }
      }

      if (!reduced) {
        const spin = autoRotationSpeed * 0.15 * dt;
        root.rotation.y += spin;
        root.rotation.x += spin * 0.08;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      for (const g of pointsGroups) {
        g.mesh.geometry.dispose();
        (g.mesh.material as THREE.Material).dispose();
      }
      if (lineMesh) {
        lineMesh.geometry.dispose();
        (lineMesh.material as THREE.Material).dispose();
      }
      map.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [
    particleColor,
    lineColor,
    particleSize,
    lineOpacity,
    autoRotationSpeed,
    assembleOnLoad,
  ]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    />
  );
}

export default ParticleEarth;
