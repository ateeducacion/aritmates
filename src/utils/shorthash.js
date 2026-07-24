/**
 * shorthash compatible con bibig/node-shorthash (MIT).
 * Misma API: unique(text) — usado para hashes de configuración.
 *
 * @see https://github.com/bibig/node-shorthash
 */

function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
  }
  return hash;
}

function binaryTransfer(integer, binary) {
  binary = binary || 62;
  const stack = [];
  let num;
  let result = '';
  const sign = integer < 0 ? '-' : '';

  function table(n) {
    const t = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return t[n];
  }

  integer = Math.abs(integer);

  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    stack.push(table(num));
  }

  if (integer > 0) {
    stack.push(table(integer));
  }

  for (let i = stack.length - 1; i >= 0; i--) {
    result += stack[i];
  }

  return sign + result;
}

/**
 * Hash corto determinista de un texto.
 * @param {string} text
 * @return {string}
 */
export function unique(text) {
  const id = binaryTransfer(bitwise(text), 61);
  return id.replace('-', 'Z');
}

export default {unique, bitwise, binaryTransfer};
