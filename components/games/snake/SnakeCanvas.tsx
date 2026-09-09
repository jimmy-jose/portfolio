'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { BOARD_SIZE } from '@/lib/games/snake/snakeEngine';
import type { Direction, SnakeGameState } from '@/lib/games/snake/snakeTypes';

export type SnakeCanvasHandle = {
  draw: (state: SnakeGameState) => void;
};

function renderBoard(surface: HTMLCanvasElement, state: SnakeGameState): void {
  const size = Math.max(1, Math.floor(surface.getBoundingClientRect().width));
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  if (surface.width !== size * ratio || surface.height !== size * ratio) {
    surface.width = size * ratio;
    surface.height = size * ratio;
  }
  const context = surface.getContext('2d');
  if (!context) return;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, size, size);
  context.fillStyle = '#050a06';
  context.fillRect(0, 0, size, size);

  const cell = size / BOARD_SIZE;
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(122, 171, 103, 0.08)';
  for (let index = 1; index < BOARD_SIZE; index++) {
    const offset = Math.round(index * cell) + 0.5;
    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset, size);
    context.moveTo(0, offset);
    context.lineTo(size, offset);
    context.stroke();
  }

  state.snake.forEach((segment, index) => {
    const inset = Math.max(1, cell * 0.1);
    context.fillStyle = index === 0 ? '#c5ff9f' : '#72c45b';
    context.shadowColor = index === 0 ? '#a5f77b' : 'transparent';
    context.shadowBlur = index === 0 ? 8 : 0;
    context.fillRect(
      segment.x * cell + inset,
      segment.y * cell + inset,
      cell - inset * 2,
      cell - inset * 2,
    );
  });

  if (state.food) {
    context.fillStyle = '#e1ffcd';
    context.shadowColor = '#c5ff9f';
    context.shadowBlur = 12;
    context.beginPath();
    context.arc(
      (state.food.x + 0.5) * cell,
      (state.food.y + 0.5) * cell,
      cell * 0.25,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.shadowBlur = 0;
}

export const SnakeCanvas = forwardRef<
  SnakeCanvasHandle,
  {
    state: SnakeGameState;
    onDirection: (direction: Direction) => void;
  }
>(function SnakeCanvas({ state, onDirection }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const latest = useRef(state);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const draw = useCallback((next: SnakeGameState) => {
    latest.current = next;
    if (canvas.current) renderBoard(canvas.current, next);
  }, []);
  useImperativeHandle(ref, () => ({ draw }), [draw]);
  useEffect(() => {
    const surface = canvas.current;
    if (!surface) return;
    draw(latest.current);
    const observer = new ResizeObserver(() => draw(latest.current));
    observer.observe(surface);
    return () => observer.disconnect();
  }, [draw]);

  const beginSwipe = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const endSwipe = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.max(Math.abs(x), Math.abs(y)) < 24) return;
    onDirection(
      Math.abs(x) > Math.abs(y)
        ? x > 0
          ? 'right'
          : 'left'
        : y > 0
          ? 'down'
          : 'up',
    );
  };

  return (
    <canvas
      ref={canvas}
      className="snake-canvas"
      aria-label="Snake game board. The score and game status appear above."
      onPointerDown={beginSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    />
  );
});
