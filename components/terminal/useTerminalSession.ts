'use client';
import { useCallback, useRef, useState } from 'react';
import { useTerminalPlayback } from './useTerminalPlayback';
import { executeCommand } from '@/lib/terminal/executeCommand';
import type { SessionEntry, TerminalContext } from '@/lib/terminal/types';
import type { GameId } from '@/lib/games/gameLauncher';
export function useTerminalSession() {
  const context = useRef<TerminalContext>({ cwd: '/', history: [] });
  const sequence = useRef(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [cwd, setCwd] = useState('/');
  const [history, setHistory] = useState<string[]>([]);
  const [exited, setExited] = useState(false);
  const [intense, setIntense] = useState(false);
  const [project, setProject] = useState<string | null>(null);
  const [game, setGame] = useState<GameId | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const prepare = useCallback((input: string): SessionEntry | undefined => {
    const command = input.trim();
    if (!command) return;
    const before = context.current;
    const nextHistory = [...before.history, command];
    const result = executeCommand(command, { ...before, history: nextHistory });
    context.current = { cwd: result.cwd ?? before.cwd, history: nextHistory };
    setCwd(context.current.cwd);
    setHistory(nextHistory);
    const entry: SessionEntry = {
      id: ++sequence.current,
      command,
      cwd: before.cwd,
      result,
    };
    setEntries((previous) =>
      result.effect === 'clear' ? [] : [...previous, entry],
    );
    return entry;
  }, []);
  const complete = useCallback((entry: SessionEntry) => {
    const { result } = entry;
    if (result.effect === 'exit') setExited(true);
    if (result.effect === 'matrix') setIntense((previous) => !previous);
    if (result.project) setProject(result.project);
    if (result.game) {
      setProject(null);
      setGame(result.game);
    }
    setAnnouncement(
      result.text ??
        (result.entries
          ? result.entries.map((item) => item.name).join(', ')
          : result.view === 'identity'
            ? 'Jimmy Jose. Senior Software Engineer. 10 years building production software.'
            : result.cwd
              ? `Current directory: ${result.cwd}`
              : 'Screen cleared.'),
    );
  }, []);
  const getCwd = useCallback(() => context.current.cwd, []);
  const playback = useTerminalPlayback({ prepare, complete, getCwd });
  // Startup already types its command; commit through the same engine once.
  const runImmediate = useCallback(
    (command: string) => {
      const entry = prepare(command);
      if (entry) complete(entry);
      return entry?.result;
    },
    [prepare, complete],
  );
  const { runCommands } = playback;
  const reconnect = useCallback(() => {
    setExited(false);
    runCommands(['cd /', 'whoami']);
  }, [runCommands]);
  const exitGame = useCallback((score: number) => {
    setGame(null);
    const text = `snake.exe terminated.\n\nFinal score: ${score}`;
    setEntries((previous) => [
      ...previous,
      {
        id: ++sequence.current,
        command: '',
        cwd: context.current.cwd,
        result: { text },
        system: true,
      },
    ]);
    setAnnouncement(text);
  }, []);
  return {
    entries,
    cwd,
    history,
    exited,
    intense,
    project,
    game,
    announcement,
    ...playback,
    runImmediate,
    reconnect,
    setIntense,
    setProject,
    exitGame,
  };
}
