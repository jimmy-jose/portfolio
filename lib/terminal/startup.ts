export const STARTUP_COMMAND = 'whoami';
export const STARTUP_DURATION = 2850;
export type StartupPhase =
  | 'crt'
  | 'prompt'
  | 'typing'
  | 'enter'
  | 'reveal'
  | 'ready';
export type StartupFrame = { phase: StartupPhase; typed: string };

/** A deterministic timeline: the command is complete before Enter and output. */
export function startupFrame(elapsed: number): StartupFrame {
  if (elapsed < 650) return { phase: 'crt', typed: '' };
  if (elapsed < 1000) return { phase: 'prompt', typed: '' };
  if (elapsed < 1720)
    return {
      phase: 'typing',
      typed: STARTUP_COMMAND.slice(
        0,
        Math.min(6, Math.floor((elapsed - 1000) / 100) + 1),
      ),
    };
  if (elapsed < 1950) return { phase: 'enter', typed: STARTUP_COMMAND };
  if (elapsed < STARTUP_DURATION)
    return { phase: 'reveal', typed: STARTUP_COMMAND };
  return { phase: 'ready', typed: STARTUP_COMMAND };
}
