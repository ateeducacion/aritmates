# Aritmates

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)
[![Deploy GitHub Pages](https://github.com/ateeducacion/aritmates/actions/workflows/pages.yml/badge.svg)](https://github.com/ateeducacion/aritmates/actions/workflows/pages.yml)

Aplicación del **Área de Tecnología Educativa** para generar y practicar ejercicios de matemáticas.  
Se publica como **sitio web estático** (HTML, CSS, JavaScript y assets locales).

**Versión simplificada 1.3** — misma funcionalidad y apariencia; arquitectura y dependencias reducidas  
(basada en un desarrollo previo de Netex y Altia).

**Demo (GitHub Pages):** <https://ateeducacion.github.io/aritmates/>

## Origen (upstream)

Este repositorio es la **versión simplificada y mantenida** por el Área de Tecnología Educativa.

El **código original** (antes de la simplificación a app estática) se conserva en el repositorio
upstream del Gobierno de Canarias:

```text
https://www3.gobiernodecanarias.org/educacion/cau_ce/repositoriocodigo/UCTICEE/OperacionesMatematicas.git
```

Para compararlo en local:

```bash
git remote add upstream \
  https://www3.gobiernodecanarias.org/educacion/cau_ce/repositoriocodigo/UCTICEE/OperacionesMatematicas.git
git fetch upstream
```

## Inicio rápido

```bash
npm ci
npm run build    # genera dist/
npm run dev      # build + http://127.0.0.1:9012/
```

| Comando | Uso |
|---------|-----|
| `npm ci` | Instala dependencias |
| `npm run build` | Prepara `dist/` para publicar |
| `npm run dev` | Desarrollo local |
| `npm run serve` | Sirve `dist/` (sin recompilar) |
| `npm test` | Pruebas estables (CI) |
| `npm run test:all` | Suite completa (incluye tests legacy) |
| `npm run visual` | Capturas multi-viewport (Playwright) |
| `npm run check` | Verifica recursos en `dist/` |

## Qué es la versión simplificada

| Antes | Ahora |
|-------|--------|
| Webpack, Babel, loaders | Scripts Node + Sass + esbuild |
| Polymer, MDC JS, xy-ui | Componentes nativos en `src/components/` |
| CDN / dependencias de UI pesadas | Todo local en `dist/` y `dist/vendor/` |
| Node en producción | Solo hace falta Node para build y desarrollo |

Documentación detallada: **[docs/SIMPLIFICACION.md](docs/SIMPLIFICACION.md)**.

## Estructura

```text
src/           código y plantillas de la app
css/           estilos fuente (SCSS/CSS)
scripts/       build, serve, tests, vendor
test/          pruebas
docs/          documentación de la simplificación
dist/          salida publicable (generada; no requiere Node)
```

## Despliegue

Publique el contenido de **`dist/`** en cualquier servidor de archivos estáticos  
(Nginx, Apache, GitHub Pages, etc.).

- Rutas **relativas**: funciona en la raíz o en un subdirectorio (`/aritmates/`).
- Ajuste `baseurl` en `src/config.json` si usa el envío de resultados a un backend  
  (valor de ejemplo en el repositorio; cámbielo al de su entorno).

```json
{
  "baseurl": "https://ejemplo.org/ruta/a/aritmates/"
}
```

### GitHub Pages (automático)

En cada push a `main`, el workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. Instala dependencias y ejecuta `npm run build`
2. Fija `baseurl` a la URL del project site (`https://<org>.github.io/<repo>/`)
3. Publica `dist/` con **GitHub Actions → Pages**

**Activación (una vez por repositorio):**  
Settings → Pages → **Source: GitHub Actions**.

También se puede lanzar a mano: Actions → *Deploy GitHub Pages* → *Run workflow*.

## Dependencias de runtime (resumen)

| Paquete | Uso |
|---------|-----|
| jQuery | DOM y eventos |
| Bootstrap 5 | Layout y utilidades |
| Decimal.js | Precisión decimal |
| jsPDF + html2canvas | PDF |
| Font Awesome, Roboto, Material Icons | Tipografía e iconos |
| combinations / shorthash | Reimplementados en `src/utils/` |

jQuery y Bootstrap se mantienen a propósito: están muy acoplados a la UI actual;  
retirarlos no aporta valor frente al riesgo de regresión.

## Pruebas y capturas

```bash
npm test
npm run visual   # requiere: npx playwright install chromium
```

Capturas de referencia: `docs/visual/`.

## Autoría

- Desarrollo original: Fernando Ramírez Pérez (Altia)
- Versión simplificada y mantenimiento: **Área de Tecnología Educativa**

## Licencia

[GNU Affero General Public License](./LICENSE).
