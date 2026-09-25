import {Decimal} from 'decimal.js';

/**
 * Pure arithmetic used by every operation class.
 *
 * Decimal.js avoids binary-float drift on the values the generator emits.
 * Integers stay integers (parseInt). Values that are already non-integers
 * are rounded to 4 decimal places, which is the historical contract of
 * Operacion.multiplicarValores / sumarValores / restarValores / dividirValores.
 */

function hasFraction(lista) {
  return lista.some((x) => x % 1 != 0);
}

function finish(value, fractional) {
  if (fractional) return parseFloat(value.toFixed(4));
  return parseInt(value);
}

export function multiplyValues(lista) {
  const fractional = hasFraction(lista);
  let r = 1;
  for (let index = 0; index < lista.length; index++) {
    if (lista[index] !== undefined && lista[index] !== null) {
      r = new Decimal(r).mul(lista[index]);
    }
  }
  return finish(r, fractional);
}

export function divideValues(lista) {
  const fractional = hasFraction(lista);
  let r = lista[0];
  for (let index = 1; index < lista.length; index++) {
    r = new Decimal(r).div(lista[index]);
  }
  return finish(r, fractional);
}

export function sumValues(lista) {
  const fractional = hasFraction(lista);
  let r = 0;
  for (let index = 0; index < lista.length; index++) {
    if (lista[index] !== undefined && lista[index] !== null) {
      r = new Decimal(r).plus(lista[index]);
    }
  }
  return finish(r, fractional);
}

export function subtractValues(lista) {
  let r = lista[0] || 0;
  const fractional = hasFraction(lista);
  for (let index = 1; index < lista.length; index++) {
    if (lista[index] !== undefined && lista[index] !== null) {
      r = new Decimal(r).minus(lista[index]);
    }
  }
  return finish(r, fractional);
}
