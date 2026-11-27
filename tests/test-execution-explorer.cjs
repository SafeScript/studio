const { chromium } = require("playwright"),
  packed = require("@sparticuz/chromium").default,
  assert = require("assert").strict,
  fs = require("fs"),
  path = require("path");
const root = path.resolve(__dirname, ".."),
  shots = path.join(root, "debugger-screenshots");
fs.mkdirSync(shots, { recursive: true });
const original = `function onClick(event, context) {
  var seats = 6;
  var price = 29;
  var subtotal = seats * price;
  var discount = 0;
  for (var tier = 1; tier <= 2; tier++) {
    discount = discount + 5;
  }
  var total = subtotal - discount;
  context.block.querySelector(".quote-total").textContent = "$" + total.toFixed(2);
  context.block.querySelector(".quote-note").textContent = seats + " seats · $" + discount + " credit";
  return total;
}`;
(async () => {
  const b = await chromium.launch({
      headless: true,
      executablePath: await packed.executablePath(),
      args: packed.args,
    }),
    p = await b.newPage({ viewport: { width: 1440, height: 1050 } }),
    errors = [],
    checks = [];
  p.on("pageerror", (e) => errors.push(e.stack));
  p.on("dialog", (d) => d.accept());
  async function check(name, fn) {
    try {
      const detail = await fn();
      checks.push({ name, ok: true, detail });
      console.log("PASS", name);
    } catch (e) {
      checks.push({ name, ok: false, error: e.stack });
      console.error("FAIL", name, e.stack);
      throw e;
    }
  }
  async function pair(name, view) {
    await p
      .waitForFunction(
        () => !document.getElementById("toast").classList.contains("show"),
        { timeout: 3500 },
      )
      .catch(() => {});
    await p.setViewportSize({ width: 1440, height: 1050 });
    await p.evaluate(
      (view) => (view === "code" ? SS.showDebugCode() : SS.showDebugTimeline()),
      view,
    );
    await p.waitForTimeout(150);
    assert(
      (
        await p
          .locator(view === "code" ? "#code-panel" : "#timeline-pane")
          .boundingBox()
      ).height > 150,
      "Debugger panel is collapsed",
    );
    await p.screenshot({ path: path.join(shots, name + "-desktop.png") });
    await p.setViewportSize({ width: 390, height: 844 });
    await p.evaluate(
      (view) => (view === "code" ? SS.showDebugCode() : SS.showDebugTimeline()),
      view,
    );
    await p.waitForTimeout(300);
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.screenshot({ path: path.join(shots, name + "-mobile.png") });
    await p.evaluate(() => SS.mobTab("canvas"));
    await p.setViewportSize({ width: 1440, height: 1050 });
  }
  try {
    await p.goto("file://" + path.join(root, "index.html"));
    await p.waitForFunction(
      () => typeof SS !== "undefined" && !!state.cmEditor,
    );
    await p.evaluate((source) => {
      state.page.title = "Orbit — team workspace";
      state.page.theme.palette = "indigo";
      state.page.theme.bg = "light";
      state.page.sections = [
        {
          layoutKey: "hero-split",
          customId: "Quote",
          blocks: [
            {
              role: "content",
              tool: "Streams/html",
              content:
                '<div style="padding:32px 24px"><p style="font-size:11px;font-weight:700;letter-spacing:.18em;color:#6366f1">ORBIT / TEAM WORKSPACE</p><h1 style="font-size:46px;line-height:1.08;margin:18px 0;color:#eef3ff">A plan that grows<br>with your team.</h1><p style="font-size:16px;line-height:1.7;color:#a5b0ca;max-width:360px">One shared space for your ideas, projects, and people. Explore the live quote before you choose.</p><p style="font-size:12px;color:#71809b;margin-top:24px">6 seats · $29 per seat · monthly billing</p></div>',
            },
            {
              role: "content",
              tool: "Streams/html",
              content:
                '<div style="margin:18px;background:white;border:1px solid #dde3f0;border-radius:20px;padding:28px 34px;box-shadow:0 16px 50px #10224b12"><p style="font-size:11px;letter-spacing:.13em;color:#7a89a5;font-weight:700">YOUR TEAM PLAN</p><p style="font-size:16px;color:#263451;margin:14px 0 2px">Orbit Pro</p><div style="display:flex;align-items:baseline;gap:8px"><strong class="quote-total" style="font-size:56px;letter-spacing:-.05em;color:#182644">$174</strong><span style="color:#8792a9;font-size:13px">/ month</span></div><p class="quote-note" style="color:#728097;font-size:13px">Includes all 6 team members</p><hr style="border:0;border-top:1px solid #e8ecf4;margin:18px 0"><p style="font-size:13px;color:#596780;line-height:1.9">✓ Unlimited projects<br>✓ Shared team library<br>✓ Priority support</p><button class="quote-action" style="width:100%;padding:13px;background:#5f59ef;color:white;border:0;border-radius:9px;font-weight:600;cursor:pointer">Calculate team quote →</button></div>',
            },
          ],
        },
      ];
      state.handlers = {};
      renderAll();
      SS.openCodeEditor(0, 1);
      state.cmEditor.setValue(source);
      state.breakpoints.clear();
      state.breakpoints.add(9);
      SS.setMode("testing");
    }, original);
    fs.writeFileSync(
      path.join(root, "artifacts/debugging-demo.json"),
      JSON.stringify(
        await p.evaluate(() => ({
          safeStudio: "1.0",
          type: "page",
          page: state.page,
          handlers: state.handlers,
        })),
        null,
        2,
      ),
    );
    await check("Actual Test-mode click pauses the real event", async () => {
      await p.locator("#block-0-1 .quote-action").click();
      await p.waitForFunction(
        () =>
          state.debugSession?.state === "paused" &&
          state.debugSession.currentLine === 9,
      );
      const x = await p.evaluate(() => ({
        engine: state.debugSession.engine,
        line: state.debugSession.currentLine,
        locals: state.debugSession.getLocals(),
        events: SS.debugEvents.length,
      }));
      assert.equal(x.engine, "continuations");
      assert.equal(x.locals.subtotal, 174);
      assert.equal(x.locals.discount, 10);
      assert.equal(x.events, 1);
      return {
        line: x.line,
        subtotal: x.locals.subtotal,
        discount: x.locals.discount,
      };
    });
    await check(
      "Event has expandable steps and coordinated scrubber",
      async () => {
        await p.evaluate(() => SS.showDebugTimeline());
        await p.waitForFunction(
          () => document.querySelectorAll(".ss-event-step").length > 10,
        );
        assert(await p.locator("#ss-debug-scrubber").isVisible());
        assert(await p.locator("#ss-debug-fork-map svg").isVisible());
        return { rows: await p.locator(".ss-event-step").count() };
      },
    );
    await pair("01-paused-event", "code");
    const checkpoint = await p.evaluate(() => state.debugSession.currentNodeId);
    await check(
      "Original future runs with a sandboxed DOM projection",
      async () => {
        await p
          .locator("#dbg-continue")
          .click()
          .catch(async () => {
            await p.evaluate(() => SS.dbgContinue());
          });
        await p.waitForFunction(() => state.debugSession.state === "finished");
        const x = await p.evaluate(() => ({
          result: SS.debugEvents[0].result,
          original: document.querySelector("#block-0-1 .quote-total")
            .textContent,
          preview: document.querySelector("#ss-debug-projection .quote-total")
            ?.textContent,
        }));
        assert.equal(x.result, 164);
        assert.equal(x.original, "$174");
        assert.equal(x.preview, "$164.00");
        return x;
      },
    );
    const firstFuture = await p.evaluate(
      () => state.debugSession.currentNodeId,
    );
    await check(
      "Scrubbing backward restores the exact live bindings",
      async () => {
        await p.evaluate((id) => SS.seekDebug(id), checkpoint);
        await p.waitForFunction(() => state.debugSession.state === "paused");
        assert.equal(
          await p.evaluate(() => state.debugSession.getLocals().discount),
          10,
        );
        assert(
          await p.evaluate(
            (id) => state.debugSession.nodes.has(id),
            firstFuture,
          ),
        );
        return { checkpoint, firstFuture };
      },
    );
    await pair("02-rewound-timeline", "timeline");
    await check(
      "Editing code through keyboard preserves paused state",
      async () => {
        await p.evaluate(() => SS.showDebugCode());
        await p.locator(".CodeMirror").click();
        await p.keyboard.press("Control+A");
        await p.keyboard.insertText(
          original.replace(
            "var total = subtotal - discount;",
            "var total = subtotal * 0.85 - discount;",
          ),
        );
        await p.waitForFunction(
          () => !document.getElementById("dbg-apply-edits").disabled,
        );
        assert.equal(
          await p.evaluate(() => state.debugSession.getLocals().subtotal),
          174,
        );
        return {
          pending: await p.locator("#ss-debug-edit-status").innerText(),
        };
      },
    );
    await pair("03-edit-and-continue", "code");
    await check(
      "Apply edits and Continue create a different executable future",
      async () => {
        await p.evaluate(() => SS.showDebugCode());
        await p.locator("#dbg-apply-edits").click();
        await p.waitForFunction(() => state.debugSession.sourceVersion === 2);
        await p.locator("#dbg-continue").click();
        await p.waitForFunction(() => state.debugSession.state === "finished");
        const x = await p.evaluate(() => ({
          result: SS.debugEvents[0].result,
          preview: document.querySelector("#ss-debug-projection .quote-total")
            .textContent,
          original: document.querySelector("#block-0-1 .quote-total")
            .textContent,
          branchPoint: state.debugSession
            .getTimeline()
            .nodes.find((n) => n.children.length > 1),
        }));
        assert.equal(x.result, 137.9);
        assert.equal(x.preview, "$137.90");
        assert.equal(x.original, "$174");
        assert(x.branchPoint);
        return { result: x.result, branchPoint: x.branchPoint.id };
      },
    );
    const secondFuture = await p.evaluate(
      () => state.debugSession.currentNodeId,
    );
    await pair("04-forked-futures", "timeline");
    await check(
      "Both futures remain independently inspectable with source versions",
      async () => {
        await p.evaluate((id) => SS.seekDebug(id), firstFuture);
        await p.waitForTimeout(80);
        assert.equal(
          await p.evaluate(() => state.debugSession.sourceVersion),
          1,
        );
        assert.equal(
          await p.locator("#ss-debug-projection .quote-total").innerText(),
          "$164.00",
        );
        await p.evaluate((id) => SS.seekDebug(id), secondFuture);
        await p.waitForTimeout(80);
        assert.equal(
          await p.evaluate(() => state.debugSession.sourceVersion),
          2,
        );
        assert.equal(
          await p.locator("#ss-debug-projection .quote-total").innerText(),
          "$137.90",
        );
        return { firstFuture, secondFuture };
      },
    );
    await p.evaluate((id) => SS.seekDebug(id), checkpoint);
    await pair("05-explore-fork-point", "timeline");
    await p.evaluate((id) => SS.seekDebug(id), secondFuture);
    await check(
      "Range keyboard navigation restores actual checkpoints",
      async () => {
        await p.evaluate(() => SS.showDebugTimeline());
        const range = p.locator("#ss-debug-scrubber"),
          before = await range.inputValue();
        await range.focus();
        await p.keyboard.press("ArrowLeft");
        await p.waitForTimeout(80);
        assert.notEqual(await range.inputValue(), before);
        return { from: before, to: await range.inputValue() };
      },
    );
    await check("Events arriving while paused are queued", async () => {
      await p.evaluate(() => {
        _runHandler(
          "var x=1;",
          { type: "click" },
          document.getElementById("block-0-1"),
        );
      });
      await p.waitForTimeout(50);
      assert(
        (await p.locator("#ss-debug-queue").innerText()).includes("1 event"),
      );
      return { queued: true };
    });
    await check(
      "Phone explorer fits narrow viewports with accessible controls",
      async () => {
        const widths = [320, 360, 390, 430];
        for (const width of widths) {
          await p.setViewportSize({ width, height: 844 });
          await p.evaluate(() => SS.showDebugTimeline());
          await p.waitForTimeout(80);
          const x = await p.evaluate(() => ({
            doc: document.documentElement.scrollWidth,
            width: innerWidth,
            range: document
              .getElementById("ss-debug-scrubber")
              .getBoundingClientRect().height,
          }));
          assert(x.doc <= width, JSON.stringify(x));
          assert(x.range >= 40);
        }
        return { widths };
      },
    );
    await check(
      "Rejected edit keeps the original session runnable",
      async () => {
        await p.evaluate((id) => SS.seekDebug(id), checkpoint);
        await p.evaluate(() => SS.showDebugCode());
        await p.evaluate(() => state.cmEditor.setValue("var invalid = @@@;"));
        const before = await p.evaluate(() => state.debugSession.currentNodeId);
        const accepted = await p.evaluate(() => SS.dbgEditAndContinue());
        assert.equal(accepted, false);
        assert.equal(
          await p.evaluate(() => state.debugSession.state),
          "paused",
        );
        assert.equal(
          await p.evaluate(() => state.debugSession.currentNodeId),
          before,
        );
        return { accepted, session: "paused" };
      },
    );
    assert.deepEqual(errors, []);
  } catch (e) {
    console.error(e.stack);
  } finally {
    fs.writeFileSync(
      path.join(root, "artifacts/EXECUTION-EXPLORER-RESULTS.json"),
      JSON.stringify(
        { checks, failures: checks.filter((c) => !c.ok), jsErrors: errors },
        null,
        2,
      ),
    );
    await b.close();
    process.exitCode = checks.some((c) => !c.ok) || errors.length ? 1 : 0;
  }
})();
