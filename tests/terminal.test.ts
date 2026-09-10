import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCommand } from '../lib/terminal/executeCommand';
import { resolvePath, getNode } from '../lib/terminal/pathResolver';
import { parseCommand } from '../lib/terminal/commandParser';
import { autocomplete } from '../lib/terminal/autocomplete';
import { navigationCommands } from '../lib/terminal/navigation';
import { filesystem } from '../data/filesystem';
import { pickRandomFact, randomFacts } from '../data/randomFacts';
import { lightModeRefusals, pickLightModeRefusal } from '../data/terminalQuips';
import type { DirectoryNode, TerminalContext } from '../lib/terminal/types';
const root: TerminalContext = { cwd: '/', history: [] };
void test('paths normalize and cannot escape root', () => {
  assert.equal(resolvePath('../../../../about', '/projects/rival'), '/about');
  assert.equal(resolvePath('~/skills', '/projects'), '/skills');
  assert.equal(
    resolvePath('./rival/../loanlog/', '/projects'),
    '/projects/loanlog',
  );
  assert.equal(resolvePath('~', '/about'), '/');
});
void test('filesystem never traverses inherited properties', () => {
  for (const path of ['/constructor', '/__proto__', '/projects/toString'])
    assert.equal(getNode(path), undefined);
});
void test('quoted arguments are grouped; malformed quotes fail clearly', () => {
  assert.deepEqual(parseCommand('echo "hello world" \'friend\''), {
    command: 'echo',
    args: ['hello world', 'friend'],
  });
  assert.ok(parseCommand('cat "about').error);
  assert.deepEqual(parseCommand('echo ""'), { command: 'echo', args: [''] });
});
void test('shell syntax is inert and unknown commands are safe', () => {
  assert.equal(
    executeCommand('echo $(whoami) ; rm -rf /', root).text,
    '$(whoami) ; rm -rf /',
  );
  for (const command of [
    'constructor',
    '__proto__',
    'toString',
    'docker',
    'ls;pwd',
  ])
    assert.equal(executeCommand(command, root).error, true);
  assert.equal(
    executeCommand('echo <script>alert(1)</script>', root).text,
    '<script>alert(1)</script>',
  );
});
void test('the requested filesystem exists and every file can be read', () => {
  function visit(node: DirectoryNode, path: string) {
    for (const [name, child] of Object.entries(node.children)) {
      const target = `${path}/${name}`;
      if (child.type === 'directory') visit(child, target);
      else
        assert.equal(executeCommand(`cat ${target}`, root).text, child.content);
    }
  }
  visit(filesystem, '');
});
void test('navigation preserves working directory on errors', () => {
  const context = { cwd: '/projects', history: [] };
  assert.equal(executeCommand('cd rival', context).cwd, '/projects/rival');
  assert.equal(executeCommand('cd missing', context).cwd, undefined);
  assert.equal(context.cwd, '/projects');
  assert.equal(executeCommand('cd /resume.pdf', context).error, true);
  assert.equal(executeCommand('cd ..', context).cwd, '/');
  assert.equal(executeCommand('cd ~', context).cwd, '/');
});
void test('ls and ls -la return real entries', () => {
  assert.deepEqual(
    executeCommand('ls projects', root).entries?.map((item) => item.name),
    ['loanlog', 'garagelog', 'rival', 'iinspect'],
  );
  assert.match(executeCommand('ls -la /skills', root).text ?? '', /-r--r--r--/);
  assert.equal(executeCommand('ls -z', root).error, true);
});
void test('project open is separate from file reading', () => {
  assert.equal(
    executeCommand('open loanlog', { ...root, cwd: '/projects' }).project,
    'loanlog',
  );
  assert.equal(executeCommand('open /projects/rival', root).project, 'rival');
  assert.equal(
    executeCommand('open /projects/rival/overview.txt', root).project,
    undefined,
  );
  assert.match(
    executeCommand('open /projects/rival/overview.txt', root).text ?? '',
    /sports-club/,
  );
  assert.equal(
    executeCommand('open resume.pdf', { ...root, cwd: '/projects' }).view,
    'resume',
  );
});
void test('crash impact is presented through the Android entry', () => {
  const android = executeCommand('cat /experience/spenmo/android.txt', root);
  const impact = executeCommand('cat /experience/spenmo/impact.txt', root);
  assert.equal(android.view, 'impact');
  assert.equal(impact.view, undefined);
  assert.match(android.text ?? '', /solo Android engineer/);
  assert.doesNotMatch(impact.text ?? '', /crash/i);
});
void test('play lists games and launches snake through a game result', () => {
  assert.equal(
    executeCommand('play', root).text,
    'Available games:\n\nsnake\n\nUsage:\nplay snake',
  );
  assert.equal(executeCommand('play snake', root).game, 'snake');
  assert.equal(executeCommand('play pong', root).error, true);
});
void test('tech reports the portfolio stack and appears in help', () => {
  const output = executeCommand('tech', root).text ?? '';
  assert.match(output, /Next\.js 16/);
  assert.match(output, /Canvas 2D/);
  assert.match(output, /custom-built/);
  assert.match(
    executeCommand('help', root).text ?? '',
    /tech\s+Show this portfolio/,
  );
  assert.deepEqual(autocomplete('tec', '/'), ['tech ']);
});
void test('click navigation runs the same commands as typed navigation', () => {
  let context = root;
  const commands = navigationCommands('/experience/spenmo');
  assert.deepEqual(commands, [
    'cd /experience/spenmo',
    'cat overview.txt',
    'ls',
  ]);
  for (const command of commands) {
    const result = executeCommand(command, context);
    context = {
      cwd: result.cwd ?? context.cwd,
      history: [...context.history, command],
    };
    assert.ok(!result.error);
  }
  assert.equal(context.cwd, '/experience/spenmo');
});
void test('autocomplete supports commands and relative, absolute and home paths', () => {
  assert.deepEqual(autocomplete('cd pro', '/'), ['cd projects/']);
  assert.deepEqual(autocomplete('open loa', '/projects'), ['open loanlog']);
  assert.deepEqual(autocomplete('cat ~/about/b', '/projects'), [
    'cat ~/about/bio.txt',
  ]);
  assert.deepEqual(autocomplete('cd /projects/ri', '/'), [
    'cd /projects/rival/',
  ]);
  assert.deepEqual(autocomplete('who', '/'), ['whoami ']);
  assert.deepEqual(autocomplete('', '/'), []);
  assert.deepEqual(autocomplete('cat constructor', '/'), []);
});
void test('identity, lifecycle and easter eggs use predictable results', () => {
  assert.equal(executeCommand('whoami', root).view, 'identity');
  assert.equal(executeCommand('clear', root).effect, 'clear');
  assert.equal(executeCommand('exit', root).effect, 'exit');
  assert.equal(executeCommand('matrix', root).effect, 'matrix');
  assert.match(
    executeCommand('rm -rf /', root).text ?? '',
    /Permission denied/,
  );
  assert.match(executeCommand('coffee', root).text ?? '', /100%/);
  const randomOutput = executeCommand('random', root).text ?? '';
  assert.ok(randomFacts.some((fact) => randomOutput.includes(fact)));
  assert.equal(executeCommand('pwd', root).text, '/');
  assert.match(
    executeCommand('history', { cwd: '/', history: ['whoami', 'pwd'] }).text ??
      '',
    /2  pwd/,
  );
  assert.equal(executeCommand('x'.repeat(4097), root).error, true);
});
void test('random facts cover the complete list', () => {
  assert.equal(
    pickRandomFact(() => 0),
    randomFacts[0],
  );
  assert.equal(
    pickRandomFact(() => 0.999999),
    randomFacts[randomFacts.length - 1],
  );
});
void test('light mode commands refuse with a random quip', () => {
  for (const command of ['light', 'lightmode']) {
    const output = executeCommand(command, root);
    assert.equal(output.effect, undefined);
    assert.match(output.text ?? '', /LIGHT MODE REQUEST: DENIED/);
    assert.ok(
      lightModeRefusals.some((message) => output.text?.includes(message)),
    );
  }
  assert.equal(
    pickLightModeRefusal(() => 0),
    lightModeRefusals[0],
  );
  assert.equal(
    pickLightModeRefusal(() => 0.999999),
    lightModeRefusals[lightModeRefusals.length - 1],
  );
});
void test('tree describes the current subtree', () => {
  const result = executeCommand('tree', {
    cwd: '/projects/rival',
    history: [],
  });
  assert.match(result.text ?? '', /overview.txt/);
  assert.doesNotMatch(result.text ?? '', /spenmo/);
});
