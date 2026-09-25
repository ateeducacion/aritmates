# Motor matemático

Genera ejercicios de suma, resta, multiplicación y división, y expresiones
combinadas. No es una calculadora genérica: cada ejercicio tiene que cumplir
las restricciones de la portada (nivel, tipo de número, signo del resultado).

## Piezas

| Módulo | Responsabilidad |
|--------|-----------------|
| `random.js` | `Math.random` en producción, o una función con semilla en tests |
| `arithmetic.js` | suma, resta, producto y división de una lista, con Decimal.js |
| `expression.js` | precedencia, reescrituras y agrupación de operadores consecutivos |
| `evaluate.js` | valor de una expresión ya escrita (`+ - * /` y paréntesis) |
| `operacion.js` | clase base: límites, signos, factorización, texto |
| `suma.js`, `resta.js`, `multiplicacion.js`, `division*.js` | generación de cada operación |
| `OperacionMultiple.js` | varias operaciones en un solo ejercicio |
| `generarExamen.js` | la lista que ve el alumno |

`calcularResultado` de una operación combinada ya no usa `eval`. Pasa el texto
por `evaluateArithmetic`, que solo acepta números y esos operadores.

## Nivel

El nivel de la portada es el techo de los operandos generados (1–20, y también
50, 100 y 500). Con **enfocado** activo, uno de los números del ejercicio es
exactamente ese nivel. Sirve, por ejemplo, para practicar la tabla del 10.

## Tipos de número

| Valor | Significado |
|-------|-------------|
| Natural | operandos ≥ 0 |
| Entero | se permiten negativos |
| Decimal | hay parte fraccionaria; los decimales máximos dependen del nivel |
| Múltiplo de 10 o de 100 | los operandos salen en esa rejilla |

Entero y natural a la vez no se contradicen en la práctica: si el usuario marca
enteros, `permitirNegativos` queda activo.

## División

- **Entera**: el dividendo es un múltiplo del divisor. No se divide por cero.
- **Con resto**: el cociente es la división entera y el resto se muestra aparte. No admite la opción «resultado igual a».
- **Decimal**: el cociente puede no ser entero.

Las divisiones no admiten operandos negativos. Si la configuración los pide, la
operación registra un error y no se da por válida.

## Signo del resultado

«Resultado negativo» obliga a que el resultado sea menor que cero. Sin esa
opción, y sin enteros, el generador reintenta. El reintento tiene un tope
(`deep > 2` dentro de `comprobarResultado`, y `DEFAULTS.reCalcTries` como
techo más alto). Si se agota, `resultado` queda en `false`: el ejercicio no
sirve y `GenerarExamen` pide otro.

Ese tope es corto a propósito. Algunas combinaciones de resta, producto y
división siguen saliendo negativas en los primeros intentos. No se ha cambiado
el tope: alargarlo alteraría qué ejercicios aparecen.

## Precedencia

En una expresión combinada, productos y divisiones se resuelven antes que
sumas y restas, de izquierda a derecha. Es la misma regla que JavaScript para
estos operadores. `3 ∙ 2 + 5` vale 11, no 21.

Los paréntesis están en el código y en el código corto, pero el interruptor de
la portada está apagado (`ENABLE.parentesis` es `false`). Un código antiguo
que los pida sigue pudiendo activarlos.

## Una suma al lado de un producto

En `crearSumasParaMultiplicacionSuma` hubo un bloque que cambiaba el signo del
primer operando. El comentario original decía que no se entendía y que
parecía pensado solo para las restas. El bloque ya estaba desactivado. Se ha
eliminado. No cambia los ejercicios: no se ejecutaba.

## Reescrituras suma/resta

Las transformaciones que convierten restas en sumas con signo (y viceversa)
siempre devuelven arrays nuevos. El código histórico conseguía accidentalmente
esa copia mediante un guard `indexOf(... != -1)` siempre verdadero. La
condición se ha eliminado, pero se conserva de forma explícita la semántica de
copia para que quien llama pueda modificar el resultado sin mutar sus entradas.

## Aleatoriedad

```js
import {seededRandom} from './operaciones/random.js';

const op = new Suma({
  nivel: 10,
  random: seededRandom(12345),
});
```

La misma semilla repite operandos y resultado. Sin `random`, se usa
`Math.random`.

La suite de tests, además, sustituye `Math.random` por una semilla fija al
arrancar. Así los spec antiguos que no pasan `random` también se repiten.
Un spec nuevo debe pasar su propia semilla si quiere aislarse del resto.


## Debug y determinismo

`globalThis.debug` solo controla trazas de diagnóstico. Con la misma configuración
y la misma semilla, activar o desactivar debug produce los mismos operandos,
operadores, resultado y texto. Los bloques de logging no ejecutan reglas del
motor ni modifican `errors`.
