
import OPERACIONES from '../src/operaciones/operaciones';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import {seededRandom} from '../src/operaciones/random';
import {assertSolved} from './assertExercise';

const expect = require('chai').expect;

describe('Operacion Multiple 4 operandos o mas', () => {
  it('Multiplicación de 4 operandos expresada con solo un tipo de operacion', () => {

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
  });

  it('Multiplicación de 4 operandos 32423 ∙ 421 ∙ 4321 ∙ 4 = 235928034572', () => {

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
  });

  it('Division entera de 4 operandos 235928034572 / 32423 / 421 / 4321 = 4 ', () => {

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
  });

  it('debería 3 ∙ 2 + 1 - 5 = 2', () => {

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
  });

  it('debería 7 + 3 + 2 ∙ 1 - 5 - 23 = -16', () => {

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

        // expect('some thing to test').to.match(/some (\w+) to test/).and.capture(0).equals('thing');
        // 'Here in London'.should.match(/(here|there) in (\w+)/i).and.capture(1).equals('London');
      }
  );

  it(' 1 + 3 ∙ 3 - 1 ∙ 2 = 8 ', () => {

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
  });

  it(' 1 + 3 / 3 - 1 ∙ 2 = 0 ', () => {

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
  });

  it('4 operandos con +-/*',
      () => {
        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: false,
          random: seededRandom(1),
          tiposOperacion: [
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
          ],
        });
        assertSolved(op, {
          operators: ['+', '∙', '/'],
          allowNegativeResult: false,
        });
      }
  );


  it('4 operandos combinando ∙ / el resultado a de ser un numero entero',
      () => {

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
      }
  );

  it('4 operandos combinando */+- el resultado a de ser un numero entero positivo',
      () => {

        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 4,
          random: seededRandom(1),
          tiposNumero: [TIPO_NUMERO.NATURAL],
          tiposOperacion: [
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
          ],
        });
        assertSolved(op, {
          operators: ['+', '∙', '/'],
          allowNegativeResult: false,
        });
      }
  );

  it('5 operandos combinando */+- el resultado a de ser un numero entero',
      () => {

        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          random: seededRandom(1),
          tiposOperacion: [
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
          ],
        });
        assertSolved(op, {operators: ['+', '∙', '/', '-']});
      }
  );

  it('A - B ∙ C - D / E',
      () => {
        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          permitirNegativos: false,
          random: seededRandom(175),
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.RESTA,
            OPERACIONES.DIVISION_ENTERA,
          ],
          tiposOperacionAzar: false,
        });
        assertSolved(op, {
          operators: ['-', '∙', '-', '/'],
          allowNegativeResult: false,
        });
      }
  );

  it('A - B ∙ C / D',
      () => {
        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: false,
          random: seededRandom(10),
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
          ],
          tiposOperacionAzar: false,
        });
        assertSolved(op, {
          operators: ['-', '∙', '/'],
          allowNegativeResult: false,
        });
      }
  );

  it('A / B ∙ C / D - E',
      () => {
        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          permitirNegativos: false,
          random: seededRandom(1),
          tiposOperacion: [
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.RESTA,
          ],
          tiposOperacionAzar: false,
        });
        assertSolved(op, {
          operators: ['/', '∙', '/', '-'],
          allowNegativeResult: false,
        });
      }
  );

  it('A - B - C ∙ D - E',
      () => {
        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          permitirNegativos: false,
          random: seededRandom(3),
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.RESTA,
          ],
          tiposOperacionAzar: false,
        });
        assertSolved(op, {
          operators: ['-', '-', '∙', '-'],
          allowNegativeResult: false,
        });
      }
  );

  it('A - B ∙ C - D',
      () => {
        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 4,
          permitirNegativos: false,
          random: seededRandom(1),
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.RESTA,
          ],
          tiposOperacionAzar: false,
        });
        assertSolved(op, {
          operators: ['-', '∙', '-'],
          allowNegativeResult: false,
        });
      }
  );

  it('A - B - C / D - E',
      () => {
        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          random: seededRandom(2),
          tiposNumero: [TIPO_NUMERO.NATURAL],
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.RESTA,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.RESTA,
          ],
          tiposOperacionAzar: false,
        });
        assertSolved(op, {
          operators: ['-', '-', '/', '-'],
          allowNegativeResult: false,
        });
      }
  );
  it('A ∙ B / C - D - E',
      () => {

        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          permitirNegativos: false,
          random: seededRandom(1),
          tiposOperacion: [
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.RESTA,
            OPERACIONES.RESTA,
          ],
          tiposOperacionAzar: false,
        });
        assertSolved(op, {
          operators: ['∙', '/', '-', '-'],
          allowNegativeResult: false,
        });
      }
  );

  it('Permitir Negativos A - B - C ∙ D - E',
      () => {

        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          tiposOperacionAzar: false,
          random: seededRandom(1),
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.RESTA,
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.RESTA,
          ],
          permitirNegativos: true,
        });
        assertSolved(op, {operators: ['-', '-', '∙', '-']});
      }
  );

  it('Permitir Negativos A - B - C / D - E',
      () => {

        const op = new OperacionMultiple({
          nivel: 50,
          cantidadOperandos: 5,
          tiposOperacionAzar: false,
          random: seededRandom(2),
          tiposOperacion: [
            OPERACIONES.RESTA,
            OPERACIONES.RESTA,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.RESTA,
          ],
          permitirNegativos: true,
        });
        assertSolved(op, {operators: ['-', '-', '/', '-']});
      }
  );
});

