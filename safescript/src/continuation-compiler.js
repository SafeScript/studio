/** Debug-only native JavaScript continuations. No AST is interpreted at runtime. */
"use strict";
var parser = require("./parse");
var validator = require("./validate");
var defs = require("./defs");
var nextNode = 1;
function canonical(n) {
  return JSON.stringify(n, function (k, v) {
    return /^(loc|_cid)$/.test(k) ? undefined : v;
  });
}
function shape(n) {
  if (!n) return "";
  if (n.type === "FunctionDeclaration")
    return n.type + ":" + (n.id && n.id.name);
  if (n.type === "VariableDeclaration")
    return (
      n.type +
      ":" +
      canonical(
        n.declarations.map(function (d) {
          return d.id;
        }),
      )
    );
  return n.type;
}
function align(old, fresh) {
  if (!fresh || typeof fresh !== "object") return;
  if (Array.isArray(fresh)) {
    old = Array.isArray(old) ? old : [];
    var used = new Set(),
      matches = new Map();
    // Exact matches first; preserves statement identities through insertions.
    fresh.forEach(function (n, i) {
      var k = canonical(n);
      for (var j = 0; j < old.length; j++)
        if (!used.has(j) && canonical(old[j]) === k) {
          used.add(j);
          matches.set(i, j);
          break;
        }
    });
    fresh.forEach(function (n, i) {
      if (matches.has(i)) return;
      var candidates = [];
      for (var j = 0; j < old.length; j++)
        if (!used.has(j) && shape(old[j]) === shape(n)) candidates.push(j);
      if (candidates.length === 1) {
        used.add(candidates[0]);
        matches.set(i, candidates[0]);
      }
    });
    fresh.forEach(function (n, i) {
      align(matches.has(i) ? old[matches.get(i)] : null, n);
    });
    return;
  }
  if (fresh.type)
    fresh._cid =
      (old && old.type === fresh.type && old._cid) || "n" + nextNode++;
  Object.keys(fresh).forEach(function (k) {
    if (k !== "_cid" && k !== "loc") align(old && old[k], fresh[k]);
  });
}
function compile(source, previous) {
  var ast = parser.parse(source),
    valid = validator.validate(ast);
  // Preserve the normal emitter's syntax constraints (e.g. duplicate lexical bindings).
  var checked = require("./compile").compile(source);
  var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  new AsyncFunction(checked.code);
  if (!valid.ok)
    throw new SyntaxError(
      valid.errors
        .map(function (e) {
          return e.message;
        })
        .join("; "),
    );
  align(previous && previous.ast, ast);
  var functions = {},
    nodes = {};
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (n._cid) nodes[n._cid] = n;
    Object.keys(n).forEach(function (k) {
      if (k !== "loc") walk(n[k]);
    });
  })(ast);
  function makeFunction(node) {
    var id = node._cid;
    if (functions[id]) return id;
    var code = [],
      labels = {},
      ids = {},
      counters = {},
      temp = 0;
    var info = {
      id: id,
      node: node,
      params: node.params || [],
      code: code,
      ids: ids,
      labels: labels,
      name:
        (node.id && node.id.name) ||
        (node.type === "Program" ? "event" : "anonymous"),
      vars: new Set(),
    };
    functions[id] = info;
    function emit(n, tag, body, meta) {
      var base = ((n && n._cid) || id) + ":" + tag,
        count = counters[base] || 0;
      counters[base] = count + 1;
      var key = base + ":" + count,
        instruction = {
          id: key,
          run: new Function("m", "f", body),
          meta: meta || null,
        };
      ids[key] = code.length;
      code.push(instruction);
      return code.length - 1;
    }
    function label(name) {
      labels[name] = code.length;
    }
    function unique(n) {
      var k = ((n && n._cid) || id) + ":temp",
        i = counters[k] || 0;
      counters[k] = i + 1;
      return k + ":" + i;
    }
    function jump(n, dest) {
      emit(n, "jump", "f.pc=f.fn.labels[" + JSON.stringify(dest) + "];");
    }
    function branch(n, expr, dest) {
      emit(
        n,
        "branch",
        "if(" + expr + ")f.pc=f.fn.labels[" + JSON.stringify(dest) + "];",
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
        "callee",
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
        "m.checkpoint(f," +
          JSON.stringify(n._cid) +
          "," +
          line(n) +
          "," +
          JSON.stringify(phase) +
          ");",
        { nodeId: n._cid, line: line(n), phase: phase },
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
        p.elements.forEach(function (x) {
          names(x, out);
        });
      if (p.properties)
        p.properties.forEach(function (x) {
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
        n.declarations.forEach(function (d) {
          names(d.id, info.vars);
        });
      Object.keys(n).forEach(function (k) {
        var v = n[k];
        if (k === "loc" || k === "_cid") return;
        if (Array.isArray(v))
          v.forEach(function (x) {
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
          "f.s.push(" + val(n.property.name || n.property.value) + ");",
        );
      emit(
        n,
        "ref",
        "var k=f.s.pop(),o=f.s.pop();f.s.push(m.property(o,k," +
          !!n.optional +
          "));",
      );
    }
    function bind(p, kind, declare) {
      // Defaults are lowered as continuations too, so function calls in defaults can pause.
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
          "m.bind(f," +
            val(p.name) +
            ",f.s.pop()," +
            val(kind) +
            "," +
            !!declare +
            ");",
        );
        return;
      }
      if (p.type === "RestElement") return bind(p.argument, kind, declare);
      var tmp = unique(p);
      emit(p, "destructure", "f.t[" + val(tmp) + "]=f.s.pop();");
      if (p.type === "ArrayPattern")
        p.elements.forEach(function (el, i) {
          if (!el) return;
          emit(
            el,
            "item",
            "f.s.push(" +
              (el.type === "RestElement"
                ? "Array.from(f.t[" + val(tmp) + "]).slice(" + i + ")"
                : "m.at(f.t[" + val(tmp) + "]," + i + ")") +
              ");",
          );
          bind(el.type === "RestElement" ? el.argument : el, kind, declare);
        });
      else if (p.type === "ObjectPattern") {
        var keys = [];
        p.properties.forEach(function (prop) {
          if (prop.type === "RestElement") {
            emit(
              prop,
              "rest",
              "f.s.push(m.rest(f.t[" +
                val(tmp) +
                "]," +
                JSON.stringify(keys) +
                "));",
            );
            bind(prop.argument, kind, declare);
            return;
          }
          if (prop.computed)
            throw new SyntaxError(
              "Computed binding keys are not in the SafeScript parser grammar",
            );
          var key = prop.key.name || prop.key.value;
          keys.push(key);
          emit(
            prop,
            "item",
            "f.s.push(m.at(f.t[" + val(tmp) + "]," + val(key) + "));",
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
            "f.s.push(" +
              (n.regex
                ? n.raw
                : n.raw && /^\//.test(n.raw)
                  ? n.raw
                  : val(n.value) === undefined
                    ? "undefined"
                    : val(n.value)) +
              ");",
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
            "f.s.push(m.closure(f," +
              val(makeFunction(n)) +
              "," +
              (n.type === "ArrowFunctionExpression") +
              "));",
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
          n.arguments.forEach(function (a) {
            expr(a.type === "SpreadElement" ? a.argument : a);
            emit(
              a,
              "arg",
              a.type === "SpreadElement"
                ? "var v=f.s.pop();f.s[f.s.length-1].push(...v);"
                : "var v=f.s.pop();f.s[f.s.length-1].push(v);",
            );
          });
          emit(
            n,
            "call",
            "var a=f.s.pop(),c=f.s.pop();return m.invoke(f,c,a," +
              (n.type === "NewExpression") +
              ");",
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
              "var v=f.s.pop(),r=f.s.pop();m.write(r,v);f.s.push(v);",
            );
          } else {
            emit(n, "readref", "f.s.push(m.read(f.s[f.s.length-1]));");
            if (["&&=", "||=", "??="].indexOf(n.operator) >= 0) {
              end = unique(n);
              other = unique(n);
              var cond =
                n.operator === "&&="
                  ? "!v"
                  : n.operator === "||="
                    ? "!!v"
                    : "v!=null";
              emit(
                n,
                "logicalassign",
                "var v=f.s[f.s.length-1];if(" +
                  cond +
                  "){var r=f.s.pop();f.s.pop();f.s.push(r);f.pc=f.fn.labels[" +
                  val(end) +
                  "];}else f.s.pop();",
              );
              expr(n.right);
              emit(
                n,
                "assign",
                "var v=f.s.pop(),r=f.s.pop();m.write(r,v);f.s.push(v);",
              );
              label(end);
            } else {
              expr(n.right);
              emit(
                n,
                "compound",
                "var b=f.s.pop(),a=f.s.pop(),r=f.s.pop(),v=a " +
                  n.operator.slice(0, -1) +
                  " b;m.write(r,v);f.s.push(v);",
              );
            }
          }
          break;
        case "UpdateExpression":
          ref(n.argument);
          emit(
            n,
            "update",
            "var r=f.s.pop(),v=Number(m.read(r)),w=v" +
              (n.operator === "++" ? "+1" : "-1") +
              ";m.write(r,w);f.s.push(" +
              (n.prefix ? "w" : "v") +
              ");",
          );
          break;
        case "BinaryExpression":
          expr(n.left);
          expr(n.right);
          emit(
            n,
            "binary",
            "var b=f.s.pop(),a=f.s.pop();f.s.push(a " + n.operator + " b);",
          );
          break;
        case "LogicalExpression":
          end = unique(n);
          expr(n.left);
          emit(
            n,
            "logical",
            "var v=f.s[f.s.length-1];if(" +
              (n.operator === "&&"
                ? "!v"
                : n.operator === "||"
                  ? "!!v"
                  : "v!=null") +
              ")f.pc=f.fn.labels[" +
              val(end) +
              "];else f.s.pop();",
          );
          expr(n.right);
          label(end);
          break;
        case "UnaryExpression":
          if (n.operator === "typeof" && n.argument.type === "Identifier")
            emit(
              n,
              "typeof",
              "f.s.push(m.typeofName(f," + val(n.argument.name) + "));",
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
          n.expressions.forEach(function (x, i) {
            expr(x);
            if (i < n.expressions.length - 1) emit(x, "drop", "f.s.pop();");
          });
          break;
        case "ArrayExpression":
          emit(n, "array", "f.s.push([]);");
          n.elements.forEach(function (x) {
            if (!x) {
              emit(n, "hole", "f.s[f.s.length-1].length++;");
              return;
            }
            expr(x.type === "SpreadElement" ? x.argument : x);
            emit(
              x,
              "arrayitem",
              x.type === "SpreadElement"
                ? "var v=f.s.pop();f.s[f.s.length-1].push(...v);"
                : "var v=f.s.pop();f.s[f.s.length-1].push(v);",
            );
          });
          break;
        case "ObjectExpression":
          emit(n, "object", "f.s.push(Object.create(null));");
          n.properties.forEach(function (p) {
            if (p.type === "SpreadElement") {
              expr(p.argument);
              emit(
                p,
                "spread",
                "var v=f.s.pop();m.assign(f.s[f.s.length-1],v);",
              );
              return;
            }
            if (p.computed) expr(p.key);
            else
              emit(
                p,
                "key",
                "f.s.push(" + val(p.key.name || p.key.value) + ");",
              );
            expr(p.value);
            emit(
              p,
              "prop",
              "var v=f.s.pop(),k=f.s.pop();m.set(f.s[f.s.length-1],k,v);",
            );
          });
          break;
        default:
          throw new SyntaxError("Debug compiler does not support " + n.type);
      }
    }
    function sequence(block, ctx, scope) {
      if (scope) emit(block, "scope", "m.enter(f);");
      // Lexical names are declared on scope entry, with real TDZ semantics.
      (block.body || []).forEach(function (n) {
        if (n.type === "VariableDeclaration" && n.kind !== "var")
          n.declarations.forEach(function (d) {
            var ns = new Set();
            names(d.id, ns);
            ns.forEach(function (name) {
              emit(
                d,
                "declare",
                "m.declare(f," + val(name) + "," + val(n.kind) + ");",
              );
            });
          });
      });
      (block.body || []).forEach(function (n) {
        if (n.type === "FunctionDeclaration")
          emit(
            n,
            "hoist",
            "m.bind(f," +
              val(n.id.name) +
              ",m.closure(f," +
              val(makeFunction(n)) +
              ',false),"function",true);',
          );
      });
      (block.body || []).forEach(function (n) {
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
          n.declarations.forEach(function (d) {
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
            'm.abrupt(f,{kind:"return",value:f.t[' + val(slot) + "]});",
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
              n.init.declarations.forEach(function (d) {
                if (n.init.kind !== "var") {
                  var ns = new Set();
                  names(d.id, ns);
                  ns.forEach(function (name) {
                    emit(
                      d,
                      "declare",
                      "m.declare(f," +
                        val(name) +
                        "," +
                        val(n.init.kind) +
                        ");",
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
            label: ctx.nextLabel,
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
            "f.t[" +
              val(slot) +
              "]=" +
              (n.type === "ForOfStatement"
                ? "Array.from(f.s.pop())"
                : "m.keys(f.s.pop())") +
              ";f.t[" +
              val(iter) +
              "]=0;",
          );
          label(top);
          check(n, "before");
          branch(
            n,
            "f.t[" + val(iter) + "]>=f.t[" + val(slot) + "].length",
            end,
          );
          emit(
            n,
            "iteration",
            "m.enter(f);f.s.push(f.t[" +
              val(slot) +
              "][f.t[" +
              val(iter) +
              "]++]);",
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
            label: ctx.nextLabel,
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
          var target = ctx,
            want = n.type === "BreakStatement" ? "break" : "continue";
          while (
            target &&
            (!target[want] || (n.label && target.label !== n.label.name))
          )
            target = target.parent;
          if (!target) throw new SyntaxError("Invalid " + want);
          emit(
            n,
            "abrupt",
            'm.abrupt(f,{kind:"jump",target:' +
              val(target[want]) +
              ",scope:m.labelScope(f," +
              val(target[want]) +
              ")});",
          );
          break;
        case "LabeledStatement":
          var targetEnd = unique(n);
          stmt(n.body, {
            break: targetEnd,
            parent: ctx,
            label: n.label.name,
            nextLabel: n.label.name,
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
            "f.handlers.push({catchLabel:" +
              val(alt) +
              ",finallyLabel:" +
              val(finallyLabel) +
              ",end:" +
              val(end) +
              ',env:f.env,depth:f.s.length,status:"try"});',
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
          var cases = n.cases.map(function () {
              return unique(n);
            }),
            fallback = end;
          n.cases.forEach(function (c, i) {
            if (!c.test) {
              fallback = cases[i];
              return;
            }
            expr(c.test);
            branch(c, "f.s.pop()===f.t[" + val(slot) + "]", cases[i]);
          });
          jump(n, fallback);
          n.cases.forEach(function (c, i) {
            label(cases[i]);
            c.consequent.forEach(function (x) {
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
    // Parameter binding is part of the function's resumable prologue.
    if (node.type !== "Program")
      node.params.forEach(function (p, i) {
        emit(
          p,
          "parameter",
          "f.s.push(" +
            (p.type === "RestElement"
              ? "f.args.slice(" + i + ")"
              : "f.args[" + i + "]") +
            ");",
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
    // Scope depth at jump targets is computed from emitted lexical scope operations.
    var depth = 0;
    info.scopeDepth = [];
    code.forEach(function (i, pc) {
      info.scopeDepth[pc] = depth;
      var s = i.run.toString();
      if (s.indexOf("m.enter(f)") >= 0) depth++;
      if (s.indexOf("m.leave(f)") >= 0) depth--;
    });
    return id;
  }
  var root = makeFunction(ast);
  return {
    source: source,
    ast: ast,
    functions: functions,
    root: root,
    nodes: nodes,
  };
}
exports.compile = compile;
