# Safe Studio — LLM Coding Primer

Supplement for AI agents that read and write `.safestudio` project files. Covers the file format, layouts, tools, handlers, the reference system, and common patterns.

## 1. The .safestudio File Format

A `.safestudio` file is JSON. It describes an entire project: pages, custom tools, handlers, styles, and theme. Any text editor or AI agent can read and write one — no server, no MCP, no API.

```json
{
  "safestudio": "1.0",
  "type": "project",
  "name": "My App",
  "pages": [ ... ],
  "tools": [ ... ]
}
```

A project has one or more pages and zero or more custom tools.

### Single-page shorthand

```json
{
  "safestudio": "1.0",
  "type": "page",
  "page": { ... }
}
```

### Single-tool shorthand

```json
{
  "safestudio": "1.0",
  "type": "tool",
  "tool": { ... }
}
```

## 2. Page Object

```json
{
  "id": "page-1",
  "title": "Home",
  "sections": [ ... ],
  "handlers": { "0:0:onClick": "context.block.style.color = 'red';" },
  "classStyles": { "CardActive": "background:#6366f1;color:#fff" },
  "seo": {
    "description": "Page description for search engines",
    "keywords": "comma, separated",
    "author": "Author Name",
    "ogImage": "https://example.com/og.png",
    "twitterCard": "summary_large_image"
  },
  "theme": { "palette": "indigo", "bg": "dark" },
  "fonts": [{ "name": "Poppins", "family": "Poppins,sans-serif", "url": "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" }]
}
```

**handlers** keys are `{sectionIndex}:{blockIndex}:{eventName}` or `{sectionIndex}:section:{eventName}`. Values are SafeScript code strings.

**classStyles** maps PascalCase class names to CSS property strings. These are applied to any element that has the class.

**theme.palette** is one of: `indigo`, `blue`, `emerald`, `rose`, `amber`, `cyan`.

**theme.bg** is `dark` or `light`.

## 3. Section Object

A section is a layout row. It holds an array of blocks.

```json
{
  "layoutKey": "hero-centered",
  "customId": "Hero",
  "classes": ["Dark", "Animated"],
  "bg": "",
  "padding": "80px 24px",
  "gap": "24px",
  "customCSS": "",
  "mobileLayout": "",
  "mobileBreakpoint": 768,
  "blocks": [ ... ]
}
```

**layoutKey** determines the CSS grid. Required. See §6 for the full list.

**customId** is a PascalCase identifier used in SafeScript references. Defaults to `Section1`, `Section2`, etc. Must be unique within the page.

**bg** options: `""` (default surface), `"tint"` (accent tint), `"gradient"` (brand gradient with white text).

**mobileLayout** options: `""` (stack), `"accordion"` (one-at-a-time expand), `"tabs"` (tab bar), `"carousel"` (horizontal swipe).

## 4. Block Object

A block is one content unit inside a section.

```json
{
  "role": "heading",
  "tool": "Streams/html",
  "customId": "Title",
  "classes": ["Highlight"],
  "content": "<h1>Welcome</h1>",
  "toolOptions": {},
  "mobileDisplay": "",
  "mobileTriggerLabel": "",
  "fontFamily": "",
  "customCSS": "",
  "ariaLabel": ""
}
```

**role** describes the block's semantic purpose. Used for default content generation. Values: `heading`, `text`, `action`, `media`, `stat`, `card`, `feature`, `icon-feature`, `quote`, `attribution`, `testimonial-card`, `pricing-card`, `team-member`, `faq-item`, `nav`, `brand`, `logo`, `sidebar`, `content`.

**tool** is a tool ID from §7. Determines what the block renders and what toolOptions are available.

**customId** is PascalCase. Defaults to `Block1`, `Block2`, etc. Combined with the section's customId to form a full reference: `Hero_Title`.

**content** is the raw HTML displayed in the block. When a tool is set, the editor generates default content — but you can override it.

