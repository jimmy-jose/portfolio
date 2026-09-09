import { contact } from '../../data/portfolio';
import type { CommandResult } from './types';

export function printableOutput(result: CommandResult): string {
  if (result.view === 'identity')
    return 'Jimmy Jose\nSenior Software Engineer\n\n10 years building production software across backend, full stack and mobile.\n\nGo · Kotlin · Next.js · Distributed Systems · AI\n\nI build products end-to-end:\narchitecture → development → deployment → production';
  if (result.view === 'contact')
    return [
      'CONTACT',
      '',
      ...Object.entries(contact)
        .filter(([, value]) => value)
        .map(([label, value]) => `${label.padEnd(10)} ${value}`),
    ].join('\n');
  if (result.text) return result.text;
  return (
    result.entries
      ?.map((entry) => `${entry.name}${entry.directory ? '/' : ''}`)
      .join('\n') ?? ''
  );
}

export function printDuration(result: CommandResult): number {
  const text = printableOutput(result);
  if (!text) return 90;
  const lines = text.split('\n').length;
  return Math.min(2200, Math.max(300, text.length * 3, lines * 95));
}

/** Abortable delay: cancellation releases the timer and never rejects a queued job. */
export function playbackDelay(
  milliseconds: number,
  signal: AbortSignal,
): Promise<boolean> {
  if (signal.aborted) return Promise.resolve(false);
  return new Promise((resolve) => {
    const finish = (complete: boolean) => {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      resolve(complete);
    };
    const onAbort = () => finish(false);
    const timer = setTimeout(() => finish(true), milliseconds);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/** Appends whole navigation batches before any later click can interleave them. */
export function createCommandQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return function enqueue<T>(job: () => Promise<T>): Promise<T> {
    const next = tail.then(job);
    tail = next.catch(() => undefined);
    return next;
  };
}
