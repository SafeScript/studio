"use strict";
const assert = require("assert").strict,
  fs = require("fs"),
  S = require("./");
const tick = async () => {
  for (let i = 0; i < 10; i++) await new Promise((r) => setImmediate(r));
};
const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}
function session(src, scope = {}, opts = {}) {
  const out = {};
  out.s = S.debug(src, scope, {
    captureAllLocals: true,
    onFinish: (v) => (out.value = v),
    onError: (e) => {
      if (!e.editRejected) out.error = e;
    },
    ...opts,
  });
  return out;
}
async function finish(o) {
  o.s.continue();
  for (let i = 0; i < 100 && o.s.state === "running"; i++) await tick();
  if (o.error) throw o.error;
  assert.equal(o.s.state, "finished");
  return o.value;
}
async function pauseLine(o, line) {
  for (let i = 0; i < 200; i++) {
    await tick();
    if (o.error) throw o.error;
    if (o.s.state === "paused" && o.s.currentLine === line) return;
    if (o.s.state === "finished") throw Error("Finished before line " + line);
    o.s.step();
  }
  throw Error("No pause at line " + line);
}
const cases = [
  ["arithmetic", "var x=2; return x*3+1;", 7],
  ["const and let", "let x=1; const y=3; x+=y; return x;", 4],
  ["conditional", "var x=2; if(x>1){x=5;}else{x=9;} return x;", 5],
  ["for loop", "var x=0;for(var i=0;i<5;i++){x+=i;}return x;", 10],
  ["while", "var x=0;while(x<4){x++;}return x;", 4],
  ["do while", "var x=0;do{x++;}while(x<3);return x;", 3],
  [
    "continue/break",
    "var x=0;for(var i=0;i<10;i++){if(i===2)continue;if(i===5)break;x+=i;}return x;",
    8,
  ],
  ["for of", "var x=0;for(let n of [2,3,4]){x+=n;}return x;", 9],
  ["for in", 'var x="";for(var k in {a:1,b:2}){x+=k;}return x;', "ab"],
  ["nested calls", "function f(a){var b=a+1;return b;}return f(f(3));", 5],
  [
    "recursion",
    "function f(n){if(n===0)return 1;return n*f(n-1);}return f(5);",
    120,
  ],
  [
    "closure",
    "function f(x){return function(y){return x+y;};}var a=f(4);return a(3);",
    7,
  ],
  [
    "iteration closures",
    "var a=[];for(let i=0;i<3;i++){a.push(function(){return i;});}return a[0]()+a[1]()+a[2]();",
    3,
  ],
  [
    "try catch",
    'var x;try{throw new Error("bad");}catch(e){x=e.message;}return x;',
    "bad",
  ],
  [
    "finally return",
    "function f(){try{return 2;}finally{return 3;}}return f();",
    3,
  ],
  ["finally mutation", "var x=0;try{x=2;}finally{x+=3;}return x;", 5],
  [
    "switch",
    "var x=0;switch(2){case 1:x=1;break;case 2:x=3;default:x+=2;}return x;",
    5,
  ],
  [
    "array destructuring",
    "var [a,b=3,...c]=[1,undefined,4,5];return a+b+c.length;",
    6,
  ],
  ["object destructuring", "var {a,b:x,...r}={a:2,b:3,c:4};return a+x+r.c;", 9],
  [
    "parameter defaults",
    "function f(a=3,...b){return a+b.length;}return f(undefined,1,2);",
    5,
  ],
  [
    "short circuit",
    "var x=0;false&&(x=3);true||(x=4);var y=null??8;return x+y;",
    8,
  ],
  ["logical assignment", "var x=0;x||=2;x&&=3;var y=null;y??=4;return x+y;", 7],
  ["postfix", "var x=1;var y=x++;return y*10+x;", 12],
  [
    "single eval member",
    "var i=0;var a=[2,3];var v=a[i++]++;return i*100+v*10+a[0];",
    123,
  ],
  [
    "map callback",
    "var a=[1,2,3].map(function(n){var x=n*2;return x;});return a[2];",
    6,
  ],
  ["reduce callback", "return [1,2,3].reduce((a,b)=>a+b,0);", 6],
  ["filter callback", "return [1,2,3].filter(x=>x>1).length;", 2],
  [
    "object methods this",
    "var a={n:4,f(x){return this.n+x;}};return a.f(3);",
    7,
  ],
  ["computed blocked", 'var x="con"+"structor";return {}[x];', undefined, true],
];
cases.forEach(([name, src, value, error]) =>
  test(name, async () => {
    const o = session(src);
    await tick();
    if (error) {
      o.s.continue();
      await tick();
      assert(o.error);
      return;
    }
    assert.deepEqual(await finish(o), value);
  }),
);
test("edit retains live state and skips initialization", async () => {
  const o = session("var x=1;\nx=x+1;\nreturn x;");
  await pauseLine(o, 2);
  o.s.setLocal("x", 40);
  assert.equal(o.s.editAndContinue("var x=1;\nx=x+2;\nreturn x;"), true);
  assert.equal(await finish(o), 42);
});
test("edit preserves injected capabilities", async () => {
  const o = session("var x=1;\nreturn api.double(x);", {
    api: { double: (x) => x * 2 },
  });
  await pauseLine(o, 2);
  assert(o.s.editAndContinue("var x=1;\nreturn api.double(x+1);"));
  assert.equal(await finish(o), 4);
});
test("edit inserts statements after pause", async () => {
  const o = session("var a=5;\nvar b=a+1;\nreturn b;");
  await pauseLine(o, 2);
  assert(o.s.editAndContinue("var a=5;\nvar b=a+1;\nvar c=b+100;\nreturn c;"));
  assert.equal(await finish(o), 106);
});
test("edit inside active nested call preserves caller operand", async () => {
  const o = session(
    "function f(a){\nvar b=a+1;\nreturn b;\n}\nvar x=10+f(3);\nreturn x;",
  );
  await pauseLine(o, 3);
  assert.equal(o.s.callDepth(), 1);
  assert(
    o.s.editAndContinue(
      "function f(a){\nvar b=a+1;\nreturn b*2;\n}\nvar x=10+f(3);\nreturn x;",
    ),
  );
  assert.equal(await finish(o), 18);
});
test("step over skips nested call; step out returns caller", async () => {
  const src =
    "function f(a){\nvar b=a+1;\nreturn b;\n}\nvar x=f(4);\nreturn x;";
  let o = session(src);
  await pauseLine(o, 5);
  o.s.stepOver();
  await tick();
  assert.equal(o.s.currentLine, 6);
  o.s.stop();
  o = session(src);
  await pauseLine(o, 2);
  o.s.stepOut();
  await tick();
  assert.equal(o.s.currentLine, 6);
  assert.equal(await finish(o), 5);
});
test("rewind restores executable state and preserves future", async () => {
  const o = session("var x=1;\nx=x+10;\nreturn x;");
  await pauseLine(o, 3);
  const future = o.s.currentNodeId;
  const first = o.s
    .getTimeline()
    .path.find((n) => n.line === 1 && n.phase === "after");
  o.s.seek(first.id);
  assert.equal(o.s.currentLocals.x, 1);
  o.s.setLocal("x", 5);
  assert.equal(await finish(o), 15);
  assert(o.s.nodes.has(future));
  o.s.seek(future);
  assert.equal(await finish(o), 11);
  assert(o.s.nodes.get(first.id).children.length >= 2);
});
test("fork independently executes two futures", async () => {
  const o = session("var x=1;\nx=x+1;\nreturn x;");
  await pauseLine(o, 2);
  const child = o.s.fork();
  let childValue;
  child.onFinish = (v) => (childValue = v);
  child.setLocal("x", 10);
  child.continue();
  await tick();
  assert.equal(childValue, 11);
  assert.equal(o.s.currentLocals.x, 1);
  assert.equal(await finish(o), 2);
});
test("nested history snapshots do not drift", async () => {
  const o = session("var a={n:1};\na.n=2;\nreturn a.n;");
  await pauseLine(o, 2);
  const old = o.s
    .getTimeline()
    .path.find((n) => n.line === 1 && n.phase === "after");
  o.s.step();
  await tick();
  assert.equal(o.s.nodes.get(old.id).locals.a.n, 1);
  o.s.seek(old.id);
  assert.equal(o.s.currentLocals.a.n, 1);
  o.s.stop();
});
test("journal cursor follows writes rather than checkpoint count", async () => {
  const data = { a: 0, b: 0 };
  const o = session('o["a"]=1;\no["b"]=2;\nreturn 3;', { o: data });
  await pauseLine(o, 3);
  const target = o.s
    .getTimeline()
    .path.find((n) => n.line === 2 && n.phase === "before");
  o.s.seek(target.id);
  assert.deepEqual(
    o.s.journal.entries().map((e) => e.key),
    ["a"],
  );
  assert.deepEqual(data, { a: 0, b: 0 });
  o.s.stop();
});
test("invalid edit preserves resumable session", async () => {
  const o = session("var x=1;\nreturn x;");
  await pauseLine(o, 2);
  assert.equal(o.s.editAndContinue("var x=@@@;"), false);
  assert.equal(o.s.state, "paused");
  assert.equal(await finish(o), 1);
});
test("active parameter changes rejected", async () => {
  const o = session("function f(a){\nreturn a;\n}\nreturn f(3);");
  await pauseLine(o, 2);
  assert.equal(
    o.s.editAndContinue("function f(b){\nreturn b;\n}\nreturn f(3);"),
    false,
  );
  assert.equal(await finish(o), 3);
});
test("const cannot be changed from locals", async () => {
  const o = session("const x=3;\nreturn x;");
  await pauseLine(o, 2);
  assert.throws(() => o.s.setLocal("x", 4), /constant|read-only/);
  assert.equal(await finish(o), 3);
});
test("opaque host call prevents misleading rewind", async () => {
  const o = session("var x=api.read();\nreturn x;", { api: { read: () => 4 } });
  const root = o.s.currentNodeId;
  await pauseLine(o, 2);
  assert.throws(() => o.s.seek(root), /external/);
  assert.equal(await finish(o), 4);
});
test("max ops protects continuation execution", async () => {
  const o = session("while(true){}", {}, { maxOps: 30 });
  await tick();
  o.s.continue();
  await tick();
  assert(o.error && /operations/.test(o.error.message));
});

