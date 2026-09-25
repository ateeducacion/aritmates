
import OPERACIONES from '../src/operaciones/operaciones';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import {seededRandom} from '../src/operaciones/random';
import {assertSolved} from './assertExercise';
import {canAutoPlaceParentheses} from '../src/operaciones/expression';

const expect = require('chai').expect;

describe('Parentesis', () => {
  it('5 * 2 + 5 con parentesis deberia devolver 5 * ( 2 + 5 )', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: [OPERACIONES.MULTIPLICACION, OPERACIONES.SUMA],
          operandos: [5, 2, 5],
          tiposOperacionAzar: false,
          parentesis: true,
        }
    );
    const actual = op.resultado;
    // 5 * ( 2 + 5 )
    const expected = 5*7;

    expect(Number(actual)).to.equal(expected);
  });

  it('5 * 2 + 5 SIN parentesis deberia devolver 5 * 2 + 5 ', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: [OPERACIONES.MULTIPLICACION, OPERACIONES.SUMA],
          operandos: [5, 2, 5],
          tiposOperacionAzar: false,
        }
    );
    const actual = op.resultado;
    // 5 * ( 2 + 5 )
    const expected = 15;

    expect(Number(actual)).to.equal(expected);
  });

  it('*+- al azar -> positivos y sin decimales', () => {
    const op = new OperacionMultiple({
      nivel: 50,
      cantidadOperandos: 4,
      random: seededRandom(1),
      tiposNumero: [TIPO_NUMERO.NATURAL],
      tiposOperacion: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
      ],
      parentesis: true,
    });
    expect(op.toString()).to.include('(');
    assertSolved(op, {allowNegativeResult: false});
    expect(op.toString()).to.not.match(/\./);
  });

  it('*/+- al azar -> positivos y decimales', () => {
    const op = new OperacionMultiple({
      nivel: 50,
      cantidadOperandos: 4,
      permitirNegativos: false,
      random: seededRandom(1),
      tiposNumero: [TIPO_NUMERO.NATURAL, TIPO_NUMERO.DECIMAL],
      tiposOperacion: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
      ],
      parentesis: true,
    });
    expect(op.toString()).to.match(/\d\.\d/);
    expect(op.toString()).to.include('(');
    assertSolved(op, {allowNegativeResult: false});
  });

  it('*/+- al azar -> negativos y sin decimales 4 operandos', () => {
    const op = new OperacionMultiple({
      nivel: 50,
      cantidadOperandos: 4,
      permitirNegativos: true,
      random: seededRandom(1),
      tiposOperacion: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
      ],
      parentesis: true,
    });
    expect(op.toString()).to.include('(');
    expect(op.toString()).to.not.match(/\d\.\d/);
    assertSolved(op);
  });

  it('*/+- al azar -> negativos y decimales 4 operandos', () => {
    const op = new OperacionMultiple({
      nivel: 50,
      cantidadOperandos: 4,
      permitirNegativos: true,
      random: seededRandom(2),
      tiposOperacion: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.DIVISION_DECIMAL,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
      ],
      parentesis: true,
    });
    expect(op.toString()).to.include('(');
    assertSolved(op);
  });

  it('*/+- al azar -> negativos y operandos enteros, 3 operandos', () => {
    const op = new OperacionMultiple({
      nivel: 50,
      cantidadOperandos: 3,
      permitirNegativos: true,
      random: seededRandom(3),
      tiposOperacion: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
      ],
      parentesis: true,
    });

    expect(op.toString()).to.include('(');
    expect(op.operandos.every((value) => Number.isInteger(Number(value))))
        .to.equal(true);
    assertSolved(op);
  });

  it('*/+- al azar -> negativos y decimales 3 operandos', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: true,
          tiposOperacion: [
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.DIVISION_DECIMAL,
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
          ],
          parentesis: true,
        }
    );
    const actual = op.toString();
    // /^(\( )?-?[0-9]+[.]?([0-9]+)? [-+∙\/]
    // (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))? [-+∙\/]
    // (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))? [-+∙\/]
    // (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))?
    // = -?[0-9]+[.]?([0-9]+)?/
    expect(actual).to.match(
        /^(\( )?-?[0-9]+[.]?([0-9]+)? [-+∙\/] (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))? = -?[0-9]+[.]?([0-9]+)?/
    );
  });
});



describe('Regla de colocación automática de paréntesis', () => {
  it('no coloca paréntesis automáticos si solo hay sumas y restas', () => {
    expect(canAutoPlaceParentheses(
        3,
        [OPERACIONES.SUMA, OPERACIONES.RESTA],
    )).to.equal(false);

    const op = new OperacionMultiple({
      cantidadOperandos: 3,
      operandos: [5, 2, 1],
      tiposOperacion: [OPERACIONES.SUMA, OPERACIONES.RESTA],
      tiposOperacionAzar: false,
      parentesis: true,
    });

    expect(op.toString()).to.not.include('(');
    expect(Number(op.resultado)).to.equal(6);
  });

  it('mantiene posiciones explícitas aunque no haya multiplicación o división', () => {
    const op = new OperacionMultiple({
      cantidadOperandos: 3,
      operandos: [5, 2, 1],
      tiposOperacion: [OPERACIONES.SUMA, OPERACIONES.RESTA],
      tiposOperacionAzar: false,
      parentesis: true,
      posicionParentesis: [0, 2],
    });

    expect(op.toString()).to.include('(');
    expect(Number(op.resultado)).to.equal(6);
  });

  it('permite paréntesis automáticos cuando hay precedencia alta', () => {
    expect(canAutoPlaceParentheses(
        3,
        [OPERACIONES.MULTIPLICACION, OPERACIONES.SUMA],
    )).to.equal(true);
  });
});
