# Pruebas

Node 24 es la versión del CI. `package.json` declara `engines.node` `>=24`.

```bash
npm ci
npm test          # suite única, bloqueante
npm run lint      # ESLint en flat config, bloqueante
npm run build
npm run check
npm run e2e       # hace falta el dist/ ya construido y Chromium de Playwright
npm run coverage      # resumen global de c8
npm run coverage:ci   # gate de cobertura de los módulos matemáticos ya saneados
```

`npm test` y `npm run test:all` ejecutan lo mismo. No hay una suite «legacy»
aparte ni `continue-on-error` en el CI.

GitHub Pages no se publica en paralelo con CI: el workflow de Pages se dispara tras un `CI` correcto sobre `main`. Los releases ejecutan lint, unit tests, build, comprobación de assets y E2E antes de empaquetar.

La cobertura bloqueante se aplica solo a `arithmetic.js`, `evaluate.js`, `expression.js` y `random.js`: 90% en líneas, funciones y statements, y 85% en branches. El legacy todavía no tiene un umbral global para evitar premiar tests superficiales; los módulos que salen del legacy deben entrar en este gate.

ESLint aplica reglas de corrección a todo `src/`. En los módulos ya saneados (`src/application`, reglas puras del motor y E2E), `no-unused-vars` también es bloqueante. El legacy restante, incluidos los scripts de build, se endurece de forma incremental para evitar cambios cosméticos masivos.

## Semilla

Los tests nuevos pasan `random: seededRandom(n)` al constructor. Para repetir
un caso:

```js
import {seededRandom} from '../src/operaciones/random.js';
const op = new Suma({nivel: 10, random: seededRandom(12345)});
```

Los specs nuevos inyectan su propia fuente. Para los casos legacy que todavía
no pasan `random`, `scripts/test.mjs` configura una fuente determinista a través
de `setDefaultRandom(seededRandom(1))`. El runner no modifica `Math.random`.

## Qué cubre cada grupo

| Fichero | Qué fija |
|---------|----------|
| `characterization.spec.js` | resultados con operandos dados, códigos cortos, semillas |
| `invariants.spec.js` | suma, producto, división exacta, evaluador, insignias |
| `operaciones.spec.js` | cada operación, con muchos casos históricos |
| `OperacionMultiple.spec.js` | expresiones combinadas con semilla |
| `parentesis.spec.js` | paréntesis, aunque el interruptor de la portada esté apagado |
| `generarExamen.spec.js` | la lista de un examen |
| `e2e/critical.spec.js` | portada, 10 aciertos, vista previa del PDF, ancho móvil |

La suite no conserva `it(...)` vacíos: esos marcadores históricos se sustituyeron por comentarios que explican los contratos no soportados o por los casos concretos que ya cubren ese comportamiento. Mocha se ejecuta con `--forbid-pending` y `--forbid-only`, por lo que un test pendiente o un `.only` falla CI.

La salida `console.log` del bundle legacy se silencia por defecto para que CI muestre las aserciones y errores útiles. Para investigar un caso con el ruido histórico habilitado, usa `ARITMATES_TEST_VERBOSE=1 npm test`.

## Reproducir un fallo

1. Anota la semilla del spec, o la semilla 1 del arranque de la suite.
2. Construye la operación con `seededRandom(esa semilla)`.
3. Compara `toString()` y `resultado`.

No se alargan timeouts para tapar un fallo intermitente.


## Calidad incremental

Los módulos ya saneados usan `no-unused-vars` y `no-console` como reglas bloqueantes. El alcance se amplía de forma gradual para no convertir una limpieza legacy en un cambio funcional masivo.

Los E2E de accesibilidad verifican nombres accesibles, estados ARIA, interacción por teclado, recorrido por tabulación y ausencia de identificadores HTML duplicados.
