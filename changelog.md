# Changelog

## CSS de terceros más ligero (post 1.3)

No cambia el aspecto de la aplicación.

* La medalla, el cohete y el logo de GitHub son SVG en línea. Font Awesome ya no se instala ni se publica: eran tres iconos.
* El campo de texto de los diálogos y el separador de los drawers usan unas reglas propias en lugar de `mdc.textfield.min.css` y `mdc.list.min.css`.
* `dist/css/vendors.css` pasa de 194 KB a 21 KB.

## Sumas con «resultado igual a» (post 1.3)

* Con «resultado igual a» (activable desde el código corto), las sumas mostraban igualdades falsas como `12 + (-18) = 30`, incluso con los negativos desactivados. Ahora los operandos suman el valor pedido, sin negativos si no se permiten y en múltiplos de 10 cuando el valor es 100. Restas, multiplicaciones y divisiones ya cuadraban y no cambian.

## Hoja de la portada (post 1.3)

* La ilustración de la portada vuelve a ocupar la columna derecha y a apoyar el borde inferior en la caja, como en la versión de Medusa. En Bootstrap 5 la columna ya no era el punto de anclaje.
* La hoja mantiene su tamaño intrínseco en lugar de estirarse al ancho de la columna y la esquina plegada elimina el padding que Bootstrap 5 aplica a los hijos directos de una `.row`.

## Ayuda: pestañas por ancla (post 1.3)

* `#nav-resta`, `#nav-suma`, `#nav-multiplicacion` y `#nav-division` abren la ayuda en esa operación. Antes el enlace no cambiaba de pestaña.

## Imágenes más ligeras (post 1.3)

No cambia la portada ni los ejercicios.

* Los PNG y SVG de `src/img/` ocupan menos: se quitó metadata y se comprimieron. Las infografías de la ayuda siguen siendo vectoriales.
* La ilustración de la hoja, los fondos de impresión y el póster del murciélago bajan de peso sin cambiar el dibujo.

## Portada más rápida (post 1.3)

* La portada deja de quedarse en «Cargando...» hasta que terminan las imágenes.
* html2canvas y jsPDF solo se descargan al imprimir. La vista previa del PDF no los necesita.

## Skills de pruebas (post 1.3)

No cambia la aplicación.

* `test-gap-audit` señala comportamiento sin una prueba que lo fije. No edita el código salvo que se pida, y sigue el estilo de `npm test`.
* `playwright-trace` inspecciona la traza de un flujo de extremo a extremo que ha fallado, con el Playwright que ya está instalado.

## Guía de agentes y skills (post 1.3)

No cambia la aplicación que ve el usuario.

* `AGENTS.md` deja por escrito las reglas de mantenimiento: aplicación estática, motor sin DOM, tests con semilla y sin cambiar los ejercicios de paso.
* Skills de terceros en `.agents/skills/`, con una copia en `.claude/skills/`: revisión de workflows, auditoría de seguridad y Playwright.
* Cada lunes, `.github/workflows/update-agent-skills.yml` comprueba si hay actualización y abre un pull request. No empuja a `main`.

## Refactorización del motor y calidad (post 1.3)

No cambia la funcionalidad que el usuario tiene en la portada. Sigue siendo una aplicación estática, sin PHP.

* El motor separa reglas y generación. `arithmetic.js`, `expression.js`, `evaluate.js` y `random.js` no dependen del DOM. Las operaciones combinadas ya no se evalúan con `eval`.
* La generación acepta un generador inyectado (`seededRandom`). Sin él sigue usando `Math.random`.
* Una sola suite: `npm test`. El CI ejecuta lint, tests, build, comprobación de `dist/` y tres flujos Playwright. Ya no hay `continue-on-error` ni `eslint … || true`.
* Node soportado: 24 o superior, alineado con el workflow.
* ESLint en `eslint.config.js`, solo reglas de corrección.
* Correcciones que antes impedían construir el ejercicio o leer el resultado: variable `valOpPosteriores` sin declarar en la resta; `math.abs` tras quitar mathjs; factorización de no enteros; variable `resultado` inexistente en una multiplicación; constructor de operación combinada que devolvía un objeto plano; paréntesis de más de dos operandos; `opcionesGuardadas` invisible para la pantalla de resultados.
* Eliminados `shallow-equal`, Babel, JSHint y los tests Selenium que ya no se ejecutaban.
* El envío por correo no vuelve. Se quitó en 1.0.4 y en `upstream` la llamada estaba comentada.
* Documentación: `docs/ARCHITECTURE.md`, `docs/MATH-ENGINE.md`, `docs/TESTING.md`.

