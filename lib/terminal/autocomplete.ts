import { commands } from './commandRegistry';
import { getNode, resolvePath } from './pathResolver';
export function autocomplete(input: string, cwd: string): string[] {
  const trimmed = input.trimStart();
  if (!trimmed) return [];
  if (!trimmed.includes(' '))
    return Object.keys(commands)
      .filter((command) => command.startsWith(trimmed))
      .map((command) => `${command} `);
  const match = trimmed.match(/^(cd|cat|open|ls)\s+([^\s]*)$/);
  if (!match) return [];
  const [, command, partial] = match;
  const slash = partial.lastIndexOf('/'),
    prefix = partial.slice(0, slash + 1),
    name = partial.slice(slash + 1);
  const directory = getNode(resolvePath(prefix || '.', cwd));
  if (directory?.type !== 'directory') return [];
  return Object.entries(directory.children)
    .filter(
      ([entry, node]) =>
        entry.startsWith(name) &&
        (command !== 'cd' || node.type === 'directory') &&
        (command !== 'cat' || node.type === 'file'),
    )
    .map(
      ([entry, node]) =>
        `${command} ${prefix}${entry}${node.type === 'directory' && command !== 'open' ? '/' : ''}`,
    );
}
