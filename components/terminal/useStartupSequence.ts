'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { STARTUP_COMMAND, startupFrame } from '@/lib/terminal/startup';

export function useStartupSequence(run: (command: string) => unknown) {
  const [frame, setFrame] = useState(() => startupFrame(0));
  const executed = useRef(false);
  const finished = useRef(false);
  const executeIdentity = useCallback(() => {
    if (executed.current) return;
    executed.current = true;
    run(STARTUP_COMMAND);
  }, [run]);
  const skip = useCallback(() => {
    finished.current = true;
    executeIdentity();
    setFrame({ phase: 'ready', typed: STARTUP_COMMAND });
  }, [executeIdentity]);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) {
      const immediate = requestAnimationFrame(skip);
      return () => cancelAnimationFrame(immediate);
    }
    const start = performance.now();
    let animation = 0;
    const tick = (now: number) => {
      if (finished.current) return;
      const next = startupFrame(now - start);
      if (next.phase === 'reveal' || next.phase === 'ready') executeIdentity();
      setFrame((previous) =>
        previous.phase === next.phase && previous.typed === next.typed
          ? previous
          : next,
      );
      if (next.phase === 'ready') {
        finished.current = true;
        return;
      }
      animation = requestAnimationFrame(tick);
    };
    const onMotion = () => {
      if (preference.matches) skip();
    };
    const onKey = (event: KeyboardEvent) => {
      if (finished.current || event.metaKey || event.ctrlKey || event.altKey)
        return;
      event.preventDefault();
      skip();
    };
    const onPointer = () => {
      if (!finished.current) skip();
    };
    animation = requestAnimationFrame(tick);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    preference.addEventListener('change', onMotion);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
      preference.removeEventListener('change', onMotion);
    };
  }, [executeIdentity, skip]);
  return { ...frame, skip };
}