**toolOptions** holds tool-specific configuration. Keys and types depend on the tool — see §8.

**mobileDisplay** options: `""` (inline), `"accordion"`, `"dropdown"`, `"drawer"`, `"hidden"`.

**mobileTriggerLabel** is the text shown on the accordion/dropdown/drawer trigger. Defaults to the block's role.

## 5. Custom Tool Object

Custom tools are reusable components built from sections and blocks. They appear in the "My Tools" palette category.

```json
{
  "id": "custom-contact-card",
  "name": "Contact Card",
  "icon": "📇",
  "desc": "Card with name, email, and photo",
  "structure": {
    "sections": [ ... ],
    "handlers": { "0:0:onClick": "..." },
    "classStyles": { "CardHover": "transform:scale(1.02)" }
  }
}
```

**structure** has the same shape as a page (sections, handlers, classStyles) but represents the tool's internal layout. When a tool is placed on a page, each instance gets its own scope — handlers inside the tool operate on `context.tool` (the instance root) and `context.children` (child elements by ID).

Tool IDs must start with `custom-`. The structure's section/block IDs are relative to the tool's scope, not the page.

### Nest section layouts inside a page

A page block can reference a custom tool whose `structure.sections[]` contains multiple layouts. For example, put a `text-image-left` lead-story grid and a `text-3col` story row inside one custom tool, then place that tool in the main column of an outer `sidebar-right` page section. The outer section controls the main/sidebar split; the custom tool controls the internal page composition.

In the editor, select a block and choose **Create nested layout**, or select a section and choose **Add nested layout block**. Choose the starting layout, then use the tool editor to add more layouts. The block's `tool` field points to the custom tool and its `content` is `null`. Nested custom tools can contain further nested tools; the editor's Back action returns one level at a time. The custom tool's normal JSON structure stores the nested layouts, so page/project JSON and standalone HTML export preserve them. Tool `classStyles` stay scoped to their component in rendered output. Recursive rendering stops circular references and is limited to 16 levels. Page sections and nested grids use their authored columns on desktop and stack to one column on narrow screens; the editor's mobile device preview shows this too.

## 6. Layouts (41 available)

Each layout defines a CSS grid for a section. The blocks array specifies the default roles that fill the grid cells.

### Hero (4)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `hero-centered` | `1fr` | heading, text, action |
| `hero-split` | `1fr 1fr` | heading, media |
| `hero-full-bg` | `1fr` | heading, text, action (gradient bg) |
| `hero-video` | `1fr` | heading, media |

### Content (5)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `text-full` | `1fr` | heading, text |
| `text-image-left` | `5fr 7fr` | text, media |
| `text-image-right` | `7fr 5fr` | media, text |
| `text-2col` | `1fr 1fr` | text, text |
| `text-3col` | `1fr 1fr 1fr` | text, text, text |

### Features (4)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `features-3` | `1fr 1fr 1fr` | feature ×3 |
| `features-4` | `1fr 1fr 1fr 1fr` | feature ×4 |
| `features-icons-3` | `1fr 1fr 1fr` | icon-feature ×3 |
| `features-large-left` | `2fr 1fr` | feature, feature |

### Cards (3)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `cards-2` | `1fr 1fr` | card ×2 |
| `cards-3` | `1fr 1fr 1fr` | card ×3 |
| `cards-4` | `1fr 1fr 1fr 1fr` | card ×4 |

### Testimonials (3)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `testimonial-centered` | `1fr` | quote, attribution |
| `testimonials-2` | `1fr 1fr` | testimonial-card ×2 |
| `testimonials-3` | `1fr 1fr 1fr` | testimonial-card ×3 |

### Pricing (2)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `pricing-2` | `1fr 1fr` | pricing-card ×2 |
| `pricing-3` | `1fr 1fr 1fr` | pricing-card ×3 |

### Team (2)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `team-3` | `1fr 1fr 1fr` | team-member ×3 |
| `team-4` | `1fr 1fr 1fr 1fr` | team-member ×4 |

