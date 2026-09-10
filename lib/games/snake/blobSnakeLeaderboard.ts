import 'server-only';

import { BlobPreconditionFailedError, get, put } from '@vercel/blob';
import {
  parseSnakeLeaderboard,
  rankSnakeScores,
  type SnakeLeaderboardEntry,
} from './snakeLeaderboard';

const LEADERBOARD_PATH = 'snake/leaderboard.json';
const MAX_WRITE_ATTEMPTS = 4;

type LeaderboardSnapshot = {
  entries: SnakeLeaderboardEntry[];
  etag: string | null;
};

export class SnakeLeaderboardNotConfiguredError extends Error {
  constructor() {
    super('Vercel Blob is not connected.');
    this.name = 'SnakeLeaderboardNotConfiguredError';
  }
}

function assertBlobConfigured() {
  const hasReadWriteToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const hasOidcStore = Boolean(
    process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID,
  );
  if (!hasReadWriteToken && !hasOidcStore)
    throw new SnakeLeaderboardNotConfiguredError();
}

async function readSnapshot(): Promise<LeaderboardSnapshot> {
  assertBlobConfigured();
  const result = await get(LEADERBOARD_PATH, {
    access: 'private',
    useCache: false,
  });
  if (!result) return { entries: [], etag: null };
  if (result.statusCode !== 200 || !result.stream)
    throw new Error('Leaderboard blob returned no content.');

  const raw = await new Response(result.stream).json();
  const storedEntries =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>).entries
      : null;
  return {
    entries: parseSnakeLeaderboard(storedEntries),
    etag: result.blob.etag,
  };
}

export async function readSnakeLeaderboard(): Promise<SnakeLeaderboardEntry[]> {
  return (await readSnapshot()).entries;
}

export async function writeSnakeLeaderboardScore(
  entry: SnakeLeaderboardEntry,
): Promise<SnakeLeaderboardEntry[]> {
  for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt += 1) {
    const current = await readSnapshot();
    const next = rankSnakeScores([...current.entries, entry]);

    if (JSON.stringify(next) === JSON.stringify(current.entries)) return next;

    try {
      await put(LEADERBOARD_PATH, JSON.stringify({ entries: next }), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: current.etag !== null,
        cacheControlMaxAge: 60,
        contentType: 'application/json',
        ...(current.etag ? { ifMatch: current.etag } : {}),
      });
      return next;
    } catch (error) {
      const canRetry =
        error instanceof BlobPreconditionFailedError || current.etag === null;
      if (!canRetry || attempt === MAX_WRITE_ATTEMPTS - 1) throw error;
    }
  }

  throw new Error('Leaderboard update failed.');
}
