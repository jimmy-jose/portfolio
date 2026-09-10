import type {
  SnakeLeaderboardEntry,
  SnakeLeaderboardStatus,
} from '@/lib/games/snake/snakeLeaderboard';

export function SnakeLeaderboard({
  entries,
  status,
}: {
  entries: SnakeLeaderboardEntry[];
  status: SnakeLeaderboardStatus;
}) {
  return (
    <section
      className="snake-leaderboard"
      aria-label="Global Snake leaderboard"
    >
      <header>
        <strong>GLOBAL TOP 3</strong>
        <span>VERCEL BLOB</span>
      </header>
      {status === 'loading' ? <p>SYNCING SCORES…</p> : null}
      {status === 'saving' && !entries.length ? <p>SAVING SCORE…</p> : null}
      {status === 'unconfigured' ? <p>BLOB LINK REQUIRED</p> : null}
      {status === 'error' ? <p>LEADERBOARD OFFLINE</p> : null}
      {(status === 'ready' || status === 'saving') && entries.length ? (
        <ol>
          {entries.map((entry, index) => (
            <li key={`${entry.name}-${entry.score}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{entry.name}</strong>
              <span>{String(entry.score).padStart(2, '0')}</span>
            </li>
          ))}
        </ol>
      ) : null}
      {status === 'ready' && !entries.length ? (
        <p>NO SCORES STORED YET</p>
      ) : null}
    </section>
  );
}
