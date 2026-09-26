/**
 * Empaqueta y ejecuta las pruebas unitarias con Mocha (sin Webpack).
 *
 * Uso:
 *   node scripts/test.mjs
 *   node scripts/test.mjs --grep "suma"
 */
import * as esbuild from 'esbuild';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const args = process.argv.slice(2);

async function listSpecFiles() {
  const dir = join(root, 'test');
  const files = await readdir(dir);
  return files.filter((f) => f.endsWith('.spec.js')).sort().map((f) => `./test/${f}`);
}

const cssStubPlugin = {
  name: 'css-stub',
  setup(build) {
    build.onLoad({ filter: /\.(css|scss|sass)$/ }, () => ({
      contents: 'export default {};',
      loader: 'js',
    }));
  },
};

// jquery stub para Node: defaultOptions usa $.ajax al importar
const jqueryStubPlugin = {
  name: 'jquery-node-stub',
  setup(build) {
    build.onResolve({ filter: /^jquery$/ }, () => ({
      path: 'jquery-stub',
      namespace: 'jquery-stub',
    }));
    build.onLoad({ filter: /.*/, namespace: 'jquery-stub' }, () => ({
      contents: `
        const $ = (sel) => {
          const api = {
            ajax() {},
            on() { return api; },
            click() { return api; },
            ready(fn) { if (typeof fn === 'function') fn(); return api; },
            attr() { return api; },
            prop() { return api; },
            val() { return ''; },
            text() { return ''; },
            html() { return ''; },
            addClass() { return api; },
            removeClass() { return api; },
            toggleClass() { return api; },
            css() { return api; },
            find() { return api; },
            each() { return api; },
            length: 0,
            0: { dataset: {}, click() {}, value: '' },
          };
          return api;
        };
        $.ajax = function() {};
        $.fn = {};
        module.exports = $;
        module.exports.default = $;
      `,
      loader: 'js',
    }));
  },
};

async function bundleTests(specs) {
  await mkdir(dist, { recursive: true });
  const entry = [
    'global.debug = false;',
    'global.window = global;',
    "if (process.env.ARITMATES_TEST_VERBOSE !== '1') console.log = () => {};",
    // Legacy specs that do not inject `random` still need deterministic
    // generation. Configure the domain abstraction instead of monkey-patching
    // the runtime global Math.random.
    `const {seededRandom, setDefaultRandom} = require(${JSON.stringify(join(root, 'src/operaciones/random.js'))});`,
    'setDefaultRandom(seededRandom(1));',
    ...specs.map((s) => `require(${JSON.stringify(join(root, s.slice(2)))});`),
  ].join('\n');

  const entryFile = join(dist, '_test-entry.js');
  await writeFile(entryFile, entry, 'utf8');

  const outfile = join(dist, 'testBundle.cjs');
  await esbuild.build({
    entryPoints: [entryFile],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile,
    sourcemap: true,
    plugins: [cssStubPlugin, jqueryStubPlugin],
    external: [
      'chai',
      'chai-match',
      'decimal.js',
    ],
    define: {
      'process.env.NODE_ENV': '"test"',
    },
    logLevel: 'warning',
  });
  console.log(`✓ test bundle → ${outfile}`);
  console.log(`  specs (${specs.length}): ${specs.map((s) => s.replace('./test/', '')).join(', ')}`);
  return outfile;
}

function runMocha(bundlePath) {
  return new Promise((resolvePromise) => {
    const mocha = join(root, 'node_modules/mocha/bin/mocha.js');
    const child = spawn(process.execPath, [mocha, bundlePath, '--timeout', '15000', '--forbid-pending', '--forbid-only', ...args], {
      cwd: root,
      stdio: 'inherit',
    });
    child.on('exit', (code) => resolvePromise(code ?? 1));
  });
}

const specs = await listSpecFiles();
console.log(`Modo de pruebas: suite única (${specs.length} ficheros)\n`);

const bundlePath = await bundleTests(specs);
const code = await runMocha(bundlePath);

if (code === 0) {
  console.log('\n✓ tests OK');
} else {
  console.error('\n✗ Falló la suite.');
}

process.exit(code);
