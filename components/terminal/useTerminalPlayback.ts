'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createCommandQueue,
  playbackDelay,
  printableOutput,
  printDuration,
} from '@/lib/terminal/playback';
import type { CommandResult, SessionEntry } from '@/lib/terminal/types';

export type PlaybackFrame = {
  phase: 'typing' | 'printing';
  command: string;
  cwd: string;
  typed: string;
  entryId?: number;
  text: string;
};
type Options = {
  prepare: (command: string) => SessionEntry | undefined;
  complete: (entry: SessionEntry) => void;
  getCwd: () => string;
};

export function useTerminalPlayback({ prepare, complete, getCwd }: Options) {
  const [playback, setPlayback] = useState<PlaybackFrame | null>(null);
  const [busy, setBusy] = useState(false);
  const queue = useRef(createCommandQueue());
  const handlers = useRef({ prepare, complete, getCwd });
  useEffect(() => {
    handlers.current = { prepare, complete, getCwd };
  }, [prepare, complete, getCwd]);
  const lifecycle = useRef(new AbortController());
  const pending = useRef(0);
  const fast = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    lifecycle.current = controller;
    return () => controller.abort();
  }, []);
  const skipPrinting = useCallback(() => {
    fast.current = true;
  }, []);

  const play = useCallback(
    (
      command: string,
      typeCommand: boolean,
    ): Promise<CommandResult | undefined> => {
      if (!command.trim()) return Promise.resolve(undefined);
      const signal = lifecycle.current.signal;
      pending.current++;
      setBusy(true);
      return queue.current(async () => {
        const preference = matchMedia('(prefers-reduced-motion: reduce)');
        const instant = () => fast.current || preference.matches;
        const animate = async (
          text: string,
          duration: number,
          frame: PlaybackFrame,
        ) => {
          if (signal.aborted) return;
          if (instant()) {
            setPlayback({
              ...frame,
              text,
              typed: frame.phase === 'typing' ? text : frame.typed,
            });
            return;
          }
          const start = performance.now();
          let amount = 0;
          setPlayback(frame);
          while (amount < text.length && !signal.aborted) {
            if (!(await playbackDelay(25, signal))) return;
            amount = instant()
              ? text.length
              : Math.min(
                  text.length,
                  Math.ceil(
                    ((performance.now() - start) / duration) * text.length,
                  ),
                );
            setPlayback({
              ...frame,
              typed:
                frame.phase === 'typing' ? text.slice(0, amount) : frame.typed,
              text: frame.phase === 'printing' ? text.slice(0, amount) : '',
            });
          }
        };
        try {
          if (signal.aborted) return;
          const cwd = handlers.current.getCwd();
          if (typeCommand) {
            await animate(
              command,
              Math.min(650, Math.max(160, command.length * 23)),
              { phase: 'typing', command, cwd, typed: '', text: '' },
            );
            if (!instant()) await playbackDelay(110, signal);
          }
          if (signal.aborted) return;
          const entry = handlers.current.prepare(command);
          if (!entry) return;
          const frame: PlaybackFrame = {
            phase: 'printing',
            command,
            cwd,
            typed: command,
            entryId: entry.id,
            text: '',
          };
          setPlayback(frame);
          const text = printableOutput(entry.result);
          await animate(text, printDuration(entry.result), frame);
          if (signal.aborted) return;
          if (!instant()) await playbackDelay(text ? 130 : 90, signal);
          if (signal.aborted) return;
          handlers.current.complete(entry);
          return entry.result;
        } finally {
          pending.current--;
          if (!signal.aborted && pending.current === 0) {
            setPlayback(null);
            setBusy(false);
            fast.current = false;
          }
        }
      });
    },
    [],
  );

  const run = useCallback((command: string) => play(command, true), [play]);
  const submit = useCallback((command: string) => play(command, false), [play]);
  const runCommands = useCallback(
    (commands: string[]) => {
      for (const command of commands) void play(command, true);
    },
    [play],
  );
  return { playback, busy, run, submit, runCommands, skipPrinting };
}
