import OPERACIONES from '../src/operaciones/operaciones';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-match'));

describe('Operación Multiple N.NATURALES solo positivos', () => {
  it('No negativos con números naturales', ()=>{
    debug = false;
    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: [
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.RESTA,
          ],
          tiposNumero: [TIPO_NUMERO.NATURAL],
        }
    );
    const actual = op.toString();
    expect(actual).to.match(/[0-9]+ [-+\/] [0-9]+ [-+\/] [0-9]+ = [0-9]+/);
    if ( debug ) console.log(actual);
    debug = false;
  }),

  it('resultado negativos con numeros naturales', ()=>{
    debug = false;
    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 3,
          resultadoNegativo: true,
          tiposOperacion: [
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.MULTIPLICACION
          ],
          tiposNumero: [TIPO_NUMERO.NATURAL],
        }
    );
    const actual = op.toString();
    expect(actual).to.match(/[0-9]+ [+\/\-∙] [0-9]+ [+\/\-∙] [0-9]+ = -[0-9]+/);
    if ( debug ) console.log(actual);
    debug = false;
  });
  it('No decimales con números naturales', ()=>{
    debug = false;
    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: [
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.SUMA,
          ],
          tiposNumero: [TIPO_NUMERO.NATURAL],
        }
    );
    const actual = op.toString();
    expect(actual).to.not.match(
        /[0-9]+ [+\/] [0-9]+ [+\/] [0-9]+ = [0-9]+\.[0-9]+/);
    if ( debug ) console.log(actual);
    debug = false;
  });
});

describe('Operación Multiple N.Enteros', () => {
  it('No decimales con números enteros', ()=>{
    debug = false;
    const op = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: [
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.SUMA,
          ],
          tiposNumero: [TIPO_NUMERO.ENTERO],
        }
    );
    const actual = op.toString();
    expect(actual).to.not.match(/[0-9]+ [+\/] [0-9]+ [+\/] [0-9]+ = [0-9]+\.[0-9]+/);
    if ( debug ) console.log(actual);
    debug = false;
  });
  
});


  


describe('Operación Multiple N.Decimales', () => {
  it('deberían aparecen decimales', () => {
    const tag = '[OperacionMultipleTipoNumero.decimales'+
        '.deberíanAparecenDecimales]';
    // debug = true;
    if ( debug ) console.log( tag );

    debug= false;
    const o = new OperacionMultiple(
        {nivel: 50,
          cantidadOperandos: 3,
          permitirNegativos: false,
          tiposOperacion: [
            OPERACIONES.DIVISION,
            OPERACIONES.SUMA,
          ],
          tiposNumero: [TIPO_NUMERO.DECIMAL],
        }
    );

    const actual = o;
    // const actual = ['3.33 + 3 = -34','3 + 3.12 = -34','20 / 10 = 3.333'];
    // const actual = ['3.33 + 3 = -34', '3 + 3.12 = -34', '20 / 10 = 3.3333'];
    // const actual = ['3 + 3 = -34','3 + 3 = 34','20 / 10 = 3'];

    // ^([\( ]?-?[0-9]+([.][0-9]{0,3})?\)?) [-+∙\/] ([\( ]?\(?-?[0-9]+([.][0-9]{0,3})?\)?[ \)]?) = (-?[0-9]+([.][0-9]{0,3})?)$

    expect(actual).to.satisfy( (o) => {
      const re = new RegExp(
          '^([\\( ]?\\(?-?[0-9]+([.][0-9]{0,3})?\\)?[ \\)]?) [-+*\\/] '+
          '([\\( ]?\\(?-?[0-9]+([.][0-9]{0,3})?\\)?[ \\)]?) [-+*\\/] '+
          '([\\( ]?\\(?-?[0-9]+([.][0-9]{0,3})?\\)?[ \\)]?) '+
          '= (-?[0-9]+([.][0-9]{0,3})?)$'
      );
        // si alguna operacion on coincide con la exp regular:

      const operacion = o.toString();
      // const operacion = '90.3 / 5 + 17 = 34'; //SI
      // const operacion = '90 / 5 + 17 = 34.234'; //NO
      // const operacion = '90 / 5.34 + 17 = 34'; //SI
      // const operacion = '90 / 5 + 17.345 = 34'; //SI
      // const operacion = '90 / 5 + 17 = 34.324234'; //NO
      const match = re.exec( operacion );
      // if ( debug ) {
      console.log(tag, match, operacion, 'resultado', o.resultado );
      // }

      const algunaCoincide = ( match && match.length > 0);
      console.log(tag, 'algunaCoincide', algunaCoincide );

      // comprobar que al menos uno de los números tiene decimales:
      let decimales = false;
      if (algunaCoincide) {
        // decimales la primera cifra:
        if ( match[2] && match[2] != '' ) decimales = true;
        // decimales segunda cifra:
        if ( match[4] && match[4] != '' ) decimales = true;
        // decimales resultado
        if ( match[6] && match[6] != '' ) decimales = true;
      }
      console.log(tag, 'decimales', decimales );
      // si no coincide con la exp regular o no tiene ni un numero
      // con decimales falla
      return decimales;
    }, actual.operacionesExamen);
    debug = false;
  });
  // fin
});
