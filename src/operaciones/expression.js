import OPERACIONES from './operaciones';

/**
 * Rules for combined exercises: which operators bind first, and how a
 * sequence of sums and subtractions is rewritten before it is solved.
 *
 * These functions do not generate numbers and do not touch the DOM.
 * OperacionMultiple calls them and applies the results to its own state.
 */

export const MUL_DIV = [
  OPERACIONES.MULTIPLICACION,
  OPERACIONES.DIVISION,
  OPERACIONES.DIVISION_ENTERA,
  OPERACIONES.DIVISION_DECIMAL,
  OPERACIONES.DIVISION_RESTO,
];

export const SUM_SUB = [OPERACIONES.SUMA, OPERACIONES.RESTA];

export const DIVISIONS = [
  OPERACIONES.DIVISION,
  OPERACIONES.DIVISION_ENTERA,
  OPERACIONES.DIVISION_DECIMAL,
  OPERACIONES.DIVISION_RESTO,
];

export function symbolFor(operacion) {
  switch (operacion) {
    case OPERACIONES.SUMA:
      return '+';
    case OPERACIONES.RESTA:
      return '-';
    case OPERACIONES.MULTIPLICACION:
      return '∙';
    case OPERACIONES.DIVISION_RESTO:
    case OPERACIONES.DIVISION_ENTERA:
    case OPERACIONES.DIVISION:
    case OPERACIONES.DIVISION_DECIMAL:
      return '/';
    default:
      return '+';
  }
}

export function symbolsFor(operaciones) {
  return operaciones.map((op) => symbolFor(op));
}

export function hasAny(operaciones, needles) {
  let found = false;
  needles.forEach((needle) => {
    found = operaciones.indexOf(needle) != -1 || found;
  });
  return found;
}

/**
 * True when both lists contain the same operator types, ignoring order.
 */
export function sameOperatorMultiset(tiposA, tiposB) {
  const a = JSON.stringify(tiposA.slice().sort());
  const b = JSON.stringify(tiposB.slice().sort());
  return a == b;
}

/**
 * Rewrite a − b as a + (−b) so a later sum can solve the chain.
 *
 * Always returns fresh arrays. The historical implementation also copied
 * every sum/subtraction chain because its indexOf guard was accidentally
 * always true; preserving that copy semantics avoids aliasing callers.
 */
export function subtractionsAsNegativeSums(operandos, operaciones) {
  if (hasAny(operaciones, MUL_DIV)) return {};

  const mOperandos = [operandos[0]];
  const mOperaciones = [];

  for (let index = 1; index <= operaciones.length; index++) {
    const operacion = operaciones[index - 1];
    switch (operacion) {
      case OPERACIONES.SUMA:
        mOperandos.push(operandos[index]);
        mOperaciones.push(operacion);
        break;
      case OPERACIONES.RESTA:
        mOperandos.push(operandos[index] * -1);
        mOperaciones.push(OPERACIONES.SUMA);
        break;
      default:
        break;
    }
  }

  return {operandos: mOperandos, operaciones: mOperaciones};
}

/**
 * Rewrite a + b as a − (−b), also returning fresh arrays.
 */
export function additionsAsSubtractions(operandos, operaciones) {
  if (hasAny(operaciones, MUL_DIV)) return {};

  const mOperandos = [operandos[0]];
  const mOperaciones = [];
  const cambios = [];

  for (let index = 1; index <= operaciones.length; index++) {
    const operacion = operaciones[index - 1];
    switch (operacion) {
      case OPERACIONES.SUMA:
        mOperandos.push(operandos[index] * -1);
        mOperaciones.push(OPERACIONES.RESTA);
        cambios.push(index);
        break;
      case OPERACIONES.RESTA:
        mOperandos.push(operandos[index]);
        mOperaciones.push(operacion);
        break;
      default:
        break;
    }
  }

  return {operandos: mOperandos, operaciones: mOperaciones, cambios};
}

/**
 * How many adjacent operators of the same kind sit on `posicion`.
 * Division walks backward; every other operator walks forward.
 * That asymmetry is what the generator uses when it fills operands.
 */
export function countAdjacent(operaciones, posicion, operacion) {
  let numOperacionesJuntas = 1;
  if (operacion == OPERACIONES.DIVISION_ENTERA) {
    let i = posicion - 1;
    while (operaciones[i] == operacion) {
      numOperacionesJuntas++;
      i--;
    }
  } else {
    let i = posicion;
    numOperacionesJuntas = 0;
    while (operaciones[i] == operacion) {
      numOperacionesJuntas++;
      i++;
    }
  }
  return numOperacionesJuntas;
}

export function onlyMulDiv(operaciones) {
  const hay = hasAny(operaciones, MUL_DIV);
  const hayOtros = hasAny(operaciones, SUM_SUB);
  return hay && !hayOtros;
}

/**
 * La colocación automática de paréntesis solo tiene sentido a partir de
 * tres operandos y cuando existe al menos un operador de precedencia alta.
 * Las posiciones explícitas se gestionan aparte y siempre se respetan.
 */
export function canAutoPlaceParentheses(operandCount, operations) {
  return operandCount >= 3 && hasAny(operations, MUL_DIV);
}


