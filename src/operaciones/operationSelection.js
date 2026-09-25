import OPERACIONES from './operaciones';
import {TIPO_NUMERO} from './tipoNumero';

/**
 * Selecciona los operadores de una expresión múltiple conservando las reglas
 * históricas de Aritmates.
 *
 * @param {object} options
 * @param {Array} options.operations tipos disponibles
 * @param {number} options.operandCount número total de operandos
 * @param {boolean} options.negativeResult si se exige resultado negativo
 * @param {Array} options.numberTypes tipos de número activos
 * @param {() => number} options.random fuente aleatoria
 * @return {Array}
 */
export function selectExpressionOperations({
  operations,
  operandCount,
  negativeResult = false,
  numberTypes = [],
  random,
}) {
  const available = operations.slice();
  const selected = [];
  const maxOperations = operandCount - 1;

  for (
    let index = 0;
    index < operations.length && index < maxOperations;
    index++
  ) {
    const position = Math.floor(random() * available.length);
    selected.push(available[position]);
    available.splice(position, 1);
  }

  while (selected.length < maxOperations) {
    const position = Math.floor(random() * operations.length);
    selected.push(operations[position]);
  }

  if (
    negativeResult &&
    !numberTypes.includes(TIPO_NUMERO.ENTERO) &&
    !selected.includes(OPERACIONES.RESTA)
  ) {
    const position = Math.floor(random() * selected.length);
    selected[position] = OPERACIONES.RESTA;
  }

  return selected;
}
