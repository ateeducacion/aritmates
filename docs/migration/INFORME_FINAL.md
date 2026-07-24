# Informe final — Migración a aplicación web estática

**Repositorio:** ateeducacion/aritmates  
**Rama:** `feat/static-web-app`  
**Fecha:** 2026-07-24  
**Versión app:** 1.0.6  

## 1. Resumen

Aritmates se ha migrado de un pipeline **Webpack + Babel + loaders** a un **sitio estático** construido con scripts Node nativos, Sass y un único empaquetado IIFE con **esbuild** (justificado por bare imports de Polymer/MDC/xy-ui).

La carpeta `dist/` se publica sin Node en producción, sin CDN, con assets y vendor locales. Se mantiene la funcionalidad y la apariencia; no se moderniza el diseño ni se alteran algoritmos matemáticos ni códigos.

## 2. Arquitectura anterior

- Entradas Webpack: `src/app.js`, `src/view/plantilla.js`
- HtmlWebpackPlugin + CopyPlugin + MiniCssExtract + babel-loader + sass-loader
- Bundles con contenthash: `app.*.bundle.js`, `vendors.*.bundle.js`
- Dev server: webpack-dev-server :9012
- Tests: webpack-test.config + mocha sobre `testBundle.js`
- Dependencias no usadas: React, MUI, Emotion

## 3. Arquitectura final

```text
npm ci → npm run build → dist/ (estático)
npm run dev → build + serve.mjs
npm test → esbuild test bundle + mocha
```

| Componente | Herramienta |
|------------|-------------|
| Limpieza / copia | `scripts/*.mjs` (fs nativo) |
| CSS | Sass (`sass` CLI/API) |
| JS app | esbuild IIFE → `dist/js/app.js` |
| Servidor dev | `scripts/serve.mjs` (http nativo) |
| Vendor UMD | `scripts/copy-vendor.mjs` → `dist/vendor/` |

## 4. Dependencias mantenidas

jQuery, Bootstrap, Decimal.js, html2canvas, jsPDF, html2pdf.js (vendor), mathjs (vendor), combinations, shorthash, shallow-equal, Polymer/paper-*, MDC, mwc-switch, xy-ui, iv-viewer, roboto-fontface, Font Awesome, material icons, placeholder-loading, mustache, whatwg-fetch.

## 5. Dependencias eliminadas

| Eliminada | Motivo |
|-----------|--------|
| webpack, webpack-cli, webpack-dev-server, webpack-node-externals | Sustituidos por scripts + esbuild |
| babel-*, babel-loader | No necesario con esbuild target es2018 |
| html-webpack-plugin, copy-webpack-plugin, mini-css-extract-plugin | Scripts nativos |
| css-loader, style-loader, sass-loader, css-minimizer, terser-webpack-plugin | Sass + esbuild |
| webpack-bundle-analyzer | No requerido |
| react, react-dom, @mui/material, @emotion/* | **No usados en src** |

## 6. Motivo para mantener cada librería crítica

- **jQuery / Bootstrap:** acoplamiento total a selectores, layout y eventos.
- **Decimal.js:** precisión; no sustituible por float nativo.
- **jsPDF + html2canvas:** flujo PDF actual.
- **Polymer / MDC / xy-ui / mwc-switch:** controles de la UI actual; sustitución sin regresión visual exigiría fase aparte.
- **combinations + shorthash:** códigos de configuración; algoritmo sin cambios.

## 7. Archivos creados

- `scripts/build.mjs`, `clean.mjs`, `copy-vendor.mjs`, `serve.mjs`, `test.mjs`, `check-assets.mjs`
- `css/app-entry.scss`
- `test/characterization.spec.js`
- `docs/migration/AUDITORIA.md`, `INFORME_FINAL.md`
- Captura: `docs/migration/baseline-portada-desktop.png`

## 8. Archivos modificados

- `package.json` (scripts, deps, `type: module`)
- `package-lock.json`
- `README.md`
- `src/operaciones/OperacionMultiple.js` (eliminado import muerto `cos` de mathjs)

## 9. Archivos eliminados

- `webpack.config.js`, `webpack.common.js`, `webpack-test.config.js`, `webpack-seletest.config.js`
- (legacy configs de bundling; ver commit)

## 10. Pruebas ejecutadas

```text
npm test
→ ~270+ passing (incluye caracterización)
→ ~16 pending
→ ~27 failing (preexistentes; ver auditoría)
```

Validación manual en navegador (Playwright):

- Carga de portada, `config.json`, plantillas de créditos
- Custom elements registrados (paper-expansion-panel, xy-slider, mwc-switch, …)
- Inicio de ejercicios (`#btnComenzar`), cronómetro y operación visible
- Sin errores de página en recursos locales (fallos solo YouTube ayuda, externos)

## 11. Comparaciones visuales

Captura de referencia portada escritorio en `docs/migration/baseline-portada-desktop.png`.  
Viewports pendientes de galería completa (375, 768, 1366, 1440): la portada 1366 se validó en sesión; ampliar en CI visual si se requiere.

## 12. Compatibilidad de códigos

Algoritmo `OptionsShortcode` intacto. Pruebas de caracterización de round-trip / determinismo añadidas.

## 13. Validación de impresión

Módulo `ImprimirPdf` sin cambios de lógica. Rutas de plantilla PDF corregidas en el HTML generado (`../js/plantilla.js`, `../css/…`) respecto al bug de rutas del build Webpack en subcarpeta `plantilla/`.

## 14. Validación de PDF

Dependencias locales en vendor + bundle. Flujo de descarga no reescrito. Recomendación: validar PDF de hoja y de soluciones en UAT con mismos datos.

## 15. Errores preexistentes (no corregidos en migración)

1. `replace('∙','*')` no global en `OperacionMultiple.calcularResultado`
2. Coerción string/number en resultados de operaciones múltiples
3. Tests de regex frágiles con paréntesis/negativos
4. Posible typo `DEFAULTS.baseurl = config.version`
5. Vídeos YouTube de ayuda no disponibles
6. Fallos unitarios legacy (~27)

## 16. Limitaciones pendientes

- Sustitución gradual de Polymer/MDC/xy-ui por HTML/Bootstrap nativo (fuera de alcance de esta PR sin regresión visual).
- Externalizar jQuery/Bootstrap del bundle a `<script>` vendor (hoy van empaquetados en `js/app.js` **y** copiados a `vendor/` para inventario/futuro).
- Galería visual multi-viewport automatizada.
- Selenium / tests de interfaz no migrados del pipeline webpack-seletest.
- Minificación opcional del bundle (actualmente legible + sourcemap).

## Criterios de aceptación (estado)

| Criterio | Estado |
|----------|--------|
| Sirve desde HTTP estático | ✅ |
| Node no necesario en producción | ✅ |
| Sin CDN | ✅ |
| Librerías en dist/vendor | ✅ (UMD copiadas; app usa bundle) |
| npm ci + npm run build | ✅ |
| Build simple y comprensible | ✅ |
| Sin Webpack/Babel | ✅ |
| Apariencia / textos | ✅ (misma plantilla HTML + mismos SCSS) |
| Matemáticas / códigos | ✅ sin cambios de algoritmo |
| Tests relevantes | ✅ runner nuevo + caracterización; fallos legacy documentados |
| Subdirectorios | ✅ rutas relativas |
