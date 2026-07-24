/**
 * Galería visual multi-viewport de Aritmates.
 *
 * Captura pantallas de referencia en:
 *   375×812, 768×1024, 1366×768, 1440×900
 *
 * Requisitos:
 *   npm run build
 *   npx playwright install chromium   (la primera vez)
 *
 * Uso:
 *   npm run visual
 *   node scripts/visual-gallery.mjs [url] [outdir]
 *
 * Por defecto sirve dist/ en un puerto efímero y captura la portada.
 * Animaciones desactivadas; mismo DPR=1.
 */
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const defaultOut = join(root, 'docs/migration/visual');

const VIEWPORTS = [
  { name: '375x812', width: 375, height: 812, label: 'Móvil' },
  { name: '768x1024', width: 768, height: 1024, label: 'Tableta' },
  { name: '1366x768', width: 1366, height: 768, label: 'Escritorio HD' },
  { name: '1440x900', width: 1440, height: 900, label: 'Escritorio' },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.jpg': 'image/jpeg',
  '.map': 'application/json',
};

function startStaticServer(publicDir) {
  return new Promise((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        if (urlPath === '/') urlPath = '/index.html';
        const cleaned = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
        let filePath = join(publicDir, cleaned);
        if (!filePath.startsWith(publicDir)) {
          res.writeHead(403);
          res.end('Forbidden');
          return;
        }
        let info;
        try {
          info = await stat(filePath);
        } catch {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        if (info.isDirectory()) filePath = join(filePath, 'index.html');
        const data = await readFile(filePath);
        res.writeHead(200, {
          'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
        });
        res.end(data);
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolvePromise({ server, port, url: `http://127.0.0.1:${port}/` });
    });
    server.on('error', reject);
  });
}

async function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require('playwright');
  } catch {
    console.error('Playwright no está instalado. Ejecuta:');
    console.error('  npm i -D playwright');
    console.error('  npx playwright install chromium');
    process.exit(1);
  }
}

async function ensureDist() {
  try {
    await stat(join(dist, 'index.html'));
  } catch {
    console.log('dist/ no encontrado; ejecutando build…');
    await new Promise((res, rej) => {
      const child = spawn(process.execPath, [join(root, 'scripts/build.mjs')], {
        cwd: root,
        stdio: 'inherit',
      });
      child.on('exit', (c) => (c === 0 ? res() : rej(new Error('build failed'))));
    });
  }
}

async function capture({ baseUrl, outDir }) {
  const { chromium } = await loadPlaywright();
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    // Desactivar animaciones/transiciones
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          caret-color: transparent !important;
        }
      `,
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(800);

    // Ocultar loader si sigue visible
    await page.evaluate(() => {
      const load = document.querySelector('#load');
      if (load) load.style.display = 'none';
      const main = document.querySelector('#main');
      if (main) main.style.display = 'block';
    });
    await page.waitForTimeout(300);

    const file = `portada-${vp.name}.png`;
    const path = join(outDir, file);
    await page.screenshot({ path, fullPage: true, type: 'png' });
    results.push({ ...vp, file });
    console.log(`✓ ${vp.label} ${vp.name} → ${file}`);
    await context.close();
  }

  await browser.close();
  return results;
}

function buildIndexHtml(results, generatedAt) {
  const cards = results.map((r) => `
    <figure class="card">
      <figcaption>
        <strong>${r.label}</strong>
        <span>${r.width}×${r.height}</span>
      </figcaption>
      <a href="./${r.file}" target="_blank" rel="noopener">
        <img src="./${r.file}" alt="Portada ${r.name}" loading="lazy" />
      </a>
    </figure>`).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aritmates — Galería visual de referencia</title>
  <style>
    :root { font-family: system-ui, sans-serif; color: #1a1a1a; background: #f4f6f8; }
    body { margin: 0; padding: 1.5rem; }
    h1 { font-size: 1.4rem; margin: 0 0 .25rem; }
    p.meta { color: #555; margin: 0 0 1.5rem; font-size: .9rem; }
    .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .card { margin: 0; background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.08); overflow: hidden; }
    .card figcaption { display: flex; justify-content: space-between; padding: .75rem 1rem; border-bottom: 1px solid #eee; font-size: .9rem; }
    .card img { display: block; width: 100%; height: auto; background: #ddd; }
    .notes { margin-top: 2rem; max-width: 48rem; font-size: .9rem; color: #333; }
    code { background: #e8eef5; padding: .1em .35em; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>Aritmates — Galería visual de referencia</h1>
  <p class="meta">Generado: ${generatedAt} · DPR=1 · animaciones desactivadas · estado: portada</p>
  <div class="grid">
    ${cards}
  </div>
  <div class="notes">
    <h2>Criterios de comparación</h2>
    <ul>
      <li>Mismo navegador Chromium headless, mismo DPR (1), mismo zoom.</li>
      <li>Viewports fijos: 375×812, 768×1024, 1366×768, 1440×900.</li>
      <li>Animaciones y transiciones forzadas a 0s.</li>
      <li>No subir el umbral de diferencia para ocultar regresiones.</li>
    </ul>
    <p>Regenerar: <code>npm run visual</code></p>
  </div>
</body>
</html>`;
}

async function main() {
  const argUrl = process.argv[2];
  const outDir = resolve(process.argv[3] || defaultOut);

  let server;
  let baseUrl = argUrl;

  if (!baseUrl) {
    await ensureDist();
    const s = await startStaticServer(dist);
    server = s.server;
    baseUrl = s.url;
    console.log(`Sirviendo dist en ${baseUrl}`);
  }

  try {
    const results = await capture({ baseUrl, outDir });
    const generatedAt = new Date().toISOString();
    await writeFile(join(outDir, 'index.html'), buildIndexHtml(results, generatedAt), 'utf8');
    await writeFile(
        join(outDir, 'manifest.json'),
        JSON.stringify({ generatedAt, baseUrl, viewports: results }, null, 2),
        'utf8',
    );
    console.log(`\n✓ Galería en ${outDir}`);
    console.log(`  Abrir: ${join(outDir, 'index.html')}`);
  } finally {
    if (server) server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