### Stats (3)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `stats-3` | `1fr 1fr 1fr` | stat ×3 |
| `stats-4` | `1fr 1fr 1fr 1fr` | stat ×4 |
| `stats-row-bg` | `repeat(4,1fr)` | stat ×4 (tinted bg) |

### Gallery (3)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `gallery-3` | `1fr 1fr 1fr` | media ×3 |
| `gallery-hero-grid` | `2fr 1fr / 1fr 1fr` | media ×3 |
| `gallery-masonry` | `1fr 1fr 1fr` | media ×6 |

### CTA (3)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `cta-centered` | `1fr` | heading, action (centered, gradient) |
| `cta-split` | `1fr auto` | heading, action |
| `cta-banner` | `1fr` | heading, action (tinted) |

### Navigation (1)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `nav-bar` | `auto 1fr auto` | brand, nav, action |

### Footer (2)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `footer-simple` | `1fr 1fr` | text, nav |
| `footer-4col` | `2fr 1fr 1fr 1fr` | brand, nav, nav, nav |

### FAQ (2)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `faq-list` | `1fr` | faq-item ×4 |
| `faq-2col` | `1fr 1fr` | faq-item ×4 |

### Logo Bar (2)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `logo-bar-4` | `repeat(4,1fr)` | logo ×4 |
| `logo-bar-6` | `repeat(6,1fr)` | logo ×6 |

### Sidebar (2)
| layoutKey | grid | blocks |
|-----------|------|--------|
| `sidebar-left` | `1fr 3fr` | sidebar, content |
| `sidebar-right` | `3fr 1fr` | content, sidebar |

## 7. Tools (75 available)

### Content (6)
`Streams/html`, `Streams/markdown`, `Streams/inplace`, `Websites/article`, `Streams/html/code`, `Streams/embed`

### Media (9)
`Streams/image/preview`, `Streams/video/preview`, `Streams/audio/preview`, `Streams/file/preview`, `Streams/image/album`, `Streams/pdf/preview`, `Streams/image/coverflow`, `Streams/gallery`, `Q/video`, `Q/image`

### Community (6)
`Streams/chat`, `Streams/comments`, `Streams/question`, `Streams/relate`, `Streams/participants`, `Streams/activity`

### Data & Forms (10)
`Streams/form`, `Streams/metrics`, `Streams/category`, `Streams/tree`, `Streams/related`, `Q/chart/bar`, `Q/chart/line`, `Q/pie`, `Q/visualization/table`, `Q/visualization/graph`

### Interactive (14)
`Q/carousel`, `Q/coverflow`, `Q/expandable`, `Q/drawers`, `Q/tabs`, `Q/countdown`, `Q/parallax`, `Q/ticker`, `Q/progress`, `Q/rating`, `Q/badge`, `Q/infinitescroll`, `Q/floating`, `Q/filter`

### Navigation (3)
`Streams/lookup`, `Websites/lookup`, `Websites/referral`

### Layout (3)
`Streams/basic`, `Streams/preview`, `Streams/default/preview`

### Form (10)
`_form/input-text`, `_form/textarea`, `_form/select`, `_form/checkbox`, `_form/radio`, `_form/range`, `_form/file`, `_form/toggle`, `_form/date`, `_form/button`

### Commerce (2)
`Assets/plan`, `Assets/payment`

### HTML Elements (11)
`_html/div`, `_html/span`, `_html/heading`, `_html/paragraph`, `_html/link`, `_html/list`, `_html/table`, `_html/hr`, `_html/details`, `_html/nav`, `_html/iframe`

## 8. Tool Options (toolOptions)

Each tool accepts typed options in `block.toolOptions`. Stream-connected tools use metatype values (`$community`, `$loggedInUser`, `$query.xxx`, `$route.N`) that resolve at runtime.

### Key tools and their options

