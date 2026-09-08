export type FileNode = {
  type: 'file';
  content: string;
  view?: 'contact' | 'impact' | 'ai' | 'resume';
};
export type DirectoryNode = {
  type: 'directory';
  children: Record<string, FsNode>;
};
export type FsNode = FileNode | DirectoryNode;
export type TerminalContext = { cwd: string; history: string[] };
export type ListingEntry = { name: string; path: string; directory: boolean };
export type CommandResult = {
  text?: string;
  cwd?: string;
  view?: 'identity' | 'contact' | 'impact' | 'ai' | 'resume';
  entries?: ListingEntry[];
  effect?: 'clear' | 'exit' | 'matrix';
  project?: string;
  error?: boolean;
};
export type CommandHandler = (
  args: string[],
  context: TerminalContext,
) => CommandResult;
export type SessionEntry = {
  id: number;
  command: string;
  cwd: string;
  result: CommandResult;
};
