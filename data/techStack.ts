export const techStack = [
  ['FRAMEWORK', 'Next.js 16 · App Router · Static export'],
  ['UI', 'React 19 · TypeScript · Tailwind CSS 4'],
  ['MOTION', 'Motion for React · Custom CRT animations'],
  ['GRAPHICS', 'Canvas 2D · Matrix rain · snake.exe'],
  ['COMPONENTS', 'Base UI · shadcn'],
  ['QUALITY', 'Node test runner · TSX · Oxlint · Oxfmt'],
] as const;

export function formatTechStack(): string {
  const rows = techStack.map(([area, tools]) => `${area.padEnd(12)} ${tools}`);
  return [
    'PORTFOLIO TECH STACK',
    '',
    ...rows,
    '',
    'Terminal engine, command parser, virtual filesystem and Snake engine are custom-built.',
    'No terminal emulator or game framework.',
  ].join('\n');
}
