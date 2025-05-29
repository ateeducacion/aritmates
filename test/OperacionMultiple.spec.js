
import OPERACIONES from '../src/operaciones/operaciones';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-match'));

describe('Operacion Multiple 4 operandos o mas', () => {
  it('Multiplicación de 4 operandos expresada con solo un tipo de operacion', () => {
    debug = false;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 4,
          tiposOperacion: [
            'multiplicacion',
          ],
          // tiposOperacionAzar: true,
          operandos: [
            32423, 421, 4321, 4,
          ],
        }
    );

    const actual = op.toString();
    const expected = '32423 ∙ 421 ∙ 4321 ∙ 4 = 235928034572';

    expect(actual).to.equal(expected);
    debug = false;
  });

  it('Multiplicación de 4 operandos 32423 ∙ 421 ∙ 4321 ∙ 4 = 235928034572', () => {
    debug = false;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 4,
          tiposOperacion: [
            'multiplicacion',
            'multiplicacion',
            'multiplicacion',
          ],
          operandos: [
            32423, 421, 4321, 4,
          ],
        }
    );

    const actual = op.toString();
    const expected = '32423 ∙ 421 ∙ 4321 ∙ 4 = 235928034572';

    expect(actual).to.equal(expected);
    debug = false;
  });

  it('Division entera de 4 operandos 235928034572 / 32423 / 421 / 4321 = 4 ', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 4,
          tiposOperacion: [
            'multiplicacion',
            'multiplicacion',
            'multiplicacion',
          ],
          operandos: [
            32423, 421, 4321, 4,
          ],
        }
    );

    const actual = op.toString();
    const expected = '32423 ∙ 421 ∙ 4321 ∙ 4 = 235928034572';

    expect(actual).to.equal(expected);
    debug = false;
  });

  it('debería 3 ∙ 2 + 1 - 5 = 2', () => {
    debug = false;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: false,
          tiposOperacion: [
            'multiplicacion',
            'suma',
            'resta',
          ],
          tiposOperacionAzar: false,
          operandos: [3, 2, 1, 5]}
    );

    const actual = op.toString();
    const expected = '3 ∙ 2 + 1 - 5 = 2'; // => ( -1 ∙ 5 ) + 3 + 2 => -5 + 3 + 2 => 0
    // const expected = '3 + 2 - ( 1 ∙ 5 ) = 0'; // => 5 - 5 = 0

    expect(actual).to.equal(expected);
  });

  it('debería 3 + 2 * 1 - 5 = 0', () => {
    debug = false;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: false,
          tiposOperacion: [
            'suma',
            'multiplicacion',
            'resta',
          ],
          tiposOperacionAzar: false,
          operandos: [3, 2, 1, 5]}
    );

    const actual = op.toString();
    const expected = '3 + 2 ∙ 1 - 5 = 0'; // => ( -1 ∙ 5 ) + 3 + 2 => -5 + 3 + 2 => 0
    // const expected = '3 + 2 - ( 1 ∙ 5 ) = 0'; // => 5 - 5 = 0

    expect(actual).to.equal(expected);
  });


  it('debería 3 + 2 - 1 ∙ 5 = 0', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: false,
          tiposOperacion: ['suma', 'resta', 'multiplicacion'],
          tiposOperacionAzar: false,
          operandos: [3, 2, 1, 5]}
    );

    const actual = op.toString();
    const expected = '3 + 2 - 1 ∙ 5 = 0'; // => ( -1 ∙ 5 ) + 3 + 2 => -5 + 3 + 2 => 0
    // const expected = '3 + 2 - ( 1 ∙ 5 ) = 0'; // => 5 - 5 = 0

    expect(actual).to.equal(expected);
  });

  it('debería 7 + 3 + 2 + 1 - 5 - 23 = -15', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 6,
          permitirNegativos: false,
          tiposOperacion: [
            'suma',
            'suma',
            'suma',
            'resta',
            'resta',
          ],
          tiposOperacionAzar: false,
          operandos: [7, 3, 2, 1, 5, 23]}
    );

    const actual = op.toString();
    const expected = '7 + 3 + 2 + 1 - 5 - 23 = -15';
    // => 7 + 3 + 2 + 1 = 13
    // 13 -28 = -15

    // const expected = '3 + 2 - ( 1 ∙ 5 ) = 0'; // => 5 - 5 = 0

    expect(actual).to.equal(expected);
    debug = false;
  });

  it('debería 7 + 3 + 2 ∙ 1 - 5 - 23 = -16', () => {
    debug = false;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 6,
          permitirNegativos: false,
          tiposOperacion: [
            'suma',
            'suma',
            'multiplicacion',
            'resta',
            'resta',
          ],
          tiposOperacionAzar: false,
          operandos: [7, 3, 2, 1, 5, 23]}
    );

    const actual = op.toString();
    const expected = '7 + 3 + 2 ∙ 1 - 5 - 23 = -16'; // => ( -1 ∙ 5 ) + 3 + 2 => -5 + 3 + 2 => 0
    // const expected = '3 + 2 - ( 1 ∙ 5 ) = 0'; // => 5 - 5 = 0

    expect(actual).to.equal(expected);
  });

  it('debería 7 + 3 ∙ 2 + 1 - 5 - 23 = -14', () => {
    debug = false;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 6,
          permitirNegativos: false,
          tiposOperacion: [
            'suma',
            'multiplicacion',
            'suma',
            'resta',
            'resta',
          ],
          tiposOperacionAzar: false,
          operandos: [7, 3, 2, 1, 5, 23]}
    );

    const actual = op.toString();
    const expected = '7 + 3 ∙ 2 + 1 - 5 - 23 = -14'; // => ( -1 ∙ 5 ) + 3 + 2 => -5 + 3 + 2 => 0
    // const expected = '3 + 2 - ( 1 ∙ 5 ) = 0'; // => 5 - 5 = 0

    expect(actual).to.equal(expected);
  });

  it('debería 7 ∙ 3 + 2 + 1 - 5 - 23 = -4', () => {
    debug = false;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 6,
          permitirNegativos: false,
          tiposOperacion: [
            'multiplicacion',
            'suma',
            'suma',
            'resta',
            'resta',
          ],
          tiposOperacionAzar: false,
          operandos: [7, 3, 2, 1, 5, 23]}
    );

    const actual = op.toString();
    const expected = '7 ∙ 3 + 2 + 1 - 5 - 23 = -4'; // => ( -1 ∙ 5 ) + 3 + 2 => -5 + 3 + 2 => 0
    // const expected = '3 + 2 - ( 1 ∙ 5 ) = 0'; // => 5 - 5 = 0

    expect(actual).to.equal(expected);
  });

  it('Crear una operacion de 4 operandos al azar solo divisiones',
      () => {
        debug = false;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 4,
              permitirNegativos: false,
              tiposOperacion: [
                // OPERACIONES.SUMA,
                // OPERACIONES.RESTA,
                // OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();

        // que cumpla la regexp
        // const expected = '/[0-9]+ [+*/-] [0-9]+ [+*/-] [0-9]+ [+*/-] [0-9]+ = [0-9]+/'; // => 5 - 5 = 0
        // expect(actual).to.match(expected);
        // let a = '1 + 3 + 34 / 12 = 34';
        expect(actual).to.match(/[0-9]+ \/ [0-9]+ \/ [0-9]+ \/ [0-9]+ = [0-9]+/);
        if ( debug ) console.log(actual);

        // expect('some thing to test').to.match(/some (\w+) to test/).and.capture(0).equals('thing');
        // 'Here in London'.should.match(/(here|there) in (\w+)/i).and.capture(1).equals('London');
        debug = false;
      }
  );

  it(' 1 + 3 ∙ 3 - 1 ∙ 2 = 8 ', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 5,
          tiposOperacion: [
            'suma', 'multiplicacion', 'resta', 'multiplicacion',
          ],
          tiposOperacionAzar: false,
          operandos: [
            1, 3, 3, 1, 2,
          ],
        }
    );

    const actual = op.toString();
    const expected = '1 + 3 ∙ 3 - 1 ∙ 2 = 8';

    expect(actual).to.equal(expected);
    debug = false;
  });

  it(' 1 + 3 / 3 - 1 ∙ 2 = 0 ', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 5,
          tiposOperacion: [
            OPERACIONES.SUMA,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
          ],
          tiposOperacionAzar: false,
          operandos: [
            1, 3, 3, 1, 2,
          ],
        }
    );

    const actual = op.toString();
    const expected = '1 + 3 / 3 - 1 ∙ 2 = 0';

    expect(actual).to.equal(expected);
    debug = false;
  });

  it('4 operandos con +-/*',
      () => {
        // debug = true;
        const op = new OperacionMultiple(
            {
              nivel: 50,
              cantidadOperandos: 4,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.SUMA,
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();

        // que cumpla la regexp
        // const expected = '/[0-9]+ [+*/-] [0-9]+ [+*/-] [0-9]+ [+*/-] [0-9]+ = [0-9]+/'; // => 5 - 5 = 0
        // expect(actual).to.match(expected);
        // let a = '1 + 3 + 34 / 12 = 34';
        expect(actual).to.match(/^[0-9]+ [∙\/\-+] [0-9]+ [∙\/\-+] [0-9]+ [∙\/\-+] [0-9]+ = -?[0-9]+$/);
        if ( debug ) console.log(actual);

        // expect('some thing to test').to.match(/some (\w+) to test/).and.capture(0).equals('thing');
        // 'Here in London'.should.match(/(here|there) in (\w+)/i).and.capture(1).equals('London');
        debug = false;
      }
  );


  it('4 operandos combinando ∙ / el resultado a de ser un numero entero',
      () => {
        // debug = true;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 4,
              permitirNegativos: false,
              tiposOperacion: [
                // OPERACIONES.SUMA,
                // OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [∙\/] [0-9]+ [∙\/] [0-9]+ = ([0-9])+$/
        );
        if ( debug ) console.log(actual);
        debug = false;
      }
  );

  it('4 operandos combinando */+- el resultado a de ser un numero entero positivo',
      () => {
        // debug = true;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 4,
              tiposNumero: [TIPO_NUMERO.NATURAL],
              tiposOperacion: [
                OPERACIONES.SUMA,
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [∙\/+\-] [0-9]+ [∙\/+\-] [0-9]+ [∙\/+\-] [0-9]+ = ([0-9])+$/
        );
        if ( debug ) console.log(actual);
        debug = false;
      }
  );

  it('5 operandos combinando */+- el resultado a de ser un numero entero',
      () => {
        // debug = true;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 5,
              // permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.SUMA,
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [∙\/+\-] [0-9]+ [∙\/+\-] [0-9]+ [∙\/+\-] [0-9]+ [∙\/+\-] [0-9]+ = ([0-9])+$/
        );
        console.log(actual);
        debug = false;
      }
  );

  it('A - B ∙ C - D / E',
      () => {
        // FIXME: falla a veces, la op devuelve un resultado negativo!
        // debug = true;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 5,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.RESTA,
                OPERACIONES.DIVISION_ENTERA,
              ],
              tiposOperacionAzar: false,
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ \- [0-9]+ \* [0-9]+ \- [0-9]+ \/ [0-9]+ = [0-9]+$/);

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('A - B ∙ C / D',
      () => {
        // FIXME: falla a veces, la op devuelve un resultado negativo!

        // debug = true;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 4,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
              tiposOperacionAzar: false,
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ \- [0-9]+ \* [0-9]+ \/ [0-9]+ = [0-9]+$/);

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('A / B ∙ C / D - E',
      () => {
        // debug = true;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 5,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.DIVISION_ENTERA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
                OPERACIONES.RESTA,
              ],
              tiposOperacionAzar: false,
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ \/ [0-9]+ \* [0-9]+ \/ [0-9]+ \- [0-9]+ = [0-9]+$/);

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('A - B - C ∙ D - E',
      () => {
        // debug = true;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 5,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.RESTA,
              ],
              tiposOperacionAzar: false,
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ \- [0-9]+ \- [0-9]+ [∙] [0-9]+ \- [0-9]+ = [0-9]+$/);

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('A - B ∙ C - D',
      () => {
        // debug = true;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 4,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.RESTA,
              ],
              tiposOperacionAzar: false,
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [-] [0-9]+ [∙] [0-9]+ [-] [0-9]+ = [0-9]+$/);

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('A - B - C / D - E',
      () => {
        debug = false;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 5,
              // permitirNegativos: false,
              tiposNumero: [TIPO_NUMERO.NATURAL],
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.RESTA,
                OPERACIONES.DIVISION_ENTERA,
                OPERACIONES.RESTA,
              ],
              tiposOperacionAzar: false,
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ \- \( [0-9]+ \- [0-9]+ \/ [0-9]+ \- [0-9]+ = [0-9]+$/);

        console.log('actual', actual);
        debug = false;
      }
  );
  it('A ∙ B / C - D - E',
      () => {
        // debug = true;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 5,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
                OPERACIONES.RESTA,
                OPERACIONES.RESTA,
              ],
              tiposOperacionAzar: false,
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ \* [0-9]+ [∙\/] [0-9]+ \- [0-9]+ \- [0-9]+ = [0-9]+$/);

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('Permitir Negativos A - B - C ∙ D - E',
      () => {
        // debug = true;

        const op = new OperacionMultiple(
            {
              nivel: 50,
              cantidadOperandos: 5,
              tiposOperacionAzar: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.RESTA,
              ],
              permitirNegativos: true,
            }
        );
        const actual = op.toString();

        expect(actual).to.match(
            /^-?[0-9]+ [-] \(?-?[0-9]+\)? [-] \(?-?[0-9]+\)? [∙] -?[0-9]+ [-] \(?-?[0-9]+\)? = -?[0-9]+$/);
        // console.log('actual', actual);
        debug = false;
      }
  );

  it('Permitir Negativos A - B - C / D - E',
      () => {
        // debug = true;

        const op = new OperacionMultiple(
            {
              nivel: 50,
              cantidadOperandos: 5,
              tiposOperacionAzar: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.RESTA,
                OPERACIONES.DIVISION_ENTERA,
                OPERACIONES.RESTA,
              ],
              permitirNegativos: true,
            }
        );
        const actual = op.toString();

        expect(actual).to.match(
            /-?[0-9]+ [-] \(?-?[0-9]+\)? [-] \(?-?[0-9]+\)? [\/] -?[0-9]+ [-] \(?-?[0-9]+\)? = -?[0-9]+$/
        );

        // console.log('actual', actual);
        debug = false;
      }
  );
});

