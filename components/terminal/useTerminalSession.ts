'use client';
import { useCallback, useRef, useState } from 'react';
import { executeCommand } from '@/lib/terminal/executeCommand';
import type { SessionEntry, TerminalContext } from '@/lib/terminal/types';
export function useTerminalSession() {
  const context = useRef<TerminalContext>({ cwd: '/', history: [] });
  const sequence = useRef(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [cwd, setCwd] = useState('/');
  const [history, setHistory] = useState<string[]>([]);
  const [exited, setExited] = useState(false);
  const [intense, setIntense] = useState(false);
  const [project, setProject] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const run = useCallback((input: string) => {
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
    if (result.effect === 'exit') setExited(true);
    if (result.effect === 'matrix') setIntense((previous) => !previous);
    if (result.project) setProject(result.project);
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
    return result;
  }, []);
  const runCommands = useCallback(
    (commands: string[]) => commands.forEach(run),
    [run],
  );
  const reconnect = useCallback(() => {
    setExited(false);
    run('cd /');
    run('whoami');
  }, [run]);
  return {
    entries,
    cwd,
    history,
    exited,
    intense,
    project,
    announcement,
    run,
    runCommands,
    reconnect,
    setIntense,
    setProject,
  };
}
