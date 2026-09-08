import { commands } from './commandRegistry';
import { parseCommand } from './commandParser';
import type { CommandResult, TerminalContext } from './types';
export function executeCommand(
  input: string,
  context: TerminalContext,
): CommandResult {
  if (input.length > 4096)
    return {
      error: true,
      text: 'Please keep commands under 4,096 characters.',
    };
  const parsed = parseCommand(input);
  if (parsed.error) return { error: true, text: parsed.error };
  if (!parsed.command) return {};
  if (!Object.hasOwn(commands, parsed.command))
    return {
      error: true,
      text: `jimmy: command not found: ${parsed.command}\n\nTry \`help\` to see available commands.`,
    };
  return commands[parsed.command](parsed.args, context);
}
