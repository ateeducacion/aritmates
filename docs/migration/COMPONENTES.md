# Sustitución gradual de componentes (Polymer / MDC / xy-ui)

Prioridad: **equivalencia** de apariencia, valores, eventos, foco y teclado.

## Inventario

| Componente | Uso | Estado |
|------------|-----|--------|
| `paper-checkbox` | Resto división, paréntesis | **Sustituido** por CE nativo (`src/components/paper-checkbox.js`) |
| `paper-expansion-panel` | Paneles config + ayuda | Mantener (Polymer) |
| `paper-dropdown-menu` + listbox/item | Resultado igual a… | Mantener |
| `mwc-switch` | Enfocado, crono, límite, negativos | Mantener |
| `xy-slider` | Nivel, crono, cantidad ops | Mantener |
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

## Siguiente candidato sugerido

1. `mwc-switch` → switch nativo estilizado (API `.checked` ya usada).
2. `paper-expansion-panel` → details/summary o CE propio (más riesgo visual).
3. `xy-slider` (alto acoplamiento a `.slider` / `.sliderCon`).

## Limpieza post-simplificación (v1.1.0)

- Eliminados de package/vendor: `mathjs`, `mustache`, `html2pdf.js`, `whatwg-fetch`.
- Eliminados demos: `src/view/pruebas.js`, `pruebas_ini.js`, `ejercicio.js`, `resultado.js`.
- Eliminados logos Netex/Altia de `src/img/`.
