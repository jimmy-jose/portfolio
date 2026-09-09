'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { MotionConfig } from 'motion/react';
import { TerminalPrompt } from './TerminalPrompt';
import { TerminalBoot } from './TerminalBoot';
import { useStartupSequence } from './useStartupSequence';
import { TerminalHistory } from './TerminalHistory';
import { TerminalInput } from './TerminalInput';
import { CommandButtons } from './CommandButtons';
import { TerminalExit } from './TerminalExit';
import { Identity } from './Identity';
import { ContactLinks } from './ContactLinks';
import { MatrixRain } from '@/components/effects/MatrixRain';
import { CRTOverlay } from '@/components/effects/CRTOverlay';
import { useTerminalSession } from './useTerminalSession';
import { useWebMCP } from './useWebMCP';
import { displayPath } from '@/lib/terminal/pathResolver';
import { navigationCommands } from '@/lib/terminal/navigation';
const ExperienceViewer = dynamic(
  () =>
    import('@/components/experiences/ExperienceViewer').then(
      (module) => module.ExperienceViewer,
    ),
  { ssr: false },
);
export function Terminal() {
  const session = useTerminalSession();
  const { run, runCommands, intense, setIntense } = session;
  const startup = useStartupSequence(session.runImmediate);
  const stage = startup.phase;
  const printedLines = session.playback?.text.split('\n').length;
  const [effects, setEffects] = useState(true);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!intense) return;
    const timer = setTimeout(() => setIntense(false), 12000);
    return () => clearTimeout(timer);
  }, [intense, setIntense]);
  useEffect(() => {
    if (session.entries.length < 2 || session.project) return;
    end.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [session.entries.length, session.project, printedLines, session.busy]);
  useWebMCP(run, stage === 'ready' && !session.exited);
  return (
    <MotionConfig reducedMotion="user">
      <div className={`site-shell startup-${stage}`}>
        <MatrixRain
          intense={session.intense || stage === 'reveal'}
          enabled={effects && (stage === 'reveal' || stage === 'ready')}
        />
        {effects && <CRTOverlay />}
        {stage === 'crt' && <TerminalBoot onSkip={startup.skip} />}
        {stage !== 'crt' && stage !== 'ready' && (
          <button className="startup-skip" onClick={startup.skip}>
            SKIP INTRO ↵
          </button>
        )}
        <a href="#command-input" className="skip-link">
          Skip to terminal input
        </a>
        <header className="site-header">
          <button
            className="wordmark"
            aria-label="Return to home directory"
            onClick={() => {
              if (stage !== 'ready') startup.skip();
              else runCommands(['cd /', 'whoami']);
            }}
          >
            j<span>_</span>
          </button>
          <span className="header-label">
            JIMMY.DEV <span>/ PERSONAL MAINFRAME</span>
          </span>
          <span className="connection">
            <i /> {session.exited ? 'SESSION CLOSED' : 'CONNECTION ESTABLISHED'}
          </span>
        </header>
        <main className={`terminal ${session.exited ? 'session-exited' : ''}`}>
          <div className="terminal-chrome">
            <span>
              <i className="status-dot" /> jimmy@portfolio:{' '}
              {displayPath(session.cwd)}
            </span>
            <span>
              shell <span className="chrome-divider">/</span> UTF-8{' '}
              <span className="chrome-divider">/</span> v10.0
            </span>
          </div>
          <div className="session">
            <p className="session-meta">
              SESSION 001 <span>•</span> KERALA, INDIA <span>•</span> WELCOME TO
              MY CORNER OF THE INTERNET
            </p>
            <noscript>
              <style>
                {
                  '.crt-startup{display:none!important}.startup-crt .site-header,.startup-crt .terminal,.startup-crt .site-footer{visibility:visible!important}'
                }
              </style>
              <Identity />
              <p>Enable JavaScript to explore the interactive terminal.</p>
              <ContactLinks />
            </noscript>
            <TerminalHistory
              entries={session.entries}
              runCommands={runCommands}
              playback={session.playback}
            />
            {['prompt', 'typing', 'enter'].includes(stage) && (
              <div
                className={`command-line startup-command ${stage === 'enter' ? 'command-submitted' : ''}`}
              >
                <TerminalPrompt />
                <span>
                  {startup.typed}
                  <span
                    className="block-cursor typing-cursor"
                    aria-hidden="true"
                  />
                </span>
                {stage === 'enter' && (
                  <span className="enter-key" aria-label="Enter pressed">
                    ↵ ENTER
                  </span>
                )}
              </div>
            )}
            {stage === 'ready' && !session.exited && !session.busy && (
              <>
                <CommandButtons
                  cwd={session.cwd}
                  run={run}
                  runCommands={runCommands}
                />
                <TerminalInput
                  cwd={session.cwd}
                  history={session.history}
                  onCommand={session.submit}
                />
              </>
            )}
            {session.busy && (
              <div className="printing-controls">
                <span>
                  PRINTING<span aria-hidden="true">…</span>
                </span>
                <button onClick={session.skipPrinting}>SHOW ALL ↓</button>
              </div>
            )}
            {session.exited && !session.busy && (
              <TerminalExit reconnect={session.reconnect} run={run} />
            )}
            <div ref={end} />
            <output className="sr-only" aria-live="polite" aria-atomic="true">
              {session.announcement}
            </output>
          </div>
        </main>
        <footer className="site-footer">
          <span>
            <i className="status-dot" /> ALL SYSTEMS HUMAN
          </span>
          <span>BUILT WITH INTENT. SHIPPED WITH CARE.</span>
          <button
            className="effects-toggle"
            aria-pressed={effects}
            onClick={() => setEffects((value) => !value)}
          >
            EFFECTS {effects ? 'ON' : 'OFF'}
          </button>
        </footer>
        {session.intense && (
          <button className="normal-signal" onClick={() => run('matrix')}>
            × NORMAL SIGNAL
          </button>
        )}
        {session.project && (
          <ExperienceViewer
            projectId={session.project}
            onClose={() => session.setProject(null)}
            onBrowse={(id) =>
              runCommands(navigationCommands(`/projects/${id}`))
            }
          />
        )}
      </div>
    </MotionConfig>
  );
}
