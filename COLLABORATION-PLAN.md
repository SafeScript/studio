# Safe Studio — Full Platform Integration Plan

How to wire Safe Studio to the Qbix Platform for real-time collaboration, brand matching, theme extraction, embeddable widgets, and content import — using infrastructure that already exists.

## Data Model

A Safe Studio project maps to streams:

- **Project stream** — type `Websites/project`, publisherId = owner. Holds project metadata (name, theme, settings) in attributes. All pages and tools are related to it.
- **Page streams** — type `Websites/page`, one per page in the project. The stream's `content` field holds the serialized page JSON (sections, blocks, handlers, classStyles). Each edit posts a `Websites/page/changed` message with the diff in `instructions`.
- **Tool streams** — type `Websites/tool`, one per custom tool. Same pattern: structure in content, edits as messages.
- **Relations** — pages and tools are related to the project stream via `Websites/project/pages` and `Websites/project/tools` relation types, with weight for ordering (tab order).

This means every page and tool has its own access control, its own message history, and its own fork chain.

## Step 1: Persist to Streams Instead of localStorage

**Current state:** `save()` writes to `localStorage`. `load()` reads from it. Single-user, single-device, no history.

**Change:** When connected to a Qbix backend, `save()` posts a `Websites/page/changed` message to the page stream with the diff. `load()` fetches the stream and applies its content. localStorage remains the offline/standalone fallback.

What to build:
- `SS.connectBackend(baseUrl)` — initialize Q.Streams connection
- `SS.saveToStream()` — compute diff from last known state, post as message
- `SS.loadFromStream(publisherId, streamName)` — fetch stream, parse content into state
- Diff format: `{sections: [{op:'update', si:0, field:'title', value:'New'}], handlers: [{op:'set', key:'0:1:onClick', code:'...'}]}`
- Conflict resolution: last-write-wins per field (stream messages are ordered), with UI notification when a field you're editing was changed by someone else

Files to modify:
- `index.html`: add `connectBackend`, `saveToStream`, `loadFromStream` functions
- Keep `save()`/`load()` working for standalone mode (no backend)

## Step 2: Real-Time Sync via Stream Observation

**What exists:** `Q.Streams.Stream.observe()` registers for socket updates. `stream.onMessage()` fires on new messages. Ephemerals broadcast without persistence.

What to build:
- On `loadFromStream()`, call `Q.Streams.retainWith('safe-studio').get(pubId, name, ...)` to observe the page stream
- `stream.onMessage('Websites/page/changed')` handler: parse the diff from `message.instructions`, apply it to `state.page`, call `renderCanvas()`. Skip if the message was posted by the current user (avoid echo).
- `stream.onFieldChanged('content')` handler: full reload fallback if the content field itself changed (e.g., from a non-Safe-Studio client).

This gives you: two people open the same page, one drags a block, the other sees it appear. No polling, no refresh.

## Step 3: Ephemeral Signals for Live Presence

**What exists:** Ephemerals are non-persisted broadcasts to observers. `writeLevel >= ephemeral (16)` required. Used for typing indicators and cursor positions in Streams/chat.

What to build:
- **Selection broadcast:** When a user selects a block or section, send an ephemeral `Websites/page/selection` with `{userId, si, bi}`. Other clients render a colored outline on that block with the user's avatar.
- **Editing broadcast:** When a user is editing a block's content (typing), send ephemeral `Websites/page/editing` with `{userId, si, bi}`. Others see a "User is editing..." indicator on that block.
- **Cursor position (optional, later):** For the code editor, broadcast cursor line/column as `Websites/page/cursor` ephemerals. Others see a colored cursor in the code editor.

