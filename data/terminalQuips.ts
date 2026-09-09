export const lightModeRefusals = [
  'The phosphor pixels are nocturnal. Request denied.',
  'Permission denied. This terminal was raised in the dark.',
  'LIGHT_MODE_SERVICE_UNAVAILABLE: sunlight dependency not installed.',
  'Nice try. The Matrix has no windows.',
  'Theme switch aborted. One does not simply bleach a mainframe.',
  'Request rejected. The terminal says darkness builds character.',
  'No can do. The blinking cursor threatened to resign.',
  'Light mode is currently attending a wellness retreat somewhere else.',
] as const;

export function pickLightModeRefusal(
  random: () => number = Math.random,
): string {
  const index = Math.floor(random() * lightModeRefusals.length);
  return lightModeRefusals[index] ?? lightModeRefusals[0];
}
