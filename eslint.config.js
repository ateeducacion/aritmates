/**
 * Correctness rules only. Style rules that would rewrite the math engine
 * (max-len, jsdoc, quote style) are intentionally absent.
 *
 * eqeqeq stays off: a lot of the engine compares numeric strings with ==
 * (`resultado == false`, user input). Forcing === would change behavior.
 */

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  history: 'readonly',
  console: 'readonly',
  fetch: 'readonly',
  alert: 'readonly',
  confirm: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  FormData: 'readonly',
  Blob: 'readonly',
  File: 'readonly',
  FileReader: 'readonly',
  Image: 'readonly',
  Event: 'readonly',
  CustomEvent: 'readonly',
  HTMLElement: 'readonly',
  customElements: 'readonly',
  MutationObserver: 'readonly',
  getComputedStyle: 'readonly',
  performance: 'readonly',
  localStorage: 'readonly',
  XMLHttpRequest: 'readonly',
  MouseEvent: 'readonly',
  ResizeObserver: 'readonly',
  DOMParser: 'readonly',
  CSS: 'readonly',
  global: 'readonly',
  sessionStorage: 'readonly',
  btoa: 'readonly',
  atob: 'readonly',
  $: 'readonly',
  jQuery: 'readonly',
  bootstrap: 'readonly',
  debug: 'writable',
};

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  global: 'writable',
  globalThis: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
};

const mochaGlobals = {
  describe: 'readonly',
  it: 'readonly',
  before: 'readonly',
  after: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  context: 'readonly',
  specify: 'readonly',
  require: 'readonly',
};

const correctness = {
  'no-undef': 'error',
  'no-unreachable': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-func-assign': 'error',
  'no-unsafe-negation': 'error',
  'valid-typeof': 'error',
  'no-redeclare': 'error',
  'no-constant-binary-expression': 'error',
  // Unused handler arguments (ev, index…) stay allowed in legacy code.
  'no-unused-vars': ['error', {args: 'none', caughtErrors: 'none'}],
  'eqeqeq': 'off',
};

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'documentos/**',
      'docs/**',
      'css/**',
      'testSelenium/**',
    ],
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: correctness,
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: correctness,
  },
  {
    files: ['test/**/*.js', 'e2e/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        ...mochaGlobals,
      },
    },
    rules: correctness,
  },
  {
    files: [
      'src/application/**/*.js',
      'src/components/**/*.js',
      'src/helpers.js',
      'src/operaciones/arithmetic.js',
      'src/operaciones/evaluate.js',
      'src/operaciones/expression.js',
      'src/operaciones/random.js',
      'src/operaciones/numberRules.js',
      'src/operaciones/factorization.js',
      'src/operaciones/operaciones.js',
      'src/operaciones/tipoNumero.js',
      'src/pdfLibs.js',
      'e2e/**/*.js',
    ],
    rules: {
      'no-unused-vars': ['error', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
      'no-console': ['error', {allow: ['warn', 'error']}],
    },
  },
  {
    files: [
      'src/operaciones/suma.js',
      'src/operaciones/resta.js',
      'src/operaciones/multiplicacion.js',
      'src/operaciones/division.js',
      'src/operaciones/divisionEntera.js',
      'src/operaciones/divisionResto.js',
      'src/operaciones/divisionDecimales.js',
      'src/generarExamen.js',
    ],
    rules: {
      'no-unused-vars': ['error', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
    },
  },
  {
    files: ['playwright.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: correctness,
  },
];
