import React, { useEffect, useRef } from 'react';

/**
 * Cute professional assistant mascot for the Cache Digitech chatbot.
 * Cursor follow, blink, breathe, idle - inspired by Framer Interactive 3D Pet.
 */
function InteractiveChatBot({
  size = 64,
  active = true,
  thinking = false,
  className = '',
  followStrength = 1,
  staticPose = false,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mx: 0,
    my: 0,
    tx: 0,
    ty: 0,
    lookX: 0,
    lookY: 0,
    blink: 1,
    blinkTimer: 2.6,
    breath: 0,
    idle: 0,
    wobble: 0,
    reduced: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = stateRef.current;
    state.reduced =
      staticPose || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (e) => {
      if (staticPose) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      state.mx = (e.clientX - cx) / Math.max(rect.width, 1);
      state.my = (e.clientY - cy) / Math.max(rect.height, 1);
      state.idle = 0;
    };

    if (!staticPose) {
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    let raf = 0;
    let last = performance.now();

    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state;

      s.idle += dt;
      s.breath += dt * (thinking ? 2.8 : 1.35);
      s.wobble += dt * 1.1;
      s.blinkTimer -= dt;

      if (s.blinkTimer <= 0) {
        s.blink = Math.max(0.06, s.blink - dt * 12);
        if (s.blink <= 0.08) {
          s.blinkTimer = 2.8 + Math.random() * 3.2;
        }
      } else if (s.blink < 1) {
        s.blink = Math.min(1, s.blink + dt * 9);
      }

      const sleeping = !active || s.idle > 7;
      const targetX = sleeping || s.reduced ? 0 : Math.max(-1, Math.min(1, s.mx)) * followStrength;
      const targetY = sleeping || s.reduced ? 0.12 : Math.max(-1, Math.min(1, s.my)) * followStrength;
      const ease = s.reduced ? 1 : 1 - Math.exp(-dt * 8);
      s.lookX += (targetX - s.lookX) * ease;
      s.lookY += (targetY - s.lookY) * ease;
      s.tx += (s.lookX * 4.2 - s.tx) * ease;
      s.ty += (s.lookY * 3.4 - s.ty) * ease;

      const breath = s.reduced ? 0 : Math.sin(s.breath) * (thinking ? 1.4 : 0.95);
      const tilt = s.reduced ? 0 : s.lookX * 6 + Math.sin(s.wobble) * 1.2;

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2 + s.tx, size / 2 + s.ty + breath * 0.7);
      ctx.rotate((tilt * Math.PI) / 180);
      ctx.scale(1 + breath * 0.01, 1 - breath * 0.006);

      const r = size * 0.3;

      // Soft contact shadow
      ctx.beginPath();
      ctx.ellipse(0, r * 1.18, r * 0.72, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fill();

      // Soft halo
      const halo = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.35);
      halo.addColorStop(0, 'rgba(239, 68, 68, 0.28)');
      halo.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Antenna stem
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = Math.max(2, size * 0.028);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.92);
      ctx.quadraticCurveTo(r * 0.08, -r * 1.15, 0, -r * 1.28);
      ctx.stroke();

      // Antenna orb
      const orbY = -r * 1.34;
      const orbR = r * 0.12;
      const orbGrad = ctx.createRadialGradient(-orbR * 0.3, orbY - orbR * 0.3, orbR * 0.1, 0, orbY, orbR);
      orbGrad.addColorStop(0, thinking ? '#fde68a' : '#fca5a5');
      orbGrad.addColorStop(1, thinking ? '#f59e0b' : '#dc2626');
      ctx.beginPath();
      ctx.arc(0, orbY, orbR, 0, Math.PI * 2);
      ctx.fillStyle = orbGrad;
      ctx.fill();
      if (thinking) {
        ctx.beginPath();
        ctx.arc(0, orbY, orbR * 1.55 + Math.sin(s.breath * 2.2) * 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Head fill - brand red
      const headGrad = ctx.createLinearGradient(-r, -r, r, r);
      headGrad.addColorStop(0, '#ef4444');
      headGrad.addColorStop(0.45, '#dc2626');
      headGrad.addColorStop(1, '#991b1b');
      roundRect(ctx, -r, -r * 0.95, r * 2, r * 1.9, r * 0.58);
      ctx.fillStyle = headGrad;
      ctx.fill();

      // Subtle border
      ctx.strokeStyle = 'rgba(127, 29, 29, 0.35)';
      ctx.lineWidth = Math.max(1, size * 0.015);
      ctx.stroke();

      // Top gloss
      const gloss = ctx.createLinearGradient(0, -r * 0.95, 0, -r * 0.1);
      gloss.addColorStop(0, 'rgba(255,255,255,0.35)');
      gloss.addColorStop(1, 'rgba(255,255,255,0)');
      roundRect(ctx, -r * 0.82, -r * 0.88, r * 1.64, r * 0.7, r * 0.4);
      ctx.fillStyle = gloss;
      ctx.fill();

      // Soft ear buds
      drawEar(ctx, -r * 1.05, -r * 0.05, r * 0.18, r * 0.28);
      drawEar(ctx, r * 0.87, -r * 0.05, r * 0.18, r * 0.28);

      // Face panel
      roundRect(ctx, -r * 0.78, -r * 0.42, r * 1.56, r * 1.15, r * 0.36);
      const faceGrad = ctx.createLinearGradient(0, -r * 0.42, 0, r * 0.7);
      faceGrad.addColorStop(0, '#fff5f5');
      faceGrad.addColorStop(1, '#ffe4e6');
      ctx.fillStyle = faceGrad;
      ctx.fill();

      // Eyes - larger, cuter
      const eyeY = -r * 0.06 + s.lookY * 2.6;
      const eyeGap = r * 0.34;
      const eyeRx = r * 0.2;
      const eyeRy = r * 0.22;
      const pupilR = r * 0.095;
      const lid = sleeping ? 0.1 : s.blink;

      drawCuteEye(
        ctx,
        -eyeGap + s.lookX * 3.2,
        eyeY,
        eyeRx,
        eyeRy,
        pupilR,
        lid,
        s.lookX,
        s.lookY,
        sleeping
      );
      drawCuteEye(
        ctx,
        eyeGap + s.lookX * 3.2,
        eyeY,
        eyeRx,
        eyeRy,
        pupilR,
        lid,
        s.lookX,
        s.lookY,
        sleeping
      );

      // Soft blush
      ctx.fillStyle = 'rgba(251, 113, 133, 0.28)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.52, r * 0.28, r * 0.13, r * 0.08, 0, 0, Math.PI * 2);
      ctx.ellipse(r * 0.52, r * 0.28, r * 0.13, r * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = Math.max(1.6, size * 0.028);
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (sleeping) {
        ctx.moveTo(-r * 0.12, r * 0.42);
        ctx.quadraticCurveTo(0, r * 0.48, r * 0.12, r * 0.42);
      } else if (thinking) {
        ctx.moveTo(-r * 0.1, r * 0.4);
        ctx.quadraticCurveTo(0, r * 0.34, r * 0.16, r * 0.4);
      } else {
        ctx.moveTo(-r * 0.18, r * 0.34);
        ctx.quadraticCurveTo(0, r * 0.52, r * 0.18, r * 0.34);
      }
      ctx.stroke();

      ctx.restore();
      if (!staticPose) {
        raf = requestAnimationFrame(draw);
      }
    };

    if (staticPose) {
      draw(performance.now());
      return undefined;
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [size, active, thinking, followStrength, staticPose]);

  return (
    <canvas
      ref={canvasRef}
      className={`cd-interactive-bot ${className}`.trim()}
      width={size}
      height={size}
      aria-hidden
    />
  );
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawEar(ctx, x, y, w, h) {
  roundRect(ctx, x, y, w, h, w * 0.45);
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#f87171');
  g.addColorStop(1, '#b91c1c');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(127, 29, 29, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawCuteEye(ctx, x, y, rx, ry, pupilR, lid, lookX, lookY, sleeping) {
  ctx.save();

  // Eye white
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (!sleeping) {
    const px = x + lookX * rx * 0.32;
    const py = y + lookY * ry * 0.28;

    // Soft iris
    const iris = ctx.createRadialGradient(px, py, pupilR * 0.2, px, py, pupilR * 1.35);
    iris.addColorStop(0, '#402020');
    iris.addColorStop(0.55, '#1f2937');
    iris.addColorStop(1, '#111827');
    ctx.beginPath();
    ctx.ellipse(px, py, pupilR * 1.15, pupilR * 1.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = iris;
    ctx.fill();

    // Big sparkle
    ctx.beginPath();
    ctx.arc(px - pupilR * 0.35, py - pupilR * 0.4, pupilR * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    // Tiny sparkle
    ctx.beginPath();
    ctx.arc(px + pupilR * 0.35, py + pupilR * 0.15, pupilR * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fill();
  } else {
    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - rx * 0.55, y);
    ctx.quadraticCurveTo(x, y + ry * 0.35, x + rx * 0.55, y);
    ctx.stroke();
  }

  // Soft eyelid
  if (lid < 0.98) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 0.5, ry + 0.5, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#fecaca';
    ctx.fillRect(x - rx - 1, y - ry - 1, rx * 2 + 2, (ry * 2 + 2) * (1 - lid));
  }

  ctx.restore();
}

export default InteractiveChatBot;
