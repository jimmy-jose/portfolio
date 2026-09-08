import { filesystem } from '../../data/filesystem';
import type { FsNode } from './types';
export function resolvePath(path: string, cwd = '/'): string {
  const expanded = path === '~' ? '/' : path.replace(/^~\//, '/');
  const segments = (
    expanded.startsWith('/') ? expanded : `${cwd}/${expanded}`
  ).split('/');
  const result: string[] = [];
  for (const segment of segments) {
    if (segment === '..') result.pop();
    else if (segment && segment !== '.') result.push(segment);
  }
  return `/${result.join('/')}`;
}
export function getNode(path: string): FsNode | undefined {
  let current: FsNode | undefined = filesystem;
  for (const segment of resolvePath(path).split('/').filter(Boolean)) {
    if (
      current?.type !== 'directory' ||
      !Object.hasOwn(current.children, segment)
    )
      return undefined;
    current = current.children[segment];
  }
  return current;
}
export const displayPath = (cwd: string) => (cwd === '/' ? '~' : `~${cwd}`);
