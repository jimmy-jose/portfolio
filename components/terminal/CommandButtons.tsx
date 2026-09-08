'use client';
import { motion } from 'motion/react';
import { getNode, resolvePath } from '@/lib/terminal/pathResolver';
import { navigationCommands } from '@/lib/terminal/navigation';
import { contact } from '@/data/portfolio';
export function CommandButtons({
  cwd,
  run,
  runCommands,
}: {
  cwd: string;
  run: (command: string) => unknown;
  runCommands: (commands: string[]) => void;
}) {
  const node = getNode(cwd);
  const names =
    node?.type === 'directory'
      ? Object.keys(node.children).filter((name) => name !== 'resume.pdf')
      : [];
  const root = cwd === '/';
  const sorted = root ? ['experience', 'projects', 'skills', 'about'] : names;
  const projectDirectory = cwd === '/projects';
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="command-navigation"
      aria-label="Explore the current directory"
    >
      <p>
        {root ? 'Choose where you’d like to go' : 'Explore this directory'}
        <span className="accent"> ↴</span>
      </p>
      <div className={`action-grid ${root ? '' : 'directory-actions'}`}>
        {sorted.map((name, index) => (
          <button
            key={name}
            className="terminal-action"
            onClick={() => {
              const path = resolvePath(name, cwd);
              if (projectDirectory) run(`open ${path}`);
              else runCommands(navigationCommands(path));
            }}
          >
            <span className="action-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{name.toUpperCase()}</span>
            <span className="action-arrow">↗</span>
          </button>
        ))}
      </div>
      <div className="utility-actions">
        {!root && (
          <button
            onClick={() =>
              runCommands(navigationCommands(resolvePath('..', cwd)))
            }
          >
            ← BACK
          </button>
        )}
        {cwd.startsWith('/projects/') && (
          <button onClick={() => run(`open ${cwd}`)}>↗ OPEN EXPERIENCE</button>
        )}
        {contact.resume ? (
          <a
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => run('open /resume.pdf')}
          >
            ↓ VIEW RESUME
          </a>
        ) : (
          <button onClick={() => run('open /resume.pdf')}>↓ VIEW RESUME</button>
        )}
        <button onClick={() => run('cat /about/contact.txt')}>CONTACT ↗</button>
        <button onClick={() => run('help')}>? HELP</button>
      </div>
    </motion.section>
  );
}
