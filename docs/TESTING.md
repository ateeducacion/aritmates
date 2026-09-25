# Pruebas

Node 24 es la versión del CI. `package.json` declara `engines.node` `>=24`.

```bash
npm ci
npm test          # suite única, bloqueante
npm run lint      # ESLint en flat config, bloqueante
npm run build
npm run check
npm run e2e       # hace falta el dist/ ya construido y Chromium de Playwright
npm run coverage  # resumen de c8; no hay un porcentaje mínimo
```

`npm test` y `npm run test:all` ejecutan lo mismo. No hay una suite «legacy»
aparte ni `continue-on-error` en el CI.

## Semilla

Los tests nuevos pasan `random: seededRandom(n)` al constructor. Para repetir
un caso:

```js
import {seededRandom} from '../src/operaciones/random.js';
const op = new Suma({nivel: 10, random: seededRandom(12345)});
```

El arranque de `scripts/test.mjs` también deja `Math.random` en una secuencia
fija (semilla 1) para los spec que todavía no inyectan generador. Esa
sustitución solo existe dentro del proceso de test.

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

Hay `it(...)` sin cuerpo en `resultadoNegativo.spec.js` y `operaciones.spec.js`.
Mocha los cuenta como pending. Son huecos que el autor original dejó escritos
(complementarios, negativos en producto y división) y no una suite en rojo.

## Reproducir un fallo

1. Anota la semilla del spec, o la semilla 1 del arranque de la suite.
2. Construye la operación con `seededRandom(esa semilla)`.
3. Compara `toString()` y `resultado`.

No se alargan timeouts para tapar un fallo intermitente.
