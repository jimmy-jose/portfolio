'use client';
export function TerminalBoot({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      className="crt-startup"
      onClick={onSkip}
      aria-label="Skip CRT startup animation"
    >
      <span className="crt-startup-beam" aria-hidden="true" />
      <span className="crt-startup-skip">
        POWERING ON · TAP OR PRESS ANY KEY TO SKIP
      </span>
    </button>
  );
}
