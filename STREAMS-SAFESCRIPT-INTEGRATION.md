# Streams × SafeScript Integration Design

## The Thesis

The Qbix Streams API is a real-time, access-controlled data layer where every user acts only as themselves. Unlike SQL or Firestore, the client-side API is safe to expose directly — no XSS means no privilege escalation. SafeScript already sandboxes execution. Combining them gives Safe Studio developers a full backend without writing server code.

Streams are to data what tools are to UI. A developer composes pages from tools (UI components) and streams (data/state/communication channels). Stream types are like tool types — defined by plugins, with typed fields, access rules, and message protocols.

## Architecture Layers

```
┌─────────────────────────────────────┐
│          Safe Studio Page           │
│  ┌─────────┐  ┌──────────────────┐  │
│  │  Tools   │  │   SafeScript     │  │
│  │ (UI)     │  │   Handlers       │  │
│  │          │  │                  │  │
│  │ Streams/ │  │ Streams.get()    │  │
│  │ chat     │  │ stream.post()    │  │
│  │ Streams/ │  │ stream.onMsg()   │  │
│  │ image    │  │ Streams.relate() │  │
│  └────┬─────┘  └────────┬─────── │  │
│       │                 │         │  │
│  ┌────▼─────────────────▼───────┐ │  │
│  │     Q.Streams (JS SDK)       │ │  │
│  │  Sockets, caching, access    │ │  │
│  └──────────────┬───────────────┘ │  │
└─────────────────┼─────────────────┘  │
                  │ HTTP + WebSocket
         ┌────────▼────────┐
         │  Qbix Backend   │
         │  (generic app)  │
         └─────────────────┘
```

## 1. Host Objects Injected into SafeScript

Each plugin can register host objects. The core set for Users + Streams:

### Users

```javascript
// Available in every SafeScript handler as `Users`
Users.loggedInUser        // {id, username, displayName, icon} or null
Users.loggedInUserId()    // string or ""
Users.login(options)      // opens login dialog, returns Promise
Users.logout()            // logs out, returns Promise

// Events (can attach handlers)
Users.onLogin             // fires with user object
Users.onLogout            // fires with no args
```

### Streams — Core API

```javascript
// Available in every SafeScript handler as `Streams`

// Get a stream (cached, observed for real-time updates)
Streams.get(publisherId, streamName)
  // Returns Promise<Stream>
  // Auto-observes for real-time updates

// Create a stream
Streams.create(publisherId, type, fields)
  // fields: {title, content, attributes, readLevel, writeLevel, adminLevel}
  // Returns Promise<Stream>

// Close a stream
Streams.close(publisherId, streamName)

// Relate streams
Streams.related(publisherId, streamName, relationType, isCategory, options)
  // Returns Promise<{relations, relatedStreams, stream}>

Streams.relate(toPubId, toName, type, fromPubId, fromName)
Streams.unrelate(toPubId, toName, type, fromPubId, fromName)
```

### Stream Instance Methods

```javascript
// On a stream object returned by Streams.get()
stream.fields.title
stream.fields.content
stream.fields.type
stream.fields.publisherId
stream.fields.name

// Attributes (typed key-value store)
stream.getAttribute(key)
stream.setAttribute(key, value)
stream.save()                      // posts Streams/changed

// Post a message
stream.post(messageType, content, instructions)
  // Returns Promise<Message>

// Real-time events — the big unlock
stream.onMessage(messageType).set(handler)
  // handler(stream, message) — fires on new messages
stream.onFieldChanged(fieldName).set(handler)
  // handler(fields) — fires when fields change
stream.onAttribute(attrName).set(handler)
  // handler(attrs) — fires when attributes change
stream.onEphemeral(type).set(handler)
  // handler(payload) — typing indicators, cursors, etc.

// Participation
stream.join(options)
stream.leave()
stream.participant(userId)         // returns Participant or null

// Access testing
stream.testReadLevel(level)        // 'see','content','messages',...
stream.testWriteLevel(level)       // 'join','post','edit',...
stream.testAdminLevel(level)       // 'tell','invite','manage','own'

// Subscribe for notifications
stream.subscribe(options)
stream.unsubscribe()
```

### Message Object

```javascript
message.ordinal
message.type
message.content
message.byUserId
message.instructions         // parsed JSON
message.getInstruction(key)
```

## 2. Autocomplete / Autosuggest

The code editor's autocomplete should offer:

**Top-level objects:**
- `Users` — with `.loggedInUser`, `.login()`, `.logout()`
- `Streams` — with `.get()`, `.create()`, `.related()`, `.relate()`, `.unrelate()`, `.close()`
- `event`, `context` — standard handler args

**After `Streams.get()` resolves (or on `stream` parameter):**
- `.fields.title`, `.fields.content`, `.fields.type`, `.fields.name`, `.fields.publisherId`
- `.getAttribute()`, `.setAttribute()`, `.save()`
- `.post()`, `.onMessage()`, `.onFieldChanged()`, `.onAttribute()`, `.onEphemeral()`
- `.join()`, `.leave()`, `.participant()`
- `.testReadLevel()`, `.testWriteLevel()`, `.testAdminLevel()`
- `.subscribe()`, `.unsubscribe()`

**Stream type awareness:**
When a tool's properties specify a stream type (e.g. `Streams/chat`), autocomplete for that stream should include type-specific message types from the plugin's config. For example, a `Streams/chat` stream suggests `.onMessage('Streams/chat/message')`.

