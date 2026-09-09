export type GameId = 'snake';

const installedGames = new Set<GameId>(['snake']);

export function isGameId(value: string): value is GameId {
  return installedGames.has(value as GameId);
}

export function launchGame(game: GameId): { game: GameId; text: string } {
  return {
    game,
    text: `Launching ${game}.exe...\nAllocating game memory...\nReady.`,
  };
}
