const fs = require("fs"),
  path = require("path"),
  { spawn } = require("child_process");
const engine = path.resolve(
  process.argv[2] || path.join(__dirname, "../safescript"),
);
const dest = path.join(__dirname, "../artifacts/engine-regressions");
fs.mkdirSync(dest, { recursive: true });
const files = fs
  .readdirSync(engine)
  .filter((n) => /^test.*\.js$/.test(n) && n !== "test-browser.js")
  .sort();
let index = 0;
const suites = [];
async function worker() {
  while (index < files.length) {
    const file = files[index++];
    await new Promise((resolve) => {
      const child = spawn(process.execPath, [file], {
        cwd: engine,
        env: process.env,
      });
      let output = "";
      const timer = setTimeout(() => child.kill("SIGTERM"), 90000);
      child.stdout.on("data", (d) => (output += d));
      child.stderr.on("data", (d) => (output += d));
      child.on("exit", (code, signal) => {
        clearTimeout(timer);
        fs.writeFileSync(path.join(dest, file + ".log"), output);
        const suite = {
          name: file,
          ok: code === 0,
          exitCode: code,
          signal,
          checks: (output.match(/✓|^OK /gm) || []).length,
        };
        suites.push(suite);
        console.log(suite.ok ? "PASS" : "FAIL", file, suite.checks, "checks");
        resolve();
      });
    });
  }
}
(async () => {
  await Promise.all(Array.from({ length: 4 }, worker));
  const report = {
    suites,
    passed: suites.filter((s) => s.ok).length,
    failed: suites.filter((s) => !s.ok).length,
  };
  fs.writeFileSync(
    path.join(dest, "results.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
  process.exitCode = report.failed ? 1 : 0;
})();
