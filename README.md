# Jimmy Jose — Terminal Portfolio

Next.js App Router, React, strict TypeScript, Tailwind CSS, Motion for React, Canvas 2D, Vercel Blob and Vercel Web Analytics. Terminal commands are parsed entirely in the browser and are never sent to an operating-system shell. Only Snake leaderboard reads and score submissions use the server.

## Development

```sh
npm install
npm run dev
npm test
npm run typecheck
npm run build
npm start
```

`npm run dev` starts the site at `http://localhost:3000`. A production build uses the normal Next.js server output and can run with `npm start` after `npm run build`.

## Content configuration

- `data/portfolio.ts`: project stories and contact configuration.
- `data/randomFacts.ts`: personal details printed by the `random` command.
- `data/terminalQuips.ts`: randomized light-mode refusal messages.
- `data/techStack.ts`: formatted output for the `tech` command.
- `data/filesystem.ts`: resume content as a typed, read-only virtual filesystem.
- Add the original PDF at `public/resume.pdf`, then set `contact.resume` to `/resume.pdf`.
- Set `contact.github` and `contact.linkedin` to verified HTTPS profile URLs. Missing URLs are omitted; the resume action explains when the original document is unavailable.
- The email comes from the supplied brief. No phone number is exposed.

## Architecture

`parseCommand` tokenizes quoted arguments without evaluating anything. The pure `executeCommand` function dispatches to a registry of small handlers. Paths resolve only within the in-memory filesystem, with own-property checks to prevent prototype traversal. Both clickable navigation and typed commands call this engine. Shell operators are literal text, not shell syntax; chain commands with separate submissions.

The session hook owns output history and effects. `ExperienceViewer` is a lazy-loaded, accessible dialog driven by a project ID, providing a boundary for a future Three.js scene renderer. It currently uses only DOM and Motion. Project features describe the supplied brief and do not claim additional features or impact metrics.

`play snake` launches a Canvas-based game inside the terminal session without changing routes. The pure engine in `lib/games/snake/` owns movement, growth, collision, food placement and speed. React manages the start, pause and game-over screens, while Canvas draws each fixed-step update without rerendering the portfolio. Keyboard, swipe and touch-button controls are scoped to game mode; Escape returns to the terminal and prints the final score.

### Global Snake leaderboard

The global top three live in one private Vercel Blob. The browser talks to `/api/snake-leaderboard`; the Blob credential stays inside the server-side route. Writes use the current blob ETag and retry when another score wins the race, so concurrent submissions do not overwrite a newer leaderboard. The API rejects malformed payloads and scores beyond the 20×20 board maximum. Scores that do not enter the top three do not trigger a Blob write.

1. Import this repository into Vercel or link it to an existing Vercel project.
2. In the project dashboard, open **Storage**, create a **Blob** store and connect it to this project.
3. Redeploy. Vercel supplies `BLOB_READ_WRITE_TOKEN` to the server automatically.
4. For a working leaderboard during local development, run `npx vercel link`, then `npx vercel env pull .env.local` before `npm run dev`.

Snake remains playable without Blob configuration and shows `BLOB LINK REQUIRED` in the leaderboard panel. The API stores only the three displayed names and scores. Because gameplay runs in the browser, a determined visitor can forge a score request; the server validates data shape and range, but the leaderboard is intentionally a lightweight portfolio feature rather than a cheat-proof competition service.

### Vercel Web Analytics

`@vercel/analytics` is mounted in `app/layout.tsx`, so page views and route changes are tracked automatically. Enable Web Analytics from the project’s **Analytics** section in the Vercel dashboard, then redeploy to start collecting data.

The page stays fixed to the viewport. The terminal fills the space between the site header and footer; its chrome stays fixed while its content scrolls internally. Output auto-scroll is scoped to that content area and moves to the bottom as soon as startup finishes, keeping the input cursor visible. The profile and navigation use compact spacing to fit together on typical desktop screens. The scroll region is keyboard-focusable and adapts to smaller screens. Startup replays on each page load: CRT power-on → session header → `whoami` typing → Enter → Matrix content reveal → clickable controls. The sequence lasts 2.85 seconds, can be skipped by a key or pointer, and is bypassed for reduced motion. The block cursor tracks the real input selection and horizontal scroll while editing. Matrix rain fills the page behind the terminal and remains subtly visible through its translucent CRT glass. The canvas caps device-pixel ratio, draws at a low frame rate, reduces density on mobile, stops when hidden and respects reduced motion. Effects can also be turned off. All listeners, timers, canvas frames and optional WebMCP registration clean up on unmount.

On desktop, pressing any printable key outside another control focuses the terminal input and retains that first character. Modifier shortcuts, dialog interactions, links, buttons and editable controls keep their native keyboard behavior. Touch devices still require an explicit tap, which avoids opening a mobile keyboard unexpectedly.

## Checks

Automated tests cover paths, filesystem content, quoted arguments, prototype keys, inert shell syntax, navigation, project/file distinctions, autocomplete, history, lifecycle and easter eggs. The optional `run_portfolio_command` WebMCP tool is feature-detected and calls the same UI action. No supported WebMCP validation context was available during initial development; its browser contract is not verified.

## Remaining content inputs

The supplied attachment contains the brief only: the original resume PDF and verified GitHub/LinkedIn URLs still need to be provided. No substitute resume or invented social profile is shipped.

## Terminal printing

Clicks enqueue complete command batches, so a navigation action types `cd`, changes directory, then types `ls` and prints its output. File contents stream character by character and directory listings print in order. Typed commands use the same queue and print their results without retyping the submitted command. Project and logout effects wait until their output finishes. “Show all” fast-forwards the queued work; reduced motion bypasses delays. Only completed output is announced to screen readers. Pending animation timers are cancelled on unmount.
