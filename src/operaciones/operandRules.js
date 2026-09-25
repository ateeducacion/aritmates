/**
 * Reglas puras para manipular operandos sin depender del estado de Operacion.
 */

export function hasOperandValue(operands, value) {
  return operands.some((operand) => operand == value);
}

export function invertOperandSign(operands, index = 0) {
  const next = operands.slice();
  const operand = next[index];
  if (operand) next[index] = operand * -1;
  return next;
}

export function invertAllOperandSigns(operands) {
  return operands.reduce(
      (next, _operand, index) => invertOperandSign(next, index),
      operands.slice(),
  );
}

export function sortOperandsDescending(operands, levelPosition) {
  const levelOperand =
    levelPosition === undefined ? undefined : operands[levelPosition];

  const sorted = operands.slice().sort((a, b) => b - a);
  let nextLevelPosition = levelPosition;

  if (levelPosition !== undefined) {
    for (let index = 0; index < sorted.length; index++) {
      if (sorted[index] == levelOperand) nextLevelPosition = index;
    }
  }

  return {
    operands: sorted,
    levelPosition: nextLevelPosition,
  };
}

export function countDefinedOperands(operands) {
  return operands.filter(
      (value) => value !== undefined && value !== null,
  ).length;
}