What to build in the UI:
- Colored border/avatar badges on blocks being viewed or edited by others
- "2 people viewing" indicator in the header
- Conflict prevention: if someone is editing a block, show a lock icon and prevent others from entering edit mode on the same block (advisory, not enforced — the stream's access control is the real gate)

## Step 4: Forks as Branches

**What exists:** `Streams::fork()` copies a stream at a specific ordinal. The fork inherits access, starts its own message chain from that point, and is related to the source via `Streams/fork`. Message fetch on a forked stream transparently walks the fork chain.

What to build:
- **"Fork this page" button** in the project tabs or page properties. Calls `Streams.fork(asUserId, pubId, streamName, currentOrdinal)` on the page stream. Creates a new page stream that inherits the content up to that point.
- **Fork indicator in tabs:** Forked pages show a branch icon and the source page name. "Registration (fork of Main)".
- **Preview fork:** View a forked page side-by-side with the original. Since both are page streams, just load both into two canvas views.
- **Merge fork:** Apply the fork's changes (messages after the fork point) to the original stream. This is `Streams::relate` the fork's post-ordinal messages as a batch update on the original. The merge UI shows a visual diff: blocks added, changed, or removed.
- **Discard fork:** Close the fork stream. `Streams::close()`.

The fork chain is transparent for message fetch, so the history view (Timeline tab) already shows the full chain.

## Step 5: Workspaces as Override Layers

**What exists:** Workspaces are virtual publisher namespaces (`alice~ws2`). The client passes `workspaces[]` for overlay semantics. `Streams_Workspace::stackedPublisherIds` builds a cascade: writes go to the topmost workspace, reads fall through.

What to build:
- **"Create workspace" button** for a page. The workspace is a layer where the user's customizations live without touching the base page.
- **Workspace indicator** in the UI: "Editing in: My Draft (workspace)" with a button to "Publish to base" (merge down) or "Discard workspace" (delete).
- Workspace stacking: an admin's base page, a designer's styling workspace on top, a content editor's copy workspace on top of that. Each sees their own overlay merged with the layers below.

This is the most advanced collaboration feature. Build it after forks are working, since it builds on the same stream infrastructure but adds the stacking semantics.

## Step 6: Roles and Invitations

**What exists:** `Streams::invite()` sends invitations with access levels. `Users_Contact` manages contacts under labels. Labels like `Users/owners`, `Users/admins`, `Users/members` are built in. Access rows can grant permissions by label.

What to build:
- **Invite UI in Safe Studio:** "Invite collaborator" button in project properties. Opens a dialog:
  - Email or username input
  - Role picker: Viewer (readLevel: content), Commenter (writeLevel: suggest), Editor (writeLevel: edit), Admin (adminLevel: manage)
  - Calls `Streams.invite(pubId, streamName, {identifier: email}, {readLevel, writeLevel, adminLevel})`
- **Participants panel:** Add a `Streams/participants` tool to the project-level UI (not on pages, on the project). Shows who has access, their role, online status.
- **Role-based UI filtering:**
  - Viewer: canvas is read-only, no palette, no properties editing. Can comment (via stream messages).
  - Commenter: can fork (suggest changes) but not edit the base page directly.
  - Editor: full editing access.
  - Admin: can invite others, manage roles, merge forks, delete pages.
- The access levels on the page stream enforce this server-side. The UI just reflects what the user can do based on `stream.testWriteLevel()` / `stream.testAdminLevel()`.

## Step 7: Comments on Blocks

**What exists:** `Streams/comments` tool provides threaded comments on any stream. Each comment is a message on the stream.

What to build:
- **Comment mode:** A toggle in the toolbar. When active, clicking a block opens a comment thread for that block instead of selecting it.
- **Comment anchoring:** Comments are messages on the page stream with `instructions: {si, bi, type: 'comment'}`. They're anchored to a specific block.
- **Comment indicators:** Small badge on blocks that have comments. Click to expand the thread.
- **Resolution:** An admin or the commenter can resolve a comment (close the thread). The resolved state is stored as a message attribute.

This is similar to Figma's comment system but wired to Streams messages, so comments survive forks and can be resolved across workspaces.

## Step 8: Version History from Stream Messages

**What exists:** Every edit is a message with an ordinal. `Streams_Message::fetch()` returns messages in order. Fork chains are transparent.

What to build:
- **History panel** in the Timeline tab. Instead of the current in-memory undo tree, show the stream's message history. Each message is a labeled change: "Moved Section 2 up", "Changed Hero title", "Added onClick handler".
- **Time travel:** Click any message in the history to preview the page at that point. This reconstructs the page state by replaying messages from ordinal 0 to N.
- **Restore:** "Restore to this version" posts a new message that sets the page content to the reconstructed state at that ordinal.
- **Diff view:** Select two points in history to see what changed between them. Visual diff on the canvas (green = added, red = removed, yellow = changed).

The fork chain makes this work across branches: the full history includes the parent stream's messages before the fork point.

## Step 9: Embeddable Widgets with Collaboration

**What exists:** `embed.php` serves a tool in an iframe. `Q_Embed_Sanitizer` validates the HTML. `Streams/embed` tool renders the embed with stream data bindings.

What to build:
- **"Publish as widget" button** in page/tool properties. Sanitizes the page's exported HTML, stores it as `Streams.embed.html` on the page stream, and generates the embed URL.
- **Live widgets:** Since the embed is backed by a stream, changes to the page stream update the widget. The embed tool observes the stream and re-renders when the content changes.
- **Widget permissions:** The embed URL includes the stream's publisherId and name. The stream's access control determines who can view the widget. Public widgets set `readLevel: see` on the stream.

## Implementation Order

1. **Persist to Streams** (Step 1) — foundation for everything else
2. **Real-time sync** (Step 2) — the first "wow" moment: two browsers, same page, live updates
3. **Roles and invitations** (Step 6) — makes it shareable: "invite your designer"
4. **Ephemeral presence** (Step 3) — shows who's looking at what
5. **Comments** (Step 7) — feedback loop without editing access
6. **Forks** (Step 4) — "try this layout" without breaking the live page
7. **Version history** (Step 8) — confidence to make changes (you can always go back)
8. **Workspaces** (Step 5) — advanced overlay composition
9. **Embeddable widgets** (Step 9) — distribution

Each step is independently useful. Step 1-2 gives you real-time collaborative editing. Add step 3-4 and you have Figma-like collaboration. Add step 5-6 and you have role-based team workflows. Steps 7-9 are polish and distribution.

## What Does NOT Need Building

- Access control enforcement — Streams handles this server-side
- Socket infrastructure — Q.Streams already manages WebSocket connections
- User authentication — Users plugin handles login, registration, platform auth
- Message ordering — ordinals are auto-assigned, fork chains are transparent
- Notification delivery — subscription pipeline handles email/push/device notifications
- Avatar display — `Streams_Avatar` provides cached display info per viewer

The collaboration features are UI on top of existing Platform primitives. The heavy lifting is done.

---

## Part 2: Brand Matching and Theme Extraction

The Websites plugin already has headless Chrome analysis that extracts a website's visual identity: colors, fonts, brand color, link color, nav structure, and CSS variables. Safe Studio can use this to let someone say "make my page look like my existing website" — and get the right answer automatically.

## Deep Analysis: What analyze.js Already Provides (Mechanically, No LLM)

The Websites plugin's `analyze.js` (614 lines) runs in headless Chrome on any URL. Everything it extracts is algorithmic — DOM walking, computed style reading, weighted tallying, saturation scoring. No model calls.

**Colors (weighted by visual prominence, not element count):**
- `colorRoles.foreground[]` — text colors weighted by direct text length per element. A 200-character paragraph of `#333` outweighs a 3-character span of `#f00`. Uses `directTextLength()` which counts only text nodes, skipping wrapper elements.
- `colorRoles.background[]` — background colors weighted by visible area (px²). Only surfaces >10,000px² counted. Skips tiny decorative elements.
- `brandColor` — the foreground color (excluding body text color) with the highest `saturation × luminance_distance × log(text_weight)` score. Pure algorithm.
- `linkColor` — most common `<a>` text color by text length.
- `dominantColors[]` — legacy union of fg+bg (excluding near-white), sorted by count.
- `rootThemeColors` — every `--custom-property` on `:root` that parses to a hex color.

**Fonts (body vs heading, tallied separately):**
- `bodyFont` / `headingFont` — from `tallyFonts("p, li, td, span")` vs `tallyFonts("h1, h2, h3, h4, h5, h6")`, weighted by direct text length.
- `bodyFontWeight` / `headingFontWeight` — same tallying on `font-weight`.
- `bodyFontsAll[]` / `headingFontsAll[]` — full ranked lists with counts.
- `_assets.fontFaces[]` — every `@font-face` from every stylesheet (the PHP side crawls all `@import` chains). Each: family, weight, style, src URLs.
- `_assets.fontFiles[]` — absolute URLs to actual font files (woff2, woff, ttf).
- `_assets.cssUrls[]` — all discovered stylesheet URLs.

**Element styles (computed, per selector):**
- `stylesBySelector` — for every common element type (`h1`-`h6`, `p`, `a`, `button`, `input`, `blockquote`, `code`, `pre`, `nav`, `header`, `footer`, `section`, `article`, `aside`, etc.): color, backgroundColor, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, boxShadow, borderRadius, all border colors.

**Navigation (scored candidates):**
- `detectedNav` — the top-scoring candidate, with: full inline-style HTML snapshot (up to 200 nodes with 60+ computed style properties applied inline), links array (text + absolute href), fg/bg colors, display, position, bounding rect, CSS selector path.
- Scoring: internal link count × 10, nav class/id hint bonus (+50), top-of-page bonus (+30), penalized by excessive height. Checks `<nav>`, `[role=navigation]`, `<header>`, and class/id patterns matching `nav`, `navbar`, `navigation`, `menu`, etc. Fallback: probe `elementFromPoint(viewport_center, 20px)` and walk up.

**Largest content blocks:**
- `largestBlocks[0..2]` — 3 largest visible elements (excluding nav/header/footer/hidden), with: CSS selector path, bounding rect, display, position, colors, fontFamily, fontSize, 240 chars sample text.

**What `generateThemeCss()` produces from all this:**
`:root` block with `--theme-fg`, `--theme-bg`, `--theme-brand`, `--theme-link`, `--theme-nav-bg`, `--theme-nav-fg`, `--theme-font-body`, `--theme-font-heading`, `--theme-font-weight-body`, `--theme-font-weight-heading`, `--theme-accent-1`, `--theme-accent-2`, plus `@font-face` blocks with actual font file URLs. Falls back gracefully (body→system-ui, brand→#4a90e2, etc.).

**What `scrape()` provides (PHP, no headless Chrome needed):**
Title, description, keywords, OG metas (image, title, description, type, url), favicon/apple-touch-icon, language, content type, canonical URL, copyright. Follows redirects, handles gzip, caches for 30 days.

## What's Missing for Full Site Reconstruction

The analysis gives us everything about the visual design. For structural reconstruction, we need section-level DOM extraction. This is NOT in the current codebase but CAN be done mechanically.

**Missing piece: section boundary detection and content extraction**

Proposed: `analyze-sections.js` — a new script to run in headless Chrome alongside `analyze.js`. Returns:

```javascript
{
  sections: [
    {
      tag: 'header',                         // original element tag
      rect: {top, left, width, height},
      background: '#1a1a2e',                 // computed background
      backgroundImage: 'linear-gradient(...)', // if present
      columns: 3,                            // detected column count
      gridTemplate: 'auto 1fr auto',         // from computed grid-template-columns
      display: 'flex',                       // or 'grid', 'block'
      flexDirection: 'row',
      gap: '24px',
      padding: '16px 24px',
      textAlign: 'left',
      blocks: [
        { tag: 'div', role: 'brand', text: 'Acme Corp', fontSize: '18px',
          fontWeight: '700', color: '#fff', rect: {...} },
        { tag: 'nav', role: 'nav', links: [{text:'Home',href:'/'}, ...],
          color: '#ccc', rect: {...} },
        { tag: 'div', role: 'action',
          html: '<button style="...">Sign Up</button>', rect: {...} }
      ]
    },
    {
      tag: 'section',
      rect: {...},
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      columns: 1,
      display: 'block',
      padding: '80px 24px',
      textAlign: 'center',
      blocks: [
        { tag: 'h1', role: 'heading', text: 'Build Faster With Acme',
          fontSize: '48px', fontWeight: '800', letterSpacing: '-1px' },
        { tag: 'p', role: 'text', text: 'The platform for modern teams...',
          fontSize: '18px', color: 'rgba(255,255,255,0.8)' },
        { tag: 'div', role: 'action',
          html: '<a class="btn" style="...">Get Started</a>', rect: {...} }
      ]
    },
    {
      tag: 'section',
      background: '#f8f9fc',
      columns: 3,
      gridTemplate: '1fr 1fr 1fr',
      display: 'grid',
      gap: '24px',
      padding: '60px 24px',
      blocks: [
        { tag: 'div', role: 'feature', icon: '⚡',
          title: 'Fast', text: 'Deploy in seconds...', rect: {...} },
        { tag: 'div', role: 'feature', icon: '🔒',
          title: 'Secure', text: 'Enterprise-grade...', rect: {...} },
        { tag: 'div', role: 'feature', icon: '🌐',
          title: 'Global', text: 'Edge network...', rect: {...} }
      ]
    }
  ],
  images: [
    { src: 'https://...', alt: '...', width: 800, height: 600, sectionIdx: 1 }
  ]
}
```

**Section detection heuristics (no LLM):**
- Start with direct children of `<body>` (or `<main>` / first large child of body)
- Each `<section>`, `<header>`, `<footer>`, `<article>`, `<aside>` is a section boundary
- Large `<div>` containers (>80% viewport width, >100px tall) with distinct background colors are section boundaries
- Background color change between adjacent top-level elements signals a section boundary
- Merge adjacent small elements (height <60px) into the nearest section

**Column detection heuristics (no LLM):**
- `display: grid` → read computed `grid-template-columns`, convert to Safe Studio format (px→px, fr→fr, %→proportional fr)
- `display: flex` with `flex-direction: row` → count children, estimate widths from flex-basis or measured widths
- `display: block` → 1 column (check for floated children as a 2-column fallback)
- Columns detected from child width patterns: 3 children each ~33% wide → `1fr 1fr 1fr`

**Block role detection heuristics (no LLM):**
- `h1`-`h6` → heading
- `p` with >20 chars → text
- `button`, `a` with padding>8px or button-like classes (btn, button, cta) → action
- `img`, `video`, `picture`, `svg` (>40px) → media
- `ul`, `ol` → list
- `blockquote` → quote
- `form` → form
- `nav` → nav
- `div` with one short text child + one longer text child → feature/card (check for icon: leading emoji, `<svg>`, or small `<img>`)
- `div` with `<img>` + text children → card

**Content extraction per block (no LLM):**
- Text content: `innerText` (not `textContent`, to respect `display:none`)
- Images: `<img>` src made absolute, with alt text and dimensions
- Links: href made absolute, with link text
- Inline styles preserved on action/button elements (for style matching)
- For compound blocks (card, feature): detect sub-structure (icon → title → text) by child ordering and element types

## Does This Need an LLM?

For structural extraction: **no.** The DOM has semantic elements (`<section>`, `<header>`, `<h1>`, `<nav>`). The computed styles have the layout (`grid-template-columns`, `display:flex`). The text is in the DOM. The images have URLs. This is tree walking with heuristics.

For the theme: **no.** `analyze.js` already does this mechanically and produces accurate results.

For the content: **no.** The content is in the DOM. Copy it into Safe Studio blocks with URLs made absolute.

Where an LLM helps but is not required:
- Ambiguous role detection: "is this a testimonial section or a team section?" But Safe Studio doesn't need to guess — it creates the right layout structure, and the user picks a semantic label if they care.
- Generating SafeScript handlers from observed interactive behavior. But the cloned page starts static; the user adds interactivity.
- Suggesting modifications: "make the hero bigger" or "swap to a 2-column layout." But the visual editor handles this.

The mechanical approach is better because it's deterministic, fast (one headless Chrome visit, no API calls), doesn't hallucinate content, and doesn't add text that wasn't on the page.

## Step 10: "Match My Brand" in the Theme Panel

**What exists:** Everything described above. `analyze()` + `generateThemeCss()` produce ready-to-use CSS.

What to build in Safe Studio:
- **"Match a website" input** in the Theme panel. The user pastes a URL.
- Safe Studio calls the backend `Websites/analyze` endpoint (or a new `Websites/theme` action that returns just the theme CSS).
- The returned theme is previewed on the canvas in real time — the page switches to the extracted colors and fonts.
- **"Apply" button** saves the theme to the page. The extracted CSS variables map to Safe Studio's existing theme system:
  - `--theme-brand` → accent color (replaces the palette picker)
  - `--theme-bg` → background mode (light/dark detection based on luminance)
  - `--theme-font-body` → body font (auto-imported via Google Fonts if available)
  - `--theme-font-heading` → heading font
  - `--theme-fg` → text color
  - `--theme-link` → link color
- **Font import:** The analysis returns font family names. Safe Studio checks if they're Google Fonts (most are) and auto-adds the import. The `_assets.fontFiles` from the analysis provides the actual font file URLs if they're self-hosted.
- **"Refine" step:** After applying the extracted theme, the user can still adjust individual colors via the existing palette/custom accent UI. The extraction is a starting point, not a lock.

Files to modify:
- Theme panel in `renderProps()` and the `theme` tab in `renderPalette()`: add URL input and preview/apply flow
- New function: `analyzeAndApplyTheme(url)` — calls backend, maps the result to Safe Studio's theme model
- CSS variable mapping layer: translate between Websites plugin's `--theme-*` variables and Safe Studio's `--accent`, `--bg1`, `--text`, etc.

## Step 11: "Clone This Site" — Full Structural Import

This is the big feature. Paste a URL, get an editable Safe Studio page that looks and reads like the original. No LLM. One headless Chrome visit.

**What runs:**
1. `scrape(url)` — title, description, OG image, language, keywords (PHP, no Chrome needed)
2. `analyze(url)` — colors, fonts, brand color, nav, element styles (headless Chrome, existing code)
3. `analyze-sections(url)` — section boundaries, column layouts, block roles, content (headless Chrome, **new script**)
4. `generateThemeCss(analysis)` — CSS variables and @font-face (PHP, existing code)

**What Safe Studio does with the results:**

The section analysis maps mechanically to Safe Studio's data model:

| Detected | Safe Studio equivalent |
|---|---|
| `<header>` with nav links | `nav-bar` layout section. Blocks: brand (site title/logo), nav (links from `detectedNav.links`), action (if CTA button found) |
| Section with 1 column, centered text, large heading, gradient bg | `hero-centered` layout. Blocks: heading (h1 text), text (subtitle), action (button if present). Section bg = 'gradient' with extracted colors |
| Section with 3 equal columns, each with icon+title+text | `features-3` layout. 3 blocks role=feature, each with the extracted icon/title/text |
| Section with 2 columns, image left, text right | `text-image-left` layout. Blocks: media (img src), text (paragraph content) |
| Section with 3 cards, each with image+title+description | `cards-3` layout. 3 blocks role=card with extracted content |
| Section with large quote + attribution | `testimonial-centered` layout. Blocks: quote, attribution |
| Section with pricing columns | `pricing-2` or `pricing-3`. Blocks: pricing-card with tier/price/features |
| `<footer>` with links | `footer-simple` or `footer-4col`. Blocks: brand, nav columns |

The mapping is a decision table on detected properties:
- Column count → picks the layout
- Background color/gradient → sets section `bg` property
- Block roles → maps to Safe Studio block roles
- Text content → goes into block `content` as HTML
- Font sizes → preserved in block `customCSS`
- Image URLs → made absolute, placed in `<img>` tags

**Style application from `stylesBySelector`:**
- `h1` computed styles → Safe Studio class `.ss-heading`: fontSize, fontWeight, lineHeight, letterSpacing, textTransform
- `p` computed styles → class `.ss-text`: fontSize, lineHeight, color
- `button` / `a.btn` computed styles → class `.ss-action-btn`: padding, borderRadius, backgroundColor, fontWeight, fontSize
- `blockquote` → class `.ss-quote`
- These are written to `state.page.classStyles` so every block of that role inherits the original site's styling

**The user flow:**
1. Click "Import from URL" (or "Clone Site" in the template modal)
2. Paste URL
3. Safe Studio shows a loading indicator while the backend runs the analysis
4. The page appears in the canvas: same sections, same layout, same content, same colors, same fonts
5. Everything is editable — regular Safe Studio blocks. Change the heading, swap an image, add a section
6. The imported page is a starting point. The user owns it.

**What to build:**
- `analyze-sections.js` — the new headless Chrome script (~300 lines, heuristic DOM walking as described above)
- Backend endpoint: `Websites/clone` — runs scrape + analyze + analyze-sections, returns the combined result
- Frontend: `cloneSite(url)` function in Safe Studio that calls the endpoint, runs the mapping table, and populates `state.page`
- Mapping table: `sectionAnalysisToLayout(section)` — takes a detected section object and returns a Safe Studio section with the right layoutKey, blocks, and content
- UI: "Clone Site" button in the template modal, URL input, loading state

**What does NOT need building:**
- Headless Chrome infrastructure — already running for `analyze()`
- Font discovery and @font-face — already in `_assets`
- Color extraction — already in `colorRoles`
- Nav detection — already in `detectedNav`
- Theme CSS generation — already in `generateThemeCss()`
- URL scraping — already in `scrape()`
- Section detection heuristics — DOM walking, no ML model
- Block role mapping — decision table on tag + children structure

## Step 12: Multi-Page Site Import

Extend the clone feature to crawl multiple pages of a site.

What to build:
- **Link discovery:** From the scraped page, extract all internal links (same host). The nav links from `detectedNav.links` are the primary set.
- **Batch analysis:** Run analyze-sections on each discovered page (up to a configurable limit, default 10 pages).
- **Project creation:** Each analyzed page becomes a Safe Studio page in the project. The nav links become cross-page references.
- **Shared theme:** The brand extraction runs once (on the homepage) and applies to all pages via a Brand Kit.
- **De-duplication:** Nav, header, and footer sections appear on every page. Detect repeated sections (same structure + same content) and mark them as shared — when the user edits the nav on one page, it updates everywhere.

This extends the single-page clone to a full site import. Each page is independently editable, but they share a theme and common sections.

## Step 13: Brand Kit as a Reusable Asset

**What exists:** The analyzed theme can be cached per URL. `Websites_Webpage::getThemeCssPath()` stores generated CSS at `$uploads/Websites/theme/{host}/{formFactor}.css` with configurable cache TTL.

What to build:
- **Brand Kit stream:** A `Websites/brand` stream type that stores extracted brand assets: colors, fonts, logo URL, button styles, nav styles. The stream's attributes hold the structured data; the stream's content holds the generated CSS.
- **Brand Kit in project settings:** Each project can reference a Brand Kit. When set, new pages and tools in the project inherit the brand's colors, fonts, and styles automatically.
- **Brand Kit sharing:** Since the Brand Kit is a stream, it has access control. An organization can have one Brand Kit shared across all their projects. Update the Brand Kit and every project using it reflects the change.
- **Multiple form factors:** The analysis supports desktop, mobile, and tablet viewports. The Brand Kit stores theme CSS for each, and Safe Studio applies the appropriate one based on the device preview mode.

## Step 14: Competitor Analysis and Comparison

**What exists:** `Websites_Webpage::analyze()` can be called on any URL. The analysis returns structured data that's comparable across sites.

What to build:
- **"Compare designs" tool:** Paste two or more URLs. Safe Studio analyzes each and shows a side-by-side comparison: color palette, font choices, layout structure, button styles.
- This helps a designer or agency working in Safe Studio understand the visual landscape before building. "Show me how our site compares to these three competitors" → table of extracted brand attributes.
- The comparison data is stored as a stream with the analyzed URLs related to it, so it persists and can be shared with the team.

---

## Updated Implementation Order

**Track A — Site cloning (highest impact, independent of Streams backend):**
1. Write `analyze-sections.js` (~300 lines, runs in headless Chrome)
2. Backend endpoint `Websites/clone` — orchestrates scrape + analyze + analyze-sections
3. Mapping table in Safe Studio: detected sections → Safe Studio layouts + blocks
4. "Clone Site" button in template modal with URL input
5. Match My Brand in Theme panel (Step 10) — uses existing `generateThemeCss()`
6. Brand Kit as reusable asset (Step 13)
7. Multi-page site import (Step 12)
8. Competitor analysis (Step 14)

**Track B — Collaboration (requires Qbix backend connection):**
1. Persist to Streams (Step 1)
2. Real-time sync (Step 2)
3. Roles and invitations (Step 6)
4. Ephemeral presence (Step 3)
5. Comments on blocks (Step 7)
6. Forks as branches (Step 4)
7. Version history from messages (Step 8)
8. Workspaces as overlay layers (Step 5)

**Track C — Distribution:**
1. Embeddable widgets (Step 9)

Track A can be built entirely without a Streams backend — it only needs headless Chrome (which the Websites plugin already uses). Track B requires a running Qbix app. They're independent and can be built in parallel.

Track A is higher impact because "paste a URL, get an editable clone" is a demo that sells itself. Track B is higher defensibility because real-time collaboration on owned infrastructure is the long-term moat.

## What Does NOT Need Building

- Access control enforcement — Streams handles this server-side
- Socket infrastructure — Q.Streams already manages WebSocket connections
- User authentication — Users plugin handles login, registration, platform auth
- Message ordering — ordinals are auto-assigned, fork chains are transparent
- Notification delivery — subscription pipeline handles email/push/device notifications
- Avatar display — `Streams_Avatar` provides cached display info per viewer
- Headless Chrome for site analysis — Websites plugin already runs it
- CSS variable generation from analysis — `generateThemeCss()` already does it
- URL scraping and metadata extraction — `Websites_Webpage::scrape()` already does it
- Theme CSS caching per host — `getThemeCssPath()` already handles it
- Font file discovery — the analysis's `_assets.fontFaces` and `fontFiles` already extracts them

## Smart Defaults & Field Pickers (Track A — no backend needed for presets)

### Field Metatypes

Every tool that takes a `publisherId`, `streamName`, `userId`, or `web3Address` gets a typed field with preset dropdown + freeform input. The metatypes are:

- **publisherId** — presets: Current Community (`Q.Users.communityId`), Main Community (`Q.info.app`), Logged-in User (`Q.Users.loggedInUserId()`), From URL (`$query.publisherId`), From route (`$route.1`). Default: `$community`.
- **streamName** — presets: Main Experience (`Streams/experience/main`), From URL (`$query.streamName`), From route (`$route.2`). Default: `Streams/experience/main`.
- **userId** — presets: Logged-in User, Community User, From URL. Default: `$loggedInUser`.
- **web3Address** — presets: Connected Wallet (`Q.Users.Web3.getSelectedXid()`), From URL. Default: `$wallet`.
- **relationType** — presets: Images, Videos, Audio, Chat, Tasks, Questions, Experiences.
- **streamType** — presets: Image, Video, Audio, Task, Experience, Question, Category.

### Runtime Resolver

Exported pages include `ssResolve(val)` which expands `$community` → `Q.Users.communityId`, `$query.xxx` → URL param, `$route.N` → path segment at runtime. This bridges static Safe Studio pages to dynamic Streams content.

### Picker Integration (Track B — requires backend)

When running as a Qbix plugin, the properties wizard renders actual picker tools instead of text inputs:

- `publisherId` → Streams/userChooser inline
- `streamName` → Streams/lookup with type filter
- `web3Address` → Users/web3/address

Standalone mode falls back to preset dropdown + text input.

### Auto-generation

Tools not explicitly in TOOL_PROPERTIES get auto-generated property fields: option named `publisherId` → metatype publisherId, boolean → checkbox, number → number input, URL-ish string → URL input.

## SVG Mockup Previews in Editor

### How it works

Safe Studio's block editor uses `TOOL_MOCKUPS` — a lightweight port of the `Q.Tool.mockup` pattern. Each tool registers an SVG renderer function: `(toolOptions, width, height) → SVG string`. The renderer:

- Uses CSS variables (`var(--theme-brand)`, `var(--theme-bg-2)`) so mockups re-theme when you switch palettes
- Responds to `block.toolOptions` — change the rating value in the properties wizard and the SVG stars update live
- Falls back to a labeled placeholder rectangle for unregistered tools

### Tool coverage

Mockup renderers for all major tool types:

- **Q/rating** — renders N stars (filled/empty) based on value/max
- **Q/progress** — renders a progress bar at the configured fraction and color
- **Q/countdown** — renders a clock face or date display
- **Q/chart/bar** — renders bar chart bars from data
- **Q/chart/line** — renders a line path
- **Q/pie** — renders a pie/donut via conic-gradient simulation
- **Streams/chat** — renders message bubble shapes (alternating sides)
- **Streams/participants** — renders avatar circles in a row
- **Streams/related** — renders a grid of preview card outlines
- **Streams/comments** — renders threaded comment shapes
- **Q/tabs** — renders tab bar with active tab highlighted
- **Q/expandable** — renders title bar with chevron
- **Q/carousel** — renders perspective-rotated card outlines
- **Q/coverflow** — renders angled cover outlines receding in perspective
- **Q/video** — renders a play button triangle over a screen rectangle
- **Q/ticker** — renders scrolling text marquee shape

### Backend integration

When connected to Qbix, Safe Studio can load the real `Q.Tool.mockup` registry and get mechanical mockups for every tool that has a `Q.Template` registered. The standalone SVG renderers are the offline fallback. `Q.Tool.DOMtoSVG` does the conversion, preserving CSS variable references for live theming.

## Swimlane Ideas (Future — not in current scope)

Q/swimlane renders multi-actor timelines using `Q.Tool.mockup` for node content and `Q.Tool.DOMtoSVG` for SVG conversion. Potential applications in Safe Studio:

- **Auto-inferred user journeys**: Given a page with Streams tools (chat, form, participants, related), infer the multi-user interaction flow. A page with a form → approval → notification chain could auto-generate a swimlane showing the user journey.
- **Page flow visualization**: Multi-page projects could render as a swimlane — each page is a moment, navigation links are transitions, actors are user roles from Streams access levels.
- **Collaboration timeline**: The edit history of a page (messages on the page stream) could render as a swimlane — each editor is an actor, each edit is a moment with a mockup of what the page looked like at that ordinal.
- **Stream lifecycle**: For tools that create/modify streams (forms, chat composers), visualize the stream lifecycle as a swimlane — creation → messages → forks → access changes.
- **Scenario builder**: A Safe Studio tool for building Q/swimlane scenarios visually — drag actors, add moments, attach tool mockups to frames, export as SVG or interactive timeline.
- **Onboarding flows**: The Streams/experience tool already models step-by-step experiences. Combined with swimlane, you could visualize the full onboarding journey across multiple actors (new user, admin, moderator).

These would use the existing `Q.Tool.mockup.render()` → `Q.Tool.DOMtoSVG` pipeline. The swimlane tool already handles layout, virtualization, narration, branching, and PDF/SVG export.
