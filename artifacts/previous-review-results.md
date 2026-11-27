# Safe Studio Playwright review

Run date: 2026-11-25

## Browser and build

- Tested `safe-studio-standalone.html` in headless Chromium bundled by the npm package `@sparticuz/chromium`, driven by Playwright.
- Mirrored app fixes to `index.html` so the two entry points stay in sync.
- Final Playwright run: **41 checks passed, 0 failed, 0 browser page errors**.
- Confirmed `safe-studio-standalone.html` does not load or bundle Q.js (`typeof Q === "undefined"`). The walkthrough is implemented locally so it works in the standalone/offline build.

## Coverage

- All 98 templates: valid layout references and representative DOM rendering from all 12 categories.
- All 41 layouts and all 75 palette tools rendered as DOM sections/blocks.
- First-run state: template CTA, import/clone/layout entry points, no duplicate add-section action, and collapsed debugger panel.
- Six-step getting-started tour: open from the empty state or header, progress/back/skip/finish, keyboard arrows and Escape, reopen on desktop, and launch from the mobile More menu.
- Qbix-connected Test mode: root and nested tool setup, `toolOptions` forwarding, activation callbacks, disposal when returning to Design, standalone fallback, and runtime help. These tests use a Qbix API-shaped stub; actual authenticated tools still need a bootstrapped target app.
- Page selection and properties; tool picker; custom tool create/edit; nested section layouts created from both block and section properties; recursive nested editing; page tabs; themes; device preview.
- Class/font/clone dialogs; phone-width properties/handler panels.
- SafeScript compile, start at first statement, stepping, continue/discard, and stop.
- Timeline edit, undo/redo, branch creation, and snapshot restore.
- JSON page, project, and custom-tool import/export; standalone HTML export opened in Chromium and checked for nested tool content.
- Nested layout child sections keep their desktop grids, stack into one column at 390 px and in the editor's device preview, survive browser reload, and render in exported standalone HTML.
- Recursive custom tools return through the editor stack; page navigation saves the root page; cyclic references stop safely; component class styles remain scoped in standalone output.
- Responsive viewport overflow.
- Mobile editor header at 320, 360, 375, 390, 414, and 430 px: the document stays viewport-width, logo/project/title/mode/menu targets meet 40 px minimum height, and the import/export menu stays inside the viewport.
- Exported editorial page at 320, 360, 390, and 430 px: the section links collapse into a working disclosure menu, nested grids stack, and there is no horizontal overflow.
- Outline navigation through page blocks and nested layouts, nested layout edit/reuse, image upload with alt text, asset JSON export, save checkpoint restore, and template gallery category/search/preview behavior.
- Actual inline-edit interaction and SafeScript runtime failure: the debugger explains the missing name, reports its source line, and the Show line button moves the editor cursor to that line.
- Import validation and repair: legacy/unknown layout conversion with a review step, malformed project rejection, and user-confirmed import.
- Mobile Add and Outline tools, gallery dialog width, safe-area bounds, and the sample walkthrough creating a new page without overwriting existing work.
- Share preview round trip: exported share hash opens the shared page in Test mode as a separate, non-persisted copy.

The catalog matrix checks every entry’s structure and renders every tool/layout. It does not simulate every configuration and runtime interaction for every tool or every possible SafeScript program.

## Fixes

1. `dbgStartSession()` initialized the UI state to `running` after creating the SafeScript session. SafeScript can pause synchronously during construction, so that assignment overwrote the real paused state. Initialization now happens first, and callback state remains authoritative.
2. The first-use canvas now offers a clear primary template path plus layout, project import, and clone choices. The add-section shortcut is hidden while the canvas is empty, and the duplicate template action is hidden from page properties until the page has content.
3. The debugger dock now collapses to its tabs on launch. Opening Handlers or Timeline expands it.
4. The phone header now uses a compact two-row grid. Long page titles truncate with an ellipsis, and action buttons wrap instead of forcing the page wider.
5. Nested layouts now render recursively, with a 16-level guard and cycle placeholder. The tool editor maintains a parent stack, scopes DOM-child lookup and class styles to each tool instance, and unwinds to the page before project navigation.
   Creating one now starts with a name and starting arrangement; icon and internal ID are under collapsed Advanced settings. The editor labels nested layouts clearly and shows breadcrumbs back to parent layouts or the page.
6. The mobile header now moves import/export/theme controls into a reachable menu with larger tap targets. The logo, project picker, page title, and mode/menu controls have 40 px minimum targets; the action menu stays onscreen even at 320 px.
7. The mobile header, fixed panels, canvas, and tab bar now reserve iPhone safe areas. The viewport metadata no longer blocks pinch zoom.
8. The editorial demo wraps its section links into a native disclosure menu on narrow screens instead of stacking all links above the page content.
9. Test mode now detects an already bootstrapped Qbix runtime, activates real Qbix tools from block IDs and options (including inside nested layouts), and removes those instances before canvas rerenders or returning to Design. Standalone mode continues to show its local previews and explains how to run under a Qbix app bootstrap.
10. The inspector now has a page outline with one-click selection and nested layout navigation. The Add panel groups layout, content, and reusable nested-layout actions together.
11. The Assets panel accepts local images or image URLs, keeps alt text in the page model, lets blocks reuse assets, and includes the library in page/project JSON exports.
12. The header shows save state and offers a recovery checkpoint. Users can save a checkpoint manually, restore it, or export their work if local storage fails.
13. The template gallery adds category counts, search, and miniature previews. The guided walkthrough can insert a sample page into the current project without replacing the user's pages.
14. Mobile inspector panels are compact bottom sheets with larger touch targets; the gallery header wraps into a usable narrow-screen layout without page-level horizontal scrolling.
15. Share Preview creates a portable hash link that opens an isolated Test-mode copy. Editing the shared copy does not write over the user's local project.
16. Existing inline editing is now labelled **Edit text** in the inspector. Runtime debugger failures open a recovery card with a plain-language explanation, source-line navigation, rerun, and copy/open-console actions.
17. JSON imports now receive validation and migration review. Unknown layouts are converted to a safe text layout, malformed projects are rejected before mutation, and repair warnings are shown before import.

## Screenshots

`final-screenshots/` contains 10 fresh paired checkpoints, each captured at 1440×1000 desktop and 390×844 mobile. They show the first-run screen, template gallery, landing page, selection/properties, theme, custom tool editor, debugger, timeline, and imported/Test/exported page. It also contains desktop/mobile screenshots of the quick-start tour and nested-layout setup. `nested-news-desktop.png` and `nested-news-mobile.png` show recursive layouts; the mobile version uses a compact, working section menu. The refreshed capture scripts are `capture-final.cjs`, `capture-ux-shots.cjs`, and `capture-nested-news.cjs`.
