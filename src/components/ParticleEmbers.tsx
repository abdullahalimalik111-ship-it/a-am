/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export const ParticleEmbers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '#ff4500', // OrangeRed
      '#ff6b35', // Fire orange
      '#ffbe0b', // Ember yellow
      '#dc2626', // Crimson red
      '#991b1b', // Deep curse blood
    ];

    const particleCount = 45;
    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      const maxLife = 120 + Math.random() * 160;
      return {
        x: Math.random() * width,
        y: height + Math.random() * 40,
        size: 1.5 + Math.random() * 2.8,
        speedY: -(0.6 + Math.random() * 1.6),
        speedX: (Math.random() - 0.5) * 0.9,
        opacity: 0,
        maxOpacity: 0.3 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      const p = createParticle();
      p.y = Math.random() * height; // scatter initially
      particles.push(p);
    }

    let lastDraw = performance.now();

    const render = (time: number) => {
      // Throttle to ~30-40fps to save container CPU
      if (time - lastDraw >= 28) {
        lastDraw = time;
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.life++;
          p.y += p.speedY;
          p.x += p.speedX;

          // Fade in and out
          const progress = p.life / p.maxLife;
          if (progress < 0.2) {
            p.opacity = (progress / 0.2) * p.maxOpacity;
          } else if (progress > 0.8) {
            p.opacity = ((1 - progress) / 0.2) * p.maxOpacity;
          } else {
            p.opacity = p.maxOpacity;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color;
          ctx.fill();

          if (p.life >= p.maxLife || p.y < -10) {
            particles[i] = createParticle();
          }
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 w-full h-full mix-blend-screen opacity-90"
      aria-hidden="true"
    />
  );
};
