import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import Multiplicacion from '../src/operaciones/multiplicacion';
import {seededRandom} from '../src/operaciones/random';
import {isMissingOperand, shouldGenerateOperand} from '../src/operaciones/numberRules';

const expect = require('chai').expect;

describe('Cero como operando explícito', () => {
  it('solo considera ausentes null, undefined y cadena vacía', () => {
    expect(isMissingOperand(undefined)).to.equal(true);
    expect(isMissingOperand(null)).to.equal(true);
    expect(isMissingOperand('')).to.equal(true);
    expect(isMissingOperand(0)).to.equal(false);
    expect(isMissingOperand('0')).to.equal(false);
    expect(shouldGenerateOperand(0, 0)).to.equal(false);
    expect(shouldGenerateOperand(0, undefined)).to.equal(true);
    expect(shouldGenerateOperand(5, undefined)).to.equal(false);
  });

  it('Suma conserva un cero enviado por el usuario', () => {
    const op = new Suma({
      cantidadOperandos: 2,
      operandos: [0, 5],
      random: seededRandom(11),
    });
    expect(op.operandos).to.deep.equal([0, 5]);
    expect(Number(op.resultado)).to.equal(5);
  });

  it('Resta conserva un cero enviado por el usuario', () => {
    const op = new Resta({
      cantidadOperandos: 2,
      operandos: [5, 0],
      random: seededRandom(12),
    });
    expect(op.operandos).to.deep.equal([5, 0]);
    expect(Number(op.resultado)).to.equal(5);
  });

  it('Multiplicación conserva un cero enviado por el usuario', () => {
    const op = new Multiplicacion({
      cantidadOperandos: 2,
      operandos: [0, 5],
      random: seededRandom(13),
    });
    expect(op.operandos).to.deep.equal([0, 5]);
    expect(Number(op.resultado)).to.equal(0);
  });
});
