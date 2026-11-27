/** Resumable debug sessions, executed by compiler-generated native JS continuations. */
"use strict";
var compiler = require("./continuation-compiler");
var runtime = require("./runtime");
var defs = require("./defs");
var Base = require("./debug").DebugSession;
var Journal = require("./journal").Journal;
var protocol = require("./debug-protocol");
var createDOMContext = require("./dom/index").createDOMContext;
var resolveHandle = require("./dom/safe-handle").resolveNode;
var UNINITIALIZED = Object.freeze({ tdz: true });
function Environment(parent, kind) {
  this.parent = parent;
  this.kind = kind;
  this.cells = Object.create(null);
}
function domCapture(root) {
  if (!root) return null;
  var nodes = [];
  function visit(n) {
    nodes.push({
      node: n,
      children: Array.from(n.childNodes || []),
      attrs: n.attributes
        ? Array.from(n.attributes).map(function (a) {
            return [a.name, a.value];
          })
        : null,
      data: n.nodeType === 3 ? n.data : null,
      value: "value" in n ? n.value : undefined,
      checked: "checked" in n ? n.checked : undefined,
    });
    Array.from(n.childNodes || []).forEach(visit);
  }
  visit(root);
  return nodes;
}
function domRestore(records) {
  if (!records) return;
  records.forEach(function (r) {
    var n = r.node;
    if (r.attrs) {
      Array.from(n.attributes).forEach(function (a) {
        n.removeAttribute(a.name);
      });
      r.attrs.forEach(function (a) {
        n.setAttribute(a[0], a[1]);
      });
    }
    if (r.data !== null) n.data = r.data;
    if (r.value !== undefined) n.value = r.value;
    if (r.checked !== undefined) n.checked = r.checked;
    while (n.firstChild) n.removeChild(n.firstChild);
    r.children.forEach(function (c) {
      n.appendChild(c);
    });
  });
}
function Session(source, scope, opts, shared) {
  opts = opts || {};
  Base.call(this, opts);
  this.options = opts;
  this.engine = "continuations";
  this.program = shared ? shared.program : compiler.compile(source);
  this.source = source;
  this.sourceVersion = 1;
  this.versions = shared ? shared.versions : new Map([[1, this.program]]);
  this._hostObjects = shared ? shared._hostObjects : new Set();
  this._originals = shared ? shared._originals : new WeakMap();
  this._functionInfo = shared ? shared._functionInfo : new WeakMap();
  this._domOriginal = shared ? shared._domOriginal : opts.dom && opts.dom.root;
  this._domMap = shared ? shared._domMap : new Map();
  if (shared) {
    this.domRoot = shared.domRoot;
    this.domContext = shared.domContext;
    this._domInitial = shared._domInitial;
  } else if (this._domOriginal) {
    this.domRoot = this._domOriginal.cloneNode(true);
    var pair = (a, b) => {
      this._domMap.set(b, a);
      this._hostObjects.add(a);
      this._hostObjects.add(b);
      for (var i = 0; i < a.childNodes.length; i++)
        pair(a.childNodes[i], b.childNodes[i]);
    };
    pair(this._domOriginal, this.domRoot);
    this.domContext = createDOMContext(this.domRoot, opts.dom.policy, this);
    this._domInitial = domCapture(this.domRoot);
  }
  this._effects = [];
  this.nodes = shared ? shared.nodes : new Map();
  this.nextId = shared ? shared.nextId : 1;
  this.currentNodeId = null;
  this._preferred = new Map();
  this.history = [];
  this._commitClock = shared ? shared._commitClock : { value: 0 };
  this.epoch = this._commitClock.value;
  this._barrier = 0;
  this._generation = 0;
  this._busy = false;
  this._finishedValue = undefined;
  this._pauseRequested = false;
  this._mode = "into";
  this._targetDepth = 0;
  this._ops = 0;
  this._memory = 0;
  this._rng = opts.seed === undefined ? 0 : opts.seed;
  this._timestamp = Date.now();
  this._seq = 0;
  this.globals = runtime.debugGlobals(() => this.random());
  this._markHost(this.globals);
  var input = this._prepareScope(scope || {});
  var globalEnv = new Environment(null, "global");
  Object.keys(this.globals).forEach((k) => {
    globalEnv.cells[k] = {
      kind: "builtin",
      value: this.globals[k],
      initialized: true,
    };
  });
  Object.keys(input).forEach((k) => {
    globalEnv.cells[k] = { kind: "scope", value: input[k], initialized: true };
  });
  globalEnv.cells.undefined = {
    kind: "const",
    value: undefined,
    initialized: true,
  };
  this.frames = [];
  this._newFrame(this.program.root, globalEnv, [], undefined, null);
  this._initial = this._capture();
  if (opts.driver)
    this.protocol = new protocol.DebugProtocol(this, opts.driver);
}
Session.prototype = Object.create(Base.prototype);
Session.prototype.constructor = Session;
Session.prototype._markHost = function (v, seen) {
  if (!v || (typeof v !== "object" && typeof v !== "function")) return;
  seen = seen || new Set();
  if (seen.has(v)) return;
  seen.add(v);
  this._hostObjects.add(v);
  if (typeof v !== "function")
    Object.keys(v).forEach((k) => {
      var d = Object.getOwnPropertyDescriptor(v, k);
      if (d && "value" in d) this._markHost(d.value, seen);
    });
};
Session.prototype._prepareScope = function (scope) {
  var self = this,
    seen = new Map();
  function copy(v) {
    if (typeof v === "function") return runtime.sanitize(v);
    if (!v || typeof v !== "object") return v;
    if (self.isNode(v) && self.domContext) {
      var clone = null;
      self._domMap.forEach(function (original, c) {
        if (original === v) clone = c;
      });
      if (!clone) throw new TypeError("DOM capability lies outside debug root");
      var h = self.domContext.context.handleFactory(clone);
      self._markHost(h);
      return h;
    }
    if (resolveHandle(v)) {
      self._markHost(v);
      return v;
    }
    if (seen.has(v)) return seen.get(v);
    if (
      v instanceof Map ||
      v instanceof Set ||
      v instanceof Date ||
      v instanceof RegExp
    ) {
      var special =
        v instanceof Map
          ? new Map()
          : v instanceof Set
            ? new Set()
            : v instanceof Date
              ? new Date(v.getTime())
              : new RegExp(v.source, v.flags);
      seen.set(v, special);
      self._originals.set(special, v);
      self._hostObjects.add(v);
      if (v instanceof Map) v.forEach((x, k) => special.set(copy(k), copy(x)));
      if (v instanceof Set) v.forEach((x) => special.add(copy(x)));
      if (v instanceof RegExp) special.lastIndex = v.lastIndex;
      return special;
    }
    var proto = Object.getPrototypeOf(v);
    if (proto !== null && proto !== Object.prototype && !Array.isArray(v)) {
      self._hostObjects.add(v);
      return v;
    }
    var out = Array.isArray(v) ? [] : Object.create(null);
    seen.set(v, out);
    self._originals.set(out, v);
    self._hostObjects.add(v);
    Object.keys(v).forEach((k) => {
      if (!defs.BLOCKED_PROPS[k]) out[k] = copy(v[k]);
    });
    return out;
  }
  var result = copy(scope);
  if (this.domContext) {
    Object.keys(this.domContext.scope).forEach((k) => {
      if (!(k in result)) {
        result[k] = this.domContext.scope[k];
        self._markHost(result[k]);
      }
    });
  }
  return result;
};
Session.prototype.isNode = function (v) {
  var C =
    this.domRoot &&
    this.domRoot.ownerDocument &&
    this.domRoot.ownerDocument.defaultView &&
    this.domRoot.ownerDocument.defaultView.Node;
  return !!C && v instanceof C;
};
Session.prototype._clone = function (value) {
  var seen = new Map(),
    self = this;
  function clone(v) {
    if (
      v === UNINITIALIZED ||
      v === null ||
      (typeof v !== "object" && typeof v !== "function")
    )
      return v;
    if (self._functionInfo.has(v)) {
      if (seen.has(v)) return seen.get(v);
      var fn = self._makeClosure(self._functionInfo.get(v));
      seen.set(v, fn);
      self._functionInfo.set(fn, clone(self._functionInfo.get(v)));
      return fn;
    }
    if (typeof v === "function") return v;
    if (self._hostObjects.has(v) || self.isNode(v) || resolveHandle(v))
      return v;
    if (seen.has(v)) return seen.get(v);
    if (v instanceof RegExp) {
      var re = new RegExp(v.source, v.flags);
      re.lastIndex = v.lastIndex;
      return re;
    }
    if (v instanceof Date) {
      var date = new Date(v.getTime());
      if (self._originals.has(v))
        self._originals.set(date, self._originals.get(v));
      return date;
    }
    var out;
    if (v instanceof Map) {
      out = new Map();
      if (self._originals.has(v))
        self._originals.set(out, self._originals.get(v));
      seen.set(v, out);
      v.forEach((x, k) => out.set(clone(k), clone(x)));
      return out;
    }
    if (v instanceof Set) {
      out = new Set();
      if (self._originals.has(v))
        self._originals.set(out, self._originals.get(v));
      seen.set(v, out);
      v.forEach((x) => out.add(clone(x)));
      return out;
    }
    out = Array.isArray(v)
      ? new Array(v.length)
      : Object.create(
          Object.getPrototypeOf(v) === Environment.prototype
            ? Environment.prototype
            : null,
        );
    seen.set(v, out);
    if (self._originals.has(v))
      self._originals.set(out, self._originals.get(v));
    Object.keys(v).forEach((k) => {
      if (k === "fn") out[k] = v[k];
      else out[k] = clone(v[k]);
    });
    return out;
  }
  return clone(value);
};
Session.prototype._capture = function () {
  return {
    state: this._clone({
      frames: this.frames,
      rng: this._rng,
      result: this._finishedValue,
      lastLocals: this._lastUserLocals,
      effects: this._effects,
      journal: this.journal.entries(),
      externals: this.journal.externalEntries(),
    }),
    dom: domCapture(this.domRoot),
    version: this.sourceVersion,
    epoch: this.epoch,
    barrier: this._barrier,
  };
};
Session.prototype._restore = function (snap) {
  var x = this._clone(snap.state);
  this.frames = x.frames;
  this._rng = x.rng;
  this._finishedValue = x.result;
  this._lastUserLocals = x.lastLocals;
  this._effects = x.effects || [];
  this.sourceVersion = snap.version;
  this.program = this.versions.get(snap.version);
  this.source = this.program.source;
  this._barrier = snap.barrier;
  domRestore(snap.dom);
  this.journal.clear();
  x.journal.forEach((e) => {
    this.journal.setStepIndex(e.step);
    this.journal.write(e.target, e.key, e.was, e.to);
  });
  (x.externals || []).forEach((e) => this.journal.writeExternal(e));
};
Session.prototype._newFrame = function (id, parent, args, thisValue, returnTo) {
  var fn = this.program.functions[id];
  if (!fn) throw new Error("Missing continuation " + id);
  var env = new Environment(parent, "function");
  fn.vars.forEach(
    (k) =>
      (env.cells[k] = { value: undefined, kind: "var", initialized: true }),
  );
  var f = {
    fn: fn,
    pc: 0,
    env: env,
    rootEnv: env,
    s: [],
    t: Object.create(null),
    args: args,
    thisValue: thisValue,
    handlers: [],
    returnTo: returnTo,
  };
  this.frames.push(f);
  return f;
};
Session.prototype.enter = function (f) {
  f.env = new Environment(f.env, "block");
};
Session.prototype.leave = function (f) {
  if (f.env.parent) f.env = f.env.parent;
};
Session.prototype.iteration = function (f) {
  var next = new Environment(f.env.parent, f.env.kind);
  Object.keys(f.env.cells).forEach(
    (k) => (next.cells[k] = { ...f.env.cells[k] }),
  );
  f.env = next;
};
Session.prototype.declare = function (f, name, kind) {
  if (
    Object.prototype.hasOwnProperty.call(f.env.cells, name) &&
    f.env.cells[name].kind !== "var"
  )
    throw new SyntaxError("Duplicate binding " + name);
  f.env.cells[name] = { value: UNINITIALIZED, kind: kind, initialized: false };
};
Session.prototype.find = function (f, name) {
  for (var e = f.env; e; e = e.parent)
    if (Object.prototype.hasOwnProperty.call(e.cells, name))
      return { cell: e.cells[name], env: e };
  return null;
};
Session.prototype.reference = function (f, name) {
  var b = this.find(f, name);
  if (!b) throw new ReferenceError(name + " is not defined");
  return { binding: b.cell };
};
Session.prototype.get = function (f, name) {
  var r = this.reference(f, name);
  if (!r.binding.initialized)
    throw new ReferenceError(
      "Cannot access " + name + " before initialization",
    );
  return r.binding.value;
};
Session.prototype.typeofName = function (f, name) {
  return this.find(f, name) ? typeof this.get(f, name) : "undefined";
};
Session.prototype.bind = function (f, name, value, kind, declare) {
  var env = kind === "var" ? f.rootEnv : f.env;
  var c;
  if (declare) {
    c = env.cells[name];
    if (!c)
      c = env.cells[name] = {
        kind: kind,
        initialized: false,
        value: UNINITIALIZED,
      };
  } else {
    var found = this.find(f, name);
    if (!found) throw new ReferenceError(name + " is not defined");
    c = found.cell;
  }
  if (c.initialized && c.kind === "const")
    throw new TypeError("Assignment to constant variable " + name);
  c.value = value;
  c.initialized = true;
};
Session.prototype.property = function (o, k, optional) {
  k = String(k);
  if (defs.BLOCKED_PROPS[k] || k === "__original")
    throw new TypeError("SafeScript: blocked property " + k);
  if (o == null && !optional)
    throw new TypeError("Cannot read property " + k + " of " + o);
  return { object: o, key: k, optional: optional };
};
Session.prototype.at = function (o, k) {
  return this.read(this.property(o, k, false));
};
Session.prototype.read = function (r) {
  if (r.binding) {
    if (!r.binding.initialized)
      throw new ReferenceError("Binding not initialized");
    return r.binding.value;
  }
  if (r.object == null && r.optional) return undefined;
  var value = runtime.__at(r.object, r.key);
  if (r.object && resolveHandle(r.object) && value && typeof value === "object")
    this._markHost(value);
  return value;
};
Session.prototype.write = function (r, v) {
  if (r.binding) {
    if (!r.binding.initialized)
      throw new ReferenceError("Binding not initialized");
    if (r.binding.kind === "const")
      throw new TypeError("Cannot assign to read-only binding");
    r.binding.value = v;
    return v;
  }
  return this.set(r.object, r.key, v);
};
Session.prototype.set = function (o, k, v) {
  k = String(k);
  if (defs.BLOCKED_PROPS[k] || k === "__original")
    throw new TypeError("SafeScript: blocked property " + k);
  if (o == null) throw new TypeError("Cannot set property of " + o);
  if (resolveHandle(o)) {
    runtime.__set(o, k, v);
    return v;
  }
  if (this._hostObjects.has(o) && !this._originals.has(o)) {
    this._barrier++;
    this._effects.push({
      kind: "external",
      method: "set " + k,
      barrier: this._barrier,
    });
    runtime.__set(o, k, v);
    return v;
  }
  var target = this._originals.get(o) || o;
  var old = this.journal.has(target, k)
    ? this.journal.read(target, k)
    : target[k];
  this.journal.write(target, k, old, v);
  runtime.__set(o, k, v);
  this._effects.push({ kind: "write", key: k, was: old, to: v });
  return v;
};
Session.prototype.assign = function (o, v) {
  if (v != null)
    Object.keys(v).forEach((k) => {
      if (!defs.BLOCKED_PROPS[k]) runtime.__set(o, k, v[k]);
    });
  return o;
};
Session.prototype.rest = function (o, keys) {
  var v = Object.create(null);
  if (o != null)
    Object.keys(o).forEach((k) => {
      if (keys.indexOf(k) < 0 && !defs.BLOCKED_PROPS[k]) v[k] = this.at(o, k);
    });
  return v;
};
Session.prototype.keys = function (o) {
  var a = [];
  for (var k in o) if (!defs.BLOCKED_PROPS[k]) a.push(k);
  return a;
};
Session.prototype._makeClosure = function (info) {
  var fn = function SafeScriptFunction() {
    throw new TypeError(
      "Resumable callback requires a SafeScript continuation adapter",
    );
  };
  this._functionInfo.set(fn, info);
  var def = this.program.functions[info.id];
  if (def) {
    Object.defineProperty(fn, "name", { value: def.name, configurable: true });
    Object.defineProperty(fn, "length", {
      value: def.params.length,
      configurable: true,
    });
  }
  return fn;
};
Session.prototype.closure = function (f, id, arrow) {
  return this._makeClosure({
    id: id,
    env: f.env,
    arrow: arrow,
    thisValue: arrow ? f.thisValue : undefined,
  });
};
Session.prototype.random = function () {
  var x = this._rng | 0;
  x = (x + 0x6d2b79f5) | 0;
  this._rng = x;
  var t = x;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
Session.prototype.labelScope = function (f, label) {
  return f.fn.scopeDepth[f.fn.labels[label]] || 0;
};
Session.prototype._go = function (f, label, depth) {
  f.pc = f.fn.labels[label];
  var chain = [],
    e = f.env;
  while (e && e !== f.rootEnv) {
    chain.push(e);
    e = e.parent;
  }
  while (chain.length > depth) {
    this.leave(f);
    chain.pop();
  }
};
Session.prototype.abrupt = function (f, signal) {
  while (f.handlers.length) {
    var h = f.handlers[f.handlers.length - 1];
    if (signal.kind === "jump") {
      var pc = f.fn.labels[signal.target],
        end = f.fn.labels[h.end];
      if (pc >= h.start && pc < end) {
        this._go(f, signal.target, signal.scope);
        return;
      }
    }
    f.env = h.env;
    f.s.length = h.depth;
    if (signal.kind === "throw" && h.status === "try" && h.catchLabel) {
      h.status = "catch";
      f.exception = runtime.debugStripError(signal.value);
      f.pc = f.fn.labels[h.catchLabel];
      return;
    }
    if (h.finallyLabel && h.status !== "finally") {
      h.status = "finally";
      h.pending = signal;
      f.pc = f.fn.labels[h.finallyLabel];
      return;
    }
    f.handlers.pop();
  }
  if (signal.kind === "jump") {
    this._go(f, signal.target, signal.scope);
    return;
  }
  if (
    signal.kind === "return" &&
    (f.fn.id !== this.program.root || !this._lastUserLocals)
  )
    this._lastUserLocals = this._clone(this.getLocals());
  this.frames.pop();
  if (signal.kind === "throw") {
    if (this.frames.length)
      delete this.frames[this.frames.length - 1].arrayPending;
    if (this.frames.length)
      this.abrupt(this.frames[this.frames.length - 1], signal);
    else throw signal.value;
    return;
  }
  if (this.frames.length)
    this.frames[this.frames.length - 1].s.push(signal.value);
  else this._finishedValue = signal.value;
};
Session.prototype.completeTry = function (f) {
  var h = f.handlers[f.handlers.length - 1];
  f.env = h.env;
  f.s.length = h.depth;
  if (h.finallyLabel) {
    h.status = "finally";
    h.pending = null;
    f.pc = f.fn.labels[h.finallyLabel];
  } else {
    f.handlers.pop();
    f.pc = f.fn.labels[h.end];
  }
};
Session.prototype.endFinally = function (f) {
  var h = f.handlers.pop();
  f.env = h.env;
  if (h.pending) this.abrupt(f, h.pending);
  else f.pc = f.fn.labels[h.end];
};
Session.prototype._isPure = function (o, key, fn) {
  if (
    this.options.pureCalls &&
    (this.options.pureCalls.indexOf(fn) >= 0 ||
      this.options.pureCalls.indexOf(fn.__original) >= 0)
  )
    return true;
  if (
    o === this.globals.Math ||
    o === this.globals.JSON ||
    o === this.globals.Object ||
    o === this.globals.Array
  )
    return true;
  if (o == null) return Object.values(this.globals).indexOf(fn) >= 0;
  return (
    typeof o === "string" ||
    typeof o === "number" ||
    Array.isArray(o) ||
    o instanceof RegExp ||
    o instanceof Map ||
    o instanceof Set ||
    o instanceof Date ||
    resolveHandle(o) ||
    (this.domContext &&
      this._hostObjects.has(o) &&
      Object.values(this.domContext.scope).indexOf(o) >= 0)
  );
};
Session.prototype.invoke = function (f, callee, args, isNew) {
  var receiver,
    fn = callee,
    key;
  if (
    callee &&
    Object.prototype.hasOwnProperty.call(callee, "object") &&
    Object.prototype.hasOwnProperty.call(callee, "key")
  ) {
    receiver = callee.object;
    key = callee.key;
    if (receiver == null && callee.optional) {
      f.s.push(undefined);
      return;
    }
    fn = this.read(callee);
  }
  if (
    receiver &&
    this._functionInfo.has(receiver) &&
    ["call", "apply", "bind"].indexOf(key) >= 0
  ) {
    var bound = this._functionInfo.get(receiver);
    if (key === "bind") {
      f.s.push(
        this._makeClosure(
          Object.assign({}, bound, {
            boundThis: args[0],
            boundArgs: args.slice(1),
          }),
        ),
      );
      return;
    }
    fn = receiver;
    receiver = args[0];
    args = key === "apply" ? Array.from(args[1] || []) : args.slice(1);
  }
  if (fn && this._functionInfo.has(fn)) {
    if (isNew) throw new TypeError("SafeScript functions are not constructors");
    var info = this._functionInfo.get(fn);
    this._newFrame(
      info.id,
      info.env,
      (info.boundArgs || []).concat(args),
      info.arrow
        ? info.thisValue
        : "boundThis" in info
          ? info.boundThis
          : receiver,
      f.fn.id,
    );
    return;
  }
  if (
    Array.isArray(receiver) &&
    [
      "map",
      "filter",
      "forEach",
      "reduce",
      "some",
      "every",
      "find",
      "findIndex",
      "flatMap",
    ].indexOf(key) >= 0 &&
    args[0] &&
    this._functionInfo.has(args[0])
  ) {
    this._arrayCall(f, receiver, key, args);
    return;
  }
  if (
    args.some((a) => a && this._functionInfo.has(a)) &&
    !(
      Array.isArray(receiver) &&
      [
        "push",
        "unshift",
        "splice",
        "concat",
        "fill",
        "includes",
        "indexOf",
        "lastIndexOf",
      ].indexOf(key) >= 0
    )
  )
    throw new TypeError(
      "Passing a resumable callback to an opaque host method requires an explicit callback adapter",
    );
  if (typeof fn !== "function")
    throw new TypeError(String(key || "value") + " is not a function");
  this._effects.push({
    kind: "call",
    method: key || fn.name || "call",
    args: this._clone(args),
  });
  var pure = this._isPure(receiver, key, fn);
  if (!pure) {
    this._barrier++;
    this._effects.push({
      kind: "external",
      method: key || fn.name || "host call",
      barrier: this._barrier,
    });
  }
  var specialBefore =
    receiver instanceof Map
      ? Array.from(receiver.entries())
      : receiver instanceof Set
        ? Array.from(receiver)
        : receiver instanceof Date
          ? receiver.getTime()
          : null;
  var arrayBefore =
    Array.isArray(receiver) &&
    [
      "push",
      "pop",
      "shift",
      "unshift",
      "splice",
      "reverse",
      "sort",
      "fill",
      "copyWithin",
    ].indexOf(key) >= 0
      ? receiver.slice()
      : null;
  var v = isNew
    ? runtime.debugNew(fn, args, this.options.allowNew)
    : receiver !== undefined
      ? runtime.__call.apply(null, [receiver, key].concat(args))
      : fn.apply(undefined, args);
  if (receiver instanceof Map && ["set", "delete", "clear"].includes(key))
    this.journal.write(
      this._originals.get(receiver) || receiver,
      "map:state",
      specialBefore,
      Array.from(receiver.entries()),
    );
  if (receiver instanceof Set && ["add", "delete", "clear"].includes(key))
    this.journal.write(
      this._originals.get(receiver) || receiver,
      "set:state",
      specialBefore,
      Array.from(receiver),
    );
  if (receiver instanceof Date && key.startsWith("set"))
    this.journal.write(
      this._originals.get(receiver) || receiver,
      "date:value",
      specialBefore,
      receiver.getTime(),
    );
  if (arrayBefore) {
    var target = this._originals.get(receiver) || receiver;
    for (var ix = 0; ix < Math.max(arrayBefore.length, receiver.length); ix++)
      if (arrayBefore[ix] !== receiver[ix])
        this.journal.write(target, String(ix), arrayBefore[ix], receiver[ix]);
    if (arrayBefore.length !== receiver.length)
      this.journal.write(target, "length", arrayBefore.length, receiver.length);
  }
  var adopt = (value) => {
    if (
      !pure &&
      value &&
      (typeof value === "object" || typeof value === "function")
    )
      return this._prepareScope({ value: value }).value;
    return value;
  };
  if (v && typeof v.then === "function")
    return Promise.resolve(v).then((value) => {
      f.s.push(adopt(value));
    });
  f.s.push(adopt(v));
};
Session.prototype._arrayCall = function (f, array, method, args) {
  var callback = args[0],
    length = array.length,
    result = method === "reduce" ? (args.length > 1 ? args[1] : array[0]) : [],
    start = method === "reduce" && args.length < 2 ? 1 : 0;
  if (method === "reduce" && length === 0 && args.length < 2)
    throw new TypeError("Reduce of empty array with no initial value");
  var state = {
    array: array,
    method: method,
    args: args,
    index: start,
    length: length,
    result: result,
    callback: callback,
  };
  this._arrayNext(f, state);
};
Session.prototype._arrayNext = function (f, a) {
  while (a.index < a.length && !(a.index in a.array)) a.index++;
  if (a.index >= a.length) {
    f.s.push(
      a.method === "forEach"
        ? undefined
        : a.method === "some"
          ? false
          : a.method === "every"
            ? true
            : a.method === "find"
              ? undefined
              : a.method === "findIndex"
                ? -1
                : a.result,
    );
    return;
  }
  var i = a.index++,
    params =
      a.method === "reduce"
        ? [a.result, a.array[i], i, a.array]
        : [a.array[i], i, a.array];
  f.arrayPending = a;
  var info = this._functionInfo.get(a.callback);
  this._newFrame(
    info.id,
    info.env,
    params,
    info.arrow ? info.thisValue : a.args[1],
    f.fn.id,
  );
};
Session.prototype._arrayReturn = function (f) {
  var a = f.arrayPending;
  if (!a) return;
  delete f.arrayPending;
  var v = f.s.pop(),
    i = a.index - 1;
  if (a.method === "map") a.result[i] = v;
  else if (a.method === "flatMap")
    a.result.push(...(Array.isArray(v) ? v : [v]));
  else if (a.method === "filter" && v) a.result.push(a.array[i]);
  else if (a.method === "reduce") a.result = v;
  else if (a.method === "some" && v) {
    f.s.push(true);
    return;
  } else if (a.method === "every" && !v) {
    f.s.push(false);
    return;
  } else if ((a.method === "find" || a.method === "findIndex") && v) {
    f.s.push(a.method === "find" ? a.array[i] : i);
    return;
  }
  this._arrayNext(f, a);
};
Session.prototype.getLocals = function () {
  var f = this.frames[this.frames.length - 1];
  if (!f)
    return Object.assign(
      Object.create(null),
      this._lastUserLocals || this.currentLocals || {},
      { returnValue: this._finishedValue },
    );
  var out = Object.create(null);
  for (var e = f.env; e && e.kind !== "global"; e = e.parent)
    Object.keys(e.cells).forEach((k) => {
      if (!(k in out) && e.cells[k].initialized) out[k] = e.cells[k].value;
    });
  return out;
};
Session.prototype.callDepth = function () {
  return Math.max(0, this.frames.length - 1);
};
Session.prototype._path = function (id) {
  var a = [];
  while (id) {
    var n = this.nodes.get(id);
    if (!n) break;
    a.push(n);
    id = n.parentId;
  }
  return a.reverse();
};
Session.prototype._snapshotBytes = function (v, seen) {
  if (v === null || v === undefined) return 0;
  if (typeof v === "string") return v.length * 2 + 16;
  if (typeof v !== "object" && typeof v !== "function") return 8;
  if (this._hostObjects.has(v) || this.isNode(v)) return 8;
  seen = seen || new Set();
  if (seen.has(v)) return 8;
  seen.add(v);
  if (this._functionInfo.has(v))
    return 32 + this._snapshotBytes(this._functionInfo.get(v).env, seen);
  var n = 64;
  if (v instanceof Map) {
    v.forEach((x, k) => {
      n += this._snapshotBytes(k, seen) + this._snapshotBytes(x, seen);
    });
    return n;
  }
  if (v instanceof Set) {
    v.forEach((x) => (n += this._snapshotBytes(x, seen)));
    return n;
  }
  Object.keys(v).forEach((k) => {
    if (k !== "fn") n += k.length * 2 + this._snapshotBytes(v[k], seen);
  });
  return n;
};
Session.prototype._record = function (line, phase, nodeId, label) {
  if (this.nodes.size >= (this.options.maxCheckpoints || 4096))
    throw new Error("SafeScript: checkpoint history limit exceeded");
  var id = this.nextId++,
    parent = this.currentNodeId,
    n = {
      id: id,
      parentId: parent,
      children: [],
      line: line,
      phase: phase,
      nodeId: nodeId,
      label: label || "",
      version: this.sourceVersion,
      depth: this.callDepth(),
      locals: this._clone(this.getLocals()),
      effects: this._clone(this._effects.splice(0)),
      journalCursor: this.journal.entries().length,
    };
  if (parent) {
    this.nodes.get(parent).children.push(id);
    this._preferred.set(parent, id);
  }
  this.nodes.set(id, n);
  this.currentNodeId = id;
  this.currentLine = line;
  this.currentLocals = n.locals;
  n.snapshot = this._capture();
  this._memory += this._snapshotBytes(n.snapshot.state);
  if (
    this._memory >
    Math.min(this.options.maxMemory || runtime.MAX_MEMORY, runtime.MAX_MEMORY)
  )
    throw new Error("SafeScript: debug snapshot memory limit exceeded");
  this.history = this._path(id).map((x) => ({
    index: x.id,
    line: x.line,
    phase: x.phase,
    locals: x.locals,
    effects: x.effects,
    nodeId: x.nodeId,
    depth: x.depth,
    id: x.id,
  }));
  this.onStep(this.history[this.history.length - 1]);
  return n;
};
Session.prototype.checkpoint = function (f, nodeId, line, phase) {
  this.journal.setStepIndex(this._seq++);
  this.currentLine = line;
  var n = this._record(line, phase, nodeId);
  var active = this.pauseOn === "both" || this.pauseOn === phase;
  var should =
    active &&
    (this._mode === "into" ||
      (this._mode === "over" && this.callDepth() <= this._targetDepth) ||
      (this._mode === "out" && this.callDepth() < this._targetDepth) ||
      (this.breakpoints[line] &&
        this._checkCondition(line, () => this.getLocals())));
  if (phase === "before" && this._logpoints[line] && this.onLog)
    this.onLog({
      line: line,
      message: this._evaluateLogpoint(this._logpoints[line], () =>
        this.getLocals(),
      ),
      step: n.id,
    });
  if (should) {
    if (this._oneShotLine === line) {
      delete this.breakpoints[line];
      delete this._oneShotLine;
    }
    this._pauseRequested = true;
  }
};
Session.prototype._pause = function (extra) {
  this.state = "paused";
  this.currentLocals = this._clone(this.getLocals());
  var n = this.nodes.get(this.currentNodeId);
  this.resume = () => {};
  this.onPause(
    Object.assign(
      {
        line: this.currentLine,
        locals: this.currentLocals,
        phase: n && n.phase,
        checkpointId: this.currentNodeId,
        depth: this.callDepth(),
      },
      extra,
    ),
  );
};
Session.prototype._pump = async function () {
  if (this._busy) return;
  this._busy = true;
  var generation = this._generation;
  this.state = "running";
  this.resume = null;
  var began = Date.now();
  try {
    while (this.frames.length && generation === this._generation) {
      if (this.replacement) {
        var replacement = this.replacement;
        this.replacement = null;
        var returned = await replacement(this.getLocals());
        this.abrupt(this.frames[this.frames.length - 1], {
          kind: "return",
          value: returned,
        });
        continue;
      }
      if (
        ++this._ops > Math.min(this.options.maxOps || 100000, runtime.MAX_OPS)
      )
        throw new Error("SafeScript: max operations exceeded");
      if (
        Date.now() - began >
        Math.min(this.options.timeout || 10000, runtime.MAX_TIMEOUT)
      )
        throw new Error("SafeScript: execution timed out");
      var f = this.frames[this.frames.length - 1];
      if (f.arrayPending) {
        this._arrayReturn(f);
        continue;
      }
      if (this.domContext) {
        var adapter = require("./dom/dom-journal").attachDOMJournal;
        adapter(this.domContext.context, this.journal, this._effects);
      }
      var instruction = f.fn.code[f.pc++];
      if (!instruction) {
        this.abrupt(f, { kind: "return", value: undefined });
        continue;
      }
      // Mark active exception regions after their entry operation.
      try {
        var p = instruction.run(this, f);
        if (f.handlers.length) {
          var h = f.handlers[f.handlers.length - 1];
          if (h.start === undefined) h.start = f.pc;
        }
        if (p && typeof p.then === "function") await p;
      } catch (e) {
        this.abrupt(f, { kind: "throw", value: e });
      }
      if (generation !== this._generation) return;
      if (this._pauseRequested) {
        this._pauseRequested = false;
        this._busy = false;
        this._pause();
        return;
      }
      if (this._ops % 400 === 0) await new Promise((r) => setTimeout(r, 0));
    }
    if (generation !== this._generation) return;
    this._busy = false;
    this.state = "finished";
    this.resume = null;
    this._record(this.currentLine, "complete", null, "Finished");
    this.onFinish(this._finishedValue);
  } catch (e) {
    this._busy = false;
    if (generation !== this._generation) return;
    this.state = "finished";
    this.resume = null;
    this.onError(e instanceof Error ? e : new Error(String(e)));
  }
};
Session.prototype.start = function () {
  this._pump();
  return this;
};
Session.prototype._run = function (mode) {
  if (this.state !== "paused") return;
  if (this.epoch !== this._commitClock.value)
    throw new Error(
      "Another branch committed; start a new session against committed state",
    );
  this._mode = mode;
  this._targetDepth = this.callDepth();
  this._pump();
};
Session.prototype.step = function () {
  this._run("into");
};
Session.prototype.stepOver = function () {
  this._run("over");
};
Session.prototype.stepOut = function () {
  this._run("out");
};
Session.prototype.continue = function () {
  this._run("continue");
};
Session.prototype.stop = function () {
  this._generation++;
  this.state = "finished";
  this.resume = null;
  this._busy = false;
};
Session.prototype.seek = function (id) {
  if (this._busy) throw new Error("Pause before seeking");
  var n = this.nodes.get(Number(id));
  if (!n) throw new RangeError("Unknown checkpoint");
  if (n.snapshot.epoch !== this._commitClock.value)
    throw new Error("Cannot cross a committed-state boundary");
  if (n.snapshot.barrier !== this._barrier)
    throw new Error(
      "Cannot rewind across an external operation without a replay adapter",
    );
  this._restore(n.snapshot);
  this.currentNodeId = n.id;
  this.currentLine = n.line;
  this.history = this._path(n.id).map((x) => ({
    index: x.id,
    line: x.line,
    phase: x.phase,
    locals: x.locals,
    effects: x.effects,
    id: x.id,
    depth: x.depth,
  }));
  this._pause({ rewound: true });
  return true;
};
Session.prototype.rewindTo = function (index) {
  var h = this.history[index];
  if (h) return this.seek(h.id);
};
Session.prototype.setLocal = function (name, value) {
  if (this.state !== "paused") throw new Error("Pause before editing a local");
  var f = this.frames[this.frames.length - 1];
  if (!f) throw new Error("No live frame");
  this.write(this.reference(f, name), value);
  var n = this.nodes.get(this.currentNodeId);
  this._record(this.currentLine, n.phase, n.nodeId, "Set " + name);
  this._pause({ edited: true });
  return value;
};
Session.prototype.evaluate = function (expression) {
  if (this.state !== "paused")
    throw new Error("SafeScript: can only evaluate while paused");
  var ast = require("./parse").parse("return (" + expression + ");");
  var valid = require("./validate").validate(ast);
  if (!valid.ok)
    throw new SyntaxError(valid.errors.map((x) => x.message).join("; "));
  var n = ast.body[0].argument;
  var evalNode = (x) => {
    if (!x) return undefined;
    switch (x.type) {
      case "Literal":
        return x.value;
      case "Identifier":
        return this.get(this.frames[this.frames.length - 1], x.name);
      case "MemberExpression":
        return this.at(
          evalNode(x.object),
          x.computed ? evalNode(x.property) : x.property.name,
        );
      case "UnaryExpression":
        return new Function("v", "return " + x.operator + " v")(
          evalNode(x.argument),
        );
      case "BinaryExpression":
        return new Function("a", "b", "return a " + x.operator + " b")(
          evalNode(x.left),
          evalNode(x.right),
        );
      case "LogicalExpression":
        var a = evalNode(x.left);
        return x.operator === "&&"
          ? a && evalNode(x.right)
          : x.operator === "||"
            ? a || evalNode(x.right)
            : a == null
              ? evalNode(x.right)
              : a;
      case "ConditionalExpression":
        return evalNode(x.test)
          ? evalNode(x.consequent)
          : evalNode(x.alternate);
      case "AssignmentExpression":
        if (x.left.type === "Identifier" && x.operator === "=")
          return this.setLocal(x.left.name, evalNode(x.right));
        throw new Error("Use setLocal for binding edits");
      default:
        throw new Error(
          "Watch expressions cannot call functions or mutate objects",
        );
    }
  };
  return evalNode(n);
};
Session.prototype.editAndContinue = function (source) {
  if (this.state !== "paused")
    throw new Error("SafeScript: can only edit-and-continue while paused");
  try {
    if (!this.frames.length)
      throw new Error(
        "Select a checkpoint with a live frame before editing code",
      );
    var next = compiler.compile(source, this.program),
      data = this._clone({ frames: this.frames });
    data.frames.forEach((f) => {
      var target = next.functions[f.fn.id];
      if (!target)
        throw new Error("Active function was deleted or changed ambiguously");
      if (
        JSON.stringify(target.params, (k, v) =>
          k === "loc" || k === "_cid" ? undefined : v,
        ) !==
        JSON.stringify(f.fn.params, (k, v) =>
          k === "loc" || k === "_cid" ? undefined : v,
        )
      )
        throw new Error("Cannot change parameters of an active function");
      var old = f.fn.code[f.pc];
      var selected = this.nodes.get(this.currentNodeId);
      var checkpoint =
        f === data.frames[data.frames.length - 1] && selected && selected.nodeId
          ? selected.nodeId + ":" + selected.phase + ":0"
          : null;
      if (checkpoint && target.ids[checkpoint] !== undefined)
        f.pc = target.ids[checkpoint] + 1;
      else {
        if (old && target.ids[old.id] === undefined)
          throw new Error(
            "Edit changes the active continuation; move the pause or restart",
          );
        f.pc = old ? target.ids[old.id] : target.code.length;
      }
      f.fn = target;
    });
    var old = this.program;
    var visit = (v, seen) => {
      if (
        !v ||
        (typeof v !== "object" && typeof v !== "function") ||
        this._hostObjects.has(v) ||
        this.isNode(v) ||
        seen.has(v)
      )
        return;
      seen.add(v);
      if (this._functionInfo.has(v)) {
        var info = this._functionInfo.get(v);
        if (!next.functions[info.id])
          throw new Error("Cannot delete a captured function");
        visit(info.env, seen);
        return;
      }
      Object.keys(v).forEach((k) => {
        if (k !== "fn") visit(v[k], seen);
      });
    };
    visit(data, new Set());
    this.program = next;
    this.source = source;
    this.sourceVersion = Math.max(...this.versions.keys()) + 1;
    this.versions.set(this.sourceVersion, next);
    this.frames = data.frames;
    var n = this.nodes.get(this.currentNodeId);
    this._record(
      this.currentLine,
      n.phase,
      n.nodeId,
      "Code edited · v" + this.sourceVersion,
    );
    this.lastEditError = null;
    this._pause({ edited: true });
    return true;
  } catch (e) {
    this.lastEditError = e.message;
    e.editRejected = true;
    if (this.options.onEditError) this.options.onEditError(e);
    this.onError(e);
    this.state = "paused";
    return false;
  }
};
Session.prototype.fork = function () {
  if (this.state !== "paused" && this.state !== "finished")
    throw new Error("Pause before forking");
  var child = new Session(
    this.source,
    {},
    Object.assign({}, this.options, { driver: null }),
    this,
  );
  child.nodes = new Map(
    Array.from(this.nodes, ([id, n]) => [
      id,
      Object.assign({}, n, { children: n.children.slice() }),
    ]),
  );
  child.nextId = this.nextId;
  child.versions = new Map(this.versions);
  child._restore(this._capture());
  var envSeen = new Set(),
    parentGlobals = this.globals;
  function rebind(e) {
    if (!e || envSeen.has(e)) return;
    envSeen.add(e);
    if (e.kind === "global")
      Object.keys(child.globals).forEach((k) => {
        if (
          e.cells[k] &&
          e.cells[k].kind === "builtin" &&
          e.cells[k].value === parentGlobals[k]
        )
          e.cells[k].value = child.globals[k];
      });
    rebind(e.parent);
  }
  child.frames.forEach((f) => rebind(f.env));
  child.currentNodeId = this.currentNodeId;
  child.currentLine = this.currentLine;
  child.history = this._clone(this.history);
  child.breakpoints = Object.assign({}, this.breakpoints);
  child._breakpointConditions = Object.assign({}, this._breakpointConditions);
  child._logpoints = Object.assign({}, this._logpoints);
  child._preferred = new Map(this._preferred);
  child.state = "paused";
  child.currentLocals = child._clone(child.getLocals());
  child._callDepth = this.callDepth();
  return child;
};
Session.prototype.getTimeline = function () {
  var selected = this.currentNodeId,
    path = this._path(selected),
    n = this.nodes.get(selected);
  while (n && n.children.length) {
    var id = this._preferred.get(n.id) || n.children[n.children.length - 1];
    n = this.nodes.get(id);
    path.push(n);
  }
  return {
    currentId: selected,
    path: path.map((n) => ({
      id: n.id,
      parentId: n.parentId,
      children: n.children.slice(),
      line: n.line,
      phase: n.phase,
      label: n.label,
      version: n.version,
      depth: n.depth,
      locals: n.locals,
      effects: n.effects,
      locked:
        n.snapshot.barrier !== this._barrier || n.snapshot.epoch !== this.epoch,
    })),
    nodes: Array.from(this.nodes.values()).map((n) => ({
      id: n.id,
      parentId: n.parentId,
      children: n.children.slice(),
      line: n.line,
      phase: n.phase,
      label: n.label,
      depth: n.depth,
      version: n.version,
      result: n.phase === "complete" ? n.snapshot.state.result : undefined,
      locked:
        n.snapshot.barrier !== this._barrier || n.snapshot.epoch !== this.epoch,
    })),
  };
};
Session.prototype.projectDOM = function () {
  if (!this.domRoot) return null;
  var copy = this.domRoot.cloneNode(true),
    map = new Map();
  function pair(a, b) {
    map.set(a, b);
    for (var i = 0; i < a.childNodes.length; i++)
      pair(a.childNodes[i], b.childNodes[i]);
  }
  pair(this.domRoot, copy);
  this.journal.entries().forEach((e) => {
    var target = map.get(e.target);
    if (target) Journal.applyEntry(target, e.key, e.to);
  });
  return copy;
};
Session.prototype.commit = function () {
  if (this._busy) throw new Error("Pause before committing");
  var entries = this.journal.entries(),
    writes = 0;
  entries.forEach((e) => {
    Journal.applyEntry(e.target, e.key, e.to);
    writes++;
  });
  if (this.domRoot && this._domOriginal) {
    var morph = (real, wanted) => {
      if (wanted.nodeType === 3) {
        real.data = wanted.data;
        return;
      }
      if (real.attributes) {
        Array.from(real.attributes).forEach((a) => {
          if (!wanted.hasAttribute(a.name)) real.removeAttribute(a.name);
        });
        Array.from(wanted.attributes).forEach((a) =>
          real.setAttribute(a.name, a.value),
        );
        if ("value" in real) real.value = wanted.value;
        if ("checked" in real) real.checked = wanted.checked;
      }
      var desired = Array.from(wanted.childNodes),
        kept = new Set();
      desired.forEach((c, i) => {
        var r = this._domMap.get(c);
        if (!r || r.nodeType !== c.nodeType || r.nodeName !== c.nodeName) {
          r = c.cloneNode(false);
          this._domMap.set(c, r);
        }
        if (real.childNodes[i] !== r)
          real.insertBefore(r, real.childNodes[i] || null);
        kept.add(r);
        morph(r, c);
      });
      Array.from(real.childNodes).forEach((c) => {
        if (!kept.has(c)) real.removeChild(c);
      });
    };
    morph(this._domOriginal, this.domRoot);
    this._domInitial = domCapture(this.domRoot);
  }
  var result = { writes: writes, externals: this.journal.externalEntries() };
  this.journal.clear();
  this.epoch = ++this._commitClock.value;
  if (this.onCommit) this.onCommit(result);
  var n = this.nodes.get(this.currentNodeId);
  if (n) this._record(this.currentLine, n.phase, n.nodeId, "Committed");
  return result;
};
Session.prototype.discard = function () {
  if (this._busy) throw new Error("Pause before discarding");
  this.journal.clear();
  domRestore(this._domInitial);
  var n = this.nodes.get(this.currentNodeId);
  if (n) this._record(this.currentLine, n.phase, n.nodeId, "Discarded effects");
};
Session.prototype.serialize = function () {
  var basic = Base.prototype.serialize.call(this);
  basic.engine = "continuations";
  basic.source = this.source;
  basic.note =
    "Inspection export; executable restoration requires capability rebinding and continuation graph import.";
  return basic;
};
exports.Session = Session;
exports.debug = function (source, scope, opts) {
  return new Session(source, scope, opts).start();
};
