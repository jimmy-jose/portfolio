import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldCaptureGlobalTyping } from '../lib/terminal/globalTyping';

const printableKey = {
  key: 'h',
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  defaultPrevented: false,
  targetTag: 'BODY',
  targetIsEditable: false,
};

void test('desktop printable keys activate terminal typing', () => {
  assert.equal(shouldCaptureGlobalTyping(printableKey, true), true);
  assert.equal(
    shouldCaptureGlobalTyping({ ...printableKey, key: ' ' }, true),
    true,
  );
});

void test('mobile, shortcuts and non-printable keys remain untouched', () => {
  assert.equal(shouldCaptureGlobalTyping(printableKey, false), false);
  for (const override of [
    { metaKey: true },
    { ctrlKey: true },
    { altKey: true },
    { defaultPrevented: true },
    { key: 'ArrowDown' },
    { key: 'Enter' },
  ]) {
    assert.equal(
      shouldCaptureGlobalTyping({ ...printableKey, ...override }, true),
      false,
    );
  }
});

void test('typing in existing controls is never redirected', () => {
  for (const targetTag of ['input', 'textarea', 'select', 'button', 'a']) {
    assert.equal(
      shouldCaptureGlobalTyping({ ...printableKey, targetTag }, true),
      false,
    );
  }
  assert.equal(
    shouldCaptureGlobalTyping(
      { ...printableKey, targetTag: 'DIV', targetIsEditable: true },
      true,
    ),
    false,
  );
});
