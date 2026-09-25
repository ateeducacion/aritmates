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
  'no-unused-vars': 'off',
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
    files: ['playwright.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: correctness,
  },
];
