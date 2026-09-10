'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createSnakeGame,
  moveSnake,
  queueDirection,
} from '@/lib/games/snake/snakeEngine';
import type {
  CollisionReason,
  Direction,
  SnakeGameState,
  SnakeStatus,
} from '@/lib/games/snake/snakeTypes';
import {
  qualifiesForSnakeLeaderboard,
  type SnakeLeaderboardEntry,
  type SnakeLeaderboardStatus,
} from '@/lib/games/snake/snakeLeaderboard';
import {
  loadGlobalSnakeLeaderboard,
  saveGlobalSnakeScore,
  SnakeLeaderboardNotConfiguredError,
} from '@/lib/games/snake/clientSnakeLeaderboard';
import { SnakeCanvas, type SnakeCanvasHandle } from './SnakeCanvas';
import { SnakeControls } from './SnakeControls';
import { SnakeGameOver } from './SnakeGameOver';
import { SnakeHud } from './SnakeHud';
import { SnakeStartScreen } from './SnakeStartScreen';

type GameView = {
  board: SnakeGameState;
  score: number;
  length: number;
  status: SnakeStatus;
  lastNode: string | null;
  reason: CollisionReason;
};

const directionKeys: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

function toView(state: SnakeGameState): GameView {
  return {
    board: state,
    score: state.score,
    length: state.snake.length,
    status: state.status,
    lastNode: state.lastNode,
    reason: state.reason,
  };
}

export function SnakeGame({ onExit }: { onExit: (score: number) => void }) {
  const [initialGame] = useState(createSnakeGame);
  const game = useRef(initialGame);
  const canvas = useRef<SnakeCanvasHandle>(null);
  const panel = useRef<HTMLElement>(null);
  const [view, setView] = useState<GameView>(() => toView(initialGame));
  const [leaderboard, setLeaderboard] = useState<SnakeLeaderboardEntry[]>([]);
  const [leaderboardStatus, setLeaderboardStatus] =
    useState<SnakeLeaderboardStatus>('loading');
  const [scoreSaved, setScoreSaved] = useState(false);

  const publish = useCallback((state: SnakeGameState) => {
    setView(toView(state));
    canvas.current?.draw(state);
  }, []);
  const start = useCallback(() => {
    game.current = createSnakeGame(Math.random, 'running');
    setScoreSaved(false);
    publish(game.current);
  }, [publish]);
  const leave = useCallback(() => onExit(game.current.score), [onExit]);
  const changeDirection = useCallback((direction: Direction) => {
    game.current = queueDirection(game.current, direction);
  }, []);
  const togglePause = useCallback(() => {
    const status = game.current.status;
    if (status !== 'running' && status !== 'paused') return;
    game.current = {
      ...game.current,
      status: status === 'running' ? 'paused' : 'running',
    };
    publish(game.current);
  }, [publish]);
  const saveScore = useCallback(async (name: string) => {
    setLeaderboardStatus('saving');
    try {
      const next = await saveGlobalSnakeScore(name, game.current.score);
      setLeaderboard(next);
      setLeaderboardStatus('ready');
      setScoreSaved(true);
    } catch (error) {
      setLeaderboardStatus(
        error instanceof SnakeLeaderboardNotConfiguredError
          ? 'unconfigured'
          : 'error',
      );
    }
  }, []);

  useEffect(() => {
    panel.current?.focus();
    let active = true;
    const loadLeaderboard = async () => {
      try {
        const entries = await loadGlobalSnakeLeaderboard();
        if (!active) return;
        setLeaderboard(entries);
        setLeaderboardStatus('ready');
      } catch (error) {
        if (!active) return;
        setLeaderboardStatus(
          error instanceof SnakeLeaderboardNotConfiguredError
            ? 'unconfigured'
            : 'error',
        );
      }
    };
    void loadLeaderboard();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (view.status !== 'running') return;
    let animationFrame = 0;
    let lastMove = performance.now();
    const tick = (time: number) => {
      const current = game.current;
      if (current.status !== 'running') return;
      if (time - lastMove >= current.speed) {
        lastMove = time;
        const next = moveSnake(current);
        game.current = next;
        canvas.current?.draw(next);
        if (
          next.score !== current.score ||
          next.status !== current.status ||
          next.lastNode !== current.lastNode
        )
          setView(toView(next));
      }
      if (game.current.status === 'running')
        animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [view.status]);
  useEffect(() => {
    const pauseWhenHidden = () => {
      if (
        document.visibilityState !== 'hidden' ||
        game.current.status !== 'running'
      )
        return;
      game.current = { ...game.current, status: 'paused' };
      publish(game.current);
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () =>
      document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, [publish]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const direction = directionKeys[event.key];
      const target = event.target instanceof HTMLElement ? event.target : null;
      const editing = !!target?.closest(
        'input, textarea, select, [contenteditable="true"]',
      );
      if (event.key === 'Escape') {
        event.preventDefault();
        leave();
        return;
      }
      if (editing) return;
      if (
        event.key === 'Enter' &&
        !(event.target instanceof HTMLButtonElement) &&
        (game.current.status === 'idle' || game.current.status === 'game-over')
      ) {
        event.preventDefault();
        if (!event.repeat) start();
        return;
      }
      if (
        (event.key === 'p' ||
          event.key === 'P' ||
          (event.code === 'Space' &&
            !(event.target instanceof HTMLButtonElement))) &&
        !event.repeat
      ) {
        event.preventDefault();
        togglePause();
        return;
      }
      if (direction && game.current.status === 'running') {
        event.preventDefault();
        changeDirection(direction);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [changeDirection, leave, start, togglePause]);

  return (
    <article
      className="snake-game"
      ref={panel}
      tabIndex={-1}
      aria-label="Snake game"
    >
      <SnakeHud {...view} />
      {view.status === 'idle' ? (
        <SnakeStartScreen
          onStart={start}
          onExit={leave}
          leaderboard={leaderboard}
          leaderboardStatus={leaderboardStatus}
        />
      ) : (
        <div className="snake-play-area">
          <div className="snake-board-frame">
            <SnakeCanvas
              state={view.board}
              onDirection={changeDirection}
              ref={canvas}
            />
            {view.status === 'paused' && (
              <output className="snake-paused">
                <strong>PROCESS PAUSED</strong>
                <span>P / SPACE TO RESUME</span>
              </output>
            )}
          </div>
          {view.status === 'game-over' ? (
            <SnakeGameOver
              score={view.score}
              length={view.length}
              reason={view.reason}
              leaderboard={leaderboard}
              leaderboardStatus={leaderboardStatus}
              qualifies={
                leaderboardStatus !== 'loading' &&
                leaderboardStatus !== 'unconfigured' &&
                qualifiesForSnakeLeaderboard(view.score, leaderboard)
              }
              scoreSaved={scoreSaved}
              onSaveScore={saveScore}
              onRestart={start}
              onExit={leave}
            />
          ) : (
            <>
              <SnakeControls
                status={view.status}
                onDirection={changeDirection}
                onPause={togglePause}
              />
              <button type="button" className="snake-return" onClick={leave}>
                ESC / RETURN TO TERMINAL
              </button>
            </>
          )}
        </div>
      )}
      <output className="sr-only" aria-live="polite">
        Score {view.score}. Length {view.length}. Status {view.status}.
        {view.lastNode ? ` Node acquired: ${view.lastNode}.` : ''}
      </output>
    </article>
  );
}
