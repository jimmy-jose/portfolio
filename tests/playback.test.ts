import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createCommandQueue,
  playbackDelay,
  printableOutput,
  printDuration,
} from '../lib/terminal/playback';
import { executeCommand } from '../lib/terminal/executeCommand';
import { navigationCommands } from '../lib/terminal/navigation';

void test('click batches execute serially using the updated directory', async () => {
  const enqueue = createCommandQueue();
  let cwd = '/';
  const log: string[] = [];
  const jobs = [
    ...navigationCommands('/experience/spenmo'),
    ...navigationCommands('/projects'),
  ].map((command) =>
    enqueue(async () => {
      log.push(`start ${command}`);
      await playbackDelay(2, new AbortController().signal);
      const result = executeCommand(command, { cwd, history: [] });
      assert.ok(!result.error);
      cwd = result.cwd ?? cwd;
      log.push(`end ${command}`);
      return result;
    }),
  );
  const results = await Promise.all(jobs);
  assert.match(results[1].text ?? '', /SPENMO/);
  assert.equal(results[2].entries?.[0].name, 'overview.txt');
  assert.equal(results[4].entries?.[0].name, 'loanlog');
  for (let index = 0; index < log.length; index += 2)
    assert.equal(log[index].slice(6), log[index + 1].slice(4));
  assert.equal(cwd, '/projects');
});
void test('aborting an animation releases its delay without rejecting', async () => {
  const controller = new AbortController();
  const pending = playbackDelay(10000, controller.signal);
  controller.abort();
  assert.equal(await pending, false);
  assert.equal(await playbackDelay(10000, controller.signal), false);
  assert.equal(await playbackDelay(1, new AbortController().signal), true);
});
void test('a failed queued task does not poison the following commands', async () => {
  const enqueue = createCommandQueue();
  const failed = enqueue(async () => {
    throw new Error('test failure');
  });
  const next = enqueue(async () => 'next command');
  await assert.rejects(failed, /test failure/);
  assert.equal(await next, 'next command');
});
void test('printable results preserve directory order, text and rich-view content', () => {
  const root = { cwd: '/', history: [] };
  assert.equal(
    printableOutput(executeCommand('ls /projects', root)),
    'loanlog/\ngaragelog/\nrival/\niinspect/',
  );
  const file = executeCommand('cat /experience/spenmo/backend.txt', root);
  assert.equal(printableOutput(file), file.text);
  assert.match(printableOutput(executeCommand('whoami', root)), /Jimmy Jose/);
  assert.match(
    printableOutput(executeCommand('cat /about/contact.txt', root)),
    /jimmy.jose96@gmail.com/,
  );
  assert.match(
    printableOutput(executeCommand('open loanlog', root)),
    /Starting experience/,
  );
  assert.equal(printableOutput(executeCommand('cd /projects', root)), '');
  assert.ok(printDuration({ text: 'x'.repeat(4000) }) <= 2200);
  assert.ok(printDuration(executeCommand('ls /projects', root)) >= 380);
});
