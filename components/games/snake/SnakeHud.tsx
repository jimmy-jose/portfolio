import type { SnakeStatus } from '@/lib/games/snake/snakeTypes';

const statusLabels: Record<SnakeStatus, string> = {
  idle: 'READY',
  running: 'RUNNING',
  paused: 'PAUSED',
  'game-over': 'TERMINATED',
};

export function SnakeHud({
  score,
  length,
  status,
  lastNode,
}: {
  score: number;
  length: number;
  status: SnakeStatus;
  lastNode: string | null;
}) {
  return (
    <header className="snake-hud">
      <strong>SNAKE.EXE</strong>
      <span>SCORE: {String(score).padStart(2, '0')}</span>
      <span>LENGTH: {String(length).padStart(2, '0')}</span>
      <span>STATUS: {statusLabels[status]}</span>
      {lastNode && <span className="snake-node-status">NODE: {lastNode}</span>}
    </header>
  );
}
