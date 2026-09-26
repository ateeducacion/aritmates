/**
 * Mide main frente a la rama upstream y genera los datos y gráficas de
 * docs/INFORME-MODERNIZACION.md.
 *
 * Uso: node scripts/informe-modernizacion.mjs [ref-antigua] [ref-nueva]
 *   (por defecto origin/upstream y HEAD; hace falta Chromium de Playwright)
 *
 * Escribe docs/informe/metricas.json y docs/informe/*.svg.
 */
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs/informe');
const [OLD = 'origin/upstream', NEW = 'HEAD'] = process.argv.slice(2);

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });

// --- Código fuente, leído de git --------------------------------------------

function files(ref) {
  return git('-c', 'core.quotePath=false', 'ls-tree', '-r', '--name-only', ref).split('\n').filter(Boolean);
}

function lines(ref, path) {
  return git('show', `${ref}:${path}`).split('\n');
}

function count(text, re) {
  return (text.match(re) || []).length;
}

function codeMetrics(ref) {
  const all = files(ref);
  const pkg = JSON.parse(git('show', `${ref}:package.json`));
  const isOwnJs = (f) => f.startsWith('src/') && f.endsWith('.js') && !/\/(vendor|node_modules)\//.test(f);
  const src = all.filter(isOwnJs);
  const tests = all.filter((f) => /^(test|e2e)\//.test(f) && f.endsWith('.js'));
  const php = all.filter((f) => f.startsWith('src/') && f.endsWith('.php') && !f.includes('/vendor/'));

  const m = {
    ref, dependencias: Object.keys(pkg.dependencies || {}).length,
    devDependencias: Object.keys(pkg.devDependencies || {}).length,
    ficherosJs: src.length, lineasJs: 0, mayorFichero: { nombre: '', lineas: 0 },
    eval: 0, consoleLog: 0, bloquesDebug: 0, lineasComentadas: 0, todo: 0,
    ficherosPhp: php.length, lineasPhp: 0,
    ficherosTest: tests.length, lineasTest: 0, tests: 0, testsVacios: 0,
    configBuild: all.filter((f) => /^webpack.*\.js$|^\.babelrc$|babel\.config/.test(f)).length,
    ci: all.filter((f) => /^\.gitlab-ci\.yml$|^\.github\/workflows\//.test(f)).length,
  };
  for (const f of src) {
    const l = lines(ref, f);
    const t = l.join('\n');
    m.lineasJs += l.length;
    if (l.length > m.mayorFichero.lineas) m.mayorFichero = { nombre: f, lineas: l.length };
    const code = l.filter((x) => !/^\s*(\/\/|\*|\/\*)/.test(x)).join('\n');
    m.eval += count(code, /\beval\s*\(/g);
    m.consoleLog += count(code, /console\.log\s*\(/g);
    m.bloquesDebug += count(code, /if\s*\(\s*debug\b/g);
    m.lineasComentadas += l.filter((x) => /^\s*\/\//.test(x)).length;
    m.todo += count(t, /TODO|FIXME/g);
  }
  for (const f of php) m.lineasPhp += lines(ref, f).length;
  for (const f of tests) {
    const t = lines(ref, f).join('\n');
    m.lineasTest += t.split('\n').length;
    m.tests += count(t, /^\s*(it|test)\s*\(/gm);
    // it('...') without a callback: Mocha marks it pending.
    m.testsVacios += count(t, /^\s*it\s*\(\s*(['"`])(?:(?!\1).)*\1\s*\)/gm);
  }
  return m;
}

// --- Despliegue: tamaño en disco ---------------------------------------------

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else out.push({ path: p, size: (await stat(p)).size });
  }
  return out;
}

function category(rel) {
  if (/^vendor\//.test(rel) && /\.php$|\/(composer|phpmailer|dompdf|masterminds|sabberworm|phenx)/i.test(rel)) return 'PHP (servidor)';
  if (/\.map$/.test(rel)) return 'Mapas de código';
  if (/\.php$/.test(rel)) return 'PHP (servidor)';
  if (/\.(woff2?|ttf|eot|otf)$/i.test(rel)) return 'Fuentes';
  if (/\.(png|jpe?g|gif|svg|webp|ico|xcf)$/i.test(rel)) return 'Imágenes';
  if (/\.js$/.test(rel)) return 'JavaScript';
  if (/\.css$/.test(rel)) return 'CSS';
  return 'Otros';
}

async function distSizes(dir) {
  const byCat = {};
  let total = 0;
  let n = 0;
  for (const f of await walk(dir)) {
    const rel = f.path.slice(dir.length + 1);
    const c = category(rel);
    byCat[c] = (byCat[c] || 0) + f.size;
    total += f.size;
    n++;
  }
  return { total, ficheros: n, porTipo: byCat };
}

// --- Carga en el navegador -----------------------------------------------------

function serve(dir, port) {
  const child = spawn(process.execPath, [join(root, 'scripts/serve.mjs'), String(port), dir], { stdio: 'ignore' });
  return new Promise((ok) => setTimeout(() => ok(child), 800));
}

async function pageLoad(url, runs = 5) {
  const browser = await chromium.launch();
  const samples = [];
  let detail;
  for (let i = 0; i < runs; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const bytes = {};
    let requests = 0;
    let externos = 0;
    let bytesExternos = 0;
    const origin = new URL(url).origin;
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', async (r) => {
      const own = new URL(r.url()).origin === origin;
      if (own) requests++; else externos++;
      const type = r.request().resourceType();
      try {
        const len = (await r.body()).length;
        // Third-party bytes (e.g. embedded videos) are reported apart.
        if (own) bytes[type] = (bytes[type] || 0) + len;
        else bytesExternos += len;
      } catch { /* redirects have no body */ }
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    const t = await page.evaluate(() => {
      const nav = globalThis.performance.getEntriesByType('navigation')[0];
      return { dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd };
    });
    samples.push(t);
    detail = {
      requests, bytes, total: Object.values(bytes).reduce((a, b) => a + b, 0),
      peticionesExternas: externos, bytesExternos, errores: errors.length,
    };
    await context.close();
  }
  await browser.close();
  const median = (k) => samples.map((s) => s[k]).sort((a, b) => a - b)[Math.floor(runs / 2)];
  return { ...detail, domContentLoadedMs: Math.round(median('dcl')), loadMs: Math.round(median('load')) };
}

// --- Gráficas SVG (colores de DESIGN.md de documentos-ate) --------------------

const C = { old: '#0C2C84', new: '#FFB300', text: '#1A1A1A', muted: '#595959', grid: '#BFBFBF' };

function barChart({ title, unit, rows, labels = ['upstream', 'main'] }) {
  const w = 760; const rowH = 46; const left = 230; const top = 58; const right = 110;
  const h = top + rows.length * rowH + 20;
  const max = Math.max(...rows.flatMap((r) => [r.old, r.new])) || 1;
  const x = (v) => (v / max) * (w - left - right);
  const fmt = (v) => (unit === 'KB' || unit === 'MB') ? `${v.toLocaleString('es-ES', { maximumFractionDigits: 1 })} ${unit}` : `${v.toLocaleString('es-ES')}${unit ? ' ' + unit : ''}`;
  let body = '';
  rows.forEach((r, i) => {
    const y = top + i * rowH;
    body += `<text x="${left - 10}" y="${y + 20}" text-anchor="end" font-size="13" fill="${C.text}">${r.label}</text>`;
    body += `<rect x="${left}" y="${y + 4}" width="${Math.max(x(r.old), 1)}" height="16" fill="${C.old}"/>`;
    body += `<text x="${left + x(r.old) + 6}" y="${y + 17}" font-size="12" fill="${C.muted}">${fmt(r.old)}</text>`;
    body += `<rect x="${left}" y="${y + 22}" width="${Math.max(x(r.new), 1)}" height="16" fill="${C.new}"/>`;
    body += `<text x="${left + x(r.new) + 6}" y="${y + 35}" font-size="12" fill="${C.muted}">${fmt(r.new)}</text>`;
  });
  const legend = `<rect x="${left}" y="30" width="12" height="12" fill="${C.old}"/><text x="${left + 18}" y="40" font-size="12" fill="${C.text}">${labels[0]}</text>` +
    `<rect x="${left + 110}" y="30" width="12" height="12" fill="${C.new}"/><text x="${left + 128}" y="40" font-size="12" fill="${C.text}">${labels[1]}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Arial, Liberation Sans, sans-serif">` +
    `<rect width="100%" height="100%" fill="#FFFFFF"/><text x="16" y="22" font-size="15" font-weight="700" fill="${C.text}">${title}</text>${legend}${body}</svg>\n`;
}

// --- Main -----------------------------------------------------------------------

const kb = (b) => Math.round(b / 102.4) / 10;

async function main() {
  await mkdir(outDir, { recursive: true });
  const code = { antigua: codeMetrics(OLD), nueva: codeMetrics(NEW) };

  // Old dist is committed in the branch; index.php renders templates/index.html.
  const tmp = await mkdtemp(join(tmpdir(), 'aritmates-informe-'));
  const oldDist = join(tmp, 'dist');
  execFileSync('sh', ['-c', `git archive ${OLD} dist | tar -x -C "${tmp}"`], { cwd: root });
  const php = git('show', `${OLD}:dist/index.php`);
  const head = php.slice(0, php.indexOf('<?php'));
  const tpl = await readFile(join(oldDist, 'templates/index.html'), 'utf8');
  await writeFile(join(oldDist, 'index.html'), tpl.replace('<head>', '<head>' + head.replace(/^<head>|<\/head>$/g, '')).replace('<script></script>', '<script>var hash = ""; var hdate = "";</script>'));

  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'ignore' });
  const newDist = join(root, 'dist');

  const despliegue = { antigua: await distSizes(oldDist), nueva: await distSizes(newDist) };
  // The index.html we synthesised for the old version is not part of it.
  despliegue.antigua.total -= (await stat(join(oldDist, 'index.html'))).size;

  const s1 = await serve(oldDist, 9331);
  const s2 = await serve(newDist, 9332);
  let carga;
  try {
    carga = { antigua: await pageLoad('http://127.0.0.1:9331/'), nueva: await pageLoad('http://127.0.0.1:9332/') };
  } finally {
    s1.kill(); s2.kill();
    await rm(tmp, { recursive: true, force: true });
  }

  const metricas = { generado: new Date().toISOString().slice(0, 10), refs: { antigua: OLD, nueva: NEW }, code, despliegue, carga };
  await writeFile(join(outDir, 'metricas.json'), JSON.stringify(metricas, null, 2) + '\n');

  const a = code.antigua; const n = code.nueva;
  await writeFile(join(outDir, 'dependencias.svg'), barChart({
    title: 'Dependencias declaradas en package.json', unit: '', rows: [
      { label: 'dependencies', old: a.dependencias, new: n.dependencias },
      { label: 'devDependencies', old: a.devDependencias, new: n.devDependencias },
    ] }));
  const cats = ['JavaScript', 'CSS', 'Imágenes', 'Fuentes', 'PHP (servidor)', 'Mapas de código', 'Otros'];
  await writeFile(join(outDir, 'despliegue.svg'), barChart({
    title: 'Tamaño de lo desplegado (dist/) por tipo', unit: 'KB', rows: cats.map((c) => ({
      label: c, old: kb(despliegue.antigua.porTipo[c] || 0), new: kb(despliegue.nueva.porTipo[c] || 0),
    })).concat([{ label: 'Total', old: kb(despliegue.antigua.total), new: kb(despliegue.nueva.total) }]) }));
  const types = ['script', 'stylesheet', 'font', 'image', 'document', 'fetch', 'xhr'];
  await writeFile(join(outDir, 'carga.svg'), barChart({
    title: 'Bytes propios descargados al abrir la portada', unit: 'KB', rows: types.map((t) => ({
      label: t, old: kb(carga.antigua.bytes[t] || 0), new: kb(carga.nueva.bytes[t] || 0),
    })).filter((r) => r.old || r.new).concat([
      { label: 'Total propio', old: kb(carga.antigua.total), new: kb(carga.nueva.total) },
      { label: 'Terceros (vídeos…)', old: kb(carga.antigua.bytesExternos), new: kb(carga.nueva.bytesExternos) },
    ]) }));
  await writeFile(join(outDir, 'codigo.svg'), barChart({
    title: 'Código JavaScript propio (src/); console.log y debug sin contar comentarios', unit: '', rows: [
      { label: 'Líneas de JS', old: a.lineasJs, new: n.lineasJs },
      { label: 'Líneas de comentario', old: a.lineasComentadas, new: n.lineasComentadas },
      { label: 'console.log', old: a.consoleLog, new: n.consoleLog },
      { label: 'Bloques if (debug)', old: a.bloquesDebug, new: n.bloquesDebug },
      { label: 'TODO / FIXME', old: a.todo, new: n.todo },
    ] }));
  await writeFile(join(outDir, 'pruebas.svg'), barChart({
    title: 'Pruebas automatizadas', unit: '', rows: [
      { label: 'Tests declarados', old: a.tests, new: n.tests },
      { label: 'Tests vacíos (pending)', old: a.testsVacios, new: n.testsVacios },
      { label: 'Líneas de test', old: a.lineasTest, new: n.lineasTest },
    ] }));
  console.log(JSON.stringify(metricas, null, 2));
}

await main();
