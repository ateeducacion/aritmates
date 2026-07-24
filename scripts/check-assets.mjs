/**
 * Verifica que dist contenga los recursos críticos.
 */
import { access, readFile, readdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const REQUIRED = [
  'index.html',
  'config.json',
  'js/app.js',
  'css/app.css',
  'css/vendors.css',
  'plantilla/index.html',
  'js/plantilla.js',
  'templates/ayuda.html',
  'templates/creditos.html',
  'templates/part_ejercicio.html',
  'templates/part_resultado.html',
  'templates/modal.html',
  'templates/modalFaltaOpciones.html',
  'templates/plantillaPdf.html',
  'img/Logo_Aritmates.svg',
  'img/GobCanEscudo.ink.svg',
  'vendor/jquery/jquery.min.js',
  'vendor/bootstrap/bootstrap.bundle.min.js',
  'vendor/decimal.js/decimal.js',
  'vendor/html2canvas/html2canvas.min.js',
  'vendor/jspdf/jspdf.umd.min.js',
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function checkAssets() {
  const missing = [];
  for (const rel of REQUIRED) {
    if (!(await exists(join(dist, rel)))) missing.push(rel);
  }

  // Fonts
  const fontsDir = join(dist, 'fonts');
  if (!(await exists(fontsDir))) {
    missing.push('fonts/');
  } else {
    const fonts = await readdir(fontsDir);
    if (fonts.length < 5) missing.push('fonts/ (pocos archivos)');
  }

  // HTML no debe referenciar CDN
  const html = await readFile(join(dist, 'index.html'), 'utf8');
  if (/https?:\/\/cdn\.|unpkg\.com|jsdelivr|cdnjs/.test(html)) {
    missing.push('CDN detectado en index.html');
  }

  // No debe referenciar node_modules
  if (html.includes('node_modules')) {
    missing.push('Referencia a node_modules en index.html');
  }

  // Vendor scripts deben cargarse desde rutas locales
  const vendorScripts = [
    'vendor/jquery/jquery.min.js',
    'vendor/bootstrap/bootstrap.bundle.min.js',
    'vendor/html2canvas/html2canvas.min.js',
    'vendor/jspdf/jspdf.umd.min.js',
  ];
  for (const src of vendorScripts) {
    if (!html.includes(src)) {
      missing.push(`index.html no referencia ${src}`);
    }
  }

  // El bundle no debería re-empaquetar jQuery (señal de externalización rota)
  try {
    const appJs = await readFile(join(dist, 'js/app.js'), 'utf8');
    // jQuery minificado suele incluir esta cadena característica si está bundlado
    if (appJs.includes('jQuery JavaScript Library v') || appJs.includes('/*! jQuery v')) {
      missing.push('js/app.js parece incluir jQuery empaquetado (debería ser externo)');
    }
  } catch {
    /* ya cubierto por REQUIRED */
  }

  if (missing.length) {
    console.error('✗ Recursos faltantes o inválidos:');
    missing.forEach((m) => console.error('  -', m));
    return false;
  }
  console.log('✓ check-assets: todos los recursos críticos presentes');
  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const ok = await checkAssets();
  process.exit(ok ? 0 : 1);
}
