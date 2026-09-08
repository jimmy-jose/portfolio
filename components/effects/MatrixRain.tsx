'use client';
import { useEffect, useRef } from 'react';
export function MatrixRain({
  intense,
  enabled,
}: {
  intense: boolean;
  enabled: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const surface = canvas.current,
      context = surface?.getContext('2d');
    if (!surface || !context || !enabled) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      drops: number[] = [];
    const glyphs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ';
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      surface.width = width * ratio;
      surface.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drops = Array.from(
        { length: Math.ceil(width / (width < 700 ? 45 : 30)) },
        () => (-Math.random() * height) / 18,
      );
      context.clearRect(0, 0, width, height);
    };
    const draw = (time: number) => {
      if (document.hidden || reduced.matches) return;
      frame = requestAnimationFrame(draw);
      if (time - last < (intense ? 50 : 95)) return;
      last = time;
      context.fillStyle = 'rgba(8,12,9,0.09)';
      context.fillRect(0, 0, width, height);
      context.font = '13px monospace';
      context.fillStyle = intense ? '#82ed6c' : '#4d8b45';
      drops.forEach((drop, index) => {
        if (!intense && index % 3 !== 0) return;
        const x = index * (width < 700 ? 45 : 30);
        context.fillText(
          glyphs[Math.floor(Math.random() * glyphs.length)],
          x,
          drop * 18,
        );
        drops[index] += intense ? 1.15 : 0.55;
        if (drop * 18 > height && Math.random() > 0.975)
          drops[index] = -Math.random() * 30;
      });
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced.matches)
        frame = requestAnimationFrame(draw);
      else if (reduced.matches) context.clearRect(0, 0, width, height);
    };
    resize();
    resume();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', resume);
    reduced.addEventListener('change', resume);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', resume);
      reduced.removeEventListener('change', resume);
      context.clearRect(0, 0, width, height);
    };
  }, [intense, enabled]);
  return (
    <canvas
      ref={canvas}
      className={`matrix-rain ${intense ? 'intense' : ''}`}
      aria-hidden="true"
    />
  );
}
