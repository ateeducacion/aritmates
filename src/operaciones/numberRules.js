/**
 * Pure numeric helpers shared by operation classes.
 */

/**
 * Return multiples of num until the generated value reaches or exceeds limit.
 *
 * @param {number} num
 * @param {number} limit
 * @return {number[]}
 */
export function multiplesUntil(num, limit = 10) {
  const multiples = [];
  let value = 1;
  let factor = 2;

  while (value < limit) {
    value = num * factor;
    multiples.push(value);
    factor++;
  }

  return multiples;
}

/**
 * Return the number of decimal places represented by a number.
 *
 * @param {number|string} value
 * @return {number}
 */
export function decimalPlaces(value) {
  const match = String(value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) return 0;

  return Math.max(
      0,
      (match[1] ? match[1].length : 0) - (match[2] ? Number(match[2]) : 0),
  );
}

/**
 * Count defined operands after a given position.
 *
 * @param {Array} operands
 * @param {number} position
 * @param {number} operandCount
 * @return {number}
 */
export function countFollowingOperands(operands, position, operandCount) {
  let count = 0;
  for (let index = position + 1; index < operandCount; index++) {
    if (operands[index] !== undefined && operands[index] !== null) count++;
  }
  return count;
}

/**
 * Número de decimales permitido por nivel.
 *
 * @param {number} level
 * @return {number}
 */
export function decimalPlacesForLevel(level) {
  if (level > 20) return 3;
  if (level > 10) return 2;
  return 1;
}

/**
 * Cuenta operandos decimales siguiendo el límite histórico de cinco valores.
 *
 * @param {Array} operands
 * @return {number}
 */
export function countDecimalOperands(operands) {
  if (!Array.isArray(operands) || operands.length >= 5) return 0;
  return operands.filter((value) => value !== undefined && value % 1 != 0).length;
}

/**
 * Cuenta operandos negativos siguiendo el límite histórico de cinco valores.
 *
 * @param {Array} operands
 * @return {number}
 */
export function countNegativeOperands(operands) {
  if (!Array.isArray(operands) || operands.length >= 5) return 0;
  return operands.filter((value) => value < 0).length;
}


/**
 * Indica si un operando no fue proporcionado.
 *
 * Cero es un operando válido y no debe confundirse con ausencia de valor.
 *
 * @param {*} value
 * @return {boolean}
 */
export function isMissingOperand(value) {
  return value === undefined || value === null || value === '';
}

/**
 * Decide si una posición debe regenerarse.
 *
 * El motor histórico regenera ceros producidos automáticamente, pero debe
 * respetar un cero que venga explícitamente en los operandos iniciales.
 *
 * @param {*} value
 * @param {*} initialValue
 * @return {boolean}
 */
export function shouldGenerateOperand(value, initialValue) {
  if (isMissingOperand(value)) return true;
  return value === 0 && initialValue !== 0;
}
