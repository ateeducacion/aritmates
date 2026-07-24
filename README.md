# Aritmates

![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow)
![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)
![Last Commit](https://img.shields.io/github/last-commit/ateeducacion/aritmates)
![Open Issues](https://img.shields.io/github/issues/ateeducacion/aritmates)

**Aritmates** es una aplicación del Área de Tecnología Educativa (ATE) para configurar y realizar ejercicios de matemáticas. Se publica como **sitio web estático** (HTML, CSS, JavaScript y assets locales).

Esta es una **versión simplificada** (v1.2) basada en un desarrollo previo de Netex y Altia: mismo comportamiento y apariencia, arquitectura estática (sin Webpack/Babel) y controles de UI nativos (sin Polymer/MDC/xy-ui).

## Comandos principales

```bash
npm ci
npm run dev
npm test
npm run build
```

| Comando | Descripción |
|---------|-------------|
| `npm ci` | Instala dependencias reproducibles (lockfile) |
| `npm run build` | Genera la carpeta `dist/` lista para publicar |
| `npm run dev` | Build + servidor local en http://127.0.0.1:9012/ |
| `npm run serve` | Sirve `dist/` sin recompilar |
| `npm test` | Empaqueta y ejecuta pruebas unitarias (Mocha) |
| `npm run visual` | Capturas multi-viewport de referencia (Playwright) |
| `npm run vendor` | Copia librerías UMD a `dist/vendor/` |
| `npm run clean` | Elimina `dist/` |
| `npm run check` | Verifica recursos críticos en `dist/` |

## Arquitectura

```text
aritmates/
├── package.json
├── package-lock.json
├── scripts/
│   ├── build.mjs          # build estático completo
│   ├── clean.mjs
│   ├── copy-vendor.mjs    # node_modules → dist/vendor
│   ├── serve.mjs          # HTTP estático nativo
│   ├── test.mjs           # tests sin Webpack
│   └── check-assets.mjs
├── src/
│   ├── app.js             # entrada principal
│   ├── config.json
│   ├── js (módulos propios)
│   ├── img/
│   └── templates/
├── css/                   # SCSS/CSS fuente
├── test/
└── dist/                  # salida publicable (sin Node en producción)
    ├── index.html
    ├── plantilla/
    ├── js/
    ├── css/
    ├── img/
    ├── fonts/
    ├── templates/
    ├── vendor/
    └── config.json
```

### Build

El build **no usa Webpack ni Babel**. Usa:

1. **Scripts Node nativos** para limpiar, copiar assets y servir.
2. **Sass** solo para compilar SCSS → CSS.
3. **esbuild** solo para empaquetar el JavaScript de la app.

**Por qué esbuild:** Polymer 3, Material Components y xy-ui usan bare imports que el navegador no resuelve sin un grafo enorme de import maps. Un único bundle IIFE preserva el comportamiento y la apariencia sin una cadena compleja de loaders.

Node.js **no es necesario en producción**. Solo se usa para instalar, construir, probar y desarrollar en local.

## Dependencias de runtime (resumen)

| Librería | Uso |
|----------|-----|
| jQuery | DOM, eventos, carga de `config.json` |
| Bootstrap 5 | Layout y utilidades CSS/JS |
| Decimal.js | Precisión en operaciones decimales |
| jsPDF + html2canvas | Generación de PDF |
| Polymer / paper-* | Paneles y controles legacy |
| MDC / mwc-switch | Diálogos, drawer, switches |
| xy-ui | Sliders |
| combinations + shorthash | Códigos de configuración |
| Font Awesome, Roboto, Material Icons | Tipografía e iconos |

Las builds UMD se copian a `dist/vendor/` para inspección y uso futuro. El bundle de la app incluye las dependencias necesarias para el navegador (sin CDN).

## Instalación

```bash
git clone https://github.com/ateeducacion/aritmates.git
cd aritmates
npm ci
npm run build
```

## Desarrollo local

```bash
npm run dev
# → http://127.0.0.1:9012/
```

Puerto por defecto: **9012**. Alternativa:

```bash
npm run build
npm run serve 8080
```

## Despliegue

Publique el contenido de `dist/` en cualquier servidor de archivos estáticos:

- Nginx / Apache
- GitHub Pages
- Cloudflare Pages / Netlify / similar

Ejemplo Nginx:

```nginx
location /aritmates/ {
  alias /var/www/aritmates/;
  try_files $uri $uri/ /aritmates/index.html;
}
```

### Subdirectorios

La app usa **rutas relativas** (`./js/…`, `./css/…`, `./templates/…`, `./config.json`).  
Funciona en:

- `https://example.org/`
- `https://example.org/aritmates/`
- `https://example.org/apps/aritmates/`

Configure `baseurl` en `src/config.json` (se copia a `dist/config.json`) si el envío de formularios/resultados lo requiere.

## Estructura de `dist`

```text
dist/
├── index.html
├── plantilla/index.html
├── js/app.js
├── js/plantilla.js
├── css/app.css
├── css/vendors.css
├── css/plantilla.css
├── img/
├── fonts/
├── templates/
├── vendor/          # jquery, bootstrap, jspdf, …
└── config.json
```

## Actualización de dependencias

```bash
npm update
npm run build
npm test
```

Tras actualizar, revise visualmente la portada, ejercicios, PDF y códigos de configuración.

## Comparación visual

```bash
npm run build
npx playwright install chromium   # solo la primera vez
npm run visual
```

Genera capturas en `docs/migration/visual/` para:

- 375×812 (móvil)
- 768×1024 (tableta)
- 1366×768 (escritorio HD)
- 1440×900 (escritorio)

Con DPR=1 y animaciones desactivadas. Índice: `docs/migration/visual/index.html`.

## Pruebas

```bash
npm test          # suite CI estable (debe pasar en verde)
npm run test:ci   # alias de npm test
npm run test:all  # suite completa (incluye tests legacy conocidos)
```

La suite CI incluye:

- Pruebas de **caracterización** (`test/characterization.spec.js`) — defaults, operaciones fijas, códigos, aleatoriedad controlada
- Códigos de configuración (`test/OptionsShortcode.spec.js`)
- Custom element `paper-checkbox` cuando está presente

`npm run test:all` ejecuta también suites legacy con fallos documentados en `docs/migration/` (no bloquean el CI; se reportan como job `continue-on-error`).

## Códigos de configuración

Los códigos se generan y leen con `OptionsShortcode` (algoritmo sin cambios).  
Compatibilidad: configuración antigua → mismo código; código antiguo → misma configuración.

## PDF e impresión

- Descarga de hojas y soluciones con **jsPDF** + **html2canvas** (`src/imprimirPdf.js`).
- No se sustituye por `window.print()` como único flujo.
- Plantilla: `dist/plantilla/`.

## Navegadores compatibles

Navegadores modernos con soporte de:

- ES2018+
- Custom Elements / Shadow DOM (Polymer, MWC, xy-ui)
- `fetch`, CSS Grid/Flex

Chrome, Firefox, Safari y Edge actuales. IE no es objetivo.

## Documentación de migración

- [Auditoría](docs/migration/AUDITORIA.md)
- [Informe final](docs/migration/INFORME_FINAL.md)

## Licencia

GNU Affero General Public License. Consulte [LICENSE](./LICENSE).
