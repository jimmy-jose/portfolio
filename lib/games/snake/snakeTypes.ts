export type Point = {
  x: number;
  y: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';
export type SnakeStatus = 'idle' | 'running' | 'paused' | 'game-over';
export type CollisionReason =
  | 'WALL COLLISION'
  | 'SELF COLLISION'
  | 'BOARD CLEARED'
  | null;

export type SnakeGameState = {
  snake: Point[];
  direction: Direction;
  queuedDirection: Direction;
  food: Point | null;
  score: number;
  status: SnakeStatus;
  speed: number;
  lastNode: string | null;
  reason: CollisionReason;
};
