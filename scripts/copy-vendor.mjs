/**
 * Copia librerías de terceros desde node_modules a dist/vendor (y opcionalmente a vendor/).
 * Solo se copian builds UMD/minificados listos para el navegador.
 */
import { cp, mkdir, access } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');

const VENDOR_MAP = [
  {
    name: 'jquery',
    files: [
      { from: 'jquery/dist/jquery.min.js', to: 'jquery/jquery.min.js' },
    ],
  },
  {
    name: 'bootstrap',
    files: [
      { from: 'bootstrap/dist/js/bootstrap.bundle.min.js', to: 'bootstrap/bootstrap.bundle.min.js' },
      { from: 'bootstrap/dist/css/bootstrap.min.css', to: 'bootstrap/bootstrap.min.css' },
    ],
  },
  {
    name: 'decimal.js',
    files: [
      { from: 'decimal.js/decimal.js', to: 'decimal.js/decimal.js' },
    ],
  },
  {
    name: 'html2canvas',
    files: [
      { from: 'html2canvas/dist/html2canvas.min.js', to: 'html2canvas/html2canvas.min.js' },
    ],
  },
  {
    name: 'jspdf',
    files: [
      { from: 'jspdf/dist/jspdf.umd.min.js', to: 'jspdf/jspdf.umd.min.js' },
    ],
  },
  {
    name: 'iv-viewer',
    files: [
      { from: 'iv-viewer/dist/iv-viewer.min.js', to: 'iv-viewer/iv-viewer.min.js' },
      { from: 'iv-viewer/dist/iv-viewer.min.css', to: 'iv-viewer/iv-viewer.min.css' },
    ],
  },
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function copyVendor(destRoot = join(root, 'dist', 'vendor')) {
  await mkdir(destRoot, { recursive: true });
  const missing = [];

  for (const pkg of VENDOR_MAP) {
    for (const file of pkg.files) {
      const src = join(nm, file.from);
      const dest = join(destRoot, file.to);
      if (!(await exists(src))) {
        missing.push(file.from);
        continue;
      }
      await mkdir(dirname(dest), { recursive: true });
      await cp(src, dest);
    }
  }

  if (missing.length) {
    console.warn('⚠ Archivos vendor no encontrados:', missing.join(', '));
  } else {
    console.log(`✓ vendor copiado → ${destRoot}`);
  }
  return { destRoot, missing };
}

// Ejecutable directo
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await copyVendor();
}
