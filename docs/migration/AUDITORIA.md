# Fase 1 — Auditoría de Aritmates

Fecha: 2026-07-24  
Rama: `feat/static-web-app`  
Objetivo: inventario previo a la migración a aplicación web estática.

## 1. Estructura de archivos (resumen)

| Ruta | Rol |
|------|-----|
| `src/app.js` | Punto de entrada principal de la UI |
| `src/view/plantilla.js` | Entrada de la plantilla PDF |
| `src/operaciones/` | Algoritmos matemáticos |
| `src/widgets/` | Componentes UI (Polymer, ibRadio, boxButton, ayuda, créditos) |
| `src/templates/` | HTML (portada, modales, partes de ejercicio/resultado, PDF) |
| `css/` | SCSS/CSS (main, ejercicio, resultado, print, MDC copiado) |
| `src/img/` | Imágenes, SVG, assets PDF |
| `test/` | Pruebas unitarias Mocha/Chai |
| `webpack.config.js` | **(legacy)** Build Webpack |
| `dist/` | Salida publicable |

## 2. Puntos de entrada

| Entrada | HTML generado | Notas |
|---------|---------------|-------|
| `src/app.js` | `dist/index.html` | App principal |
| `src/view/plantilla.js` | `dist/plantilla/index.html` | Plantilla impresión/PDF |

## 3. Módulos JavaScript propios

- `app.js`, `defaultOptions.js`, `generarExamen.js`, `imprimirPdf.js`
- `Opciones.js`, `OptionsShortcode.js`, `PortadaUI.js`, `ResultadosUI.js`, `utils.js`, `helpers.js`
- `operaciones/*` (suma, resta, multiplicación, divisiones, OperacionMultiple, tipoNumero)
- `widgets/*`, `view/*`

## 4. Plantillas HTML

`index.html`, `ayuda.html`, `creditos.html`, `ejercicio.html`, `resultado.html`,  
`part_ejercicio.html`, `part_resultado.html`, `modal.html`, `modalFaltaOpciones.html`,  
`modal_envioCorreo.html`, `plantillaPdf.html`, `plantillaPdf2.html`, `base.html`, `basica.html`

## 5. SCSS / CSS

- SCSS: `main.scss` (incluye Bootstrap), `ejercicio`, `resultado`, `print`, `boxButton`, `creditos`, `mdc-drawer`, `color`
- CSS: `widgets.css`, `ayuda.css`, `ibRadio.css`, MDC minificados copiados
- Terceros: roboto-fontface, fontawesome, material icons, placeholder-loading, iv-viewer

## 6. Fuentes e imágenes

- Roboto (roboto-fontface)
- Material Icons
- Font Awesome free
- `src/img/` (iconos operaciones, logos, PDF, créditos, algoritmos)

## 7. Configuración

- `src/config.json` → se carga con `$.ajax` síncrono en `defaultOptions.js`
- Defaults en `DEFAULTS` / `ENABLE`
- Códigos de ejercicios: `OptionsShortcode` + `combinations` + `shorthash`

## 8. Pruebas

| Tipo | Ubicación | Runner legacy | Runner nuevo |
|------|-----------|---------------|--------------|
| Unitarias | `test/*.spec.js` | webpack-test + mocha | `scripts/test.mjs` (esbuild + mocha) |
| Selenium | `testSelenium/` | webpack-seletest | pendiente (no migrado) |

## 9. Variables globales / window

| Propiedad | Origen |
|-----------|--------|
| `window.debug` | app.js |
| `window.jQuery` | app.js |
| `window.opciones` | app.js |
| `window.sliderCrono` | app.js |
| `window.opActual` | app.js |
| `window.opcionesGuardadas` | app.js |
| `window.finEjercicios` | app.js |
| `window.ocultarInsignias` / `mostrarInsignias` | app.js |
| `global.html2canvas` | imprimirPdf.js |
| `global.listOptions` | OptionsShortcode.js |
| `global.debug` | tests |

## 10. Red, storage, URL

| API | Uso |
|-----|-----|
| `fetch` | plantillas HTML, ayuda, créditos, envío resultados |
| `$.ajax` síncrono | `config.json` |
| `URLSearchParams` | parámetros de URL en app.js |
| `localStorage` / cookies | no detectados en src |
| `location.hash` | no detectado en src |

## 11. PDF e impresión

- `ImprimirPdf` (`jspdf` + `html2canvas`)
- `html2pdf.js` declarado pero **no importado** en el código fuente actual
- Plantilla en `plantilla/` y `templates/plantillaPdf.html`