## Documentación (post 1.3)

* Eliminado árbol HTML histórico de JSDoc y `conf.js` (no formaba parte del build).
* README y `docs/` reescritos en torno a la versión simplificada.
* Eliminados informes de migración y guías obsoletas (Selenium, instalar JSDoc).
* Capturas de referencia en `docs/visual/`.
* Sanitización de URLs de entornos internos (DEV/PRE) en fuente y docs.
* README: código original en la rama `upstream`; demo en GitHub Pages.
* Workflow `pages.yml`: build de `dist/` y despliegue automático a GitHub Pages en push a `main`.

## Aritmates 1.3.0 - Fase 2 (utilidades nativas y limpieza)

* Autoría de la versión simplificada: **Área de Tecnología Educativa**, manteniendo la autoría original de Fernando Ramírez Pérez en el código base.
* `combinations` y `shorthash` implementados en `src/utils/` (misma semántica de códigos).
* Corregido typo: `config.version` actualiza `DEFAULTS.version` (no `baseurl`).
* Animación suave al expandir/colapsar paneles (`paper-expansion-panel`).
* Eliminado import jQuery no usado en `imprimirPdf.js`.
* Limpieza: CSS/plantillas de demos no usados (`pruebas.scss`, `basica.html`, etc.).
* Versión UI: `1.3.0`.

## Aritmates 1.2.0 - UI nativa y build minificado

* Sustitución completa de controles Polymer / MDC / xy-ui por componentes nativos o vendored en `src/components/`.
* Sin dependencias `@polymer/*`, `@material/*` ni `xy-ui`.
* Build: esbuild con **minify**; Material Icons vía `material-design-icons` + `css/material-icons.css` (sin wrapper webpack).
* Versión de aplicación en UI: `1.2.0`.

## Aritmates 1.1.0 - Versión simplificada (estática)

* Publicación como aplicación web estática (HTML/CSS/JS + `dist/vendor`), sin Webpack/Babel en producción.
* Créditos: texto de versión simplificada basada en desarrollo previo de Netex y Altia (sin logos de ambas empresas).
* Eliminación de dependencias no usadas: `whatwg-fetch`, `mustache`, `mathjs`, `html2pdf.js`.
* Eliminación de entradas de prueba antiguas (`src/view/pruebas*`, etc.) y assets de logos Netex/Altia.
* Build con scripts Node nativos + Sass + esbuild; jQuery, Bootstrap, html2canvas y jsPDF cargados desde `vendor/`.
* `paper-checkbox` nativo en lugar de Polymer para ese control.
* Versión de aplicación en UI: `1.1.0`.

## Aritmates 1.0.6 - Actualización y liberación de código

Esta sección describe las tareas y mejoras planificadas para la versión 1.0.6:

* Publicar el proyecto en GitHub siguiendo buenas prácticas.
* Aplicar actualizaciones para corregir vulnerabilidades de seguridad.
* Refactorizar el código para mejorar mantenibilidad y legibilidad.
* Añadir o mejorar pruebas unitarias e integración.
* Actualizar y fijar dependencias.
* Mejorar documentación y ejemplos de uso.
* Configurar integración continua y pipelines de despliegue.

## Aritmates 1.0.5

* Descargar resultados de ejercicios en PDF.
* Enlaces actualizados para aviso legal y privacidad.
* Actualizada la opción de imprimir ejercicios en PDF.
* Cambio logos en creditos y pdf

### Notas de despliegue

En `config.json`, revise `baseurl` (URL pública de la app en su entorno):

```json
{
  "baseurl": "https://ejemplo.org/ruta/a/aritmates/"
}
```

## Aritmates 1.0.4

* Eliminada la funcionalidad de enviar los resultados por correo electrónico

## Aritmates 1.0.3

* Solucionar incidencia con mwc-switch

## Aritmates 1.0.2

* Cambios logos gobierno de canarias
* Actualización librerías JS
* Actualización librerías JS

### Notas para instalación

Seguir el proceso del README. En despliegues antiguos se pedía conservar
`config.json` del entorno al sobrescribir `dist/`.

## Aritmates 1.0.1

* Archivo de opciones predeterminadas (config.json)
* Nuevas ilustraciones en la sección de ayuda

## Aritmates 1.0.0

Versión inicial