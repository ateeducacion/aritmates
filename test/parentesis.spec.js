
import OPERACIONES from '../src/operaciones/operaciones';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-match'));

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

    expect(actual).to.equal(expected);
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

    expect(actual).to.equal(expected);
  });

  it('*+- al azar -> positivos y sin decimales', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 4,
          tiposNumero: [
            TIPO_NUMERO.NATURAL,
          ],
          tiposOperacion: [
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
          ],
          parentesis: true,
        }
    );
    const actual = op.toString();

    expect(actual).to.match(
        /^(\( )?[0-9]+( \))? [-+∙\/] (\( )?[0-9]+( \))? [-+∙\/] (\( )?[0-9]+( \))? [-+∙\/] (\( )?[0-9]+( \))? = [0-9]+$/
    );
  });

  it('*/+- al azar -> positivos y decimales', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: false,
          tiposNumero: [
            TIPO_NUMERO.NATURAL,
            TIPO_NUMERO.DECIMAL,
          ],
          tiposOperacion: [
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
          ],
          parentesis: true,
        }
    );
    const actual = op.toString();

    expect(actual).to.match(
        /^(\( )?[0-9]+( \))? [-+∙\/] (\( )?[0-9]+( \))? [-+∙\/] (\( )?[0-9]+( \))? [-+∙\/] (\( )?[0-9]+( \))? = [0-9]+$/
    );
  });

  it('*/+- al azar -> negativos y sin decimales 4 operandos', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: true,
          tiposOperacion: [
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
          ],
          parentesis: true,
        }
    );
    const actual = op.toString();
    // /^  incio
    //   (\( )?-?[0-9]+ [-+∙\/] // = ( -8 o 8
    //   (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] // ( (-34) ) * o ( 34 ) * o ( 34 *...
    //   (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] // igual
    //   (\( )?\(?-?[0-9]+\)?( \))? // sin el simbolo al final
    //   = -?[0-9]+$/ // = -34  o = 23 no 34.3

    expect(actual).to.match(
        /^(\( )?-?[0-9]+ [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? = -?[0-9]+$/);
  });

  it('*/+- al azar -> negativos y decimales 4 operandos', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 4,
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
        /^(\( )?-?[0-9]+[.]?([0-9]+)? [-+∙\/] (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+[.]?([0-9]+)?\)?( \))? = -?[0-9]+[.]?([0-9]+)?/
    );
    // /^(\( )?-?[0-9]+ [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? = -?[0-9]+[.]?([0-9]+)?/ );
  });

  it('*/+- al azar -> negativos y sin decimales, 3 operandos', () => {
    const op = new OperacionMultiple(
        {
          nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: true,
          tiposOperacion: [
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
          ],
          parentesis: true,
        }
    );
    const actual = op.toString();
    // /^  incio
    //   (\( )?-?[0-9]+ [-+∙\/] // = ( -8 o 8
    //   (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] // ( (-34) ) * o ( 34 ) * o ( 34 *...
    //   (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] // igual
    //   (\( )?\(?-?[0-9]+\)?( \))? // sin el simbolo al final
    //   = -?[0-9]+$/ // = -34  o = 23 no 34.3

    expect(actual).to.match(
        /^(\( )?-?[0-9]+ [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? [-+∙\/] (\( )?\(?-?[0-9]+\)?( \))? = -?[0-9]+$/);
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

