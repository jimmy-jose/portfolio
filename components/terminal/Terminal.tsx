'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { MotionConfig } from 'motion/react';
import { TerminalPrompt } from './TerminalPrompt';
import { TerminalBoot } from './TerminalBoot';
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
  const [stage, setStage] = useState<'boot' | 'typing' | 'ready'>('boot');
  const [typed, setTyped] = useState('');
  const [effects, setEffects] = useState(true);
  const started = useRef(false);
  const end = useRef<HTMLDivElement>(null);
  const finishBoot = useCallback(
    (skip: boolean) => {
      if (started.current) return;
      started.current = true;
      try {
        sessionStorage.setItem('jimmy-boot', 'done');
      } catch {}
      if (skip) {
        setStage('ready');
        run('whoami');
      } else setStage('typing');
    },
    [run],
  );
  useEffect(() => {
    if (stage !== 'typing') return;
    let index = 0;
    const timer = window.setInterval(() => {
      index++;
      setTyped('whoami'.slice(0, index));
      if (index >= 6) {
        clearInterval(timer);
        run('whoami');
        setStage('ready');
      }
    }, 75);
    return () => clearInterval(timer);
  }, [stage, run]);
  useEffect(() => {
    if (!intense) return;
    const timer = setTimeout(() => setIntense(false), 12000);
    return () => clearTimeout(timer);
  }, [intense, setIntense]);
  useEffect(() => {
    if (session.entries.length < 2 || session.project) return;
    end.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [session.entries.length, session.project]);
  useWebMCP(run, stage === 'ready' && !session.exited);
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <MatrixRain intense={session.intense} enabled={effects} />
        {effects && <CRTOverlay />}
        {stage === 'boot' && <TerminalBoot onComplete={finishBoot} />}
        <a href="#command-input" className="skip-link">
          Skip to terminal input
        </a>
        <header className="site-header">
          <button
            className="wordmark"
            aria-label="Return to home directory"
            onClick={() => {
              if (stage !== 'ready') finishBoot(true);
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
              <style>{'.boot-screen{display:none!important}'}</style>
              <Identity />
              <p>Enable JavaScript to explore the interactive terminal.</p>
              <ContactLinks />
            </noscript>
            <TerminalHistory
              entries={session.entries}
              runCommands={runCommands}
            />
            {stage === 'typing' && (
              <div className="command-line">
                <TerminalPrompt />
                <span>
                  {typed}
                  <span className="block-cursor" />
                </span>
              </div>
            )}
            {stage === 'ready' && !session.exited && (
              <>
                <CommandButtons
                  cwd={session.cwd}
                  run={run}
                  runCommands={runCommands}
                />
                <TerminalInput
                  cwd={session.cwd}
                  history={session.history}
                  onCommand={run}
                />
              </>
            )}
            {session.exited && (
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
