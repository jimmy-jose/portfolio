import { getNode } from './pathResolver';
export function navigationCommands(path: string): string[] {
  const node = getNode(path);
  if (node?.type !== 'directory') return [`open ${path}`];
  const overview = Object.hasOwn(node.children, 'overview.txt');
  return [`cd ${path}`, ...(overview ? [`cat overview.txt`] : []), 'ls'];
}
