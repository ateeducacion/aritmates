# Versión simplificada de Aritmates

Resumen de la migración a aplicación web estática y la reducción de dependencias  
(versión **1.3**).

## Objetivos

1. Publicar solo archivos estáticos (`dist/`), sin Node en producción.
2. Mantener el **100 % de la funcionalidad** y la **misma apariencia**.
3. Eliminar Webpack/Babel y componentes de UI difíciles de mantener.
4. Conservar códigos de configuración, PDF e impresión.

## Arquitectura

```text
npm ci  →  npm run build  →  dist/  →  servidor HTTP estático
npm run dev  →  build + servidor local (puerto 9012)
```

| Pieza | Herramienta |
|-------|-------------|
| Copia y limpieza | scripts Node (`scripts/*.mjs`) |
| CSS | Sass |
| JS de la app | esbuild (IIFE minificado) |
| Librerías UMD | `dist/vendor/` (jQuery, Bootstrap, jsPDF, …) |
| Controles de UI | custom elements en `src/components/` |

## Componentes de UI

Los controles Polymer / MDC / xy-ui se sustituyeron o adaptaron:

| Control | Implementación |
|---------|----------------|
| Checkbox | `src/components/paper-checkbox.js` |
| Switch | `src/components/mwc-switch.js` |
| Panel expandible | `src/widgets/paper-expansion-panel.js` |
| Slider | `src/components/xy-slider.js` (+ xy-tips) |
| Dropdown | `src/components/paper-dropdown-menu.js` |
| Ítem de lista | `src/components/paper-item.js` |
| Diálogo / drawer / text field | `src/components/mdc-compat.js` + CSS MDC local |

Inventario más detallado: [COMPONENTES.md](./COMPONENTES.md).

## Utilidades propias

| Antes (npm) | Ahora |
|-------------|--------|
| `combinations` | `src/utils/combinations.js` |
| `shorthash` | `src/utils/shorthash.js` |

Los códigos de ejercicios/configuración son **compatibles** con versiones anteriores  
(mismos algoritmos).

## Fases realizadas

| Versión | Contenido |
|---------|-----------|
| 1.1 | App estática, vendor local, limpieza de deps y demos |
| 1.2 | UI nativa, minify, Material Icons locales |
| 1.3 | Utils nativos, animación de paneles, tipografía de autoría ATE |

## Qué no se ha hecho (a propósito)

- **No** se elimina jQuery ni Bootstrap: alto acoplamiento y poco beneficio.
- **No** se reescriben las reglas matemáticas ni se “arreglan” bugs de dominio en la migración.
- La suite `npm run test:all` incluye tests legacy con fallos conocidos; el CI usa `npm test`.

## Despliegue y configuración

1. `npm ci && npm run build`
2. Publicar `dist/`
3. Revisar `config.json` (sobre todo `baseurl` si hay backend de resultados)

En el repositorio, `baseurl` es `./` (rutas relativas). Cada entorno debe  
poner su URL pública si el envío de resultados lo requiere. **No** commitear  
hosts de PRE/DEV internos.

## Documentación relacionada

- [COMPONENTES.md](./COMPONENTES.md) — inventario de custom elements  
- [visual/](./visual/) — capturas multi-viewport  
- [README](../README.md) — inicio rápido y comandos  

## Autoría

- Original: Fernando Ramírez Pérez (Altia) y trabajo previo de Netex/Altia  
- Versión simplificada y mantenimiento: Área de Tecnología Educativa  
 
