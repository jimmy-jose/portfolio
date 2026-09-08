'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import { TerminalPrompt } from './TerminalPrompt';
import { CommandEditor } from './CommandEditor';
import { autocomplete } from '@/lib/terminal/autocomplete';
export function TerminalInput({
  cwd,
  history,
  onCommand,
}: {
  cwd: string;
  history: string[];
  onCommand: (input: string) => unknown;
}) {
  const [value, setValue] = useState('');
  const [index, setIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const draft = useRef('');
  const input = useRef<HTMLInputElement>(null);
  const submit = () => {
    if (!value.trim()) return;
    onCommand(value);
    setValue('');
    setIndex(null);
    setSuggestions([]);
  };
  const recall = (direction: number) => {
    if (!history.length) return;
    if (index === null) draft.current = value;
    const next = Math.max(
      0,
      Math.min(history.length, (index ?? history.length) + direction),
    );
    setIndex(next);
    setValue(next === history.length ? draft.current : history[next]);
    setSuggestions([]);
  };
  const keydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      recall(event.key === 'ArrowUp' ? -1 : 1);
    }
    if (event.key === 'Tab' && !event.shiftKey) {
      const matches = autocomplete(value, cwd);
      if (matches.length) {
        event.preventDefault();
        if (matches.length === 1) {
          setValue(matches[0]);
          setSuggestions([]);
        } else setSuggestions(matches);
      }
    }
    if (
      event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      event.key.toLowerCase() === 'l'
    ) {
      event.preventDefault();
      onCommand('clear');
      setSuggestions([]);
    }
    if (event.key === 'Escape') setSuggestions([]);
  };
  return (
    <div className="terminal-input">
      <form
        className="input-line"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <TerminalPrompt cwd={cwd} />
        <CommandEditor
          inputRef={input}
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue);
            setIndex(null);
            setSuggestions([]);
          }}
          onKeyDown={keydown}
        />
        <button type="submit" className="input-submit" aria-label="Run command">
          ↵
        </button>
      </form>
      {suggestions.length > 0 && (
        <div className="suggestions" aria-label="Command completions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setValue(suggestion);
                setSuggestions([]);
                input.current?.focus();
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <p id="input-help" className="input-help">
        Try <button onClick={() => onCommand('help')}>help</button> to get
        started <span>·</span> Or simply click to explore.
        <span className="keyboard-hint"> ↑↓ history · tab autocomplete</span>
      </p>
    </div>
  );
}
