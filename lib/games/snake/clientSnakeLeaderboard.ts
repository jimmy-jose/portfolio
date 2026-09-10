import {
  parseSnakeLeaderboard,
  type SnakeLeaderboardEntry,
} from './snakeLeaderboard';

const ENDPOINT = '/api/snake-leaderboard';

export class SnakeLeaderboardNotConfiguredError extends Error {
  constructor() {
    super('Vercel Blob is not connected.');
    this.name = 'SnakeLeaderboardNotConfiguredError';
  }
}

async function readEntries(
  response: Response,
): Promise<SnakeLeaderboardEntry[]> {
  const payload = (await response.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!response.ok) {
    if (payload?.code === 'BLOB_NOT_CONFIGURED')
      throw new SnakeLeaderboardNotConfiguredError();
    throw new Error('The global leaderboard is unavailable.');
  }
  return parseSnakeLeaderboard(payload?.entries);
}

export async function loadGlobalSnakeLeaderboard(): Promise<
  SnakeLeaderboardEntry[]
> {
  return readEntries(await fetch(ENDPOINT, { cache: 'no-store' }));
}

export async function saveGlobalSnakeScore(
  name: string,
  score: number,
): Promise<SnakeLeaderboardEntry[]> {
  return readEntries(
    await fetch(ENDPOINT, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    }),
  );
}