test("forks preserve closure aliasing and independent captured cells", async () => {
  const o = session(
    "function make(){let x=1;return function(){x++;return x;};}\nvar f=make();\nvar a=f();\nreturn f();",
  );
  await pauseLine(o, 3);
  const c = o.s.fork();
  let v;
  c.onFinish = (x) => (v = x);
  c.continue();
  await tick();
  assert.equal(v, 3);
  assert.equal(await finish(o), 3);
});
test("seeded random is independent in fork", async () => {
  const o = session("var a=Math.random();\nvar b=Math.random();\nreturn b;");
  await pauseLine(o, 2);
  const c = o.s.fork();
  let cv;
  c.onFinish = (x) => (cv = x);
  c.continue();
  await tick();
  const pv = await finish(o);
  assert.equal(cv, pv);
});
test("scoped array methods commit only on request", async () => {
  const a = [1];
  const o = session("items.push(2);\nreturn items.length;", { items: a });
  await tick();
  assert.equal(await finish(o), 2);
  assert.deepEqual(a, [1]);
  o.s.commit();
  assert.deepEqual(a, [1, 2]);
});
test("checkpoint snapshot memory is bounded", async () => {
  const o = session(
    'var x="abc";\nwhile(true){x=x+x;}',
    {},
    { maxMemory: 2048 },
  );
  await tick();
  o.s.continue();
  await tick();
  assert(o.error && /memory/.test(o.error.message));
});
test("debug compiler rejects duplicate lexical declarations", async () => {
  assert.throws(() => S.debug("let x=1; let x=2;", {}), /declared|Duplicate/);
});
test("DOM projection, typed commit, discard and existing listeners", async () => {
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM('<div id="r"><button id="b">Original</button></div>'),
    root = dom.window.document.getElementById("r"),
    button = root.firstChild;
  let clicks = 0;
  button.addEventListener("click", () => clicks++);
  const o = session(
    'context.block.setAttribute("data-result","yes");\ncontext.block.textContent="Changed";\nreturn 1;',
    { context: { block: button } },
    { dom: { root } },
  );
  await tick();
  assert.equal(await finish(o), 1);
  assert.equal(button.textContent, "Original");
  assert(o.s.projectDOM().outerHTML.includes("Changed"));
  o.s.commit();
  assert.equal(root.firstChild, button);
  assert.equal(button.getAttribute("data-result"), "yes");
  assert.equal(button.textContent, "Changed");
  button.click();
  assert.equal(clicks, 1);
});
test("DOM structure remains sandboxed until commit", async () => {
  const { JSDOM } = require("jsdom");
  const root = new JSDOM(
    '<div id="r"><p>Original</p></div>',
  ).window.document.getElementById("r");
  const o = session(
    "var p=context.block.firstChild;\np.remove();\nreturn 1;",
    { context: { block: root } },
    { dom: { root } },
  );
  await tick();
  await finish(o);
  assert.equal(root.childNodes.length, 1);
  assert.equal(o.s.projectDOM().childNodes.length, 0);
  o.s.discard();
  assert.equal(o.s.projectDOM().childNodes.length, 1);
});
test("DOM checkpoints can restore structure and continue twice", async () => {
  const { JSDOM } = require("jsdom");
  const root = new JSDOM(
    "<div><p>A</p><p>B</p></div>",
  ).window.document.querySelector("div");
  const o = session(
    "var p=context.block.firstChild;\np.remove();\nreturn context.block.childElementCount;",
    { context: { block: root } },
    { dom: { root } },
  );
  await pauseLine(o, 2);
  const before = o.s.currentNodeId;
  assert.equal(await finish(o), 1);
  o.s.seek(before);
  assert.equal(o.s.projectDOM().childNodes.length, 2);
  assert.equal(await finish(o), 1);
  assert.equal(root.childNodes.length, 2);
});
test("protocol seeks and sets a live local", async () => {
  const events = [],
    driver = new S.InProcessDriver((e) => events.push(e));
  const o = session("var x=1;\nx++;\nreturn x;", {}, { driver });
  await pauseLine(o, 2);
  driver.command("setLocal", { name: "x", value: 7 });
  driver.command("getTimeline");
  assert(events.some((e) => e.type === "timeline"));
  assert.equal(await finish(o), 8);
});

