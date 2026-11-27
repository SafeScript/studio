# Resumable debugging and execution explorer

Open `index.html` or `safe-studio-standalone.html` directly in a browser. Both include the new engine and UI.

## Try the demonstrated workflow

1. Import `artifacts/debugging-demo.json`.
2. Open the right-hand block's onClick handler. Set a breakpoint on line 9.
3. Select Test, keep Record Test events enabled, and click Calculate team quote.
4. In Handlers inspect seats, subtotal and discount. In Timeline expand the event or drag the scrubber.
5. Continue: the projected quote becomes $164.00. The live page remains $174 until commit.
6. Seek back to the calculation. Change `subtotal - discount` to `subtotal * 0.85 - discount`.
7. Apply edits and Continue. The second future returns $137.90. The fork map and future selector retain both results.
8. Commit the chosen future or Discard its effects.

## Source organization

- `src/editor-shell.html`: editor markup, styles and established app source; contains insertion markers.
- `src/debugger-ui.js`, `src/debugger-ui.css`: event sessions, controls, coordinated preview and fork explorer.
- `safescript/src/continuation-compiler.js`: debug-only code generation.
- `safescript/src/continuation-debug.js`: frames, independent snapshots, executable seeks/forks, edits, transaction boundaries.
- `safescript/src/journal.js`: typed commits, reused by the debug runtime.
- `artifacts/safescript-debugger.patch`: source patch against the recorded upstream base.

## Build and verify

Use Node 24 and run `npm install` in this directory, then:

```sh
npm run build
npm run test:editor
npm run test:explorer
npm run test:engine
```

The engine regression runner intentionally exits nonzero for the two inherited failing suites. See `REVIEW-RESULTS.md`, `artifacts/BASELINE-COMPARISON.json`, and the untouched-upstream logs. Do not describe that run as fully green. Focused engine suites can also be run with `npm run test:debug` inside `safescript` after installing its dev dependencies.

The complete engine source, browser bundles, tests, prior editor assets, current captures, raw test logs and demo JSON are included. No node_modules or Git credentials are packaged.
