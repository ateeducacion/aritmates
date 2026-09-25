/**
 * Reglas puras para manipular operandos sin depender del estado de Operacion.
 */

export function hasOperandValue(operands, value) {
  return operands.some((operand) => operand == value);
}

export function countDefinedOperands(operands) {
  return operands.filter(
      (value) => value !== undefined && value !== null,
  ).length;
}
