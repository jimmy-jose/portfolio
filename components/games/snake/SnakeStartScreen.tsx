import type {
  SnakeLeaderboardEntry,
  SnakeLeaderboardStatus,
} from '@/lib/games/snake/snakeLeaderboard';
import { SnakeLeaderboard } from './SnakeLeaderboard';

export function SnakeStartScreen({
  onStart,
  onExit,
  leaderboard,
  leaderboardStatus,
}: {
  onStart: () => void;
  onExit: () => void;
  leaderboard: SnakeLeaderboardEntry[];
  leaderboardStatus: SnakeLeaderboardStatus;
}) {
  return (
    <section className="snake-screen snake-start-screen">
      <p className="snake-kicker">SNAKE.EXE v1.0</p>
      <h2>COLLECT THE NODES.</h2>
      <div className="snake-instructions">
        <p>
          <span>OBJECTIVE</span>
          Collect system nodes. Do not hit the firewall—or yourself.
        </p>
        <p>
          <span>CONTROLS</span>
          WASD / Arrow keys · P to pause · Esc to quit
        </p>
      </div>
      <div className="snake-screen-actions">
        <button type="button" onClick={onStart}>
          ▸ START GAME
        </button>
        <button type="button" onClick={onExit}>
          ← RETURN TO TERMINAL
        </button>
      </div>
      <small>Press Enter to start.</small>
      <SnakeLeaderboard entries={leaderboard} status={leaderboardStatus} />
    </section>
  );
}
