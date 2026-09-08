'use client';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import type { CommandResult } from '@/lib/terminal/types';
type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function useWebMCP(
  run: (command: string) => CommandResult | undefined,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'run_portfolio_command',
            description:
              'Run a safe virtual terminal command to read or navigate Jimmy’s portfolio. Updates the visible terminal session; never executes operating-system commands.',
            inputSchema: {
              type: 'object',
              properties: { command: { type: 'string', maxLength: 4096 } },
              required: ['command'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute(input) {
              if (
                typeof input !== 'object' ||
                input === null ||
                !('command' in input) ||
                typeof input.command !== 'string' ||
                input.command.length > 4096
              )
                throw new Error(
                  'Expected a command string of at most 4,096 characters.',
                );
              const command = input.command;
              let result: CommandResult | undefined;
              flushSync(() => {
                result = run(command);
              });
              return result ?? {};
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [run, enabled]);
}
