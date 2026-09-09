import type { CollisionReason } from '@/lib/games/snake/snakeTypes';

export function SnakeGameOver({
  score,
  length,
  reason,
  onRestart,
  onExit,
}: {
  score: number;
  length: number;
  reason: CollisionReason;
  onRestart: () => void;
  onExit: () => void;
}) {
  return (
    <section className="snake-screen snake-game-over" aria-live="assertive">
      <p className="snake-kicker">PROCESS TERMINATED</p>
      <h2>{reason ?? 'COLLISION DETECTED'}</h2>
      <p>
        SCORE: {String(score).padStart(2, '0')} · LENGTH:{' '}
        {String(length).padStart(2, '0')}
      </p>
      {score >= 10 && <p>STATUS: SYSTEM SURVIVAL ACCEPTABLE</p>}
      <div className="snake-screen-actions">
        <button type="button" onClick={onRestart}>
          ↻ RESTART
        </button>
        <button type="button" onClick={onExit}>
          ← RETURN TO TERMINAL
        </button>
      </div>
    </section>
  );
}