**Streams/related** — the universal stream browser:
```json
{
  "publisherId": "$community",
  "streamName": "Streams/experience/main",
  "relationType": "Streams/image",
  "isCategory": true,
  "realtime": false,
  "sortable": false,
  "displayMode": "grid",
  "relatedOptions.limit": 20,
  "relatedOptions.ascending": false,
  "composerPosition": ""
}
```

**Q/video** / **Streams/video/preview**:
```json
{ "url": "https://youtube.com/watch?v=...", "autoplay": false, "loop": false }
```

**Q/rating**:
```json
{ "value": 4, "max": 5 }
```

**Q/progress**:
```json
{ "fraction": 0.75, "color": "#10b981", "showProgress": true }
```

**Q/countdown**:
```json
{ "timestamp": "2025-12-31T23:59:00" }
```

**Q/carousel**:
```json
{ "radius": 340, "imgWidth": 170, "imgHeight": 120, "autoRotate": true, "rotateSpeed": 60000 }
```

**Q/expandable**:
```json
{ "title": "Click to expand", "expanded": false, "autoCollapseSiblings": true }
```

**Q/tabs**:
```json
{ "vertical": false, "compact": false }
```

### Metatype values for publisherId / streamName / userId

These resolve at runtime when connected to a Qbix backend:

| Value | Resolves to |
|-------|-------------|
| `$community` | `Q.Users.communityId` — the current community |
| `$mainCommunity` | `Q.info.app` — the app's main community |
| `$loggedInUser` | `Q.Users.loggedInUserId()` — the current user |
| `$wallet` | `Q.Users.Web3.getSelectedXid()` — connected wallet |
| `$query.fieldName` | URL query parameter `?fieldName=value` |
| `$route.1` | First segment of the URL path |
| `$route.2` | Second segment of the URL path |
| `Streams/experience/main` | The community's main experience stream |

## 9. Handler Keys and Events

Handler keys follow the pattern `{sectionIndex}:{blockIndex}:{eventName}`.

Section-level events use `{sectionIndex}:section:{eventName}`.

### Block events by role

| Role | Events |
|------|--------|
| heading, text, feature, card, nav, brand, logo, content | onClick, onLoad |
| action | onClick, onMouseover, onLoad |
| media | onClick, onLoad, onError |
| stat | onVisible, onLoad |
| faq-item | onToggle, onLoad |
| section | onLoad, onVisible, onScroll, onWindowResize |
| (all) | onAppearing, onDisappearing, onResize |

### Observer events

`onAppearing(ratio)` fires as an element enters the viewport (IntersectionObserver). `onDisappearing(ratio)` fires as it leaves. `onResize(width, height)` fires on element size change (ResizeObserver). `onWindowResize(width, height)` is section-only.

## 10. SafeScript References

SafeScript handlers run in a sandboxed scope. Elements are referenced by their customId, with a hierarchical syntax.

### Section reference
```
Section1          → the section element
```

### Block reference (section_block)
```
Hero_Title        → the block with customId "Title" in section "Hero"
```

### Class reference ($-prefixed)
```
$Highlight        → all elements with class "Highlight" (returns array)
```

### Hierarchical reference
```
Hero_$CardBtn     → elements with class "CardBtn" inside section "Hero"
Section1_$Foo$Bar → elements with classes "Foo" AND "Bar" inside Section1
Id_$Class1_$Class2 → .Class1 .Class2 descendants of [data-ss-id="Id"]
```

### Rules
- IDs are PascalCase, no `$` prefix
- Classes start with `$`
- `_` separates hierarchy levels
- Multiple `$` segments at one level mean compound class selector: `$Foo$Bar` → `.Foo.Bar`
- IDs always precede classes in a reference

### Context object
```javascript
context.block    // the block's DOM element
context.section  // the parent section element
context.page     // the page container element
context.tool     // the tool instance root (inside custom tools)
context.children // map of child IDs to elements (inside custom tools)
```

