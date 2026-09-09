import type { Direction, SnakeStatus } from '@/lib/games/snake/snakeTypes';

const arrows: Array<{
  direction: Direction;
  symbol: string;
  label: string;
  className: string;
}> = [
  { direction: 'up', symbol: '↑', label: 'Move up', className: 'snake-up' },
  {
    direction: 'left',
    symbol: '←',
    label: 'Move left',
    className: 'snake-left',
  },
  {
    direction: 'down',
    symbol: '↓',
    label: 'Move down',
    className: 'snake-down',
  },
  {
    direction: 'right',
    symbol: '→',
    label: 'Move right',
    className: 'snake-right',
  },
];

export function SnakeControls({
  status,
  onDirection,
  onPause,
}: {
  status: SnakeStatus;
  onDirection: (direction: Direction) => void;
  onPause: () => void;
}) {
  return (
    <div className="snake-controls" aria-label="Snake controls">
      <div className="snake-direction-pad">
        {arrows.map(({ direction, symbol, label, className }) => (
          <button
            type="button"
            className={className}
            key={direction}
            aria-label={label}
            onClick={() => onDirection(direction)}
          >
            {symbol}
          </button>
        ))}
      </div>
      <button type="button" className="snake-pause" onClick={onPause}>
        {status === 'paused' ? '▶ RESUME' : 'Ⅱ PAUSE'}
      </button>
    </div>
  );
}
