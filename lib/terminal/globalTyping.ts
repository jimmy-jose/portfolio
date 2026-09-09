export type GlobalTypingEvent = {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
  targetTag?: string;
  targetIsEditable: boolean;
};

const INTERACTIVE_TAGS = new Set([
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'BUTTON',
  'A',
]);

/** Capture plain printable keys on desktop without stealing shortcuts or controls. */
export function shouldCaptureGlobalTyping(
  event: GlobalTypingEvent,
  hasDesktopPointer: boolean,
): boolean {
  if (!hasDesktopPointer || event.defaultPrevented || event.key.length !== 1)
    return false;
  if (event.metaKey || event.ctrlKey || event.altKey || event.targetIsEditable)
    return false;
  return (
    !event.targetTag || !INTERACTIVE_TAGS.has(event.targetTag.toUpperCase())
  );
}
