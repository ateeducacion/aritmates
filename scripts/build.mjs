/**
 * Build estático de Aritmates.
 *
 * 1. Limpia dist
 * 2. Compila SCSS → CSS
 * 3. Empaqueta JS (esbuild) — justificado por Polymer/MDC/xy-ui con bare imports
 * 4. Copia HTML, plantillas, imágenes, config
 * 5. Copia fuentes
 * 6. Copia vendor UMD
 * 7. Verifica recursos
 *
 * Justificación técnica de esbuild:
 * Polymer 3, @material/*, @material/mwc-switch y xy-ui usan especificadores bare
 * (import 'lit', import '@polymer/...') que el navegador no resuelve sin import maps
 * exhaustivos de cientos de paquetes. Un único bundle IIFE es la opción más simple
 * y segura para preservar el 100 % del comportamiento sin Webpack/Babel.
 */
import { cp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { join, resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { copyVendor } from './copy-vendor.mjs';
import { checkAssets } from './check-assets.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const nm = join(root, 'node_modules');

async function clean() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  console.log('✓ clean');
}

async function copyDir(src, dest) {
  await cp(src, dest, { recursive: true });
}

/** Copia assets estáticos sin transformar */
async function copyStatic() {
  await copyDir(join(root, 'src/img'), join(dist, 'img'));
  await copyDir(join(root, 'src/templates'), join(dist, 'templates'));
  await cp(join(root, 'src/config.json'), join(dist, 'config.json'));
  console.log('✓ assets (img, templates, config)');
}

/** Copia y normaliza fuentes locales */
async function copyFonts() {
  const fontsDir = join(dist, 'fonts');
  await mkdir(fontsDir, { recursive: true });

  // Roboto
  const robotoSrc = join(nm, 'roboto-fontface/fonts/roboto');
  for (const f of await readdir(robotoSrc)) {
    if (/\.(woff2?|ttf|eot)$/i.test(f)) {
      await cp(join(robotoSrc, f), join(fontsDir, f));
    }
  }

  // Material Icons
  const miSrc = join(nm, 'material-design-icons/iconfont');
  for (const f of await readdir(miSrc)) {
    if (/\.(woff2?|ttf|eot)$/i.test(f)) {
      await cp(join(miSrc, f), join(fontsDir, f));
    }
  }

  // Font Awesome webfonts
  const faSrc = join(nm, '@fortawesome/fontawesome-free/webfonts');
  for (const f of await readdir(faSrc)) {
    if (/\.(woff2?|ttf|eot)$/i.test(f)) {
      await cp(join(faSrc, f), join(fontsDir, f));
    }
  }

  console.log('✓ fonts');
}

/** Reescribe urls de fuentes en CSS hacia ../fonts/ */
function rewriteFontUrls(css, options = {}) {
  let out = css;
  // Font Awesome: ../webfonts/ → ../fonts/
  out = out.replace(/url\((['"]?)\.\.\/webfonts\//g, 'url($1../fonts/');
  // Roboto: ../../fonts/roboto/ → ../fonts/
  out = out.replace(/url\((['"]?)\.\.\/\.\.\/fonts\/roboto\//g, 'url($1../fonts/');
  out = out.replace(/url\((['"]?)\.\.\/\.\.\/fonts\//g, 'url($1../fonts/');
  // Material icons webpack ~ paths
  out = out.replace(
      /url\((['"]?)~?material-design-icons\/iconfont\//g,
      'url($1../fonts/',
  );
  // Cualquier path a node_modules fonts
  out = out.replace(/url\((['"]?)[^'")]*node_modules\/[^'")]*\/([^/'"]+\.(?:woff2?|ttf|eot|svg))(['"]?)\)/gi,
      'url($1../fonts/$2$3)');
  if (options.stripMaps) {
    out = out.replace(/\/\*# sourceMappingURL=.*?\*\//g, '');
  }
  return out;
}

async function readIfExists(path) {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

/** Compila y concatena CSS de la aplicación y de terceros */
async function buildCss() {
  const cssDir = join(dist, 'css');
  await mkdir(cssDir, { recursive: true });

  // --- vendors.css ---
  const vendorParts = [];

  // Roboto
  let roboto = await readIfExists(join(nm, 'roboto-fontface/css/roboto/roboto-fontface.css'));
  roboto = rewriteFontUrls(roboto);
  vendorParts.push('/* roboto-fontface */\n' + roboto);

  // Material Icons
  let mi = await readIfExists(join(nm, 'webpack-material-design-icons/material-design-icons.css'));
  mi = rewriteFontUrls(mi);
  vendorParts.push('/* material-icons */\n' + mi);

  // Font Awesome
  let fa = await readIfExists(join(nm, '@fortawesome/fontawesome-free/css/all.min.css'));
  fa = rewriteFontUrls(fa);
  vendorParts.push('/* fontawesome */\n' + fa);

  // MDC precompiled
  for (const name of [
    'mdc.dialog.min.css',
    'mdc.textfield.min.css',
    'mdc.list.min.css',
    'mdc.drawer.min.css',
  ]) {
    const c = await readIfExists(join(root, 'css', name));
    if (c) vendorParts.push(`/* ${name} */\n${c}`);
  }

  // iv-viewer
  const iv = await readIfExists(join(nm, 'iv-viewer/dist/iv-viewer.min.css'));
  if (iv) vendorParts.push('/* iv-viewer */\n' + iv);

  // placeholder-loading (scss)
  try {
    const ph = sass.compile(join(nm, 'placeholder-loading/src/scss/placeholder-loading.scss'), {
      style: 'compressed',
      quietDeps: true,
      silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
    });
    vendorParts.push('/* placeholder-loading */\n' + ph.css);
  } catch (e) {
    console.warn('⚠ placeholder-loading scss:', e.message);
  }

  await writeFile(join(cssDir, 'vendors.css'), vendorParts.join('\n\n'), 'utf8');

  // --- app.css: main + widgets + domain scss/css ---
  // Entrada temporal que importa todo el SCSS de la app
  const entryScss = `
@use "sass:meta";
@use "${join(root, 'css/main.scss').replace(/\\/g, '/')}";
@use "${join(root, 'css/boxButton.scss').replace(/\\/g, '/')}";
@use "${join(root, 'css/mdc-drawer.scss').replace(/\\/g, '/')}";
@use "${join(root, 'css/creditos.scss').replace(/\\/g, '/')}";
@use "${join(root, 'css/ejercicio.scss').replace(/\\/g, '/')}";
@use "${join(root, 'css/resultado.scss').replace(/\\/g, '/')}";
@use "${join(root, 'css/print.scss').replace(/\\/g, '/')}";
`;

  // main.scss usa @use "~bootstrap/..." — sass necesita importers
  const appResult = sass.compileString(entryScss, {
    style: 'compressed',
    loadPaths: [join(root, 'css'), nm, root],
    quietDeps: true,
    silenceDeprecations: [
      'import',
      'global-builtin',
      'color-functions',
      'if-function',
      'slash-div',
    ],
    importers: [{
      findFileUrl(url) {
        // Resolver ~bootstrap y similares
        if (url.startsWith('~')) {
          const path = join(nm, url.slice(1));
          return new URL('file://' + path);
        }
        return null;
      },
    }],
  });

  let appCss = appResult.css;
  // widgets.css y ayuda.css e ibRadio.css (css plano)
  for (const name of ['widgets.css', 'ayuda.css', 'ibRadio.css']) {
    const c = await readIfExists(join(root, 'css', name));
    if (c) appCss += '\n' + c;
  }

  // Reescribir urls de imágenes relativas desde css/ hacia ../img/ si hace falta
  // Las imágenes de la app están en img/ y se referencian desde SCSS de formas varias
  appCss = rewriteFontUrls(appCss);

  await writeFile(join(cssDir, 'app.css'), appCss, 'utf8');

  // plantilla print css
  try {
    const printResult = sass.compile(join(root, 'css/print.scss'), {
      style: 'compressed',
      loadPaths: [join(root, 'css'), nm],
      quietDeps: true,
      silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
    });
    await writeFile(join(cssDir, 'plantilla.css'), printResult.css, 'utf8');
  } catch (e) {
    console.warn('⚠ plantilla.css:', e.message);
    await writeFile(join(cssDir, 'plantilla.css'), '', 'utf8');
  }

  console.log('✓ css');
}

/** Stub de imports CSS/SCSS en JS (el CSS se carga por <link>) */
const cssStubPlugin = {
  name: 'css-stub',
  setup(build) {
    build.onLoad({ filter: /\.(css|scss|sass)$/ }, () => ({
      contents: 'export default {};',
      loader: 'js',
    }));
  },
};

/**
 * Librerías UMD cargadas vía <script> en HTML (no se empaquetan en app.js).
 * El bundle solo las referencia como globales de window.
 */
const VENDOR_GLOBALS = {
  // bare import → { filter, contents (ESM shim) }
  'jquery': {
    filter: /^jquery$/,
    contents: `
      const $ = window.jQuery || window.$;
      if (!$) throw new Error('jQuery no cargado: incluya vendor/jquery/jquery.min.js antes de app.js');
      export default $;
    `,
  },
  'bootstrap-js': {
    // side-effect import del bundle de Bootstrap
    filter: /^bootstrap\/dist\/js\/bootstrap\.bundle(\.min)?\.js$/,
    contents: `
      // Bootstrap se carga desde vendor/bootstrap/bootstrap.bundle.min.js → window.bootstrap
      if (typeof window.bootstrap === 'undefined') {
        throw new Error('Bootstrap no cargado: incluya vendor/bootstrap/bootstrap.bundle.min.js');
      }
      export default window.bootstrap;
    `,
  },
  'html2canvas': {
    filter: /^html2canvas$/,
    contents: `
      const html2canvas = window.html2canvas;
      if (!html2canvas) throw new Error('html2canvas no cargado desde vendor/');
      export default html2canvas;
    `,
  },
  'jspdf': {
    filter: /^jspdf$/,
    contents: `
      const ns = window.jspdf || window.jsPDF;
      const jsPDF = ns && (ns.jsPDF || ns);
      if (!jsPDF) throw new Error('jsPDF no cargado desde vendor/jspdf/jspdf.umd.min.js');
      export default jsPDF;
      export { jsPDF };
    `,
  },
};

const vendorGlobalsPlugin = {
  name: 'vendor-globals',
  setup(build) {
    for (const [, cfg] of Object.entries(VENDOR_GLOBALS)) {
      const ns = 'vendor-global-' + cfg.filter.source;
      build.onResolve({ filter: cfg.filter }, (args) => ({
        path: args.path,
        namespace: ns,
      }));
      build.onLoad({ filter: /.*/, namespace: ns }, () => ({
        contents: cfg.contents,
        loader: 'js',
      }));
    }
  },
};

async function buildJs() {
  const jsDir = join(dist, 'js');
  await mkdir(jsDir, { recursive: true });

  const common = {
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2018'],
    define: {
      global: 'window',
      'process.env.NODE_ENV': '"production"',
    },
    plugins: [cssStubPlugin, vendorGlobalsPlugin],
    loader: {
      '.png': 'file',
      '.svg': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.eot': 'file',
      '.html': 'text',
    },
    assetNames: 'assets/[name]-[hash]',
    logLevel: 'warning',
    // Conservar console: la app usa console.time y logs de debug controlados
    drop: [],
  };

  await esbuild.build({
    ...common,
    entryPoints: [join(root, 'src/app.js')],
    outfile: join(jsDir, 'app.js'),
    sourcemap: true,
  });

  await esbuild.build({
    ...common,
    entryPoints: [join(root, 'src/view/plantilla.js')],
    outfile: join(jsDir, 'plantilla.js'),
    sourcemap: true,
  });

  console.log('✓ js (esbuild, vendor externos: jquery, bootstrap, html2canvas, jspdf)');
}

/** Scripts vendor (sin defer entre ellos + app con defer mantiene orden) */
function vendorScripts(prefix = './') {
  return `
    <script src="${prefix}vendor/jquery/jquery.min.js"></script>
    <script src="${prefix}vendor/bootstrap/bootstrap.bundle.min.js"></script>
    <script src="${prefix}vendor/html2canvas/html2canvas.min.js"></script>
    <script src="${prefix}vendor/jspdf/jspdf.umd.min.js"></script>
`;
}

/** Genera index.html y plantilla/index.html con rutas fijas */
async function buildHtml() {
  const indexTpl = await readFile(join(root, 'src/templates/index.html'), 'utf8');
  const headInject = `
    <link rel="stylesheet" href="./css/vendors.css">
    <link rel="stylesheet" href="./css/app.css">
`;
  // Vendor sin defer: disponibles antes de app.js (defer)
  const bodyInject = `
${vendorScripts('./')}
    <script src="./js/app.js" defer></script>
`;

  let indexHtml = indexTpl;
  if (indexHtml.includes('</head>')) {
    indexHtml = indexHtml.replace('</head>', headInject + '</head>');
  } else {
    indexHtml = headInject + indexHtml;
  }
  if (indexHtml.includes('</body>')) {
    indexHtml = indexHtml.replace('</body>', bodyInject + '</body>');
  } else {
    indexHtml += bodyInject;
  }
  await writeFile(join(dist, 'index.html'), indexHtml, 'utf8');

  // Plantilla PDF
  const plantillaTpl = await readFile(join(root, 'src/templates/plantillaPdf.html'), 'utf8');
  const pHead = `
    <link rel="stylesheet" href="../css/vendors.css">
    <link rel="stylesheet" href="../css/plantilla.css">
`;
  const pBody = `
${vendorScripts('../')}
    <script src="../js/plantilla.js" defer></script>
`;
  let plantillaHtml = plantillaTpl;
  if (plantillaHtml.includes('</head>')) {
    plantillaHtml = plantillaHtml.replace('</head>', pHead + '</head>');
  }
  if (plantillaHtml.includes('</body>')) {
    plantillaHtml = plantillaHtml.replace('</body>', pBody + '</body>');
  } else {
    plantillaHtml += pBody;
  }
  await mkdir(join(dist, 'plantilla'), { recursive: true });
  await writeFile(join(dist, 'plantilla/index.html'), plantillaHtml, 'utf8');

  console.log('✓ html (scripts vendor locales)');
}

async function main() {
  console.log('Building Aritmates (static)...');
  const t0 = Date.now();
  await clean();
  await copyStatic();
  await copyFonts();
  await buildCss();
  await buildJs();
  await buildHtml();
  await copyVendor(join(dist, 'vendor'));
  const ok = await checkAssets();
  console.log(`\nBuild ${ok ? 'OK' : 'CON AVISOS'} en ${Date.now() - t0}ms → dist/`);
  if (!ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