## 12. Tabla de dependencias

| Dependencia | Archivos que la usan | Función | Mantener o sustituir | Riesgo | Prueba de equivalencia |
|-------------|----------------------|---------|----------------------|--------|------------------------|
| jquery | app.js, widgets, defaultOptions, imprimirPdf | DOM, eventos, ajax config | **Mantener** | Alto si se retira | UI + carga config.json |
| bootstrap | main.scss, app.js bundle JS | Grid, navbar, utilidades, tooltips/modals | **Mantener** | Alto visual | Screenshot portada responsive |
| decimal.js | operaciones/* | Precisión decimal | **Mantener** | Crítico matemático | tests operaciones |
| mathjs | (import muerto `cos` en OperacionMultiple; eliminado) | no usado | Vendor opcional | Bajo | n/a |
| html2canvas | imprimirPdf, app | Captura DOM→imagen PDF | **Mantener** | Alto PDF | comparar PDF |
| jspdf | imprimirPdf | Generación PDF | **Mantener** | Alto PDF | comparar PDF |
| html2pdf.js | package only | no usado en src | Vendor reservado | Nulo | n/a |
| combinations | Opciones, OptionsShortcode | combinatoria códigos | **Mantener** | Alto códigos | round-trip códigos |
| shorthash | OptionsShortcode | hash códigos | **Mantener** | Alto códigos | round-trip códigos |
| shallow-equal | utils | comparación arrays | **Mantener** | Medio | tests utils |
| @polymer/* | widgets, templates HTML | paper-* components | **Mantener temporal** | Crítico UI | visual + interacción |
| paper-expansion-panel | widgets, HTML | paneles desplegables | **Mantener temporal** | Crítico UI | paneles móvil/desktop |
| @material/dialog, drawer, textfield | app, ayuda | diálogos, drawer ayuda | **Mantener temporal** | Alto UI | diálogo código, ayuda |
| @material/mwc-switch | HTML + app | switches | **Mantener temporal** | Alto UI | enfocado/crono/límite |
| xy-ui (xy-slider) | HTML + app | sliders nivel/crono/ops | **Mantener temporal** | Crítico UI | sliders |
| iv-viewer | ayuda.js | visor imágenes ayuda | **Mantener** | Medio | ayuda |
| roboto-fontface | CSS | tipografía | **Mantener** | Visual | screenshot |
| @fortawesome/fontawesome-free | CSS | iconos medalla/cohete | **Mantener** | Visual | resultados |
| webpack-material-design-icons | CSS | Material Icons font | **Mantener** | Visual | iconos toolbar |
| placeholder-loading | CSS | skeleton loading | **Mantener** | Bajo visual | carga |
| mustache | view/pruebas.js only | plantillas (no prod) | Temporal | Bajo | n/a en prod |
| whatwg-fetch | polyfill IE | fetch | Mantener bajo riesgo | Bajo | fetch plantillas |
| react / @mui / @emotion | **ninguno en src** | — | **Eliminar** | Nulo | build sin ellos |
| webpack / babel / loaders | build legacy | empaquetado | **Eliminar** | — | nuevo build esbuild |

## 13. Justificación técnica de esbuild

Polymer 3, MDC y xy-ui usan bare imports (`import 'lit'`, `import '@polymer/...'`) que el navegador no resuelve sin import maps de cientos de paquetes.  
Un único bundle IIFE con **esbuild** (sin Webpack/Babel/Vite/Rollup/Parcel) es la opción más simple y segura para preservar el 100 % del comportamiento.

## 14. Errores preexistentes detectados (no corregidos)

1. `operacion.replace('∙', '*')` solo sustituye la **primera** aparición → fallos en multi-operando con varios `∙` al usar `eval`.
2. Algunos tests comparan string vs number en resultados de OperacionMultiple (`'35' !== 35`).
3. Tests de regex de `toString()` frágiles ante paréntesis/negativos.
4. `defaultOptions.js`: `if (config.version) DEFAULTS.baseurl = config.version` parece un typo (asigna version a baseurl).
5. Plantilla PDF webpack referenciaba bundles con rutas `./` desde subcarpeta `plantilla/` (roto en legacy).
6. Vídeos de ayuda YouTube pueden fallar (externo, no bloqueante).
7. Suite unitaria: ~257 passing, ~16 pending, ~27 failing (estado baseline post-migración de runner).
