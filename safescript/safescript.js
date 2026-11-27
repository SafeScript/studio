"use strict";
var SafeScript = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // safescript-upstream/src/defs.js
  var require_defs = __commonJS({
    "safescript-upstream/src/defs.js"(exports) {
      "use strict";
      var BLOCKED = /* @__PURE__ */ Object.create(null);
      [
        // Prototype chain
        "constructor",
        "__proto__",
        "prototype",
        "__defineGetter__",
        "__defineSetter__",
        "__lookupGetter__",
        "__lookupSetter__",
        // Self-reference, stack walking
        "arguments",
        "callee",
        "caller",
        // Internal runtime identifiers (must not be shadowed by user code)
        "__safeThis",
        "__thisCell",
        "__safeGlobals",
        // Code generation
        "eval",
        "Function",
        // Browser globals
        "globalThis",
        "window",
        "document",
        "navigator",
        "self",
        "top",
        "parent",
        "frames",
        "location",
        "history",
        // Metaprogramming
        "Proxy",
        "Reflect",
        "Symbol",
        // Network
        "fetch",
        "XMLHttpRequest",
        "WebSocket",
        "EventSource",
        // Timers
        "setTimeout",
        "setInterval",
        "requestAnimationFrame",
        // Node.js
        "require",
        "module",
        "exports",
        "process",
        "global",
        "Buffer",
        "__filename",
        "__dirname"
      ].forEach(function(k) {
        BLOCKED[k] = 1;
      });
      var BLOCKED_KW = /* @__PURE__ */ Object.create(null);
      [
        "delete",
        "class",
        "extends",
        "super",
        "with",
        "import",
        "export",
        "debugger",
        "yield",
        "async",
        "await"
      ].forEach(function(k) {
        BLOCKED_KW[k] = 1;
      });
      var ALLOWED_KW = /* @__PURE__ */ Object.create(null);
      [
        "var",
        "let",
        "const",
        "if",
        "else",
        "for",
        "while",
        "do",
        "break",
        "continue",
        "return",
        "function",
        "try",
        "catch",
        "finally",
        "throw",
        "switch",
        "case",
        "default",
        "typeof",
        "void",
        "in",
        "of",
        "new",
        "true",
        "false",
        "null",
        "undefined",
        "instanceof",
        "this"
      ].forEach(function(k) {
        ALLOWED_KW[k] = 1;
      });
      var BLOCKED_PROPS = /* @__PURE__ */ Object.create(null);
      [
        "constructor",
        "__proto__",
        "prototype",
        "__defineGetter__",
        "__defineSetter__",
        "__lookupGetter__",
        "__lookupSetter__",
        "caller",
        "callee",
        "arguments"
      ].forEach(function(k) {
        BLOCKED_PROPS[k] = 1;
      });
      var SHADOW_STATIC = [
        "Object",
        "Array",
        "String",
        "Number",
        "Boolean",
        "BigInt",
        "Function",
        "Symbol",
        "Error",
        "TypeError",
        "RangeError",
        "SyntaxError",
        "ReferenceError",
        "EvalError",
        "URIError",
        "AggregateError",
        "Map",
        "Set",
        "WeakMap",
        "WeakSet",
        "WeakRef",
        "FinalizationRegistry",
        "Date",
        "RegExp",
        "Promise",
        "JSON",
        "Math",
        "Intl",
        "ArrayBuffer",
        "SharedArrayBuffer",
        "DataView",
        "Atomics",
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Uint16Array",
        "Int32Array",
        "Uint32Array",
        "Float32Array",
        "Float64Array",
        "BigInt64Array",
        "BigUint64Array",
        "Proxy",
        "Reflect",
        "eval",
        "Function",
        "globalThis",
        "window",
        "self",
        "top",
        "parent",
        "frames",
        "global",
        "document",
        "navigator",
        "location",
        "history",
        "screen",
        "localStorage",
        "sessionStorage",
        "indexedDB",
        "alert",
        "confirm",
        "prompt",
        "print",
        "open",
        "close",
        "focus",
        "blur",
        "postMessage",
        "addEventListener",
        "removeEventListener",
        "dispatchEvent",
        "CustomEvent",
        "Event",
        "MutationObserver",
        "ResizeObserver",
        "IntersectionObserver",
        "Element",
        "HTMLElement",
        "Node",
        "NodeList",
        "DocumentFragment",
        "DOMParser",
        "XMLSerializer",
        "getComputedStyle",
        "matchMedia",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "fetch",
        "XMLHttpRequest",
        "WebSocket",
        "EventSource",
        "Request",
        "Response",
        "Headers",
        "URL",
        "URLSearchParams",
        "setTimeout",
        "setInterval",
        "setImmediate",
        "clearTimeout",
        "clearInterval",
        "clearImmediate",
        "queueMicrotask",
        "structuredClone",
        "Worker",
        "SharedWorker",
        "Blob",
        "File",
        "FileReader",
        "FileList",
        "FormData",
        "TextEncoder",
        "TextDecoder",
        "atob",
        "btoa",
        "encodeURI",
        "decodeURI",
        "encodeURIComponent",
        "decodeURIComponent",
        "escape",
        "unescape",
        "crypto",
        "performance",
        "Notification",
        "BroadcastChannel",
        "MessageChannel",
        "MessagePort",
        "AbortController",
        "AbortSignal",
        "isNaN",
        "isFinite",
        "parseInt",
        "parseFloat",
        "NaN",
        "Infinity",
        "require",
        "module",
        "exports",
        "__filename",
        "__dirname",
        "process",
        "Buffer",
        "console",
        "constructor",
        "__proto__",
        "prototype"
      ];
      exports.BLOCKED = BLOCKED;
      exports.BLOCKED_KW = BLOCKED_KW;
      exports.ALLOWED_KW = ALLOWED_KW;
      exports.BLOCKED_PROPS = BLOCKED_PROPS;
      exports.SHADOW_STATIC = SHADOW_STATIC;
    }
  });

  // safescript-upstream/src/parse.js
  var require_parse = __commonJS({
    "safescript-upstream/src/parse.js"(exports) {
      "use strict";
      var defs = require_defs();
      var TT = {
        Ident: "Ident",
        Number: "Number",
        String: "String",
        Regex: "Regex",
        Template: "Template",
        Keyword: "Keyword",
        Punct: "Punct",
        EOF: "EOF"
      };
      var SIMPLE_ESCAPES = {
        "b": "\b",
        "f": "\f",
        "n": "\n",
        "r": "\r",
        "t": "	",
        "v": "\v",
        "0": "\0",
        "'": "'",
        '"': '"',
        "\\": "\\"
      };
      function unescapeString(raw) {
        var quote = raw[0];
        var inner = raw.slice(1, -1);
        var out = "";
        var i = 0;
        while (i < inner.length) {
          if (inner[i] !== "\\") {
            out += inner[i++];
            continue;
          }
          i++;
          if (i >= inner.length) {
            out += "\\";
            break;
          }
          var ch = inner[i];
          if (ch in SIMPLE_ESCAPES) {
            out += SIMPLE_ESCAPES[ch];
            i++;
            continue;
          }
          if (ch === "x") {
            var hex = inner.slice(i + 1, i + 3);
            out += String.fromCharCode(parseInt(hex, 16));
            i += 3;
            continue;
          }
          if (ch === "u") {
            if (inner[i + 1] === "{") {
              var close = inner.indexOf("}", i + 2);
              var cp = parseInt(inner.slice(i + 2, close), 16);
              out += String.fromCodePoint(cp);
              i = close + 1;
            } else {
              var u4 = inner.slice(i + 1, i + 5);
              out += String.fromCharCode(parseInt(u4, 16));
              i += 5;
            }
            continue;
          }
          if (ch === "\n") {
            i++;
            continue;
          }
          if (ch === "\r") {
            i++;
            if (i < inner.length && inner[i] === "\n") i++;
            continue;
          }
          out += ch;
          i++;
        }
        return out;
      }
      function Tokenizer(source) {
        this.source = source;
        this.pos = 0;
        this.line = 1;
        this.lineStart = 0;
        this.tokens = [];
        this.index = 0;
        this._tokenize();
      }
      Tokenizer.prototype._col = function() {
        return this.pos - this.lineStart + 1;
      };
      Tokenizer.prototype._error = function(msg, line, col) {
        var e = new SyntaxError("SafeScript: " + msg + " at line " + line + ":" + col);
        e.line = line;
        e.col = col;
        throw e;
      };
      Tokenizer.prototype._push = function(type, value, line, col) {
        this.tokens.push({ type, value, line, col });
      };
      Tokenizer.prototype._tokenize = function() {
        var src = this.source, len = src.length;
        while (this.pos < len) {
          var start = this.pos;
          var line = this.line, col = this._col();
          var ch = src[this.pos];
          if (ch === " " || ch === "	" || ch === "\r" || ch === "\n" || ch === "\v" || ch === "\f") {
            while (this.pos < len) {
              var c = src[this.pos];
              if (c === "\n") {
                this.line++;
                this.lineStart = this.pos + 1;
              } else if (c !== " " && c !== "	" && c !== "\r" && c !== "\v" && c !== "\f") break;
              this.pos++;
            }
            continue;
          }
          if (ch === "/" && this.pos + 1 < len && src[this.pos + 1] === "/") {
            while (this.pos < len && src[this.pos] !== "\n") this.pos++;
            continue;
          }
          if (ch === "/" && this.pos + 1 < len && src[this.pos + 1] === "*") {
            this.pos += 2;
            while (this.pos < len) {
              if (src[this.pos] === "\n") {
                this.line++;
                this.lineStart = this.pos + 1;
              }
              if (src[this.pos] === "*" && this.pos + 1 < len && src[this.pos + 1] === "/") {
                this.pos += 2;
                break;
              }
              this.pos++;
            }
            continue;
          }
          if (ch === '"' || ch === "'") {
            this._readString(ch, line, col);
            continue;
          }
          if (ch === "`") {
            this._error("Template literals are not allowed in SafeScript (use string concatenation)", line, col);
          }
          if (ch >= "0" && ch <= "9" || ch === "." && this.pos + 1 < len && src[this.pos + 1] >= "0" && src[this.pos + 1] <= "9") {
            this._readNumber(line, col);
            continue;
          }
          if (this._isIdentStart(ch)) {
            this._readIdent(line, col);
            continue;
          }
          if (ch === "/" && !this._lastIsExprEnd()) {
            this._readRegex(line, col);
            continue;
          }
          if (this._readPunct(line, col)) continue;
          this._error("Unexpected character: " + ch, line, col);
        }
        this._push(TT.EOF, "", this.line, this._col());
      };
      Tokenizer.prototype._isIdentStart = function(ch) {
        return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch === "_" || ch === "$";
      };
      Tokenizer.prototype._isIdentPart = function(ch) {
        return this._isIdentStart(ch) || ch >= "0" && ch <= "9";
      };
      Tokenizer.prototype._readString = function(quote, line, col) {
        var src = this.source, len = src.length;
        var start = this.pos;
        this.pos++;
        while (this.pos < len && src[this.pos] !== quote) {
          if (src[this.pos] === "\\") {
            this.pos++;
            if (this.pos < len && src[this.pos] === "\n") {
              this.line++;
              this.lineStart = this.pos + 1;
            }
          }
          this.pos++;
        }
        if (this.pos >= len) this._error("Unterminated string literal", line, col);
        this.pos++;
        this._push(TT.String, src.slice(start, this.pos), line, col);
      };
      Tokenizer.prototype._readNumber = function(line, col) {
        var src = this.source, len = src.length;
        var start = this.pos;
        var ch = src[this.pos];
        if (ch === "0" && this.pos + 1 < len) {
          var next = src[this.pos + 1];
          if (next === "x" || next === "X") {
            this.pos += 2;
            while (this.pos < len && /[0-9a-fA-F_]/.test(src[this.pos])) this.pos++;
          } else if (next === "b" || next === "B") {
            this.pos += 2;
            while (this.pos < len && (src[this.pos] === "0" || src[this.pos] === "1" || src[this.pos] === "_")) this.pos++;
          } else if (next === "o" || next === "O") {
            this.pos += 2;
            while (this.pos < len && src[this.pos] >= "0" && src[this.pos] <= "7") this.pos++;
          } else {
            this._readDecimal();
          }
        } else {
          this._readDecimal();
        }
        if (this.pos < len && src[this.pos] === "n") this.pos++;
        this._push(TT.Number, src.slice(start, this.pos), line, col);
      };
      Tokenizer.prototype._readDecimal = function() {
        var src = this.source, len = src.length;
        while (this.pos < len && (src[this.pos] >= "0" && src[this.pos] <= "9" || src[this.pos] === "_")) this.pos++;
        if (this.pos < len && src[this.pos] === ".") {
          this.pos++;
          while (this.pos < len && (src[this.pos] >= "0" && src[this.pos] <= "9" || src[this.pos] === "_")) this.pos++;
        }
        if (this.pos < len && (src[this.pos] === "e" || src[this.pos] === "E")) {
          this.pos++;
          if (this.pos < len && (src[this.pos] === "+" || src[this.pos] === "-")) this.pos++;
          while (this.pos < len && (src[this.pos] >= "0" && src[this.pos] <= "9" || src[this.pos] === "_")) this.pos++;
        }
      };
      Tokenizer.prototype._readIdent = function(line, col) {
        var src = this.source, len = src.length;
        var start = this.pos;
        while (this.pos < len && this._isIdentPart(src[this.pos])) this.pos++;
        var word = src.slice(start, this.pos);
        if (defs.BLOCKED[word]) {
          this._error("Blocked identifier: " + word, line, col);
        }
        if (defs.BLOCKED_KW[word]) {
          this._error("Blocked keyword: " + word, line, col);
        }
        if (defs.ALLOWED_KW[word]) {
          this._push(TT.Keyword, word, line, col);
        } else {
          this._push(TT.Ident, word, line, col);
        }
      };
      Tokenizer.prototype._readRegex = function(line, col) {
        var src = this.source, len = src.length;
        var start = this.pos;
        this.pos++;
        while (this.pos < len && src[this.pos] !== "/") {
          if (src[this.pos] === "\\") this.pos++;
          if (this.pos < len && src[this.pos] === "[") {
            this.pos++;
            while (this.pos < len && src[this.pos] !== "]") {
              if (src[this.pos] === "\\") this.pos++;
              this.pos++;
            }
          }
          this.pos++;
        }
        if (this.pos >= len) this._error("Unterminated regex", line, col);
        this.pos++;
        while (this.pos < len && /[gimsuy]/.test(src[this.pos])) this.pos++;
        this._push(TT.Regex, src.slice(start, this.pos), line, col);
      };
      var PUNCT3 = {
        "===": 1,
        "!==": 1,
        ">>>": 1,
        "**=": 1,
        "<<=": 1,
        ">>=": 1,
        "&&=": 1,
        "||=": 1,
        "??=": 1,
        "...": 1
      };
      var PUNCT2 = {
        "==": 1,
        "!=": 1,
        ">=": 1,
        "<=": 1,
        "&&": 1,
        "||": 1,
        "??": 1,
        "+=": 1,
        "-=": 1,
        "*=": 1,
        "/=": 1,
        "%=": 1,
        "**": 1,
        "++": 1,
        "--": 1,
        "=>": 1,
        "?.": 1,
        "<<": 1,
        ">>": 1,
        "&=": 1,
        "|=": 1,
        "^=": 1
      };
      var PUNCT1 = {
        "+": 1,
        "-": 1,
        "*": 1,
        "/": 1,
        "%": 1,
        "=": 1,
        "<": 1,
        ">": 1,
        "!": 1,
        "&": 1,
        "|": 1,
        "^": 1,
        "~": 1,
        "?": 1,
        ":": 1,
        ";": 1,
        ",": 1,
        ".": 1,
        "(": 1,
        ")": 1,
        "{": 1,
        "}": 1,
        "[": 1,
        "]": 1
      };
      Tokenizer.prototype._readPunct = function(line, col) {
        var src = this.source;
        if (this.pos + 2 < src.length && PUNCT3[src.slice(this.pos, this.pos + 3)]) {
          this._push(TT.Punct, src.slice(this.pos, this.pos + 3), line, col);
          this.pos += 3;
          return true;
        }
        if (this.pos + 1 < src.length && PUNCT2[src.slice(this.pos, this.pos + 2)]) {
          this._push(TT.Punct, src.slice(this.pos, this.pos + 2), line, col);
          this.pos += 2;
          return true;
        }
        if (PUNCT1[src[this.pos]]) {
          this._push(TT.Punct, src[this.pos], line, col);
          this.pos += 1;
          return true;
        }
        return false;
      };
      Tokenizer.prototype._lastIsExprEnd = function() {
        if (!this.tokens.length) return false;
        var last = this.tokens[this.tokens.length - 1];
        if (last.type === TT.Ident || last.type === TT.Number || last.type === TT.String || last.type === TT.Regex) return true;
        if (last.type === TT.Keyword && (last.value === "true" || last.value === "false" || last.value === "null" || last.value === "undefined" || last.value === "this")) return true;
        if (last.type === TT.Punct && (last.value === ")" || last.value === "]")) return true;
        return false;
      };
      function Parser(source) {
        var tokenizer = new Tokenizer(source);
        this.tokens = tokenizer.tokens;
        this.pos = 0;
      }
      Parser.prototype._cur = function() {
        return this.tokens[this.pos];
      };
      Parser.prototype._peek = function(offset) {
        return this.tokens[this.pos + (offset || 0)];
      };
      Parser.prototype._at = function(type, value) {
        var t = this._cur();
        if (t.type !== type) return false;
        if (value !== void 0 && t.value !== value) return false;
        return true;
      };
      Parser.prototype._eat = function(type, value) {
        var t = this._cur();
        if (t.type !== type || value !== void 0 && t.value !== value) {
          var expected = value ? type + ' "' + value + '"' : type;
          this._error("Expected " + expected + ", got " + t.type + ' "' + t.value + '"');
        }
        this.pos++;
        return t;
      };
      Parser.prototype._maybe = function(type, value) {
        if (this._at(type, value)) {
          return this.tokens[this.pos++];
        }
        return null;
      };
      Parser.prototype._error = function(msg) {
        var t = this._cur();
        var e = new SyntaxError("SafeScript: " + msg + " at line " + t.line + ":" + t.col);
        e.line = t.line;
        e.col = t.col;
        throw e;
      };
      Parser.prototype._loc = function() {
        var t = this._cur();
        return { line: t.line, col: t.col };
      };
      Parser.prototype.parseProgram = function() {
        var body = [];
        while (!this._at(TT.EOF)) {
          body.push(this._parseStatement());
        }
        return { type: "Program", body };
      };
      Parser.prototype._parseStatement = function() {
        var t = this._cur();
        if (t.type === TT.Keyword) {
          switch (t.value) {
            case "var":
            case "let":
            case "const":
              return this._parseVarDecl();
            case "if":
              return this._parseIf();
            case "for":
              return this._parseFor();
            case "while":
              return this._parseWhile();
            case "do":
              return this._parseDoWhile();
            case "return":
              return this._parseReturn();
            case "throw":
              return this._parseThrow();
            case "try":
              return this._parseTry();
            case "switch":
              return this._parseSwitch();
            case "break":
              return this._parseBreak();
            case "continue":
              return this._parseContinue();
            case "function":
              return this._parseFunctionDecl();
            case "async":
              if (this._peek(1) && this._peek(1).type === TT.Keyword && this._peek(1).value === "function") {
                return this._parseFunctionDecl();
              }
              break;
          }
        }
        if (t.type === TT.Punct && t.value === "{") return this._parseBlock();
        if (t.type === TT.Punct && t.value === ";") {
          this.pos++;
          return { type: "EmptyStatement" };
        }
        var expr = this._parseExpression();
        if (expr.type === "Identifier" && this._maybe(TT.Punct, ":")) {
          var labelBody = this._parseStatement();
          return { type: "LabeledStatement", label: expr, body: labelBody };
        }
        this._maybe(TT.Punct, ";");
        return { type: "ExpressionStatement", expression: expr };
      };
      Parser.prototype._parseBlock = function() {
        this._eat(TT.Punct, "{");
        var body = [];
        while (!this._at(TT.Punct, "}") && !this._at(TT.EOF)) {
          body.push(this._parseStatement());
        }
        this._eat(TT.Punct, "}");
        return { type: "BlockStatement", body };
      };
      Parser.prototype._parseVarDecl = function() {
        var kind = this._eat(TT.Keyword).value;
        var decls = [];
        do {
          var loc = this._loc();
          var target = this._parseBindingTarget();
          var init = null;
          if (this._maybe(TT.Punct, "=")) {
            init = this._parseAssignment();
          }
          decls.push({ type: "VariableDeclarator", id: target, init, loc });
        } while (this._maybe(TT.Punct, ","));
        this._maybe(TT.Punct, ";");
        return { type: "VariableDeclaration", kind, declarations: decls };
      };
      Parser.prototype._parseBindingTarget = function() {
        if (this._at(TT.Punct, "[")) return this._parseArrayPattern();
        if (this._at(TT.Punct, "{")) return this._parseObjectPattern();
        return this._parseIdentifier();
      };
      Parser.prototype._parseArrayPattern = function() {
        this._eat(TT.Punct, "[");
        var elements = [];
        while (!this._at(TT.Punct, "]") && !this._at(TT.EOF)) {
          if (this._at(TT.Punct, ",")) {
            elements.push(null);
            this.pos++;
            continue;
          }
          if (this._at(TT.Punct, "...")) {
            this.pos++;
            elements.push({ type: "RestElement", argument: this._parseBindingTarget() });
            break;
          }
          var el = this._parseBindingTarget();
          if (this._maybe(TT.Punct, "=")) {
            el = { type: "AssignmentPattern", left: el, right: this._parseAssignment() };
          }
          elements.push(el);
          if (!this._at(TT.Punct, "]")) this._eat(TT.Punct, ",");
        }
        this._eat(TT.Punct, "]");
        return { type: "ArrayPattern", elements };
      };
      Parser.prototype._parseObjectPattern = function() {
        this._eat(TT.Punct, "{");
        var properties = [];
        while (!this._at(TT.Punct, "}") && !this._at(TT.EOF)) {
          if (this._at(TT.Punct, "...")) {
            this.pos++;
            properties.push({ type: "RestElement", argument: this._parseIdentifier() });
            break;
          }
          var key, computed = false;
          if (this._at(TT.String) || this._at(TT.Number)) {
            key = this._parsePrimary();
          } else {
            key = this._parseIdentifier();
          }
          var value;
          if (this._maybe(TT.Punct, ":")) {
            value = this._parseBindingTarget();
          } else {
            value = key;
          }
          if (this._maybe(TT.Punct, "=")) {
            value = { type: "AssignmentPattern", left: value, right: this._parseAssignment() };
          }
          properties.push({ type: "Property", key, value, shorthand: key === value, computed: false });
          if (!this._at(TT.Punct, "}")) this._eat(TT.Punct, ",");
        }
        this._eat(TT.Punct, "}");
        return { type: "ObjectPattern", properties };
      };
      Parser.prototype._parseIdentifier = function() {
        var t = this._eat(TT.Ident);
        return { type: "Identifier", name: t.value, loc: { line: t.line, col: t.col } };
      };
      Parser.prototype._parseIf = function() {
        this._eat(TT.Keyword, "if");
        this._eat(TT.Punct, "(");
        var test = this._parseExpression();
        this._eat(TT.Punct, ")");
        var consequent = this._parseStatement();
        var alternate = null;
        if (this._maybe(TT.Keyword, "else")) {
          alternate = this._parseStatement();
        }
        return { type: "IfStatement", test, consequent, alternate };
      };
      Parser.prototype._parseFor = function() {
        this._eat(TT.Keyword, "for");
        this._eat(TT.Punct, "(");
        if (this._at(TT.Keyword, "var") || this._at(TT.Keyword, "let") || this._at(TT.Keyword, "const")) {
          var kind = this._eat(TT.Keyword).value;
          var target = this._parseBindingTarget();
          if (this._at(TT.Keyword, "in")) {
            this.pos++;
            var right = this._parseExpression();
            this._eat(TT.Punct, ")");
            var body = this._parseStatement();
            return {
              type: "ForInStatement",
              left: {
                type: "VariableDeclaration",
                kind,
                declarations: [{ type: "VariableDeclarator", id: target, init: null }]
              },
              right,
              body
            };
          }
          if (this._at(TT.Keyword, "of")) {
            this.pos++;
            var right = this._parseExpression();
            this._eat(TT.Punct, ")");
            var body = this._parseStatement();
            return {
              type: "ForOfStatement",
              left: {
                type: "VariableDeclaration",
                kind,
                declarations: [{ type: "VariableDeclarator", id: target, init: null }]
              },
              right,
              body
            };
          }
          var init = {
            type: "VariableDeclaration",
            kind,
            declarations: [{ type: "VariableDeclarator", id: target, init: null }]
          };
          if (this._maybe(TT.Punct, "=")) {
            init.declarations[0].init = this._parseAssignment();
          }
          while (this._maybe(TT.Punct, ",")) {
            var t2 = this._parseBindingTarget();
            var i2 = null;
            if (this._maybe(TT.Punct, "=")) i2 = this._parseAssignment();
            init.declarations.push({ type: "VariableDeclarator", id: t2, init: i2 });
          }
          this._eat(TT.Punct, ";");
          var test = this._at(TT.Punct, ";") ? null : this._parseExpression();
          this._eat(TT.Punct, ";");
          var update = this._at(TT.Punct, ")") ? null : this._parseExpression();
          this._eat(TT.Punct, ")");
          var body = this._parseStatement();
          return { type: "ForStatement", init, test, update, body };
        }
        if (this._at(TT.Punct, ";")) {
          this.pos++;
          var test = this._at(TT.Punct, ";") ? null : this._parseExpression();
          this._eat(TT.Punct, ";");
          var update = this._at(TT.Punct, ")") ? null : this._parseExpression();
          this._eat(TT.Punct, ")");
          return { type: "ForStatement", init: null, test, update, body: this._parseStatement() };
        }
        var initExpr = this._parseExpression();
        if (this._at(TT.Keyword, "in")) {
          this.pos++;
          var right = this._parseExpression();
          this._eat(TT.Punct, ")");
          return { type: "ForInStatement", left: initExpr, right, body: this._parseStatement() };
        }
        if (this._at(TT.Keyword, "of")) {
          this.pos++;
          var right = this._parseExpression();
          this._eat(TT.Punct, ")");
          return { type: "ForOfStatement", left: initExpr, right, body: this._parseStatement() };
        }
        this._eat(TT.Punct, ";");
        var test = this._at(TT.Punct, ";") ? null : this._parseExpression();
        this._eat(TT.Punct, ";");
        var update = this._at(TT.Punct, ")") ? null : this._parseExpression();
        this._eat(TT.Punct, ")");
        return { type: "ForStatement", init: initExpr, test, update, body: this._parseStatement() };
      };
      Parser.prototype._parseWhile = function() {
        this._eat(TT.Keyword, "while");
        this._eat(TT.Punct, "(");
        var test = this._parseExpression();
        this._eat(TT.Punct, ")");
        return { type: "WhileStatement", test, body: this._parseStatement() };
      };
      Parser.prototype._parseDoWhile = function() {
        this._eat(TT.Keyword, "do");
        var body = this._parseStatement();
        this._eat(TT.Keyword, "while");
        this._eat(TT.Punct, "(");
        var test = this._parseExpression();
        this._eat(TT.Punct, ")");
        this._maybe(TT.Punct, ";");
        return { type: "DoWhileStatement", test, body };
      };
      Parser.prototype._parseReturn = function() {
        this._eat(TT.Keyword, "return");
        var argument = null;
        if (!this._at(TT.Punct, ";") && !this._at(TT.Punct, "}") && !this._at(TT.EOF)) {
          argument = this._parseExpression();
        }
        this._maybe(TT.Punct, ";");
        return { type: "ReturnStatement", argument };
      };
      Parser.prototype._parseThrow = function() {
        this._eat(TT.Keyword, "throw");
        var argument = this._parseExpression();
        this._maybe(TT.Punct, ";");
        return { type: "ThrowStatement", argument };
      };
      Parser.prototype._parseTry = function() {
        this._eat(TT.Keyword, "try");
        var block = this._parseBlock();
        var handler = null;
        if (this._maybe(TT.Keyword, "catch")) {
          var param = null;
          if (this._maybe(TT.Punct, "(")) {
            param = this._parseBindingTarget();
            this._eat(TT.Punct, ")");
          }
          handler = { type: "CatchClause", param, body: this._parseBlock() };
        }
        var finalizer = null;
        if (this._maybe(TT.Keyword, "finally")) {
          finalizer = this._parseBlock();
        }
        return { type: "TryStatement", block, handler, finalizer };
      };
      Parser.prototype._parseSwitch = function() {
        this._eat(TT.Keyword, "switch");
        this._eat(TT.Punct, "(");
        var disc = this._parseExpression();
        this._eat(TT.Punct, ")");
        this._eat(TT.Punct, "{");
        var cases = [];
        while (!this._at(TT.Punct, "}") && !this._at(TT.EOF)) {
          var test = null;
          if (this._maybe(TT.Keyword, "case")) {
            test = this._parseExpression();
          } else {
            this._eat(TT.Keyword, "default");
          }
          this._eat(TT.Punct, ":");
          var consequent = [];
          while (!this._at(TT.Keyword, "case") && !this._at(TT.Keyword, "default") && !this._at(TT.Punct, "}") && !this._at(TT.EOF)) {
            consequent.push(this._parseStatement());
          }
          cases.push({ type: "SwitchCase", test, consequent });
        }
        this._eat(TT.Punct, "}");
        return { type: "SwitchStatement", discriminant: disc, cases };
      };
      Parser.prototype._parseBreak = function() {
        this._eat(TT.Keyword, "break");
        var label = null;
        if (this._at(TT.Ident)) {
          label = this._parseIdentifier();
        }
        this._maybe(TT.Punct, ";");
        return { type: "BreakStatement", label };
      };
      Parser.prototype._parseContinue = function() {
        this._eat(TT.Keyword, "continue");
        var label = null;
        if (this._at(TT.Ident)) {
          label = this._parseIdentifier();
        }
        this._maybe(TT.Punct, ";");
        return { type: "ContinueStatement", label };
      };
      Parser.prototype._parseFunctionDecl = function() {
        var isAsync = false;
        if (this._maybe(TT.Keyword, "async")) isAsync = true;
        this._eat(TT.Keyword, "function");
        var id = null;
        if (this._at(TT.Ident)) id = this._parseIdentifier();
        var params = this._parseParams();
        var body = this._parseBlock();
        return { type: "FunctionDeclaration", id, params, body, async: isAsync };
      };
      Parser.prototype._parseParams = function() {
        this._eat(TT.Punct, "(");
        var params = [];
        while (!this._at(TT.Punct, ")") && !this._at(TT.EOF)) {
          if (this._at(TT.Punct, "...")) {
            this.pos++;
            params.push({ type: "RestElement", argument: this._parseBindingTarget() });
            break;
          }
          var param = this._parseBindingTarget();
          if (this._maybe(TT.Punct, "=")) {
            param = { type: "AssignmentPattern", left: param, right: this._parseAssignment() };
          }
          params.push(param);
          if (!this._at(TT.Punct, ")")) this._eat(TT.Punct, ",");
        }
        this._eat(TT.Punct, ")");
        return params;
      };
      Parser.prototype._parseExpression = function() {
        var expr = this._parseAssignment();
        while (this._at(TT.Punct, ",")) {
          this.pos++;
          var right = this._parseAssignment();
          expr = { type: "SequenceExpression", expressions: expr.type === "SequenceExpression" ? expr.expressions.concat(right) : [expr, right] };
        }
        return expr;
      };
      Parser.prototype._parseAssignment = function() {
        var left = this._parseConditional();
        var t = this._cur();
        if (t.type === TT.Punct && this._isAssignOp(t.value)) {
          this.pos++;
          var right = this._parseAssignment();
          return { type: "AssignmentExpression", operator: t.value, left, right };
        }
        return left;
      };
      Parser.prototype._isAssignOp = function(op) {
        return op === "=" || op === "+=" || op === "-=" || op === "*=" || op === "/=" || op === "%=" || op === "**=" || op === "<<=" || op === ">>=" || op === ">>>=" || op === "&=" || op === "|=" || op === "^=" || op === "&&=" || op === "||=" || op === "??=";
      };
      Parser.prototype._parseConditional = function() {
        var expr = this._parseNullishCoalescing();
        if (this._maybe(TT.Punct, "?")) {
          var consequent = this._parseAssignment();
          this._eat(TT.Punct, ":");
          var alternate = this._parseAssignment();
          return { type: "ConditionalExpression", test: expr, consequent, alternate };
        }
        return expr;
      };
      Parser.prototype._parseNullishCoalescing = function() {
        var left = this._parseLogicalOr();
        while (this._at(TT.Punct, "??")) {
          this.pos++;
          left = { type: "LogicalExpression", operator: "??", left, right: this._parseLogicalOr() };
        }
        return left;
      };
      Parser.prototype._parseLogicalOr = function() {
        var left = this._parseLogicalAnd();
        while (this._at(TT.Punct, "||")) {
          this.pos++;
          left = { type: "LogicalExpression", operator: "||", left, right: this._parseLogicalAnd() };
        }
        return left;
      };
      Parser.prototype._parseLogicalAnd = function() {
        var left = this._parseBitwiseOr();
        while (this._at(TT.Punct, "&&")) {
          this.pos++;
          left = { type: "LogicalExpression", operator: "&&", left, right: this._parseBitwiseOr() };
        }
        return left;
      };
      Parser.prototype._parseBitwiseOr = function() {
        var left = this._parseBitwiseXor();
        while (this._at(TT.Punct, "|") && !this._at(TT.Punct, "||")) {
          this.pos++;
          left = { type: "BinaryExpression", operator: "|", left, right: this._parseBitwiseXor() };
        }
        return left;
      };
      Parser.prototype._parseBitwiseXor = function() {
        var left = this._parseBitwiseAnd();
        while (this._at(TT.Punct, "^")) {
          this.pos++;
          left = { type: "BinaryExpression", operator: "^", left, right: this._parseBitwiseAnd() };
        }
        return left;
      };
      Parser.prototype._parseBitwiseAnd = function() {
        var left = this._parseEquality();
        while (this._at(TT.Punct, "&") && !this._at(TT.Punct, "&&")) {
          this.pos++;
          left = { type: "BinaryExpression", operator: "&", left, right: this._parseEquality() };
        }
        return left;
      };
      Parser.prototype._parseEquality = function() {
        var left = this._parseRelational();
        while (this._at(TT.Punct, "===") || this._at(TT.Punct, "!==") || this._at(TT.Punct, "==") || this._at(TT.Punct, "!=")) {
          var op = this._cur().value;
          this.pos++;
          left = { type: "BinaryExpression", operator: op, left, right: this._parseRelational() };
        }
        return left;
      };
      Parser.prototype._parseRelational = function() {
        var left = this._parseShift();
        while (this._at(TT.Punct, "<") || this._at(TT.Punct, ">") || this._at(TT.Punct, "<=") || this._at(TT.Punct, ">=") || this._at(TT.Keyword, "instanceof") || this._at(TT.Keyword, "in")) {
          var op = this._cur().value;
          this.pos++;
          left = { type: "BinaryExpression", operator: op, left, right: this._parseShift() };
        }
        return left;
      };
      Parser.prototype._parseShift = function() {
        var left = this._parseAdditive();
        while (this._at(TT.Punct, "<<") || this._at(TT.Punct, ">>") || this._at(TT.Punct, ">>>")) {
          var op = this._cur().value;
          this.pos++;
          left = { type: "BinaryExpression", operator: op, left, right: this._parseAdditive() };
        }
        return left;
      };
      Parser.prototype._parseAdditive = function() {
        var left = this._parseMultiplicative();
        while (this._at(TT.Punct, "+") || this._at(TT.Punct, "-")) {
          var op = this._cur().value;
          this.pos++;
          left = { type: "BinaryExpression", operator: op, left, right: this._parseMultiplicative() };
        }
        return left;
      };
      Parser.prototype._parseMultiplicative = function() {
        var left = this._parseExponential();
        while (this._at(TT.Punct, "*") || this._at(TT.Punct, "/") || this._at(TT.Punct, "%")) {
          var op = this._cur().value;
          this.pos++;
          left = { type: "BinaryExpression", operator: op, left, right: this._parseExponential() };
        }
        return left;
      };
      Parser.prototype._parseExponential = function() {
        var left = this._parseUnary();
        if (this._at(TT.Punct, "**")) {
          this.pos++;
          return { type: "BinaryExpression", operator: "**", left, right: this._parseExponential() };
        }
        return left;
      };
      Parser.prototype._parseUnary = function() {
        var t = this._cur();
        if (t.type === TT.Punct && (t.value === "-" || t.value === "+" || t.value === "!" || t.value === "~")) {
          this.pos++;
          return { type: "UnaryExpression", operator: t.value, prefix: true, argument: this._parseUnary() };
        }
        if (t.type === TT.Keyword && (t.value === "typeof" || t.value === "void")) {
          this.pos++;
          return { type: "UnaryExpression", operator: t.value, prefix: true, argument: this._parseUnary() };
        }
        if (t.type === TT.Keyword && t.value === "await") {
          this.pos++;
          return { type: "AwaitExpression", argument: this._parseUnary() };
        }
        if (t.type === TT.Keyword && t.value === "new") {
          this.pos++;
          var callee = this._parsePrimary();
          while (this._at(TT.Punct, ".")) {
            this.pos++;
            var prop = this._eat(TT.Ident);
            callee = {
              type: "MemberExpression",
              object: callee,
              property: { type: "Identifier", name: prop.value },
              computed: false,
              optional: false
            };
          }
          var args = [];
          if (this._at(TT.Punct, "(")) {
            this._eat(TT.Punct, "(");
            while (!this._at(TT.Punct, ")") && !this._at(TT.EOF)) {
              if (this._at(TT.Punct, "...")) {
                this.pos++;
                args.push({ type: "SpreadElement", argument: this._parseAssignment() });
              } else {
                args.push(this._parseAssignment());
              }
              if (!this._at(TT.Punct, ")")) this._eat(TT.Punct, ",");
            }
            this._eat(TT.Punct, ")");
          }
          return { type: "NewExpression", callee, arguments: args };
        }
        if (t.type === TT.Punct && (t.value === "++" || t.value === "--")) {
          this.pos++;
          return { type: "UpdateExpression", operator: t.value, prefix: true, argument: this._parseUnary() };
        }
        return this._parsePostfix();
      };
      Parser.prototype._parsePostfix = function() {
        var expr = this._parseCallMember();
        var t = this._cur();
        if (t.type === TT.Punct && (t.value === "++" || t.value === "--")) {
          this.pos++;
          return { type: "UpdateExpression", operator: t.value, prefix: false, argument: expr };
        }
        return expr;
      };
      Parser.prototype._parseCallMember = function() {
        var expr = this._parsePrimary();
        while (true) {
          if (this._at(TT.Punct, ".") || this._at(TT.Punct, "?.")) {
            var optional = this._cur().value === "?.";
            this.pos++;
            var prop = this._eat(TT.Ident);
            expr = {
              type: "MemberExpression",
              object: expr,
              property: { type: "Identifier", name: prop.value },
              computed: false,
              optional
            };
          } else if (this._at(TT.Punct, "[")) {
            this.pos++;
            var prop = this._parseExpression();
            this._eat(TT.Punct, "]");
            expr = {
              type: "MemberExpression",
              object: expr,
              property: prop,
              computed: true,
              optional: false
            };
          } else if (this._at(TT.Punct, "(")) {
            expr = this._parseCallExpr(expr);
          } else {
            break;
          }
        }
        return expr;
      };
      Parser.prototype._parseCallExpr = function(callee) {
        this._eat(TT.Punct, "(");
        var args = [];
        while (!this._at(TT.Punct, ")") && !this._at(TT.EOF)) {
          if (this._at(TT.Punct, "...")) {
            this.pos++;
            args.push({ type: "SpreadElement", argument: this._parseAssignment() });
          } else {
            args.push(this._parseAssignment());
          }
          if (!this._at(TT.Punct, ")")) this._eat(TT.Punct, ",");
        }
        this._eat(TT.Punct, ")");
        return { type: "CallExpression", callee, arguments: args };
      };
      Parser.prototype._parsePrimary = function() {
        var t = this._cur();
        if (t.type === TT.Punct && t.value === "(") {
          return this._parseParenOrArrow();
        }
        if (t.type === TT.Punct && t.value === "[") {
          return this._parseArrayLiteral();
        }
        if (t.type === TT.Punct && t.value === "{") {
          return this._parseObjectLiteral();
        }
        if (t.type === TT.Keyword && t.value === "function") {
          return this._parseFunctionExpr(false);
        }
        if (t.type === TT.Keyword && t.value === "async" && this._peek(1) && this._peek(1).type === TT.Keyword && this._peek(1).value === "function") {
          return this._parseFunctionExpr(true);
        }
        if (t.type === TT.Keyword && t.value === "this") {
          this.pos++;
          return { type: "ThisExpression", loc: { line: t.line, col: t.col } };
        }
        if (t.type === TT.Ident) {
          var id = this._parseIdentifier();
          if (this._at(TT.Punct, "=>")) {
            return this._parseArrowBody([id], false);
          }
          return id;
        }
        if (t.type === TT.Number) {
          this.pos++;
          return { type: "Literal", value: Number(t.value), raw: t.value };
        }
        if (t.type === TT.String) {
          this.pos++;
          var val = unescapeString(t.value);
          return { type: "Literal", value: val, raw: t.value };
        }
        if (t.type === TT.Regex) {
          this.pos++;
          return { type: "Literal", raw: t.value, regex: true };
        }
        if (t.type === TT.Keyword) {
          if (t.value === "true") {
            this.pos++;
            return { type: "Literal", value: true, raw: "true" };
          }
          if (t.value === "false") {
            this.pos++;
            return { type: "Literal", value: false, raw: "false" };
          }
          if (t.value === "null") {
            this.pos++;
            return { type: "Literal", value: null, raw: "null" };
          }
          if (t.value === "undefined") {
            this.pos++;
            return { type: "Identifier", name: "undefined" };
          }
        }
        this._error("Unexpected token: " + t.type + ' "' + t.value + '"');
      };
      Parser.prototype._parseParenOrArrow = function() {
        var save = this.pos;
        this._eat(TT.Punct, "(");
        if (this._at(TT.Punct, ")")) {
          this._eat(TT.Punct, ")");
          if (this._at(TT.Punct, "=>")) {
            return this._parseArrowBody([], false);
          }
          this._error("Unexpected ()");
        }
        var items = [];
        var isArrow = false;
        try {
          var firstExpr = this._parseAssignment();
          items.push(firstExpr);
          while (this._maybe(TT.Punct, ",")) {
            items.push(this._parseAssignment());
          }
          this._eat(TT.Punct, ")");
          if (this._at(TT.Punct, "=>")) {
            var params = items.map(function(item) {
              if (item.type === "Identifier") return item;
              if (item.type === "AssignmentExpression" && item.operator === "=" && item.left.type === "Identifier") {
                return { type: "AssignmentPattern", left: item.left, right: item.right };
              }
              if (item.type === "SpreadElement" || item.type === "RestElement") {
                return { type: "RestElement", argument: item.argument };
              }
              return item;
            });
            return this._parseArrowBody(params, false);
          }
          if (items.length === 1) return items[0];
          return { type: "SequenceExpression", expressions: items };
        } catch (e) {
          throw e;
        }
      };
      Parser.prototype._parseArrowBody = function(params, isAsync) {
        this._eat(TT.Punct, "=>");
        var body;
        if (this._at(TT.Punct, "{")) {
          body = this._parseBlock();
        } else {
          body = this._parseAssignment();
        }
        return { type: "ArrowFunctionExpression", params, body, async: isAsync };
      };
      Parser.prototype._parseArrayLiteral = function() {
        this._eat(TT.Punct, "[");
        var elements = [];
        while (!this._at(TT.Punct, "]") && !this._at(TT.EOF)) {
          if (this._at(TT.Punct, ",")) {
            elements.push(null);
            this.pos++;
            continue;
          }
          if (this._at(TT.Punct, "...")) {
            this.pos++;
            elements.push({ type: "SpreadElement", argument: this._parseAssignment() });
          } else {
            elements.push(this._parseAssignment());
          }
          if (!this._at(TT.Punct, "]")) this._eat(TT.Punct, ",");
        }
        this._eat(TT.Punct, "]");
        return { type: "ArrayExpression", elements };
      };
      Parser.prototype._parseObjectLiteral = function() {
        this._eat(TT.Punct, "{");
        var properties = [];
        while (!this._at(TT.Punct, "}") && !this._at(TT.EOF)) {
          if (this._at(TT.Punct, "...")) {
            this.pos++;
            properties.push({ type: "SpreadElement", argument: this._parseAssignment() });
            if (!this._at(TT.Punct, "}")) this._eat(TT.Punct, ",");
            continue;
          }
          var computed = false;
          var key;
          if (this._at(TT.Punct, "[")) {
            this._eat(TT.Punct, "[");
            key = this._parseAssignment();
            this._eat(TT.Punct, "]");
            computed = true;
          } else if (this._at(TT.String) || this._at(TT.Number)) {
            key = this._parsePrimary();
          } else if (this._at(TT.Ident)) {
            key = this._parseIdentifier();
          } else if (this._at(TT.Keyword)) {
            var kw = this._cur();
            this.pos++;
            key = { type: "Identifier", name: kw.value };
          } else {
            this._error("Expected property name");
          }
          var value, shorthand = false, method = false;
          if (this._at(TT.Punct, "(")) {
            var params = this._parseParams();
            var body = this._parseBlock();
            value = { type: "FunctionExpression", id: null, params, body, async: false };
            method = true;
          } else if (this._maybe(TT.Punct, ":")) {
            value = this._parseAssignment();
          } else {
            value = key;
            shorthand = true;
          }
          properties.push({
            type: "Property",
            key,
            value,
            computed,
            shorthand,
            method
          });
          if (!this._at(TT.Punct, "}")) this._eat(TT.Punct, ",");
        }
        this._eat(TT.Punct, "}");
        return { type: "ObjectExpression", properties };
      };
      Parser.prototype._parseFunctionExpr = function(isAsync) {
        if (isAsync) this._eat(TT.Keyword, "async");
        this._eat(TT.Keyword, "function");
        var id = null;
        if (this._at(TT.Ident)) id = this._parseIdentifier();
        var params = this._parseParams();
        var body = this._parseBlock();
        return { type: "FunctionExpression", id, params, body, async: isAsync };
      };
      var _parseDebugStatement = Parser.prototype._parseStatement;
      Parser.prototype._parseStatement = function() {
        var loc = this._loc();
        var node = _parseDebugStatement.call(this);
        if (!node.loc) node.loc = loc;
        return node;
      };
      function parse(source) {
        var parser = new Parser(source);
        return parser.parseProgram();
      }
      exports.parse = parse;
      exports.TT = TT;
    }
  });

  // safescript-upstream/src/validate.js
  var require_validate = __commonJS({
    "safescript-upstream/src/validate.js"(exports) {
      "use strict";
      var defs = require_defs();
      function ValidationError(message, node) {
        this.message = message;
        this.node = node;
        this.line = node && node.loc ? node.loc.line : void 0;
        this.col = node && node.loc ? node.loc.col : void 0;
      }
      function validate(ast) {
        var errors = [];
        function error(msg, node) {
          errors.push(new ValidationError(msg, node));
        }
        function walk(node) {
          if (!node || typeof node !== "object") return;
          switch (node.type) {
            case "Program":
              node.body.forEach(walk);
              break;
            case "ExpressionStatement":
              walk(node.expression);
              break;
            case "BlockStatement":
              node.body.forEach(walk);
              break;
            case "VariableDeclaration":
              node.declarations.forEach(function(d) {
                walkPattern(d.id);
                if (d.init) walk(d.init);
              });
              break;
            case "IfStatement":
              walk(node.test);
              walk(node.consequent);
              if (node.alternate) walk(node.alternate);
              break;
            case "ForStatement":
              if (node.init) walk(node.init);
              if (node.test) walk(node.test);
              if (node.update) walk(node.update);
              walk(node.body);
              break;
            case "ForInStatement":
            case "ForOfStatement":
              walk(node.left);
              walk(node.right);
              walk(node.body);
              break;
            case "WhileStatement":
              walk(node.test);
              walk(node.body);
              break;
            case "DoWhileStatement":
              walk(node.body);
              walk(node.test);
              break;
            case "ReturnStatement":
            case "ThrowStatement":
              if (node.argument) walk(node.argument);
              break;
            case "BreakStatement":
            case "ContinueStatement":
            case "EmptyStatement":
              break;
            case "LabeledStatement":
              walk(node.body);
              break;
            case "TryStatement":
              walk(node.block);
              if (node.handler) {
                if (node.handler.param) walkPattern(node.handler.param);
                walk(node.handler.body);
              }
              if (node.finalizer) walk(node.finalizer);
              break;
            case "SwitchStatement":
              walk(node.discriminant);
              node.cases.forEach(function(c) {
                if (c.test) walk(c.test);
                c.consequent.forEach(walk);
              });
              break;
            case "FunctionDeclaration":
            case "FunctionExpression":
            case "ArrowFunctionExpression":
              if (node.id) walkPattern(node.id);
              node.params.forEach(walkPattern);
              walk(node.body);
              break;
            case "Identifier":
              if (defs.BLOCKED[node.name]) {
                error("Blocked identifier: " + node.name, node);
              }
              break;
            case "ThisExpression":
              break;
            case "MemberExpression":
              walk(node.object);
              if (node.computed) {
                walk(node.property);
              } else if (node.property && node.property.type === "Identifier") {
                if (defs.BLOCKED_PROPS[node.property.name]) {
                  error("Blocked property access: " + node.property.name, node.property);
                }
              }
              break;
            case "CallExpression":
              walk(node.callee);
              node.arguments.forEach(walk);
              break;
            case "BinaryExpression":
            case "LogicalExpression":
              walk(node.left);
              walk(node.right);
              break;
            case "AssignmentExpression":
              walk(node.left);
              walk(node.right);
              break;
            case "UnaryExpression":
            case "UpdateExpression":
              walk(node.argument);
              break;
            case "ConditionalExpression":
              walk(node.test);
              walk(node.consequent);
              walk(node.alternate);
              break;
            case "SequenceExpression":
              node.expressions.forEach(walk);
              break;
            case "ArrayExpression":
              node.elements.forEach(function(el) {
                if (el) walk(el);
              });
              break;
            case "ObjectExpression":
              node.properties.forEach(function(prop) {
                if (prop.type === "SpreadElement") {
                  walk(prop.argument);
                } else {
                  if (prop.computed) walk(prop.key);
                  walk(prop.value);
                }
              });
              break;
            case "SpreadElement":
              walk(node.argument);
              break;
            case "Literal":
              break;
            default:
              break;
          }
        }
        function walkPattern(node) {
          if (!node) return;
          switch (node.type) {
            case "Identifier":
              if (node.name === "eval" || node.name === "arguments") {
                error('Cannot use "' + node.name + '" as binding name in strict mode', node);
              }
              break;
            case "ArrayPattern":
              node.elements.forEach(function(el) {
                if (el) walkPattern(el);
              });
              break;
            case "ObjectPattern":
              node.properties.forEach(function(prop) {
                if (prop.type === "RestElement") walkPattern(prop.argument);
                else walkPattern(prop.value);
              });
              break;
            case "AssignmentPattern":
              walkPattern(node.left);
              walk(node.right);
              break;
            case "RestElement":
              walkPattern(node.argument);
              break;
          }
        }
        walk(ast);
        return {
          ok: errors.length === 0,
          errors: errors.length > 0 ? errors : null
        };
      }
      exports.validate = validate;
    }
  });

  // safescript-upstream/src/transform.js
  var require_transform = __commonJS({
    "safescript-upstream/src/transform.js"(exports) {
      "use strict";
      function transform(ast) {
        return walkNode(ast);
      }
      function walkNode(node) {
        if (!node || typeof node !== "object") return node;
        if (Array.isArray(node)) return node.map(walkNode);
        if (node.type === "AssignmentExpression" && node.operator === "=" && node.left && node.left.type === "MemberExpression" && node.left.computed) {
          return {
            type: "CallExpression",
            callee: { type: "Identifier", name: "__set" },
            arguments: [
              walkNode(node.left.object),
              walkNode(node.left.property),
              walkNode(node.right)
            ]
          };
        }
        if (node.type === "AssignmentExpression" && node.operator !== "=" && node.left && node.left.type === "MemberExpression" && node.left.computed) {
          var baseOp = node.operator.slice(0, -1);
          var obj = walkNode(node.left.object);
          var prop = walkNode(node.left.property);
          return {
            type: "CallExpression",
            callee: { type: "Identifier", name: "__set" },
            arguments: [
              obj,
              prop,
              {
                type: "BinaryExpression",
                operator: baseOp,
                left: {
                  type: "CallExpression",
                  callee: { type: "Identifier", name: "__at" },
                  arguments: [obj, prop]
                },
                right: walkNode(node.right)
              }
            ]
          };
        }
        if (node.type === "UpdateExpression" && node.argument && node.argument.type === "MemberExpression" && node.argument.computed) {
          var delta = node.operator === "++" ? 1 : -1;
          var obj = walkNode(node.argument.object);
          var prop = walkNode(node.argument.property);
          return {
            type: "CallExpression",
            callee: { type: "Identifier", name: "__set" },
            arguments: [
              obj,
              prop,
              {
                type: "BinaryExpression",
                operator: "+",
                left: {
                  type: "CallExpression",
                  callee: { type: "Identifier", name: "__at" },
                  arguments: [obj, prop]
                },
                right: { type: "Literal", value: delta, raw: String(delta) }
              }
            ]
          };
        }
        if (node.type === "ThisExpression") {
          return { type: "Identifier", name: "__safeThis" };
        }
        var out = {};
        var keys = Object.keys(node);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var v = node[k];
          if (k === "loc") {
            out[k] = v;
            continue;
          }
          if (Array.isArray(v)) {
            out[k] = v.map(function(item) {
              return item && typeof item === "object" && item.type ? walkNode(item) : item;
            });
          } else if (v && typeof v === "object" && v.type) {
            out[k] = walkNode(v);
          } else {
            out[k] = v;
          }
        }
        if (out.type === "MemberExpression" && out.computed) {
          return {
            type: "CallExpression",
            callee: { type: "Identifier", name: "__at" },
            arguments: [out.object, out.property]
          };
        }
        return out;
      }
      exports.transform = transform;
    }
  });

  // safescript-upstream/src/emit.js
  var require_emit = __commonJS({
    "safescript-upstream/src/emit.js"(exports) {
      "use strict";
      var _debugMode = false;
      var _debugLocals = null;
      function collectDeclaredNames(node, names) {
        if (!node) return;
        switch (node.type) {
          case "VariableDeclaration":
            for (var i = 0; i < node.declarations.length; i++) {
              collectPatternNames(node.declarations[i].id, names);
            }
            break;
          case "FunctionDeclaration":
            if (node.id) names[node.id.name] = true;
            break;
          case "BlockStatement":
          case "Program":
            for (var j = 0; j < node.body.length; j++) {
              collectDeclaredNames(node.body[j], names);
            }
            break;
          case "ForStatement":
            collectDeclaredNames(node.init, names);
            collectDeclaredNames(node.body, names);
            break;
          case "ForInStatement":
          case "ForOfStatement":
            collectDeclaredNames(node.left, names);
            collectDeclaredNames(node.body, names);
            break;
          case "WhileStatement":
          case "DoWhileStatement":
            collectDeclaredNames(node.body, names);
            break;
          case "IfStatement":
            collectDeclaredNames(node.consequent, names);
            if (node.alternate) collectDeclaredNames(node.alternate, names);
            break;
          case "TryStatement":
            collectDeclaredNames(node.block, names);
            if (node.handler) {
              collectDeclaredNames(node.handler.body, names);
            }
            if (node.finalizer) collectDeclaredNames(node.finalizer, names);
            break;
          case "SwitchStatement":
            for (var k = 0; k < node.cases.length; k++) {
              var c = node.cases[k];
              for (var l = 0; l < c.consequent.length; l++) {
                collectDeclaredNames(c.consequent[l], names);
              }
            }
            break;
          case "LabeledStatement":
            collectDeclaredNames(node.body, names);
            break;
        }
      }
      function collectPatternNames(pat, names) {
        if (!pat) return;
        switch (pat.type) {
          case "Identifier":
            names[pat.name] = true;
            break;
          case "ArrayPattern":
            for (var i = 0; i < pat.elements.length; i++) {
              if (pat.elements[i]) collectPatternNames(pat.elements[i], names);
            }
            break;
          case "ObjectPattern":
            for (var j = 0; j < pat.properties.length; j++) {
              var p = pat.properties[j];
              if (p.type === "RestElement") collectPatternNames(p.argument, names);
              else collectPatternNames(p.value, names);
            }
            break;
          case "AssignmentPattern":
            collectPatternNames(pat.left, names);
            break;
          case "RestElement":
            collectPatternNames(pat.argument, names);
            break;
        }
      }
      function emitDbgCheckpoint(line, phase) {
        if (!_debugMode || !_debugLocals) return "";
        var names = Object.keys(_debugLocals);
        var localsObj = names.length > 0 ? "{ " + names.map(function(n) {
          return n + ": " + n;
        }).join(", ") + " }" : "{}";
        var phaseStr = phase === "before" ? ', "before"' : ', "after"';
        return "\n__r = await __dbg(" + line + ", function(){ return " + localsObj + "; }" + phaseStr + ");\nif (__r) return __r.value;";
      }
      function nodeLine(node) {
        if (!node) return 0;
        if (node.line) return node.line;
        if (node.loc) return node.loc.line || 0;
        if (node.declarations && node.declarations[0]) {
          var d = node.declarations[0];
          if (d.id && d.id.loc) return d.id.loc.line;
        }
        if (node.expression) return nodeLine(node.expression);
        if (node.argument) return nodeLine(node.argument);
        if (node.test) return nodeLine(node.test);
        if (node.callee) return nodeLine(node.callee);
        if (node.id) return nodeLine(node.id);
        if (node.left) return nodeLine(node.left);
        if (node.object) return nodeLine(node.object);
        return 0;
      }
      function emit(node) {
        if (!node) return "";
        switch (node.type) {
          case "Program":
            if (_debugMode) {
              return emitStatementsWithDbg(node.body);
            }
            return node.body.map(emit).join("\n");
          case "ExpressionStatement":
            var exprCode = "";
            if (_debugMode) {
              exprCode += emitDbgCheckpoint(nodeLine(node), "before");
            }
            exprCode += emit(node.expression) + ";";
            if (_debugMode) {
              exprCode += emitDbgCheckpoint(nodeLine(node), "after");
            }
            return exprCode;
          case "BlockStatement":
            if (_debugMode) {
              return "{\n" + emitStatementsWithDbg(node.body) + "\n}";
            }
            return "{\n" + node.body.map(emit).join("\n") + "\n}";
          case "EmptyStatement":
            return ";";
          case "VariableDeclaration":
            if (_debugMode && _debugLocals) {
              for (var vi = 0; vi < node.declarations.length; vi++) {
                collectPatternNames(node.declarations[vi].id, _debugLocals);
              }
            }
            var varCode = "";
            if (_debugMode) {
              varCode += emitDbgCheckpoint(nodeLine(node), "before");
            }
            varCode += node.kind + " " + node.declarations.map(function(d) {
              if (d.init) return emitPattern(d.id) + " = " + emit(d.init);
              return emitPattern(d.id);
            }).join(", ") + ";";
            if (_debugMode) {
              varCode += emitDbgCheckpoint(nodeLine(node), "after");
            }
            return varCode;
          case "FunctionDeclaration":
            return "async function " + (node.id ? emit(node.id) : "") + "(" + node.params.map(emitParam).join(", ") + ") " + emitFuncBodyWithCheck(node.body);
          case "FunctionExpression":
            return "async function" + (node.id ? " " + emit(node.id) : "") + "(" + node.params.map(emitParam).join(", ") + ") " + emitFuncBodyWithCheck(node.body);
          case "ArrowFunctionExpression":
            var paramsStr;
            if (node.params.length === 1 && node.params[0].type === "Identifier") {
              paramsStr = emit(node.params[0]);
            } else {
              paramsStr = "(" + node.params.map(emitParam).join(", ") + ")";
            }
            if (node.body.type !== "BlockStatement") {
              return "async " + paramsStr + " => {\n__check();\nreturn " + emit(node.body) + ";\n}";
            }
            return "async " + paramsStr + " => " + emitBodyWithCheck(node.body);
          case "ReturnStatement":
            if (_debugMode && node.argument) {
              return emitDbgCheckpoint(nodeLine(node), "before") + "\nvar __retVal = " + emit(node.argument) + ";" + emitDbgCheckpoint(nodeLine(node), "after") + "\nreturn __retVal;";
            }
            if (_debugMode) {
              return emitDbgCheckpoint(nodeLine(node), "before") + "\nreturn;";
            }
            return node.argument ? "return " + emit(node.argument) + ";" : "return;";
          case "ThrowStatement":
            if (_debugMode) {
              return "{" + emitDbgCheckpoint(nodeLine(node), "before") + "\nvar __throwVal = " + emit(node.argument) + ";" + emitDbgCheckpoint(nodeLine(node), "after") + "\nthrow __throwVal; }";
            }
            return "throw " + emit(node.argument) + ";";
          case "BreakStatement":
            return node.label ? "break " + emit(node.label) + ";" : "break;";
          case "ContinueStatement":
            return node.label ? "continue " + emit(node.label) + ";" : "continue;";
          case "LabeledStatement":
            return emit(node.label) + ": " + emit(node.body);
          case "IfStatement":
            var s = "if (" + emit(node.test) + ") " + emit(node.consequent);
            if (node.alternate) {
              s += " else " + emit(node.alternate);
            }
            return s;
          case "ForStatement":
            return "for (" + (node.init ? node.init.type === "VariableDeclaration" ? emitVarDeclNoSemi(node.init) : emit(node.init) : "") + "; " + (node.test ? emit(node.test) : "") + "; " + (node.update ? emit(node.update) : "") + ") " + emitLoopBody(node.body);
          case "ForInStatement":
            return "for (" + (node.left.type === "VariableDeclaration" ? emitVarDeclNoSemi(node.left) : emit(node.left)) + " in " + emit(node.right) + ") " + emitLoopBody(node.body);
          case "ForOfStatement":
            return "for (" + (node.left.type === "VariableDeclaration" ? emitVarDeclNoSemi(node.left) : emit(node.left)) + " of " + emit(node.right) + ") " + emitLoopBody(node.body);
          case "WhileStatement":
            return "while (" + emit(node.test) + ") " + emitLoopBody(node.body);
          case "DoWhileStatement":
            return "do " + emitLoopBody(node.body) + " while (" + emit(node.test) + ");";
          case "TryStatement":
            var s = "try " + emit(node.block);
            if (node.handler) {
              var paramStr = node.handler.param ? emitPattern(node.handler.param) : "";
              s += " catch" + (paramStr ? " (" + paramStr + ")" : "") + " ";
              if (paramStr) {
                var catchBody = emit(node.handler.body);
                s += catchBody.replace(/^\{/, "{ __stripErr(" + paramStr + ");");
              } else {
                s += emit(node.handler.body);
              }
            }
            if (node.finalizer) {
              s += " finally " + emit(node.finalizer);
            }
            return s;
          case "SwitchStatement":
            return "switch (" + emit(node.discriminant) + ") {\n" + node.cases.map(function(c) {
              var label = c.test ? "case " + emit(c.test) + ":\n" : "default:\n";
              return label + c.consequent.map(emit).join("\n");
            }).join("\n") + "\n}";
          // ── Expressions ──────────────────────────────────────────────
          case "Identifier":
            return node.name;
          case "ThisExpression":
            return "__safeThis";
          case "Literal":
            return node.raw;
          case "BinaryExpression":
          case "LogicalExpression":
            var leftStr = emit(node.left);
            if (node.operator === "**" && node.left.type === "UnaryExpression") {
              leftStr = "(" + leftStr + ")";
            }
            return "(" + leftStr + " " + node.operator + " " + emit(node.right) + ")";
          case "AssignmentExpression":
            return "(" + emit(node.left) + " " + node.operator + " " + emit(node.right) + ")";
          case "UnaryExpression":
            if (node.operator === "typeof" || node.operator === "void") {
              return node.operator + " " + emit(node.argument);
            }
            if (node.prefix) {
              var argStr = emit(node.argument);
              if (node.argument.type === "UnaryExpression" && (node.operator === "-" && node.argument.operator === "-" || node.operator === "+" && node.argument.operator === "+")) {
                argStr = "(" + argStr + ")";
              }
              return node.operator + argStr;
            }
            return emit(node.argument) + node.operator;
          case "UpdateExpression":
            return node.prefix ? node.operator + emit(node.argument) : emit(node.argument) + node.operator;
          case "ConditionalExpression":
            return "(" + emit(node.test) + " ? " + emit(node.consequent) + " : " + emit(node.alternate) + ")";
          case "SequenceExpression":
            return "(" + node.expressions.map(emit).join(", ") + ")";
          case "NewExpression":
            var newCalleeStr = emit(node.callee);
            var newArgs = node.arguments.map(function(a) {
              if (a.type === "SpreadElement") return "..." + emit(a.argument);
              return emit(a);
            }).join(", ");
            return "(await __new(" + newCalleeStr + ", [" + newArgs + "]))";
          case "CallExpression":
            if (node.callee.type === "MemberExpression" && !node.callee.computed) {
              var objStr = emit(node.callee.object);
              var methodName = node.callee.property.name || node.callee.property.value;
              var callFn = node.callee.optional ? "__call_opt" : "__call";
              var callArgs = [objStr, '"' + methodName + '"'];
              node.arguments.forEach(function(a) {
                if (a.type === "SpreadElement") callArgs.push("..." + emit(a.argument));
                else callArgs.push(emit(a));
              });
              return "(await " + callFn + "(" + callArgs.join(", ") + "))";
            }
            var calleeStr = emit(node.callee);
            if (node.callee.type === "ArrowFunctionExpression" || node.callee.type === "FunctionExpression") {
              calleeStr = "(" + calleeStr + ")";
            }
            return "(await " + calleeStr + "(" + node.arguments.map(function(a) {
              if (a.type === "SpreadElement") return "..." + emit(a.argument);
              return emit(a);
            }).join(", ") + "))";
          case "MemberExpression":
            if (node.computed) {
              return emit(node.object) + "[" + emit(node.property) + "]";
            }
            var op = node.optional ? "?." : ".";
            return emit(node.object) + op + emit(node.property);
          case "ArrayExpression":
            return "[" + node.elements.map(function(el) {
              if (!el) return "";
              if (el.type === "SpreadElement") return "..." + emit(el.argument);
              return emit(el);
            }).join(", ") + "]";
          case "ObjectExpression":
            if (node.properties.length === 0) return "{}";
            return "{\n" + node.properties.map(function(prop) {
              if (prop.type === "SpreadElement") return "..." + emit(prop.argument);
              if (prop.shorthand) return emit(prop.key);
              if (prop.method) {
                var fn = prop.value;
                return "async " + (prop.computed ? "[" + emit(prop.key) + "]" : emit(prop.key)) + "(" + fn.params.map(emitParam).join(", ") + ") " + emitFuncBodyWithCheck(fn.body);
              }
              var keyStr = prop.computed ? "[" + emit(prop.key) + "]" : emit(prop.key);
              return keyStr + ": " + emit(prop.value);
            }).join(",\n") + "\n}";
          case "SpreadElement":
            return "..." + emit(node.argument);
          default:
            return "";
        }
      }
      function emitBodyWithCheck(blockNode) {
        if (_debugMode) {
          return "{\n" + emitStatementsWithDbg(blockNode.body) + "\n}";
        }
        return "{\n__check();\n" + blockNode.body.map(emit).join("\n") + "\n}";
      }
      function emitFuncBodyWithCheck(blockNode) {
        if (_debugMode) {
          return "{\nvar __safeThis = __thisCell.value; __thisCell.value = undefined;\n" + emitStatementsWithDbg(blockNode.body) + "\n}";
        }
        return "{\nvar __safeThis = __thisCell.value; __thisCell.value = undefined;\n__check();\n" + blockNode.body.map(emit).join("\n") + "\n}";
      }
      function emitLoopBody(bodyNode) {
        if (_debugMode) {
          if (bodyNode.type === "BlockStatement") {
            return "{\n" + emitStatementsWithDbg(bodyNode.body) + "\n}";
          }
          return "{\n" + emit(bodyNode) + "\n}";
        }
        if (bodyNode.type === "BlockStatement") {
          return "{\n__check();\n" + bodyNode.body.map(emit).join("\n") + "\n}";
        }
        return "{\n__check();\n" + emit(bodyNode) + "\n}";
      }
      function emitStatementsWithDbg(stmts) {
        var parts = [];
        for (var i = 0; i < stmts.length; i++) {
          parts.push(emit(stmts[i]));
        }
        return parts.join("\n");
      }
      function emitPattern(node) {
        if (!node) return "";
        switch (node.type) {
          case "Identifier":
            return node.name;
          case "ArrayPattern":
            return "[" + node.elements.map(function(el) {
              if (!el) return "";
              return emitParam(el);
            }).join(", ") + "]";
          case "ObjectPattern":
            return "{" + node.properties.map(function(prop) {
              if (prop.type === "RestElement") return "..." + emitPattern(prop.argument);
              if (prop.shorthand) return emitPattern(prop.value);
              return emit(prop.key) + ": " + emitPattern(prop.value);
            }).join(", ") + "}";
          case "AssignmentPattern":
            return emitPattern(node.left) + " = " + emit(node.right);
          case "RestElement":
            return "..." + emitPattern(node.argument);
          default:
            return emit(node);
        }
      }
      function emitParam(node) {
        return emitPattern(node);
      }
      function emitVarDeclNoSemi(node) {
        return node.kind + " " + node.declarations.map(function(d) {
          if (d.init) return emitPattern(d.id) + " = " + emit(d.init);
          return emitPattern(d.id);
        }).join(", ");
      }
      function emitDebug(node) {
        var names = /* @__PURE__ */ Object.create(null);
        if (node.type === "Program") {
          collectDeclaredNames(node, names);
        }
        _debugMode = true;
        _debugLocals = names;
        var code;
        try {
          code = "var __r;\n" + emit(node);
        } finally {
          _debugMode = false;
          _debugLocals = null;
        }
        return code;
      }
      exports.emit = emit;
      exports.emitDebug = emitDebug;
    }
  });

  // safescript-upstream/src/compile.js
  var require_compile = __commonJS({
    "safescript-upstream/src/compile.js"(exports) {
      "use strict";
      var parser = require_parse();
      var validator = require_validate();
      var transformer = require_transform();
      var emitter = require_emit();
      var crypto;
      try {
        crypto = __require("crypto");
      } catch (e) {
      }
      function compile(source, opts) {
        opts = opts || {};
        var ast = parser.parse(source);
        var result = validator.validate(ast);
        if (!result.ok) {
          var err = new SyntaxError("SafeScript validation failed: " + result.errors.map(function(e) {
            return e.message;
          }).join("; "));
          err.errors = result.errors;
          throw err;
        }
        var transformed = transformer.transform(ast);
        var code;
        if (opts.debug) {
          code = emitter.emitDebug(transformed);
        } else {
          code = emitter.emit(transformed);
        }
        var hash = hashAST(transformed);
        return {
          code,
          ast: transformed,
          hash,
          debug: !!opts.debug
        };
      }
      function hashAST(ast) {
        if (!crypto) return null;
        var normalized = JSON.stringify(ast, function(key, value) {
          if (key === "loc" || key === "line" || key === "col") return void 0;
          return value;
        });
        return crypto.createHash("sha256").update(normalized).digest("hex");
      }
      function compileTail(source, fromLine, opts) {
        opts = opts || {};
        var localNames = opts.locals || [];
        var compiled = compile(source, { debug: true });
        var code = compiled.code;
        var initLines = [];
        for (var i = 0; i < localNames.length; i++) {
          var n = localNames[i];
          initLines.push("var " + n + ' = __locals["' + n + '"];');
        }
        var initCode = initLines.join("\n");
        var tailBody = '"use strict";\n' + initCode + "\n" + code;
        var AsyncFunction = Object.getPrototypeOf(async function() {
        }).constructor;
        var tailFn = new AsyncFunction(
          "__locals",
          "__scope",
          "__at",
          "__set",
          "__call",
          "__call_opt",
          "__new",
          "__check",
          "__thisCell",
          "__safeGlobals",
          "__dbg",
          tailBody
        );
        return tailFn;
      }
      exports.compile = compile;
      exports.compileTail = compileTail;
      exports.hashAST = hashAST;
    }
  });

  // safescript-upstream/src/header.js
  var require_header = __commonJS({
    "safescript-upstream/src/header.js"(exports) {
      "use strict";
      function extractHeader(source) {
        var s = source.trimStart();
        if (s.indexOf("/**") !== 0) return null;
        var end = s.indexOf("*/");
        if (end < 0) return null;
        return s.slice(3, end);
      }
      function parseHeader(source) {
        var result = {
          version: null,
          env: null,
          needs: [],
          uses: [],
          types: []
        };
        var text = extractHeader(source);
        if (!text) return result;
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].replace(/^\s*\*?\s?/, "").trim();
          if (!line) continue;
          var m = line.match(/^@safescript\s+(.+)$/);
          if (m) {
            result.version = m[1].trim();
            continue;
          }
          m = line.match(/^@env\s+(.+)$/);
          if (m) {
            result.env = m[1].split(",").map(function(e) {
              return e.trim();
            }).filter(Boolean);
            continue;
          }
          m = line.match(/^@needs\s+([\w$]+)\s*:\s*(.+)$/);
          if (m) {
            result.needs.push({ name: m[1], type: m[2].trim() });
            continue;
          }
          m = line.match(/^@needs\s+([\w$]+)\s*$/);
          if (m) {
            result.needs.push({ name: m[1], type: null });
            continue;
          }
          m = line.match(/^@uses\s+([\w$]+)\s*:\s*(.+)$/);
          if (m) {
            result.uses.push({ name: m[1], type: m[2].trim() });
            continue;
          }
          m = line.match(/^@uses\s+([\w$]+)\s*$/);
          if (m) {
            result.uses.push({ name: m[1], type: null });
            continue;
          }
          m = line.match(/^@type\s+(\w+)\s*\{\s*([^}]*)\}/);
          if (m) {
            var methods = m[2].split(",").map(function(s) {
              return s.trim();
            }).filter(Boolean);
            result.types.push({ name: m[1], methods });
            continue;
          }
        }
        return result;
      }
      function checkScope(header, scope) {
        var missing = [];
        if (!header || !header.needs) return { ok: true, missing };
        var keys = scope ? Object.keys(scope) : [];
        var available = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < keys.length; i++) {
          available[keys[i]] = 1;
        }
        for (var j = 0; j < header.needs.length; j++) {
          var name = header.needs[j].name;
          if (!available[name]) {
            missing.push(name);
          }
        }
        return { ok: missing.length === 0, missing };
      }
      var BUILTIN_TYPES = {
        // DOM types
        "SafeDOMDocument": { scopeKey: "document", provider: "dom" },
        "SafeHTMLElement": { scopeKey: null, provider: "dom" },
        // provided via DOM context
        // Window
        "SafeWindow": { scopeKey: "window", provider: "window" },
        // jQuery
        "SafeJQuery": { scopeKey: "$", provider: "dom" },
        // Qbix framework
        "SafeQ": { scopeKey: "Q", provider: "dom" },
        // Console
        "SafeConsole": { scopeKey: "console", provider: "console" },
        // Observers (IntersectionObserver, MutationObserver, ResizeObserver)
        "SafeObservers": { scopeKey: null, provider: "observers" },
        // Canvas / 2D drawing
        "SafeCanvas": { scopeKey: null, provider: "canvas" },
        // Audio / Video / Blob / URL.createObjectURL
        "SafeMedia": { scopeKey: null, provider: "media" },
        // location.hash, history.pushState/replaceState
        "SafeNavigation": { scopeKey: null, provider: "navigation" }
      };
      function resolveUses(header) {
        var result = {
          dom: false,
          window: false,
          console: false,
          observers: false,
          canvas: false,
          media: false,
          navigation: false,
          usesEntries: []
        };
        if (!header || !header.uses) return result;
        for (var i = 0; i < header.uses.length; i++) {
          var entry = header.uses[i];
          var typeName = entry.type;
          if (typeName && BUILTIN_TYPES[typeName]) {
            var builtin = BUILTIN_TYPES[typeName];
            result[builtin.provider] = true;
            result.usesEntries.push({
              name: entry.name,
              type: typeName,
              builtin
            });
          }
        }
        return result;
      }
      exports.parseHeader = parseHeader;
      exports.checkScope = checkScope;
      exports.resolveUses = resolveUses;
      exports.BUILTIN_TYPES = BUILTIN_TYPES;
    }
  });

  // safescript-upstream/src/dom/safe-document.js
  var require_safe_document = __commonJS({
    "safescript-upstream/src/dom/safe-document.js"(exports) {
      "use strict";
      var BLOCKED_DOCUMENT_PROPS = {
        cookie: 1,
        domain: 1,
        referrer: 1,
        URL: 1,
        documentURI: 1,
        write: 1,
        writeln: 1,
        open: 1,
        close: 1,
        defaultView: 1,
        head: 1,
        documentElement: 1,
        scripts: 1,
        stylesheets: 1,
        forms: 1,
        images: 1,
        links: 1,
        execCommand: 1,
        queryCommandEnabled: 1,
        queryCommandState: 1,
        createEvent: 1,
        createRange: 1,
        createNodeIterator: 1,
        createTreeWalker: 1,
        importNode: 1,
        adoptNode: 1,
        createAttribute: 1,
        createComment: 1,
        createProcessingInstruction: 1,
        createCDATASection: 1,
        caretPositionFromPoint: 1,
        caretRangeFromPoint: 1,
        elementFromPoint: 1,
        elementsFromPoint: 1,
        getSelection: 1,
        hasFocus: 1,
        fullscreenElement: 1,
        fullscreenEnabled: 1,
        exitFullscreen: 1,
        pointerLockElement: 1,
        exitPointerLock: 1,
        hidden: 1,
        visibilityState: 1,
        activeElement: 1,
        designMode: 1,
        contentType: 1,
        characterSet: 1,
        charset: 1,
        inputEncoding: 1,
        doctype: 1,
        implementation: 1,
        lastModified: 1,
        readyState: 1,
        title: 1,
        embeds: 1,
        plugins: 1,
        anchors: 1,
        applets: 1,
        all: 1
      };
      var CLOBBER_TARGETS = {
        cookie: 1,
        domain: 1,
        forms: 1,
        body: 1,
        head: 1,
        images: 1,
        links: 1,
        scripts: 1,
        title: 1,
        URL: 1,
        referrer: 1,
        location: 1,
        documentElement: 1,
        defaultView: 1,
        designMode: 1,
        all: 1,
        anchors: 1,
        applets: 1,
        embeds: 1,
        plugins: 1,
        stylesheets: 1
      };
      function isClobberingName(value) {
        return CLOBBER_TARGETS.hasOwnProperty(value);
      }
      function createSafeDocument(context) {
        var rootHandle = context.rootHandle;
        var rootNode = context.rootNode;
        var policy = context.policy;
        var ownership = context.ownership;
        var cache = context.cache;
        var budgets = context.budgets;
        var handleFactory = context.handleFactory;
        var tagAllowlist = {};
        if (policy.tags) {
          for (var i = 0; i < policy.tags.length; i++) {
            tagAllowlist[policy.tags[i].toLowerCase()] = true;
          }
        }
        var doc = /* @__PURE__ */ Object.create(null);
        doc.createElement = function(tag) {
          if (typeof tag !== "string") {
            throw new TypeError("SafeScript DOM: createElement requires a string tag name");
          }
          var lower = tag.toLowerCase();
          if (!tagAllowlist[lower]) {
            throw new Error("SafeScript DOM: element <" + lower + "> is not allowed");
          }
          budgets.allocNodes(1);
          var node = rootNode.ownerDocument.createElement(lower);
          ownership.markOwned(node);
          return handleFactory(node);
        };
        doc.createTextNode = function(text) {
          var t = String(text);
          budgets.checkTextSize(t);
          budgets.allocNodes(1);
          var node = rootNode.ownerDocument.createTextNode(t);
          ownership.markOwned(node);
          return handleFactory(node);
        };
        doc.createDocumentFragment = function() {
          var frag = rootNode.ownerDocument.createDocumentFragment();
          ownership.markOwned(frag);
          return handleFactory(frag);
        };
        doc.querySelector = function(selector) {
          if (typeof selector !== "string") {
            throw new TypeError("SafeScript DOM: querySelector requires a string selector");
          }
          if (selector.length > 512) {
            throw new Error("SafeScript DOM: selector exceeds 512-character limit");
          }
          var result = rootNode.querySelector(selector);
          if (!result) return null;
          if (!ownership.isInSubtree(result)) return null;
          return handleFactory(result);
        };
        doc.querySelectorAll = function(selector) {
          if (typeof selector !== "string") {
            throw new TypeError("SafeScript DOM: querySelectorAll requires a string selector");
          }
          if (selector.length > 512) {
            throw new Error("SafeScript DOM: selector exceeds 512-character limit");
          }
          var results = rootNode.querySelectorAll(selector);
          var arr = [];
          for (var j = 0; j < results.length; j++) {
            if (ownership.isInSubtree(results[j])) {
              arr.push(handleFactory(results[j]));
            }
          }
          return Object.freeze(arr);
        };
        doc.getElementById = function(id) {
          if (typeof id !== "string") return null;
          var escapedId = id.replace(/([^\w-])/g, "\\$1");
          var result = rootNode.querySelector("#" + escapedId);
          if (!result) return null;
          if (!ownership.isInSubtree(result)) return null;
          return handleFactory(result);
        };
        Object.defineProperty(doc, "body", {
          get: function() {
            return rootHandle;
          },
          enumerable: true,
          configurable: false
        });
        return Object.freeze(doc);
      }
      exports.createSafeDocument = createSafeDocument;
      exports.createSafeDOMDocument = createSafeDocument;
      exports.isClobberingName = isClobberingName;
      exports.BLOCKED_DOCUMENT_PROPS = BLOCKED_DOCUMENT_PROPS;
    }
  });

  // safescript-upstream/src/dom/sub-facades/classList.js
  var require_classList = __commonJS({
    "safescript-upstream/src/dom/sub-facades/classList.js"(exports) {
      "use strict";
      function validateToken(token) {
        if (typeof token !== "string" || token === "") {
          throw new TypeError("SafeScript: classList token must be a non-empty string");
        }
        if (/\s/.test(token)) {
          throw new TypeError('SafeScript: classList token must not contain whitespace: "' + token + '"');
        }
      }
      function createSafeClassList(nativeClassList, ownership, node) {
        function requireOwned() {
          if (!ownership.owns(node)) {
            throw new Error("SafeScript: cannot modify classList \u2014 node is not owned");
          }
        }
        var facade = /* @__PURE__ */ Object.create(null);
        facade.add = function() {
          requireOwned();
          for (var i = 0; i < arguments.length; i++) {
            validateToken(arguments[i]);
          }
          return nativeClassList.add.apply(nativeClassList, arguments);
        };
        facade.remove = function() {
          requireOwned();
          for (var i = 0; i < arguments.length; i++) {
            validateToken(arguments[i]);
          }
          return nativeClassList.remove.apply(nativeClassList, arguments);
        };
        facade.toggle = function(token, force) {
          requireOwned();
          validateToken(token);
          if (arguments.length > 1) {
            return nativeClassList.toggle(token, force);
          }
          return nativeClassList.toggle(token);
        };
        facade.contains = function(token) {
          validateToken(token);
          return nativeClassList.contains(token);
        };
        facade.replace = function(oldToken, newToken) {
          requireOwned();
          validateToken(oldToken);
          validateToken(newToken);
          return nativeClassList.replace(oldToken, newToken);
        };
        Object.defineProperty(facade, "length", {
          get: function() {
            return nativeClassList.length;
          },
          enumerable: true
        });
        Object.defineProperty(facade, "value", {
          get: function() {
            return nativeClassList.value;
          },
          enumerable: true
        });
        facade.toString = function() {
          return nativeClassList.toString();
        };
        return Object.freeze(facade);
      }
      exports.createSafeClassList = createSafeClassList;
      exports.create = function(node, context) {
        return createSafeClassList(node.classList, context.ownership, node);
      };
    }
  });

  // safescript-upstream/src/dom/sub-facades/style.js
  var require_style = __commonJS({
    "safescript-upstream/src/dom/sub-facades/style.js"(exports) {
      "use strict";
      var DANGEROUS_CSS_RE = /\b(url|expression|image-set|cross-fade|paint)\s*\(|(-moz-binding|-webkit-image-set)\s*[:(]/i;
      var CSS_PROPERTIES = [
        // Box model
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "margin",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "padding",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "border",
        "borderTop",
        "borderRight",
        "borderBottom",
        "borderLeft",
        "borderWidth",
        "borderStyle",
        "borderColor",
        "borderRadius",
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
        // Layout
        "display",
        "position",
        "top",
        "right",
        "bottom",
        "left",
        "float",
        "clear",
        "overflow",
        "overflowX",
        "overflowY",
        "zIndex",
        "visibility",
        "opacity",
        // Flexbox
        "flex",
        "flexDirection",
        "flexWrap",
        "flexFlow",
        "flexGrow",
        "flexShrink",
        "flexBasis",
        "justifyContent",
        "alignItems",
        "alignSelf",
        "alignContent",
        "order",
        "gap",
        "rowGap",
        "columnGap",
        // Grid
        "gridTemplateColumns",
        "gridTemplateRows",
        "gridColumn",
        "gridRow",
        "gridArea",
        "gridGap",
        "gridAutoFlow",
        // Typography
        "color",
        "font",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "lineHeight",
        "letterSpacing",
        "textAlign",
        "textDecoration",
        "textTransform",
        "textIndent",
        "textOverflow",
        "whiteSpace",
        "wordBreak",
        "wordWrap",
        "overflowWrap",
        // Background (values validated — url() stripped)
        "background",
        "backgroundColor",
        "backgroundPosition",
        "backgroundSize",
        "backgroundRepeat",
        "backgroundClip",
        // Transform and animation
        "transform",
        "transformOrigin",
        "transition",
        "transitionProperty",
        "transitionDuration",
        "transitionTimingFunction",
        "transitionDelay",
        "animation",
        "animationName",
        "animationDuration",
        "animationTimingFunction",
        "animationDelay",
        "animationIterationCount",
        "animationDirection",
        // Other
        "boxShadow",
        "textShadow",
        "outline",
        "outlineColor",
        "outlineStyle",
        "outlineWidth",
        "cursor",
        "pointerEvents",
        "userSelect",
        "boxSizing",
        "verticalAlign",
        "tableLayout",
        "borderCollapse",
        "borderSpacing",
        "listStyle",
        "listStyleType",
        "listStylePosition",
        "objectFit",
        "objectPosition",
        "aspectRatio",
        "filter",
        "backdropFilter",
        "mixBlendMode",
        "resize",
        "scrollBehavior",
        "touchAction",
        "willChange",
        "contain",
        "isolation",
        "appearance"
      ];
      function validateCSSValue(prop, value) {
        if (typeof value !== "string") return;
        if (DANGEROUS_CSS_RE.test(value)) {
          throw new Error(
            'SafeScript: CSS value for "' + prop + '" contains forbidden pattern (url(), expression(), or -moz-binding are not allowed)'
          );
        }
      }
      function validateCSSText(cssText) {
        if (typeof cssText !== "string") return;
        if (DANGEROUS_CSS_RE.test(cssText)) {
          throw new Error(
            "SafeScript: cssText contains forbidden pattern (url(), expression(), or -moz-binding are not allowed)"
          );
        }
      }
      function createSafeStyle(nativeStyle, policy, node, context) {
        var facade = /* @__PURE__ */ Object.create(null);
        var allowedProps = null;
        if (policy && policy.styles) {
          allowedProps = /* @__PURE__ */ Object.create(null);
          for (var s = 0; s < policy.styles.length; s++) {
            allowedProps[policy.styles[s]] = true;
          }
        }
        function checkPropAllowed(prop) {
          if (allowedProps && !allowedProps[prop]) {
            throw new Error('SafeScript: CSS property "' + prop + '" is not allowed by policy');
          }
        }
        for (var i = 0; i < CSS_PROPERTIES.length; i++) {
          (function(prop) {
            var jKey = "style:" + prop;
            Object.defineProperty(facade, prop, {
              get: function() {
                if (context && context.journalRead && node) {
                  return context.journalRead(node, jKey);
                }
                return nativeStyle[prop];
              },
              set: function(value) {
                checkPropAllowed(prop);
                validateCSSValue(prop, value);
                if (context && context.journalWrite && node) {
                  context.journalWrite(node, jKey, nativeStyle[prop], value, "style-set");
                } else {
                  nativeStyle[prop] = value;
                }
              },
              enumerable: true,
              configurable: false
            });
          })(CSS_PROPERTIES[i]);
        }
        Object.defineProperty(facade, "cssText", {
          get: function() {
            if (context && context.journalRead && node) {
              return context.journalRead(node, "style:cssText");
            }
            return nativeStyle.cssText;
          },
          set: function(value) {
            validateCSSText(value);
            if (context && context.journalWrite && node) {
              context.journalWrite(node, "style:cssText", nativeStyle.cssText, value, "style-set");
            } else {
              nativeStyle.cssText = value;
            }
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(facade, "length", {
          get: function() {
            return nativeStyle.length;
          },
          enumerable: true
        });
        facade.getPropertyValue = function(prop) {
          checkPropAllowed(prop);
          if (context && context.journalRead && node) {
            return context.journalRead(node, "style:" + prop);
          }
          return nativeStyle.getPropertyValue(prop);
        };
        facade.setProperty = function(prop, value, priority) {
          checkPropAllowed(prop);
          validateCSSValue(prop, value);
          if (context && context.journalWrite && node) {
            context.journalWrite(node, "style:" + prop, nativeStyle.getPropertyValue(prop), value, "style-setProperty");
          } else {
            nativeStyle.setProperty(prop, value, priority || "");
          }
        };
        facade.removeProperty = function(prop) {
          checkPropAllowed(prop);
          if (context && context.journalWrite && node) {
            context.journalWrite(node, "style:" + prop, nativeStyle.getPropertyValue(prop), "", "style-removeProperty");
          } else {
            return nativeStyle.removeProperty(prop);
          }
        };
        facade.getPropertyPriority = function(prop) {
          return nativeStyle.getPropertyPriority(prop);
        };
        facade.item = function(index) {
          return nativeStyle.item(index);
        };
        Object.preventExtensions(facade);
        return facade;
      }
      exports.createSafeStyle = createSafeStyle;
      exports.validateCSSValue = validateCSSValue;
      exports.DANGEROUS_CSS_RE = DANGEROUS_CSS_RE;
      exports.create = function(node, context) {
        return createSafeStyle(node.style, context.policy, node, context);
      };
    }
  });

  // safescript-upstream/src/dom/sub-facades/dataset.js
  var require_dataset = __commonJS({
    "safescript-upstream/src/dom/sub-facades/dataset.js"(exports) {
      "use strict";
      function keyToAttr(key) {
        return "data-" + key.replace(/[A-Z]/g, function(ch) {
          return "-" + ch.toLowerCase();
        });
      }
      function isDataAttrAllowed(attrName, tagName, policy) {
        if (!policy || !policy.attributes) return true;
        var globalAttrs = policy.attributes["*"];
        if (globalAttrs) {
          for (var i = 0; i < globalAttrs.length; i++) {
            if (globalAttrs[i] === "data-*") return true;
            if (globalAttrs[i] === attrName) return true;
          }
        }
        var tagAttrs = policy.attributes[tagName];
        if (tagAttrs) {
          for (var j = 0; j < tagAttrs.length; j++) {
            if (tagAttrs[j] === "data-*") return true;
            if (tagAttrs[j] === attrName) return true;
          }
        }
        return false;
      }
      function createSafeDataset(nativeDataset, ownership, node, policy) {
        var tagName = (node.tagName || "").toLowerCase();
        var facade = /* @__PURE__ */ Object.create(null);
        facade.get = function(key) {
          if (typeof key !== "string") return void 0;
          return nativeDataset[key];
        };
        facade.set = function(key, value) {
          if (typeof key !== "string" || key === "") {
            throw new TypeError("SafeScript: dataset key must be a non-empty string");
          }
          if (!ownership.owns(node)) {
            throw new Error("SafeScript: cannot modify dataset \u2014 node is not owned");
          }
          var attrName = keyToAttr(key);
          if (!isDataAttrAllowed(attrName, tagName, policy)) {
            throw new Error('SafeScript: data attribute "' + attrName + '" is not allowed by policy');
          }
          nativeDataset[key] = String(value);
        };
        facade.remove = function(key) {
          if (typeof key !== "string") return false;
          if (!ownership.owns(node)) {
            throw new Error("SafeScript: cannot modify dataset \u2014 node is not owned");
          }
          if (key in nativeDataset) {
            delete nativeDataset[key];
            return true;
          }
          return false;
        };
        facade.has = function(key) {
          if (typeof key !== "string") return false;
          return key in nativeDataset;
        };
        facade.keys = function() {
          return Object.keys(nativeDataset);
        };
        return Object.freeze(facade);
      }
      exports.createSafeDataset = createSafeDataset;
      exports.create = function(node, context) {
        return createSafeDataset(node.dataset, context.ownership, node, context.policy);
      };
    }
  });

  // safescript-upstream/src/dom/safe-handle.js
  var require_safe_handle = __commonJS({
    "safescript-upstream/src/dom/safe-handle.js"(exports) {
      "use strict";
      var _handleToNode = /* @__PURE__ */ new WeakMap();
      var _handleToContext = /* @__PURE__ */ new WeakMap();
      var SCALAR_READ_PROPS = [
        "tagName",
        "nodeName",
        "nodeType",
        "childElementCount",
        "offsetWidth",
        "offsetHeight",
        "offsetTop",
        "offsetLeft",
        "scrollWidth",
        "scrollHeight",
        "clientWidth",
        "clientHeight"
      ];
      var FORM_READ_PROPS = ["value", "checked", "disabled", "selected"];
      var NODE_PROPS = [
        "parentElement",
        "firstChild",
        "lastChild",
        "nextSibling",
        "previousSibling"
      ];
      var NODELIST_PROPS = ["children", "childNodes"];
      function createSafeHandle(node, context) {
        var handle = /* @__PURE__ */ Object.create(null);
        Object.defineProperty(handle, "__isSafeHandle", {
          value: true,
          enumerable: false,
          configurable: false,
          writable: false
        });
        function wrap(n) {
          if (n == null) return null;
          return context.cache.getOrCreate(n, context);
        }
        function wrapList(nl) {
          var out = [];
          for (var i2 = 0; i2 < nl.length; i2++) {
            var n = nl[i2];
            if (context.ownership.checkRead(n)) {
              out.push(wrap(n));
            }
          }
          return Object.freeze(out);
        }
        var i, prop;
        for (i = 0; i < SCALAR_READ_PROPS.length; i++) {
          prop = SCALAR_READ_PROPS[i];
          (function(p) {
            Object.defineProperty(handle, p, {
              get: function() {
                return node[p];
              },
              enumerable: true,
              configurable: false
            });
          })(prop);
        }
        for (i = 0; i < FORM_READ_PROPS.length; i++) {
          prop = FORM_READ_PROPS[i];
          (function(p) {
            Object.defineProperty(handle, p, {
              get: function() {
                if (context.journalRead) return context.journalRead(node, p);
                return node[p];
              },
              set: function(v) {
                context.ownership.checkMutation(node, "set " + p);
                if (context.journalWrite) {
                  context.journalWrite(node, p, node[p], v, "set " + p);
                  return;
                }
                node[p] = v;
              },
              enumerable: true,
              configurable: false
            });
          })(prop);
        }
        Object.defineProperty(handle, "textContent", {
          get: function() {
            if (context.journalRead) return context.journalRead(node, "textContent");
            return node.textContent;
          },
          set: function(v) {
            context.ownership.checkMutation(node, "set textContent");
            var s = String(v);
            var limits = context.policy && context.policy.limits;
            var maxBytes = limits && limits.maxTextBytes || 262144;
            if (s.length > maxBytes) {
              throw new RangeError("SafeScript DOM: textContent exceeds limit (" + maxBytes + " bytes)");
            }
            if (context.journalWrite) {
              context.journalWrite(node, "textContent", node.textContent, s, "set textContent");
              return;
            }
            node.textContent = s;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "innerHTML", {
          get: function() {
            if (context.journalRead) return context.journalRead(node, "innerHTML");
            return node.innerHTML;
          },
          set: function(v) {
            context.ownership.checkMutation(node, "set innerHTML");
            var s = String(v);
            var limits = context.policy && context.policy.limits;
            var maxBytes = limits && limits.maxHTMLBytes || 262144;
            if (s.length > maxBytes) {
              throw new RangeError("SafeScript DOM: innerHTML exceeds limit (" + maxBytes + " bytes)");
            }
            if (context.sanitizer) {
              s = context.sanitizer.sanitize(s, context.policy);
            }
            if (context.journalWrite) {
              context.journalWrite(node, "innerHTML", node.innerHTML, s, "set innerHTML");
              return;
            }
            node.innerHTML = s;
            var newCount = _countChildren(node);
            if (context.budgets) context.budgets.allocNodes(newCount);
            _markChildrenOwned(node, context);
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "outerHTML", {
          get: function() {
            return node.outerHTML;
          },
          set: function(v) {
            if (context.ownership.isAtBoundary(node)) {
              throw new TypeError("SafeScript DOM: cannot set outerHTML on the root element");
            }
            context.ownership.checkMutation(node, "set outerHTML");
            var s = String(v);
            var limits = context.policy && context.policy.limits;
            var maxBytes = limits && limits.maxHTMLBytes || 262144;
            if (s.length > maxBytes) {
              throw new RangeError("SafeScript DOM: outerHTML exceeds limit (" + maxBytes + " bytes)");
            }
            if (context.sanitizer) {
              s = context.sanitizer.sanitize(s, context.policy);
            }
            var parent = node.parentNode;
            var prevSib = node.previousSibling;
            var nextSib = node.nextSibling;
            node.outerHTML = s;
            if (parent) {
              var cur = prevSib ? prevSib.nextSibling : parent.firstChild;
              var newCount = 0;
              while (cur && cur !== nextSib) {
                newCount++;
                newCount += _countChildren(cur);
                context.ownership.markOwned(cur);
                _markChildrenOwned(cur, context);
                cur = cur.nextSibling;
              }
              if (newCount > 0 && context.budgets) {
                context.budgets.allocNodes(newCount);
              }
            }
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "className", {
          get: function() {
            return node.className;
          },
          set: function(v) {
            context.ownership.checkMutation(node, "set className");
            node.className = String(v);
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "id", {
          get: function() {
            return node.id;
          },
          set: function(v) {
            context.ownership.checkMutation(node, "set id");
            var idVal = String(v);
            var isClobberingName = require_safe_document().isClobberingName;
            if (isClobberingName(idVal)) {
              throw new TypeError('SafeScript DOM: id "' + idVal + '" would shadow a document property');
            }
            node.id = idVal;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "scrollTop", {
          get: function() {
            return node.scrollTop;
          },
          set: function(v) {
            node.scrollTop = v;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "scrollLeft", {
          get: function() {
            return node.scrollLeft;
          },
          set: function(v) {
            node.scrollLeft = v;
          },
          enumerable: true,
          configurable: false
        });
        for (i = 0; i < NODE_PROPS.length; i++) {
          prop = NODE_PROPS[i];
          (function(p) {
            Object.defineProperty(handle, p, {
              get: function() {
                var target = node[p];
                if (target == null) return null;
                if (p === "parentElement") {
                  if (context.ownership.isAtBoundary(node)) return null;
                  if (!context.ownership.checkRead(target)) return null;
                }
                if (p === "nextSibling" || p === "previousSibling") {
                  if (!context.ownership.checkRead(target)) return null;
                }
                return wrap(target);
              },
              enumerable: true,
              configurable: false
            });
          })(prop);
        }
        for (i = 0; i < NODELIST_PROPS.length; i++) {
          prop = NODELIST_PROPS[i];
          (function(p) {
            Object.defineProperty(handle, p, {
              get: function() {
                return wrapList(node[p]);
              },
              enumerable: true,
              configurable: false
            });
          })(prop);
        }
        Object.defineProperty(handle, "attributes", {
          get: function() {
            var attrs = node.attributes;
            var out = [];
            for (var a = 0; a < attrs.length; a++) {
              out.push({ name: attrs[a].name, value: attrs[a].value });
            }
            return Object.freeze(out);
          },
          enumerable: true,
          configurable: false
        });
        var _classList = null, _style = null, _dataset = null;
        Object.defineProperty(handle, "classList", {
          get: function() {
            if (!_classList) {
              var SafeClassList = require_classList();
              _classList = SafeClassList.create(node, context, handle);
            }
            return _classList;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "style", {
          get: function() {
            if (!_style) {
              var SafeStyle = require_style();
              _style = SafeStyle.create(node, context, handle);
            }
            return _style;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(handle, "dataset", {
          get: function() {
            if (!_dataset) {
              var SafeDataset = require_dataset();
              _dataset = SafeDataset.create(node, context, handle);
            }
            return _dataset;
          },
          enumerable: true,
          configurable: false
        });
        handle.getAttribute = function(name) {
          var attrKey = "attr:" + String(name).toLowerCase();
          if (context.journalRead) return context.journalRead(node, attrKey);
          return node.getAttribute(String(name));
        };
        handle.setAttribute = function(name, value) {
          context.ownership.checkMutation(node, "setAttribute");
          var n = String(name).toLowerCase();
          var v = String(value);
          if (n.indexOf("on") === 0 && n.length > 2) {
            throw new TypeError('SafeScript DOM: cannot set event handler attribute "' + n + '" \u2014 use addEventListener instead');
          }
          _checkAttribute(node.tagName.toLowerCase(), n, context.policy);
          if (_isURLAttribute(n)) {
            _checkURL(v, node.tagName.toLowerCase(), n, context);
          }
          if (context.journalWrite) {
            context.journalWrite(node, "attr:" + n, node.getAttribute(n), v, "setAttribute");
            return;
          }
          node.setAttribute(n, v);
          if (n === "target" && v === "_blank") {
            var tagLower = node.tagName.toLowerCase();
            if (tagLower === "a" || tagLower === "area") {
              var rel = node.getAttribute("rel") || "";
              var hasNoopener = rel.indexOf("noopener") !== -1;
              var hasNoreferrer = rel.indexOf("noreferrer") !== -1;
              if (!hasNoopener || !hasNoreferrer) {
                var parts = rel ? rel.split(/\s+/) : [];
                if (!hasNoopener) parts.push("noopener");
                if (!hasNoreferrer) parts.push("noreferrer");
                node.setAttribute("rel", parts.join(" "));
              }
            }
          }
        };
        handle.removeAttribute = function(name) {
          context.ownership.checkMutation(node, "removeAttribute");
          var n = String(name).toLowerCase();
          if (context.journalWrite) {
            context.journalWrite(node, "attr:" + n, node.getAttribute(n), null, "removeAttribute");
            return;
          }
          node.removeAttribute(n);
        };
        handle.hasAttribute = function(name) {
          return node.hasAttribute(String(name));
        };
        handle.appendChild = function(child) {
          context.ownership.checkMutation(node, "appendChild");
          var childNode = _unwrap(child);
          _checkNodeBudget(context);
          if (context._effectLog) {
            context._effectLog.push({
              kind: "dom",
              op: "appendChild",
              node,
              child: childNode,
              tagName: node.tagName || "",
              childTag: childNode.tagName || ""
            });
          }
          node.appendChild(childNode);
          context.ownership.markOwned(childNode);
          return wrap(childNode);
        };
        handle.insertBefore = function(newChild, refChild) {
          context.ownership.checkMutation(node, "insertBefore");
          var newNode = _unwrap(newChild);
          var refNode = refChild ? _unwrap(refChild) : null;
          _checkNodeBudget(context);
          if (context._effectLog) {
            context._effectLog.push({
              kind: "dom",
              op: "insertBefore",
              node,
              child: newNode,
              tagName: node.tagName || "",
              childTag: newNode.tagName || ""
            });
          }
          node.insertBefore(newNode, refNode);
          context.ownership.markOwned(newNode);
          return wrap(newNode);
        };
        handle.removeChild = function(child) {
          context.ownership.checkMutation(node, "removeChild");
          var childNode = _unwrap(child);
          node.removeChild(childNode);
          return wrap(childNode);
        };
        handle.replaceChild = function(newChild, oldChild) {
          context.ownership.checkMutation(node, "replaceChild");
          var newNode = _unwrap(newChild);
          var oldNode = _unwrap(oldChild);
          node.replaceChild(newNode, oldNode);
          context.ownership.markOwned(newNode);
          return wrap(oldNode);
        };
        handle.replaceChildren = function() {
          context.ownership.checkMutation(node, "replaceChildren");
          var nativeArgs = [];
          for (var a = 0; a < arguments.length; a++) {
            var arg = arguments[a];
            if (typeof arg === "string") {
              nativeArgs.push(arg);
            } else {
              nativeArgs.push(_unwrap(arg));
            }
          }
          node.replaceChildren.apply(node, nativeArgs);
          var newCount = _countChildren(node);
          if (context.budgets) context.budgets.allocNodes(newCount);
          _markChildrenOwned(node, context);
        };
        handle.cloneNode = function(deep) {
          if (deep) {
            throw new TypeError("SafeScript DOM: cloneNode(true) is denied \u2014 use shallow clone and rebuild");
          }
          var clone = node.cloneNode(false);
          if (clone.attributes) {
            var attrs = clone.attributes;
            var toRemove = [];
            for (var ci = 0; ci < attrs.length; ci++) {
              var an = attrs[ci].name.toLowerCase();
              var av = attrs[ci].value;
              if (an.indexOf("on") === 0 && an.length > 2) {
                toRemove.push(attrs[ci].name);
                continue;
              }
              try {
                _checkAttribute(clone.tagName.toLowerCase(), an, context.policy);
              } catch (e) {
                toRemove.push(attrs[ci].name);
                continue;
              }
              if (_isURLAttribute(an)) {
                try {
                  _checkURL(av, clone.tagName.toLowerCase(), an, context);
                } catch (e) {
                  toRemove.push(attrs[ci].name);
                }
              }
            }
            for (var cr = 0; cr < toRemove.length; cr++) {
              clone.removeAttribute(toRemove[cr]);
            }
          }
          _checkNodeBudget(context);
          context.ownership.markOwned(clone);
          return wrap(clone);
        };
        handle.querySelector = function(selector) {
          var sel = String(selector);
          if (sel.length > 512) {
            throw new Error("SafeScript DOM: selector exceeds 512-character limit");
          }
          var result = node.querySelector(sel);
          if (result == null) return null;
          if (!context.ownership.checkRead(result)) return null;
          return wrap(result);
        };
        handle.querySelectorAll = function(selector) {
          var sel = String(selector);
          if (sel.length > 512) {
            throw new Error("SafeScript DOM: selector exceeds 512-character limit");
          }
          var results = node.querySelectorAll(sel);
          return wrapList(results);
        };
        handle.closest = function(selector) {
          var sel = String(selector);
          if (sel.length > 512) {
            throw new Error("SafeScript DOM: selector exceeds 512-character limit");
          }
          var current = node;
          while (current) {
            if (context.ownership.isAtBoundary(current)) {
              if (current.matches && current.matches(sel)) {
                return wrap(current);
              }
              return null;
            }
            if (current.matches && current.matches(sel)) {
              if (context.ownership.checkRead(current)) {
                return wrap(current);
              }
              return null;
            }
            current = current.parentElement;
          }
          return null;
        };
        handle.matches = function(selector) {
          var sel = String(selector);
          if (sel.length > 512) {
            throw new Error("SafeScript DOM: selector exceeds 512-character limit");
          }
          return node.matches(sel);
        };
        handle.addEventListener = function(type, callback, options) {
          if (context.eventBridge) {
            context.eventBridge.addEventListener(node, type, callback, options, context);
          } else {
            throw new TypeError("SafeScript DOM: event handling not available");
          }
        };
        handle.removeEventListener = function(type, callback, options) {
          if (context.eventBridge) {
            context.eventBridge.removeEventListener(node, type, callback, options);
          } else {
            throw new TypeError("SafeScript DOM: event handling not available");
          }
        };
        handle.focus = function() {
          context.ownership.checkMutation(node, "focus");
          node.focus();
        };
        handle.blur = function() {
          context.ownership.checkMutation(node, "blur");
          node.blur();
        };
        handle.click = function() {
          context.ownership.checkMutation(node, "click");
          node.click();
        };
        handle.getBoundingClientRect = function() {
          var rect = node.getBoundingClientRect();
          return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
          };
        };
        handle.remove = function() {
          if (context.ownership.isAtBoundary(node)) {
            throw new TypeError("SafeScript DOM: cannot remove the root element");
          }
          context.ownership.checkMutation(node, "remove");
          node.remove();
        };
        handle.insertAdjacentHTML = function(position, html) {
          var pos = String(position);
          if (context.ownership.isAtBoundary(node)) {
            if (pos === "beforebegin" || pos === "afterend") {
              throw new TypeError('SafeScript DOM: cannot insertAdjacentHTML "' + pos + '" on the root element \u2014 would escape subtree');
            }
          }
          context.ownership.checkMutation(node, "insertAdjacentHTML");
          var s = String(html);
          var limits = context.policy && context.policy.limits;
          var maxBytes = limits && limits.maxHTMLBytes || 262144;
          if (s.length > maxBytes) {
            throw new RangeError("SafeScript DOM: insertAdjacentHTML exceeds limit (" + maxBytes + " bytes)");
          }
          if (context.sanitizer) {
            s = context.sanitizer.sanitize(s, context.policy);
          }
          node.insertAdjacentHTML(pos, s);
          var newCount = _countChildren(node);
          if (context.budgets) context.budgets.allocNodes(newCount);
          _markChildrenOwned(node, context);
        };
        handle.insertAdjacentElement = function(position, element) {
          var pos = String(position);
          if (context.ownership.isAtBoundary(node)) {
            if (pos === "beforebegin" || pos === "afterend") {
              throw new TypeError('SafeScript DOM: cannot insertAdjacentElement "' + pos + '" on the root element \u2014 would escape subtree');
            }
          }
          context.ownership.checkMutation(node, "insertAdjacentElement");
          var el = _unwrap(element);
          _checkNodeBudget(context);
          var result = node.insertAdjacentElement(pos, el);
          if (result) {
            context.ownership.markOwned(el);
          }
          return result ? wrap(result) : null;
        };
        _handleToNode.set(handle, node);
        _handleToContext.set(handle, context);
        Object.freeze(handle);
        return handle;
      }
      function _unwrap(handleOrNode) {
        if (handleOrNode == null) return null;
        if (handleOrNode.__isSafeHandle) {
          var n = _handleToNode.get(handleOrNode);
          if (n) return n;
        }
        if (typeof handleOrNode === "string") return handleOrNode;
        throw new TypeError("SafeScript DOM: expected a SafeHandle, got " + typeof handleOrNode);
      }
      function _countChildren(parentNode) {
        var count = 0;
        var child = parentNode.firstChild;
        while (child) {
          count++;
          count += _countChildren(child);
          child = child.nextSibling;
        }
        return count;
      }
      function _markChildrenOwned(parentNode, context) {
        var child = parentNode.firstChild;
        while (child) {
          context.ownership.markOwned(child);
          _markChildrenOwned(child, context);
          child = child.nextSibling;
        }
      }
      function _checkNodeBudget(context) {
        if (context.budgets) {
          context.budgets.allocNodes(1);
        }
      }
      function _checkAttribute(tag, attr, policy) {
        if (!policy || !policy.attributes) return;
        var allowed = policy.attributes[tag] || [];
        var globalAllowed = policy.attributes["*"] || [];
        for (var i = 0; i < globalAllowed.length; i++) {
          var pattern = globalAllowed[i];
          if (_matchesAttrPattern(attr, pattern)) return;
        }
        for (var j = 0; j < allowed.length; j++) {
          if (_matchesAttrPattern(attr, allowed[j])) return;
        }
        throw new TypeError('SafeScript DOM: attribute "' + attr + '" not allowed on <' + tag + ">");
      }
      function _matchesAttrPattern(attr, pattern) {
        if (pattern === attr) return true;
        if (pattern.charAt(pattern.length - 1) === "*") {
          var prefix = pattern.slice(0, -1);
          if (attr.indexOf(prefix) === 0) return true;
        }
        return false;
      }
      function _isURLAttribute(name) {
        return name === "src" || name === "href" || name === "action" || name === "formaction" || name === "poster" || name === "srcset";
      }
      function _checkURL(url, tag, attr, context) {
        var lower = url.toLowerCase().replace(/\s/g, "");
        if (lower.indexOf("javascript:") === 0) {
          throw new TypeError("SafeScript DOM: javascript: URLs are denied");
        }
        if (lower.indexOf("data:") === 0 && lower.indexOf("data:image/") !== 0) {
          throw new TypeError("SafeScript DOM: data: URLs are denied (except data:image/*)");
        }
        if (tag === "use" && (attr === "href" || attr === "xlink:href")) {
          if (url.charAt(0) !== "#") {
            throw new TypeError("SafeScript DOM: <use> href must be a fragment reference (start with #)");
          }
        }
        if (!context.policy || !context.policy.url) return;
        var purpose = _urlPurpose(tag, attr);
        var result = context.policy.url({
          element: tag,
          attribute: attr,
          url,
          purpose
        });
        if (result && result.allow === false) {
          throw new TypeError("SafeScript DOM: URL denied by policy \u2014 " + url);
        }
      }
      function _urlPurpose(tag, attr) {
        if (attr === "href" && tag === "a") return "navigation";
        if (attr === "src" && (tag === "img" || tag === "input")) return "image";
        if (attr === "poster") return "image";
        if (attr === "src" && (tag === "video" || tag === "audio" || tag === "source" || tag === "track")) return "media";
        if (attr === "href" && tag === "link") return "style";
        if (attr === "action" || attr === "formaction") return "form";
        return "other";
      }
      function resolveNode(handle) {
        return _handleToNode.get(handle);
      }
      function resolveContext(handle) {
        return _handleToContext.get(handle);
      }
      exports.createSafeHandle = createSafeHandle;
      exports.createSafeHTMLElement = createSafeHandle;
      exports.resolveNode = resolveNode;
      exports.resolveContext = resolveContext;
    }
  });

  // safescript-upstream/src/dom/identity-cache.js
  var require_identity_cache = __commonJS({
    "safescript-upstream/src/dom/identity-cache.js"(exports, module) {
      "use strict";
      var createSafeHandle = require_safe_handle().createSafeHandle;
      function IdentityCache() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._stale = /* @__PURE__ */ new WeakSet();
      }
      IdentityCache.prototype.getOrCreate = function(node, context) {
        if (node == null) return null;
        if (this._stale.has(node)) {
          this._stale.delete(node);
          this._map.delete(node);
        }
        var existing = this._map.get(node);
        if (existing) return existing;
        var handle = createSafeHandle(node, context);
        this._map.set(node, handle);
        return handle;
      };
      IdentityCache.prototype.invalidate = function(node) {
        if (node == null) return;
        this._stale.add(node);
      };
      IdentityCache.prototype.has = function(node) {
        if (node == null) return false;
        if (this._stale.has(node)) return false;
        return this._map.has(node);
      };
      IdentityCache.prototype.clear = function() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._stale = /* @__PURE__ */ new WeakSet();
      };
      module.exports = IdentityCache;
    }
  });

  // safescript-upstream/src/dom/ownership.js
  var require_ownership = __commonJS({
    "safescript-upstream/src/dom/ownership.js"(exports, module) {
      "use strict";
      function Ownership(root) {
        this._root = root;
        this._owned = /* @__PURE__ */ new WeakSet();
        this._readable = /* @__PURE__ */ new WeakSet();
        this._detached = /* @__PURE__ */ new WeakSet();
        if (root) {
          this._markSubtreeOwned(root);
        }
      }
      Ownership.prototype._markSubtreeOwned = function(node) {
        this._owned.add(node);
        var child = node.firstChild;
        while (child) {
          this._markSubtreeOwned(child);
          child = child.nextSibling;
        }
      };
      Ownership.prototype.getRoot = function() {
        return this._root;
      };
      Ownership.prototype.owns = function(node) {
        if (node == null) return false;
        if (this._detached.has(node)) return false;
        return this._owned.has(node);
      };
      Ownership.prototype.markOwned = function(node) {
        if (node == null) return;
        this._detached.delete(node);
        this._owned.add(node);
      };
      Ownership.prototype.grantRead = function(node, deep) {
        if (node == null) return;
        this._readable.add(node);
        if (deep) {
          var child = node.firstChild;
          while (child) {
            this.grantRead(child, true);
            child = child.nextSibling;
          }
        }
      };
      Ownership.prototype.markDetached = function(node) {
        if (node == null) return;
        this._detached.add(node);
      };
      Ownership.prototype.isInSubtree = function(node) {
        if (node == null) return false;
        if (this._root == null) return false;
        if (node === this._root) return true;
        return this._root.contains(node);
      };
      Ownership.prototype.checkRead = function(node) {
        if (node == null) return false;
        if (this.owns(node)) return true;
        if (this._readable.has(node)) return true;
        return false;
      };
      Ownership.prototype.checkMutation = function(node, operation) {
        if (!this.owns(node)) {
          var op = operation || "mutate";
          throw new TypeError("SafeScript DOM: cannot " + op + " a node that is not owned by this execution context");
        }
      };
      Ownership.prototype.isAtBoundary = function(node) {
        return node === this._root;
      };
      Ownership.prototype.filterOwned = function(nodes) {
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
          if (this.owns(nodes[i]) || this._readable.has(nodes[i])) {
            result.push(nodes[i]);
          }
        }
        return result;
      };
      Ownership.prototype.clear = function() {
        this._root = null;
        this._owned = /* @__PURE__ */ new WeakSet();
        this._readable = /* @__PURE__ */ new WeakSet();
        this._detached = /* @__PURE__ */ new WeakSet();
      };
      module.exports = Ownership;
    }
  });

  // safescript-upstream/src/dom/budgets.js
  var require_budgets = __commonJS({
    "safescript-upstream/src/dom/budgets.js"(exports) {
      "use strict";
      var DEFAULTS = {
        maxNodes: 5e3,
        maxTextBytes: 262144,
        // 256 KB
        maxHTMLBytes: 262144,
        // 256 KB
        maxListeners: 100,
        maxActiveTimers: 20,
        maxTimerFrequency: 50
        // minimum ms between timer fires
      };
      function createBudgets(limits) {
        var cfg = {};
        var k;
        for (k in DEFAULTS) {
          if (DEFAULTS.hasOwnProperty(k)) {
            cfg[k] = limits && limits.hasOwnProperty(k) ? limits[k] : DEFAULTS[k];
          }
        }
        var nodeCount = 0;
        var listenerCount = 0;
        var activeTimers = 0;
        return {
          /** Check whether creating n more nodes is within budget. Throws if not. */
          allocNodes: function(n) {
            if (nodeCount + n > cfg.maxNodes) {
              throw new RangeError(
                "SafeScript DOM: node budget exceeded (" + (nodeCount + n) + " > " + cfg.maxNodes + ")"
              );
            }
            nodeCount += n;
          },
          /** Release n nodes from the budget (node removed / detached). */
          releaseNodes: function(n) {
            nodeCount -= n;
            if (nodeCount < 0) nodeCount = 0;
          },
          /** Current node count. */
          getNodeCount: function() {
            return nodeCount;
          },
          /** Set node count directly (e.g. after counting root's existing children). */
          setNodeCount: function(n) {
            nodeCount = n;
          },
          /** Check text assignment size. Throws if over limit. */
          checkTextSize: function(text) {
            var bytes = typeof text === "string" ? text.length * 2 : 0;
            if (bytes > cfg.maxTextBytes) {
              throw new RangeError(
                "SafeScript DOM: text size exceeded (" + bytes + " bytes > " + cfg.maxTextBytes + ")"
              );
            }
          },
          /** Check HTML assignment size. Throws if over limit. */
          checkHTMLSize: function(html) {
            var bytes = typeof html === "string" ? html.length * 2 : 0;
            if (bytes > cfg.maxHTMLBytes) {
              throw new RangeError(
                "SafeScript DOM: HTML size exceeded (" + bytes + " bytes > " + cfg.maxHTMLBytes + ")"
              );
            }
          },
          /** Allocate a listener slot. Throws if over budget. */
          allocListener: function() {
            if (listenerCount + 1 > cfg.maxListeners) {
              throw new RangeError(
                "SafeScript DOM: listener budget exceeded (" + (listenerCount + 1) + " > " + cfg.maxListeners + ")"
              );
            }
            listenerCount++;
          },
          /** Release a listener slot. */
          releaseListener: function() {
            listenerCount--;
            if (listenerCount < 0) listenerCount = 0;
          },
          /** Allocate a timer slot. Throws if over budget. */
          allocTimer: function() {
            if (activeTimers + 1 > cfg.maxActiveTimers) {
              throw new RangeError(
                "SafeScript DOM: timer budget exceeded (" + (activeTimers + 1) + " > " + cfg.maxActiveTimers + ")"
              );
            }
            activeTimers++;
          },
          /** Release a timer slot. */
          releaseTimer: function() {
            activeTimers--;
            if (activeTimers < 0) activeTimers = 0;
          },
          /** Get minimum timer interval. */
          getMinTimerInterval: function() {
            return cfg.maxTimerFrequency;
          },
          /** Get the raw config. */
          getConfig: function() {
            return cfg;
          },
          /** Count nodes in a subtree (for initial budget accounting). */
          countSubtreeNodes: function(root) {
            var count = 0;
            var walker = function(node) {
              count++;
              var child = node.firstChild;
              while (child) {
                walker(child);
                child = child.nextSibling;
              }
            };
            walker(root);
            return count;
          }
        };
      }
      exports.createBudgets = createBudgets;
      exports.DEFAULTS = DEFAULTS;
    }
  });

  // safescript-upstream/src/dom/safe-timers.js
  var require_safe_timers = __commonJS({
    "safescript-upstream/src/dom/safe-timers.js"(exports) {
      "use strict";
      function createSafeTimers(budgets) {
        var activeIds = /* @__PURE__ */ Object.create(null);
        var nextId = 1;
        function safeSetTimeout(callback, delay) {
          if (typeof callback !== "function") {
            throw new TypeError("SafeScript DOM: setTimeout requires a function callback");
          }
          var d = Math.max(0, Number(delay) || 0);
          budgets.allocTimer();
          var id = nextId++;
          var nativeId = setTimeout(function() {
            delete activeIds[id];
            budgets.releaseTimer();
            try {
              callback();
            } catch (e) {
            }
          }, d);
          activeIds[id] = { type: "timeout", nativeId };
          return id;
        }
        function safeClearTimeout(id) {
          var entry = activeIds[id];
          if (!entry) return;
          if (entry.type !== "timeout") return;
          clearTimeout(entry.nativeId);
          delete activeIds[id];
          budgets.releaseTimer();
        }
        function safeSetInterval(callback, interval) {
          if (typeof callback !== "function") {
            throw new TypeError("SafeScript DOM: setInterval requires a function callback");
          }
          var minInterval = budgets.getMinTimerInterval();
          var iv = Math.max(minInterval, Number(interval) || minInterval);
          budgets.allocTimer();
          var id = nextId++;
          var nativeId = setInterval(function() {
            try {
              callback();
            } catch (e) {
            }
          }, iv);
          activeIds[id] = { type: "interval", nativeId };
          return id;
        }
        function safeClearInterval(id) {
          var entry = activeIds[id];
          if (!entry) return;
          if (entry.type !== "interval") return;
          clearInterval(entry.nativeId);
          delete activeIds[id];
          budgets.releaseTimer();
        }
        function cleanup() {
          var ids = Object.keys(activeIds);
          for (var i = 0; i < ids.length; i++) {
            var entry = activeIds[ids[i]];
            if (entry.type === "timeout") {
              clearTimeout(entry.nativeId);
            } else {
              clearInterval(entry.nativeId);
            }
          }
          activeIds = /* @__PURE__ */ Object.create(null);
        }
        return {
          setTimeout: safeSetTimeout,
          clearTimeout: safeClearTimeout,
          setInterval: safeSetInterval,
          clearInterval: safeClearInterval,
          cleanup,
          getActiveCount: function() {
            return Object.keys(activeIds).length;
          }
        };
      }
      exports.createSafeTimers = createSafeTimers;
    }
  });

  // safescript-upstream/src/dom/url-policy.js
  var require_url_policy = __commonJS({
    "safescript-upstream/src/dom/url-policy.js"(exports) {
      "use strict";
      var PURPOSE_MAP = /* @__PURE__ */ Object.create(null);
      PURPOSE_MAP["img.src"] = "image";
      PURPOSE_MAP["img.srcset"] = "image";
      PURPOSE_MAP["input.src"] = "image";
      PURPOSE_MAP["video.poster"] = "image";
      PURPOSE_MAP["video.src"] = "media";
      PURPOSE_MAP["audio.src"] = "media";
      PURPOSE_MAP["source.src"] = "media";
      PURPOSE_MAP["track.src"] = "media";
      PURPOSE_MAP["a.href"] = "navigation";
      PURPOSE_MAP["area.href"] = "navigation";
      PURPOSE_MAP["form.action"] = "form";
      PURPOSE_MAP["form.formaction"] = "form";
      PURPOSE_MAP["button.formaction"] = "form";
      PURPOSE_MAP["input.formaction"] = "form";
      PURPOSE_MAP["link.href"] = "style";
      function classifyPurpose(tagName, attrName) {
        var key = tagName + "." + attrName;
        return PURPOSE_MAP[key] || "other";
      }
      var DANGEROUS_SCHEME_RE = /^\s*javascript\s*:/i;
      var DATA_SCHEME_RE = /^\s*data\s*:/i;
      var DATA_IMAGE_RE = /^\s*data\s*:\s*image\//i;
      function isJavascriptURL(url) {
        return DANGEROUS_SCHEME_RE.test(url);
      }
      function isDataURL(url) {
        return DATA_SCHEME_RE.test(url);
      }
      function isDataImageURL(url) {
        return DATA_IMAGE_RE.test(url);
      }
      function extractOrigin(url) {
        var m = url.match(/^(https?:\/\/[^\/\?#]+)/i);
        return m ? m[1].toLowerCase() : null;
      }
      function defaultCheck(ctx, docOrigin) {
        var purpose = ctx.purpose;
        if (purpose === "image" || purpose === "media" || purpose === "navigation") {
          var urlOrigin = extractOrigin(ctx.url);
          if (urlOrigin && docOrigin && urlOrigin === docOrigin) {
            return { allow: true };
          }
          return { allow: false };
        }
        return { allow: false };
      }
      function createURLPolicy(hostHook, documentOrigin) {
        var docOrigin = documentOrigin ? documentOrigin.toLowerCase() : null;
        return {
          /**
           * Check whether a URL is allowed.
           *
           * @param {Object} ctx
           *   - element:   {string} tag name ('img', 'a', etc.)
           *   - attribute: {string} attribute name ('src', 'href', etc.)
           *   - url:       {string} the proposed URL (should be resolved to absolute)
           *   - purpose:   {string} 'image'|'media'|'navigation'|'style'|'form'|'other'
           * @returns {{ allow: boolean, url?: string }}
           */
          check: function(ctx) {
            var url = ctx.url;
            if (isJavascriptURL(url)) {
              return { allow: false };
            }
            if (isDataURL(url)) {
              if (isDataImageURL(url) && hostHook) {
                var hookResult = hostHook(ctx);
                if (hookResult && hookResult.allow) {
                  return hookResult;
                }
              }
              return { allow: false };
            }
            if (hostHook) {
              var result = hostHook(ctx);
              if (!result || typeof result !== "object") {
                return { allow: false };
              }
              return {
                allow: !!result.allow,
                url: result.url || void 0
              };
            }
            return defaultCheck(ctx, docOrigin);
          }
        };
      }
      exports.createURLPolicy = createURLPolicy;
      exports.classifyPurpose = classifyPurpose;
      exports.isJavascriptURL = isJavascriptURL;
      exports.isDataURL = isDataURL;
      exports.isDataImageURL = isDataImageURL;
      exports.extractOrigin = extractOrigin;
    }
  });

  // safescript-upstream/src/dom/sanitizer.js
  var require_sanitizer = __commonJS({
    "safescript-upstream/src/dom/sanitizer.js"(exports) {
      "use strict";
      var urlPolicy = require_url_policy();
      var LAYER1_DENY_TAGS = /* @__PURE__ */ Object.create(null);
      var _denyTags = [
        "script",
        "iframe",
        "object",
        "embed",
        "applet",
        "base",
        "link",
        "noscript",
        // SVG dangerous elements
        "foreignobject",
        // Fix #5: SVG animation tags (can modify attributes to bypass policy)
        "animate",
        "set",
        "animatetransform",
        "animatemotion",
        // Fix #8: inline <style> elements (can restyle host page)
        "style"
      ];
      for (i = 0; i < _denyTags.length; i++) {
        LAYER1_DENY_TAGS[_denyTags[i]] = true;
      }
      var i;
      var DOCUMENT_PROPS = /* @__PURE__ */ Object.create(null);
      var _docProps = [
        "cookie",
        "domain",
        "forms",
        "images",
        "links",
        "scripts",
        "body",
        "head",
        "documentElement",
        "defaultView",
        "location",
        "title",
        "URL",
        "referrer",
        "anchors",
        "characterSet",
        "charset",
        "contentType",
        "doctype",
        "embeds",
        "plugins",
        "styleSheets",
        "implementation",
        "getElementById",
        "getElementsByClassName",
        "getElementsByName",
        "getElementsByTagName",
        "querySelector",
        "querySelectorAll",
        "write",
        "writeln",
        "open",
        "close",
        "createElement",
        "createTextNode",
        "createDocumentFragment",
        "createEvent",
        "all",
        "children",
        "firstElementChild",
        "lastElementChild"
      ];
      for (j = 0; j < _docProps.length; j++) {
        DOCUMENT_PROPS[_docProps[j]] = true;
      }
      var j;
      var URL_ATTRS = /* @__PURE__ */ Object.create(null);
      var _urlAttrs = ["src", "href", "action", "formaction", "poster", "srcset", "data", "cite"];
      for (k = 0; k < _urlAttrs.length; k++) {
        URL_ATTRS[_urlAttrs[k]] = true;
      }
      var k;
      var CSS_URL_RE = /url\s*\(/gi;
      var CSS_EXPRESSION_RE = /expression\s*\(/gi;
      var CSS_MOZ_BINDING_RE = /-moz-binding\s*:/gi;
      var CSS_IMAGE_SET_RE = /image-set\s*\(/gi;
      var CSS_CROSS_FADE_RE = /cross-fade\s*\(/gi;
      var CSS_PAINT_RE = /paint\s*\(/gi;
      var CSS_WEBKIT_IMAGE_SET_RE = /-webkit-image-set\s*[:(]/gi;
      function isEventAttr(name) {
        return name.length > 2 && name.charCodeAt(0) === 111 && name.charCodeAt(1) === 110;
      }
      function sanitizeStyleValue(value) {
        if (!value) return "";
        var clean = value;
        clean = clean.replace(CSS_URL_RE, "/* blocked */ (");
        clean = clean.replace(CSS_EXPRESSION_RE, "/* blocked */ (");
        clean = clean.replace(CSS_MOZ_BINDING_RE, "/* blocked */:");
        clean = clean.replace(CSS_IMAGE_SET_RE, "/* blocked */ (");
        clean = clean.replace(CSS_CROSS_FADE_RE, "/* blocked */ (");
        clean = clean.replace(CSS_PAINT_RE, "/* blocked */ (");
        clean = clean.replace(CSS_WEBKIT_IMAGE_SET_RE, "/* blocked */(");
        return clean;
      }
      function parseSrcset(srcset) {
        var entries = [];
        var parts = srcset.split(",");
        for (var i2 = 0; i2 < parts.length; i2++) {
          var trimmed = parts[i2].trim();
          if (!trimmed) continue;
          var spaceIdx = trimmed.search(/\s/);
          if (spaceIdx === -1) {
            entries.push({ url: trimmed, descriptor: "" });
          } else {
            entries.push({
              url: trimmed.slice(0, spaceIdx),
              descriptor: trimmed.slice(spaceIdx).trim()
            });
          }
        }
        return entries;
      }
      function buildSrcset(entries) {
        var parts = [];
        for (var i2 = 0; i2 < entries.length; i2++) {
          var e = entries[i2];
          parts.push(e.descriptor ? e.url + " " + e.descriptor : e.url);
        }
        return parts.join(", ");
      }
      function isMetaRefresh(el) {
        var httpEquiv = el.getAttribute("http-equiv");
        return httpEquiv && httpEquiv.toLowerCase() === "refresh";
      }
      function isDangerousLink(el) {
        var rel = el.getAttribute("rel");
        if (!rel) return false;
        var lower = rel.toLowerCase();
        return lower === "import" || lower === "stylesheet";
      }
      function createSanitizer(policy, domImpl) {
        policy = policy || {};
        var allowedTags = /* @__PURE__ */ Object.create(null);
        var policyTags = policy.tags || [];
        for (var i2 = 0; i2 < policyTags.length; i2++) {
          allowedTags[policyTags[i2].toLowerCase()] = true;
        }
        var allowedAttrs = /* @__PURE__ */ Object.create(null);
        var policyAttrs = policy.attributes || {};
        var attrKeys = Object.keys(policyAttrs);
        for (var j2 = 0; j2 < attrKeys.length; j2++) {
          var tag = attrKeys[j2].toLowerCase();
          var attrList = policyAttrs[attrKeys[j2]];
          var attrSet = /* @__PURE__ */ Object.create(null);
          var hasAriaGlob = false;
          var hasDataGlob = false;
          for (var k2 = 0; k2 < attrList.length; k2++) {
            var attrName = attrList[k2].toLowerCase();
            if (attrName === "aria-*") {
              hasAriaGlob = true;
            } else if (attrName === "data-*") {
              hasDataGlob = true;
            } else {
              attrSet[attrName] = true;
            }
          }
          attrSet["__ariaGlob"] = hasAriaGlob;
          attrSet["__dataGlob"] = hasDataGlob;
          allowedAttrs[tag] = attrSet;
        }
        var maxHTMLBytes = policy.limits && policy.limits.maxHTMLBytes || 262144;
        var maxNodes = policy.limits && policy.limits.maxNodes || 5e3;
        var docOrigin = null;
        if (domImpl && domImpl.location) {
          docOrigin = domImpl.location.origin;
        } else if (typeof location !== "undefined" && location.origin) {
          docOrigin = location.origin;
        }
        var urlChecker = urlPolicy.createURLPolicy(policy.url || null, docOrigin);
        var doc = domImpl || (typeof document !== "undefined" ? document : null);
        function createInertDoc() {
          if (doc && doc.implementation && doc.implementation.createHTMLDocument) {
            return doc.implementation.createHTMLDocument("");
          }
          return null;
        }
        function parseHTML(html) {
          var inertDoc = createInertDoc();
          if (!inertDoc) {
            throw new Error("SafeScript: no DOM implementation available for HTML parsing");
          }
          var container = inertDoc.createElement("div");
          container.innerHTML = html;
          var frag = inertDoc.createDocumentFragment();
          while (container.firstChild) {
            frag.appendChild(container.firstChild);
          }
          return frag;
        }
        function isAttrAllowed(tagName, attrName2) {
          var lower = attrName2.toLowerCase();
          var globalSet = allowedAttrs["*"];
          if (globalSet) {
            if (globalSet[lower]) return true;
            if (globalSet["__ariaGlob"] && lower.indexOf("aria-") === 0) return true;
            if (globalSet["__dataGlob"] && lower.indexOf("data-") === 0) return true;
          }
          var tagSet = allowedAttrs[tagName];
          if (tagSet) {
            if (tagSet[lower]) return true;
            if (tagSet["__ariaGlob"] && lower.indexOf("aria-") === 0) return true;
            if (tagSet["__dataGlob"] && lower.indexOf("data-") === 0) return true;
          }
          return false;
        }
        function checkURL(tagName, attrName2, value) {
          var purpose = urlPolicy.classifyPurpose(tagName, attrName2);
          var result = urlChecker.check({
            element: tagName,
            attribute: attrName2,
            url: value,
            purpose
          });
          if (!result.allow) return null;
          return result.url || value;
        }
        function sanitizeSrcset(tagName, srcset) {
          var entries = parseSrcset(srcset);
          var allowed = [];
          for (var i3 = 0; i3 < entries.length; i3++) {
            var checked = checkURL(tagName, "srcset", entries[i3].url);
            if (checked !== null) {
              entries[i3].url = checked;
              allowed.push(entries[i3]);
            }
          }
          if (allowed.length === 0) return null;
          return buildSrcset(allowed);
        }
        function countNodes(root) {
          var count = 0;
          var walker = function(node) {
            if (node.nodeType === 1) count++;
            var child = node.firstChild;
            while (child) {
              walker(child);
              child = child.nextSibling;
            }
          };
          walker(root);
          return count;
        }
        function walkAndSanitize(node) {
          var child = node.firstChild;
          while (child) {
            var next = child.nextSibling;
            if (child.nodeType === 1) {
              var tagName = child.tagName.toLowerCase();
              if (LAYER1_DENY_TAGS[tagName]) {
                node.removeChild(child);
                child = next;
                continue;
              }
              if (tagName === "meta" && isMetaRefresh(child)) {
                node.removeChild(child);
                child = next;
                continue;
              }
              if (tagName === "link" && isDangerousLink(child)) {
                node.removeChild(child);
                child = next;
                continue;
              }
              if (tagName === "script") {
                node.removeChild(child);
                child = next;
                continue;
              }
              if (!allowedTags[tagName]) {
                while (child.firstChild) {
                  node.insertBefore(child.firstChild, child);
                }
                node.removeChild(child);
                child = next;
                continue;
              }
              sanitizeAttributes(child, tagName);
              walkAndSanitize(child);
            }
            child = next;
          }
        }
        function sanitizeAttributes(el, tagName) {
          var attrs = el.attributes;
          var toRemove = [];
          var attrCount = attrs.length;
          for (var i3 = 0; i3 < attrCount; i3++) {
            var attr = attrs[i3];
            var name = attr.name.toLowerCase();
            var value = attr.value;
            if (isEventAttr(name)) {
              toRemove.push(attr.name);
              continue;
            }
            if (name === "srcdoc") {
              toRemove.push(attr.name);
              continue;
            }
            if ((name === "id" || name === "name") && DOCUMENT_PROPS[value]) {
              toRemove.push(attr.name);
              continue;
            }
            if (!isAttrAllowed(tagName, name)) {
              toRemove.push(attr.name);
              continue;
            }
            if (URL_ATTRS[name]) {
              if (name === "srcset") {
                var cleanSrcset = sanitizeSrcset(tagName, value);
                if (cleanSrcset === null) {
                  toRemove.push(attr.name);
                } else {
                  el.setAttribute(attr.name, cleanSrcset);
                }
              } else {
                if (urlPolicy.isJavascriptURL(value)) {
                  toRemove.push(attr.name);
                  continue;
                }
                var checked = checkURL(tagName, name, value);
                if (checked === null) {
                  toRemove.push(attr.name);
                } else if (checked !== value) {
                  el.setAttribute(attr.name, checked);
                }
              }
              continue;
            }
            if (name === "style") {
              var cleanStyle = sanitizeStyleValue(value);
              if (cleanStyle !== value) {
                el.setAttribute("style", cleanStyle);
              }
              continue;
            }
          }
          for (var r = 0; r < toRemove.length; r++) {
            el.removeAttribute(toRemove[r]);
          }
          if ((tagName === "a" || tagName === "area") && el.getAttribute("target") === "_blank") {
            var rel = el.getAttribute("rel") || "";
            var hasNoopener = rel.indexOf("noopener") !== -1;
            var hasNoreferrer = rel.indexOf("noreferrer") !== -1;
            if (!hasNoopener || !hasNoreferrer) {
              var parts = rel ? rel.split(/\s+/) : [];
              if (!hasNoopener) parts.push("noopener");
              if (!hasNoreferrer) parts.push("noreferrer");
              el.setAttribute("rel", parts.join(" "));
            }
          }
        }
        return {
          /**
           * Sanitize an HTML string and return the cleaned HTML as a string.
           *
           * @param {string} html — untrusted HTML
           * @returns {string} sanitized HTML
           * @throws {RangeError} if input exceeds maxHTMLBytes or result exceeds maxNodes
           */
          sanitize: function(html) {
            if (typeof html !== "string") {
              throw new TypeError("SafeScript: sanitize expects a string");
            }
            var byteLen = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(html).length : html.length;
            if (byteLen > maxHTMLBytes) {
              throw new RangeError(
                "SafeScript: HTML input exceeds limit (" + byteLen + " > " + maxHTMLBytes + " bytes)"
              );
            }
            var frag = parseHTML(html);
            walkAndSanitize(frag);
            var nodeCount = countNodes(frag);
            if (nodeCount > maxNodes) {
              throw new RangeError(
                "SafeScript: sanitized HTML exceeds node limit (" + nodeCount + " > " + maxNodes + ")"
              );
            }
            var inertDoc = createInertDoc();
            var container = inertDoc.createElement("div");
            container.appendChild(frag);
            return container.innerHTML;
          },
          /**
           * Sanitize an HTML string and return a DocumentFragment.
           * Used internally by SafeHandle for innerHTML/insertAdjacentHTML.
           *
           * @param {string} html — untrusted HTML
           * @returns {DocumentFragment} sanitized fragment (in the inert document)
           * @throws {RangeError} if input exceeds limits
           */
          sanitizeFragment: function(html) {
            if (typeof html !== "string") {
              throw new TypeError("SafeScript: sanitizeFragment expects a string");
            }
            var byteLen = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(html).length : html.length;
            if (byteLen > maxHTMLBytes) {
              throw new RangeError(
                "SafeScript: HTML input exceeds limit (" + byteLen + " > " + maxHTMLBytes + " bytes)"
              );
            }
            var frag = parseHTML(html);
            walkAndSanitize(frag);
            var nodeCount = countNodes(frag);
            if (nodeCount > maxNodes) {
              throw new RangeError(
                "SafeScript: sanitized HTML exceeds node limit (" + nodeCount + " > " + maxNodes + ")"
              );
            }
            return frag;
          }
        };
      }
      exports.createSanitizer = createSanitizer;
    }
  });

  // safescript-upstream/src/dom/event-bridge.js
  var require_event_bridge = __commonJS({
    "safescript-upstream/src/dom/event-bridge.js"(exports) {
      "use strict";
      var BASE_EVENT_PROPS = [
        "type",
        "timeStamp",
        "bubbles",
        "cancelable",
        "defaultPrevented",
        "eventPhase"
      ];
      var MOUSE_TOUCH_PROPS = [
        "clientX",
        "clientY",
        "pageX",
        "pageY",
        "screenX",
        "screenY",
        "button",
        "buttons",
        "altKey",
        "ctrlKey",
        "metaKey",
        "shiftKey"
      ];
      var KEYBOARD_PROPS = ["key", "code", "repeat"];
      function wrapEvent(nativeEvent, context) {
        var targetNode = nativeEvent.target;
        var currentTargetNode = nativeEvent.currentTarget;
        if (targetNode && !context.ownership.checkRead(targetNode)) {
          return null;
        }
        var safe = /* @__PURE__ */ Object.create(null);
        var i;
        for (i = 0; i < BASE_EVENT_PROPS.length; i++) {
          safe[BASE_EVENT_PROPS[i]] = nativeEvent[BASE_EVENT_PROPS[i]];
        }
        safe.target = targetNode ? context.cache.getOrCreate(targetNode, context) : null;
        safe.currentTarget = currentTargetNode ? context.cache.getOrCreate(currentTargetNode, context) : null;
        safe.preventDefault = function() {
          nativeEvent.preventDefault();
        };
        safe.stopPropagation = function() {
          nativeEvent.stopPropagation();
        };
        safe.stopImmediatePropagation = function() {
          nativeEvent.stopImmediatePropagation();
        };
        for (i = 0; i < MOUSE_TOUCH_PROPS.length; i++) {
          var mp = MOUSE_TOUCH_PROPS[i];
          if (mp in nativeEvent) {
            safe[mp] = nativeEvent[mp];
          }
        }
        for (i = 0; i < KEYBOARD_PROPS.length; i++) {
          var kp = KEYBOARD_PROPS[i];
          if (kp in nativeEvent) {
            safe[kp] = nativeEvent[kp];
          }
        }
        return Object.freeze(safe);
      }
      function createEventBridge(context) {
        var policy = context.policy;
        var ownership = context.ownership;
        var budgets = context.budgets;
        var registrations = [];
        var allowedEvents = /* @__PURE__ */ Object.create(null);
        var eventList = policy && policy.events || [];
        for (var i = 0; i < eventList.length; i++) {
          allowedEvents[eventList[i]] = true;
        }
        function findRegistration(node, type, callback) {
          for (var i2 = 0; i2 < registrations.length; i2++) {
            var r = registrations[i2];
            if (r && r.node === node && r.type === type && r.originalCallback === callback) {
              return i2;
            }
          }
          return -1;
        }
        var bridge = {
          /**
           * Add an event listener on a native DOM node.
           *
           * @param {Node} node - The native DOM node
           * @param {string} type - Event type name
           * @param {Function} callback - SafeScript callback function
           * @param {Object} [options] - addEventListener options (capture, once, passive)
           * @param {Object} ctx - DOM execution context
           */
          addEventListener: function(node, type, callback, options, ctx) {
            if (typeof callback !== "function") {
              throw new TypeError("SafeScript: event handler must be a function, not " + typeof callback);
            }
            if (!allowedEvents[type]) {
              throw new Error('SafeScript: event type "' + type + '" is not allowed');
            }
            if (!ownership.checkRead(node)) {
              throw new Error("SafeScript: cannot add event listener \u2014 node is not accessible");
            }
            var existingIdx = findRegistration(node, type, callback);
            if (existingIdx >= 0) return;
            budgets.allocListener();
            var isOnce = !!(options && typeof options === "object" && options.once);
            var wrappedFn = function(nativeEvent) {
              var safeEvent = wrapEvent(nativeEvent, ctx || context);
              if (safeEvent === null) return;
              callback(safeEvent);
              if (isOnce) {
                var idx = findRegistration(node, type, callback);
                if (idx >= 0) {
                  registrations[idx] = null;
                  budgets.releaseListener();
                }
              }
            };
            var nativeOpts;
            if (options && typeof options === "object") {
              nativeOpts = {};
              if ("capture" in options) nativeOpts.capture = !!options.capture;
              if ("once" in options) nativeOpts.once = !!options.once;
              if ("passive" in options) nativeOpts.passive = !!options.passive;
            }
            node.addEventListener(type, wrappedFn, nativeOpts);
            registrations.push({
              node,
              type,
              originalCallback: callback,
              wrappedFn,
              options: nativeOpts
            });
          },
          /**
           * Remove an event listener.
           *
           * @param {Node} node - The native DOM node
           * @param {string} type - Event type name
           * @param {Function} callback - The original SafeScript callback
           */
          removeEventListener: function(node, type, callback) {
            var idx = findRegistration(node, type, callback);
            if (idx < 0) return;
            var reg = registrations[idx];
            node.removeEventListener(type, reg.wrappedFn, reg.options);
            registrations[idx] = null;
            budgets.releaseListener();
          },
          /**
           * Remove all registered listeners. Called on tool removal / cleanup.
           */
          cleanup: function() {
            for (var i2 = 0; i2 < registrations.length; i2++) {
              var reg = registrations[i2];
              if (!reg) continue;
              try {
                reg.node.removeEventListener(reg.type, reg.wrappedFn, reg.options);
              } catch (e) {
              }
            }
            registrations = [];
          },
          /**
           * Get count of active listeners.
           */
          listenerCount: function() {
            var count = 0;
            for (var i2 = 0; i2 < registrations.length; i2++) {
              if (registrations[i2]) count++;
            }
            return count;
          }
        };
        return bridge;
      }
      exports.createEventBridge = createEventBridge;
      exports.wrapEvent = wrapEvent;
    }
  });

  // safescript-upstream/src/dom/safe-window.js
  var require_safe_window = __commonJS({
    "safescript-upstream/src/dom/safe-window.js"(exports) {
      "use strict";
      var BLOCKED_WINDOW_PROPS = {
        document: 1,
        location: 1,
        history: 1,
        navigator: 1,
        localStorage: 1,
        sessionStorage: 1,
        indexedDB: 1,
        caches: 1,
        opener: 1,
        parent: 1,
        top: 1,
        frames: 1,
        frameElement: 1,
        self: 1,
        globalThis: 1,
        fetch: 1,
        XMLHttpRequest: 1,
        WebSocket: 1,
        EventSource: 1,
        Worker: 1,
        SharedWorker: 1,
        ServiceWorker: 1,
        importScripts: 1,
        postMessage: 1,
        alert: 1,
        confirm: 1,
        prompt: 1,
        print: 1,
        open: 1,
        close: 1,
        stop: 1,
        focus: 1,
        blur: 1,
        eval: 1,
        Function: 1,
        crypto: 1,
        performance: 1,
        screen: 1,
        screenX: 1,
        screenY: 1,
        screenLeft: 1,
        screenTop: 1,
        moveTo: 1,
        moveBy: 1,
        resizeTo: 1,
        resizeBy: 1,
        getSelection: 1,
        find: 1,
        name: 1,
        status: 1,
        menubar: 1,
        toolbar: 1,
        statusbar: 1,
        scrollbars: 1,
        personalbar: 1,
        locationbar: 1,
        customElements: 1,
        Notification: 1,
        Permissions: 1,
        speechSynthesis: 1,
        visualViewport: 1
      };
      function createSafeWindow(context, budgets) {
        var win = /* @__PURE__ */ Object.create(null);
        Object.defineProperty(win, "innerWidth", {
          get: function() {
            return window.innerWidth;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "innerHeight", {
          get: function() {
            return window.innerHeight;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "outerWidth", {
          get: function() {
            return window.outerWidth;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "outerHeight", {
          get: function() {
            return window.outerHeight;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "scrollX", {
          get: function() {
            return window.scrollX || window.pageXOffset || 0;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "scrollY", {
          get: function() {
            return window.scrollY || window.pageYOffset || 0;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "pageXOffset", {
          get: function() {
            return window.scrollX || window.pageXOffset || 0;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "pageYOffset", {
          get: function() {
            return window.scrollY || window.pageYOffset || 0;
          },
          enumerable: true,
          configurable: false
        });
        Object.defineProperty(win, "devicePixelRatio", {
          get: function() {
            return window.devicePixelRatio || 1;
          },
          enumerable: true,
          configurable: false
        });
        var resolveNode = require_safe_handle().resolveNode;
        var ownership = context.ownership;
        win.getComputedStyle = function(handle, pseudoElt) {
          if (handle == null || typeof handle !== "object") {
            throw new TypeError("SafeScript DOM: getComputedStyle requires a valid element");
          }
          var node = resolveNode(handle);
          if (!node) {
            throw new TypeError("SafeScript DOM: getComputedStyle requires a valid element");
          }
          if (!ownership.isInSubtree(node)) {
            throw new TypeError("SafeScript DOM: getComputedStyle target is outside the owned subtree");
          }
          var computed = window.getComputedStyle(node, pseudoElt || null);
          var snapshot = /* @__PURE__ */ Object.create(null);
          var props = [
            "display",
            "visibility",
            "opacity",
            "overflow",
            "overflowX",
            "overflowY",
            "position",
            "top",
            "right",
            "bottom",
            "left",
            "float",
            "clear",
            "zIndex",
            "cursor",
            "pointerEvents",
            "boxSizing",
            "width",
            "height",
            "minWidth",
            "minHeight",
            "maxWidth",
            "maxHeight",
            "margin",
            "marginTop",
            "marginRight",
            "marginBottom",
            "marginLeft",
            "padding",
            "paddingTop",
            "paddingRight",
            "paddingBottom",
            "paddingLeft",
            "border",
            "borderWidth",
            "borderStyle",
            "borderColor",
            "borderTop",
            "borderRight",
            "borderBottom",
            "borderLeft",
            "borderTopWidth",
            "borderRightWidth",
            "borderBottomWidth",
            "borderLeftWidth",
            "borderRadius",
            "borderTopLeftRadius",
            "borderTopRightRadius",
            "borderBottomLeftRadius",
            "borderBottomRightRadius",
            "background",
            "backgroundColor",
            "backgroundImage",
            "backgroundSize",
            "backgroundPosition",
            "backgroundRepeat",
            "color",
            "font",
            "fontFamily",
            "fontSize",
            "fontWeight",
            "fontStyle",
            "lineHeight",
            "letterSpacing",
            "textAlign",
            "textDecoration",
            "textTransform",
            "whiteSpace",
            "wordBreak",
            "wordSpacing",
            "textOverflow",
            "transform",
            "transformOrigin",
            "transition",
            "animation",
            "flexDirection",
            "flexWrap",
            "justifyContent",
            "alignItems",
            "alignContent",
            "alignSelf",
            "flex",
            "flexGrow",
            "flexShrink",
            "flexBasis",
            "order",
            "gap",
            "gridTemplateColumns",
            "gridTemplateRows",
            "gridColumn",
            "gridRow",
            "gridGap",
            "gridArea",
            "gridAutoFlow",
            "outline",
            "outlineWidth",
            "outlineStyle",
            "outlineColor",
            "outlineOffset",
            "boxShadow",
            "textShadow",
            "filter",
            "backdropFilter",
            "objectFit",
            "objectPosition",
            "verticalAlign",
            "listStyleType",
            "listStylePosition",
            "listStyleImage",
            "tableLayout",
            "borderCollapse",
            "borderSpacing",
            "userSelect",
            "resize",
            "contain",
            "willChange"
          ];
          for (var i = 0; i < props.length; i++) {
            var p = props[i];
            try {
              snapshot[p] = computed[p] || "";
            } catch (e) {
              snapshot[p] = "";
            }
          }
          snapshot.getPropertyValue = function(prop) {
            try {
              return computed.getPropertyValue(prop) || "";
            } catch (e) {
              return "";
            }
          };
          return Object.freeze(snapshot);
        };
        win.matchMedia = function(query) {
          if (typeof query !== "string") {
            throw new TypeError("SafeScript DOM: matchMedia requires a string query");
          }
          if (query.length > 512) {
            throw new Error("SafeScript DOM: matchMedia query exceeds 512-character limit");
          }
          var mql = window.matchMedia(query);
          return Object.freeze({
            matches: mql.matches,
            media: mql.media
          });
        };
        var rafIds = /* @__PURE__ */ Object.create(null);
        var nextRafId = 1;
        win.requestAnimationFrame = function(callback) {
          if (typeof callback !== "function") {
            throw new TypeError("SafeScript DOM: requestAnimationFrame requires a function callback");
          }
          if (budgets) budgets.allocTimer();
          var id = nextRafId++;
          var nativeId = requestAnimationFrame(function(timestamp) {
            delete rafIds[id];
            if (budgets) budgets.releaseTimer();
            try {
              callback(timestamp);
            } catch (e) {
            }
          });
          rafIds[id] = nativeId;
          return id;
        };
        win.cancelAnimationFrame = function(id) {
          var nativeId = rafIds[id];
          if (nativeId === void 0) return;
          cancelAnimationFrame(nativeId);
          delete rafIds[id];
          if (budgets) budgets.releaseTimer();
        };
        var cleanupFn = function() {
          var ids = Object.keys(rafIds);
          for (var i = 0; i < ids.length; i++) {
            cancelAnimationFrame(rafIds[ids[i]]);
          }
          rafIds = /* @__PURE__ */ Object.create(null);
        };
        Object.freeze(win);
        return { facade: win, cleanup: cleanupFn };
      }
      exports.createSafeWindow = createSafeWindow;
      exports.BLOCKED_WINDOW_PROPS = BLOCKED_WINDOW_PROPS;
    }
  });

  // safescript-upstream/src/dom/safe-jquery.js
  var require_safe_jquery = __commonJS({
    "safescript-upstream/src/dom/safe-jquery.js"(exports) {
      "use strict";
      var resolveNode = require_safe_handle().resolveNode;
      function createSafeJQuery(context) {
        var rootNode = context.rootNode;
        var ownership = context.ownership;
        var budgets = context.budgets;
        var sanitizer = context.sanitizer;
        var eventBridge = context.eventBridge;
        var handleFactory = context.handleFactory;
        var policy = context.policy;
        var tagAllowlist = /* @__PURE__ */ Object.create(null);
        if (policy.tags) {
          for (var t = 0; t < policy.tags.length; t++) {
            tagAllowlist[policy.tags[t].toLowerCase()] = true;
          }
        }
        function SafeCollection(handles) {
          this.length = handles.length;
          for (var i = 0; i < handles.length; i++) {
            this[i] = handles[i];
          }
        }
        SafeCollection.prototype.each = function(fn) {
          for (var i = 0; i < this.length; i++) {
            var result = fn.call(this[i], i, this[i]);
            if (result === false) break;
          }
          return this;
        };
        SafeCollection.prototype.map = function(fn) {
          var results = [];
          for (var i = 0; i < this.length; i++) {
            results.push(fn.call(this[i], i, this[i]));
          }
          return results;
        };
        SafeCollection.prototype.toArray = function() {
          var arr = [];
          for (var i = 0; i < this.length; i++) arr.push(this[i]);
          return arr;
        };
        SafeCollection.prototype.get = function(index) {
          if (index === void 0) return this.toArray();
          if (index < 0) index = this.length + index;
          return this[index] || null;
        };
        SafeCollection.prototype.eq = function(index) {
          if (index < 0) index = this.length + index;
          return new SafeCollection(this[index] ? [this[index]] : []);
        };
        SafeCollection.prototype.first = function() {
          return this.eq(0);
        };
        SafeCollection.prototype.last = function() {
          return this.eq(this.length - 1);
        };
        SafeCollection.prototype.filter = function(selector) {
          var filtered = [];
          if (typeof selector === "function") {
            for (var i = 0; i < this.length; i++) {
              if (selector.call(this[i], i, this[i])) filtered.push(this[i]);
            }
          } else if (typeof selector === "string") {
            for (var j = 0; j < this.length; j++) {
              if (this[j].matches && this[j].matches(selector)) {
                filtered.push(this[j]);
              }
            }
          }
          return new SafeCollection(filtered);
        };
        SafeCollection.prototype.not = function(selector) {
          var filtered = [];
          if (typeof selector === "function") {
            for (var i = 0; i < this.length; i++) {
              if (!selector.call(this[i], i, this[i])) filtered.push(this[i]);
            }
          } else if (typeof selector === "string") {
            for (var j = 0; j < this.length; j++) {
              if (!(this[j].matches && this[j].matches(selector))) {
                filtered.push(this[j]);
              }
            }
          }
          return new SafeCollection(filtered);
        };
        SafeCollection.prototype.is = function(selector) {
          for (var i = 0; i < this.length; i++) {
            if (this[i].matches && this[i].matches(selector)) return true;
          }
          return false;
        };
        SafeCollection.prototype.has = function(selector) {
          var filtered = [];
          for (var i = 0; i < this.length; i++) {
            var found = this[i].querySelector ? this[i].querySelector(selector) : null;
            if (found) filtered.push(this[i]);
          }
          return new SafeCollection(filtered);
        };
        SafeCollection.prototype.index = function(elem) {
          if (elem === void 0 && this.length > 0) {
            var node = resolveNode(this[0]);
            if (!node || !node.parentNode) return -1;
            var children = node.parentNode.children;
            for (var i = 0; i < children.length; i++) {
              if (children[i] === node) return i;
            }
            return -1;
          }
          var target = elem instanceof SafeCollection ? elem[0] : elem;
          for (var j = 0; j < this.length; j++) {
            if (this[j] === target) return j;
          }
          return -1;
        };
        SafeCollection.prototype.find = function(selector) {
          var results = [];
          var seen = /* @__PURE__ */ new Set();
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node || !node.querySelectorAll) continue;
            var nodes = node.querySelectorAll(selector);
            for (var j = 0; j < nodes.length; j++) {
              if (!seen.has(nodes[j]) && ownership.isInSubtree(nodes[j])) {
                seen.add(nodes[j]);
                results.push(handleFactory(nodes[j]));
              }
            }
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.children = function(selector) {
          var results = [];
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node) continue;
            var kids = node.children;
            for (var j = 0; j < kids.length; j++) {
              if (ownership.isInSubtree(kids[j])) {
                var handle = handleFactory(kids[j]);
                if (!selector || handle.matches && handle.matches(selector)) {
                  results.push(handle);
                }
              }
            }
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.parent = function(selector) {
          var results = [];
          var seen = /* @__PURE__ */ new Set();
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node || !node.parentElement) continue;
            if (ownership.isAtBoundary(node)) continue;
            var parent = node.parentElement;
            if (!parent || !ownership.isInSubtree(parent)) continue;
            if (seen.has(parent)) continue;
            seen.add(parent);
            var handle = handleFactory(parent);
            if (!selector || handle.matches && handle.matches(selector)) {
              results.push(handle);
            }
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.parents = function(selector) {
          var results = [];
          var seen = /* @__PURE__ */ new Set();
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node) continue;
            var current = node.parentElement;
            while (current) {
              if (ownership.isAtBoundary(current) && current !== rootNode) {
                break;
              }
              if (!ownership.isInSubtree(current)) break;
              if (!seen.has(current)) {
                seen.add(current);
                var handle = handleFactory(current);
                if (!selector || handle.matches && handle.matches(selector)) {
                  results.push(handle);
                }
              }
              if (current === rootNode) break;
              current = current.parentElement;
            }
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.closest = function(selector) {
          var results = [];
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node) {
              results.push(null);
              continue;
            }
            var current = node;
            var found = null;
            while (current) {
              if (current.matches && current.matches(selector)) {
                if (ownership.isInSubtree(current)) {
                  found = handleFactory(current);
                }
                break;
              }
              if (current === rootNode) break;
              current = current.parentElement;
            }
            if (found) results.push(found);
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.siblings = function(selector) {
          var results = [];
          var seen = /* @__PURE__ */ new Set();
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node || !node.parentElement) continue;
            var siblings = node.parentElement.children;
            for (var j = 0; j < siblings.length; j++) {
              if (siblings[j] !== node && !seen.has(siblings[j]) && ownership.isInSubtree(siblings[j])) {
                seen.add(siblings[j]);
                var handle = handleFactory(siblings[j]);
                if (!selector || handle.matches && handle.matches(selector)) {
                  results.push(handle);
                }
              }
            }
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.next = function(selector) {
          var results = [];
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node) continue;
            var sibling = node.nextElementSibling;
            if (sibling && ownership.isInSubtree(sibling)) {
              var handle = handleFactory(sibling);
              if (!selector || handle.matches && handle.matches(selector)) {
                results.push(handle);
              }
            }
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.prev = function(selector) {
          var results = [];
          for (var i = 0; i < this.length; i++) {
            var node = resolveNode(this[i]);
            if (!node) continue;
            var sibling = node.previousElementSibling;
            if (sibling && ownership.isInSubtree(sibling)) {
              var handle = handleFactory(sibling);
              if (!selector || handle.matches && handle.matches(selector)) {
                results.push(handle);
              }
            }
          }
          return new SafeCollection(results);
        };
        SafeCollection.prototype.attr = function(name, value) {
          if (value === void 0 && typeof name === "string") {
            return this.length > 0 && this[0].getAttribute ? this[0].getAttribute(name) : void 0;
          }
          return this.each(function() {
            if (this.setAttribute) this.setAttribute(name, value);
          });
        };
        SafeCollection.prototype.removeAttr = function(name) {
          return this.each(function() {
            if (this.removeAttribute) this.removeAttribute(name);
          });
        };
        SafeCollection.prototype.prop = function(name, value) {
          if (value === void 0) {
            if (this.length === 0) return void 0;
            var node = resolveNode(this[0]);
            return node ? node[name] : void 0;
          }
          return this.each(function() {
            var n = resolveNode(this);
            if (n) n[name] = value;
          });
        };
        SafeCollection.prototype.data = function(key, value) {
          if (key === void 0) {
            return this.length > 0 && this[0].dataset ? Object.assign(/* @__PURE__ */ Object.create(null), this[0].dataset) : {};
          }
          if (value === void 0) {
            if (this.length === 0) return void 0;
            var node = resolveNode(this[0]);
            return node && node.dataset ? node.dataset[key] : void 0;
          }
          return this.each(function() {
            var n = resolveNode(this);
            if (n && n.dataset) n.dataset[key] = value;
          });
        };
        SafeCollection.prototype.val = function(value) {
          if (value === void 0) {
            if (this.length === 0) return void 0;
            var node = resolveNode(this[0]);
            return node ? node.value : void 0;
          }
          return this.each(function() {
            var n = resolveNode(this);
            if (n) n.value = value;
          });
        };
        SafeCollection.prototype.css = function(prop, value) {
          if (typeof prop === "string" && value === void 0) {
            if (this.length === 0) return void 0;
            var node = resolveNode(this[0]);
            if (!node) return void 0;
            var computed = window.getComputedStyle(node);
            return computed ? computed[prop] || computed.getPropertyValue(prop) : void 0;
          }
          if (typeof prop === "object") {
            var self = this;
            var keys = Object.keys(prop);
            return this.each(function() {
              if (this.style) {
                for (var k = 0; k < keys.length; k++) {
                  this.style[keys[k]] = prop[keys[k]];
                }
              }
            });
          }
          return this.each(function() {
            if (this.style) this.style[prop] = value;
          });
        };
        SafeCollection.prototype.addClass = function(className) {
          var classes = String(className).split(/\s+/);
          return this.each(function() {
            if (this.classList) {
              for (var i = 0; i < classes.length; i++) {
                if (classes[i]) this.classList.add(classes[i]);
              }
            }
          });
        };
        SafeCollection.prototype.removeClass = function(className) {
          if (className === void 0) {
            return this.each(function() {
              var n = resolveNode(this);
              if (n) n.className = "";
            });
          }
          var classes = String(className).split(/\s+/);
          return this.each(function() {
            if (this.classList) {
              for (var i = 0; i < classes.length; i++) {
                if (classes[i]) this.classList.remove(classes[i]);
              }
            }
          });
        };
        SafeCollection.prototype.toggleClass = function(className, state) {
          return this.each(function() {
            if (this.classList) {
              if (state !== void 0) {
                if (state) this.classList.add(className);
                else this.classList.remove(className);
              } else {
                this.classList.toggle(className);
              }
            }
          });
        };
        SafeCollection.prototype.hasClass = function(className) {
          for (var i = 0; i < this.length; i++) {
            if (this[i].classList && this[i].classList.contains(className)) return true;
          }
          return false;
        };
        SafeCollection.prototype.html = function(value) {
          if (value === void 0) {
            return this.length > 0 ? this[0].innerHTML : void 0;
          }
          return this.each(function() {
            if (this.innerHTML !== void 0) {
              this.innerHTML = value;
            }
          });
        };
        SafeCollection.prototype.text = function(value) {
          if (value === void 0) {
            return this.length > 0 ? this[0].textContent : void 0;
          }
          return this.each(function() {
            if (this.textContent !== void 0) {
              this.textContent = value;
            }
          });
        };
        SafeCollection.prototype.empty = function() {
          return this.each(function() {
            if (this.innerHTML !== void 0) {
              this.innerHTML = "";
            }
          });
        };
        SafeCollection.prototype.append = function(content) {
          return this.each(function() {
            if (typeof content === "string") {
              this.insertAdjacentHTML("beforeend", content);
            } else if (content instanceof SafeCollection) {
              for (var i = 0; i < content.length; i++) {
                this.appendChild(content[i]);
              }
            } else if (content && this.appendChild) {
              this.appendChild(content);
            }
          });
        };
        SafeCollection.prototype.prepend = function(content) {
          return this.each(function() {
            if (typeof content === "string") {
              this.insertAdjacentHTML("afterbegin", content);
            } else if (content instanceof SafeCollection) {
              for (var i = content.length - 1; i >= 0; i--) {
                var first = this.firstChild;
                if (first) this.insertBefore(content[i], first);
                else this.appendChild(content[i]);
              }
            } else if (content && this.insertBefore) {
              var first = this.firstChild;
              if (first) this.insertBefore(content, first);
              else this.appendChild(content);
            }
          });
        };
        SafeCollection.prototype.after = function(content) {
          return this.each(function() {
            if (typeof content === "string") {
              this.insertAdjacentHTML("afterend", content);
            }
          });
        };
        SafeCollection.prototype.before = function(content) {
          return this.each(function() {
            if (typeof content === "string") {
              this.insertAdjacentHTML("beforebegin", content);
            }
          });
        };
        SafeCollection.prototype.appendTo = function(target) {
          var targetColl = target instanceof SafeCollection ? target : safe$(target);
          for (var i = 0; i < this.length; i++) {
            for (var j = 0; j < targetColl.length; j++) {
              targetColl[j].appendChild(this[i]);
            }
          }
          return this;
        };
        SafeCollection.prototype.prependTo = function(target) {
          var targetColl = target instanceof SafeCollection ? target : safe$(target);
          for (var i = 0; i < this.length; i++) {
            for (var j = 0; j < targetColl.length; j++) {
              var first = targetColl[j].firstChild;
              if (first) targetColl[j].insertBefore(this[i], first);
              else targetColl[j].appendChild(this[i]);
            }
          }
          return this;
        };
        SafeCollection.prototype.remove = function() {
          return this.each(function() {
            if (this.remove) this.remove();
          });
        };
        SafeCollection.prototype.detach = SafeCollection.prototype.remove;
        SafeCollection.prototype.clone = function() {
          var clones = [];
          for (var i = 0; i < this.length; i++) {
            if (this[i].cloneNode) clones.push(this[i].cloneNode(false));
          }
          return new SafeCollection(clones);
        };
        SafeCollection.prototype.replaceWith = function(content) {
          return this.each(function() {
            var parent = resolveNode(this);
            if (!parent || !parent.parentNode) return;
            if (typeof content === "string") {
              this.insertAdjacentHTML("afterend", content);
              this.remove();
            }
          });
        };
        SafeCollection.prototype.wrap = function(wrapper) {
          return this.each(function() {
            var wrapNode;
            if (typeof wrapper === "string") {
              var m = wrapper.match(/^<(\w+)/);
              if (!m) return;
              var tag = m[1].toLowerCase();
              if (!tagAllowlist[tag]) return;
              var node = resolveNode(this);
              if (!node || !node.parentNode) return;
              budgets.allocNodes(1);
              wrapNode = rootNode.ownerDocument.createElement(tag);
              ownership.markOwned(wrapNode);
              node.parentNode.insertBefore(wrapNode, node);
              wrapNode.appendChild(node);
            }
          });
        };
        SafeCollection.prototype.on = function(events, selector, handler) {
          if (typeof selector === "function") {
            handler = selector;
            selector = null;
          }
          var eventList = events.split(/\s+/);
          return this.each(function() {
            for (var i = 0; i < eventList.length; i++) {
              var evt = eventList[i];
              if (!evt) continue;
              var dotIdx = evt.indexOf(".");
              var eventType = dotIdx > 0 ? evt.substring(0, dotIdx) : evt;
              if (selector) {
                (function(evtType, sel, fn, handle) {
                  var delegated = function(e2) {
                    var targetNode = e2.target ? resolveNode(e2.target) : null;
                    if (!targetNode) return;
                    var match = targetNode.closest(sel);
                    if (match && ownership.isInSubtree(match)) {
                      fn.call(handleFactory(match), e2);
                    }
                  };
                  handle.addEventListener(evtType, delegated);
                })(eventType, selector, handler, this);
              } else {
                this.addEventListener(eventType, handler);
              }
            }
          });
        };
        SafeCollection.prototype.off = function(events, handler) {
          var eventList = events.split(/\s+/);
          return this.each(function() {
            for (var i = 0; i < eventList.length; i++) {
              var evt = eventList[i];
              if (!evt) continue;
              var dotIdx = evt.indexOf(".");
              var eventType = dotIdx > 0 ? evt.substring(0, dotIdx) : evt;
              if (handler) {
                this.removeEventListener(eventType, handler);
              }
            }
          });
        };
        SafeCollection.prototype.trigger = function(eventType, data) {
          return this.each(function() {
            var node = resolveNode(this);
            if (!node) return;
            var event;
            if (typeof CustomEvent !== "undefined") {
              event = new CustomEvent(eventType, { bubbles: true, cancelable: true, detail: data });
            } else {
              event = document.createEvent("Event");
              event.initEvent(eventType, true, true);
              event.detail = data;
            }
            node.dispatchEvent(event);
          });
        };
        var eventShortcuts = [
          "click",
          "focus",
          "blur",
          "change",
          "submit",
          "keydown",
          "keyup",
          "keypress",
          "mousedown",
          "mouseup",
          "mousemove",
          "mouseenter",
          "mouseleave",
          "touchstart",
          "touchend",
          "touchmove"
        ];
        for (var e = 0; e < eventShortcuts.length; e++) {
          (function(evt) {
            SafeCollection.prototype[evt] = function(handler) {
              if (handler) return this.on(evt, handler);
              return this.trigger(evt);
            };
          })(eventShortcuts[e]);
        }
        SafeCollection.prototype.width = function(value) {
          if (value !== void 0) {
            return this.css("width", typeof value === "number" ? value + "px" : value);
          }
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          return node ? node.offsetWidth : 0;
        };
        SafeCollection.prototype.height = function(value) {
          if (value !== void 0) {
            return this.css("height", typeof value === "number" ? value + "px" : value);
          }
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          return node ? node.offsetHeight : 0;
        };
        SafeCollection.prototype.innerWidth = function() {
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          return node ? node.clientWidth : 0;
        };
        SafeCollection.prototype.innerHeight = function() {
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          return node ? node.clientHeight : 0;
        };
        SafeCollection.prototype.outerWidth = function(includeMargin) {
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          if (!node) return 0;
          var w = node.offsetWidth;
          if (includeMargin) {
            var cs = window.getComputedStyle(node);
            w += parseInt(cs.marginLeft, 10) + parseInt(cs.marginRight, 10);
          }
          return w;
        };
        SafeCollection.prototype.outerHeight = function(includeMargin) {
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          if (!node) return 0;
          var h = node.offsetHeight;
          if (includeMargin) {
            var cs = window.getComputedStyle(node);
            h += parseInt(cs.marginTop, 10) + parseInt(cs.marginBottom, 10);
          }
          return h;
        };
        SafeCollection.prototype.offset = function() {
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          if (!node || !node.getBoundingClientRect) return { top: 0, left: 0 };
          var rect = node.getBoundingClientRect();
          return {
            top: rect.top + (window.scrollY || window.pageYOffset || 0),
            left: rect.left + (window.scrollX || window.pageXOffset || 0)
          };
        };
        SafeCollection.prototype.position = function() {
          if (this.length === 0) return void 0;
          var node = resolveNode(this[0]);
          return node ? { top: node.offsetTop, left: node.offsetLeft } : { top: 0, left: 0 };
        };
        SafeCollection.prototype.scrollTop = function(value) {
          if (value !== void 0) {
            return this.each(function() {
              var n = resolveNode(this);
              if (n) n.scrollTop = value;
            });
          }
          if (this.length === 0) return 0;
          var node = resolveNode(this[0]);
          return node ? node.scrollTop : 0;
        };
        SafeCollection.prototype.scrollLeft = function(value) {
          if (value !== void 0) {
            return this.each(function() {
              var n = resolveNode(this);
              if (n) n.scrollLeft = value;
            });
          }
          if (this.length === 0) return 0;
          var node = resolveNode(this[0]);
          return node ? node.scrollLeft : 0;
        };
        SafeCollection.prototype.show = function() {
          return this.each(function() {
            if (this.style) this.style.display = "";
          });
        };
        SafeCollection.prototype.hide = function() {
          return this.each(function() {
            if (this.style) this.style.display = "none";
          });
        };
        SafeCollection.prototype.toggle = function(state) {
          return this.each(function() {
            if (this.style) {
              var isHidden = this.style.display === "none";
              if (state !== void 0) {
                this.style.display = state ? "" : "none";
              } else {
                this.style.display = isHidden ? "" : "none";
              }
            }
          });
        };
        SafeCollection.prototype.animate = function(properties, duration, easing, complete) {
          if (typeof duration === "function") {
            complete = duration;
            duration = 400;
            easing = "ease";
          } else if (typeof duration === "object") {
            var opts = duration;
            duration = opts.duration || 400;
            easing = opts.easing || "ease";
            complete = opts.complete;
          }
          duration = duration || 400;
          easing = easing || "ease";
          var propNames = Object.keys(properties);
          var transitionValue = propNames.map(function(p) {
            return p + " " + duration + "ms " + easing;
          }).join(", ");
          return this.each(function(i, handle) {
            if (!handle.style) return;
            handle.style.transition = transitionValue;
            for (var k = 0; k < propNames.length; k++) {
              handle.style[propNames[k]] = properties[propNames[k]];
            }
            if (complete) {
              var node = resolveNode(handle);
              if (node) {
                var done = function() {
                  node.removeEventListener("transitionend", done);
                  handle.style.transition = "";
                  complete.call(handle);
                };
                node.addEventListener("transitionend", done, { once: true });
              }
            }
          });
        };
        SafeCollection.prototype.fadeIn = function(duration, complete) {
          return this.css("opacity", "0").show().animate({ opacity: "1" }, duration || 400, "ease", complete);
        };
        SafeCollection.prototype.fadeOut = function(duration, complete) {
          var self = this;
          return this.animate({ opacity: "0" }, duration || 400, "ease", function() {
            self.hide();
            if (complete) complete.call(this);
          });
        };
        SafeCollection.prototype.slideDown = function(duration, complete) {
          return this.show().animate({ maxHeight: "9999px", overflow: "hidden" }, duration || 400, "ease", complete);
        };
        SafeCollection.prototype.slideUp = function(duration, complete) {
          var self = this;
          return this.animate({ maxHeight: "0", overflow: "hidden" }, duration || 400, "ease", function() {
            self.hide();
            if (complete) complete.call(this);
          });
        };
        SafeCollection.prototype.add = function(selector) {
          var additional = safe$(selector);
          var all = this.toArray().concat(additional.toArray());
          return new SafeCollection(all);
        };
        SafeCollection.prototype.end = function() {
          return this;
        };
        function safe$(selector, context2) {
          if (typeof selector === "function") {
            selector();
            return new SafeCollection([]);
          }
          if (selector instanceof SafeCollection) {
            return selector;
          }
          if (selector && typeof selector === "object" && resolveNode(selector)) {
            return new SafeCollection([selector]);
          }
          if (typeof selector === "string" && selector.charAt(0) === "<") {
            var m = selector.match(/^<(\w+)/);
            if (!m) return new SafeCollection([]);
            var tag = m[1].toLowerCase();
            if (!tagAllowlist[tag]) {
              throw new Error("SafeScript DOM: element <" + tag + "> is not allowed");
            }
            budgets.allocNodes(1);
            var node = rootNode.ownerDocument.createElement(tag);
            ownership.markOwned(node);
            return new SafeCollection([handleFactory(node)]);
          }
          if (typeof selector === "string") {
            if (selector.length > 512) {
              throw new Error("SafeScript DOM: selector exceeds 512-character limit");
            }
            var searchRoot = rootNode;
            if (context2) {
              var ctxNode = resolveNode(context2);
              if (ctxNode && ownership.isInSubtree(ctxNode)) {
                searchRoot = ctxNode;
              }
            }
            var results = searchRoot.querySelectorAll(selector);
            var handles = [];
            for (var i = 0; i < results.length; i++) {
              if (ownership.isInSubtree(results[i])) {
                handles.push(handleFactory(results[i]));
              }
            }
            return new SafeCollection(handles);
          }
          return new SafeCollection([]);
        }
        safe$.each = function(obj, fn) {
          if (Array.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
              if (fn.call(obj[i], i, obj[i]) === false) break;
            }
          } else if (obj && typeof obj === "object") {
            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j++) {
              if (fn.call(obj[keys[j]], keys[j], obj[keys[j]]) === false) break;
            }
          }
          return obj;
        };
        safe$.extend = function() {
          var target = arguments[0] || {};
          for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            if (src && typeof src === "object") {
              var keys = Object.keys(src);
              for (var j = 0; j < keys.length; j++) {
                target[keys[j]] = src[keys[j]];
              }
            }
          }
          return target;
        };
        safe$.isFunction = function(obj) {
          return typeof obj === "function";
        };
        safe$.isArray = Array.isArray;
        safe$.isPlainObject = function(obj) {
          return obj !== null && typeof obj === "object" && (Object.getPrototypeOf(obj) === Object.prototype || Object.getPrototypeOf(obj) === null);
        };
        safe$.type = function(obj) {
          if (obj === null) return "null";
          if (obj === void 0) return "undefined";
          return typeof obj;
        };
        safe$.trim = function(str) {
          return String(str).trim();
        };
        safe$.inArray = function(val, arr) {
          return arr.indexOf(val);
        };
        safe$.noop = function() {
        };
        safe$.fn = SafeCollection.prototype;
        return safe$;
      }
      exports.createSafeJQuery = createSafeJQuery;
    }
  });

  // safescript-upstream/src/dom/safe-q.js
  var require_safe_q = __commonJS({
    "safescript-upstream/src/dom/safe-q.js"(exports) {
      "use strict";
      var resolveNode = require_safe_handle().resolveNode;
      function createSafeQ(context, safe$) {
        var rootNode = context.rootNode;
        var ownership = context.ownership;
        var budgets = context.budgets;
        var handleFactory = context.handleFactory;
        var Q = typeof window !== "undefined" && window.Q ? window.Q : null;
        if (!Q) {
          var stub = /* @__PURE__ */ Object.create(null);
          stub.activate = function() {
            throw new Error("SafeScript: Q framework is not loaded");
          };
          stub.Template = Object.freeze({ render: function() {
            throw new Error("SafeScript: Q framework is not loaded");
          } });
          return Object.freeze(stub);
        }
        var safeQ = /* @__PURE__ */ Object.create(null);
        safeQ.activate = function(element) {
          var node;
          if (element === void 0) {
            node = rootNode;
          } else if (element && typeof element === "object") {
            node = resolveNode(element);
            if (!node) {
              throw new TypeError("SafeScript Q: activate requires a valid element");
            }
          } else {
            throw new TypeError("SafeScript Q: activate requires a valid element");
          }
          if (!ownership.isInSubtree(node)) {
            throw new Error("SafeScript Q: cannot activate elements outside the owned subtree");
          }
          return Q.activate(node);
        };
        safeQ.Template = /* @__PURE__ */ Object.create(null);
        safeQ.Template.render = function(name, fields, callback) {
          if (typeof name !== "string") {
            throw new TypeError("SafeScript Q: Template.render requires a string template name");
          }
          if (name.length > 256) {
            throw new Error("SafeScript Q: template name exceeds 256-character limit");
          }
          if (fields && typeof fields !== "object") {
            throw new TypeError("SafeScript Q: Template.render fields must be an object");
          }
          if (Q.Template && typeof Q.Template.render === "function") {
            return Q.Template.render(name, fields || {}, callback);
          }
          throw new Error("SafeScript Q: Q.Template.render is not available");
        };
        safeQ.Template.set = function(name, content, partials) {
          if (typeof name !== "string") {
            throw new TypeError("SafeScript Q: Template.set requires a string template name");
          }
          if (name.length > 256) {
            throw new Error("SafeScript Q: template name exceeds 256-character limit");
          }
          if (typeof content !== "string") {
            throw new TypeError("SafeScript Q: Template.set requires string content");
          }
          if (content.length > 65536) {
            throw new Error("SafeScript Q: template content exceeds 64KB limit");
          }
          if (Q.Template && typeof Q.Template.set === "function") {
            return Q.Template.set(name, content, partials);
          }
          throw new Error("SafeScript Q: Q.Template.set is not available");
        };
        Object.freeze(safeQ.Template);
        function wrapTool(nativeTool) {
          if (!nativeTool) return null;
          var wrapped = /* @__PURE__ */ Object.create(null);
          var toolElement = nativeTool.element;
          if (toolElement && ownership.isInSubtree(toolElement)) {
            Object.defineProperty(wrapped, "element", {
              get: function() {
                return handleFactory(toolElement);
              },
              enumerable: true
            });
          }
          Object.defineProperty(wrapped, "state", {
            get: function() {
              return nativeTool.state;
            },
            set: function(v) {
              nativeTool.state = v;
            },
            enumerable: true
          });
          wrapped.$ = function(selector) {
            if (!safe$) {
              throw new Error("SafeScript Q: Safe$ is required for tool.$()");
            }
            if (!toolElement) return safe$("");
            var handle = handleFactory(toolElement);
            if (selector === void 0) {
              return safe$(handle);
            }
            return safe$(selector, handle);
          };
          Object.defineProperty(wrapped, "id", {
            value: nativeTool.id || "",
            writable: false,
            enumerable: true
          });
          Object.defineProperty(wrapped, "name", {
            value: nativeTool.name || "",
            writable: false,
            enumerable: true
          });
          Object.defineProperty(wrapped, "prefix", {
            value: nativeTool.prefix || "",
            writable: false,
            enumerable: true
          });
          wrapped.child = function(toolName, id) {
            if (typeof nativeTool.child !== "function") return null;
            var child = nativeTool.child(toolName, id);
            if (!child) return null;
            if (child.element && !ownership.isInSubtree(child.element)) return null;
            return wrapTool(child);
          };
          wrapped.children = function(toolName) {
            if (typeof nativeTool.children !== "function") return {};
            var children = nativeTool.children(toolName);
            var result = /* @__PURE__ */ Object.create(null);
            if (children && typeof children === "object") {
              var keys = Object.keys(children);
              for (var i = 0; i < keys.length; i++) {
                var child = children[keys[i]];
                if (child && child.element && ownership.isInSubtree(child.element)) {
                  result[keys[i]] = wrapTool(child);
                }
              }
            }
            return result;
          };
          wrapped.remove = function() {
            if (typeof nativeTool.remove === "function") {
              nativeTool.remove();
            }
          };
          wrapped.setUpElement = function() {
            if (typeof nativeTool.setUpElement === "function") {
              return nativeTool.setUpElement.apply(nativeTool, arguments);
            }
          };
          return Object.freeze(wrapped);
        }
        safeQ.Tool = /* @__PURE__ */ Object.create(null);
        safeQ.Tool.define = function(name, methods, stateKeys) {
          if (typeof name !== "string") {
            throw new TypeError("SafeScript Q: Tool.define requires a string tool name");
          }
          if (name.length > 128) {
            throw new Error("SafeScript Q: tool name exceeds 128-character limit");
          }
          if (!methods || typeof methods !== "object") {
            throw new TypeError("SafeScript Q: Tool.define requires a methods object");
          }
          var wrappedMethods = {};
          var keys = Object.keys(methods);
          for (var i = 0; i < keys.length; i++) {
            (function(key) {
              var original = methods[key];
              if (typeof original === "function") {
                wrappedMethods[key] = function() {
                  var safeTool = wrapTool(this);
                  return original.apply(safeTool, arguments);
                };
              } else {
                wrappedMethods[key] = original;
              }
            })(keys[i]);
          }
          if (Q.Tool && typeof Q.Tool.define === "function") {
            return Q.Tool.define(name, wrappedMethods, stateKeys);
          }
          throw new Error("SafeScript Q: Q.Tool.define is not available");
        };
        safeQ.Tool.jQuery = function(config) {
          if (Q.Tool && typeof Q.Tool.jQuery === "function") {
            return Q.Tool.jQuery(config);
          }
        };
        Object.freeze(safeQ.Tool);
        function sanitizeHandler(h) {
          if (typeof h === "function") return h;
          if (h && typeof h === "object" && !Array.isArray(h)) {
            if (Array.isArray(h.handlers)) {
              var clean = [];
              for (var i = 0; i < h.handlers.length; i++) {
                if (typeof h.handlers[i] === "function") {
                  clean.push(h.handlers[i]);
                }
              }
              h.handlers = clean;
            }
            return h;
          }
          if (Array.isArray(h)) {
            var safe = [];
            for (var j = 0; j < h.length; j++) {
              if (typeof h[j] === "string") continue;
              safe.push(sanitizeHandler(h[j]));
            }
            return safe;
          }
          return null;
        }
        safeQ.handle = function(handler, context2, args) {
          if (typeof handler === "string") {
            throw new Error("SafeScript Q: Q.handle does not accept string handlers \u2014 pass a function or Q.Event instead");
          }
          var cleaned = sanitizeHandler(handler);
          if (cleaned === null) return void 0;
          if (typeof Q.handle === "function") {
            return Q.handle(cleaned, context2, args);
          }
        };
        Object.defineProperty(safeQ, "text", {
          get: function() {
            return Q.text || {};
          },
          enumerable: true
        });
        safeQ.extend = function() {
          if (typeof Q.extend === "function") {
            return Q.extend.apply(null, arguments);
          }
          var target = arguments[0] || {};
          for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            if (src && typeof src === "object") {
              var keys = Object.keys(src);
              for (var j = 0; j < keys.length; j++) {
                target[keys[j]] = src[keys[j]];
              }
            }
          }
          return target;
        };
        safeQ.each = function(obj, callback) {
          if (typeof Q.each === "function") {
            return Q.each(obj, callback);
          }
          if (Array.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
              if (callback.call(obj[i], i, obj[i]) === false) break;
            }
          } else if (obj && typeof obj === "object") {
            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j++) {
              if (callback.call(obj[keys[j]], keys[j], obj[keys[j]]) === false) break;
            }
          }
          return obj;
        };
        safeQ.getObject = function(name, obj, delimiter) {
          if (typeof Q.getObject === "function") {
            return Q.getObject(name, obj, delimiter);
          }
          if (typeof name !== "string") return void 0;
          var parts = name.split(delimiter || ".");
          var current = obj || {};
          for (var i = 0; i < parts.length; i++) {
            if (current == null || typeof current !== "object") return void 0;
            current = current[parts[i]];
          }
          return current;
        };
        safeQ.setObject = function(name, value, obj, delimiter) {
          if (typeof Q.setObject === "function") {
            return Q.setObject(name, value, obj, delimiter);
          }
          if (typeof name !== "string") return;
          var parts = name.split(delimiter || ".");
          var current = obj || {};
          for (var i = 0; i < parts.length - 1; i++) {
            if (current[parts[i]] == null || typeof current[parts[i]] !== "object") {
              current[parts[i]] = {};
            }
            current = current[parts[i]];
          }
          current[parts[parts.length - 1]] = value;
          return obj;
        };
        safeQ.isPlainObject = function(obj) {
          if (typeof Q.isPlainObject === "function") return Q.isPlainObject(obj);
          return obj !== null && typeof obj === "object" && (Object.getPrototypeOf(obj) === Object.prototype || Object.getPrototypeOf(obj) === null);
        };
        safeQ.isArrayLike = function(obj) {
          if (typeof Q.isArrayLike === "function") return Q.isArrayLike(obj);
          if (Array.isArray(obj)) return true;
          if (!obj || typeof obj !== "object") return false;
          return typeof obj.length === "number" && obj.length >= 0;
        };
        safeQ.typeOf = function(obj) {
          if (typeof Q.typeOf === "function") return Q.typeOf(obj);
          if (obj === null) return "null";
          if (Array.isArray(obj)) return "array";
          return typeof obj;
        };
        safeQ.url = function(what, fields, options) {
          if (typeof Q.url === "function") {
            return Q.url(what, fields, options);
          }
          return "";
        };
        var registeredQEvents = [];
        safeQ.addEventListener = function(eventName, handler, key) {
          if (typeof eventName !== "string" || typeof handler !== "function") {
            throw new TypeError("SafeScript Q: addEventListener requires a string event name and function handler");
          }
          budgets.allocListener();
          registeredQEvents.push({ name: eventName, handler, key });
          if (typeof Q.addEventListener === "function") {
            Q.addEventListener(eventName, handler, key);
          }
        };
        safeQ.removeEventListener = function(eventName, key) {
          if (typeof Q.removeEventListener === "function") {
            Q.removeEventListener(eventName, key);
          }
          for (var i = registeredQEvents.length - 1; i >= 0; i--) {
            if (registeredQEvents[i].name === eventName && registeredQEvents[i].key === key) {
              registeredQEvents.splice(i, 1);
              budgets.releaseListener();
              break;
            }
          }
        };
        safeQ.pipe = function(name) {
          if (typeof Q.pipe === "function") return Q.pipe(name);
          return null;
        };
        safeQ.Masks = /* @__PURE__ */ Object.create(null);
        if (Q.Masks) {
          safeQ.Masks.show = function(name, options) {
            if (typeof Q.Masks.show === "function") {
              var opts = safeQ.extend({}, options || {});
              if (!opts.element) {
                opts.element = rootNode;
              } else {
                var node = resolveNode(opts.element);
                if (node && ownership.isInSubtree(node)) {
                  opts.element = node;
                } else {
                  opts.element = rootNode;
                }
              }
              return Q.Masks.show(name, opts);
            }
          };
          safeQ.Masks.hide = function(name) {
            if (typeof Q.Masks.hide === "function") {
              return Q.Masks.hide(name);
            }
          };
        }
        Object.freeze(safeQ.Masks);
        var cleanup = function() {
          for (var i = 0; i < registeredQEvents.length; i++) {
            var entry = registeredQEvents[i];
            if (typeof Q.removeEventListener === "function") {
              Q.removeEventListener(entry.name, entry.key);
            }
          }
          registeredQEvents = [];
        };
        return { facade: safeQ, cleanup };
      }
      exports.createSafeQ = createSafeQ;
    }
  });

  // safescript-upstream/src/dom/dom-journal.js
  var require_dom_journal = __commonJS({
    "safescript-upstream/src/dom/dom-journal.js"(exports) {
      "use strict";
      function attachDOMJournal(context, journal, effectLog) {
        var origOwnership = context.ownership;
        var journalOverlay = journal;
        var effects = effectLog;
        function journalWrite(node, prop, oldValue, newValue, op) {
          journalOverlay.write(node, prop, oldValue, newValue);
          if (effects) {
            effects.push({
              kind: "dom",
              op: op || "set",
              node,
              prop,
              was: oldValue,
              to: newValue,
              tagName: node.tagName || "",
              id: node.id || ""
            });
          }
        }
        function journalRead(node, prop) {
          if (journalOverlay.has(node, prop)) {
            return journalOverlay.read(node, prop);
          }
          return node[prop];
        }
        context._journal = journalOverlay;
        context._effectLog = effects;
        context.journalWrite = journalWrite;
        context.journalRead = journalRead;
        return {
          detach: function() {
            delete context._journal;
            delete context._effectLog;
            delete context.journalWrite;
            delete context.journalRead;
          }
        };
      }
      exports.attachDOMJournal = attachDOMJournal;
    }
  });

  // safescript-upstream/src/dom/index.js
  var require_dom = __commonJS({
    "safescript-upstream/src/dom/index.js"(exports) {
      "use strict";
      var IdentityCache = require_identity_cache();
      var Ownership = require_ownership();
      var createBudgets = require_budgets().createBudgets;
      var createSafeDocument = require_safe_document().createSafeDocument;
      var createSafeTimers = require_safe_timers().createSafeTimers;
      var createSanitizer = require_sanitizer().createSanitizer;
      var createURLPolicy = require_url_policy().createURLPolicy;
      var createEventBridge = require_event_bridge().createEventBridge;
      var createSafeWindow = require_safe_window().createSafeWindow;
      var createSafeJQuery = require_safe_jquery().createSafeJQuery;
      var createSafeQ = require_safe_q().createSafeQ;
      var attachDOMJournal = require_dom_journal().attachDOMJournal;
      var DEFAULT_TAGS = [
        "div",
        "span",
        "p",
        "a",
        "b",
        "i",
        "u",
        "em",
        "strong",
        "small",
        "sub",
        "sup",
        "br",
        "hr",
        "wbr",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "dl",
        "dt",
        "dd",
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "th",
        "td",
        "caption",
        "colgroup",
        "col",
        "img",
        "picture",
        "source",
        "video",
        "audio",
        "track",
        "figure",
        "figcaption",
        "blockquote",
        "cite",
        "q",
        "pre",
        "code",
        "kbd",
        "samp",
        "var",
        "mark",
        "abbr",
        "time",
        "dfn",
        "details",
        "summary",
        "section",
        "article",
        "aside",
        "nav",
        "header",
        "footer",
        "main",
        "address",
        "form",
        "input",
        "textarea",
        "select",
        "option",
        "optgroup",
        "button",
        "label",
        "fieldset",
        "legend",
        "output",
        "progress",
        "meter",
        "canvas",
        "svg",
        "g",
        "path",
        "circle",
        "rect",
        "line",
        "polyline",
        "polygon",
        "ellipse",
        "text",
        "tspan",
        "defs",
        "use",
        "clippath",
        "mask",
        "pattern",
        "lineargradient",
        "radialgradient",
        "stop"
      ];
      var DEFAULT_ATTRIBUTES = {
        "*": [
          "id",
          "class",
          "style",
          "title",
          "lang",
          "dir",
          "tabindex",
          "role",
          "aria-*",
          "data-*",
          "hidden",
          "draggable"
        ],
        "a": ["href", "target", "rel", "download"],
        "img": ["src", "srcset", "alt", "width", "height", "loading", "decoding", "sizes"],
        "video": ["src", "poster", "controls", "autoplay", "muted", "loop", "preload", "width", "height"],
        "audio": ["src", "controls", "autoplay", "muted", "loop", "preload"],
        "source": ["src", "srcset", "type", "media", "sizes"],
        "track": ["src", "kind", "srclang", "label", "default"],
        "input": [
          "type",
          "name",
          "value",
          "placeholder",
          "required",
          "disabled",
          "checked",
          "readonly",
          "min",
          "max",
          "step",
          "pattern",
          "maxlength",
          "minlength",
          "autocomplete",
          "autofocus",
          "multiple",
          "accept",
          "size",
          "list",
          "form"
        ],
        "textarea": [
          "name",
          "rows",
          "cols",
          "placeholder",
          "required",
          "disabled",
          "readonly",
          "maxlength",
          "minlength",
          "wrap",
          "autocomplete",
          "autofocus",
          "form"
        ],
        "select": ["name", "required", "disabled", "multiple", "size", "form", "autofocus"],
        "option": ["value", "selected", "disabled", "label"],
        "optgroup": ["label", "disabled"],
        "button": ["type", "name", "value", "disabled", "form", "autofocus"],
        "form": ["action", "method", "enctype", "novalidate", "target", "autocomplete"],
        "label": ["for"],
        "td": ["colspan", "rowspan", "headers"],
        "th": ["colspan", "rowspan", "headers", "scope", "abbr"],
        "col": ["span"],
        "colgroup": ["span"],
        "time": ["datetime"],
        "progress": ["value", "max"],
        "meter": ["value", "min", "max", "low", "high", "optimum"],
        "output": ["for", "name", "form"],
        "details": ["open"],
        "canvas": ["width", "height"],
        "svg": ["viewBox", "width", "height", "xmlns", "fill", "stroke", "stroke-width"],
        "path": ["d", "fill", "stroke", "stroke-width", "transform"],
        "circle": ["cx", "cy", "r", "fill", "stroke", "stroke-width"],
        "rect": ["x", "y", "width", "height", "rx", "ry", "fill", "stroke", "stroke-width"],
        "line": ["x1", "y1", "x2", "y2", "stroke", "stroke-width"],
        "polyline": ["points", "fill", "stroke", "stroke-width"],
        "polygon": ["points", "fill", "stroke", "stroke-width"],
        "ellipse": ["cx", "cy", "rx", "ry", "fill", "stroke", "stroke-width"],
        "text": ["x", "y", "dx", "dy", "text-anchor", "fill", "font-size", "font-family", "transform"],
        "tspan": ["x", "y", "dx", "dy"],
        "g": ["transform", "fill", "stroke", "stroke-width", "opacity"],
        "use": ["href", "x", "y", "width", "height"],
        "clippath": ["id"],
        "lineargradient": ["id", "x1", "y1", "x2", "y2", "gradientunits", "gradienttransform"],
        "radialgradient": ["id", "cx", "cy", "r", "fx", "fy", "gradientunits", "gradienttransform"],
        "stop": ["offset", "stop-color", "stop-opacity"]
      };
      var DEFAULT_EVENTS = [
        "click",
        "dblclick",
        "mousedown",
        "mouseup",
        "mousemove",
        "mouseenter",
        "mouseleave",
        "mouseover",
        "mouseout",
        "keydown",
        "keyup",
        "keypress",
        "focus",
        "blur",
        "focusin",
        "focusout",
        "input",
        "change",
        "submit",
        "reset",
        "touchstart",
        "touchend",
        "touchmove",
        "touchcancel",
        "pointerdown",
        "pointerup",
        "pointermove",
        "pointerenter",
        "pointerleave",
        "pointerover",
        "pointerout",
        "pointercancel",
        "wheel",
        "scroll",
        "resize",
        "drag",
        "dragstart",
        "dragend",
        "dragenter",
        "dragleave",
        "dragover",
        "drop",
        "animationstart",
        "animationend",
        "animationiteration",
        "transitionend",
        "transitionstart",
        "transitionrun",
        "transitioncancel",
        "load",
        "error",
        "abort",
        "contextmenu",
        "select",
        "copy",
        "cut",
        "paste",
        "play",
        "pause",
        "ended",
        "volumechange",
        "timeupdate",
        "seeked",
        "seeking",
        "canplay",
        "canplaythrough",
        "loadeddata",
        "loadedmetadata",
        "toggle"
      ];
      function mergePolicy(hostPolicy) {
        var p = hostPolicy || {};
        return {
          tags: p.tags || DEFAULT_TAGS,
          attributes: p.attributes || DEFAULT_ATTRIBUTES,
          events: p.events || DEFAULT_EVENTS,
          url: p.url || null,
          // host URL hook
          limits: p.limits || {},
          styles: p.styles || null
          // optional style property allowlist
        };
      }
      function createDOMContext(root, policy, debugSession) {
        var merged = mergePolicy(policy);
        var ownership = new Ownership(root);
        var cache = new IdentityCache();
        var budgets = createBudgets(merged.limits);
        var urlPolicy = createURLPolicy(merged.url, "");
        var context = {
          rootNode: root,
          rootHandle: null,
          // filled below
          policy: merged,
          ownership,
          cache,
          budgets,
          sanitizer: null,
          // filled below
          eventBridge: null,
          // filled below
          handleFactory: function(node) {
            return cache.getOrCreate(node, context);
          }
        };
        context.sanitizer = createSanitizer(merged);
        context.eventBridge = createEventBridge(context);
        context.rootHandle = cache.getOrCreate(root, context);
        var safeDoc = createSafeDocument(context);
        var timers = createSafeTimers(budgets);
        var safeWin = createSafeWindow(context, budgets);
        var safe$ = createSafeJQuery(context);
        var safeQResult = createSafeQ(context, safe$);
        var initialNodes = budgets.countSubtreeNodes(root);
        budgets.setNodeCount(initialNodes);
        var domJournalAdapter = null;
        if (debugSession && debugSession.journal) {
          domJournalAdapter = attachDOMJournal(context, debugSession.journal, debugSession._effectLog);
        }
        var scope = {
          document: safeDoc,
          window: safeWin.facade,
          $: safe$,
          jQuery: safe$,
          Q: safeQResult.facade,
          setTimeout: timers.setTimeout,
          clearTimeout: timers.clearTimeout,
          setInterval: timers.setInterval,
          clearInterval: timers.clearInterval,
          console: Object.freeze({
            log: function() {
            },
            warn: function() {
            },
            error: function() {
            },
            info: function() {
            },
            debug: function() {
            }
          })
        };
        return {
          scope,
          context,
          cleanup: function() {
            timers.cleanup();
            if (safeWin.cleanup) safeWin.cleanup();
            if (safeQResult.cleanup) safeQResult.cleanup();
            if (context.eventBridge && context.eventBridge.cleanup) {
              context.eventBridge.cleanup();
            }
            if (domJournalAdapter) domJournalAdapter.detach();
            cache.clear();
            ownership.clear();
          }
        };
      }
      exports.createDOMContext = createDOMContext;
      exports.mergePolicy = mergePolicy;
      exports.DEFAULT_TAGS = DEFAULT_TAGS;
      exports.DEFAULT_ATTRIBUTES = DEFAULT_ATTRIBUTES;
      exports.DEFAULT_EVENTS = DEFAULT_EVENTS;
      exports.SafeDOMDocument = "SafeDOMDocument";
      exports.SafeHTMLElement = "SafeHTMLElement";
      exports.SafeWindow = "SafeWindow";
      exports.SafeJQuery = "SafeJQuery";
      exports.SafeQ = "SafeQ";
    }
  });

  // safescript-upstream/src/runtime.js
  var require_runtime = __commonJS({
    "safescript-upstream/src/runtime.js"(exports) {
      "use strict";
      var defs = require_defs();
      var MAX_TIMEOUT = 6e4;
      var MAX_OPS = 1e8;
      var MAX_MEMORY = 64 * 1024 * 1024;
      var _typeRegistry = /* @__PURE__ */ new Map();
      var SAFE_CTORS = [
        Error,
        TypeError,
        RangeError,
        SyntaxError,
        ReferenceError,
        Map,
        Set,
        Date,
        RegExp
      ];
      var REGEX_METHODS = {
        test: true,
        match: true,
        matchAll: true,
        exec: true,
        search: true,
        replace: true,
        replaceAll: true,
        split: true
      };
      var REGEX_INPUT_MAX = 102400;
      var NESTED_QUANTIFIER_RE = /(\+|\*|\?|\{[0-9,]+\})\s*\)?(\+|\*|\?|\{)/;
      function _checkRegexSafety(args, method) {
        var pattern = null;
        var input = null;
        for (var i = 0; i < args.length; i++) {
          var a = args[i];
          if (a instanceof RegExp) {
            pattern = a.source;
          } else if (typeof a === "string" && input === null) {
            input = a;
          }
        }
        if (input !== null && input.length > REGEX_INPUT_MAX) {
          throw new Error("SafeScript: regex input too large (" + input.length + " chars, max " + REGEX_INPUT_MAX + ")");
        }
        if (pattern && NESTED_QUANTIFIER_RE.test(pattern)) {
          throw new Error("SafeScript: regex pattern contains nested quantifiers (ReDoS risk): /" + pattern + "/");
        }
      }
      var SAFE_NEW_CTORS = [
        Map,
        Set,
        Date,
        RegExp,
        Error,
        TypeError,
        RangeError,
        SyntaxError,
        ReferenceError
      ];
      function registerType(ctor, config) {
        if (typeof ctor !== "function") {
          throw new Error("SafeScript: registerType expects a constructor function");
        }
        if (!config || !Array.isArray(config.allowMethods)) {
          throw new Error("SafeScript: registerType config must have allowMethods array");
        }
        _typeRegistry.set(ctor, config);
      }
      function unregisterType(ctor) {
        _typeRegistry.delete(ctor);
      }
      function clearTypeRegistry() {
        _typeRegistry.clear();
      }
      function __at(obj, key) {
        if (obj == null) {
          throw new TypeError('Cannot read property "' + key + '" of ' + String(obj));
        }
        var k = String(key);
        if (defs.BLOCKED_PROPS[k]) return void 0;
        return obj[k];
      }
      function __set(obj, key, val) {
        if (obj == null) {
          throw new TypeError('Cannot set property "' + key + '" of ' + String(obj));
        }
        var k = String(key);
        if (defs.BLOCKED_PROPS[k]) {
          throw new TypeError('SafeScript: cannot set blocked property "' + k + '"');
        }
        obj[k] = val;
        return val;
      }
      function __call(obj, method) {
        if (obj == null) {
          throw new TypeError('Cannot read property "' + method + '" of ' + String(obj));
        }
        var args = [];
        for (var i = 2; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        var t = typeof obj;
        if (t === "string" || t === "number" || t === "boolean") {
          var fn = obj[method];
          if (typeof fn !== "function") return void 0;
          if (t === "string" && REGEX_METHODS[method]) {
            _checkRegexSafety(args, method);
          }
          return fn.apply(obj, args);
        }
        if (t === "function") {
          var fn = obj[method];
          if (typeof fn !== "function") return void 0;
          return fn.apply(obj, args);
        }
        if (t !== "object") return void 0;
        if (Array.isArray(obj)) {
          var fn = obj[method];
          if (typeof fn !== "function") return void 0;
          return fn.apply(obj, args);
        }
        var proto = Object.getPrototypeOf(obj);
        if (proto === null || proto === Object.prototype) {
          var fn = obj[method];
          if (typeof fn === "function") return fn.apply(obj, args);
          return void 0;
        }
        var ctor = obj.constructor;
        for (var j = 0; j < SAFE_CTORS.length; j++) {
          if (ctor === SAFE_CTORS[j]) {
            var fn = obj[method];
            if (typeof fn === "function") return fn.apply(obj, args);
            return void 0;
          }
        }
        var regConfig = null;
        var regName = ctor && ctor.name || "object";
        if (ctor && _typeRegistry.has(ctor)) {
          regConfig = _typeRegistry.get(ctor);
        } else {
          var p = proto;
          while (p && p !== Object.prototype) {
            var pc = p.constructor;
            if (pc && _typeRegistry.has(pc)) {
              regConfig = _typeRegistry.get(pc);
              break;
            }
            p = Object.getPrototypeOf(p);
          }
        }
        if (regConfig) {
          var allowed = regConfig.allowMethods || [];
          if (allowed.indexOf(method) === -1) {
            throw new Error('SafeScript: method "' + method + '" not allowed on ' + regName + " \u2014 register with SafeScript.lib()");
          }
          return obj[method].apply(obj, args);
        }
        throw new Error("SafeScript: cannot call methods on unregistered type" + (ctor && ctor.name ? " " + ctor.name : "") + " \u2014 register with SafeScript.lib()");
      }
      function __call_opt(obj, method) {
        if (obj == null) return void 0;
        return __call.apply(void 0, arguments);
      }
      function __new(ctor, args) {
        if (typeof ctor !== "function") {
          throw new TypeError("SafeScript: new requires a constructor function");
        }
        var original = ctor.__original || ctor;
        for (var i = 0; i < SAFE_NEW_CTORS.length; i++) {
          if (ctor === SAFE_NEW_CTORS[i] || original === SAFE_NEW_CTORS[i]) {
            return new (Function.prototype.bind.apply(original, [null].concat(args)))();
          }
        }
        if (_typeRegistry.has(ctor) || _typeRegistry.has(original)) {
          return new (Function.prototype.bind.apply(original, [null].concat(args)))();
        }
        if (_allowNewCtors) {
          for (var j = 0; j < _allowNewCtors.length; j++) {
            if (ctor === _allowNewCtors[j] || original === _allowNewCtors[j]) {
              return new (Function.prototype.bind.apply(original, [null].concat(args)))();
            }
          }
        }
        throw new Error("SafeScript: constructor " + (ctor.name || "(anonymous)") + " is not allowed with new \u2014 register with SafeScript.lib() or pass in opts.allowNew");
      }
      var _allowNewCtors = null;
      function sanitizeReturn(val, _seen) {
        if (val === null || val === void 0) return val;
        var t = typeof val;
        if (t === "string" || t === "number" || t === "boolean" || t === "bigint") return val;
        if (t === "function") return void 0;
        if (t !== "object") return void 0;
        if (!_seen) _seen = /* @__PURE__ */ new Map();
        if (_seen.has(val)) return _seen.get(val);
        if (Array.isArray(val)) {
          var arr = [];
          _seen.set(val, arr);
          for (var i = 0; i < val.length; i++) {
            arr[i] = sanitizeReturn(val[i], _seen);
          }
          return arr;
        }
        if (val instanceof Date || val instanceof RegExp || val instanceof Map || val instanceof Set) {
          return val;
        }
        for (var j = 0; j < SAFE_CTORS.length; j++) {
          if (val instanceof SAFE_CTORS[j]) return val;
        }
        var proto = Object.getPrototypeOf(val);
        if (proto !== null && proto !== Object.prototype) {
          var ctor = val.constructor;
          if (ctor && _typeRegistry.has(ctor)) return val;
          var p = proto;
          while (p && p !== Object.prototype) {
            var pc = p.constructor;
            if (pc && _typeRegistry.has(pc)) return val;
            p = Object.getPrototypeOf(p);
          }
          return void 0;
        }
        var out = /* @__PURE__ */ Object.create(null);
        _seen.set(val, out);
        var keys = Object.keys(val);
        for (var k = 0; k < keys.length; k++) {
          var sv = sanitizeReturn(val[keys[k]], _seen);
          if (sv !== void 0 || val[keys[k]] === void 0) {
            out[keys[k]] = sv;
          }
        }
        return out;
      }
      var _wrappedFns = /* @__PURE__ */ new WeakMap();
      function _wrapScopeFunction(fn) {
        if (_wrappedFns.has(fn)) return _wrappedFns.get(fn);
        var wrapper = function() {
          return fn.apply(this, arguments);
        };
        wrapper.toString = function() {
          return "function " + (fn.name || "") + "() { [host] }";
        };
        wrapper.toSource = wrapper.toString;
        wrapper.__original = fn;
        wrapper.prototype = fn.prototype;
        Object.defineProperty(wrapper, "length", { value: fn.length });
        Object.defineProperty(wrapper, "name", { value: fn.name || "" });
        Object.freeze(wrapper);
        _wrappedFns.set(fn, wrapper);
        return wrapper;
      }
      function __stripErr(err) {
        _stripStack(err);
      }
      function _stripStack(err) {
        if (err && typeof err === "object" && err.stack) {
          try {
            Object.defineProperty(err, "stack", {
              get: function() {
                return (err.constructor.name || "Error") + ": " + (err.message || "");
              },
              set: function() {
              },
              configurable: true
            });
          } catch (e) {
          }
        }
        return err;
      }
      function _makeSafeErrorCtor(NativeError) {
        var SafeError = function(msg) {
          var e = new NativeError(msg);
          Object.defineProperty(e, "stack", {
            get: function() {
              return NativeError.name + ": " + (e.message || "");
            },
            set: function() {
            },
            configurable: true
          });
          return e;
        };
        SafeError.prototype = NativeError.prototype;
        Object.defineProperty(SafeError, "name", { value: NativeError.name });
        return Object.freeze(SafeError);
      }
      function sanitize(obj, _seen) {
        if (obj === null || obj === void 0) return obj;
        if (typeof obj === "function") return _wrapScopeFunction(obj);
        if (typeof obj !== "object") return obj;
        if (!_seen) _seen = /* @__PURE__ */ new Map();
        if (_seen.has(obj)) return _seen.get(obj);
        if (Array.isArray(obj)) {
          var arr = [];
          _seen.set(obj, arr);
          for (var i = 0; i < obj.length; i++) {
            arr[i] = sanitize(obj[i], _seen);
          }
          return arr;
        }
        var proto = Object.getPrototypeOf(obj);
        if (proto !== Object.prototype && proto !== null) {
          return obj;
        }
        var out = /* @__PURE__ */ Object.create(null);
        _seen.set(obj, out);
        var keys = Object.getOwnPropertyNames(obj);
        for (var j = 0; j < keys.length; j++) {
          out[keys[j]] = sanitize(obj[keys[j]], _seen);
        }
        return out;
      }
      function buildShadowList() {
        var all = /* @__PURE__ */ Object.create(null);
        defs.SHADOW_STATIC.forEach(function(k) {
          all[k] = 1;
        });
        delete all["eval"];
        delete all["arguments"];
        return Object.keys(all);
      }
      function sanitizeJsonParsed(obj) {
        if (obj === null || typeof obj !== "object") return obj;
        if (Array.isArray(obj)) {
          for (var i = 0; i < obj.length; i++) {
            obj[i] = sanitizeJsonParsed(obj[i]);
          }
          return obj;
        }
        var out = /* @__PURE__ */ Object.create(null);
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === "__proto__") continue;
          out[keys[i]] = sanitizeJsonParsed(obj[keys[i]]);
        }
        return out;
      }
      function buildSafeGlobals() {
        var sg = /* @__PURE__ */ Object.create(null);
        sg.Object = Object.freeze({
          create: function(proto) {
            if (proto !== null) {
              throw new TypeError("SafeScript: Object.create only allows null prototype");
            }
            return /* @__PURE__ */ Object.create(null);
          },
          keys: Object.keys,
          values: Object.values,
          entries: Object.entries,
          assign: Object.assign,
          freeze: Object.freeze,
          isFrozen: Object.isFrozen,
          getOwnPropertyNames: Object.getOwnPropertyNames
        });
        sg.Array = Object.freeze({
          isArray: Array.isArray,
          from: Array.from,
          of: Array.of
        });
        sg.String = Object.freeze({
          fromCharCode: String.fromCharCode,
          fromCodePoint: String.fromCodePoint
        });
        sg.Number = Object.freeze({
          isInteger: Number.isInteger,
          isFinite: Number.isFinite,
          isNaN: Number.isNaN,
          parseInt: Number.parseInt,
          parseFloat: Number.parseFloat,
          MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
          MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
          EPSILON: Number.EPSILON,
          MAX_VALUE: Number.MAX_VALUE,
          MIN_VALUE: Number.MIN_VALUE,
          POSITIVE_INFINITY: Number.POSITIVE_INFINITY,
          NEGATIVE_INFINITY: Number.NEGATIVE_INFINITY,
          NaN: Number.NaN
        });
        sg.Math = Object.freeze({
          abs: Math.abs,
          ceil: Math.ceil,
          floor: Math.floor,
          round: Math.round,
          trunc: Math.trunc,
          sign: Math.sign,
          max: Math.max,
          min: Math.min,
          pow: Math.pow,
          sqrt: Math.sqrt,
          cbrt: Math.cbrt,
          log: Math.log,
          log2: Math.log2,
          log10: Math.log10,
          log1p: Math.log1p,
          exp: Math.exp,
          expm1: Math.expm1,
          sin: Math.sin,
          cos: Math.cos,
          tan: Math.tan,
          asin: Math.asin,
          acos: Math.acos,
          atan: Math.atan,
          atan2: Math.atan2,
          sinh: Math.sinh,
          cosh: Math.cosh,
          tanh: Math.tanh,
          asinh: Math.asinh,
          acosh: Math.acosh,
          atanh: Math.atanh,
          hypot: Math.hypot,
          clz32: Math.clz32,
          imul: Math.imul,
          fround: Math.fround,
          PI: Math.PI,
          E: Math.E,
          LN2: Math.LN2,
          LN10: Math.LN10,
          LOG2E: Math.LOG2E,
          LOG10E: Math.LOG10E,
          SQRT2: Math.SQRT2,
          SQRT1_2: Math.SQRT1_2
        });
        sg.JSON = Object.freeze({
          parse: function(text, reviver) {
            return sanitizeJsonParsed(JSON.parse(text, reviver));
          },
          stringify: JSON.stringify
        });
        sg.Error = _makeSafeErrorCtor(Error);
        sg.TypeError = _makeSafeErrorCtor(TypeError);
        sg.RangeError = _makeSafeErrorCtor(RangeError);
        sg.SyntaxError = _makeSafeErrorCtor(SyntaxError);
        sg.ReferenceError = _makeSafeErrorCtor(ReferenceError);
        sg.Map = Map;
        sg.Set = Set;
        sg.Date = Date;
        sg.RegExp = RegExp;
        sg.parseInt = parseInt;
        sg.parseFloat = parseFloat;
        sg.isNaN = isNaN;
        sg.isFinite = isFinite;
        sg.encodeURI = encodeURI;
        sg.decodeURI = decodeURI;
        sg.encodeURIComponent = encodeURIComponent;
        sg.decodeURIComponent = decodeURIComponent;
        sg.NaN = NaN;
        sg.Infinity = Infinity;
        return sg;
      }
      var SAFE_GLOBALS = buildSafeGlobals();
      SAFE_NEW_CTORS.push(
        SAFE_GLOBALS.Error,
        SAFE_GLOBALS.TypeError,
        SAFE_GLOBALS.RangeError,
        SAFE_GLOBALS.SyntaxError,
        SAFE_GLOBALS.ReferenceError
      );
      var SAFE_GLOBAL_NAMES = Object.keys(SAFE_GLOBALS);
      function mulberry32(seed) {
        var state = seed | 0;
        return function() {
          state = state + 1831565813 | 0;
          var t = Math.imul(state ^ state >>> 15, 1 | state);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }
      function buildSafeGlobalsWithRandom(randomFn) {
        var sg = /* @__PURE__ */ Object.create(null);
        var keys = SAFE_GLOBAL_NAMES;
        for (var i = 0; i < keys.length; i++) {
          sg[keys[i]] = SAFE_GLOBALS[keys[i]];
        }
        var mathProps = Object.getOwnPropertyNames(SAFE_GLOBALS.Math);
        var newMath = /* @__PURE__ */ Object.create(null);
        for (var j = 0; j < mathProps.length; j++) {
          newMath[mathProps[j]] = SAFE_GLOBALS.Math[mathProps[j]];
        }
        newMath.random = randomFn;
        sg.Math = Object.freeze(newMath);
        return sg;
      }
      function wrapFnWithHooks(fn, name, hooks, state) {
        return async function() {
          var args = Array.prototype.slice.call(arguments);
          state.callCount++;
          var elapsed = Date.now() - state.startTime;
          var info = { name, args, callCount: state.callCount, elapsed };
          if (hooks.beforeCall) {
            var decision = hooks.beforeCall(info);
            if (decision === false) return void 0;
            if (decision && typeof decision === "object") {
              if ("value" in decision) return decision.value;
              if (decision.args) args = decision.args;
            }
          }
          var result = await fn.apply(void 0, args);
          if (hooks.afterCall) {
            info.result = result;
            info.elapsed = Date.now() - state.startTime;
            var afterDecision = hooks.afterCall(info);
            if (afterDecision === false) return void 0;
            if (afterDecision && typeof afterDecision === "object") {
              if ("value" in afterDecision) return afterDecision.value;
            }
          }
          return result;
        };
      }
      function wrapScopeWithHooks(scopeObj, hooks, state, prefix) {
        if (!scopeObj || typeof scopeObj !== "object") return scopeObj;
        var keys = Object.keys(scopeObj);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var val = scopeObj[key];
          var path = prefix ? prefix + "." + key : key;
          if (typeof val === "function") {
            scopeObj[key] = wrapFnWithHooks(val, path, hooks, state);
          } else if (val && typeof val === "object" && !Array.isArray(val)) {
            wrapScopeWithHooks(val, hooks, state, path);
          }
        }
        return scopeObj;
      }
      function wrapCallbackWithFacade(fn, facade, thisCell) {
        return function() {
          thisCell.value = facade;
          return fn.apply(void 0, arguments);
        };
      }
      function makeFacadeWrapper(origFn, config, thisCell) {
        var argIndices = config.args || [];
        var methodIndices = config.methods || [];
        var createFacade = config.create;
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var facade = createFacade ? createFacade.apply(void 0, args) : void 0;
          for (var i = 0; i < argIndices.length; i++) {
            var idx = argIndices[i];
            if (typeof args[idx] === "function") {
              args[idx] = wrapCallbackWithFacade(args[idx], facade, thisCell);
            }
          }
          for (var i = 0; i < methodIndices.length; i++) {
            var idx = methodIndices[i];
            if (args[idx] && typeof args[idx] === "object") {
              var methodObj = args[idx];
              var keys = Object.keys(methodObj);
              for (var j = 0; j < keys.length; j++) {
                if (typeof methodObj[keys[j]] === "function") {
                  methodObj[keys[j]] = wrapCallbackWithFacade(methodObj[keys[j]], facade, thisCell);
                }
              }
            }
          }
          return origFn.apply(void 0, args);
        };
      }
      function applyFacades(scopeObj, facades, thisCell) {
        var paths = Object.keys(facades);
        for (var p = 0; p < paths.length; p++) {
          var path = paths[p];
          var config = facades[path];
          var parts = path.split(".");
          var obj = scopeObj;
          for (var i = 0; i < parts.length - 1; i++) {
            if (!obj || typeof obj !== "object") {
              obj = null;
              break;
            }
            obj = obj[parts[i]];
          }
          if (!obj || typeof obj !== "object") continue;
          var fnName = parts[parts.length - 1];
          var origFn = obj[fnName];
          if (typeof origFn !== "function") continue;
          obj[fnName] = makeFacadeWrapper(origFn, config, thisCell);
        }
      }
      function buildFunction(source, scope, opts) {
        opts = opts || {};
        var scopeObj = scope ? sanitize(scope) : /* @__PURE__ */ Object.create(null);
        var scopeKeys = scope ? Object.keys(scope) : [];
        var domContext = null;
        var needsDOM = opts.dom && opts.dom.root;
        if (!needsDOM && opts.header) {
          var resolveUses = require_header().resolveUses;
          var resolved = resolveUses(opts.header);
          if (resolved.dom && opts.dom && opts.dom.root) {
            needsDOM = true;
          }
        }
        if (needsDOM) {
          var createDOMContext;
          try {
            createDOMContext = require_dom().createDOMContext;
          } catch (e) {
          }
          if (!createDOMContext) {
            throw new Error("SafeScript: DOM membrane is not available in this environment. Provide DOM access via scope instead.");
          }
          domContext = createDOMContext(opts.dom.root, opts.dom.policy, debugSession);
          if (debugSession) {
            debugSession.setDOMRoot(opts.dom.root);
          }
          var domScope = domContext.scope;
          var domKeys = Object.keys(domScope);
          for (var d = 0; d < domKeys.length; d++) {
            var dk = domKeys[d];
            scopeObj[dk] = domScope[dk];
            if (scopeKeys.indexOf(dk) === -1) {
              scopeKeys.push(dk);
            }
          }
        }
        var hooks = opts.hooks || null;
        var hookState = { callCount: 0, startTime: 0 };
        if (hooks && (hooks.beforeCall || hooks.afterCall)) {
          wrapScopeWithHooks(scopeObj, hooks, hookState);
        }
        var thisCell = { value: void 0 };
        if (opts.facades) {
          applyFacades(scopeObj, opts.facades, thisCell);
        }
        var timeout = opts.timeout || 0;
        if (timeout > MAX_TIMEOUT) timeout = MAX_TIMEOUT;
        if (timeout <= 0 && MAX_TIMEOUT > 0) timeout = MAX_TIMEOUT;
        var maxOps = opts.maxOps || MAX_OPS;
        if (maxOps > MAX_OPS) maxOps = MAX_OPS;
        var maxMemory = opts.maxMemory || MAX_MEMORY;
        if (maxMemory > MAX_MEMORY) maxMemory = MAX_MEMORY;
        var shadowList = buildShadowList();
        var shadowDecl = shadowList.length > 0 ? "var " + shadowList.join(", ") + ";\n" : "";
        var safeAssign = SAFE_GLOBAL_NAMES.map(function(n) {
          return n + " = __safeGlobals." + n;
        }).join("; ") + ";\n";
        var thisPreamble = "var __safeThis = __thisCell.value; __thisCell.value = undefined;\n";
        var body = '"use strict";\n' + shadowDecl + safeAssign + thisPreamble + source;
        var allowNew = opts.allowNew || null;
        var debugSession = opts.debugSession || null;
        var _debugOriginals = null;
        if (debugSession && scope) {
          _debugOriginals = /* @__PURE__ */ new Map();
          var origKeys = Object.keys(scope);
          for (var oi = 0; oi < origKeys.length; oi++) {
            var origVal = scope[origKeys[oi]];
            var sanVal = scopeObj[origKeys[oi]];
            if (origVal && typeof origVal === "object" && sanVal && typeof sanVal === "object") {
              _debugOriginals.set(sanVal, origVal);
              var nestedKeys = Object.keys(origVal);
              for (var ni = 0; ni < nestedKeys.length; ni++) {
                var nOrig = origVal[nestedKeys[ni]];
                var nSan = sanVal[nestedKeys[ni]];
                if (nOrig && typeof nOrig === "object" && nSan && typeof nSan === "object") {
                  _debugOriginals.set(nSan, nOrig);
                }
              }
            }
          }
        }
        var paramNames = ["__scope", "__at", "__set", "__call", "__call_opt", "__new", "__check", "__thisCell", "__safeGlobals", "__dbg", "__stripErr"].concat(scopeKeys);
        var AsyncFunction = Object.getPrototypeOf(async function() {
        }).constructor;
        var fn = new AsyncFunction(paramNames.join(", "), body);
        var seed = opts.seed !== void 0 ? opts.seed : 0;
        if (seed === null) {
          var env = opts.env || {};
          if (!env.Random) {
            throw new Error("SafeScript: seed: null requires env: { Random: true } (nondeterministic RNG needs host approval)");
          }
        }
        return function() {
          var deadline = Date.now() + timeout;
          var opsRemaining = maxOps;
          hookState.callCount = 0;
          hookState.startTime = Date.now();
          thisCell.value = void 0;
          var memUsed = 0;
          function estimateSize(val) {
            if (val == null) return 0;
            var t = typeof val;
            if (t === "string") return 40 + val.length * 2;
            if (t === "number" || t === "boolean") return 16;
            if (t === "function") return 128;
            if (Array.isArray(val)) return 64 + val.length * 8;
            if (t === "object") {
              var keys = Object.keys(val);
              return 64 + keys.length * 32;
            }
            return 16;
          }
          function trackAlloc(bytes) {
            memUsed += bytes;
            if (memUsed > maxMemory) {
              throw new Error("SafeScript: estimated memory limit exceeded (" + maxMemory / (1024 * 1024) + " MB)");
            }
          }
          function __check() {
            if (--opsRemaining <= 0) {
              throw new Error("SafeScript: max operations exceeded (" + maxOps + ")");
            }
            if (Date.now() > deadline) {
              throw new Error("SafeScript: execution timed out after " + timeout + "ms");
            }
          }
          var invocationGlobals;
          if (seed === null) {
            invocationGlobals = buildSafeGlobalsWithRandom(Math.random);
          } else {
            invocationGlobals = buildSafeGlobalsWithRandom(mulberry32(seed));
          }
          var origObjCreate = invocationGlobals.Object.create;
          var origArrayFrom = invocationGlobals.Array.from;
          var origArrayOf = invocationGlobals.Array.of;
          var origJsonParse = invocationGlobals.JSON.parse;
          invocationGlobals.Object = Object.freeze({
            create: function(proto) {
              var r = origObjCreate(proto);
              trackAlloc(64);
              return r;
            },
            keys: Object.keys,
            values: Object.values,
            entries: Object.entries,
            assign: Object.assign,
            freeze: Object.freeze,
            isFrozen: Object.isFrozen,
            getOwnPropertyNames: Object.getOwnPropertyNames
          });
          invocationGlobals.Array = Object.freeze({
            isArray: Array.isArray,
            from: function() {
              var r = origArrayFrom.apply(null, arguments);
              trackAlloc(estimateSize(r));
              return r;
            },
            of: function() {
              var r = origArrayOf.apply(null, arguments);
              trackAlloc(estimateSize(r));
              return r;
            }
          });
          invocationGlobals.JSON = Object.freeze({
            parse: function(text, reviver) {
              var r = origJsonParse(text, reviver);
              trackAlloc(estimateSize(r) + (typeof text === "string" ? text.length : 0));
              return r;
            },
            stringify: JSON.stringify
          });
          _allowNewCtors = allowNew;
          var __dbg;
          var effectiveAt = __at;
          var effectiveSet = function(obj, key, val) {
            if (obj == null) {
              throw new TypeError('Cannot set property "' + key + '" of ' + String(obj));
            }
            var k = String(key);
            if (defs.BLOCKED_PROPS[k]) {
              throw new TypeError('SafeScript: cannot set blocked property "' + k + '"');
            }
            if (!(k in obj)) {
              trackAlloc(32 + estimateSize(val));
            }
            obj[k] = val;
            return val;
          };
          var baseNew = __new;
          var effectiveNew = function(ctor) {
            var result = baseNew.apply(void 0, arguments);
            trackAlloc(estimateSize(result));
            return result;
          };
          var ALLOC_METHODS = {
            map: 1,
            filter: 1,
            concat: 1,
            slice: 1,
            flat: 1,
            flatMap: 1,
            splice: 1,
            split: 1,
            repeat: 1,
            padStart: 1,
            padEnd: 1,
            join: 1,
            replace: 1,
            replaceAll: 1,
            trim: 1,
            trimStart: 1,
            trimEnd: 1,
            substring: 1,
            substr: 1,
            toUpperCase: 1,
            toLowerCase: 1
          };
          var effectiveCall = function(obj, method) {
            var result = __call.apply(void 0, arguments);
            if (ALLOC_METHODS[method] && result != null) {
              trackAlloc(estimateSize(result));
            }
            return result;
          };
          var effectiveCallOpt = function(obj, method) {
            var result = __call_opt.apply(void 0, arguments);
            if (ALLOC_METHODS[method] && result != null) {
              trackAlloc(estimateSize(result));
            }
            return result;
          };
          if (debugSession) {
            __dbg = debugSession.createCheckpoint();
            var journal = debugSession.journal;
            effectiveAt = function(obj, key) {
              if (obj == null) {
                throw new TypeError('Cannot read property "' + key + '" of ' + String(obj));
              }
              var k = String(key);
              if (defs.BLOCKED_PROPS[k]) return void 0;
              if (journal.has(obj, k)) {
                return journal.read(obj, k);
              }
              return obj[k];
            };
            effectiveSet = function(obj, key, val) {
              if (obj == null) {
                throw new TypeError('Cannot set property "' + key + '" of ' + String(obj));
              }
              var k = String(key);
              if (defs.BLOCKED_PROPS[k]) {
                throw new TypeError('SafeScript: cannot set blocked property "' + k + '"');
              }
              if (!(k in obj)) {
                trackAlloc(32 + estimateSize(val));
              }
              var origObj = _debugOriginals && _debugOriginals.has(obj) ? _debugOriginals.get(obj) : obj;
              var oldVal = journal.has(origObj, k) ? journal.read(origObj, k) : origObj[k];
              journal.write(origObj, k, oldVal, val);
              obj[k] = val;
              debugSession._effectLog.push({
                kind: "write",
                target: origObj,
                key: k,
                was: oldVal,
                to: val
              });
              return val;
            };
            effectiveCall = function(obj, method) {
              var callArgs = [];
              for (var ci = 2; ci < arguments.length; ci++) {
                callArgs.push(arguments[ci]);
              }
              debugSession._effectLog.push({
                kind: "call",
                target: obj,
                method,
                args: callArgs
              });
              var result = __call.apply(void 0, arguments);
              if (ALLOC_METHODS[method] && result != null) {
                trackAlloc(estimateSize(result));
              }
              return result;
            };
            effectiveCallOpt = function(obj, method) {
              if (obj == null) return void 0;
              var callArgs = [];
              for (var ci = 2; ci < arguments.length; ci++) {
                callArgs.push(arguments[ci]);
              }
              debugSession._effectLog.push({
                kind: "call",
                target: obj,
                method,
                args: callArgs,
                optional: true
              });
              var result = __call_opt.apply(void 0, arguments);
              if (ALLOC_METHODS[method] && result != null) {
                trackAlloc(estimateSize(result));
              }
              return result;
            };
          } else {
            __dbg = async function() {
              return null;
            };
          }
          var safeAt = function() {
            try {
              return effectiveAt.apply(void 0, arguments);
            } catch (e) {
              throw _stripStack(e);
            }
          };
          var safeSet = function() {
            try {
              return effectiveSet.apply(void 0, arguments);
            } catch (e) {
              throw _stripStack(e);
            }
          };
          var safeCall = function() {
            try {
              return effectiveCall.apply(void 0, arguments);
            } catch (e) {
              throw _stripStack(e);
            }
          };
          var safeCallOpt = function() {
            try {
              return effectiveCallOpt.apply(void 0, arguments);
            } catch (e) {
              throw _stripStack(e);
            }
          };
          var safeNew = function() {
            try {
              return effectiveNew.apply(void 0, arguments);
            } catch (e) {
              throw _stripStack(e);
            }
          };
          var safeCheck = function() {
            try {
              return __check.apply(void 0, arguments);
            } catch (e) {
              throw _stripStack(e);
            }
          };
          var args = [scopeObj, safeAt, safeSet, safeCall, safeCallOpt, safeNew, safeCheck, thisCell, invocationGlobals, __dbg, __stripErr];
          if (debugSession) {
            debugSession._runtimeArgs = args.slice(0);
            debugSession._compileTailFn = require_compile().compileTail;
          }
          for (var i = 0; i < scopeKeys.length; i++) {
            args.push(scopeObj[scopeKeys[i]]);
          }
          var promise = fn.apply(void 0, args);
          function cleanupDOM() {
            if (domContext && domContext.cleanup) {
              domContext.cleanup();
            }
          }
          var shouldSanitizeReturn = !opts.rawReturn;
          if (timeout > 0) {
            var timer;
            return Promise.race([
              promise.then(function(v) {
                clearTimeout(timer);
                cleanupDOM();
                _allowNewCtors = null;
                return shouldSanitizeReturn ? sanitizeReturn(v) : v;
              }, function(e) {
                clearTimeout(timer);
                cleanupDOM();
                _allowNewCtors = null;
                throw _stripStack(e);
              }),
              new Promise(function(_, reject) {
                timer = setTimeout(function() {
                  cleanupDOM();
                  _allowNewCtors = null;
                  reject(new Error("SafeScript: execution timed out after " + timeout + "ms"));
                }, timeout);
              })
            ]);
          }
          return promise.then(function(v) {
            cleanupDOM();
            _allowNewCtors = null;
            return shouldSanitizeReturn ? sanitizeReturn(v) : v;
          }, function(e) {
            cleanupDOM();
            _allowNewCtors = null;
            throw _stripStack(e);
          });
        };
      }
      exports.__at = __at;
      exports.__set = __set;
      exports.__call = __call;
      exports.__call_opt = __call_opt;
      exports.__new = __new;
      exports.sanitizeReturn = sanitizeReturn;
      exports.sanitize = sanitize;
      exports.buildShadowList = buildShadowList;
      exports.buildFunction = buildFunction;
      exports.wrapScopeWithHooks = wrapScopeWithHooks;
      exports.wrapFnWithHooks = wrapFnWithHooks;
      exports.registerType = registerType;
      exports.unregisterType = unregisterType;
      exports.clearTypeRegistry = clearTypeRegistry;
      exports.getTypeConfig = function(ctor) {
        return _typeRegistry.get(ctor) || null;
      };
      exports.getRegisteredTypes = function() {
        var result = [];
        _typeRegistry.forEach(function(config, ctor) {
          result.push({ ctor, name: ctor.name || null, config });
        });
        return result;
      };
      exports.MAX_TIMEOUT = MAX_TIMEOUT;
      exports.MAX_OPS = MAX_OPS;
      exports.MAX_MEMORY = MAX_MEMORY;
      exports.debugGlobals = buildSafeGlobalsWithRandom;
      exports.debugStripError = _stripStack;
      exports.debugNew = function(ctor, args, allowed) {
        var saved = _allowNewCtors;
        try {
          _allowNewCtors = allowed || null;
          return __new(ctor, args);
        } finally {
          _allowNewCtors = saved;
        }
      };
    }
  });

  // safescript-upstream/src/journal.js
  var require_journal = __commonJS({
    "safescript-upstream/src/journal.js"(exports) {
      "use strict";
      var UNDEF_SENTINEL = Object.freeze({ __journalUndef: true });
      function Journal() {
        this._log = [];
        this._overlay = /* @__PURE__ */ new Map();
        this._externals = [];
        this._cursor = 0;
        this._stepIndex = -1;
        this._targetIndex = /* @__PURE__ */ new Map();
      }
      Journal.prototype.write = function(target, key, oldValue, newValue) {
        var logIndex = this._log.length;
        this._log.push({
          index: logIndex,
          target,
          key,
          was: oldValue,
          to: newValue,
          step: this._stepIndex
          // which debug step caused this write
        });
        if (!this._overlay.has(target)) {
          this._overlay.set(target, /* @__PURE__ */ new Map());
        }
        this._overlay.get(target).set(key, newValue === void 0 ? UNDEF_SENTINEL : newValue);
        if (!this._targetIndex.has(target)) {
          this._targetIndex.set(target, []);
        }
        this._targetIndex.get(target).push(logIndex);
        this._cursor = this._log.length;
      };
      Journal.prototype.setStepIndex = function(stepIndex) {
        this._stepIndex = stepIndex;
      };
      Journal.prototype.queryTarget = function(target, key) {
        var indices = this._targetIndex.get(target);
        if (!indices) return [];
        var results = [];
        for (var i = indices.length - 1; i >= 0; i--) {
          var idx = indices[i];
          if (idx < this._log.length) {
            var entry = this._log[idx];
            if (!key || entry.key === key) {
              results.push(entry);
            }
          }
        }
        return results;
      };
      Journal.prototype.queryTargetSteps = function(target, key) {
        var entries = this.queryTarget(target, key);
        var seen = {};
        var steps = [];
        for (var i = 0; i < entries.length; i++) {
          var s = entries[i].step;
          if (s >= 0 && !seen[s]) {
            seen[s] = true;
            steps.push(s);
          }
        }
        return steps;
      };
      Journal.prototype.read = function(target, key) {
        var targetOverlay = this._overlay.get(target);
        if (targetOverlay && targetOverlay.has(key)) {
          var val = targetOverlay.get(key);
          return val === UNDEF_SENTINEL ? void 0 : val;
        }
        return target[key];
      };
      Journal.prototype.has = function(target, key) {
        var targetOverlay = this._overlay.get(target);
        return !!(targetOverlay && targetOverlay.has(key));
      };
      Journal.prototype.writeExternal = function(entry) {
        entry.index = this._externals.length;
        this._externals.push(entry);
      };
      Journal.prototype.entries = function() {
        return this._log.slice(0);
      };
      Journal.prototype.externalEntries = function() {
        return this._externals.slice(0);
      };
      Journal.prototype.getCursor = function() {
        return this._cursor;
      };
      Journal.prototype.rewindTo = function(stepIndex) {
        if (stepIndex < 0) stepIndex = 0;
        if (stepIndex > this._log.length) stepIndex = this._log.length;
        this._overlay = /* @__PURE__ */ new Map();
        this._targetIndex = /* @__PURE__ */ new Map();
        for (var i = 0; i < stepIndex && i < this._log.length; i++) {
          var entry = this._log[i];
          if (!this._overlay.has(entry.target)) {
            this._overlay.set(entry.target, /* @__PURE__ */ new Map());
          }
          this._overlay.get(entry.target).set(
            entry.key,
            entry.to === void 0 ? UNDEF_SENTINEL : entry.to
          );
          if (!this._targetIndex.has(entry.target)) {
            this._targetIndex.set(entry.target, []);
          }
          this._targetIndex.get(entry.target).push(i);
        }
        this._log.length = stepIndex;
        this._cursor = stepIndex;
      };
      Journal.prototype.commit = function() {
        var writeCount = 0;
        for (var i = 0; i < this._log.length; i++) {
          var entry = this._log[i];
          applyEntry(entry.target, entry.key, entry.to);
          writeCount++;
        }
        var externals = this._externals.slice(0);
        this.clear();
        return { writes: writeCount, externals };
      };
      Journal.prototype.clear = function() {
        this._log = [];
        this._overlay = /* @__PURE__ */ new Map();
        this._externals = [];
        this._targetIndex = /* @__PURE__ */ new Map();
        this._cursor = 0;
        this._stepIndex = -1;
      };
      Journal.prototype.summary = function() {
        return {
          writes: this._log.length,
          externals: this._externals.length,
          cursor: this._cursor
        };
      };
      exports.Journal = Journal;
      function applyEntry(target, key, value) {
        if (key === "map:state" && target instanceof Map) {
          target.clear();
          value.forEach(function(e) {
            target.set(e[0], e[1]);
          });
        } else if (key === "set:state" && target instanceof Set) {
          target.clear();
          value.forEach(function(v) {
            target.add(v);
          });
        } else if (key === "date:value" && target instanceof Date) {
          target.setTime(value);
        } else if (key.indexOf("attr:") === 0 && target.setAttribute) {
          if (value == null) target.removeAttribute(key.slice(5));
          else target.setAttribute(key.slice(5), value);
        } else if (key.indexOf("style:") === 0 && target.style) {
          if (value == null || value === "") target.style.removeProperty(key.slice(6));
          else target.style.setProperty(key.slice(6), value);
        } else target[key] = value;
      }
      Journal.applyEntry = applyEntry;
    }
  });

  // safescript-upstream/src/debug.js
  var require_debug = __commonJS({
    "safescript-upstream/src/debug.js"(exports) {
      "use strict";
      var Journal = require_journal().Journal;
      function DebugSession(opts) {
        opts = opts || {};
        this.breakpoints = {};
        this._breakpointConditions = {};
        var bps = opts.breakpoints || [];
        for (var i = 0; i < bps.length; i++) {
          if (typeof bps[i] === "object") {
            this.breakpoints[bps[i].line] = true;
            if (bps[i].condition) this._breakpointConditions[bps[i].line] = bps[i].condition;
          } else {
            this.breakpoints[bps[i]] = true;
          }
        }
        this.stepping = true;
        this.pauseOn = opts.pauseOn || "before";
        this._stepMode = "into";
        this._stepDepth = 0;
        this._callDepth = 0;
        this.state = "running";
        this.currentLine = 0;
        this.currentLocals = null;
        this.replacement = null;
        this.resume = null;
        this.history = [];
        this.captureAllLocals = !!opts.captureAllLocals;
        this.journal = new Journal();
        this._logpoints = {};
        this.onPause = opts.onPause || function() {
        };
        this.onStep = opts.onStep || function() {
        };
        this.onFinish = opts.onFinish || function() {
        };
        this.onError = opts.onError || function() {
        };
        this.onCommit = opts.onCommit || null;
        this.onLog = opts.onLog || null;
        this._effectLog = [];
        this._domSnapshots = [];
        this._domRoot = null;
      }
      DebugSession.prototype.step = function() {
        this.stepping = true;
        if (this.resume) {
          var r = this.resume;
          this.resume = null;
          r();
        }
      };
      DebugSession.prototype.continue = function() {
        this.stepping = false;
        if (this.resume) {
          var r = this.resume;
          this.resume = null;
          r();
        }
      };
      DebugSession.prototype.runToLine = function(line) {
        this.breakpoints[line] = true;
        this._oneShotLine = line;
        this.continue();
      };
      DebugSession.prototype.toggleBreakpoint = function(line) {
        if (this.breakpoints[line]) {
          delete this.breakpoints[line];
          delete this._breakpointConditions[line];
        } else {
          this.breakpoints[line] = true;
        }
      };
      DebugSession.prototype.setBreakpoints = function(lines) {
        this.breakpoints = {};
        this._breakpointConditions = {};
        for (var i = 0; i < lines.length; i++) {
          this.breakpoints[lines[i]] = true;
        }
      };
      DebugSession.prototype.stop = function() {
        this.state = "finished";
        if (this.resume) {
          var r = this.resume;
          this.resume = null;
          r("__stop");
        }
      };
      DebugSession.prototype.setPauseOn = function(mode) {
        if (mode === "before" || mode === "after" || mode === "both") {
          this.pauseOn = mode;
        }
      };
      DebugSession.prototype.stepOver = function() {
        this._stepMode = "over";
        this._stepDepth = this._callDepth;
        this.stepping = false;
        if (this.resume) {
          var r = this.resume;
          this.resume = null;
          r();
        }
      };
      DebugSession.prototype.stepOut = function() {
        this._stepMode = "out";
        this._stepDepth = this._callDepth;
        this.stepping = false;
        if (this.resume) {
          var r = this.resume;
          this.resume = null;
          r();
        }
      };
      DebugSession.prototype.pushCall = function() {
        this._callDepth++;
      };
      DebugSession.prototype.popCall = function() {
        this._callDepth--;
        if (this._callDepth < 0) this._callDepth = 0;
      };
      DebugSession.prototype.evaluate = function(expression) {
        if (this.state !== "paused") {
          throw new Error("SafeScript: can only evaluate while paused");
        }
        if (!this.currentLocals) {
          throw new Error("SafeScript: no locals available");
        }
        var locals = this.currentLocals;
        var localNames = Object.keys(locals);
        var localValues = localNames.map(function(n) {
          return locals[n];
        });
        var runtimeArgs = this._runtimeArgs;
        var helperNames = ["__at", "__set", "__call", "__call_opt", "__new", "__check"];
        var helperValues = [];
        if (runtimeArgs) {
          helperValues = [runtimeArgs[1], runtimeArgs[2], runtimeArgs[3], runtimeArgs[4], runtimeArgs[5], runtimeArgs[6]];
        } else {
          helperValues = [
            function(o, k) {
              return o && o[k];
            },
            function(o, k, v) {
              if (o) o[k] = v;
              return v;
            },
            function(o, m) {
              return o[m].apply(o, Array.prototype.slice.call(arguments, 2));
            },
            function(o, m) {
              return o && o[m] ? o[m].apply(o, Array.prototype.slice.call(arguments, 2)) : void 0;
            },
            function() {
              throw new Error("new not available in evaluate");
            },
            function() {
            }
          ];
        }
        var allNames = localNames.concat(helperNames);
        var allValues = localValues.concat(helperValues);
        var code;
        if (this._compileFn) {
          var compiled = this._compileFn("return (" + expression + ");");
          code = compiled.code;
        } else {
          code = "return (" + expression + ");";
        }
        var fn = new Function(allNames.join(", "), '"use strict";\n' + code);
        return fn.apply(void 0, allValues);
      };
      DebugSession.prototype.setConditionalBreakpoint = function(line, condition) {
        this.breakpoints[line] = true;
        if (condition) {
          this._breakpointConditions[line] = condition;
        } else {
          delete this._breakpointConditions[line];
        }
      };
      DebugSession.prototype._checkCondition = function(line, getLocals) {
        var cond = this._breakpointConditions[line];
        if (!cond) return true;
        try {
          var savedState = this.state;
          var savedLocals = this.currentLocals;
          this.state = "paused";
          this.currentLocals = getLocals();
          var result = this.evaluate(cond);
          this.state = savedState;
          this.currentLocals = savedLocals;
          return !!result;
        } catch (e) {
          return true;
        }
      };
      DebugSession.prototype.setLogpoint = function(line, template) {
        this._logpoints[line] = template;
      };
      DebugSession.prototype.removeLogpoint = function(line) {
        delete this._logpoints[line];
      };
      DebugSession.prototype._evaluateLogpoint = function(template, getLocals) {
        var self = this;
        var savedState = this.state;
        var savedLocals = this.currentLocals;
        this.state = "paused";
        this.currentLocals = getLocals();
        var message = template.replace(/\{([^}]+)\}/g, function(match, expr) {
          try {
            var val = self.evaluate(expr.trim());
            if (val === void 0) return "undefined";
            if (val === null) return "null";
            if (typeof val === "object") {
              try {
                return JSON.stringify(val);
              } catch (e) {
                return String(val);
              }
            }
            return String(val);
          } catch (e) {
            return "[error: " + e.message + "]";
          }
        });
        this.state = savedState;
        this.currentLocals = savedLocals;
        return message;
      };
      DebugSession.prototype.fork = function() {
        var child = new DebugSession({
          captureAllLocals: this.captureAllLocals
        });
        for (var line in this.breakpoints) {
          child.breakpoints[line] = true;
        }
        for (var cl in this._breakpointConditions) {
          child._breakpointConditions[cl] = this._breakpointConditions[cl];
        }
        for (var lp in this._logpoints) {
          child._logpoints[lp] = this._logpoints[lp];
        }
        child.state = this.state;
        child.stepping = this.stepping;
        child.pauseOn = this.pauseOn;
        child.currentLine = this.currentLine;
        child._callDepth = this._callDepth;
        if (this.currentLocals) {
          child.currentLocals = JSON.parse(JSON.stringify(this.currentLocals));
        }
        for (var i = 0; i < this.history.length; i++) {
          var step = this.history[i];
          var copy = { index: step.index, line: step.line, effects: step.effects };
          if (step.locals) {
            try {
              copy.locals = JSON.parse(JSON.stringify(step.locals));
            } catch (e) {
              copy.locals = step.locals;
            }
          }
          child.history.push(copy);
        }
        var entries = this.journal.entries();
        for (var j = 0; j < entries.length; j++) {
          var ent = entries[j];
          child.journal.write(ent.target, ent.key, ent.was, ent.to);
        }
        child._compileFn = this._compileFn;
        child._compileTailFn = this._compileTailFn;
        child._runtimeArgs = this._runtimeArgs;
        child._domRoot = this._domRoot;
        for (var s = 0; s < this._domSnapshots.length; s++) {
          child._domSnapshots.push({
            stepIndex: this._domSnapshots[s].stepIndex,
            html: this._domSnapshots[s].html,
            root: this._domSnapshots[s].root
          });
        }
        return child;
      };
      DebugSession.prototype.serialize = function() {
        var objectMap = /* @__PURE__ */ new Map();
        var objectList = [];
        var entries = this.journal.entries();
        function getObjectId(obj) {
          if (objectMap.has(obj)) return objectMap.get(obj);
          var id = objectList.length;
          objectMap.set(obj, id);
          objectList.push(obj);
          return id;
        }
        var journalData = [];
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          journalData.push({
            targetId: getObjectId(e.target),
            key: e.key,
            was: e.was,
            to: e.to,
            step: e.step
          });
        }
        var historyData = [];
        for (var h = 0; h < this.history.length; h++) {
          var step = this.history[h];
          historyData.push({
            index: step.index,
            line: step.line,
            locals: step.locals || null,
            effects: step.effects || null
          });
        }
        var snapshotData = [];
        for (var s = 0; s < this._domSnapshots.length; s++) {
          snapshotData.push({
            stepIndex: this._domSnapshots[s].stepIndex,
            html: this._domSnapshots[s].html
          });
        }
        return {
          version: 1,
          state: this.state,
          stepping: this.stepping,
          pauseOn: this.pauseOn,
          currentLine: this.currentLine,
          currentLocals: this.currentLocals,
          callDepth: this._callDepth,
          breakpoints: Object.keys(this.breakpoints).map(Number),
          conditions: JSON.parse(JSON.stringify(this._breakpointConditions)),
          logpoints: JSON.parse(JSON.stringify(this._logpoints)),
          captureAllLocals: this.captureAllLocals,
          history: historyData,
          journal: journalData,
          domSnapshots: snapshotData,
          _objectCount: objectList.length
        };
      };
      DebugSession.deserialize = function(data, objectResolver) {
        var session = new DebugSession({
          captureAllLocals: data.captureAllLocals,
          breakpoints: data.breakpoints
        });
        if (data.conditions) {
          session._breakpointConditions = data.conditions;
        }
        if (data.logpoints) {
          session._logpoints = data.logpoints;
        }
        session.state = data.state;
        session.stepping = data.stepping;
        session.pauseOn = data.pauseOn || "before";
        session.currentLine = data.currentLine;
        session.currentLocals = data.currentLocals;
        session._callDepth = data.callDepth || 0;
        session.history = data.history || [];
        if (data.journal && data.journal.length > 0) {
          var objects = [];
          var count = data._objectCount || 0;
          for (var i = 0; i < count; i++) {
            objects[i] = objectResolver ? objectResolver(i) : {};
          }
          for (var j = 0; j < data.journal.length; j++) {
            var ent = data.journal[j];
            var target = objects[ent.targetId] || {};
            session.journal.setStepIndex(ent.step);
            session.journal.write(target, ent.key, ent.was, ent.to);
          }
        }
        if (data.domSnapshots) {
          for (var s = 0; s < data.domSnapshots.length; s++) {
            session._domSnapshots.push({
              stepIndex: data.domSnapshots[s].stepIndex,
              html: data.domSnapshots[s].html,
              root: null
            });
          }
        }
        return session;
      };
      DebugSession.prototype.commit = function() {
        if (this._domRoot) {
          this.snapshotDOM();
        }
        var result = this.journal.commit();
        if (this.onCommit) {
          this.onCommit(result);
        }
        return result;
      };
      DebugSession.prototype.discard = function() {
        this.journal.clear();
      };
      DebugSession.prototype.rewindTo = function(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.history.length) return;
        this.journal.rewindTo(stepIndex);
        var step = this.history[stepIndex];
        for (var i = stepIndex; i >= 0; i--) {
          if (this.history[i].locals) {
            step = this.history[i];
            break;
          }
        }
        this.currentLocals = step.locals || null;
        this.currentLine = step.line;
        this.history.length = stepIndex;
        this.onPause({
          line: step.line,
          locals: step.locals,
          effects: step.effects,
          rewound: true
        });
      };
      DebugSession.prototype.setReplacement = function(tailFn) {
        this.replacement = tailFn;
      };
      DebugSession.prototype.editAndContinue = function(newSource) {
        if (this.state !== "paused") {
          throw new Error("SafeScript: can only edit-and-continue while paused");
        }
        if (!this._compileTailFn) {
          throw new Error("SafeScript: compileTail not available \u2014 use SafeScript.debug() to create sessions");
        }
        var locals = this.currentLocals || {};
        var localNames = Object.keys(locals);
        var runtimeArgs = this._runtimeArgs;
        try {
          var tailFn = this._compileTailFn(newSource, this.currentLine, {
            debug: true,
            locals: localNames
          });
          var self = this;
          this.replacement = function(capturedLocals) {
            return tailFn.apply(void 0, [capturedLocals].concat(runtimeArgs));
          };
          return true;
        } catch (e) {
          this.onError(e);
          return false;
        }
      };
      DebugSession.prototype.getHistory = function() {
        return this.history;
      };
      DebugSession.prototype.setDOMRoot = function(root) {
        this._domRoot = root;
      };
      DebugSession.prototype.snapshotDOM = function() {
        if (!this._domRoot) return null;
        var snap = {
          stepIndex: this.history.length,
          html: this._domRoot.innerHTML,
          root: this._domRoot
        };
        this._domSnapshots.push(snap);
        return snap;
      };
      DebugSession.prototype.restoreDOM = function(snapshotIndex) {
        if (snapshotIndex < 0 || snapshotIndex >= this._domSnapshots.length) return;
        var snap = this._domSnapshots[snapshotIndex];
        if (snap.root) {
          snap.root.innerHTML = snap.html;
        }
      };
      DebugSession.prototype.findSnapshotBefore = function(stepIndex) {
        var best = -1;
        for (var i = 0; i < this._domSnapshots.length; i++) {
          if (this._domSnapshots[i].stepIndex <= stepIndex) {
            best = i;
          }
        }
        return best;
      };
      DebugSession.prototype.getDOMSnapshots = function() {
        return this._domSnapshots;
      };
      DebugSession.prototype.queryNodeHistory = function(node, prop) {
        return this.journal.queryTarget(node, prop);
      };
      DebugSession.prototype.queryNodeSteps = function(node, prop) {
        return this.journal.queryTargetSteps(node, prop);
      };
      DebugSession.prototype.getNodeTimeline = function(node) {
        var entries = this.journal.queryTarget(node);
        var timeline = [];
        for (var i = entries.length - 1; i >= 0; i--) {
          var e = entries[i];
          var stepLine = e.step >= 0 && e.step < this.history.length ? this.history[e.step].line : null;
          timeline.push({
            step: e.step,
            line: stepLine,
            prop: e.key,
            was: e.was,
            to: e.to
          });
        }
        return timeline;
      };
      DebugSession.prototype.getLocals = function() {
        return this.currentLocals;
      };
      DebugSession.prototype.createCheckpoint = function() {
        var session = this;
        return async function __dbg(line, getLocals, phase) {
          if (session.state === "finished") return null;
          var phaseActive = session.pauseOn === "both" || session.pauseOn === phase;
          if (phase === "before") {
            var effects = session._effectLog.length > 0 ? session._effectLog.splice(0) : null;
            var stepIdx = session.history.length;
            var step = {
              index: stepIdx,
              line,
              phase: "before",
              effects
            };
            session.journal.setStepIndex(stepIdx);
            if (session._logpoints[line]) {
              var logMessage = session._evaluateLogpoint(session._logpoints[line], getLocals);
              if (session.onLog) {
                session.onLog({ line, message: logMessage, step: stepIdx });
              }
            }
            var shouldPause = false;
            if (phaseActive) {
              if (session.stepping) {
                shouldPause = true;
              } else if (session._stepMode === "over" && session._callDepth <= session._stepDepth) {
                shouldPause = true;
                session._stepMode = "into";
              } else if (session._stepMode === "out" && session._callDepth < session._stepDepth) {
                shouldPause = true;
                session._stepMode = "into";
              } else if (session.breakpoints[line]) {
                shouldPause = session._checkCondition(line, getLocals);
              }
            }
            if (session.captureAllLocals || shouldPause) {
              step.locals = getLocals();
            }
            session.history.push(step);
            session.currentLine = line;
            session._lastBeforeStep = step;
            session.onStep(step);
            if (shouldPause) {
              session.state = "paused";
              var locals = step.locals || getLocals();
              session.currentLocals = locals;
              step.locals = locals;
              session.onPause({ line, locals, effects, phase: "before" });
              if (session._oneShotLine === line) {
                delete session.breakpoints[line];
                delete session._oneShotLine;
              }
              var signal = await new Promise(function(resolve) {
                session.resume = resolve;
              });
              if (signal === "__stop") {
                session.state = "finished";
                throw new Error("SafeScript: debug session stopped");
              }
              session.state = "running";
            }
            if (session.replacement) {
              var fn = session.replacement;
              session.replacement = null;
              var fnLocals = session.currentLocals || getLocals();
              var result = await fn(fnLocals);
              return { value: result };
            }
          } else {
            var afterEffects = session._effectLog.length > 0 ? session._effectLog.splice(0) : null;
            var afterLocals = getLocals();
            if (session._lastBeforeStep && session._lastBeforeStep.line === line) {
              session._lastBeforeStep.afterLocals = afterLocals;
              if (!session._lastBeforeStep.effects && afterEffects) {
                session._lastBeforeStep.effects = afterEffects;
              }
            }
            var afterStepIdx = session.history.length;
            var afterStep = {
              index: afterStepIdx,
              line,
              phase: "after",
              effects: afterEffects,
              locals: session.captureAllLocals || phaseActive ? afterLocals : null
            };
            session.history.push(afterStep);
            session.onStep(afterStep);
            if (phaseActive) {
              var shouldPauseAfter = false;
              if (session.stepping) {
                shouldPauseAfter = true;
              } else if (session._stepMode === "over" && session._callDepth <= session._stepDepth) {
                shouldPauseAfter = true;
                session._stepMode = "into";
              } else if (session._stepMode === "out" && session._callDepth < session._stepDepth) {
                shouldPauseAfter = true;
                session._stepMode = "into";
              } else if (session.breakpoints[line]) {
                shouldPauseAfter = session._checkCondition(line, getLocals);
              }
              if (shouldPauseAfter) {
                session.state = "paused";
                session.currentLocals = afterLocals;
                session.currentLine = line;
                session.onPause({ line, locals: afterLocals, phase: "after" });
                var afterSignal = await new Promise(function(resolve) {
                  session.resume = resolve;
                });
                if (afterSignal === "__stop") {
                  session.state = "finished";
                  throw new Error("SafeScript: debug session stopped");
                }
                session.state = "running";
              }
            }
          }
          return null;
        };
      };
      exports.DebugSession = DebugSession;
    }
  });

  // safescript-upstream/src/debug-protocol.js
  var require_debug_protocol = __commonJS({
    "safescript-upstream/src/debug-protocol.js"(exports) {
      "use strict";
      var COMMANDS = {
        seek: "seek",
        setLocal: "setLocal",
        getTimeline: "getTimeline",
        step: "step",
        continue: "continue",
        stop: "stop",
        setBreakpoints: "setBreakpoints",
        toggleBreakpoint: "toggleBreakpoint",
        runToLine: "runToLine",
        editAndContinue: "editAndContinue",
        rewindTo: "rewindTo",
        commit: "commit",
        discard: "discard",
        getLocals: "getLocals",
        getHistory: "getHistory",
        getJournal: "getJournal",
        getNodeTimeline: "getNodeTimeline",
        getDOMSnapshots: "getDOMSnapshots",
        snapshotDOM: "snapshotDOM",
        restoreDOM: "restoreDOM",
        stepOver: "stepOver",
        stepOut: "stepOut",
        evaluate: "evaluate",
        setConditionalBreakpoint: "setConditionalBreakpoint",
        fork: "fork",
        serialize: "serialize",
        setLogpoint: "setLogpoint",
        removeLogpoint: "removeLogpoint",
        setPauseOn: "setPauseOn"
      };
      var EVENTS = {
        paused: "paused",
        stepped: "stepped",
        finished: "finished",
        error: "error",
        committed: "committed",
        discarded: "discarded",
        rewound: "rewound",
        locals: "locals",
        history: "history",
        journal: "journal",
        nodeTimeline: "nodeTimeline",
        domSnapshots: "domSnapshots",
        domSnapshot: "domSnapshot",
        domRestored: "domRestored",
        evaluated: "evaluated",
        forked: "forked",
        serialized: "serialized",
        logpoint: "logpoint"
      };
      function DebugProtocol(session, driver) {
        this.session = session;
        this.driver = driver;
        this._compileTailFn = null;
        var self = this;
        var origOnPause = session.onPause || function() {
        };
        session.onPause = function(info) {
          if (typeof origOnPause === "function") origOnPause(info);
          self._emit(EVENTS.paused, {
            line: info.line,
            locals: info.locals,
            effects: info.effects,
            phase: info.phase || null,
            checkpointId: info.checkpointId || null,
            depth: info.depth || 0,
            rewound: info.rewound || false,
            state: session.state
          });
        };
        var origOnStep = session.onStep;
        session.onStep = function(step) {
          origOnStep(step);
          self._emit(EVENTS.stepped, {
            index: step.index,
            line: step.line,
            phase: step.phase || null,
            effects: step.effects || null
          });
        };
        var origOnFinish = session.onFinish;
        session.onFinish = function(value) {
          origOnFinish(value);
          self._emit(EVENTS.finished, {
            value,
            journalSummary: session.journal.summary(),
            historyLength: session.history.length
          });
        };
        var origOnError = session.onError;
        session.onError = function(err) {
          origOnError(err);
          self._emit(EVENTS.error, {
            message: err.message,
            line: session.currentLine
          });
        };
        session.onLog = function(info) {
          self._emit(EVENTS.logpoint, {
            line: info.line,
            message: info.message,
            step: info.step
          });
        };
        if (driver.onMessage) {
          driver.onMessage(function(msg) {
            self.handleCommand(msg);
          });
        }
      }
      DebugProtocol.prototype._emit = function(type, data) {
        this.driver.send({ type, data });
      };
      DebugProtocol.prototype.handleCommand = function(msg) {
        var session = this.session;
        var type = msg.type;
        var data = msg.data || {};
        switch (type) {
          case COMMANDS.seek:
            session.seek(data.checkpointId);
            this._emit(EVENTS.rewound, { checkpointId: session.currentNodeId, line: session.currentLine, locals: session.currentLocals });
            break;
          case COMMANDS.setLocal:
            session.setLocal(data.name, data.value);
            break;
          case COMMANDS.getTimeline:
            this._emit("timeline", session.getTimeline());
            break;
          case COMMANDS.step:
            session.step();
            break;
          case COMMANDS.continue:
            session.continue();
            break;
          case COMMANDS.stop:
            session.stop();
            break;
          case COMMANDS.setBreakpoints:
            session.setBreakpoints(data.lines || []);
            break;
          case COMMANDS.toggleBreakpoint:
            session.toggleBreakpoint(data.line);
            break;
          case COMMANDS.runToLine:
            session.runToLine(data.line);
            break;
          case COMMANDS.editAndContinue:
            if (data.source && session.editAndContinue) {
              try {
                var ok = session.editAndContinue(data.source);
                if (ok) {
                  this._emit("editAccepted", { line: session.currentLine });
                }
              } catch (e) {
                this._emit(EVENTS.error, { message: "Edit rejected: " + e.message });
              }
            } else if (data.replacementFn) {
              session.setReplacement(data.replacementFn);
            }
            break;
          case COMMANDS.rewindTo:
            session.rewindTo(data.stepIndex);
            this._emit(EVENTS.rewound, {
              stepIndex: data.stepIndex,
              line: session.currentLine,
              locals: session.currentLocals
            });
            break;
          case COMMANDS.commit:
            var result = session.commit();
            this._emit(EVENTS.committed, result);
            break;
          case COMMANDS.discard:
            session.discard();
            this._emit(EVENTS.discarded, {});
            break;
          case COMMANDS.getLocals:
            this._emit(EVENTS.locals, {
              line: session.currentLine,
              locals: session.currentLocals,
              state: session.state
            });
            break;
          case COMMANDS.getHistory:
            this._emit(EVENTS.history, {
              history: session.getHistory(),
              length: session.history.length
            });
            break;
          case COMMANDS.getJournal:
            this._emit(EVENTS.journal, {
              entries: session.journal.entries(),
              externals: session.journal.externalEntries(),
              summary: session.journal.summary()
            });
            break;
          case COMMANDS.getNodeTimeline:
            if (data.node) {
              this._emit(EVENTS.nodeTimeline, {
                timeline: session.getNodeTimeline(data.node),
                steps: session.queryNodeSteps(data.node, data.prop)
              });
            }
            break;
          case COMMANDS.getDOMSnapshots:
            this._emit(EVENTS.domSnapshots, {
              snapshots: session.getDOMSnapshots().map(function(s) {
                return { stepIndex: s.stepIndex, htmlLength: s.html.length };
              }),
              count: session._domSnapshots.length
            });
            break;
          case COMMANDS.snapshotDOM:
            var snap = session.snapshotDOM();
            this._emit(EVENTS.domSnapshot, {
              stepIndex: snap ? snap.stepIndex : null,
              index: session._domSnapshots.length - 1
            });
            break;
          case COMMANDS.restoreDOM:
            session.restoreDOM(data.snapshotIndex);
            this._emit(EVENTS.domRestored, {
              snapshotIndex: data.snapshotIndex
            });
            break;
          case COMMANDS.stepOver:
            session.stepOver();
            break;
          case COMMANDS.stepOut:
            session.stepOut();
            break;
          case COMMANDS.evaluate:
            try {
              var evalResult = session.evaluate(data.expression);
              this._emit(EVENTS.evaluated, { expression: data.expression, result: evalResult });
            } catch (evalErr) {
              this._emit(EVENTS.evaluated, { expression: data.expression, error: evalErr.message });
            }
            break;
          case COMMANDS.setConditionalBreakpoint:
            session.setConditionalBreakpoint(data.line, data.condition);
            break;
          case COMMANDS.fork:
            var forkedSession = session.fork();
            this._emit(EVENTS.forked, { state: forkedSession.state, line: forkedSession.currentLine });
            break;
          case COMMANDS.serialize:
            this._emit(EVENTS.serialized, { data: session.serialize() });
            break;
          case COMMANDS.setLogpoint:
            session.setLogpoint(data.line, data.template);
            break;
          case COMMANDS.removeLogpoint:
            session.removeLogpoint(data.line);
            break;
          case COMMANDS.setPauseOn:
            session.setPauseOn(data.mode);
            break;
          default:
            break;
        }
      };
      DebugProtocol.prototype.setCompileTail = function(fn) {
        this._compileTailFn = fn;
      };
      DebugProtocol.prototype.disconnect = function() {
        this.session.onPause = function() {
        };
        this.session.onStep = function() {
        };
        this.session.onFinish = function() {
        };
        this.session.onError = function() {
        };
      };
      function InProcessDriver(onEvent) {
        this._onEvent = onEvent || function() {
        };
        this._onMessageFn = null;
      }
      InProcessDriver.prototype.send = function(event) {
        this._onEvent(event);
      };
      InProcessDriver.prototype.onMessage = function(fn) {
        this._onMessageFn = fn;
      };
      InProcessDriver.prototype.command = function(type, data) {
        if (this._onMessageFn) {
          this._onMessageFn({ type, data: data || {} });
        }
      };
      function PostMessageDriver(target, channel) {
        this._target = target;
        this._channel = channel || "safescript-debug";
        this._onMessageFn = null;
        var self = this;
        var listener = function(event) {
          var msg = event.data;
          if (!msg || msg.channel !== self._channel) return;
          if (msg.direction === "command" && self._onMessageFn) {
            self._onMessageFn(msg.payload);
          }
        };
        if (typeof target.addEventListener === "function") {
          target.addEventListener("message", listener);
        } else if (typeof target.on === "function") {
          target.on("message", function(data) {
            listener({ data });
          });
        }
        this._listener = listener;
      }
      PostMessageDriver.prototype.send = function(event) {
        var msg = {
          channel: this._channel,
          direction: "event",
          payload: event
        };
        if (typeof this._target.postMessage === "function") {
          this._target.postMessage(msg);
        }
      };
      PostMessageDriver.prototype.onMessage = function(fn) {
        this._onMessageFn = fn;
      };
      PostMessageDriver.sendCommand = function(target, type, data, channel) {
        target.postMessage({
          channel: channel || "safescript-debug",
          direction: "command",
          payload: { type, data: data || {} }
        });
      };
      function PortDriver(port, channel) {
        this._port = port;
        this._channel = channel || "safescript-debug";
        this._onMessageFn = null;
        var self = this;
        port.onmessage = function(event) {
          var msg = event.data;
          if (!msg || msg.channel !== self._channel) return;
          if (msg.direction === "command" && self._onMessageFn) {
            self._onMessageFn(msg.payload);
          }
        };
      }
      PortDriver.prototype.send = function(event) {
        this._port.postMessage({
          channel: this._channel,
          direction: "event",
          payload: event
        });
      };
      PortDriver.prototype.onMessage = function(fn) {
        this._onMessageFn = fn;
      };
      exports.DebugProtocol = DebugProtocol;
      exports.InProcessDriver = InProcessDriver;
      exports.PostMessageDriver = PostMessageDriver;
      exports.PortDriver = PortDriver;
      exports.COMMANDS = COMMANDS;
      exports.EVENTS = EVENTS;
    }
  });

  // safescript-upstream/src/continuation-compiler.js
  var require_continuation_compiler = __commonJS({
    "safescript-upstream/src/continuation-compiler.js"(exports) {
      "use strict";
      var parser = require_parse();
      var validator = require_validate();
      var defs = require_defs();
      var nextNode = 1;
      function canonical(n) {
        return JSON.stringify(n, function(k, v) {
          return /^(loc|_cid)$/.test(k) ? void 0 : v;
        });
      }
      function shape(n) {
        if (!n) return "";
        if (n.type === "FunctionDeclaration")
          return n.type + ":" + (n.id && n.id.name);
        if (n.type === "VariableDeclaration")
          return n.type + ":" + canonical(
            n.declarations.map(function(d) {
              return d.id;
            })
          );
        return n.type;
      }
      function align(old, fresh) {
        if (!fresh || typeof fresh !== "object") return;
        if (Array.isArray(fresh)) {
          old = Array.isArray(old) ? old : [];
          var used = /* @__PURE__ */ new Set(), matches = /* @__PURE__ */ new Map();
          fresh.forEach(function(n, i) {
            var k = canonical(n);
            for (var j = 0; j < old.length; j++)
              if (!used.has(j) && canonical(old[j]) === k) {
                used.add(j);
                matches.set(i, j);
                break;
              }
          });
          fresh.forEach(function(n, i) {
            if (matches.has(i)) return;
            var candidates = [];
            for (var j = 0; j < old.length; j++)
              if (!used.has(j) && shape(old[j]) === shape(n)) candidates.push(j);
            if (candidates.length === 1) {
              used.add(candidates[0]);
              matches.set(i, candidates[0]);
            }
          });
          fresh.forEach(function(n, i) {
            align(matches.has(i) ? old[matches.get(i)] : null, n);
          });
          return;
        }
        if (fresh.type)
          fresh._cid = old && old.type === fresh.type && old._cid || "n" + nextNode++;
        Object.keys(fresh).forEach(function(k) {
          if (k !== "_cid" && k !== "loc") align(old && old[k], fresh[k]);
        });
      }
      function compile(source, previous) {
        var ast = parser.parse(source), valid = validator.validate(ast);
        var checked = require_compile().compile(source);
        var AsyncFunction = Object.getPrototypeOf(async function() {
        }).constructor;
        new AsyncFunction(checked.code);
        if (!valid.ok)
          throw new SyntaxError(
            valid.errors.map(function(e) {
              return e.message;
            }).join("; ")
          );
        align(previous && previous.ast, ast);
        var functions = {}, nodes = {};
        (function walk(n) {
          if (!n || typeof n !== "object") return;
          if (n._cid) nodes[n._cid] = n;
          Object.keys(n).forEach(function(k) {
            if (k !== "loc") walk(n[k]);
          });
        })(ast);
        function makeFunction(node) {
          var id = node._cid;
          if (functions[id]) return id;
          var code = [], labels = {}, ids = {}, counters = {}, temp = 0;
          var info = {
            id,
            node,
            params: node.params || [],
            code,
            ids,
            labels,
            name: node.id && node.id.name || (node.type === "Program" ? "event" : "anonymous"),
            vars: /* @__PURE__ */ new Set()
          };
          functions[id] = info;
          function emit(n, tag, body2, meta) {
            var base = (n && n._cid || id) + ":" + tag, count = counters[base] || 0;
            counters[base] = count + 1;
            var key = base + ":" + count, instruction = {
              id: key,
              run: new Function("m", "f", body2),
              meta: meta || null
            };
            ids[key] = code.length;
            code.push(instruction);
            return code.length - 1;
          }
          function label(name) {
            labels[name] = code.length;
          }
          function unique(n) {
            var k = (n && n._cid || id) + ":temp", i = counters[k] || 0;
            counters[k] = i + 1;
            return k + ":" + i;
          }
          function jump(n, dest) {
            emit(n, "jump", "f.pc=f.fn.labels[" + JSON.stringify(dest) + "];");
          }
          function branch(n, expr2, dest) {
            emit(
              n,
              "branch",
              "if(" + expr2 + ")f.pc=f.fn.labels[" + JSON.stringify(dest) + "];"
            );
          }
          function line(n) {
            if (!n) return 0;
            if (n.loc) return n.loc.line;
            for (var k of [
              "expression",
              "argument",
              "test",
              "id",
              "object",
              "left",
              "callee"
            ]) {
              var l = line(n[k]);
              if (l) return l;
            }
            if (n.declarations) return line(n.declarations[0]);
            return 0;
          }
          function check(n, phase) {
            emit(
              n,
              phase,
              "m.checkpoint(f," + JSON.stringify(n._cid) + "," + line(n) + "," + JSON.stringify(phase) + ");",
              { nodeId: n._cid, line: line(n), phase }
            );
          }
          function names(p, out) {
            if (!p) return;
            if (p.type === "Identifier") {
              out.add(p.name);
              return;
            }
            if (p.type === "AssignmentPattern") return names(p.left, out);
            if (p.type === "RestElement") return names(p.argument, out);
            if (p.elements)
              p.elements.forEach(function(x) {
                names(x, out);
              });
            if (p.properties)
              p.properties.forEach(function(x) {
                names(x.type === "RestElement" ? x.argument : x.value, out);
              });
          }
          function hoist(n) {
            if (!n) return;
            if (n.type === "FunctionDeclaration") {
              info.vars.add(n.id.name);
              makeFunction(n);
              return;
            }
            if (n.type === "VariableDeclaration" && n.kind === "var")
              n.declarations.forEach(function(d) {
                names(d.id, info.vars);
              });
            Object.keys(n).forEach(function(k) {
              var v = n[k];
              if (k === "loc" || k === "_cid") return;
              if (Array.isArray(v))
                v.forEach(function(x) {
                  if (x && x.type) hoist(x);
                });
              else if (v && v.type && !/FunctionExpression/.test(v.type)) hoist(v);
            });
          }
          var body = node.type === "Program" ? node : node.body;
          hoist(body);
          function val(v) {
            return JSON.stringify(v);
          }
          function ref(n) {
            if (n.type === "Identifier") {
              emit(n, "ref", "f.s.push(m.reference(f," + val(n.name) + "));");
              return;
            }
            if (n.type !== "MemberExpression")
              throw new SyntaxError("Invalid assignment target");
            expr(n.object);
            if (n.computed) expr(n.property);
            else
              emit(
                n,
                "key",
                "f.s.push(" + val(n.property.name || n.property.value) + ");"
              );
            emit(
              n,
              "ref",
              "var k=f.s.pop(),o=f.s.pop();f.s.push(m.property(o,k," + !!n.optional + "));"
            );
          }
          function bind(p, kind, declare) {
            if (p.type === "AssignmentPattern") {
              var end = unique(p);
              emit(p, "default", "f.s.push(f.s[f.s.length-1]);");
              branch(p, "f.s.pop()!==undefined", end);
              emit(p, "drop", "f.s.pop();");
              expr(p.right);
              label(end);
              return bind(p.left, kind, declare);
            }
            if (p.type === "Identifier") {
              emit(
                p,
                "bind",
                "m.bind(f," + val(p.name) + ",f.s.pop()," + val(kind) + "," + !!declare + ");"
              );
              return;
            }
            if (p.type === "RestElement") return bind(p.argument, kind, declare);
            var tmp = unique(p);
            emit(p, "destructure", "f.t[" + val(tmp) + "]=f.s.pop();");
            if (p.type === "ArrayPattern")
              p.elements.forEach(function(el, i) {
                if (!el) return;
                emit(
                  el,
                  "item",
                  "f.s.push(" + (el.type === "RestElement" ? "Array.from(f.t[" + val(tmp) + "]).slice(" + i + ")" : "m.at(f.t[" + val(tmp) + "]," + i + ")") + ");"
                );
                bind(el.type === "RestElement" ? el.argument : el, kind, declare);
              });
            else if (p.type === "ObjectPattern") {
              var keys = [];
              p.properties.forEach(function(prop) {
                if (prop.type === "RestElement") {
                  emit(
                    prop,
                    "rest",
                    "f.s.push(m.rest(f.t[" + val(tmp) + "]," + JSON.stringify(keys) + "));"
                  );
                  bind(prop.argument, kind, declare);
                  return;
                }
                if (prop.computed)
                  throw new SyntaxError(
                    "Computed binding keys are not in the SafeScript parser grammar"
                  );
                var key = prop.key.name || prop.key.value;
                keys.push(key);
                emit(
                  prop,
                  "item",
                  "f.s.push(m.at(f.t[" + val(tmp) + "]," + val(key) + "));"
                );
                bind(prop.value, kind, declare);
              });
            } else throw new SyntaxError("Unsupported binding " + p.type);
          }
          function expr(n) {
            if (!n) {
              emit(node, "undefined", "f.s.push(undefined);");
              return;
            }
            var end, other, tmp;
            switch (n.type) {
              case "Literal":
                emit(
                  n,
                  "literal",
                  "f.s.push(" + (n.regex ? n.raw : n.raw && /^\//.test(n.raw) ? n.raw : val(n.value) === void 0 ? "undefined" : val(n.value)) + ");"
                );
                break;
              case "Identifier":
                emit(n, "get", "f.s.push(m.get(f," + val(n.name) + "));");
                break;
              case "ThisExpression":
                emit(n, "this", "f.s.push(f.thisValue);");
                break;
              case "FunctionExpression":
              case "ArrowFunctionExpression":
                emit(
                  n,
                  "closure",
                  "f.s.push(m.closure(f," + val(makeFunction(n)) + "," + (n.type === "ArrowFunctionExpression") + "));"
                );
                break;
              case "MemberExpression":
                ref(n);
                emit(n, "read", "f.s.push(m.read(f.s.pop()));");
                break;
              case "CallExpression":
              case "NewExpression":
                if (n.callee.type === "MemberExpression") ref(n.callee);
                else expr(n.callee);
                emit(n, "args", "f.s.push([]);");
                n.arguments.forEach(function(a) {
                  expr(a.type === "SpreadElement" ? a.argument : a);
                  emit(
                    a,
                    "arg",
                    a.type === "SpreadElement" ? "var v=f.s.pop();f.s[f.s.length-1].push(...v);" : "var v=f.s.pop();f.s[f.s.length-1].push(v);"
                  );
                });
                emit(
                  n,
                  "call",
                  "var a=f.s.pop(),c=f.s.pop();return m.invoke(f,c,a," + (n.type === "NewExpression") + ");"
                );
                break;
              case "AssignmentExpression":
                if (/Pattern$/.test(n.left.type)) {
                  expr(n.right);
                  emit(n, "dup", "f.s.push(f.s[f.s.length-1]);");
                  bind(n.left, "var", false);
                  break;
                }
                ref(n.left);
                if (n.operator === "=") {
                  expr(n.right);
                  emit(
                    n,
                    "assign",
                    "var v=f.s.pop(),r=f.s.pop();m.write(r,v);f.s.push(v);"
                  );
                } else {
                  emit(n, "readref", "f.s.push(m.read(f.s[f.s.length-1]));");
                  if (["&&=", "||=", "??="].indexOf(n.operator) >= 0) {
                    end = unique(n);
                    other = unique(n);
                    var cond = n.operator === "&&=" ? "!v" : n.operator === "||=" ? "!!v" : "v!=null";
                    emit(
                      n,
                      "logicalassign",
                      "var v=f.s[f.s.length-1];if(" + cond + "){var r=f.s.pop();f.s.pop();f.s.push(r);f.pc=f.fn.labels[" + val(end) + "];}else f.s.pop();"
                    );
                    expr(n.right);
                    emit(
                      n,
                      "assign",
                      "var v=f.s.pop(),r=f.s.pop();m.write(r,v);f.s.push(v);"
                    );
                    label(end);
                  } else {
                    expr(n.right);
                    emit(
                      n,
                      "compound",
                      "var b=f.s.pop(),a=f.s.pop(),r=f.s.pop(),v=a " + n.operator.slice(0, -1) + " b;m.write(r,v);f.s.push(v);"
                    );
                  }
                }
                break;
              case "UpdateExpression":
                ref(n.argument);
                emit(
                  n,
                  "update",
                  "var r=f.s.pop(),v=Number(m.read(r)),w=v" + (n.operator === "++" ? "+1" : "-1") + ";m.write(r,w);f.s.push(" + (n.prefix ? "w" : "v") + ");"
                );
                break;
              case "BinaryExpression":
                expr(n.left);
                expr(n.right);
                emit(
                  n,
                  "binary",
                  "var b=f.s.pop(),a=f.s.pop();f.s.push(a " + n.operator + " b);"
                );
                break;
              case "LogicalExpression":
                end = unique(n);
                expr(n.left);
                emit(
                  n,
                  "logical",
                  "var v=f.s[f.s.length-1];if(" + (n.operator === "&&" ? "!v" : n.operator === "||" ? "!!v" : "v!=null") + ")f.pc=f.fn.labels[" + val(end) + "];else f.s.pop();"
                );
                expr(n.right);
                label(end);
                break;
              case "UnaryExpression":
                if (n.operator === "typeof" && n.argument.type === "Identifier")
                  emit(
                    n,
                    "typeof",
                    "f.s.push(m.typeofName(f," + val(n.argument.name) + "));"
                  );
                else {
                  expr(n.argument);
                  emit(n, "unary", "var v=f.s.pop();f.s.push(" + n.operator + " v);");
                }
                break;
              case "ConditionalExpression":
                other = unique(n);
                end = unique(n);
                expr(n.test);
                branch(n, "!f.s.pop()", other);
                expr(n.consequent);
                jump(n, end);
                label(other);
                expr(n.alternate);
                label(end);
                break;
              case "SequenceExpression":
                n.expressions.forEach(function(x, i) {
                  expr(x);
                  if (i < n.expressions.length - 1) emit(x, "drop", "f.s.pop();");
                });
                break;
              case "ArrayExpression":
                emit(n, "array", "f.s.push([]);");
                n.elements.forEach(function(x) {
                  if (!x) {
                    emit(n, "hole", "f.s[f.s.length-1].length++;");
                    return;
                  }
                  expr(x.type === "SpreadElement" ? x.argument : x);
                  emit(
                    x,
                    "arrayitem",
                    x.type === "SpreadElement" ? "var v=f.s.pop();f.s[f.s.length-1].push(...v);" : "var v=f.s.pop();f.s[f.s.length-1].push(v);"
                  );
                });
                break;
              case "ObjectExpression":
                emit(n, "object", "f.s.push(Object.create(null));");
                n.properties.forEach(function(p) {
                  if (p.type === "SpreadElement") {
                    expr(p.argument);
                    emit(
                      p,
                      "spread",
                      "var v=f.s.pop();m.assign(f.s[f.s.length-1],v);"
                    );
                    return;
                  }
                  if (p.computed) expr(p.key);
                  else
                    emit(
                      p,
                      "key",
                      "f.s.push(" + val(p.key.name || p.key.value) + ");"
                    );
                  expr(p.value);
                  emit(
                    p,
                    "prop",
                    "var v=f.s.pop(),k=f.s.pop();m.set(f.s[f.s.length-1],k,v);"
                  );
                });
                break;
              default:
                throw new SyntaxError("Debug compiler does not support " + n.type);
            }
          }
          function sequence(block, ctx, scope) {
            if (scope) emit(block, "scope", "m.enter(f);");
            (block.body || []).forEach(function(n) {
              if (n.type === "VariableDeclaration" && n.kind !== "var")
                n.declarations.forEach(function(d) {
                  var ns = /* @__PURE__ */ new Set();
                  names(d.id, ns);
                  ns.forEach(function(name) {
                    emit(
                      d,
                      "declare",
                      "m.declare(f," + val(name) + "," + val(n.kind) + ");"
                    );
                  });
                });
            });
            (block.body || []).forEach(function(n) {
              if (n.type === "FunctionDeclaration")
                emit(
                  n,
                  "hoist",
                  "m.bind(f," + val(n.id.name) + ",m.closure(f," + val(makeFunction(n)) + ',false),"function",true);'
                );
            });
            (block.body || []).forEach(function(n) {
              stmt(n, ctx);
            });
            if (scope) emit(block, "leave", "m.leave(f);");
          }
          function stmt(n, ctx) {
            if (!n) return;
            ctx = ctx || {};
            var top, end, cont, alt, slot, iter, finallyLabel, after;
            switch (n.type) {
              case "Program":
                sequence(n, ctx, false);
                break;
              case "BlockStatement":
                sequence(n, ctx, true);
                break;
              case "FunctionDeclaration":
              case "EmptyStatement":
                break;
              case "VariableDeclaration":
                check(n, "before");
                n.declarations.forEach(function(d) {
                  if (d.init) {
                    expr(d.init);
                    bind(d.id, n.kind, true);
                  } else if (n.kind !== "var") {
                    expr(null);
                    bind(d.id, n.kind, true);
                  }
                });
                check(n, "after");
                break;
              case "ExpressionStatement":
                check(n, "before");
                expr(n.expression);
                emit(n, "drop", "f.s.pop();");
                check(n, "after");
                break;
              case "ReturnStatement":
                check(n, "before");
                expr(n.argument);
                slot = unique(n);
                emit(n, "retvalue", "f.t[" + val(slot) + "]=f.s.pop();");
                check(n, "after");
                emit(
                  n,
                  "return",
                  'm.abrupt(f,{kind:"return",value:f.t[' + val(slot) + "]});"
                );
                break;
              case "ThrowStatement":
                check(n, "before");
                expr(n.argument);
                emit(n, "throw", 'm.abrupt(f,{kind:"throw",value:f.s.pop()});');
                break;
              case "IfStatement":
                check(n, "before");
                alt = unique(n);
                end = unique(n);
                expr(n.test);
                branch(n, "!f.s.pop()", alt);
                stmt(n.consequent, ctx);
                jump(n, end);
                label(alt);
                stmt(n.alternate, ctx);
                label(end);
                check(n, "after");
                break;
              case "ForStatement":
              case "WhileStatement":
              case "DoWhileStatement":
                emit(n, "loopscope", "m.enter(f);");
                if (n.init) {
                  if (n.init.type === "VariableDeclaration") {
                    n.init.declarations.forEach(function(d) {
                      if (n.init.kind !== "var") {
                        var ns = /* @__PURE__ */ new Set();
                        names(d.id, ns);
                        ns.forEach(function(name) {
                          emit(
                            d,
                            "declare",
                            "m.declare(f," + val(name) + "," + val(n.init.kind) + ");"
                          );
                        });
                      }
                      expr(d.init);
                      bind(d.id, n.init.kind, true);
                    });
                  } else {
                    expr(n.init);
                    emit(n, "drop", "f.s.pop();");
                  }
                }
                top = unique(n);
                end = unique(n);
                cont = unique(n);
                var bodyStart = unique(n);
                var loop = {
                  break: end,
                  continue: cont,
                  parent: ctx,
                  label: ctx.nextLabel
                };
                label(top);
                if (n.type !== "DoWhileStatement") {
                  check(n, "before");
                  if (n.test) {
                    expr(n.test);
                    branch(n, "!f.s.pop()", end);
                  }
                }
                label(bodyStart);
                stmt(n.body, loop);
                label(cont);
                if (n.type === "ForStatement" && n.init && n.init.kind === "let")
                  emit(n, "iteration", "m.iteration(f);");
                if (n.update) {
                  expr(n.update);
                  emit(n, "drop", "f.s.pop();");
                }
                if (n.type === "DoWhileStatement") {
                  check(n, "before");
                  expr(n.test);
                  branch(n, "f.s.pop()", top);
                } else jump(n, top);
                label(end);
                emit(n, "endloop", "m.leave(f);");
                check(n, "after");
                break;
              case "ForInStatement":
              case "ForOfStatement":
                emit(n, "loopscope", "m.enter(f);");
                slot = unique(n);
                iter = unique(n);
                top = unique(n);
                end = unique(n);
                cont = unique(n);
                expr(n.right);
                emit(
                  n,
                  "iterator",
                  "f.t[" + val(slot) + "]=" + (n.type === "ForOfStatement" ? "Array.from(f.s.pop())" : "m.keys(f.s.pop())") + ";f.t[" + val(iter) + "]=0;"
                );
                label(top);
                check(n, "before");
                branch(
                  n,
                  "f.t[" + val(iter) + "]>=f.t[" + val(slot) + "].length",
                  end
                );
                emit(
                  n,
                  "iteration",
                  "m.enter(f);f.s.push(f.t[" + val(slot) + "][f.t[" + val(iter) + "]++]);"
                );
                if (n.left.type === "VariableDeclaration")
                  bind(n.left.declarations[0].id, n.left.kind, true);
                else {
                  var itmp = unique(n);
                  emit(n, "item", "f.t[" + val(itmp) + "]=f.s.pop();");
                  ref(n.left);
                  emit(n, "itemassign", "m.write(f.s.pop(),f.t[" + val(itmp) + "]);");
                }
                stmt(n.body, {
                  break: end,
                  continue: cont,
                  parent: ctx,
                  label: ctx.nextLabel
                });
                label(cont);
                emit(n, "leaveiteration", "m.leave(f);");
                jump(n, top);
                label(end);
                emit(n, "endloop", "m.leave(f);");
                check(n, "after");
                break;
              case "BreakStatement":
              case "ContinueStatement":
                var target = ctx, want = n.type === "BreakStatement" ? "break" : "continue";
                while (target && (!target[want] || n.label && target.label !== n.label.name))
                  target = target.parent;
                if (!target) throw new SyntaxError("Invalid " + want);
                emit(
                  n,
                  "abrupt",
                  'm.abrupt(f,{kind:"jump",target:' + val(target[want]) + ",scope:m.labelScope(f," + val(target[want]) + ")});"
                );
                break;
              case "LabeledStatement":
                var targetEnd = unique(n);
                stmt(n.body, {
                  break: targetEnd,
                  parent: ctx,
                  label: n.label.name,
                  nextLabel: n.label.name
                });
                label(targetEnd);
                break;
              case "TryStatement":
                alt = n.handler ? unique(n) : null;
                finallyLabel = n.finalizer ? unique(n) : null;
                end = unique(n);
                emit(
                  n,
                  "try",
                  "f.handlers.push({catchLabel:" + val(alt) + ",finallyLabel:" + val(finallyLabel) + ",end:" + val(end) + ',env:f.env,depth:f.s.length,status:"try"});'
                );
                stmt(n.block, ctx);
                emit(n, "trydone", "m.completeTry(f);");
                if (n.handler) {
                  label(alt);
                  emit(n.handler, "catchscope", "m.enter(f);f.s.push(f.exception);");
                  if (n.handler.param) bind(n.handler.param, "let", true);
                  else emit(n, "drop", "f.s.pop();");
                  stmt(n.handler.body, ctx);
                  emit(n, "catchdone", "m.completeTry(f);");
                }
                if (n.finalizer) {
                  label(finallyLabel);
                  stmt(n.finalizer, ctx);
                  emit(n, "finallydone", "m.endFinally(f);");
                }
                label(end);
                break;
              case "SwitchStatement":
                check(n, "before");
                slot = unique(n);
                end = unique(n);
                expr(n.discriminant);
                emit(n, "switchvalue", "f.t[" + val(slot) + "]=f.s.pop();");
                var cases = n.cases.map(function() {
                  return unique(n);
                }), fallback = end;
                n.cases.forEach(function(c, i) {
                  if (!c.test) {
                    fallback = cases[i];
                    return;
                  }
                  expr(c.test);
                  branch(c, "f.s.pop()===f.t[" + val(slot) + "]", cases[i]);
                });
                jump(n, fallback);
                n.cases.forEach(function(c, i) {
                  label(cases[i]);
                  c.consequent.forEach(function(x) {
                    stmt(x, { break: end, parent: ctx });
                  });
                });
                label(end);
                check(n, "after");
                break;
              default:
                throw new SyntaxError("Unsupported debug statement " + n.type);
            }
          }
          if (node.type !== "Program")
            node.params.forEach(function(p, i) {
              emit(
                p,
                "parameter",
                "f.s.push(" + (p.type === "RestElement" ? "f.args.slice(" + i + ")" : "f.args[" + i + "]") + ");"
              );
              bind(p.type === "RestElement" ? p.argument : p, "param", true);
            });
          if (body.type === "BlockStatement" || body.type === "Program")
            sequence(body, {}, false);
          else {
            expr(body);
            emit(node, "return", 'm.abrupt(f,{kind:"return",value:f.s.pop()});');
          }
          emit(node, "end", 'm.abrupt(f,{kind:"return",value:undefined});');
          info.vars = Array.from(info.vars);
          var depth = 0;
          info.scopeDepth = [];
          code.forEach(function(i, pc) {
            info.scopeDepth[pc] = depth;
            var s = i.run.toString();
            if (s.indexOf("m.enter(f)") >= 0) depth++;
            if (s.indexOf("m.leave(f)") >= 0) depth--;
          });
          return id;
        }
        var root = makeFunction(ast);
        return {
          source,
          ast,
          functions,
          root,
          nodes
        };
      }
      exports.compile = compile;
    }
  });

  // safescript-upstream/src/continuation-debug.js
  var require_continuation_debug = __commonJS({
    "safescript-upstream/src/continuation-debug.js"(exports) {
      "use strict";
      var compiler = require_continuation_compiler();
      var runtime = require_runtime();
      var defs = require_defs();
      var Base = require_debug().DebugSession;
      var Journal = require_journal().Journal;
      var protocol = require_debug_protocol();
      var createDOMContext = require_dom().createDOMContext;
      var resolveHandle = require_safe_handle().resolveNode;
      var UNINITIALIZED = Object.freeze({ tdz: true });
      function Environment(parent, kind) {
        this.parent = parent;
        this.kind = kind;
        this.cells = /* @__PURE__ */ Object.create(null);
      }
      function domCapture(root) {
        if (!root) return null;
        var nodes = [];
        function visit(n) {
          nodes.push({
            node: n,
            children: Array.from(n.childNodes || []),
            attrs: n.attributes ? Array.from(n.attributes).map(function(a) {
              return [a.name, a.value];
            }) : null,
            data: n.nodeType === 3 ? n.data : null,
            value: "value" in n ? n.value : void 0,
            checked: "checked" in n ? n.checked : void 0
          });
          Array.from(n.childNodes || []).forEach(visit);
        }
        visit(root);
        return nodes;
      }
      function domRestore(records) {
        if (!records) return;
        records.forEach(function(r) {
          var n = r.node;
          if (r.attrs) {
            Array.from(n.attributes).forEach(function(a) {
              n.removeAttribute(a.name);
            });
            r.attrs.forEach(function(a) {
              n.setAttribute(a[0], a[1]);
            });
          }
          if (r.data !== null) n.data = r.data;
          if (r.value !== void 0) n.value = r.value;
          if (r.checked !== void 0) n.checked = r.checked;
          while (n.firstChild) n.removeChild(n.firstChild);
          r.children.forEach(function(c) {
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
        this.versions = shared ? shared.versions : /* @__PURE__ */ new Map([[1, this.program]]);
        this._hostObjects = shared ? shared._hostObjects : /* @__PURE__ */ new Set();
        this._originals = shared ? shared._originals : /* @__PURE__ */ new WeakMap();
        this._functionInfo = shared ? shared._functionInfo : /* @__PURE__ */ new WeakMap();
        this._domOriginal = shared ? shared._domOriginal : opts.dom && opts.dom.root;
        this._domMap = shared ? shared._domMap : /* @__PURE__ */ new Map();
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
        this.nodes = shared ? shared.nodes : /* @__PURE__ */ new Map();
        this.nextId = shared ? shared.nextId : 1;
        this.currentNodeId = null;
        this._preferred = /* @__PURE__ */ new Map();
        this.history = [];
        this._commitClock = shared ? shared._commitClock : { value: 0 };
        this.epoch = this._commitClock.value;
        this._barrier = 0;
        this._generation = 0;
        this._busy = false;
        this._finishedValue = void 0;
        this._pauseRequested = false;
        this._mode = "into";
        this._targetDepth = 0;
        this._ops = 0;
        this._memory = 0;
        this._rng = opts.seed === void 0 ? 0 : opts.seed;
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
            initialized: true
          };
        });
        Object.keys(input).forEach((k) => {
          globalEnv.cells[k] = { kind: "scope", value: input[k], initialized: true };
        });
        globalEnv.cells.undefined = {
          kind: "const",
          value: void 0,
          initialized: true
        };
        this.frames = [];
        this._newFrame(this.program.root, globalEnv, [], void 0, null);
        this._initial = this._capture();
        if (opts.driver)
          this.protocol = new protocol.DebugProtocol(this, opts.driver);
      }
      Session.prototype = Object.create(Base.prototype);
      Session.prototype.constructor = Session;
      Session.prototype._markHost = function(v, seen) {
        if (!v || typeof v !== "object" && typeof v !== "function") return;
        seen = seen || /* @__PURE__ */ new Set();
        if (seen.has(v)) return;
        seen.add(v);
        this._hostObjects.add(v);
        if (typeof v !== "function")
          Object.keys(v).forEach((k) => {
            var d = Object.getOwnPropertyDescriptor(v, k);
            if (d && "value" in d) this._markHost(d.value, seen);
          });
      };
      Session.prototype._prepareScope = function(scope) {
        var self = this, seen = /* @__PURE__ */ new Map();
        function copy(v) {
          if (typeof v === "function") return runtime.sanitize(v);
          if (!v || typeof v !== "object") return v;
          if (self.isNode(v) && self.domContext) {
            var clone = null;
            self._domMap.forEach(function(original, c) {
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
          if (v instanceof Map || v instanceof Set || v instanceof Date || v instanceof RegExp) {
            var special = v instanceof Map ? /* @__PURE__ */ new Map() : v instanceof Set ? /* @__PURE__ */ new Set() : v instanceof Date ? new Date(v.getTime()) : new RegExp(v.source, v.flags);
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
          var out = Array.isArray(v) ? [] : /* @__PURE__ */ Object.create(null);
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
      Session.prototype.isNode = function(v) {
        var C = this.domRoot && this.domRoot.ownerDocument && this.domRoot.ownerDocument.defaultView && this.domRoot.ownerDocument.defaultView.Node;
        return !!C && v instanceof C;
      };
      Session.prototype._clone = function(value) {
        var seen = /* @__PURE__ */ new Map(), self = this;
        function clone(v) {
          if (v === UNINITIALIZED || v === null || typeof v !== "object" && typeof v !== "function")
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
            out = /* @__PURE__ */ new Map();
            if (self._originals.has(v))
              self._originals.set(out, self._originals.get(v));
            seen.set(v, out);
            v.forEach((x, k) => out.set(clone(k), clone(x)));
            return out;
          }
          if (v instanceof Set) {
            out = /* @__PURE__ */ new Set();
            if (self._originals.has(v))
              self._originals.set(out, self._originals.get(v));
            seen.set(v, out);
            v.forEach((x) => out.add(clone(x)));
            return out;
          }
          out = Array.isArray(v) ? new Array(v.length) : Object.create(
            Object.getPrototypeOf(v) === Environment.prototype ? Environment.prototype : null
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
      Session.prototype._capture = function() {
        return {
          state: this._clone({
            frames: this.frames,
            rng: this._rng,
            result: this._finishedValue,
            lastLocals: this._lastUserLocals,
            effects: this._effects,
            journal: this.journal.entries(),
            externals: this.journal.externalEntries()
          }),
          dom: domCapture(this.domRoot),
          version: this.sourceVersion,
          epoch: this.epoch,
          barrier: this._barrier
        };
      };
      Session.prototype._restore = function(snap) {
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
      Session.prototype._newFrame = function(id, parent, args, thisValue, returnTo) {
        var fn = this.program.functions[id];
        if (!fn) throw new Error("Missing continuation " + id);
        var env = new Environment(parent, "function");
        fn.vars.forEach(
          (k) => env.cells[k] = { value: void 0, kind: "var", initialized: true }
        );
        var f = {
          fn,
          pc: 0,
          env,
          rootEnv: env,
          s: [],
          t: /* @__PURE__ */ Object.create(null),
          args,
          thisValue,
          handlers: [],
          returnTo
        };
        this.frames.push(f);
        return f;
      };
      Session.prototype.enter = function(f) {
        f.env = new Environment(f.env, "block");
      };
      Session.prototype.leave = function(f) {
        if (f.env.parent) f.env = f.env.parent;
      };
      Session.prototype.iteration = function(f) {
        var next = new Environment(f.env.parent, f.env.kind);
        Object.keys(f.env.cells).forEach(
          (k) => next.cells[k] = { ...f.env.cells[k] }
        );
        f.env = next;
      };
      Session.prototype.declare = function(f, name, kind) {
        if (Object.prototype.hasOwnProperty.call(f.env.cells, name) && f.env.cells[name].kind !== "var")
          throw new SyntaxError("Duplicate binding " + name);
        f.env.cells[name] = { value: UNINITIALIZED, kind, initialized: false };
      };
      Session.prototype.find = function(f, name) {
        for (var e = f.env; e; e = e.parent)
          if (Object.prototype.hasOwnProperty.call(e.cells, name))
            return { cell: e.cells[name], env: e };
        return null;
      };
      Session.prototype.reference = function(f, name) {
        var b = this.find(f, name);
        if (!b) throw new ReferenceError(name + " is not defined");
        return { binding: b.cell };
      };
      Session.prototype.get = function(f, name) {
        var r = this.reference(f, name);
        if (!r.binding.initialized)
          throw new ReferenceError(
            "Cannot access " + name + " before initialization"
          );
        return r.binding.value;
      };
      Session.prototype.typeofName = function(f, name) {
        return this.find(f, name) ? typeof this.get(f, name) : "undefined";
      };
      Session.prototype.bind = function(f, name, value, kind, declare) {
        var env = kind === "var" ? f.rootEnv : f.env;
        var c;
        if (declare) {
          c = env.cells[name];
          if (!c)
            c = env.cells[name] = {
              kind,
              initialized: false,
              value: UNINITIALIZED
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
      Session.prototype.property = function(o, k, optional) {
        k = String(k);
        if (defs.BLOCKED_PROPS[k] || k === "__original")
          throw new TypeError("SafeScript: blocked property " + k);
        if (o == null && !optional)
          throw new TypeError("Cannot read property " + k + " of " + o);
        return { object: o, key: k, optional };
      };
      Session.prototype.at = function(o, k) {
        return this.read(this.property(o, k, false));
      };
      Session.prototype.read = function(r) {
        if (r.binding) {
          if (!r.binding.initialized)
            throw new ReferenceError("Binding not initialized");
          return r.binding.value;
        }
        if (r.object == null && r.optional) return void 0;
        var value = runtime.__at(r.object, r.key);
        if (r.object && resolveHandle(r.object) && value && typeof value === "object")
          this._markHost(value);
        return value;
      };
      Session.prototype.write = function(r, v) {
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
      Session.prototype.set = function(o, k, v) {
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
            barrier: this._barrier
          });
          runtime.__set(o, k, v);
          return v;
        }
        var target = this._originals.get(o) || o;
        var old = this.journal.has(target, k) ? this.journal.read(target, k) : target[k];
        this.journal.write(target, k, old, v);
        runtime.__set(o, k, v);
        this._effects.push({ kind: "write", key: k, was: old, to: v });
        return v;
      };
      Session.prototype.assign = function(o, v) {
        if (v != null)
          Object.keys(v).forEach((k) => {
            if (!defs.BLOCKED_PROPS[k]) runtime.__set(o, k, v[k]);
          });
        return o;
      };
      Session.prototype.rest = function(o, keys) {
        var v = /* @__PURE__ */ Object.create(null);
        if (o != null)
          Object.keys(o).forEach((k) => {
            if (keys.indexOf(k) < 0 && !defs.BLOCKED_PROPS[k]) v[k] = this.at(o, k);
          });
        return v;
      };
      Session.prototype.keys = function(o) {
        var a = [];
        for (var k in o) if (!defs.BLOCKED_PROPS[k]) a.push(k);
        return a;
      };
      Session.prototype._makeClosure = function(info) {
        var fn = function SafeScriptFunction() {
          throw new TypeError(
            "Resumable callback requires a SafeScript continuation adapter"
          );
        };
        this._functionInfo.set(fn, info);
        var def = this.program.functions[info.id];
        if (def) {
          Object.defineProperty(fn, "name", { value: def.name, configurable: true });
          Object.defineProperty(fn, "length", {
            value: def.params.length,
            configurable: true
          });
        }
        return fn;
      };
      Session.prototype.closure = function(f, id, arrow) {
        return this._makeClosure({
          id,
          env: f.env,
          arrow,
          thisValue: arrow ? f.thisValue : void 0
        });
      };
      Session.prototype.random = function() {
        var x = this._rng | 0;
        x = x + 1831565813 | 0;
        this._rng = x;
        var t = x;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
      Session.prototype.labelScope = function(f, label) {
        return f.fn.scopeDepth[f.fn.labels[label]] || 0;
      };
      Session.prototype._go = function(f, label, depth) {
        f.pc = f.fn.labels[label];
        var chain = [], e = f.env;
        while (e && e !== f.rootEnv) {
          chain.push(e);
          e = e.parent;
        }
        while (chain.length > depth) {
          this.leave(f);
          chain.pop();
        }
      };
      Session.prototype.abrupt = function(f, signal) {
        while (f.handlers.length) {
          var h = f.handlers[f.handlers.length - 1];
          if (signal.kind === "jump") {
            var pc = f.fn.labels[signal.target], end = f.fn.labels[h.end];
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
        if (signal.kind === "return" && (f.fn.id !== this.program.root || !this._lastUserLocals))
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
      Session.prototype.completeTry = function(f) {
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
      Session.prototype.endFinally = function(f) {
        var h = f.handlers.pop();
        f.env = h.env;
        if (h.pending) this.abrupt(f, h.pending);
        else f.pc = f.fn.labels[h.end];
      };
      Session.prototype._isPure = function(o, key, fn) {
        if (this.options.pureCalls && (this.options.pureCalls.indexOf(fn) >= 0 || this.options.pureCalls.indexOf(fn.__original) >= 0))
          return true;
        if (o === this.globals.Math || o === this.globals.JSON || o === this.globals.Object || o === this.globals.Array)
          return true;
        if (o == null) return Object.values(this.globals).indexOf(fn) >= 0;
        return typeof o === "string" || typeof o === "number" || Array.isArray(o) || o instanceof RegExp || o instanceof Map || o instanceof Set || o instanceof Date || resolveHandle(o) || this.domContext && this._hostObjects.has(o) && Object.values(this.domContext.scope).indexOf(o) >= 0;
      };
      Session.prototype.invoke = function(f, callee, args, isNew) {
        var receiver, fn = callee, key;
        if (callee && Object.prototype.hasOwnProperty.call(callee, "object") && Object.prototype.hasOwnProperty.call(callee, "key")) {
          receiver = callee.object;
          key = callee.key;
          if (receiver == null && callee.optional) {
            f.s.push(void 0);
            return;
          }
          fn = this.read(callee);
        }
        if (receiver && this._functionInfo.has(receiver) && ["call", "apply", "bind"].indexOf(key) >= 0) {
          var bound = this._functionInfo.get(receiver);
          if (key === "bind") {
            f.s.push(
              this._makeClosure(
                Object.assign({}, bound, {
                  boundThis: args[0],
                  boundArgs: args.slice(1)
                })
              )
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
            info.arrow ? info.thisValue : "boundThis" in info ? info.boundThis : receiver,
            f.fn.id
          );
          return;
        }
        if (Array.isArray(receiver) && [
          "map",
          "filter",
          "forEach",
          "reduce",
          "some",
          "every",
          "find",
          "findIndex",
          "flatMap"
        ].indexOf(key) >= 0 && args[0] && this._functionInfo.has(args[0])) {
          this._arrayCall(f, receiver, key, args);
          return;
        }
        if (args.some((a) => a && this._functionInfo.has(a)) && !(Array.isArray(receiver) && [
          "push",
          "unshift",
          "splice",
          "concat",
          "fill",
          "includes",
          "indexOf",
          "lastIndexOf"
        ].indexOf(key) >= 0))
          throw new TypeError(
            "Passing a resumable callback to an opaque host method requires an explicit callback adapter"
          );
        if (typeof fn !== "function")
          throw new TypeError(String(key || "value") + " is not a function");
        this._effects.push({
          kind: "call",
          method: key || fn.name || "call",
          args: this._clone(args)
        });
        var pure = this._isPure(receiver, key, fn);
        if (!pure) {
          this._barrier++;
          this._effects.push({
            kind: "external",
            method: key || fn.name || "host call",
            barrier: this._barrier
          });
        }
        var specialBefore = receiver instanceof Map ? Array.from(receiver.entries()) : receiver instanceof Set ? Array.from(receiver) : receiver instanceof Date ? receiver.getTime() : null;
        var arrayBefore = Array.isArray(receiver) && [
          "push",
          "pop",
          "shift",
          "unshift",
          "splice",
          "reverse",
          "sort",
          "fill",
          "copyWithin"
        ].indexOf(key) >= 0 ? receiver.slice() : null;
        var v = isNew ? runtime.debugNew(fn, args, this.options.allowNew) : receiver !== void 0 ? runtime.__call.apply(null, [receiver, key].concat(args)) : fn.apply(void 0, args);
        if (receiver instanceof Map && ["set", "delete", "clear"].includes(key))
          this.journal.write(
            this._originals.get(receiver) || receiver,
            "map:state",
            specialBefore,
            Array.from(receiver.entries())
          );
        if (receiver instanceof Set && ["add", "delete", "clear"].includes(key))
          this.journal.write(
            this._originals.get(receiver) || receiver,
            "set:state",
            specialBefore,
            Array.from(receiver)
          );
        if (receiver instanceof Date && key.startsWith("set"))
          this.journal.write(
            this._originals.get(receiver) || receiver,
            "date:value",
            specialBefore,
            receiver.getTime()
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
          if (!pure && value && (typeof value === "object" || typeof value === "function"))
            return this._prepareScope({ value }).value;
          return value;
        };
        if (v && typeof v.then === "function")
          return Promise.resolve(v).then((value) => {
            f.s.push(adopt(value));
          });
        f.s.push(adopt(v));
      };
      Session.prototype._arrayCall = function(f, array, method, args) {
        var callback = args[0], length = array.length, result = method === "reduce" ? args.length > 1 ? args[1] : array[0] : [], start = method === "reduce" && args.length < 2 ? 1 : 0;
        if (method === "reduce" && length === 0 && args.length < 2)
          throw new TypeError("Reduce of empty array with no initial value");
        var state = {
          array,
          method,
          args,
          index: start,
          length,
          result,
          callback
        };
        this._arrayNext(f, state);
      };
      Session.prototype._arrayNext = function(f, a) {
        while (a.index < a.length && !(a.index in a.array)) a.index++;
        if (a.index >= a.length) {
          f.s.push(
            a.method === "forEach" ? void 0 : a.method === "some" ? false : a.method === "every" ? true : a.method === "find" ? void 0 : a.method === "findIndex" ? -1 : a.result
          );
          return;
        }
        var i = a.index++, params = a.method === "reduce" ? [a.result, a.array[i], i, a.array] : [a.array[i], i, a.array];
        f.arrayPending = a;
        var info = this._functionInfo.get(a.callback);
        this._newFrame(
          info.id,
          info.env,
          params,
          info.arrow ? info.thisValue : a.args[1],
          f.fn.id
        );
      };
      Session.prototype._arrayReturn = function(f) {
        var a = f.arrayPending;
        if (!a) return;
        delete f.arrayPending;
        var v = f.s.pop(), i = a.index - 1;
        if (a.method === "map") a.result[i] = v;
        else if (a.method === "flatMap")
          a.result.push(...Array.isArray(v) ? v : [v]);
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
      Session.prototype.getLocals = function() {
        var f = this.frames[this.frames.length - 1];
        if (!f)
          return Object.assign(
            /* @__PURE__ */ Object.create(null),
            this._lastUserLocals || this.currentLocals || {},
            { returnValue: this._finishedValue }
          );
        var out = /* @__PURE__ */ Object.create(null);
        for (var e = f.env; e && e.kind !== "global"; e = e.parent)
          Object.keys(e.cells).forEach((k) => {
            if (!(k in out) && e.cells[k].initialized) out[k] = e.cells[k].value;
          });
        return out;
      };
      Session.prototype.callDepth = function() {
        return Math.max(0, this.frames.length - 1);
      };
      Session.prototype._path = function(id) {
        var a = [];
        while (id) {
          var n = this.nodes.get(id);
          if (!n) break;
          a.push(n);
          id = n.parentId;
        }
        return a.reverse();
      };
      Session.prototype._snapshotBytes = function(v, seen) {
        if (v === null || v === void 0) return 0;
        if (typeof v === "string") return v.length * 2 + 16;
        if (typeof v !== "object" && typeof v !== "function") return 8;
        if (this._hostObjects.has(v) || this.isNode(v)) return 8;
        seen = seen || /* @__PURE__ */ new Set();
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
          v.forEach((x) => n += this._snapshotBytes(x, seen));
          return n;
        }
        Object.keys(v).forEach((k) => {
          if (k !== "fn") n += k.length * 2 + this._snapshotBytes(v[k], seen);
        });
        return n;
      };
      Session.prototype._record = function(line, phase, nodeId, label) {
        if (this.nodes.size >= (this.options.maxCheckpoints || 4096))
          throw new Error("SafeScript: checkpoint history limit exceeded");
        var id = this.nextId++, parent = this.currentNodeId, n = {
          id,
          parentId: parent,
          children: [],
          line,
          phase,
          nodeId,
          label: label || "",
          version: this.sourceVersion,
          depth: this.callDepth(),
          locals: this._clone(this.getLocals()),
          effects: this._clone(this._effects.splice(0)),
          journalCursor: this.journal.entries().length
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
        if (this._memory > Math.min(this.options.maxMemory || runtime.MAX_MEMORY, runtime.MAX_MEMORY))
          throw new Error("SafeScript: debug snapshot memory limit exceeded");
        this.history = this._path(id).map((x) => ({
          index: x.id,
          line: x.line,
          phase: x.phase,
          locals: x.locals,
          effects: x.effects,
          nodeId: x.nodeId,
          depth: x.depth,
          id: x.id
        }));
        this.onStep(this.history[this.history.length - 1]);
        return n;
      };
      Session.prototype.checkpoint = function(f, nodeId, line, phase) {
        this.journal.setStepIndex(this._seq++);
        this.currentLine = line;
        var n = this._record(line, phase, nodeId);
        var active = this.pauseOn === "both" || this.pauseOn === phase;
        var should = active && (this._mode === "into" || this._mode === "over" && this.callDepth() <= this._targetDepth || this._mode === "out" && this.callDepth() < this._targetDepth || this.breakpoints[line] && this._checkCondition(line, () => this.getLocals()));
        if (phase === "before" && this._logpoints[line] && this.onLog)
          this.onLog({
            line,
            message: this._evaluateLogpoint(
              this._logpoints[line],
              () => this.getLocals()
            ),
            step: n.id
          });
        if (should) {
          if (this._oneShotLine === line) {
            delete this.breakpoints[line];
            delete this._oneShotLine;
          }
          this._pauseRequested = true;
        }
      };
      Session.prototype._pause = function(extra) {
        this.state = "paused";
        this.currentLocals = this._clone(this.getLocals());
        var n = this.nodes.get(this.currentNodeId);
        this.resume = () => {
        };
        this.onPause(
          Object.assign(
            {
              line: this.currentLine,
              locals: this.currentLocals,
              phase: n && n.phase,
              checkpointId: this.currentNodeId,
              depth: this.callDepth()
            },
            extra
          )
        );
      };
      Session.prototype._pump = async function() {
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
                value: returned
              });
              continue;
            }
            if (++this._ops > Math.min(this.options.maxOps || 1e5, runtime.MAX_OPS))
              throw new Error("SafeScript: max operations exceeded");
            if (Date.now() - began > Math.min(this.options.timeout || 1e4, runtime.MAX_TIMEOUT))
              throw new Error("SafeScript: execution timed out");
            var f = this.frames[this.frames.length - 1];
            if (f.arrayPending) {
              this._arrayReturn(f);
              continue;
            }
            if (this.domContext) {
              var adapter = require_dom_journal().attachDOMJournal;
              adapter(this.domContext.context, this.journal, this._effects);
            }
            var instruction = f.fn.code[f.pc++];
            if (!instruction) {
              this.abrupt(f, { kind: "return", value: void 0 });
              continue;
            }
            try {
              var p = instruction.run(this, f);
              if (f.handlers.length) {
                var h = f.handlers[f.handlers.length - 1];
                if (h.start === void 0) h.start = f.pc;
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
      Session.prototype.start = function() {
        this._pump();
        return this;
      };
      Session.prototype._run = function(mode) {
        if (this.state !== "paused") return;
        if (this.epoch !== this._commitClock.value)
          throw new Error(
            "Another branch committed; start a new session against committed state"
          );
        this._mode = mode;
        this._targetDepth = this.callDepth();
        this._pump();
      };
      Session.prototype.step = function() {
        this._run("into");
      };
      Session.prototype.stepOver = function() {
        this._run("over");
      };
      Session.prototype.stepOut = function() {
        this._run("out");
      };
      Session.prototype.continue = function() {
        this._run("continue");
      };
      Session.prototype.stop = function() {
        this._generation++;
        this.state = "finished";
        this.resume = null;
        this._busy = false;
      };
      Session.prototype.seek = function(id) {
        if (this._busy) throw new Error("Pause before seeking");
        var n = this.nodes.get(Number(id));
        if (!n) throw new RangeError("Unknown checkpoint");
        if (n.snapshot.epoch !== this._commitClock.value)
          throw new Error("Cannot cross a committed-state boundary");
        if (n.snapshot.barrier !== this._barrier)
          throw new Error(
            "Cannot rewind across an external operation without a replay adapter"
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
          depth: x.depth
        }));
        this._pause({ rewound: true });
        return true;
      };
      Session.prototype.rewindTo = function(index) {
        var h = this.history[index];
        if (h) return this.seek(h.id);
      };
      Session.prototype.setLocal = function(name, value) {
        if (this.state !== "paused") throw new Error("Pause before editing a local");
        var f = this.frames[this.frames.length - 1];
        if (!f) throw new Error("No live frame");
        this.write(this.reference(f, name), value);
        var n = this.nodes.get(this.currentNodeId);
        this._record(this.currentLine, n.phase, n.nodeId, "Set " + name);
        this._pause({ edited: true });
        return value;
      };
      Session.prototype.evaluate = function(expression) {
        if (this.state !== "paused")
          throw new Error("SafeScript: can only evaluate while paused");
        var ast = require_parse().parse("return (" + expression + ");");
        var valid = require_validate().validate(ast);
        if (!valid.ok)
          throw new SyntaxError(valid.errors.map((x) => x.message).join("; "));
        var n = ast.body[0].argument;
        var evalNode = (x) => {
          if (!x) return void 0;
          switch (x.type) {
            case "Literal":
              return x.value;
            case "Identifier":
              return this.get(this.frames[this.frames.length - 1], x.name);
            case "MemberExpression":
              return this.at(
                evalNode(x.object),
                x.computed ? evalNode(x.property) : x.property.name
              );
            case "UnaryExpression":
              return new Function("v", "return " + x.operator + " v")(
                evalNode(x.argument)
              );
            case "BinaryExpression":
              return new Function("a", "b", "return a " + x.operator + " b")(
                evalNode(x.left),
                evalNode(x.right)
              );
            case "LogicalExpression":
              var a = evalNode(x.left);
              return x.operator === "&&" ? a && evalNode(x.right) : x.operator === "||" ? a || evalNode(x.right) : a == null ? evalNode(x.right) : a;
            case "ConditionalExpression":
              return evalNode(x.test) ? evalNode(x.consequent) : evalNode(x.alternate);
            case "AssignmentExpression":
              if (x.left.type === "Identifier" && x.operator === "=")
                return this.setLocal(x.left.name, evalNode(x.right));
              throw new Error("Use setLocal for binding edits");
            default:
              throw new Error(
                "Watch expressions cannot call functions or mutate objects"
              );
          }
        };
        return evalNode(n);
      };
      Session.prototype.editAndContinue = function(source) {
        if (this.state !== "paused")
          throw new Error("SafeScript: can only edit-and-continue while paused");
        try {
          if (!this.frames.length)
            throw new Error(
              "Select a checkpoint with a live frame before editing code"
            );
          var next = compiler.compile(source, this.program), data = this._clone({ frames: this.frames });
          data.frames.forEach((f) => {
            var target = next.functions[f.fn.id];
            if (!target)
              throw new Error("Active function was deleted or changed ambiguously");
            if (JSON.stringify(
              target.params,
              (k, v) => k === "loc" || k === "_cid" ? void 0 : v
            ) !== JSON.stringify(
              f.fn.params,
              (k, v) => k === "loc" || k === "_cid" ? void 0 : v
            ))
              throw new Error("Cannot change parameters of an active function");
            var old2 = f.fn.code[f.pc];
            var selected = this.nodes.get(this.currentNodeId);
            var checkpoint = f === data.frames[data.frames.length - 1] && selected && selected.nodeId ? selected.nodeId + ":" + selected.phase + ":0" : null;
            if (checkpoint && target.ids[checkpoint] !== void 0)
              f.pc = target.ids[checkpoint] + 1;
            else {
              if (old2 && target.ids[old2.id] === void 0)
                throw new Error(
                  "Edit changes the active continuation; move the pause or restart"
                );
              f.pc = old2 ? target.ids[old2.id] : target.code.length;
            }
            f.fn = target;
          });
          var old = this.program;
          var visit = (v, seen) => {
            if (!v || typeof v !== "object" && typeof v !== "function" || this._hostObjects.has(v) || this.isNode(v) || seen.has(v))
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
          visit(data, /* @__PURE__ */ new Set());
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
            "Code edited \xB7 v" + this.sourceVersion
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
      Session.prototype.fork = function() {
        if (this.state !== "paused" && this.state !== "finished")
          throw new Error("Pause before forking");
        var child = new Session(
          this.source,
          {},
          Object.assign({}, this.options, { driver: null }),
          this
        );
        child.nodes = new Map(
          Array.from(this.nodes, ([id, n]) => [
            id,
            Object.assign({}, n, { children: n.children.slice() })
          ])
        );
        child.nextId = this.nextId;
        child.versions = new Map(this.versions);
        child._restore(this._capture());
        var envSeen = /* @__PURE__ */ new Set(), parentGlobals = this.globals;
        function rebind(e) {
          if (!e || envSeen.has(e)) return;
          envSeen.add(e);
          if (e.kind === "global")
            Object.keys(child.globals).forEach((k) => {
              if (e.cells[k] && e.cells[k].kind === "builtin" && e.cells[k].value === parentGlobals[k])
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
      Session.prototype.getTimeline = function() {
        var selected = this.currentNodeId, path = this._path(selected), n = this.nodes.get(selected);
        while (n && n.children.length) {
          var id = this._preferred.get(n.id) || n.children[n.children.length - 1];
          n = this.nodes.get(id);
          path.push(n);
        }
        return {
          currentId: selected,
          path: path.map((n2) => ({
            id: n2.id,
            parentId: n2.parentId,
            children: n2.children.slice(),
            line: n2.line,
            phase: n2.phase,
            label: n2.label,
            version: n2.version,
            depth: n2.depth,
            locals: n2.locals,
            effects: n2.effects,
            locked: n2.snapshot.barrier !== this._barrier || n2.snapshot.epoch !== this.epoch
          })),
          nodes: Array.from(this.nodes.values()).map((n2) => ({
            id: n2.id,
            parentId: n2.parentId,
            children: n2.children.slice(),
            line: n2.line,
            phase: n2.phase,
            label: n2.label,
            depth: n2.depth,
            version: n2.version,
            result: n2.phase === "complete" ? n2.snapshot.state.result : void 0,
            locked: n2.snapshot.barrier !== this._barrier || n2.snapshot.epoch !== this.epoch
          }))
        };
      };
      Session.prototype.projectDOM = function() {
        if (!this.domRoot) return null;
        var copy = this.domRoot.cloneNode(true), map = /* @__PURE__ */ new Map();
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
      Session.prototype.commit = function() {
        if (this._busy) throw new Error("Pause before committing");
        var entries = this.journal.entries(), writes = 0;
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
              Array.from(wanted.attributes).forEach(
                (a) => real.setAttribute(a.name, a.value)
              );
              if ("value" in real) real.value = wanted.value;
              if ("checked" in real) real.checked = wanted.checked;
            }
            var desired = Array.from(wanted.childNodes), kept = /* @__PURE__ */ new Set();
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
        var result = { writes, externals: this.journal.externalEntries() };
        this.journal.clear();
        this.epoch = ++this._commitClock.value;
        if (this.onCommit) this.onCommit(result);
        var n = this.nodes.get(this.currentNodeId);
        if (n) this._record(this.currentLine, n.phase, n.nodeId, "Committed");
        return result;
      };
      Session.prototype.discard = function() {
        if (this._busy) throw new Error("Pause before discarding");
        this.journal.clear();
        domRestore(this._domInitial);
        var n = this.nodes.get(this.currentNodeId);
        if (n) this._record(this.currentLine, n.phase, n.nodeId, "Discarded effects");
      };
      Session.prototype.serialize = function() {
        var basic = Base.prototype.serialize.call(this);
        basic.engine = "continuations";
        basic.source = this.source;
        basic.note = "Inspection export; executable restoration requires capability rebinding and continuation graph import.";
        return basic;
      };
      exports.Session = Session;
      exports.debug = function(source, scope, opts) {
        return new Session(source, scope, opts).start();
      };
    }
  });

  // safescript-upstream/safescript.js
  var require_safescript = __commonJS({
    "safescript-upstream/safescript.js"() {
    }
  });

  // safescript-upstream/src/worker.js
  var require_worker = __commonJS({
    "safescript-upstream/src/worker.js"(exports) {
      "use strict";
      var DebugProtocol = require_debug_protocol().DebugProtocol;
      var PostMessageDriver = require_debug_protocol().PostMessageDriver;
      function runInWorker(workerSelf, source, scope, opts) {
        opts = opts || {};
        var channel = opts.channel || "safescript-debug";
        var driver = new PostMessageDriver(workerSelf, channel);
        opts.driver = driver;
        var SafeScript = require_safescript();
        return SafeScript.debug(source, scope, opts);
      }
      function DebugProxy(target, opts) {
        opts = opts || {};
        this._target = target;
        this._channel = opts.channel || "safescript-debug";
        this.onEvent = opts.onEvent || function() {
        };
        this.state = "running";
        this.currentLine = 0;
        this.currentLocals = null;
        var self = this;
        var listener = function(event) {
          var msg = event.data;
          if (!msg || msg.channel !== self._channel) return;
          if (msg.direction !== "event") return;
          var payload = msg.payload;
          if (!payload) return;
          if (payload.type === "paused") {
            self.state = "paused";
            self.currentLine = payload.data.line;
            self.currentLocals = payload.data.locals;
          } else if (payload.type === "stepped") {
            self.currentLine = payload.data.line;
          } else if (payload.type === "finished") {
            self.state = "finished";
          } else if (payload.type === "error") {
            self.state = "error";
          }
          self.onEvent(payload);
        };
        if (typeof target.addEventListener === "function") {
          target.addEventListener("message", listener);
        } else if (typeof target.on === "function") {
          target.on("message", function(data) {
            listener({ data });
          });
        }
        this._listener = listener;
      }
      DebugProxy.prototype._send = function(type, data) {
        PostMessageDriver.sendCommand(this._target, type, data, this._channel);
      };
      DebugProxy.prototype.step = function() {
        this._send("step");
      };
      DebugProxy.prototype.continue = function() {
        this._send("continue");
      };
      DebugProxy.prototype.stop = function() {
        this._send("stop");
      };
      DebugProxy.prototype.setBreakpoints = function(lines) {
        this._send("setBreakpoints", { lines });
      };
      DebugProxy.prototype.toggleBreakpoint = function(line) {
        this._send("toggleBreakpoint", { line });
      };
      DebugProxy.prototype.runToLine = function(line) {
        this._send("runToLine", { line });
      };
      DebugProxy.prototype.editAndContinue = function(source) {
        this._send("editAndContinue", { source });
      };
      DebugProxy.prototype.rewindTo = function(stepIndex) {
        this._send("rewindTo", { stepIndex });
      };
      DebugProxy.prototype.commit = function() {
        this._send("commit");
      };
      DebugProxy.prototype.discard = function() {
        this._send("discard");
      };
      DebugProxy.prototype.getLocals = function() {
        this._send("getLocals");
      };
      DebugProxy.prototype.getHistory = function() {
        this._send("getHistory");
      };
      DebugProxy.prototype.getJournal = function() {
        this._send("getJournal");
      };
      DebugProxy.prototype.getNodeTimeline = function(node, prop) {
        this._send("getNodeTimeline", { node, prop });
      };
      DebugProxy.prototype.getDOMSnapshots = function() {
        this._send("getDOMSnapshots");
      };
      DebugProxy.prototype.snapshotDOM = function() {
        this._send("snapshotDOM");
      };
      DebugProxy.prototype.restoreDOM = function(snapshotIndex) {
        this._send("restoreDOM", { snapshotIndex });
      };
      DebugProxy.prototype.stepOver = function() {
        this._send("stepOver");
      };
      DebugProxy.prototype.stepOut = function() {
        this._send("stepOut");
      };
      DebugProxy.prototype.evaluate = function(expression) {
        this._send("evaluate", { expression });
      };
      DebugProxy.prototype.setConditionalBreakpoint = function(line, condition) {
        this._send("setConditionalBreakpoint", { line, condition });
      };
      DebugProxy.prototype.fork = function() {
        this._send("fork");
      };
      DebugProxy.prototype.serialize = function() {
        this._send("serialize");
      };
      DebugProxy.prototype.setLogpoint = function(line, template) {
        this._send("setLogpoint", { line, template });
      };
      DebugProxy.prototype.removeLogpoint = function(line) {
        this._send("removeLogpoint", { line });
      };
      DebugProxy.prototype.setPauseOn = function(mode) {
        this._send("setPauseOn", { mode });
      };
      DebugProxy.prototype.disconnect = function() {
        if (this._listener && typeof this._target.removeEventListener === "function") {
          this._target.removeEventListener("message", this._listener);
        }
        this._listener = null;
      };
      function createWorkerProxy(target, opts) {
        return new DebugProxy(target, opts);
      }
      exports.runInWorker = runInWorker;
      exports.createWorkerProxy = createWorkerProxy;
      exports.DebugProxy = DebugProxy;
      DebugProxy.prototype.seek = function(checkpointId) {
        this._send("seek", { checkpointId });
      };
      DebugProxy.prototype.setLocal = function(name, value) {
        this._send("setLocal", { name, value });
      };
      DebugProxy.prototype.getTimeline = function() {
        this._send("getTimeline");
      };
    }
  });

  // safescript-upstream/safe.js
  var require_safe = __commonJS({
    "safescript-upstream/safe.js"(exports, module) {
      (function(root) {
        "use strict";
        var BLOCKED = /* @__PURE__ */ Object.create(null);
        [
          // Prototype chain
          "constructor",
          "__proto__",
          "prototype",
          "__defineGetter__",
          "__defineSetter__",
          "__lookupGetter__",
          "__lookupSetter__",
          // Self-reference and stack walking
          "this",
          "arguments",
          "callee",
          "caller",
          // Code generation
          "eval",
          "Function",
          // Browser globals
          "globalThis",
          "window",
          "document",
          "navigator",
          "self",
          "top",
          "parent",
          "frames",
          "location",
          "history",
          // Metaprogramming
          "Proxy",
          "Reflect",
          "Symbol",
          // Network
          "fetch",
          "XMLHttpRequest",
          "WebSocket",
          "EventSource",
          // Timers (inject explicitly via scope if needed)
          "setTimeout",
          "setInterval",
          "requestAnimationFrame",
          // Node.js
          "require",
          "module",
          "exports",
          "process",
          "global",
          "Buffer",
          "__filename",
          "__dirname"
        ].forEach(function(k) {
          BLOCKED[k] = 1;
        });
        var BLOCKED_KW = /* @__PURE__ */ Object.create(null);
        [
          "new",
          "delete",
          "class",
          "extends",
          "super",
          "with",
          "async",
          "await",
          "yield",
          "import",
          "export",
          "debugger"
        ].forEach(function(k) {
          BLOCKED_KW[k] = 1;
        });
        var ALLOWED_KW = /* @__PURE__ */ Object.create(null);
        [
          "var",
          "let",
          "const",
          "if",
          "else",
          "for",
          "while",
          "do",
          "break",
          "continue",
          "return",
          "function",
          "try",
          "catch",
          "finally",
          "throw",
          "switch",
          "case",
          "default",
          "typeof",
          "void",
          "in",
          "of",
          "true",
          "false",
          "null",
          "undefined",
          "instanceof"
        ].forEach(function(k) {
          ALLOWED_KW[k] = 1;
        });
        var BLOCKED_PROPS = /* @__PURE__ */ Object.create(null);
        [
          "constructor",
          "__proto__",
          "prototype",
          "__defineGetter__",
          "__defineSetter__",
          "__lookupGetter__",
          "__lookupSetter__",
          "caller",
          "callee",
          "arguments"
        ].forEach(function(k) {
          BLOCKED_PROPS[k] = 1;
        });
        var SHADOW_STATIC = [
          "Object",
          "Array",
          "String",
          "Number",
          "Boolean",
          "BigInt",
          "Function",
          "Symbol",
          "Error",
          "TypeError",
          "RangeError",
          "SyntaxError",
          "ReferenceError",
          "EvalError",
          "URIError",
          "AggregateError",
          "Map",
          "Set",
          "WeakMap",
          "WeakSet",
          "WeakRef",
          "FinalizationRegistry",
          "Date",
          "RegExp",
          "Promise",
          "JSON",
          "Math",
          "Intl",
          "ArrayBuffer",
          "SharedArrayBuffer",
          "DataView",
          "Atomics",
          "Int8Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "Int16Array",
          "Uint16Array",
          "Int32Array",
          "Uint32Array",
          "Float32Array",
          "Float64Array",
          "BigInt64Array",
          "BigUint64Array",
          "Proxy",
          "Reflect",
          "eval",
          "Function",
          "globalThis",
          "window",
          "self",
          "top",
          "parent",
          "frames",
          "global",
          "document",
          "navigator",
          "location",
          "history",
          "screen",
          "localStorage",
          "sessionStorage",
          "indexedDB",
          "alert",
          "confirm",
          "prompt",
          "print",
          "open",
          "close",
          "focus",
          "blur",
          "postMessage",
          "addEventListener",
          "removeEventListener",
          "dispatchEvent",
          "CustomEvent",
          "Event",
          "MutationObserver",
          "ResizeObserver",
          "IntersectionObserver",
          "Element",
          "HTMLElement",
          "Node",
          "NodeList",
          "DocumentFragment",
          "DOMParser",
          "XMLSerializer",
          "getComputedStyle",
          "matchMedia",
          "requestAnimationFrame",
          "cancelAnimationFrame",
          "fetch",
          "XMLHttpRequest",
          "WebSocket",
          "EventSource",
          "Request",
          "Response",
          "Headers",
          "URL",
          "URLSearchParams",
          "setTimeout",
          "setInterval",
          "setImmediate",
          "clearTimeout",
          "clearInterval",
          "clearImmediate",
          "queueMicrotask",
          "structuredClone",
          "Worker",
          "SharedWorker",
          "Blob",
          "File",
          "FileReader",
          "FileList",
          "FormData",
          "TextEncoder",
          "TextDecoder",
          "atob",
          "btoa",
          "encodeURI",
          "decodeURI",
          "encodeURIComponent",
          "decodeURIComponent",
          "escape",
          "unescape",
          "crypto",
          "performance",
          "Notification",
          "BroadcastChannel",
          "MessageChannel",
          "MessagePort",
          "AbortController",
          "AbortSignal",
          "isNaN",
          "isFinite",
          "parseInt",
          "parseFloat",
          "NaN",
          "Infinity",
          "require",
          "module",
          "exports",
          "__filename",
          "__dirname",
          "process",
          "Buffer",
          "console",
          "constructor",
          "__proto__",
          "prototype"
        ];
        var OPS3 = /* @__PURE__ */ Object.create(null);
        ["===", "!==", ">>>", "**=", "<<=", ">>=", "&&=", "||=", "??=", "..."].forEach(function(k) {
          OPS3[k] = 1;
        });
        var OPS2 = /* @__PURE__ */ Object.create(null);
        [
          "==",
          "!=",
          ">=",
          "<=",
          "&&",
          "||",
          "??",
          "+=",
          "-=",
          "*=",
          "/=",
          "%=",
          "**",
          "++",
          "--",
          "=>",
          "?.",
          "<<",
          ">>",
          "&=",
          "|=",
          "^="
        ].forEach(function(k) {
          OPS2[k] = 1;
        });
        var OPS1 = /* @__PURE__ */ Object.create(null);
        [
          "+",
          "-",
          "*",
          "/",
          "%",
          "=",
          "<",
          ">",
          "!",
          "&",
          "|",
          "^",
          "~",
          "?",
          ":",
          ";",
          ",",
          ".",
          "(",
          ")",
          "{",
          "}",
          "[",
          "]"
        ].forEach(function(k) {
          OPS1[k] = 1;
        });
        function tokenize(source) {
          var tokens = [];
          var i = 0, len = source.length;
          var line = 1, lineStart = 0;
          var lastNonWsType = null;
          var lastNonWsValue = null;
          while (i < len) {
            var start = i;
            var sl = line, sc = i - lineStart + 1;
            var ch = source[i];
            if (ch === " " || ch === "	" || ch === "\r" || ch === "\n" || ch === "\v" || ch === "\f") {
              while (i < len) {
                var c = source[i];
                if (c === "\n") {
                  line++;
                  lineStart = i + 1;
                } else if (c !== " " && c !== "	" && c !== "\r" && c !== "\v" && c !== "\f") break;
                i++;
              }
              continue;
            }
            if (ch === "/" && i + 1 < len && source[i + 1] === "/") {
              while (i < len && source[i] !== "\n") i++;
              continue;
            }
            if (ch === "/" && i + 1 < len && source[i + 1] === "*") {
              i += 2;
              while (i < len) {
                if (source[i] === "\n") {
                  line++;
                  lineStart = i + 1;
                }
                if (source[i] === "*" && i + 1 < len && source[i + 1] === "/") {
                  i += 2;
                  break;
                }
                i++;
              }
              continue;
            }
            if (ch === '"' || ch === "'") {
              var quote = ch;
              i++;
              while (i < len && source[i] !== quote) {
                if (source[i] === "\\") {
                  i++;
                  if (i < len && source[i] === "\n") {
                    line++;
                    lineStart = i + 1;
                  }
                }
                i++;
              }
              if (i < len) i++;
              tokens.push({ type: "string", value: source.slice(start, i), line: sl, col: sc });
              lastNonWsType = "string";
              lastNonWsValue = tokens[tokens.length - 1].value;
              continue;
            }
            if (ch === "`") {
              i++;
              while (i < len && source[i] !== "`") {
                if (source[i] === "\\") i++;
                if (i < len && source[i] === "\n") {
                  line++;
                  lineStart = i + 1;
                }
                i++;
              }
              if (i < len) i++;
              tokens.push({ type: "template", value: source.slice(start, i), line: sl, col: sc });
              lastNonWsType = "template";
              lastNonWsValue = "`";
              continue;
            }
            if (ch >= "0" && ch <= "9" || ch === "." && i + 1 < len && source[i + 1] >= "0" && source[i + 1] <= "9") {
              if (ch === "0" && i + 1 < len && (source[i + 1] === "x" || source[i + 1] === "X")) {
                i += 2;
                while (i < len && /[0-9a-fA-F_]/.test(source[i])) i++;
              } else if (ch === "0" && i + 1 < len && (source[i + 1] === "b" || source[i + 1] === "B")) {
                i += 2;
                while (i < len && (source[i] === "0" || source[i] === "1" || source[i] === "_")) i++;
              } else if (ch === "0" && i + 1 < len && (source[i + 1] === "o" || source[i + 1] === "O")) {
                i += 2;
                while (i < len && source[i] >= "0" && source[i] <= "7") i++;
              } else {
                while (i < len && (source[i] >= "0" && source[i] <= "9" || source[i] === "_")) i++;
                if (i < len && source[i] === ".") {
                  i++;
                  while (i < len && (source[i] >= "0" && source[i] <= "9" || source[i] === "_")) i++;
                }
                if (i < len && (source[i] === "e" || source[i] === "E")) {
                  i++;
                  if (i < len && (source[i] === "+" || source[i] === "-")) i++;
                  while (i < len && (source[i] >= "0" && source[i] <= "9" || source[i] === "_")) i++;
                }
              }
              if (i < len && source[i] === "n") i++;
              tokens.push({ type: "number", value: source.slice(start, i), line: sl, col: sc });
              lastNonWsType = "number";
              lastNonWsValue = tokens[tokens.length - 1].value;
              continue;
            }
            if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch === "_" || ch === "$") {
              while (i < len) {
                var ic = source[i];
                if (ic >= "a" && ic <= "z" || ic >= "A" && ic <= "Z" || ic >= "0" && ic <= "9" || ic === "_" || ic === "$") i++;
                else break;
              }
              var word = source.slice(start, i);
              var type;
              if (BLOCKED[word]) type = "blocked";
              else if (BLOCKED_KW[word]) type = "blocked_kw";
              else if (ALLOWED_KW[word]) type = "keyword";
              else type = "ident";
              tokens.push({ type, value: word, line: sl, col: sc });
              lastNonWsType = type;
              lastNonWsValue = word;
              continue;
            }
            if (ch === "/" && !isExprEnd(lastNonWsType, lastNonWsValue)) {
              i++;
              while (i < len && source[i] !== "/") {
                if (source[i] === "\\") i++;
                if (i < len && source[i] === "[") {
                  i++;
                  while (i < len && source[i] !== "]") {
                    if (source[i] === "\\") i++;
                    i++;
                  }
                }
                i++;
              }
              if (i < len) i++;
              while (i < len && /[gimsuy]/.test(source[i])) i++;
              tokens.push({ type: "regex", value: source.slice(start, i), line: sl, col: sc });
              lastNonWsType = "regex";
              lastNonWsValue = tokens[tokens.length - 1].value;
              continue;
            }
            if (i + 2 < len && OPS3[source.slice(i, i + 3)]) {
              tokens.push({ type: "punct", value: source.slice(i, i + 3), line: sl, col: sc });
              i += 3;
            } else if (i + 1 < len && OPS2[source.slice(i, i + 2)]) {
              tokens.push({ type: "punct", value: source.slice(i, i + 2), line: sl, col: sc });
              i += 2;
            } else if (OPS1[ch]) {
              tokens.push({ type: "punct", value: ch, line: sl, col: sc });
              i++;
            } else {
              tokens.push({ type: "unknown", value: ch, line: sl, col: sc });
              i++;
            }
            var last = tokens[tokens.length - 1];
            lastNonWsType = last.type;
            lastNonWsValue = last.value;
          }
          return tokens;
        }
        function isExprEnd(type, value) {
          if (type === "ident" || type === "number" || type === "string" || type === "regex" || type === "blocked") return true;
          if (type === "keyword" && (value === "true" || value === "false" || value === "null" || value === "undefined")) return true;
          if (type === "punct" && (value === ")" || value === "]")) return true;
          return false;
        }
        function validate(source) {
          var tokens = tokenize(source);
          var errors = [];
          var lastNonWs = null;
          for (var i = 0; i < tokens.length; i++) {
            var t = tokens[i];
            if (t.type === "blocked") {
              errors.push({ message: "Blocked identifier: " + t.value, line: t.line, col: t.col });
            }
            if (t.type === "blocked_kw") {
              errors.push({ message: "Blocked keyword: " + t.value, line: t.line, col: t.col });
            }
            if (t.type === "template") {
              errors.push({ message: "Template literals not allowed (use string concatenation)", line: t.line, col: t.col });
            }
            if (t.type === "unknown") {
              errors.push({ message: "Unexpected character: " + t.value, line: t.line, col: t.col });
            }
            if (t.type === "punct" && t.value === "[" && lastNonWs && isExprEnd(lastNonWs.type, lastNonWs.value)) {
              errors.push({
                message: "Bracket property access not allowed \u2014 use __at(obj, key) to read, __set(obj, key, val) to write",
                line: t.line,
                col: t.col
              });
            }
            if (t.type === "punct" && t.value === "*" && lastNonWs && lastNonWs.type === "keyword" && lastNonWs.value === "function") {
              errors.push({ message: "Generator functions not allowed", line: t.line, col: t.col });
            }
            lastNonWs = t;
          }
          return errors.length ? { ok: false, errors } : { ok: true };
        }
        function makeAt() {
          return function __at(obj, key) {
            if (obj == null) throw new TypeError("Cannot read property " + String(key) + " of " + String(obj));
            if (typeof key === "string" && BLOCKED_PROPS[key]) return void 0;
            return obj[key];
          };
        }
        function makeSet() {
          return function __set(obj, key, val) {
            if (obj == null) throw new TypeError("Cannot set property " + String(key) + " of " + String(obj));
            if (typeof key === "string" && BLOCKED_PROPS[key]) throw new TypeError("Cannot access blocked property: " + String(key));
            obj[key] = val;
            return val;
          };
        }
        function sanitize(obj) {
          return _sanitize(obj, /* @__PURE__ */ new Map());
        }
        function _sanitize(obj, seen) {
          if (obj === null || obj === void 0) return obj;
          if (typeof obj !== "object") return obj;
          if (seen.has(obj)) return seen.get(obj);
          if (Array.isArray(obj)) {
            var arr = [];
            seen.set(obj, arr);
            for (var i = 0; i < obj.length; i++) arr[i] = _sanitize(obj[i], seen);
            return arr;
          }
          var clean = /* @__PURE__ */ Object.create(null);
          seen.set(obj, clean);
          var keys = Object.keys(obj);
          for (var k = 0; k < keys.length; k++) clean[keys[k]] = _sanitize(obj[keys[k]], seen);
          return clean;
        }
        function buildShadowList(exclude) {
          var all = /* @__PURE__ */ Object.create(null);
          SHADOW_STATIC.forEach(function(n) {
            all[n] = 1;
          });
          try {
            var g = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : null;
            if (g) Object.getOwnPropertyNames(g).forEach(function(n) {
              all[n] = 1;
            });
          } catch (e) {
          }
          delete all["__at"];
          delete all["__set"];
          delete all["__lc"];
          delete all["eval"];
          delete all["arguments"];
          if (exclude) exclude.forEach(function(n) {
            delete all[n];
          });
          return Object.keys(all).filter(function(n) {
            return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(n);
          });
        }
        function compile(source, opts) {
          opts = opts || {};
          var result = validate(source);
          if (!result.ok) {
            var msg = "SafeJS validation failed:\n" + result.errors.map(function(e) {
              return "  Line " + e.line + ":" + e.col + " \u2014 " + e.message;
            }).join("\n");
            var err = new SyntaxError(msg);
            err.errors = result.errors;
            throw err;
          }
          var loopLimit = opts.loopLimit || 1e6;
          var __at = makeAt();
          var __set = makeSet();
          return function safeFunction(scope) {
            scope = scope || {};
            var scopeKeys = Object.keys(scope);
            var shadowList = buildShadowList(scopeKeys);
            var params = ["__at", "__set"].concat(scopeKeys);
            var body = '"use strict";\n';
            for (var s = 0; s < shadowList.length; s += 50) {
              body += "var " + shadowList.slice(s, s + 50).join(", ") + ";\n";
            }
            body += "var __lc = 0;\n";
            body += "function __loop() { if (++__lc > " + loopLimit + ') throw new RangeError("Loop limit exceeded (' + loopLimit + ' iterations)"); }\n\n';
            body += source + "\n";
            var fn;
            try {
              fn = new (Function.prototype.bind.apply(
                Function,
                [null].concat(params, [body])
              ))();
            } catch (e) {
              throw new SyntaxError("SafeJS compile error: " + e.message);
            }
            var args = [__at, __set];
            for (var k = 0; k < scopeKeys.length; k++) {
              var val = scope[scopeKeys[k]];
              if (typeof val === "function") args.push(val);
              else if (val !== null && typeof val === "object") args.push(sanitize(val));
              else args.push(val);
            }
            return fn.apply(null, args);
          };
        }
        function run(source, scope, opts) {
          return compile(source, opts)(scope);
        }
        var SafeJS = {
          validate,
          compile,
          run,
          sanitize,
          tokenize,
          BLOCKED,
          BLOCKED_KW,
          BLOCKED_PROPS,
          version: "0.1.0"
        };
        if (typeof module !== "undefined" && module.exports) {
          module.exports = SafeJS;
        }
        if (root) root.SafeJS = SafeJS;
      })(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : void 0);
    }
  });

  // safescript-upstream/index.js
  var require_index = __commonJS({
    "safescript-upstream/index.js"(exports, module) {
      var parser = require_parse();
      var validator = require_validate();
      var compiler = require_compile();
      var runtime = require_runtime();
      var header = require_header();
      var debugModule = require_debug();
      var journalModule = require_journal();
      var protocolModule = require_debug_protocol();
      var _libs = /* @__PURE__ */ Object.create(null);
      var _typeNames = /* @__PURE__ */ Object.create(null);
      var SafeScript = {
        /**
         * Compile SafeScript source to JavaScript.
         * Returns { code, ast, hash }.
         * Throws SyntaxError on invalid input.
         */
        compile: function(source) {
          return compiler.compile(source);
        },
        /**
         * Compile and run SafeScript source with the given scope.
         *
         * Two calling conventions:
         *   run(source, scope?, opts?)  — source is a string
         *   run(bundle)                 — bundle is { source, scope } from load()
         *
         * @param {string|Object} source - SafeScript source code, or a bundle from load()
         * @param {Object} [scope] - Capabilities to inject (e.g. { Date, fetch })
         * @param {Object} [opts]  - Options { timeout: 0 }
         * @returns {Promise<*>} A Promise resolving to the return value of the SafeScript code
         */
        run: function(source, scope, opts) {
          var parsedHeader = null;
          if (typeof source === "object" && source !== null && typeof source.source === "string") {
            opts = scope;
            scope = source.scope;
            parsedHeader = source.header || null;
            source = source.source;
          }
          if (!parsedHeader) {
            parsedHeader = header.parseHeader(source);
          }
          var runOpts = opts || {};
          runOpts.header = parsedHeader;
          var compiled = compiler.compile(source);
          var fn = runtime.buildFunction(compiled.code, scope, runOpts);
          return fn();
        },
        /**
         * Validate SafeScript source without compiling.
         * Returns { ok: boolean, errors: Array|null }.
         */
        validate: function(source) {
          try {
            var ast = parser.parse(source);
            return validator.validate(ast);
          } catch (e) {
            return {
              ok: false,
              errors: [{ message: e.message, line: e.line, col: e.col }]
            };
          }
        },
        /**
         * Parse SafeScript source to AST.
         * Throws SyntaxError on invalid input.
         */
        parse: function(source) {
          return parser.parse(source);
        },
        /**
         * Deep-copy an object to null-prototype objects.
         * Functions pass through (trusted API).
         */
        sanitize: function(obj) {
          return runtime.sanitize(obj);
        },
        /**
         * Parse .safe file header for capability declarations.
         * Returns { version, env, needs: [{name, type}], uses: [{name, type}], types: [{name, methods}] }.
         */
        capabilities: function(source) {
          return header.parseHeader(source);
        },
        /**
         * Check whether a scope satisfies a .safe file's @needs declarations.
         * Returns { ok: boolean, missing: string[] }.
         */
        checkScope: function(source, scope) {
          var caps = header.parseHeader(source);
          return header.checkScope(caps, scope);
        },
        /**
         * Load a .safe file: parse header, resolve capabilities, validate @needs.
         * Returns a Promise that resolves to a bundle { source, scope } you can
         * pass to run(). The resolver may be sync or async.
         *
         * @param {string} source - SafeScript source (with optional header)
         * @param {Function} [resolver] - function(caps) → scope object or Promise<scope>
         * @returns {Promise<{source: string, scope: Object}>} A bundle for run()
         */
        load: function(source, resolver) {
          var caps = header.parseHeader(source);
          var resolved = resolver ? resolver(caps) : {};
          return Promise.resolve(resolved).then(function(scope) {
            scope = scope || {};
            if (caps.needs) {
              for (var i = 0; i < caps.needs.length; i++) {
                var name = caps.needs[i].name;
                if (!(name in scope) && name in _libs) {
                  scope[name] = _libs[name];
                }
              }
            }
            if (caps.uses) {
              for (var j = 0; j < caps.uses.length; j++) {
                var uname = caps.uses[j].name;
                if (!(uname in scope) && uname in _libs) {
                  scope[uname] = _libs[uname];
                }
              }
            }
            var check = header.checkScope(caps, scope);
            if (!check.ok) {
              throw new Error("Missing capabilities: " + check.missing.join(", "));
            }
            if (caps.types) {
              for (var k = 0; k < caps.types.length; k++) {
                var typeDef = caps.types[k];
                var ctor = _typeNames[typeDef.name];
                if (!ctor) {
                  var regTypes = runtime.getRegisteredTypes();
                  for (var ri = 0; ri < regTypes.length; ri++) {
                    if (regTypes[ri].name === typeDef.name) {
                      ctor = regTypes[ri].ctor;
                      break;
                    }
                  }
                }
                if (!ctor) {
                  throw new Error('SafeScript: @type "' + typeDef.name + `" is not registered. Register with SafeScript.lib('` + typeDef.name + "', Constructor, { allowMethods: [...] })");
                }
                var typeConfig = runtime.getTypeConfig(ctor);
                if (!typeConfig) {
                  throw new Error('SafeScript: @type "' + typeDef.name + '" constructor is registered by name but has no type config');
                }
                var hostMethods = typeConfig.allowMethods || [];
                for (var mi = 0; mi < typeDef.methods.length; mi++) {
                  var dm = typeDef.methods[mi];
                  if (hostMethods.indexOf(dm) === -1) {
                    throw new Error('SafeScript: @type "' + typeDef.name + '" declares method "' + dm + '" but host does not allow it. Allowed: ' + hostMethods.join(", "));
                  }
                }
              }
            }
            return { source, scope, header: caps };
          });
        },
        /**
         * Register a named library or a type whitelist.
         *
         * Two forms:
         *   lib(name, value)         — register a named library (matches @needs <name>)
         *   lib(Constructor, config) — register type whitelist: { allowMethods: ['m1', 'm2'] }
         *
         * Type registration controls which methods SafeScript code can call on
         * instances returned from host functions. Unregistered types block all
         * method calls (sandbox violation).
         *
         * @param {string|Function} nameOrCtor - Library name or constructor function
         * @param {*} value - Library value, or config object with allowMethods
         */
        lib: function(nameOrCtor, value) {
          if (typeof nameOrCtor === "string" && nameOrCtor && typeof value === "function") {
            var config = arguments[2];
            if (!config || !Array.isArray(config.allowMethods)) {
              throw new Error("SafeScript.lib: three-arg form requires config with allowMethods array");
            }
            _typeNames[nameOrCtor] = value;
            runtime.registerType(value, config);
            return;
          }
          if (typeof nameOrCtor === "function") {
            runtime.registerType(nameOrCtor, value);
            return;
          }
          if (typeof nameOrCtor !== "string" || !nameOrCtor) {
            throw new Error("SafeScript.lib: first argument must be a non-empty string or a constructor function");
          }
          _libs[nameOrCtor] = value;
        },
        /**
         * Unregister a previously registered library or type.
         */
        unlib: function(nameOrCtor) {
          if (typeof nameOrCtor === "function") {
            var names = Object.keys(_typeNames);
            for (var i = 0; i < names.length; i++) {
              if (_typeNames[names[i]] === nameOrCtor) {
                delete _typeNames[names[i]];
              }
            }
            runtime.unregisterType(nameOrCtor);
            return;
          }
          if (_typeNames[nameOrCtor]) {
            runtime.unregisterType(_typeNames[nameOrCtor]);
            delete _typeNames[nameOrCtor];
            return;
          }
          delete _libs[nameOrCtor];
        },
        /**
         * List registered library names.
         */
        libs: function() {
          return Object.keys(_libs);
        },
        /**
         * Clear all type registrations (both constructor whitelists and named type mappings).
         */
        clearTypeRegistry: function() {
          runtime.clearTypeRegistry();
          var names = Object.keys(_typeNames);
          for (var i = 0; i < names.length; i++) {
            delete _typeNames[names[i]];
          }
        },
        /**
         * v2.0: Start a debug session.
         *
         * Compiles the source in debug mode (with __dbg checkpoints after every
         * statement), creates a DebugSession, and begins execution. The execution
         * pauses at breakpoints and can be controlled via the returned session.
         *
         * @param {string} source - SafeScript source code
         * @param {Object} scope - Capabilities to inject
         * @param {Object} [opts] - Debug options
         * @param {Function} [opts.onPause] - Called when paused at a breakpoint
         * @param {Function} [opts.onStep] - Called after each statement
         * @param {Function} [opts.onFinish] - Called when execution completes
         * @param {Function} [opts.onError] - Called on runtime error
         * @param {Array<number>} [opts.breakpoints] - Initial breakpoint lines
         * @param {boolean} [opts.captureAllLocals] - Capture locals at every step
         * @param {number} [opts.timeout] - Execution timeout in ms
         * @param {number} [opts.maxOps] - Max operations
         * @returns {DebugSession}
         */
        debug: function(source, scope, opts) {
          opts = opts || {};
          if (!opts.legacy) return require_continuation_debug().debug(source, scope, opts);
          var session = new debugModule.DebugSession({
            onPause: opts.onPause,
            onStep: opts.onStep,
            onFinish: opts.onFinish,
            onError: opts.onError,
            onCommit: opts.onCommit,
            onLog: opts.onLog,
            breakpoints: opts.breakpoints,
            captureAllLocals: opts.captureAllLocals,
            pauseOn: opts.pauseOn
          });
          var parsedHeader = header.parseHeader(source);
          var compiled = compiler.compile(source, { debug: true });
          var runOpts = {
            timeout: opts.timeout || 0,
            maxOps: opts.maxOps,
            header: parsedHeader,
            debugSession: session,
            rawReturn: true,
            // debug mode returns raw values
            dom: opts.dom,
            allowNew: opts.allowNew
          };
          var fn = runtime.buildFunction(compiled.code, scope, runOpts);
          session._compileFn = function(src) {
            return compiler.compile(src);
          };
          var protocol = null;
          if (opts.driver) {
            protocol = new protocolModule.DebugProtocol(session, opts.driver);
            protocol.setCompileTail(require_compile().compileTail);
            session.protocol = protocol;
          }
          var promise = fn();
          promise.then(
            function(v) {
              session.state = "finished";
              session.onFinish(v);
            },
            function(e) {
              if (e.message !== "SafeScript: debug session stopped") {
                session.state = "finished";
                session.onError(e);
              }
            }
          );
          return session;
        },
        /**
         * v2.0: DebugSession class (exported for advanced use).
         */
        DebugSession: debugModule.DebugSession,
        ResumableDebugSession: require_continuation_debug().Session,
        compileContinuations: require_continuation_compiler().compile,
        /**
         * v2.0: Journal class (exported for advanced use).
         */
        Journal: journalModule.Journal,
        /**
         * v2.0: Debug protocol — pluggable transport for driving debug sessions.
         */
        DebugProtocol: protocolModule.DebugProtocol,
        InProcessDriver: protocolModule.InProcessDriver,
        PostMessageDriver: protocolModule.PostMessageDriver,
        PortDriver: protocolModule.PortDriver,
        DEBUG_COMMANDS: protocolModule.COMMANDS,
        DEBUG_EVENTS: protocolModule.EVENTS,
        /**
         * v2.0: compileTail for edit-and-continue.
         */
        compileTail: require_compile().compileTail,
        /**
         * v2.0: Web Worker transport.
         * createWorkerProxy(worker, opts) — main-thread proxy for worker debug session.
         * runInWorker(self, source, scope, opts) — run debug session inside a Worker.
         */
        createWorkerProxy: require_worker().createWorkerProxy,
        runInWorker: require_worker().runInWorker,
        DebugProxy: require_worker().DebugProxy,
        /**
         * v0.1 compatibility: wrap mode (linter + global shadowing).
         * For quick demos. Use compile() + run() in production.
         */
        wrap: function(source, scope) {
          var SafeJS;
          try {
            SafeJS = require_safe();
          } catch (e) {
          }
          if (SafeJS && SafeJS.run) {
            return SafeJS.run(source, scope);
          }
          return SafeScript.run(source, scope);
        }
      };
      SafeScript.types = {
        SafeDOMDocument: "SafeDOMDocument",
        SafeHTMLElement: "SafeHTMLElement",
        SafeWindow: "SafeWindow",
        SafeConsole: "SafeConsole",
        SafeObservers: "SafeObservers",
        SafeCanvas: "SafeCanvas",
        SafeMedia: "SafeMedia",
        SafeNavigation: "SafeNavigation"
      };
      SafeScript.resolveUses = header.resolveUses;
      module.exports = SafeScript;
    }
  });
  return require_index();
})();
