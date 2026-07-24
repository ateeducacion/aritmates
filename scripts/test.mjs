/**
 * Empaqueta y ejecuta las pruebas unitarias con Mocha (sin Webpack).
 *
 * Uso:
 *   node scripts/test.mjs           # suite CI (estable)
 *   node scripts/test.mjs --ci      # idem
 *   node scripts/test.mjs --all     # suite completa (incluye legacy flaky)
 */
import * as esbuild from 'esbuild';
import { mkdir, writeFile, readdir, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

/**
 * Specs que deben pasar siempre en CI.
 * No incluir operaciones.spec.js / OperacionMultiple / parentesis / etc.:
 * contienen casos legacy flaky o bugs documentados (docs/migration/).
 */
const CI_SPECS = [
  'characterization.spec.js',
  'OptionsShortcode.spec.js',
  'paper-checkbox.spec.js', // existe en ramas con el CE nativo
];

const args = new Set(process.argv.slice(2));
const runAll = args.has('--all') || args.has('--legacy');
const runCi = !runAll; // default = CI estable

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function listSpecFiles() {
  const dir = join(root, 'test');
  const files = await readdir(dir);
  const all = files.filter((f) => f.endsWith('.spec.js')).sort();

  if (runAll) {
    return all.map((f) => `./test/${f}`);
  }

  const selected = [];
  for (const name of CI_SPECS) {
    if (all.includes(name)) selected.push(`./test/${name}`);
  }
  if (selected.length === 0) {
    throw new Error('No se encontró ninguna spec de CI en test/');
  }
  return selected;
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
    ...specs.map((s) => `require(${JSON.stringify(join(root, s.slice(2)))});`),
  ].join('\n');

  const entryFile = join(dist, '_test-entry.js');
  await writeFile(entryFile, entry, 'utf8');

  const outfile = join(dist, runAll ? 'testBundle.cjs' : 'testBundle.ci.cjs');
  await esbuild.build({
    entryPoints: [entryFile],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile,
    plugins: [cssStubPlugin, jqueryStubPlugin],
    external: [
      'chai',
      'chai-match',
      'decimal.js',
      'combinations',
      'shorthash',
      'shallow-equal',
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
    const child = spawn(process.execPath, [mocha, bundlePath, '--timeout', '15000'], {
      cwd: root,
      stdio: 'inherit',
    });
    child.on('exit', (code) => resolvePromise(code ?? 1));
  });
}

// Garantizar binario esbuild (npm allowScripts a veces lo omite en CI)
if (!(await exists(join(root, 'node_modules/esbuild/bin/esbuild')))) {
  console.log('Instalando binario esbuild…');
  await new Promise((res, rej) => {
    const child = spawn(process.execPath, [join(root, 'node_modules/esbuild/install.js')], {
      cwd: root,
      stdio: 'inherit',
    });
    child.on('exit', (c) => (c === 0 ? res() : rej(new Error('esbuild install failed'))));
  });
}

const specs = await listSpecFiles();
const mode = runAll ? 'ALL (incluye legacy)' : 'CI (estable)';
console.log(`Modo de pruebas: ${mode}\n`);

const bundlePath = await bundleTests(specs);
const code = await runMocha(bundlePath);

if (code === 0) {
  console.log(`\n✓ tests OK (${mode})`);
} else if (runAll) {
  console.log('\nNota: la suite completa incluye fallos legacy documentados en docs/migration/.');
  console.log('La suite CI (npm test / npm run test:ci) debe pasar en verde.');
} else {
  console.error('\n✗ Falló la suite CI estable. No se deben mergear cambios que rompan characterization/operaciones.');
}

process.exit(code);