### Available globals
```javascript
event            // the DOM event that triggered the handler
$('selector')    // querySelectorAll scoped to page root
Users            // Q.Users host object (when connected to Qbix)
Streams          // Q.Streams host object (when connected to Qbix)
```

## 11. Class Styles

`classStyles` maps class names to CSS property strings:

```json
{
  "classStyles": {
    "CardActive": "background:var(--theme-brand);color:#fff;border-radius:12px",
    "FadeIn": "opacity:0;transition:opacity 0.3s",
    "FadeInVisible": "opacity:1"
  }
}
```

Classes are applied to sections and blocks via their `classes` array. SafeScript handlers can toggle classes with standard DOM methods: `element.classList.add('FadeInVisible')`.

Renaming a class updates all elements, classStyles, and handler references (including inside compound hierarchical refs like `Section1_$OldClass_$Child`).

## 12. Theme Variables

The theme system uses CSS custom properties in the `--theme-*` namespace:

| Variable | Purpose |
|----------|---------|
| `--theme-brand` | Primary brand color |
| `--theme-accent-2` | Secondary accent |
| `--theme-fg` | Primary text |
| `--theme-fg-2` | Secondary text |
| `--theme-fg-3` | Tertiary text |
| `--theme-bg` | Primary surface |
| `--theme-bg-2` | Secondary surface |
| `--theme-bg-3` | Tertiary surface |
| `--theme-border` | Border color |
| `--theme-font-body` | Body font stack |
| `--theme-font-heading` | Display font stack |
| `--theme-font-mono` | Monospace font stack |

These match the Websites plugin's `generateThemeCss()` output. When connected to Qbix, scraped theme CSS imports directly.

## 13. Building a Page (Common Patterns)

### Landing page
```json
{
  "sections": [
    { "layoutKey": "nav-bar", "customId": "Nav" },
    { "layoutKey": "hero-centered", "customId": "Hero", "bg": "gradient" },
    { "layoutKey": "features-icons-3", "customId": "Features" },
    { "layoutKey": "testimonials-3", "customId": "Social" },
    { "layoutKey": "pricing-3", "customId": "Pricing" },
    { "layoutKey": "cta-centered", "customId": "CTA" },
    { "layoutKey": "footer-4col", "customId": "Footer" }
  ]
}
```

### Blog/article page
```json
{
  "sections": [
    { "layoutKey": "nav-bar" },
    { "layoutKey": "text-full", "blocks": [
      { "role": "heading", "tool": "Streams/html", "content": "<h1>Article Title</h1>" },
      { "role": "text", "tool": "Streams/markdown", "content": "Article body in markdown..." }
    ]},
    { "layoutKey": "footer-simple" }
  ]
}
```

### Interactive form page
```json
{
  "sections": [
    { "layoutKey": "text-full", "customId": "Form", "blocks": [
      { "role": "heading", "content": "<h2>Contact Us</h2>" },
      { "role": "content", "tool": "_form/input-text", "customId": "Name" },
      { "role": "content", "tool": "_form/input-text", "customId": "Email" },
      { "role": "content", "tool": "_form/textarea", "customId": "Message" },
      { "role": "action", "tool": "_form/button", "customId": "Submit", "content": "<button>Send</button>" }
    ]}
  ],
  "handlers": {
    "0:4:onClick": "var name = Form_Name.querySelector('input').value;\nvar email = Form_Email.querySelector('input').value;\nif (!name || !email) { alert('Please fill all fields'); return; }\nalert('Thanks, ' + name + '!');"
  }
}
```

