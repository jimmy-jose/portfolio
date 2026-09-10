export type SnakeLeaderboardEntry = {
  name: string;
  score: number;
};

export type SnakeLeaderboardStatus =
  | 'loading'
  | 'ready'
  | 'saving'
  | 'unconfigured'
  | 'error';

export const MAX_LEADERBOARD_ENTRIES = 3;
export const MAX_PLAYER_NAME_LENGTH = 14;
export const MAX_SNAKE_SCORE = 397;

const unsupportedNameCharacters = /[^a-z0-9 ._-]/gi;
const repeatedWhitespace = /\s+/g;

export function sanitizePlayerName(value: string): string {
  const name = value
    .replace(unsupportedNameCharacters, '')
    .replace(repeatedWhitespace, ' ')
    .trim()
    .slice(0, MAX_PLAYER_NAME_LENGTH);
  return name || 'ANON';
}

export function rankSnakeScores(
  entries: SnakeLeaderboardEntry[],
): SnakeLeaderboardEntry[] {
  return entries
    .filter(
      (entry) =>
        typeof entry.name === 'string' &&
        typeof entry.score === 'number' &&
        Number.isFinite(entry.score),
    )
    .map((entry) => ({
      name: sanitizePlayerName(entry.name),
      score: Math.min(MAX_SNAKE_SCORE, Math.max(0, Math.floor(entry.score))),
    }))
    .sort((first, second) => second.score - first.score)
    .slice(0, MAX_LEADERBOARD_ENTRIES);
}

export function parseSnakeLeaderboard(value: unknown): SnakeLeaderboardEntry[] {
  if (!Array.isArray(value)) return [];
  return rankSnakeScores(
    value.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const candidate = entry as Record<string, unknown>;
      if (
        typeof candidate.name !== 'string' ||
        typeof candidate.score !== 'number'
      )
        return [];
      return [{ name: candidate.name, score: candidate.score }];
    }),
  );
}

export function parseSnakeScoreSubmission(
  value: unknown,
): SnakeLeaderboardEntry | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.name !== 'string' ||
    typeof candidate.score !== 'number' ||
    !Number.isInteger(candidate.score) ||
    candidate.score < 0 ||
    candidate.score > MAX_SNAKE_SCORE
  )
    return null;
  return {
    name: sanitizePlayerName(candidate.name),
    score: candidate.score,
  };
}

export function qualifiesForSnakeLeaderboard(
  score: number,
  entries: SnakeLeaderboardEntry[],
): boolean {
  const ranked = rankSnakeScores(entries);
  return (
    ranked.length < MAX_LEADERBOARD_ENTRIES ||
    score > ranked[ranked.length - 1].score
  );
}
