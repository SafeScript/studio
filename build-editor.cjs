const fs = require("fs"),
  path = require("path"),
  esbuild = require("esbuild");
const root = __dirname,
  engine = path.resolve(process.argv[2] || path.join(root, "safescript"));
(async () => {
  const built = await esbuild.build({
    entryPoints: [path.join(engine, "index.js")],
    bundle: true,
    write: false,
    format: "iife",
    globalName: "SafeScript",
    platform: "browser",
    target: "es2020",
    external: ["crypto"],
    logLevel: "warning",
  });
  const runtime = built.outputFiles[0].text.replace(
    /<\/script/gi,
    "<\\/script",
  );
  let shell = fs.readFileSync(path.join(root, "src/editor-shell.html"), "utf8");
  shell = shell
    .replace(
      "<!-- SAFESCRIPT_RUNTIME -->",
      "<script>/* SafeScript resumable debugging — generated from included sources */\n" +
        runtime +
        "</script>",
    )
    .replace(
      "<!-- DEBUGGER_STYLES -->",
      "<style>" +
        fs.readFileSync(path.join(root, "src/debugger-ui.css"), "utf8") +
        "</style>",
    )
    .replace(
      "/* DEBUGGER_UI */",
      fs.readFileSync(path.join(root, "src/debugger-ui.js"), "utf8"),
    );
  for (const name of ["index.html", "safe-studio-standalone.html"])
    fs.writeFileSync(path.join(root, name), shell);
  console.log("Built both editor entry points from " + engine);
})();
