export type ParsedCommand = { command: string; args: string[]; error?: string };
/** Quotes group text. Operators, substitutions and backticks are only literal text. */
export function parseCommand(input: string): ParsedCommand {
  const tokens: string[] = [];
  let token = '',
    quote = '',
    started = false;
  for (const character of input.trim()) {
    if (quote) {
      if (character === quote) quote = '';
      else token += character;
    } else if (character === '"' || character === "'") {
      quote = character;
      started = true;
    } else if (/\s/.test(character)) {
      if (started) tokens.push(token);
      token = '';
      started = false;
    } else {
      token += character;
      started = true;
    }
  }
  if (quote)
    return {
      command: '',
      args: [],
      error: 'Unclosed quote. Add a matching quote and try again.',
    };
  if (started) tokens.push(token);
  return { command: tokens[0] ?? '', args: tokens.slice(1) };
}