test("editing a loop body keeps the current iteration", async () => {
  const o = session(
    "var sum=0;\nfor(var i=0;i<3;i++){\nsum+=i;\n}\nreturn sum;",
  );
  await pauseLine(o, 3);
  o.s.step();
  await tick();
  await pauseLine(o, 3);
  assert.equal(o.s.getLocals().i, 1);
  assert(
    o.s.editAndContinue(
      "var sum=0;\nfor(var i=0;i<3;i++){\nsum+=i*2;\n}\nreturn sum;",
    ),
  );
  assert.equal(await finish(o), 6);
});
test("forged DOM marker cannot bypass immutable snapshots", async () => {
  const o = session(
    "var a={__isSafeHandle:true,nodeType:1,n:1};\na.n=2;\nreturn a.n;",
  );
  await pauseLine(o, 2);
  const before = o.s.currentNodeId;
  o.s.step();
  await tick();
  o.s.seek(before);
  assert.equal(o.s.getLocals().a.n, 1);
  o.s.stop();
});
test("scope functions retain host source wrapping", async () => {
  const o = session("return api.toString();", {
    api: function PRIVATE_HOST_SOURCE() {
      return 1;
    },
  });
  await tick();
  assert(!(await finish(o)).includes("PRIVATE_HOST_SOURCE(){return"));
});
test("caught engine errors do not expose source paths", async () => {
  const o = session("try{var x=null;x.foo;}catch(e){return e.stack;}");
  await tick();
  assert(!(await finish(o)).includes("/workspace/"));
});
test("scoped Map and Set mutations remain transactional", async () => {
  const map = new Map([["a", 1]]),
    set = new Set([1]);
  const o = session('m.set("a",2);\ns.add(3);\nreturn m.get("a")+s.size;', {
    m: map,
    s: set,
  });
  await tick();
  assert.equal(await finish(o), 4);
  assert.equal(map.get("a"), 1);
  assert.deepEqual([...set], [1]);
  o.s.commit();
  assert.equal(map.get("a"), 2);
  assert.deepEqual([...set], [1, 3]);
});
test("injected scalar bindings remain mutable", async () => {
  const o = session("count=count+1;\nreturn count;", { count: 2 });
  await tick();
  assert.equal(await finish(o), 3);
});
test("commit establishes a boundary across forked sessions", async () => {
  const o = session("var x=1;\nreturn x;");
  await pauseLine(o, 2);
  const c = o.s.fork();
  o.s.commit();
  assert.throws(() => c.continue(), /committed/);
});

test("regex literals retain their pattern and flags", async () => {
  const o = session('return "hello world".match(/hello/)[0];');
  await tick();
  assert.equal(await finish(o), "hello");
});
test("resumed function name remains stable", async () => {
  const o = session("function f(a){return a;}\nvar x=1;\nreturn f.name;");
  await pauseLine(o, 3);
  const id = o.s.currentNodeId;
  o.s.seek(id);
  assert.equal(await finish(o), "f");
});
(async () => {
  let failed = 0;
  const results = [];
  for (const t of tests) {
    try {
      await t.fn();
      results.push({ name: t.name, ok: true });
      console.log("OK", t.name);
    } catch (e) {
      failed++;
      results.push({ name: t.name, ok: false, error: e.stack });
      console.error("FAIL", t.name, e.stack);
    }
  }
  console.log(JSON.stringify({ passed: tests.length - failed, failed }));
  if (process.env.CONTINUATION_RESULTS)
    fs.writeFileSync(
      process.env.CONTINUATION_RESULTS,
      JSON.stringify(
        { checks: results, passed: tests.length - failed, failed },
        null,
        2,
      ),
    );
  process.exitCode = failed ? 1 : 0;
})();