describe('Operacion Multiple', () => {
  it('01 debería devolver operacion de 3 operandos, suma y resta', () => {

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

  });

  it('debería devolver 3 operandos, una suma y una multiplicación', () => {

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
  });

  it('debería 1 - 3 ∙ 2 + 5 = 0', () => {

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

  // probar que los resultados cumplan una regexp

  it('Crear una operación de 3 operandos al azar solo divisiones',
      () => {

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
      }
  );


  it('3 operandos combinando ∙ / el resultado a de ser un numero entero',
      () => {

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
      }
  );


  it('24 3 operandos combinando */+- el resultado a de ser un numero entero',
      () => {

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
      }
  );

  it('27 Crear una operacion de 3 operandos combinando sumas y restas',
      () => {
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
      }
  );

  it('28 sin negativos, una operacion de 3 operandos combinando sumas y restas',
      () => {
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
      }
  );

  it('29 Crear una operacion de 3 operandos combinando sumas,restas,multiplicaciones',
      () => {

        const op = new OperacionMultiple(
            {nivel: 50,
              cantidadOperandos: 3,
              permitirNegativos: false,
              random: seededRandom(1),
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
      }
  );

  it('40 Posicion incognita no es resultado',
      () => {
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
      }
  );
  it('Posicion incognita no es resultado pos : 2 ',
      () => {
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
      }
  );

  it('Posicion incognita no es resultado pos : 3 ',
      () => {
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
      }
  );

  // it('Posicion incognita no es resultado, negativos',
  //     () => {
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
  //     }
  // );
  // it('Posicion incognita no es resultado pos : 2, negativos',
  //     () => {
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
  //     }
  // );

  it('43 Posicion incognita no es resultado pos : 3, decimal',
      () => {
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
      }
  );

  it('!! suma y resta, operando enfocado', () => {
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
    const op = new OperacionMultiple({
      nivel: 11,
      cantidadOperandos: 3,
      tiposOperacionAzar: false,
      random: seededRandom(1),
      tiposOperacion: [
        OPERACIONES.RESTA,
        OPERACIONES.SUMA,
      ],
      tiposNumero: [
        TIPO_NUMERO.ENTERO,
      ],
    });
    expect(op.operandos.some((operando) => operando < 0)).to.equal(true);
    assertSolved(op, {operators: ['-', '+']});
  });

  it('!! suma y resta, con x10', () => {
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
