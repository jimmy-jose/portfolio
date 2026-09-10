import type { CollisionReason } from '@/lib/games/snake/snakeTypes';
import type {
  SnakeLeaderboardEntry,
  SnakeLeaderboardStatus,
} from '@/lib/games/snake/snakeLeaderboard';
import { SnakeLeaderboard } from './SnakeLeaderboard';
import { SnakeScoreForm } from './SnakeScoreForm';

export function SnakeGameOver({
  score,
  length,
  reason,
  leaderboard,
  leaderboardStatus,
  qualifies,
  scoreSaved,
  onSaveScore,
  onRestart,
  onExit,
}: {
  score: number;
  length: number;
  reason: CollisionReason;
  leaderboard: SnakeLeaderboardEntry[];
  leaderboardStatus: SnakeLeaderboardStatus;
  qualifies: boolean;
  scoreSaved: boolean;
  onSaveScore: (name: string) => Promise<void>;
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
      {qualifies && !scoreSaved ? (
        <SnakeScoreForm
          score={score}
          saving={leaderboardStatus === 'saving'}
          onSave={onSaveScore}
        />
      ) : null}
      {scoreSaved ? (
        <p className="snake-score-saved">LEADERBOARD SYNCED ✓</p>
      ) : null}
      <SnakeLeaderboard entries={leaderboard} status={leaderboardStatus} />
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
