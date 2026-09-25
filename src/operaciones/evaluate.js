/**
 * Evaluates the arithmetic subset that combined exercises actually emit.
 *
 * Replaces eval() on strings such as "3 * 2 + ( 5 - 1 )". The grammar is
 * the same one JavaScript uses for these operators: unary +/-, parentheses,
 * * and / before + and -, all left-associative. Nothing else is accepted,
 * so a generated (or shared) expression cannot run as code.
 *
 * @param {string} expression
 * @return {number}
 */
export function evaluateArithmetic(expression) {
  const src = String(expression);
  let i = 0;

  function skip() {
    while (src[i] === ' ' || src[i] === '\n' || src[i] === '\t') i++;
  }

  function parseUnary() {
    skip();
    if (src[i] === '+') {
      i++;
      return parseUnary();
    }
    if (src[i] === '-') {
      i++;
      return -parseUnary();
    }
    if (/[A-Za-z_]/.test(src[i] || '')) {
      // Legacy expressions sometimes contain the identifier `undefined`
      // when generation left a hole. eval() treated that as NaN; so do we.
      while (i < src.length && /[A-Za-z0-9_]/.test(src[i])) i++;
      return NaN;
    }
    if (src[i] === '(') {
      i++;
      const value = parseAdd();
      skip();
      if (src[i] !== ')') {
        throw new Error('Expected closing parenthesis in "' + src + '"');
      }
      i++;
      return value;
    }
    return parseNumber();
  }

  function parseNumber() {
    skip();
    const start = i;
    while (i < src.length && /[0-9.]/.test(src[i])) i++;
    if (start === i) {
      throw new Error('Expected number at ' + i + ' in "' + src + '"');
    }
    const n = Number(src.slice(start, i));
    if (!Number.isFinite(n)) {
      throw new Error('Invalid number in "' + src + '"');
    }
    return n;
  }

  function parseMul() {
    let left = parseUnary();
    for (;;) {
      skip();
      if (src[i] === '*') {
        i++;
        left *= parseUnary();
      } else if (src[i] === '/') {
        i++;
        left /= parseUnary();
      } else {
        break;
      }
    }
    return left;
  }

  function parseAdd() {
    let left = parseMul();
    for (;;) {
      skip();
      if (src[i] === '+') {
        i++;
        left += parseMul();
      } else if (src[i] === '-') {
        i++;
        left -= parseMul();
      } else {
        break;
      }
    }
    return left;
  }

  const value = parseAdd();
  skip();
  if (i !== src.length) {
    throw new Error('Trailing input "' + src.slice(i) + '"');
  }
  return value;
}
