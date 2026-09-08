import { projects, contact } from '../../data/portfolio';
import { getNode, resolvePath } from './pathResolver';
import type { CommandHandler, CommandResult } from './types';
const fail = (text: string): CommandResult => ({ text, error: true });
const ls: CommandHandler = (args, context) => {
  const invalid = args.find((arg) => arg.startsWith('-') && arg !== '-la');
  if (invalid) return fail(`ls: unsupported option: ${invalid}`);
  const paths = args.filter((arg) => arg !== '-la');
  if (paths.length > 1) return fail('Usage: ls [-la] [directory]');
  const path = resolvePath(paths[0] ?? '.', context.cwd),
    node = getNode(path);
  if (!node) return fail(`ls: no such file or directory: ${path}`);
  if (node.type === 'file') return { text: paths[0] ?? path };
  const entries = Object.entries(node.children).map(([name, child]) => ({
    name,
    path: resolvePath(name, path),
    directory: child.type === 'directory',
  }));
  return {
    entries,
    text: args.includes('-la')
      ? entries
          .map(
            (entry) =>
              `${entry.directory ? 'dr-xr-xr-x' : '-r--r--r--'}  jimmy  ${entry.name}${entry.directory ? '/' : ''}`,
          )
          .join('\n')
      : undefined,
  };
};
const cd: CommandHandler = (args, context) => {
  if (args.length > 1) return fail('Usage: cd <directory>');
  const path = resolvePath(args[0] ?? '~', context.cwd),
    node = getNode(path);
  if (!node) return fail(`cd: no such directory: ${args[0]}`);
  return node.type === 'directory'
    ? { cwd: path }
    : fail(`cd: not a directory: ${args[0]}`);
};
const cat: CommandHandler = (args, context) => {
  if (args.length !== 1) return fail('Usage: cat <file>');
  const node = getNode(resolvePath(args[0], context.cwd));
  if (!node) return fail(`cat: no such file: ${args[0]}`);
  if (node.type === 'directory')
    return fail(`cat: ${args[0]} is a directory. Try ls ${args[0]}.`);
  return { text: node.content, view: node.view };
};
const open: CommandHandler = (args, context) => {
  if (args.length !== 1)
    return fail('Usage: open <project, directory or file>');
  const path = resolvePath(args[0], context.cwd);
  const projectId = path.startsWith('/projects/')
    ? path.split('/')[2]
    : args[0];
  if (
    Object.hasOwn(projects, projectId) &&
    (path === `/projects/${projectId}` || args[0] === projectId)
  )
    return {
      text: `Launching ${projects[projectId].name}...\nResolving project...\nLoading artifacts...\nStarting experience...`,
      project: projectId,
    };
  if (path === '/resume.pdf' || args[0] === 'resume.pdf')
    return {
      view: 'resume',
      text: contact.resume
        ? 'Your resume is ready to open below.'
        : 'The original resume has not been attached yet. Please email Jimmy for a copy.',
    };
  const node = getNode(path);
  if (node?.type === 'directory') return { ...ls([path], context), cwd: path };
  return cat(args, context);
};
const tree: CommandHandler = (_, context) => {
  const lines: string[] = [context.cwd];
  function visit(path: string, prefix: string) {
    const node = getNode(path);
    if (node?.type !== 'directory') return;
    const entries = Object.entries(node.children);
    entries.forEach(([name, child], index) => {
      const last = index === entries.length - 1;
      lines.push(
        `${prefix}${last ? '└──' : '├──'} ${name}${child.type === 'directory' ? '/' : ''}`,
      );
      if (child.type === 'directory')
        visit(resolvePath(name, path), `${prefix}${last ? '    ' : '│   '}`);
    });
  }
  visit(context.cwd, '');
  return { text: lines.join('\n') };
};
export const commands: Record<string, CommandHandler> = {
  whoami: () => ({ view: 'identity' }),
  ls,
  cd,
  cat,
  open,
  tree,
  pwd: (_, context) => ({ text: context.cwd }),
  echo: (args) => ({ text: args.join(' ') }),
  clear: () => ({ effect: 'clear' }),
  history: (_, context) => ({
    text:
      context.history
        .map((command, index) => `${String(index + 1).padStart(3)}  ${command}`)
        .join('\n') || 'No commands yet.',
  }),
  help: () => ({
    text: 'AVAILABLE COMMANDS\n\nwhoami             Meet Jimmy\nls [-la] [path]     List files and directories\ncd <directory>     Move around (.., / and ~ work)\npwd                Show your location\ncat <file>         Read a file\nopen <target>      Explore a project or open a file\ntree               Explore the filesystem\necho <text>        Print text\nhistory            Show previous commands\nclear              Clear the screen\nexit               Close this session\n\n↑ ↓ command history · Tab autocomplete\nCtrl+L clear · Escape dismiss suggestions\n\nClick any directory or action to explore.\nCurious? Try coffee, sudo or matrix.',
  }),
  exit: () => ({
    text: 'logout\n\nConnection to jimmy.dev closed.',
    effect: 'exit',
  }),
  sudo: () => ({ text: 'Jimmy already has root access.' }),
  rm: (args) => ({
    text:
      args.join(' ') === '-rf /'
        ? 'Permission denied.\n\nDestroying the portfolio during a recruiter visit is discouraged.'
        : 'This filesystem is read-only. Your curiosity is safe here.',
  }),
  coffee: () => ({
    text: 'Brewing...\n\n[████████████████████] 100%\n\nSystem performance restored.',
  }),
  matrix: () => ({
    text: 'Signal amplified for 12 seconds. Run matrix again or use “Normal signal” to return.',
    effect: 'matrix',
  }),
};
