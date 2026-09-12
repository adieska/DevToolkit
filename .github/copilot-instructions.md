# Copilot instructions for DevToolKit

## Project overview

DevToolKit is a client-side React 19 + TypeScript single-page application built with Vite and Tailwind CSS 4. It provides a large catalog of developer utilities (formatting, encoding, conversion, cryptography, text, generation, networking, time, data, math, and image tools). Tool input and output are processed in the browser; there is no application backend or database for the tool workflows.

The app is also a PWA. `src/main.tsx` registers the service worker, and `vite.config.ts` configures the manifest, asset caching, React, and Tailwind Vite plugins.

## Build, test, and lint

Install dependencies with `npm ci` when reproducing CI or with `npm install` for local development.

| Purpose | Command |
| --- | --- |
| Start the Vite dev server on port 3000 | `npm run dev` |
| Typecheck (the repository's lint command) | `npm run lint` |
| Build the production bundle | `npm run build` |
| Preview the production build | `npm run preview` |
| Run unit tests | `npm test` |
| Run one unit test file | `npx vitest run src/utils/workspace.test.ts` |
| Run one unit test by name | `npx vitest run src/utils/workspace.test.ts -t "reads valid JSON from storage"` |
| Run Playwright browser tests | `npm run test:e2e` |
| Run one browser test file | `npx playwright test e2e/workspace.spec.ts` |
| Run one browser test by title | `npx playwright test e2e/workspace.spec.ts -g "persists favorites"` |

`npm test` excludes `e2e/**`. The Playwright config builds and serves the app on port 4173, and tests run in both desktop Chromium and mobile Chromium projects. CI runs unit tests, installs Chromium with `npx playwright install --with-deps chromium`, runs browser tests, typechecks, and builds.

## Architecture

- `src/main.tsx` is the browser entry point. It loads polyfills and styles, registers the PWA service worker, and renders `App` in React Strict Mode.
- `src/App.tsx` owns the workstation shell and cross-cutting UI state: selected tool/page, search and category filters, favorites, recent tools, theme, density, settings, keyboard shortcuts, and workspace import/export. It filters the catalog and dispatches each selected tool category to a lazily loaded component.
- `src/types.ts` is the catalog registry. `TOOLS` contains the tool IDs, display metadata, category, and icon; `CATEGORIES` drives sidebar navigation. A tool ID must be registered here for discovery and workspace imports to recognize it.
- Category components in `src/components/` implement the actual tool behavior. Most render through `ToolLayout`, which provides the shared input/result UI, copy action, presets, error display, and documentation tab. `Blog`, `Settings`, and `ToolLayout` are also lazy-loaded surfaces.
- `src/data/toolDocs.ts` contains Markdown documentation keyed by tool ID. `ToolLayout` falls back to generated generic documentation when an ID has no entry. `src/data/blogPosts.ts` supplies the technical journal content.
- `src/utils/workspace.ts` contains the small, unit-tested localStorage helpers for reading JSON state, toggling favorites, and maintaining the eight-item recent-tool list. `App` persists the resulting state under the namespaced keys defined there.
- `src/index.css` defines the Tailwind theme, shared input/output/button classes, dark visual system, and compact-density overrides. Prefer the existing utility classes and theme patterns over introducing a parallel styling system.
- `e2e/workspace.spec.ts` covers the primary browser workflows: lazy tool loading, favorites/recent state, responsive behavior, keyboard search, settings import/export/reset, accessibility, and offline PWA loading.

## Repository-specific conventions

- Add or change a tool as a coordinated catalog/dispatcher/component/docs change: register its unique ID in `src/types.ts`, ensure its category is routed in `App.tsx`, implement or extend the matching category component, and add an entry to `src/data/toolDocs.ts` when specific documentation is needed. Keep the existing category component pattern and pass the catalog metadata (`id`, `name`, `description`) into the component.
- Keep tool logic local to the browser. Do not add server calls or upload user input for ordinary tool behavior; use the existing browser APIs and installed client-side libraries.
- Preserve the shared `ToolLayout` contract for normal tools (`input`, `setInput`, `output`, `error`, `controls`, `customOutput`, `hideInput`, and `presets`). Use `customOutput` for visual/non-text results such as QR codes or images rather than duplicating the result panel.
- Workspace state is serialized JSON in `localStorage` using the `devtoolkit:` keys. Use the helpers in `src/utils/workspace.ts` for favorite/recent behavior, validate imported IDs against `TOOLS`, and preserve the recent-tools limit of eight.
- Tool components should expose user-facing failures through `ToolLayout`'s `error` prop and keep invalid input from producing misleading output. Follow the existing per-tool state and `useMemo`/`useEffect` patterns rather than introducing global state.
- Keep category and tool IDs stable. They are used by the catalog, lazy dispatcher, documentation lookup, local workspace backups, and end-to-end selectors.
- The UI supports desktop and mobile layouts, three themes (`dark`, `midnight`, `carbon`), and relaxed/compact density. Changes to controls or layout should preserve responsive behavior and the existing keyboard shortcuts (`Ctrl/Cmd+K`, `/`, and `Escape`).
- Tests use Vitest for pure helpers and Playwright for user-visible workflows. Prefer accessible roles, labels, and stable titles when extending browser tests; reset local storage in the same style as the existing `beforeEach`.
- Follow the existing repository formatting style: TypeScript/TSX with semicolons, single-quoted imports/strings, and Tailwind utility classes in JSX. The `lint` script is TypeScript typechecking rather than a separate ESLint configuration.

## Contribution and deployment references

Before submitting a change, use the checklist in `CONTRIBUTING.md` and run `npm run lint`; for behavior changes, cover the relevant desktop/mobile workflow. The application is a static SPA: `npm run build` produces `dist/`, which can be served by a static host with SPA fallback and includes the generated PWA manifest/service worker. See `DEPLOYMENT.md` for hosting-specific guidance.

## MCP

The workspace provides a Playwright MCP server in `.vscode/mcp.json`. Use it for interactive browser verification of the Vite app, especially responsive layouts, keyboard workflows, accessibility behavior, PWA loading, and tool interactions that are also covered by `e2e/workspace.spec.ts`. Start the app with `npm run dev` when the MCP browser needs the development server; the Playwright test suite continues to use its own production preview server.
