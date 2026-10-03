/**
 * Genera src/img/og-image.jpg (1200x630), la tarjeta que muestran WhatsApp,
 * Telegram y las redes sociales al compartir un enlace: logotipo, lema y una
 * captura real de la portada. Misma familia visual que las otras herramientas del ATE.
 *
 * Uso: npm run build && node scripts/make-og-image.mjs
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

// page.evaluate runs in the browser; document exists there.
/* global document */

const PORT = 4196;
const OUT = 'src/img/og-image.jpg';
const dataUri = (file, mime) => `data:${mime};base64,${readFileSync(file).toString('base64')}`;
const server = spawn('node', ['scripts/serve.mjs', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch();
try {
  // 1. Captura de la portada con el selector de operaciones a la vista.
  const page = await browser.newPage({ viewport: { width: 1180, height: 720 }, deviceScaleFactor: 2, colorScheme: 'light', locale: 'es-ES' });
  await page.goto(`http://127.0.0.1:${PORT}/`);
  await page.locator('#main').waitFor();
  await page.evaluate(() => document.querySelector('#btnSuma').scrollIntoView({ block: 'center' }));
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  const shot = await page.screenshot({ animations: 'disabled' });

  // 2. La tarjeta.
  const logo = dataUri('src/img/Logo_Aritmates.svg', 'image/svg+xml');
  const ate = dataUri('src/img/ATE.png', 'image/png');
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await card.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; }
    body { width: 1200px; height: 630px; overflow: hidden; position: relative; color: #fff;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: radial-gradient(circle at 85% 15%, #2a74b5 0, transparent 55%), linear-gradient(135deg, #0f4c81 0%, #0a3459 100%); }
    .text { position: absolute; left: 72px; top: 92px; width: 540px; }
    .logo { width: 470px; display: block; }
    h2 { font-size: 40px; font-weight: 600; margin-top: 30px; color: #b2ffe3; }
    p { font-size: 26px; line-height: 1.38; margin-top: 22px; opacity: .92; }
    .ate { position: absolute; left: 72px; bottom: 54px; display: flex; align-items: center; gap: 16px; font-size: 21px; opacity: .92; }
    .ate img { height: 46px; filter: brightness(0) invert(1); }
    .shot { position: absolute; left: 650px; top: 78px; width: 680px; border-radius: 16px; overflow: hidden;
      box-shadow: 0 30px 60px rgb(0 15 35 / .5); transform: rotate(-2.5deg); background: #fff; }
    .shot img { display: block; width: 100%; }
  </style></head><body>
    <div class="text">
      <img class="logo" src="${logo}" alt="">
      <h2>¡Completa las operaciones!</h2>
      <p>Ejercicios ilimitados de sumas, restas, multiplicaciones y divisiones en el navegador. Software libre y sin registro.</p>
    </div>
    <div class="ate"><img src="${ate}" alt=""><span>Área de Tecnología Educativa · Gobierno de Canarias</span></div>
    <div class="shot"><img src="data:image/png;base64,${shot.toString('base64')}" alt=""></div>
  </body></html>`);
  await card.evaluate(() => document.fonts.ready);
  await card.screenshot({ path: OUT, type: 'jpeg', quality: 85 });
  console.log(`${OUT}: ${statSync(OUT).size} bytes`);
} finally {
  await browser.close();
  server.kill();
}
