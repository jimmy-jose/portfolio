import test from 'node:test';
import assert from 'node:assert/strict';
import {
  startupFrame,
  STARTUP_COMMAND,
  STARTUP_DURATION,
} from '../lib/terminal/startup';
void test('startup proceeds through CRT, prompt, typing, Enter, reveal and controls', () => {
  assert.equal(startupFrame(0).phase, 'crt');
  assert.deepEqual(startupFrame(650), { phase: 'prompt', typed: '' });
  assert.deepEqual(startupFrame(1000), { phase: 'typing', typed: 'w' });
  assert.deepEqual(startupFrame(1500), {
    phase: 'typing',
    typed: STARTUP_COMMAND,
  });
  assert.equal(startupFrame(1720).phase, 'enter');
  assert.equal(startupFrame(1950).phase, 'reveal');
  assert.equal(startupFrame(STARTUP_DURATION).phase, 'ready');
  assert.ok(STARTUP_DURATION < 3000);
});
void test('typing advances by one character and completes before execution', () => {
  for (let index = 0; index < STARTUP_COMMAND.length; index++) {
    assert.equal(
      startupFrame(1000 + index * 100).typed,
      STARTUP_COMMAND.slice(0, index + 1),
    );
  }
  for (const elapsed of [1720, 1950, 2850, 9000])
    assert.equal(startupFrame(elapsed).typed, STARTUP_COMMAND);
});
