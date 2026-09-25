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
