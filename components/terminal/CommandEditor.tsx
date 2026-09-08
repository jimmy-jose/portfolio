'use client';
import {
  useLayoutEffect,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';

type Props = {
  value: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/** Keep the native input for selection, IME and accessibility; mirror only its caret. */
export function CommandEditor({ value, inputRef, onChange, onKeyDown }: Props) {
  const [caret, setCaret] = useState({
    position: 0,
    scroll: 0,
    selected: false,
  });
  const [composing, setComposing] = useState(false);
  const syncCaret = (element: HTMLInputElement) =>
    setCaret({
      position: element.selectionStart ?? element.value.length,
      scroll: element.scrollLeft,
      selected: element.selectionStart !== element.selectionEnd,
    });
  useLayoutEffect(() => {
    if (inputRef.current) syncCaret(inputRef.current);
  }, [value, inputRef]);

  return (
    <div className={`command-editor ${composing ? 'is-composing' : ''}`}>
      <input
        ref={inputRef}
        id="command-input"
        name="command"
        aria-label="Terminal command"
        aria-describedby="input-help"
        value={value}
        maxLength={4096}
        onChange={(event) => {
          onChange(event.target.value);
          syncCaret(event.currentTarget);
        }}
        onKeyDown={onKeyDown}
        onSelect={(event) => syncCaret(event.currentTarget)}
        onScroll={(event) => syncCaret(event.currentTarget)}
        onFocus={(event) => syncCaret(event.currentTarget)}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={(event) => {
          setComposing(false);
          syncCaret(event.currentTarget);
        }}
        placeholder="Type a command…"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="send"
      />
      {!composing && !caret.selected && (
        <div className="editor-caret-window" aria-hidden="true">
          <span
            className="editor-caret-track"
            style={{ transform: `translateX(-${caret.scroll}px)` }}
          >
            <span className="editor-caret-prefix">
              {value.slice(0, caret.position)}
            </span>
            <span
              key={`${caret.position}-${value}`}
              className="block-cursor editor-cursor"
            />
          </span>
        </div>
      )}
    </div>
  );
}
