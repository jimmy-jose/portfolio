import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOARD_SIZE,
  INITIAL_SPEED,
  MIN_SPEED,
  calculateSpeed,
  createSnakeGame,
  generateFood,
  hasSelfCollision,
  hasWallCollision,
  moveSnake,
  queueDirection,
} from '../lib/games/snake/snakeEngine';
import type { SnakeGameState } from '../lib/games/snake/snakeTypes';
import {
  MAX_PLAYER_NAME_LENGTH,
  MAX_SNAKE_SCORE,
  parseSnakeLeaderboard,
  parseSnakeScoreSubmission,
  qualifiesForSnakeLeaderboard,
  rankSnakeScores,
  sanitizePlayerName,
} from '../lib/games/snake/snakeLeaderboard';

function runningState(changes: Partial<SnakeGameState> = {}): SnakeGameState {
  return {
    ...createSnakeGame(() => 0, 'running'),
    ...changes,
  };
}

void test('snake moves one cell and keeps its length', () => {
  const before = runningState({ food: { x: 0, y: 0 } });
  const after = moveSnake(before, () => 0);
  assert.deepEqual(after.snake[0], { x: 11, y: 10 });
  assert.equal(after.snake.length, 3);
  assert.equal(after.score, 0);
});

void test('collecting a node grows the snake and increases score', () => {
  const before = runningState({ food: { x: 11, y: 10 } });
  const after = moveSnake(before, () => 0);
  assert.equal(after.snake.length, 4);
  assert.equal(after.score, 1);
  assert.equal(after.lastNode, 'GO');
  assert.ok(after.food && !hasSelfCollision(after.food, after.snake));
});

void test('food generation only selects empty cells', () => {
  const snake = Array.from(
    { length: BOARD_SIZE * BOARD_SIZE - 1 },
    (_, index) => ({
      x: index % BOARD_SIZE,
      y: Math.floor(index / BOARD_SIZE),
    }),
  );
  assert.deepEqual(
    generateFood(snake, () => 0.5),
    {
      x: BOARD_SIZE - 1,
      y: BOARD_SIZE - 1,
    },
  );
});

void test('wall collision terminates the process', () => {
  const after = moveSnake(
    runningState({
      snake: [
        { x: BOARD_SIZE - 1, y: 4 },
        { x: BOARD_SIZE - 2, y: 4 },
        { x: BOARD_SIZE - 3, y: 4 },
      ],
    }),
  );
  assert.equal(after.status, 'game-over');
  assert.equal(after.reason, 'WALL COLLISION');
  assert.equal(hasWallCollision({ x: BOARD_SIZE, y: 4 }), true);
});

void test('self collision terminates the process', () => {
  const after = moveSnake(
    runningState({
      snake: [
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 1, y: 3 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
      ],
      direction: 'up',
      queuedDirection: 'left',
      food: { x: 9, y: 9 },
    }),
  );
  assert.equal(after.status, 'game-over');
  assert.equal(after.reason, 'SELF COLLISION');
});

void test('an immediate reverse direction is ignored', () => {
  const before = runningState();
  assert.equal(queueDirection(before, 'left'), before);
  const turned = queueDirection(before, 'up');
  assert.equal(turned.queuedDirection, 'up');
  assert.equal(queueDirection(turned, 'left'), turned);
});

void test('speed increases every five points and stays playable', () => {
  assert.equal(calculateSpeed(0), INITIAL_SPEED);
  assert.equal(calculateSpeed(4), INITIAL_SPEED);
  assert.equal(calculateSpeed(5), INITIAL_SPEED - 8);
  assert.equal(calculateSpeed(10_000), MIN_SPEED);
});

void test('leaderboard sanitizes names and keeps the top three scores', () => {
  assert.equal(sanitizePlayerName('  J!mmy   J@se  '), 'Jmmy Jse');
  assert.equal(sanitizePlayerName(''), 'ANON');
  assert.equal(
    sanitizePlayerName('abcdefghijklmnop').length,
    MAX_PLAYER_NAME_LENGTH,
  );
  assert.deepEqual(
    rankSnakeScores([
      { name: 'Fourth', score: 2 },
      { name: 'First', score: 20 },
      { name: 'Third', score: 5.9 },
      { name: 'Second', score: 10 },
    ]),
    [
      { name: 'First', score: 20 },
      { name: 'Second', score: 10 },
      { name: 'Third', score: 5 },
    ],
  );
});

void test('leaderboard qualification compares against third place', () => {
  const scores = rankSnakeScores([
    { name: 'One', score: 10 },
    { name: 'Two', score: 8 },
    { name: 'Three', score: 5 },
  ]);
  assert.equal(qualifiesForSnakeLeaderboard(6, scores), true);
  assert.equal(qualifiesForSnakeLeaderboard(5, scores), false);
  assert.equal(qualifiesForSnakeLeaderboard(0, []), true);
});

void test('leaderboard safely parses stored entries and score submissions', () => {
  assert.deepEqual(
    parseSnakeLeaderboard([
      { name: 'Jimmy', score: MAX_SNAKE_SCORE + 20 },
      { name: 'Bad', score: Number.NaN },
      { name: 42, score: 10 },
    ]),
    [{ name: 'Jimmy', score: MAX_SNAKE_SCORE }],
  );
  assert.deepEqual(parseSnakeScoreSubmission({ name: ' J! ', score: 12 }), {
    name: 'J',
    score: 12,
  });
  assert.equal(parseSnakeScoreSubmission({ name: 'J', score: 12.5 }), null);
  assert.equal(
    parseSnakeScoreSubmission({ name: 'J', score: MAX_SNAKE_SCORE + 1 }),
    null,
  );
});
