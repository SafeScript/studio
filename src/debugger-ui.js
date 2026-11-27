/* Execution explorer: real SafeScript checkpoints, independent futures and projection. */
(function installExecutionExplorer() {
  const events = [];
  let selectedEvent = null,
    queue = [],
    refreshPending = false,
    browsing = false;
  const oldRender = renderTimelineTree,
    oldInput = onCodeInput,
    oldUpdate = updateDebugUI,
    oldClear = clearDebugUI;
  const rawSource = (s) => s.split("\n\n// [Safe Studio event invocation]")[0];
  function executable(code) {
    const f = code.match(/^(?:\s|\/\*[\s\S]*?\*\/)*function\s+([\w$]+)\s*\(/);
    return f
      ? code +
          "\n\n// [Safe Studio event invocation]\nreturn " +
          f[1] +
          "(event, context);"
      : code;
  }
  function format(v) {
    if (v && v._sf) return "ƒ";
    try {
      const s =
        typeof v === "string"
          ? JSON.stringify(v)
          : v === undefined
            ? "undefined"
            : JSON.stringify(v);
      return String(s).slice(0, 70);
    } catch (e) {
      return "[shared object]";
    }
  }
  function current() {
    return selectedEvent && events.find((e) => e.id === selectedEvent);
  }
  function later() {
    if (refreshPending) return;
    refreshPending = true;
    queueMicrotask(() => {
      refreshPending = false;
      refresh();
    });
  }
  function bindSession(group, session) {
    group.session = session;
    session.onPause = (info) => {
      state.debugState = "paused";
      state.debugLocals = info.locals;
      later();
    };
    session.onStep = () => later();
    session.onFinish = (value) => {
      group.result = value;
      state.debugState = "finished";
      later();
    };
    session.onError = (error) => {
      if (error.editRejected) {
        state.debugState = "paused";
        showDebugError(error);
        SS.showDebugCode();
      } else {
        group.error = error.message;
        state.debugState = "finished";
        showDebugError(error);
        SS.showDebugCode();
      }
      later();
    };
  }
  function refresh() {
    const group = current(),
      s = group && group.session;
    if (!s) return;
    state.debugSession = s;
    state.debugState = s.state;
    state.debugLocals = s.currentLocals || s.getLocals();
    state.debugHistory = s.history;
    if (s.state === "paused")
      oldUpdate({
        line: s.currentLine,
        locals: state.debugLocals,
        phase: s.nodes.get(s.currentNodeId)?.phase,
      });
    else oldUpdate({ finished: true, value: group.result });
    const dirty =
      state.cmEditor && executable(state.cmEditor.getValue()) !== s.source;
    document.getElementById("dbg-apply-edits").disabled =
      s.state !== "paused" || !dirty;
    document.getElementById("ss-debug-edit-status").textContent = dirty
      ? "Edits pending · apply on next step"
      : "v" + s.sourceVersion + " · " + s.state;
    project(s);
    renderTimelineTree();
    updateDebugButtons();
    document.getElementById("dbg-stop").disabled =
      s.state !== "paused" && s.state !== "running";
  }
  function showSource(s) {
    if (!state.cmEditor) return;
    const code = rawSource(s.source);
    if (state.cmEditor.getValue() !== code) {
      browsing = true;
      state._debugBrowsingSource = true;
      state.cmEditor.setValue(code);
      state._debugBrowsingSource = false;
      browsing = false;
    }
  }
  function project(s) {
    let root = s.projectDOM && s.projectDOM(),
      box = document.getElementById("ss-debug-projection");
    if (!root) {
      if (box) box.remove();
      return;
    }
    if (!box) {
      box = document.createElement("div");
      box.id = "ss-debug-projection";
      document.getElementById("cv-wrap").appendChild(box);
    }
    root.querySelectorAll("[id]").forEach((n) => {
      n.dataset.debugId = n.id;
      n.removeAttribute("id");
    });
    box.innerHTML =
      '<div class="ss-projection-label">SANDBOX PREVIEW · ' +
      escHtml(s.state) +
      " · v" +
      s.sourceVersion +
      '</div><div class="ss-projection-page">' +
      root.innerHTML +
      "</div>";
  }
  function focusPanel(name) {
    document.getElementById("ide-panels").classList.add("open");
    document
      .querySelectorAll(".ide-tab")
      .forEach((t) => t.classList.toggle("active", t.dataset.panel === name));
    document
      .getElementById("handlers-panel")
      .classList.toggle("active", name === "handlers");
    document
      .getElementById("timeline-panel-wrap")
      .classList.toggle("active", name === "timeline");
    state.codeOpen = name === "handlers";
    if (state.cmEditor) setTimeout(() => state.cmEditor.refresh(), 0);
  }
  function apply() {
    const g = current(),
      s = g && g.session;
    if (!s || s.state !== "paused") return false;
    const src = executable(state.cmEditor.getValue());
    if (src === s.source) return true;
    if (!s.editAndContinue(src)) {
      showToast("Edit rejected: " + s.lastEditError, "err");
      later();
      return false;
    }
    showToast("Edits applied; execution position and locals preserved", "ok");
    later();
    return true;
  }
  function resume(mode) {
    const s = state.debugSession;
    if (!s || s.state === "finished") {
      dbgStartSession();
      return;
    }
    if (s.state !== "paused" || !apply()) return;
    s[mode]();
    later();
  }
  dbgStartSession = function (settings) {
    settings = settings || {};
    const code =
      settings.code === undefined
        ? state.cmEditor && state.cmEditor.getValue()
        : settings.code;
    if (!code || !code.trim()) return false;
    if (state.debugSession && state.debugSession.state === "running") {
      showToast("Pause or stop the active event first", "info");
      return false;
    }
    const frame = document.getElementById("cv-frame"),
      target =
        settings.element ||
        (state.codeTarget &&
          document.getElementById(
            state.codeTarget.bi == null
              ? "sec-" + state.codeTarget.si
              : "block-" + state.codeTarget.si + "-" + state.codeTarget.bi,
          )) ||
        frame;
    const scope = buildElementScope(
      code,
      target && target.closest("[data-tool-instance]"),
    );
    delete scope.$;
    scope.event = settings.event || buildSimulatedEvent();
    scope.context = {
      block: target,
      section: target.closest(".ss-section") || frame,
      page: frame,
      tool: target.closest("[data-tool-instance]") || null,
    };
    const group = {
      id: events.length + 1,
      label:
        settings.label ||
        ((state.codeTarget && state.codeTarget.event) || "Handler") +
          " → " +
          (target.dataset.ssId || target.id || "page"),
      session: null,
      source: code,
    };
    events.push(group);
    selectedEvent = group.id;
    state.debugState = "running";
    const errorCard = document.getElementById("debug-error-card");
    errorCard.style.display = "none";
    try {
      const s = SafeScript.debug(executable(code), scope, {
        captureAllLocals: true,
        pauseOn: "before",
        breakpoints: Array.from(state.breakpoints),
        dom: { root: frame },
        maxOps: 100000,
        onPause: () => later(),
        onStep: () => later(),
        onFinish: (v) => {
          group.result = v;
          later();
        },
        onError: (e) => {
          group.error = e.message;
          showDebugError(e);
          SS.showDebugCode();
          later();
        },
      });
      bindSession(group, s);
      state.debugSession = s;
      state.debugState = s.state;
      document.getElementById("code-panel").classList.add("debug-active");
      document.getElementById("locals-panel").classList.add("active");
      document.getElementById("debug-panel").classList.add("active");
      document.body.classList.add("ss-debug-active");
      // The new event is an expandable entry in the existing page timeline.
      pushUndo(group.label, "event");
      group.pageNode = _tlTree.currentId;
      if (
        settings.actual &&
        !document.getElementById("ss-pause-events").checked &&
        !state.breakpoints.has(s.currentLine)
      )
        s.continue();
      if (!settings.actual) SS.showDebugTimeline();
      later();
      return true;
    } catch (e) {
      group.error = e.message;
      state.debugState = "finished";
      showDebugError(e);
      later();
      return false;
    }
  };
  dbgRun = () => dbgStartSession();
  dbgStep = () => resume("step");
  dbgStepOver = () => resume("stepOver");
  dbgStepOut = () => resume("stepOut");
  dbgContinue = () => resume("continue");
  dbgEditAndContinue = apply;
  dbgRewind = function (index) {
    const s = state.debugSession;
    if (!s) return;
    const h = s.history[index];
    if (h) SS.seekDebug(h.id);
  };
  dbgFork = function () {
    const s = state.debugSession;
    if (!s || s.state !== "paused") return;
    const n = s.nodes.get(s.currentNodeId);
    s._record(s.currentLine, n.phase, n.nodeId, "Fork here");
    s._pause({ forked: true });
    later();
  };
  dbgCommit = function () {
    if (!state.debugSession) return;
    try {
      state.debugSession.commit();
      showToast("Selected branch committed", "ok");
      later();
    } catch (e) {
      showToast(e.message, "err");
    }
  };
  dbgDiscard = function () {
    if (!state.debugSession) return;
    try {
      state.debugSession.discard();
      showToast("Sandbox effects discarded", "info");
      later();
    } catch (e) {
      showToast(e.message, "err");
    }
  };
  dbgStop = function () {
    if (state.debugSession) state.debugSession.stop();
    state.debugState = "idle";
    state.debugSession = null;
    document.body.classList.remove("ss-debug-active");
    document.getElementById("ss-debug-projection")?.remove();
    oldClear();
    document.getElementById("code-panel").classList.remove("debug-active");
    document.getElementById("locals-panel").classList.remove("active");
    document.getElementById("debug-panel").classList.remove("active");
    renderTimelineTree();
  };
  editLocal = function (name, raw) {
    const s = state.debugSession;
    if (!s || s.state !== "paused") return;
    try {
      let v = raw.trim();
      if (v === "undefined") v = undefined;
      else {
        try {
          v = JSON.parse(v);
        } catch (e) {
          if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
        }
      }
      s.setLocal(name, v);
      later();
    } catch (e) {
      showToast(e.message, "err");
      later();
    }
  };
  onCodeInput = function () {
    if (browsing || state._debugBrowsingSource) return;
    oldInput();
    later();
  };
  renderStepHistory = function (history) {
    const s = state.debugSession;
    if (!s || !s.getTimeline) return;
    document.getElementById("step-list").innerHTML = history
      .map(
        (h, i) =>
          '<button class="step-row' +
          (h.id === s.currentNodeId ? " current" : "") +
          '" onclick="SS.seekDebug(' +
          h.id +
          ')"><span>' +
          i +
          "</span><span>L" +
          h.line +
          "</span><span>" +
          h.phase +
          "</span></button>",
      )
      .join("");
  };
  renderTimelineTree = function () {
    oldRender();
    const list = document.getElementById("timeline-list");
    if (!list) return;
    events.forEach((g) => {
      const s = g.session;
      if (!s) return;
      const expanded = g.id === selectedEvent;
      let row = list.querySelector('[data-nid="' + g.pageNode + '"]');
      if (!row) {
        row = document.createElement("div");
        row.className = "tl-row event";
        row.innerHTML =
          '<div class="tl-icon event">⚡</div><div class="tl-desc-label"></div>';
        row.querySelector(".tl-desc-label").textContent = g.label;
        list.appendChild(row);
      }
      row.classList.add("ss-execution-event");
      row.onclick = () => SS.selectDebugEvent(g.id);
      row.title = "Expand event execution";
      const badge = document.createElement("span");
      badge.className = "ss-execution-badge";
      badge.textContent =
        (expanded ? "▾ " : "▸ ") + s.nodes.size + " checkpoints · " + s.state;
      row.appendChild(badge);
      if (!expanded) return;
      const timeline = s.getTimeline(),
        wrap = document.createElement("div");
      wrap.className = "ss-event-steps";
      wrap.innerHTML = timeline.path
        .map((n, i) => {
          const p = s.versions.get(n.version),
            generated = p && n.line > rawSource(p.source).split("\n").length,
            line =
              n.phase === "complete"
                ? "Event completed"
                : generated
                  ? "Event invocation"
                  : (p && p.source.split("\n")[Math.max(0, n.line - 1)]) ||
                    n.label ||
                    "Complete";
          const changes = Object.entries(n.locals || {})
            .filter(
              ([k, v]) =>
                typeof v !== "function" && !["event", "context"].includes(k),
            )
            .slice(0, 4)
            .map(([k, v]) => k + " = " + format(v))
            .join(" · ");
          return (
            '<button class="ss-event-step' +
            (n.id === s.currentNodeId ? " current" : "") +
            '" data-checkpoint="' +
            n.id +
            '" ' +
            (n.locked ? "disabled" : "") +
            ' style="--call-depth:' +
            Math.min(5, n.depth) +
            '" onclick="SS.seekDebug(' +
            n.id +
            ')"><span class="ss-step-position">' +
            (i + 1) +
            '</span><span class="ss-step-code"><strong>' +
            escHtml(
              n.label ||
                (n.phase === "complete"
                  ? "Event complete"
                  : generated
                    ? "Event invocation"
                    : "L" + n.line + " · " + n.phase) +
                  " · v" +
                  n.version,
            ) +
            "</strong><code>" +
            escHtml(line.trim()) +
            "</code><small>" +
            escHtml(changes) +
            "</small></span>" +
            (n.children.length > 1
              ? '<span class="ss-fork-label">' +
                n.children.length +
                " futures</span>"
              : "") +
            (n.locked ? "<span>🔒</span>" : "") +
            "</button>"
          );
        })
        .join("");
      row.after(wrap);
    });
    const group = current(),
      s = group && group.session,
      explorer = document.getElementById("ss-debug-explorer");
    explorer.hidden = !s || state.debugState === "idle";
    if (!s) return;
    const t = s.getTimeline(),
      range = document.getElementById("ss-debug-scrubber");
    range.max = Math.max(0, t.path.length - 1);
    range.value = Math.max(
      0,
      t.path.findIndex((n) => n.id === s.currentNodeId),
    );
    range.disabled = s.state === "running";
    document.getElementById("ss-debug-position").textContent =
      group.label +
      " · " +
      s.state +
      " · " +
      (+range.value + 1) +
      " / " +
      t.path.length;
    const leaves = t.nodes.filter((n) => !n.children.length);
    const select = document.getElementById("ss-debug-branches");
    const options = leaves
      .map(
        (n, i) =>
          '<option value="' +
          n.id +
          '">Future ' +
          (i + 1) +
          " · " +
          (n.result !== undefined
            ? "result " + format(n.result)
            : n.label || "L" + n.line) +
          " · v" +
          n.version +
          "</option>",
      )
      .join("");
    if (select.innerHTML !== options) select.innerHTML = options;
    const leaf = t.path[t.path.length - 1];
    if (leaf) select.value = leaf.id;
    select.disabled = s.state === "running";
    document.getElementById("time-info").textContent =
      s.nodes.size + " checkpoints · " + leaves.length + " futures";
    const values = Object.entries(s.getLocals())
      .filter(
        ([k, v]) =>
          typeof v !== "function" && !["event", "context"].includes(k),
      )
      .slice(0, 6);
    document.getElementById("ss-debug-values").innerHTML =
      values
        .map(
          ([k, v]) =>
            "<span><b>" + escHtml(k) + "</b> " + escHtml(format(v)) + "</span>",
        )
        .join("") || "<span>Step into the event to inspect values</span>";
    explorer
      .querySelectorAll(".ss-explorer-controls button")
      .forEach((button, i) => {
        button.disabled =
          i < 3
            ? s.state !== "paused" || !s.frames.length
            : s.state === "running";
      });
    const activeStep = list.querySelector(".ss-event-step.current");
    if (activeStep) {
      const r = activeStep.getBoundingClientRect(),
        b = list.getBoundingClientRect();
      if (r.bottom > b.bottom || r.top < b.top)
        list.scrollTop += r.bottom - b.bottom + 12;
    }
    document.getElementById("ss-debug-queue").textContent = queue.length
      ? queue.length + " event(s) queued"
      : "";
    document.getElementById("ss-debug-next").disabled =
      !queue.length || s.state === "paused" || s.state === "running";
    drawForks(s, t);
  };
  function drawForks(s, t) {
    const by = new Map(t.nodes.map((n) => [n.id, n])),
      positions = new Map();
    let lane = 0,
      maxDepth = 1;
    function layout(n, depth) {
      let y;
      if (!n.children.length) y = 24 + lane++ * 26;
      else
        y =
          n.children
            .map((id) => layout(by.get(id), depth + 1))
            .reduce((a, b) => a + b, 0) / n.children.length;
      positions.set(n.id, { x: depth, y });
      maxDepth = Math.max(depth, maxDepth);
      return y;
    }
    const root = t.nodes.find((n) => n.parentId == null);
    if (!root) return;
    layout(root, 0);
    const width = 800,
      height = Math.max(70, 24 + lane * 26),
      scale = 760 / maxDepth,
      active = new Set(t.path.map((n) => n.id));
    let svg = "";
    t.nodes.forEach((n) => {
      const p = positions.get(n.id),
        x = 20 + p.x * scale,
        y = p.y;
      if (n.parentId) {
        const q = positions.get(n.parentId),
          px = 20 + q.x * scale;
        svg +=
          '<path d="M' +
          px +
          "," +
          q.y +
          " C" +
          (px + x) / 2 +
          "," +
          q.y +
          " " +
          (px + x) / 2 +
          "," +
          y +
          " " +
          x +
          "," +
          y +
          '" class="' +
          (active.has(n.id) ? "active" : "") +
          '"/>';
      }
      svg +=
        '<g role="button" tabindex="0" aria-label="Checkpoint ' +
        n.id +
        " line " +
        n.line +
        '" onclick="SS.seekDebug(' +
        n.id +
        ")\" onkeydown=\"if(event.key==='Enter'||event.key===' '){event.preventDefault();SS.seekDebug(" +
        n.id +
        ')}"' +
        (n.locked ? ' class="locked"' : "") +
        "><title>" +
        escHtml(
          (n.label || "L" + n.line + " " + n.phase) + " · v" + n.version,
        ) +
        '</title><circle class="ss-fork-hit" cx="' +
        x +
        '" cy="' +
        y +
        '" r="12"/><circle cx="' +
        x +
        '" cy="' +
        y +
        '" r="' +
        (n.id === s.currentNodeId ? 7 : 4) +
        '" class="' +
        (n.id === s.currentNodeId
          ? "selected"
          : active.has(n.id)
            ? "active"
            : "") +
        '"/></g>';
    });
    document.getElementById("ss-debug-fork-map").innerHTML =
      '<svg viewBox="0 0 ' +
      width +
      " " +
      height +
      '" role="group" aria-label="Recorded execution futures">' +
      svg +
      "</svg>";
  }
  _runHandler = function (code, eventObj, el) {
    if (!document.getElementById("ss-record-events").checked) {
      try {
        const scope = buildElementScope(
          code,
          el.closest("[data-tool-instance]"),
        );
        scope.event = eventObj;
        scope.context = {
          block: el,
          section: el.closest(".ss-section"),
          page: document.getElementById("cv-frame"),
        };
        SafeScript.run(executable(code), scope).catch(showDebugError);
      } catch (e) {
        showDebugError(e);
      }
      return;
    }
    if (
      state.debugSession &&
      (state.debugSession.state === "paused" ||
        state.debugSession.state === "running")
    ) {
      queue.push({
        code,
        event: eventObj,
        element: el,
        actual: true,
        label: eventObj.type + " → " + (el.dataset.ssId || el.id),
      });
      later();
      return;
    }
    dbgStartSession({
      code,
      event: eventObj,
      element: el,
      actual: true,
      label: eventObj.type + " → " + (el.dataset.ssId || el.id),
    });
  };
  Object.assign(SS, {
    dbgStartSession,
    dbgRun,
    dbgStep,
    dbgStepOver,
    dbgStepOut,
    dbgContinue,
    dbgEditAndContinue,
    dbgRewind,
    dbgFork,
    dbgCommit,
    dbgDiscard,
    dbgStop,
    editLocal,
    onCodeInput,
    seekDebug(id) {
      const s = state.debugSession || current()?.session;
      if (!s) return;
      try {
        s.seek(Number(id));
        showSource(s);
        state.debugSession = s;
        state.debugState = "paused";
        later();
      } catch (e) {
        showToast(e.message, "err");
      }
    },
    scrubDebug(value) {
      const s = state.debugSession || current()?.session,
        path = s && s.getTimeline().path;
      if (path && path[value]) SS.seekDebug(path[value].id);
    },
    selectDebugEvent(id) {
      const g = events.find((e) => e.id === id);
      if (!g) return;
      if (state.debugSession?.state === "running") {
        showToast("Stop the running event first", "info");
        return;
      }
      selectedEvent = id;
      state.debugSession = g.session;
      state.debugState = g.session.state;
      showSource(g.session);
      later();
    },
    nextDebugEvent() {
      if (queue.length) {
        const e = queue.shift();
        dbgStartSession(e);
      }
    },
    showDebugCode() {
      if (window.innerWidth <= 768) {
        if (
          !document
            .getElementById("code-panel")
            .classList.contains("mob-active")
        )
          mobTab("code");
      } else focusPanel("handlers");
    },
    showDebugTimeline() {
      if (window.innerWidth <= 768) {
        if (
          !document
            .getElementById("timeline-pane")
            .classList.contains("mob-active")
        )
          mobTab("timeline");
      } else focusPanel("timeline");
    },
    debugEvents: events,
  });
  const toolbar = document.getElementById("dbg-toolbar");
  toolbar.insertAdjacentHTML(
    "beforeend",
    '<button class="dbg-btn" id="dbg-apply-edits" onclick="SS.dbgEditAndContinue()" disabled>Apply edits</button><button class="dbg-btn" id="dbg-show-timeline" onclick="SS.showDebugTimeline()">Explore ↗</button>',
  );
  document
    .getElementById("code-status")
    .insertAdjacentHTML(
      "afterend",
      '<span id="ss-debug-edit-status" aria-live="polite"></span>',
    );
  const pane = document.getElementById("timeline-pane");
  const explorer = document.createElement("section");
  explorer.id = "ss-debug-explorer";
  explorer.hidden = true;
  explorer.innerHTML =
    '<div class="ss-explorer-top"><strong>Execution explorer</strong><span id="ss-debug-position" aria-live="polite"></span><button class="btn-sm" onclick="SS.showDebugCode()">Edit handler</button></div><div class="ss-explorer-controls"><button class="btn-sm" onclick="SS.dbgStep()">Step</button><button class="btn-sm" id="ss-explorer-continue" onclick="SS.dbgContinue()">Continue from here</button><button class="btn-sm" onclick="SS.dbgFork()">Fork here</button><select id="ss-debug-branches" aria-label="Recorded futures" onchange="SS.seekDebug(this.value)"></select><button class="btn-sm" onclick="SS.dbgCommit()">Commit</button><button class="btn-sm" onclick="SS.dbgDiscard()">Discard</button></div><div id="ss-debug-fork-map"></div><input type="range" id="ss-debug-scrubber" min="0" max="0" value="0" step="1" aria-label="Scrub event execution" oninput="SS.scrubDebug(this.value)"><div id="ss-debug-values"></div><div class="ss-explorer-foot">Scrub to inspect · continuing from the past preserves the original future <span id="ss-debug-queue"></span><button class="btn-sm" id="ss-debug-next" onclick="SS.nextDebugEvent()" disabled>Next event</button></div>';
  pane.insertBefore(explorer, document.getElementById("timeline-list"));
  const settings = document.createElement("div");
  settings.className = "ss-event-record-settings";
  settings.innerHTML =
    '<label><input type="checkbox" id="ss-record-events" checked> Record Test events</label><label><input type="checkbox" id="ss-pause-events"> Pause on each event</label>';
  pane.insertBefore(settings, explorer);
  // Pending source edits never get applied merely by inspecting a historical checkpoint.
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      state.debugState === "paused" &&
      e.target.id === "ss-debug-scrubber"
    )
      e.target.blur();
  });
})();
