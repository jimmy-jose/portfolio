'use client';

import { useState, type SyntheticEvent } from 'react';
import { MAX_PLAYER_NAME_LENGTH } from '@/lib/games/snake/snakeLeaderboard';

export function SnakeScoreForm({
  score,
  saving,
  onSave,
}: {
  score: number;
  saving: boolean;
  onSave: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState('PLAYER');
  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSave(name);
  };
  return (
    <form className="snake-score-form" onSubmit={submit}>
      <label htmlFor="snake-player-name">GLOBAL TOP-3 SCORE: {score}</label>
      <div>
        <input
          id="snake-player-name"
          value={name}
          maxLength={MAX_PLAYER_NAME_LENGTH}
          autoComplete="off"
          spellCheck={false}
          disabled={saving}
          onChange={(event) => setName(event.target.value)}
          aria-describedby="snake-name-hint"
        />
        <button type="submit" disabled={saving}>
          {saving ? 'SYNCING…' : 'SAVE SCORE'}
        </button>
      </div>
      <small id="snake-name-hint">Only the global top three are stored.</small>
    </form>
  );
}