describe('Operacion Multiple', () => {
  it('01 debería devolver operacion de 3 operandos, suma y resta', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: ['suma', 'resta'],
          operandos: [3, 2, 1],
          tiposOperacionAzar: false,
        }
    );

    const actual = op.toString();
    const expected = '3 + 2 - 1 = 4';

    // console.log(op);

    expect(actual).to.equal(expected);

    debug = false;
  });

  it('debería devolver 3 operandos, una suma y una multiplicación', () => {
    debug = false;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: ['suma', 'multiplicacion'],
          operandos: [3, 2, 5],
          tiposOperacionAzar: false,
        }
    );

    const actual = op.toString();
    const expected = '3 + 2 ∙ 5 = 13';

    expect(actual).to.equal(expected);
  });

  // pruebo otras combinaciones de sumas, restas multiplicaciones por si acaso

  it('debería 3 ∙ 2 + 5 = 11', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: ['multiplicacion', 'suma'],
          tiposOperacionAzar: false,
          operandos: [3, 2, 5]}
    );

    const actual = op.toString();
    const expected = '3 ∙ 2 + 5 = 11';

    expect(actual).to.equal(expected);
    debug = false;
  });

  it('debería 1 - 3 ∙ 2 + 5 = 0', () => {
    // debug = true;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 4,
          tiposOperacion: ['resta', 'multiplicacion', 'suma'],
          tiposOperacionAzar: false,
          operandos: [1, 3, 2, 5]}
    );

    const actual = op.toString();
    const expected = '1 - 3 ∙ 2 + 5 = 0';

    expect(actual).to.equal(expected);
  });

  it(' sumas y restas grandes 1', () => {
    debug = false;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 4,
          tiposOperacion: [
            'suma', 'resta',
            'suma',
          ],
          tiposOperacionAzar: false,
          operandos: [
            871, 783, 7873,
            781,
          ],
        }
    );

    const actual = op.toString();
    const expected = '871 + 783 - 7873 + 781 = -5438';

    expect(actual).to.equal(expected);
  });

  it(' sumas y restas grandes 2', () => {
    debug = false;

    const op = new OperacionMultiple(
        {
          cantidadOperandos: 7,
          tiposOperacion: [
            'suma', 'resta',
            'suma', 'resta',
            'suma', 'resta',
          ],
          tiposOperacionAzar: false,
          operandos: [
            871, 783, 7873,
            781, 2993, 123,
            1234,
          ],
        }
    );

    const actual = op.toString();
    const expected = '871 + 783 - 7873 + 781 - 2993 + 123 - 1234 = -9542';

    expect(actual).to.equal(expected);
  });

  // probar con chai-match los resultados cumplan regexp

  it('Crear una operación de 3 operandos al azar solo divisiones',
      () => {
        debug = false;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 3,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(/[0-9]+ \/ [0-9]+ \/ [0-9]+ = [0-9]+/);
        if ( debug ) console.log(actual);
        debug = false;
      }
  );


  it('3 operandos combinando ∙ / el resultado a de ser un numero entero',
      () => {
        debug = false;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 3,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [∙\/] [0-9]+ [∙\/] [0-9]+ = ([0-9])+$/
        );
        if ( debug ) console.log(actual);
        debug = false;
      }
  );


  it('24 3 operandos combinando */+- el resultado a de ser un numero entero',
      () => {
        //  debug = true;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 3,
              // permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.SUMA,
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [∙\/+\-] [0-9]+ [∙\/+\-] [0-9]+ = ([0-9])+$/
        );
        if ( debug ) console.log(actual);
        debug = false;
      }
  );

  it('27 Crear una operacion de 3 operandos combinando sumas y restas',
      () => {
        // debug = true;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 3,
              permitirNegativos: true,
              tiposOperacion: [
                OPERACIONES.SUMA,
                OPERACIONES.RESTA,
              ],
            }
        );
        const actual = op.toString();
        // ^-?[0-9]+ [+-]
        // (\()?-?[0-9]+(\))? [+-]
        // (\()?-?[0-9]+(\))? =
        // -?([0-9])+$
        expect(actual).to.match(
            /^-?[0-9]+ [+-] (\()?-?[0-9]+(\))? [+-] (\()?-?[0-9]+(\))? = -?([0-9])+$/
        );
        // console.log(actual);
        debug = false;
      }
  );

  it('28 sin negativos, una operacion de 3 operandos combinando sumas y restas',
      () => {
        // debug = true;
        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 3,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.SUMA,
                OPERACIONES.RESTA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [+-] [0-9]+ [+-] [0-9]+ = ([0-9])+/);
        // console.log(actual);
        debug = false;
      }
  );

  it('29 Crear una operacion de 3 operandos combinando sumas,restas,multiplicaciones',
      () => {
        // debug = true;

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 3,
              permitirNegativos: false,
              tiposOperacion: [
                OPERACIONES.SUMA,
                OPERACIONES.RESTA,
                OPERACIONES.MULTIPLICACION,
                // OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+ [+∙-] [0-9]+ [+∙-] [0-9]+ = -?([0-9])+$/);

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('40 Posicion incognita no es resultado',
      () => {
        debug = false;
        const op = new OperacionMultiple(
            {
              nivel: 50,
              cantidadOperandos: 3,
              incognita: 1,
              tiposOperacionAzar: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.DIVISION_ENTERA,
              ],
              // operandos: [0, 0, 4],
              // permitirNegativos: true,
              // resultado: 60,
            }
        );
        // const actual = op.respuesta();
        const actual = op.toString(true, true);

        expect(actual).to.match(
            /^\[[0-9]+\] [-] [0-9]+ [\/] [0-9]+ = [0-9]+$/
        );
        // /-?[0-9]+ [-] \(?-?[0-9]+\)? [-] \(?-?[0-9]+\)? [\/] -?[0-9]+ [-] \(?-?[0-9]+\)? = -?[0-9]+$/

        // console.log('actual', actual);
        debug = false;
      }
  );
  it('Posicion incognita no es resultado pos : 2 ',
      () => {
        debug = false;
        const op = new OperacionMultiple(
            {
              nivel: 50,
              cantidadOperandos: 3,
              incognita: 2,
              tiposOperacionAzar: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.DIVISION_ENTERA,
              ],
              // operandos: [0, 0, 4],
              // permitirNegativos: true,
              // resultado: 60,
            }
        );
        // const actual = op.respuesta();
        const actual = op.toString(true, true);

        expect(actual).to.match(
            /^[0-9]+ [-] \[[0-9]+\] [\/] [0-9]+ = [0-9]+$/
        );
        // /-?[0-9]+ [-] \(?-?[0-9]+\)? [-] \(?-?[0-9]+\)? [\/] -?[0-9]+ [-] \(?-?[0-9]+\)? = -?[0-9]+$/

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('Posicion incognita no es resultado pos : 3 ',
      () => {
        debug = false;
        const op = new OperacionMultiple(
            {
              nivel: 50,
              cantidadOperandos: 3,
              incognita: 3,
              tiposOperacionAzar: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.DIVISION_ENTERA,
              ],
            }
        );
        // const actual = op.respuesta();
        const actual = op.toString(true, true);

        expect(actual).to.match(
            /^[0-9]+ [-] [0-9]+ [\/] \[[0-9]+\] = [0-9]+$/
        );
        // /-?[0-9]+ [-] \(?-?[0-9]+\)? [-] \(?-?[0-9]+\)? [\/] -?[0-9]+ [-] \(?-?[0-9]+\)? = -?[0-9]+$/

        // console.log('actual', actual);
        debug = false;
      }
  );

  // it('Posicion incognita no es resultado, negativos',
  //     () => {
  //       debug = false;
  //       const op = new OperacionMultiple(
  //           {
  //             nivel: 50,
  //             cantidadOperandos: 3,
  //             incognita: 1,
  //             tiposOperacionAzar: false,
  //             tiposOperacion: [
  //               OPERACIONES.RESTA,
  //               OPERACIONES.DIVISION_ENTERA,
  //             ],
  //             tiposNumero: [
  //               TIPO_NUMERO.ENTERO,
  //             ]
  //             // operandos: [0, 0, 4],
  //             // permitirNegativos: true,
  //             // resultado: 60,
  //           }
  //       );
  //       // const actual = op.respuesta();
  //       const actual = op.toString();

  //       expect(actual).to.match(
  //           /^[0-9]+ [-] [0-9]+ [\/] [0-9]+ = [0-9]+$/
  //       );
  //       // /-?[0-9]+ [-] \(?-?[0-9]+\)? [-] \(?-?[0-9]+\)? [\/] -?[0-9]+ [-] \(?-?[0-9]+\)? = -?[0-9]+$/

  //       // console.log('actual', actual);
  //       debug = false;
  //     }
  // );
  // it('Posicion incognita no es resultado pos : 2, negativos',
  //     () => {
  //       debug = false;
  //       const op = new OperacionMultiple(
  //           {
  //             nivel: 50,
  //             cantidadOperandos: 3,
  //             incognita: 2,
  //             tiposOperacionAzar: false,
  //             tiposOperacion: [
  //               OPERACIONES.RESTA,
  //               OPERACIONES.DIVISION_ENTERA,
  //             ],
  //             tiposNumero: [
  //               TIPO_NUMERO.ENTERO,
  //             ]
  //             // operandos: [0, 0, 4],
  //             // permitirNegativos: true,
  //             // resultado: 60,
  //           }
  //       );
  //       // const actual = op.respuesta();
  //       const actual = op.toString();

  //       expect(actual).to.match(
  //           /^[0-9]+ [-] [0-9]+ [\/] [0-9]+ = [0-9]+$/
  //       );
  //       // /-?[0-9]+ [-] \(?-?[0-9]+\)? [-] \(?-?[0-9]+\)? [\/] -?[0-9]+ [-] \(?-?[0-9]+\)? = -?[0-9]+$/

  //       // console.log('actual', actual);
  //       debug = false;
  //     }
  // );

  it('43 Posicion incognita no es resultado pos : 3, decimal',
      () => {
        debug = false;
        const op = new OperacionMultiple(
            {
              nivel: 50,
              cantidadOperandos: 3,
              incognita: 3,
              tiposOperacionAzar: false,
              tiposOperacion: [
                OPERACIONES.RESTA,
                OPERACIONES.DIVISION_ENTERA,
              ],
              tiposNumero: [
                TIPO_NUMERO.NATURAL,
                TIPO_NUMERO.DECIMAL,
              ],
            }
        );
        const actual = op.toString();
        expect(actual).to.match(
            /[0-9]+(\.[0-9]+)? [-] [0-9]+(\.[0-9]+)? [\/] [0-9]+(\.[0-9]+)? = [0-9]+(\.[0-9]+)?/
        );

        // console.log('actual', actual);
        debug = false;
      }
  );

  it('!! suma y resta, operando enfocado', () => {
    debug = false;
    const op = new OperacionMultiple(
        {
          nivel: 11,
          cantidadOperandos: 3,
          tiposOperacionAzar: false,
          enfocado: true,
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.SUMA,
          ],
          tiposNumero: [
            TIPO_NUMERO.NATURAL,
          ],
        }
    );
    const actual = op.operandos;
    // console.log('operandos', op.operandos);
    expect(actual).to.contains(11);
  });

  it('!! suma y resta, con numeros negativos ', () => {
    debug = false;
    const op = new OperacionMultiple(
        {
          nivel: 11,
          cantidadOperandos: 3,
          tiposOperacionAzar: false,
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.SUMA,
          ],
          tiposNumero: [
            TIPO_NUMERO.ENTERO,
          ],
        }
    );
    const actual = op.operandos;
    console.log('operandos', op.operandos);
    expect( actual ).to.satisfy( (x)=>{
      return x.some( (operando) => {
        return operando < 0;
      });
    }, actual );
  });

  it('!! suma y resta, con x10', () => {
    debug = false;
    const op = new OperacionMultiple(
        {
          nivel: 11,
          cantidadOperandos: 3,
          tiposOperacionAzar: false,
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.SUMA,
          ],
          tiposNumero: [
            TIPO_NUMERO.ENTERO,
            TIPO_NUMERO.MULTIPLO10,
          ],
        }
    );
    const actual = op.operandos;
    console.log('operandos', op.operandos);
    expect( actual ).to.satisfy( (x)=>{
      return !x.some((operando) => {
        return (operando % 10 != 0);
      });
    }, actual );
  });

  it('!! suma y resta, con x100', () => {
    debug = false;
    const op = new OperacionMultiple(
        {
          nivel: 11,
          cantidadOperandos: 3,
          tiposOperacionAzar: false,
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.SUMA,
          ],
          tiposNumero: [
            TIPO_NUMERO.ENTERO,
            TIPO_NUMERO.MULTIPLO100,
          ],
        }
    );
    const actual = op.operandos;
    console.log('operandos', op.operandos);
    expect( actual ).to.satisfy( (x)=>{
      return !x.some((operando) => {
        return (operando % 100 != 0);
      });
    }, actual );
  });
});
