import OPERACIONES from '../operaciones/operaciones';
import {TIPO_NUMERO} from '../operaciones/tipoNumero';

function sameValues(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((value) => b.includes(value));
}

export function operationAvailability(operationTypes = []) {
  const onlyDivision =
    sameValues(operationTypes, [OPERACIONES.DIVISION]) ||
    sameValues(operationTypes, [OPERACIONES.DIVISION_RESTO]);

  const onlyRemainderDivision =
    sameValues(operationTypes, [OPERACIONES.DIVISION_RESTO]);

  return {
    onlyDivision,
    disableNegativeNumbers: onlyDivision,
    disableDecimals: onlyRemainderDivision,
  };
}

export function requiresTwoOperands(operationTypes = [], numberTypes = []) {
  return (
    (
      numberTypes.includes(TIPO_NUMERO.DECIMAL) &&
      sameValues(operationTypes, [OPERACIONES.DIVISION])
    ) ||
    operationTypes.includes(OPERACIONES.DIVISION_RESTO)
  );
}

export function canEnableNegativeResult({
  negativeNumbersSelected,
  sumSelected,
  subtractionSelected,
  divisionSelected,
  multiplicationSelected,
  onlyDivision,
  operandCount,
}) {
  return (
    (negativeNumbersSelected && !onlyDivision) ||
    (
      subtractionSelected &&
      !divisionSelected &&
      !multiplicationSelected &&
      !sumSelected
    ) ||
    (subtractionSelected && Number(operandCount) > 2)
  );
}
