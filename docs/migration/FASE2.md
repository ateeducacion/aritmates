# Fase 2 — Utilidades nativas y limpieza

## Objetivos

1. Reducir dependencias de utilidades pequeñas.
2. Corregir defectos documentados no funcionales de producto.
3. Mejorar UX menor (animación paneles) sin rediseño.
4. Eliminar basura de demos.

## Hecho en 1.3.0

| Ítem | Acción |
|------|--------|
| `combinations` | `src/utils/combinations.js` (compatible 1.0.0) |
| `shorthash` | `src/utils/shorthash.js` (compatible bibig MIT) |
| Typo config.version | Asigna a `DEFAULTS.version` |
| Paneles | Animación CSS `grid-template-rows` |
| jQuery en imprimirPdf | Import muerto eliminado |
| Archivos muertos | `pruebas.scss`, `dev.scss`, `basica.html`, etc. |

## No incluido (fase 2.1 / 3)

| Ítem | Motivo |
|------|--------|
| Eliminar jQuery | Cientos de usos en `app.js` y widgets; alto riesgo de regresión |
| Eliminar Bootstrap | Grid/utilidades en SCSS y tooltips; alto riesgo visual |
| Arreglar suite `test:all` legacy | Bugs de dominio preexistentes |
| Floating label MDC completa | Cosmético en modal de código |

## Pruebas de equivalencia de códigos

```bash
npm test   # incluye utils-native.spec.js + characterization de códigos
```

Los vectores `hello` → `79RmP` y JSON de muestra → `2lPQ2n` fijan la compatibilidad con shorthash.
