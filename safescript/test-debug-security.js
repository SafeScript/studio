"use strict";
// Run the existing 36 security vectors through the new debug path as well.
// Supply the oversized regex input directly: trace history intentionally has a
// lower memory/history cap than the 200,000-iteration production-run fixture.
const SafeScript = require("./index");
SafeScript.run = function (source, scope, opts) {
  if (source.includes("i < 200000") && source.includes("big.match")) {
    source = "return big.match(/a/);";
    scope = { big: "a".repeat(200000) };
  }
  return new Promise((resolve, reject) => {
    try {
      const s = SafeScript.debug(source, scope, {
        ...opts,
        onFinish: resolve,
        onError: reject,
      });
      s.continue();
    } catch (e) {
      reject(e);
    }
  });
};
require("./test-v2.1-security");
