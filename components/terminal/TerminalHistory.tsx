'use client';
import { memo } from 'react';
import type { PlaybackFrame } from './useTerminalPlayback';
import { motion } from 'motion/react';
import { Identity } from './Identity';
import { TerminalPrompt } from './TerminalPrompt';
import { ContactLinks } from './ContactLinks';
import { navigationCommands } from '@/lib/terminal/navigation';
import { contact } from '@/data/portfolio';
import type { CommandResult, SessionEntry } from '@/lib/terminal/types';
function RichResult({ result }: { result: CommandResult }) {
  if (result.view === 'identity') return <Identity />;
  if (result.view === 'contact')
    return (
      <>
        <p className="result-title">CONTACT</p>
        <ContactLinks />
      </>
    );
  if (result.view === 'resume')
    return (
      <>
        <pre>{result.text}</pre>
        {contact.resume ? (
          <a
            className="text-link"
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open original resume PDF ↗
          </a>
        ) : (
          <ContactLinks />
        )}
      </>
    );
  if (result.view === 'impact')
    return (
      <div className="impact-output">
        <p className="eyebrow">SPENMO / PRODUCTION RELIABILITY</p>
        <h3>Fewer crashes. More confidence.</h3>
        <div
          className="impact-chart"
          aria-label="Crash rate reduced from approximately 4 percent to less than 1 percent"
        >
          <div>
            <span>BEFORE</span>
            <strong>~4%</strong>
            <div>
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
          <div>
            <span>AFTER</span>
            <strong>&lt;1%</strong>
            <div>
              <motion.i
                className="improved-bar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              />
            </div>
          </div>
        </div>
        <p>Improved stability through crash analysis and production fixes.</p>
        <p>
          Improved backend response times by removing redundant reads and
          optimizing request processing.
        </p>
      </div>
    );
  if (result.view === 'ai')
    return (
      <div className="ai-output">
        <p className="eyebrow">SPENMO / AI INFRASTRUCTURE</p>
        <h3>
          From architecture
          <br />
          to intelligent workflows<span className="accent">.</span>
        </h3>
        <p>Owned the AI service and its infrastructure.</p>
        <div className="ai-pipeline">
          {['Architecture', 'Development', 'Deployment', 'Maintenance'].map(
            (step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <small>0{index + 1}</small>
                <span>{step}</span>
                <b aria-hidden="true">{index === 3 ? '✓' : '→'}</b>
              </motion.div>
            ),
          )}
        </div>
        <p className="accent">↳ LLM-powered workflows</p>
      </div>
    );
  return result.text ? (
    <pre className={result.error ? 'error-output' : ''}>{result.text}</pre>
  ) : null;
}
const HistoryEntry = memo(function HistoryEntry({
  entry,
  runCommands,
  printing,
}: {
  entry: SessionEntry;
  printing?: PlaybackFrame;
  runCommands: (commands: string[]) => void;
}) {
  return (
    <article className="history-entry">
      <div className="command-line">
        <TerminalPrompt cwd={entry.cwd} />
        <span className="executed-command">{entry.command}</span>
      </div>
      <div className="command-result" aria-busy={!!printing}>
        {printing ? (
          <pre
            className={`printing-output ${entry.result.error ? 'error-output' : ''}`}
            aria-hidden="true"
          >
            {printing.text}
            <span className="block-cursor print-cursor" />
          </pre>
        ) : (
          <RichResult result={entry.result} />
        )}
        {!printing && entry.result.entries && (
          <div className="file-list">
            {entry.result.entries.map((item) => (
              <button
                key={item.path}
                onClick={() => runCommands(navigationCommands(item.path))}
              >
                <span aria-hidden="true">{item.directory ? '▸' : '−'}</span>{' '}
                {item.name}
                {item.directory ? '/' : ''}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
});
export function TerminalHistory({
  entries,
  runCommands,
  playback,
}: {
  entries: SessionEntry[];
  playback: PlaybackFrame | null;
  runCommands: (commands: string[]) => void;
}) {
  return (
    <div className="terminal-history" aria-label="Terminal session history">
      {entries.map((entry) => (
        <HistoryEntry
          key={entry.id}
          entry={entry}
          runCommands={runCommands}
          printing={playback?.entryId === entry.id ? playback : undefined}
        />
      ))}
      {playback?.phase === 'typing' && (
        <div className="command-line queued-command" aria-hidden="true">
          <TerminalPrompt cwd={playback.cwd} />
          <span>
            {playback.typed}
            <span className="block-cursor print-cursor" />
          </span>
        </div>
      )}
    </div>
  );
}
