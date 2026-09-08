'use client';
import { useEffect, useState } from 'react';
const checks = [
  'Mobile systems',
  'Cloud infrastructure',
  'Backend services',
  'AI systems',
  'Projects',
];
export function TerminalBoot({
  onComplete,
}: {
  onComplete: (skip: boolean) => void;
}) {
  const [line, setLine] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visited = false;
    try {
      visited = sessionStorage.getItem('jimmy-boot') === 'done';
    } catch {}
    const finish = (skip: boolean) => {
      try {
        sessionStorage.setItem('jimmy-boot', 'done');
      } catch {}
      onComplete(skip);
    };
    if (reduced.matches || visited) {
      finish(true);
      return;
    }
    const skip = () => finish(true);
    window.addEventListener('keydown', skip, { once: true });
    const interval = window.setInterval(
      () => setLine((previous) => previous + 1),
      260,
    );
    const timer = window.setTimeout(() => finish(false), 2200);
    const onMotion = () => {
      if (reduced.matches) finish(true);
    };
    reduced.addEventListener('change', onMotion);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      window.removeEventListener('keydown', skip);
      reduced.removeEventListener('change', onMotion);
    };
  }, [onComplete]);
  return (
    <button
      className="boot-screen"
      onClick={() => onComplete(true)}
      aria-label="Skip startup sequence"
    >
      <span className="boot-content">
        <span className="boot-title">
          JIMMY.DEV BIOS <span>v10.0</span>
        </span>
        <span className="boot-subtitle">Initializing profile...</span>
        <span className="boot-checks">
          {checks.map((check, index) => (
            <span
              key={check}
              style={{ visibility: line > index ? 'visible' : 'hidden' }}
            >
              {check}
              <span className="boot-dots">..........</span>
              <b>OK</b>
            </span>
          ))}
        </span>
        <span className="boot-start">
          {line > 5 ? 'Starting shell...' : 'Establishing connection...'}
          <span className="block-cursor" />
        </span>
        <span className="boot-skip">PRESS ANY KEY OR TAP TO SKIP</span>
      </span>
    </button>
  );
}
