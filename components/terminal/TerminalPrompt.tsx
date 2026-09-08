import { displayPath } from '@/lib/terminal/pathResolver';
export function TerminalPrompt({ cwd = '/' }: { cwd?: string }) {
  return (
    <span className="prompt">
      <span>jimmy</span>
      <span className="prompt-host">@portfolio</span>
      <span className="prompt-path">:{displayPath(cwd)}</span>
      <span className="prompt-dollar">$</span>
    </span>
  );
}
