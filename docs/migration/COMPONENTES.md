# Sustitución gradual de componentes (Polymer / MDC / xy-ui)

Prioridad: **equivalencia** de apariencia, valores, eventos, foco y teclado.

## Inventario

| Componente | Uso | Estado |
|------------|-----|--------|
| `paper-checkbox` | Resto división, paréntesis | **Sustituido** por CE nativo (`src/components/paper-checkbox.js`) |
| `paper-expansion-panel` | Paneles config + ayuda | **Sustituido** por CE nativo (`src/widgets/paper-expansion-panel.js`) |
| `paper-dropdown-menu` | Resultado igual a… | **Sustituido** por CE nativo (`src/components/paper-dropdown-menu.js`) |
| `paper-item` (+ body) | Layout en paneles | **Sustituido** por CE nativo (`src/components/paper-item.js`) |
| `mwc-switch` | Enfocado, crono, límite, negativos | **Sustituido** por CE nativo (`src/components/mwc-switch.js`) |
| `xy-slider` | Nivel, crono, cantidad ops | **Vendored** en `src/components/xy-slider.js` (+ xy-tips) |
| MDC Dialog / TextField / Drawer | Código, ayuda | Mantener |

## Reglas de sustitución

1. Un componente por PR.
2. No cambiar textos ni IDs/clases/data-* de plantillas si se puede evitar.
3. Tras cada sustitución: `npm test`, `npm run visual`, smoke de ejercicios.
4. Documentar diferencias visuales conocidas (p. ej. ripple).

## paper-checkbox (completado)

- API: `.checked`, `.disabled`, atributos, `change` / `iron-change`, teclado Space/Enter.
- Plantillas HTML sin cambios de markup.
- Estilos: caja 18×18 Material-like; sin ripple Polymer.
- Dependencia npm `@polymer/paper-checkbox` eliminada.

## mwc-switch (completado)

- API: `.checked`, `.disabled`, atributos, `change` + burbujeo de `click` (app.js usa ambos).
- Teclado Space/Enter.
- Estilos: track/thumb Material; activo con `--mdc-theme-secondary` / `--colorPrincipal`.
- Dependencia npm `@material/mwc-switch` eliminada.

## paper-expansion-panel (completado)

- Atributos: `header`, `summary`, `icon`, `opened`, `no-animation`
- Evento `toggle`; propiedad `opened`
- Iconos Material Icons (expand_more/less; icon opcional en cabecera)
- Eliminados: `@polymer/iron-collapse`, `@polymer/iron-icons`, `@polymer/paper-icon-button`
- `paper-item` se mantiene en el contenido de las plantillas

## xy-slider (completado)

- Código local vendored desde xy-ui 1.10.7 (MIT): `xy-slider.js` + `xy-tips.js`
- Misma API: `.value`, `.disabled`, `.slider`, `.sliderCon` (tips/show)
- Dependencia npm `xy-ui` eliminada (evita traer todo el kit de componentes)

## paper-dropdown-menu (completado)

- CE nativo con `<select>` interno; lee opciones de `<paper-item>` en light DOM
- API: `.value`, `.disabled`, `label`, eventos `value-changed` y `change`
- Eliminados: `@polymer/paper-dropdown-menu`, `@polymer/paper-listbox`
- `paper-item` se mantiene como markup de opciones y layout de paneles

## paper-item (completado)

- CE nativos `paper-item` y `paper-item-body` (solo layout/slot)
- Eliminados: `@polymer/paper-item`, `@polymer/paper-styles`, `@polymer/polymer`,
  `@polymer/iron-flex-layout`, `@polymer/iron-a11y-announcer`

## Siguiente candidato sugerido

1. MDC Dialog / TextField / Drawer.

## Limpieza post-simplificación (v1.1.0)

- Eliminados de package/vendor: `mathjs`, `mustache`, `html2pdf.js`, `whatwg-fetch`.
- Eliminados demos: `src/view/pruebas.js`, `pruebas_ini.js`, `ejercicio.js`, `resultado.js`.
- Eliminados logos Netex/Altia de `src/img/`.
