import {evaluateArithmetic} from '../src/operaciones/evaluate.js';

const expect = require('chai').expect;

/**
 * Checks that a generated exercise is a real equation:
 * the text parses, the printed result matches the object, and
 * re-evaluating the expression agrees to 3 decimal places
 * (the precision calcularResultado stores).
 *
 * `operators` is the binary operator sequence, in order.
 * Parenthesized negatives are not counted as operators.
 */
export function assertSolved(op, {operators, allowNegativeResult = true} = {}) {
  expect(op).to.be.an('object');
  expect(op.resultado).to.not.equal(false);
  const text = op.toString();
  expect(text, text).to.be.a('string');
  expect(text, text).to.not.match(/undefined|NaN|\[object| = false/);

  const parts = text.split(' = ');
  expect(parts, text).to.have.length(2);
  const [expr, printed] = parts;
  expect(Number(printed)).to.equal(Number(op.resultado));

  const value = evaluateArithmetic(expr.replaceAll('∙', '*'));
  expect(Number(value.toFixed(3))).to.equal(Number(Number(op.resultado).toFixed(3)));

  if (operators) {
    const body = expr.replaceAll('(-', '(');
    const found = body.match(/[+\-∙/]/g) || [];
    expect(found, text).to.deep.equal(operators);
  }

  if (!allowNegativeResult) {
    expect(Number(op.resultado), text).to.be.at.least(0);
  }
}
