# Externalización de librerías vendor

## Objetivo

Cargar jQuery, Bootstrap (JS), html2canvas y jsPDF desde `dist/vendor/` mediante `<script>`, en lugar de empaquetarlos dentro de `js/app.js`.

## Orden de carga en `index.html`

```html
<script src="./vendor/jquery/jquery.min.js"></script>
<script src="./vendor/bootstrap/bootstrap.bundle.min.js"></script>
<script src="./vendor/html2canvas/html2canvas.min.js"></script>
<script src="./vendor/jspdf/jspdf.umd.min.js"></script>
<script src="./js/app.js" defer></script>
```

Los scripts vendor se ejecutan de forma síncrona; `app.js` usa `defer` y se ejecuta después, con los globales ya disponibles.

## Shims en el build (esbuild)

| Import en código | Global de window |
|------------------|------------------|
| `import $ from 'jquery'` | `window.jQuery` |
| `import 'bootstrap/dist/js/bootstrap.bundle.min.js'` | `window.bootstrap` |
| `import html2canvas from 'html2canvas'` | `window.html2canvas` |
| `import jsPDF from 'jspdf'` | `window.jspdf.jsPDF` |

El CSS de Bootstrap sigue compilándose en `css/app.css` desde SCSS (sin cambio visual).

## Qué NO se externaliza aún

Polymer, MDC, mwc-switch, xy-ui, decimal.js, combinations, shorthash, etc. siguen en el bundle IIFE por bare imports / falta de UMD estable.

## Verificación

```bash
npm run build
# check-assets comprueba referencias a vendor en index.html
# y que app.js no contenga jQuery empaquetado
ls -lah dist/js/app.js   # debe ser más pequeño que el bundle monolítico previo
```
