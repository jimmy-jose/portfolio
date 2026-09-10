import { NextResponse } from 'next/server';
import {
  readSnakeLeaderboard,
  SnakeLeaderboardNotConfiguredError,
  writeSnakeLeaderboardScore,
} from '@/lib/games/snake/blobSnakeLeaderboard';
import { parseSnakeScoreSubmission } from '@/lib/games/snake/snakeLeaderboard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const responseHeaders = { 'Cache-Control': 'no-store' };
const MAX_REQUEST_LENGTH = 512;

function storageError(error: unknown) {
  if (error instanceof SnakeLeaderboardNotConfiguredError) {
    return NextResponse.json(
      {
        code: 'BLOB_NOT_CONFIGURED',
        error: 'Leaderboard storage is not connected.',
      },
      { status: 503, headers: responseHeaders },
    );
  }
  console.error('Snake leaderboard storage error:', error);
  return NextResponse.json(
    {
      code: 'LEADERBOARD_UNAVAILABLE',
      error: 'Leaderboard is temporarily unavailable.',
    },
    { status: 503, headers: responseHeaders },
  );
}

export async function GET() {
  try {
    const entries = await readSnakeLeaderboard();
    return NextResponse.json({ entries }, { headers: responseHeaders });
  } catch (error) {
    return storageError(error);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json(
      { code: 'CROSS_ORIGIN', error: 'Cross-origin submissions are blocked.' },
      { status: 403, headers: responseHeaders },
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_REQUEST_LENGTH) {
    return NextResponse.json(
      { code: 'PAYLOAD_TOO_LARGE', error: 'Score submission is too large.' },
      { status: 413, headers: responseHeaders },
    );
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_REQUEST_LENGTH) throw new RangeError();
    body = JSON.parse(text);
  } catch (error) {
    const tooLarge = error instanceof RangeError;
    return NextResponse.json(
      {
        code: tooLarge ? 'PAYLOAD_TOO_LARGE' : 'INVALID_SCORE',
        error: tooLarge
          ? 'Score submission is too large.'
          : 'Score submission is invalid.',
      },
      { status: tooLarge ? 413 : 400, headers: responseHeaders },
    );
  }

  const entry = parseSnakeScoreSubmission(body);
  if (!entry) {
    return NextResponse.json(
      { code: 'INVALID_SCORE', error: 'Score submission is invalid.' },
      { status: 400, headers: responseHeaders },
    );
  }

  try {
    const entries = await writeSnakeLeaderboardScore(entry);
    return NextResponse.json({ entries }, { headers: responseHeaders });
  } catch (error) {
    return storageError(error);
  }
}
