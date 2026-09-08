'use client';
import { motion } from 'motion/react';
import { contact } from '@/data/portfolio';
export function TerminalExit({
  reconnect,
  run,
}: {
  reconnect: () => void;
  run: (command: string) => unknown;
}) {
  return (
    <motion.section
      className="exit-screen"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <p className="eyebrow">SESSION CLOSED</p>
      <h2>
        Before you go<span className="accent">...</span>
      </h2>
      <p>Good products start with a conversation.</p>
      <div className="exit-actions">
        {contact.resume ? (
          <a href={contact.resume} target="_blank" rel="noopener noreferrer">
            ↓ VIEW RESUME
          </a>
        ) : (
          <button onClick={() => run('open /resume.pdf')}>↓ VIEW RESUME</button>
        )}
        <a href={`mailto:${contact.email}`}>CONTACT JIMMY ↗</a>
        <button onClick={reconnect}>↻ RECONNECT</button>
      </div>
    </motion.section>
  );
}
