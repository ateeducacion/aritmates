# Componentes de UI (versión simplificada)

Referencia técnica de los custom elements propios.  
Contexto general: [SIMPLIFICACION.md](./SIMPLIFICACION.md).

Se mantienen. Cada uno es corto, cubre teclado y ARIA, y `app.js` y las
plantillas hablan su API (`checked`, `value`, `change`). Sustituirlos por
`<input>` o `<select>` nativos movería ese cableado y el CSS, no lo eliminaría.
No se añade otra librería de componentes.

`paper-item` es solo maquetación dentro de los paneles de ayuda. Sigue porque
las plantillas de ayuda lo usan como bloque de texto.

| Etiqueta | Fichero | Notas |
|----------|---------|--------|
| `paper-checkbox` | `src/components/paper-checkbox.js` | API `checked` / `disabled` / `change` |
| `mwc-switch` | `src/components/mwc-switch.js` | `change` + `click` (compat. app.js) |
| `paper-expansion-panel` | `src/widgets/paper-expansion-panel.js` | `header`, `opened`, animación CSS |
| `xy-slider` | `src/components/xy-slider.js` | Vendored de xy-ui (MIT); `.slider`, `.sliderCon` |
| `paper-dropdown-menu` | `src/components/paper-dropdown-menu.js` | `value`, `value-changed` |
| `paper-item` / `paper-item-body` | `src/components/paper-item.js` | Solo layout |
| Diálogo / drawer | `src/components/mdc-compat.js` | API `open`/`close`; CSS MDC en `css/` |

Estilos MDC estáticos (sin paquetes `@material/*` JS):

- `css/mdc.dialog.min.css`
- `css/mdc.drawer.min.css`

El campo de texto de los diálogos (`mdc-text-field`) y el separador de los drawers (`mdc-list-divider`) usan unas pocas reglas propias en `css/main.scss`.
