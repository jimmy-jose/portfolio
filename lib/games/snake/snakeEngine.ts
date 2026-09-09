import type {
  Direction,
  Point,
  SnakeGameState,
  SnakeStatus,
} from './snakeTypes';

export const BOARD_SIZE = 20;
export const INITIAL_SPEED = 140;
export const MIN_SPEED = 65;
export const NODE_LABELS = ['GO', 'AI', 'KOTLIN', 'TS', 'AWS', 'SQL'] as const;

const movement: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposite: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function samePoint(first: Point, second: Point): boolean {
  return first.x === second.x && first.y === second.y;
}

export function calculateSpeed(score: number): number {
  return Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 5) * 8);
}

export function canChangeDirection(
  current: Direction,
  next: Direction,
): boolean {
  return next !== opposite[current];
}

export function queueDirection(
  state: SnakeGameState,
  next: Direction,
): SnakeGameState {
  if (
    state.status !== 'running' ||
    state.queuedDirection !== state.direction ||
    !canChangeDirection(state.direction, next)
  )
    return state;
  return { ...state, queuedDirection: next };
}

export function hasWallCollision(point: Point): boolean {
  return (
    point.x < 0 || point.y < 0 || point.x >= BOARD_SIZE || point.y >= BOARD_SIZE
  );
}

export function hasSelfCollision(head: Point, snake: Point[]): boolean {
  return snake.some((segment) => samePoint(head, segment));
}

export function generateFood(
  snake: Point[],
  random: () => number = Math.random,
): Point | null {
  const openCells: Point[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const point = { x, y };
      if (!hasSelfCollision(point, snake)) openCells.push(point);
    }
  }
  if (!openCells.length) return null;
  const value = Math.min(0.999999, Math.max(0, random()));
  return openCells[Math.floor(value * openCells.length)] ?? openCells[0];
}

export function createSnakeGame(
  random: () => number = Math.random,
  status: SnakeStatus = 'idle',
): SnakeGameState {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  return {
    snake,
    direction: 'right',
    queuedDirection: 'right',
    food: generateFood(snake, random),
    score: 0,
    status,
    speed: INITIAL_SPEED,
    lastNode: null,
    reason: null,
  };
}

export function moveSnake(
  state: SnakeGameState,
  random: () => number = Math.random,
): SnakeGameState {
  if (state.status !== 'running') return state;
  const direction = canChangeDirection(state.direction, state.queuedDirection)
    ? state.queuedDirection
    : state.direction;
  const delta = movement[direction];
  const head = {
    x: state.snake[0].x + delta.x,
    y: state.snake[0].y + delta.y,
  };
  const acquiredNode = !!state.food && samePoint(head, state.food);
  const collisionBody = acquiredNode ? state.snake : state.snake.slice(0, -1);
  if (hasWallCollision(head))
    return {
      ...state,
      direction,
      queuedDirection: direction,
      status: 'game-over',
      reason: 'WALL COLLISION',
    };
  if (hasSelfCollision(head, collisionBody))
    return {
      ...state,
      direction,
      queuedDirection: direction,
      status: 'game-over',
      reason: 'SELF COLLISION',
    };

  const snake = acquiredNode
    ? [head, ...state.snake]
    : [head, ...state.snake.slice(0, -1)];
  if (!acquiredNode)
    return { ...state, snake, direction, queuedDirection: direction };

  const score = state.score + 1;
  const food = generateFood(snake, random);
  return {
    ...state,
    snake,
    direction,
    queuedDirection: direction,
    food,
    score,
    speed: calculateSpeed(score),
    lastNode: NODE_LABELS[(score - 1) % NODE_LABELS.length],
    status: food ? 'running' : 'game-over',
    reason: food ? null : 'BOARD CLEARED',
  };
}