**Plugin-registered extras:**
Each plugin can register additional autocomplete entries via config:
```json
{
  "SafeScript": {
    "autocomplete": {
      "Media": {
        "methods": ["Media.upload(file, options)", "Media.resize(url, w, h)"],
        "events": ["Media.onUpload"]
      }
    }
  }
}
```

## 3. Stream Types as Tool Types

In Safe Studio's toolbox, stream-backed tools appear alongside UI tools. The developer drags a "Chat" tool onto the canvas — it's a `Streams/chat` tool backed by a `Streams/chat/main` stream. The properties panel shows:

**Stream binding:**
- `publisherId` — who publishes this stream (default: community)
- `streamName` — explicit name or auto-generated from type
- `Stream Type` — dropdown of registered types
- `Access` — read/write/admin level defaults

**When a tool is backed by a stream, SafeScript handlers get:**
```javascript
// context.stream — the backing stream, already observed
// context.stream.onMessage('Streams/chat/message').set(...)
```

## 4. Tool Instances and Scoping

A custom tool can have multiple instances on a page. Each instance:

1. Gets a unique DOM scope (data attributes for instance ID)
2. Gets its own stream bindings (each instance can point to a different stream)
3. SafeScript handlers inside the tool run with scoped `context`:
   - `context.tool` — the tool instance DOM element
   - `context.children` — map of child block IDs to elements within this instance
   - `context.stream` — the stream bound to this instance

**From page-level SafeScript:**
```javascript
// Reference tool instances by their page-level ID
Section1_MyAlert              // first instance
Section2_MyAlert              // second instance

// Or by class (all instances)
for (element of $AlertBox) {
  // each is a tool instance
}
```

**From tool-internal SafeScript:**
```javascript
// References are relative to this instance
Root_Icon                     // child element within this tool
Root_Title                    // another child

// context.tool is this instance's root element
context.tool.style.opacity = 0.5;
```

## 5. Embeddable Widget Generation

Safe Studio pages/tools can be exported as embeddable widgets via the existing `embed.php` infrastructure:

**How it works:**
1. Developer builds a tool or page in Safe Studio
2. The tool's HTML template is sanitized by `Q_Embed_Sanitizer`
3. Stored as `Streams.embed.html` attribute on a stream
4. Served via `embed.php?publisherId=X&streamName=Y`
5. The `Streams/embed` tool renders it, with the stream's data available as `page.stream.*`
6. Hosted in an iframe with strict CSP, postMessage bridge for height/ready events

**Safe Studio export flow:**
- "Export as Widget" button in Safe Studio
- Creates a `Websites/embed` stream with the sanitized HTML
- Provides the embed URL and an `<iframe>` snippet
- The widget auto-resizes via the ResizeObserver bridge

**Template bindings in embeds:**
The embed source can reference stream data:
```html
<h2>${page.stream.title}</h2>
<p>${page.stream.content}</p>
```
These are evaluated by `Q.Template.bind`'s restricted evaluator (no eval, no arbitrary JS).

## 6. Plugin Integration Points

Each Qbix plugin can extend Safe Studio by:

1. **Registering tools** — appear in the toolbox under appropriate categories
2. **Registering stream types** — appear as data sources in tool properties
3. **Registering SafeScript host objects** — API surface available in handlers
4. **Registering autocomplete entries** — method/property suggestions
5. **Providing embed templates** — pre-built widget layouts

Example — Media plugin integration:
```json
{
  "SafeStudio": {
    "tools": [
      {"id": "Media/image", "cat": "media", "icon": "🖼", "name": "Image", "streamType": "Streams/image"}
    ],
    "hostObjects": {
      "Media": {
        "methods": ["upload", "resize", "crop"],
        "properties": ["formats", "maxSize"]
      }
    }
  }
}
```

## 7. Why Streams > Firestore

- **Access control is per-stream, not per-collection.** Each stream has its own read/write/admin levels. No security rules file to maintain.
- **Every user acts as themselves.** The client SDK authenticates via session. No service account tokens on the client.
- **Real-time is built in.** `stream.onMessage()` and ephemerals work over WebSockets. No separate real-time subscription setup.
- **Relations are first-class.** Parent-child, category-member, weighted ordering — all built into the data model.
- **Messages are append-only with ordinals.** Full audit trail, fork-aware message chains, transparent history across forks.
- **Invitations and access grants are part of the protocol.** No separate auth system needed.
- **Templates define defaults.** Stream type configuration sets access levels, allowed messages, subscriptions, and auto-relations declaratively.

## 8. Implementation Phases

**Phase 1: Host objects (Users + Streams core)**
- Inject `Users` and `Streams` into SafeScript scope
- Wrap Q.Streams JS API with Promise-based interface
- Basic autocomplete for the API surface

**Phase 2: Stream-backed tools**
- Tool properties panel gets stream binding UI
- Context gets `.stream` when a tool has a bound stream
- Autocomplete is type-aware (message types, attributes)

**Phase 3: Plugin registration**
- Plugins declare tools, stream types, host objects via config
- Safe Studio reads plugin configs and extends the toolbox/autocomplete
- Plugin tools appear in appropriate categories

**Phase 4: Embeddable widgets**
- Export flow through Q_Embed_Sanitizer
- Stream-backed embed with template bindings
- iframe snippet generation with auto-resize
