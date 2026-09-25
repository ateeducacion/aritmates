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
 * Index of the first (or, when reverse, last) operator whose type is in
 * `busqueda`. The ordering matches the historical scan: among types that
 * occur, pick the leftmost occurrence, or the rightmost when reverse.
 */
export function indexOfAny(operaciones, busqueda, reverse) {
  if (!hasAny(operaciones, busqueda)) return -1;

  const found = [];
  busqueda.forEach((tipoOperacion) => {
    found.push({
      tipo: tipoOperacion,
      first: operaciones.indexOf(tipoOperacion),
      last: operaciones.lastIndexOf(tipoOperacion),
    });
  });

  const present = [];
  if (!reverse) {
    for (let indx = 0; indx < found.length; indx++) {
      if (found[indx].first != -1) present.push(found[indx]);
    }
    present.sort(function(a, b) {
      return a.first < b.first ? -1 : 1;
    });
    if (present[0] !== undefined) return present[0].first;
    return -1;
  }

  for (let indx = 0; indx < found.length; indx++) {
    if (found[indx].last != -1) present.push(found[indx]);
  }
  present.sort(function(a, b) {
    if (a.last !== -1) return a.last < b.last ? -1 : 1;
    return -1;
  });
  if (present[0] !== undefined) return present[0].last;
  return -1;
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
 * Collapse every multiplication and division, left to right, into a single
 * value. `evalAt(tipo, [left, right])` must return `{ resultado }`.
 *
 * @param {Array} operandos
 * @param {Array} operaciones
 * @param {(tipo: string, pair: Array) => {resultado: *}} evalAt
 */
export function foldMulDiv(operandos, operaciones, evalAt) {
  const mOperandos = operandos.slice();
  const mOperaciones = operaciones.slice();

  while (hasAny(mOperaciones, MUL_DIV)) {
    const index = indexOfAny(mOperaciones, MUL_DIV, false);
    const tipoOp = mOperaciones[index];
    const op = evalAt(tipoOp, [mOperandos[index], mOperandos[index + 1]]);
    mOperandos[index] = op.resultado;
    mOperandos.splice(index + 1, 1);
    mOperaciones.splice(index, 1);
  }

  for (let i = 0; i < mOperandos.length; i++) {
    const v = mOperandos[i];
    if (v !== undefined && v.constructor && v.constructor.name === 'Decimal') {
      mOperandos[i] = parseFloat(v);
    }
  }

  return {operandos: mOperandos, operaciones: mOperaciones};
}

/**
 * Rewrite a − b as a + (−b) so a later sum can solve the chain.
 *
 * The guard below is intentionally the historical expression
 * `indexOf(RESTA != -1)`. `RESTA != -1` is always true, `indexOf(true)` is
 * -1, and `if (-1)` is true, so the branch always runs. Changing it to
 * `indexOf(RESTA) != -1` would share the caller's array when there is no
 * subtraction (the else branch assigns the same reference). Callers mutate
 * the result, so that would be a functional change. Kept as-is.
 */
export function subtractionsAsNegativeSums(operandos, operaciones) {
  if (hasAny(operaciones, MUL_DIV)) return {};

  let mOperandos = [];
  let mOperaciones = [];

  if (operaciones.indexOf(OPERACIONES.RESTA != -1)) {
    mOperandos.push(operandos[0]);
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
  } else {
    mOperandos = operandos;
    mOperaciones = operaciones;
  }

  return {operandos: mOperandos, operaciones: mOperaciones};
}

/**
 * Rewrite a + b as a − (−b). Same always-true indexOf guard as
 * subtractionsAsNegativeSums; see that comment.
 */
export function additionsAsSubtractions(operandos, operaciones) {
  if (hasAny(operaciones, MUL_DIV)) return {};

  let mOperandos = [];
  let mOperaciones = [];
  const cambios = [];

  if (operaciones.indexOf(OPERACIONES.SUMA != -1)) {
    mOperandos.push(operandos[0]);
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
  } else {
    mOperandos = operandos;
    mOperaciones = operaciones;
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

export function onlySumSub(operaciones) {
  const hay = hasAny(operaciones, SUM_SUB);
  const hayOtros = hasAny(operaciones, MUL_DIV);
  return hay && !hayOtros;
}

export function onlyMulDiv(operaciones) {
  const hay = hasAny(operaciones, MUL_DIV);
  const hayOtros = hasAny(operaciones, SUM_SUB);
  return hay && !hayOtros;
}


/**
 * Group adjacent operators of the same type.
 *
 * When user operands are supplied, each group keeps the operand slice and the
 * historical operator-position metadata expected by OperacionMultiple.
 *
 * @param {Array} operations
 * @param {Array} operands
 * @param {boolean} includeOperands
 * @return {Array}
 */
export function groupSimilarOperations(operations, operands = [], includeOperands = false) {
  const groups = [];
  let previous = '';
  let firstIndex = 0;

  operations.forEach((operation, index) => {
    if (index > 0 && previous == operation) {
      if (includeOperands) {
        groups[firstIndex].operandos.push(operands[index + 1]);
        groups[firstIndex].posicionOperadores.push(index + 1);
      }
      groups[firstIndex].cantidadOperandos++;
      return;
    }

    firstIndex = index;
    previous = operation;
    groups[firstIndex] = {
      tipo: operation,
      cantidadOperandos: 2,
    };

    if (includeOperands) {
      groups[firstIndex].operandos = [operands[index], operands[index + 1]];
      groups[firstIndex].posicionOperadores = [index, index + 1];
    }
  });

  return groups;
}