### Stream-powered community page
```json
{
  "sections": [
    { "layoutKey": "nav-bar" },
    { "layoutKey": "text-full", "blocks": [
      { "role": "heading", "content": "<h1>Community</h1>" },
      { "role": "content", "tool": "Streams/related", "toolOptions": {
        "publisherId": "$community",
        "streamName": "Streams/experience/main",
        "relationType": "Streams/image",
        "displayMode": "grid",
        "realtime": true
      }}
    ]},
    { "layoutKey": "text-full", "blocks": [
      { "role": "content", "tool": "Streams/chat", "toolOptions": {
        "publisherId": "$community",
        "streamName": "Streams/experience/main"
      }}
    ]},
    { "layoutKey": "sidebar-right", "blocks": [
      { "role": "content", "tool": "Streams/participants", "toolOptions": {
        "publisherId": "$community",
        "streamName": "Streams/experience/main"
      }},
      { "role": "sidebar", "tool": "Streams/activity", "toolOptions": {
        "publisherId": "$community",
        "streamName": "Streams/experience/main"
      }}
    ]}
  ]
}
```

### Mobile-optimized page
```json
{
  "sections": [
    { "layoutKey": "features-3", "customId": "Services", "mobileLayout": "accordion",
      "blocks": [
        { "role": "feature", "customId": "Svc1", "mobileTriggerLabel": "Design", "content": "..." },
        { "role": "feature", "customId": "Svc2", "mobileTriggerLabel": "Development", "content": "..." },
        { "role": "feature", "customId": "Svc3", "mobileTriggerLabel": "Support", "content": "..." }
      ]
    }
  ]
}
```

## 14. Editing .safestudio Files Programmatically

### Add a section
Append to `pages[pageIndex].sections`:
```json
{ "layoutKey": "features-3", "customId": "NewSection", "blocks": [
  { "role": "feature", "content": "<h3>Feature 1</h3><p>Description</p>" },
  { "role": "feature", "content": "<h3>Feature 2</h3><p>Description</p>" },
  { "role": "feature", "content": "<h3>Feature 3</h3><p>Description</p>" }
]}
```

### Add a handler
Set `pages[pageIndex].handlers["sectionIndex:blockIndex:eventName"]` to a SafeScript string.

### Add a custom tool
Append to `tools`:
```json
{
  "id": "custom-my-widget",
  "name": "My Widget",
  "icon": "🔧",
  "desc": "Does something useful",
  "structure": {
    "sections": [{ "layoutKey": "text-full", "blocks": [{ "role": "content", "content": "..." }] }],
    "handlers": {},
    "classStyles": {}
  }
}
```

### Use a custom tool on a page
Reference it by ID in a block's `tool` field:
```json
{ "role": "content", "tool": "custom-my-widget" }
```

### Add a class style
Set `pages[pageIndex].classStyles["ClassName"]` to a CSS string.

### Wire a block to a stream
Set `toolOptions` with metatype values:
```json
{
  "tool": "Streams/chat",
  "toolOptions": { "publisherId": "$community", "streamName": "$query.room" }
}
```

## 15. Common Mistakes

| Wrong | Right | Why |
|-------|-------|-----|
| `layoutKey: "hero"` | `layoutKey: "hero-centered"` | Layout keys include the variant |
| `customId: "my-section"` | `customId: "MySection"` | IDs are PascalCase, no hyphens |
| `classes: "Foo Bar"` | `classes: ["Foo", "Bar"]` | Classes are an array, not a string |
| `handlers: { "onClick": "..." }` | `handlers: { "0:0:onClick": "..." }` | Keys include section:block indices |
| `$loggedInUser` as a fixed string | `"$loggedInUser"` in toolOptions | Metatype values are strings that resolve at runtime |
| `tool: "chat"` | `tool: "Streams/chat"` | Tool IDs include the plugin prefix |
| `mobileDisplay: "collapse"` | `mobileDisplay: "accordion"` | Valid values: accordion, dropdown, drawer, hidden |
| Setting `toolOptions` on a tool that has none | Check §8 for available options | Not all tools have configurable options |
| `bg: "blue"` on a section | `bg: "gradient"` or `bg: "tint"` | bg is a preset, not a color — use customCSS for arbitrary colors |
| Putting handlers inside `tools[].structure` with page-level indices | Use indices relative to the tool's own sections | Tool handlers are scoped to the tool's structure |
