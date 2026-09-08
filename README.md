# Jimmy Jose — Terminal Portfolio

Next.js App Router, React, strict TypeScript, Tailwind CSS, Motion for React and Canvas 2D. Static export; no terminal input is ever sent to a server or operating-system shell.

## Development

```sh
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

`out/` is the deployable static site. Serve that directory with any static web host. `next start` is not applicable to static exports.

## Content configuration

- `data/portfolio.ts`: project stories and contact configuration.
- `data/filesystem.ts`: resume content as a typed, read-only virtual filesystem.
- Add the original PDF at `public/resume.pdf`, then set `contact.resume` to `/resume.pdf`.
- Set `contact.github` and `contact.linkedin` to verified HTTPS profile URLs. Missing URLs are omitted; the resume action explains when the original document is unavailable.
- The email comes from the supplied brief. No phone number is exposed.

## Architecture

`parseCommand` tokenizes quoted arguments without evaluating anything. The pure `executeCommand` function dispatches to a registry of small handlers. Paths resolve only within the in-memory filesystem, with own-property checks to prevent prototype traversal. Both clickable navigation and typed commands call this engine. Shell operators are literal text, not shell syntax; chain commands with separate submissions.

The session hook owns output history and effects. `ExperienceViewer` is a lazy-loaded, accessible dialog driven by a project ID, providing a boundary for a future Three.js scene renderer. It currently uses only DOM and Motion. Project features describe the supplied brief and do not claim additional features or impact metrics.

The terminal uses normal document scrolling. Startup replays on each page load: CRT power-on → session header → `whoami` typing → Enter → Matrix content reveal → clickable controls. The sequence lasts 2.85 seconds, can be skipped by a key or pointer, and is bypassed for reduced motion. The block cursor tracks the real input selection and horizontal scroll while editing. Rain caps device-pixel ratio, draws at a low frame rate, reduces density on mobile, stops when hidden and respects reduced motion. Effects can also be turned off. All listeners, timers, canvas frames and optional WebMCP registration clean up on unmount.

## Checks

Automated tests cover paths, filesystem content, quoted arguments, prototype keys, inert shell syntax, navigation, project/file distinctions, autocomplete, history, lifecycle and easter eggs. The optional `run_portfolio_command` WebMCP tool is feature-detected and calls the same UI action. No supported WebMCP validation context was available during initial development; its browser contract is not verified.

## Remaining content inputs

The supplied attachment contains the brief only: the original resume PDF and verified GitHub/LinkedIn URLs still need to be provided. No substitute resume or invented social profile is shipped.
