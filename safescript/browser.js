/** Build the browser API from the same modules as Node. */
'use strict';
const esbuild = require('esbuild');
const path = require('path');
const result = esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'index.js')],
  bundle: true,
  write: false,
  format: 'iife',
  globalName: 'SafeScript',
  platform: 'browser',
  target: 'es2020',
  external: ['crypto'],
  minify: process.argv.includes('--minify')
});
process.stdout.write(result.outputFiles[0].text);
