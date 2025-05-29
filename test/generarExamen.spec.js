
const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-match'));

import GenerarExamen from '../src/generarExamen';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import OPERACIONES from '../src/operaciones/operaciones';

// const { equal } = require("assert");
global.debug = false;
debug = false;

// filter unique values in array:
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function comprobarNumerosPositivos(operaciones, negativos=false) {
  // console.log('operaciones', operaciones, 'negativos', negativos)
  let todosPositivos = true;
  let i = 0;
  do {
    const operacion = operaciones[i];
    let esNegativo = false;
    // con que lo cumpla en un operando vale
    let j = 0;
    do {
      esNegativo = (operacion.operandos[j] <0 );
      j++;
    } while ( esNegativo==false && j< operacion.cantidad_operandos );
    // si no hay operandos negativos, esNegativo es False
    todosPositivos = !esNegativo;
    i++;
  } while ( todosPositivos == true && i< operaciones.length );
  // mientras no encuentre negativos sigue buscando

  // si negativos es true devuelve falso cuando todos son positivos
  if ( negativos ) {
    return !todosPositivos;
  } else {
    return todosPositivos;
  }
}

function comprobarOperandos(operaciones, comparar) {
  // comprueba que los operandos de las operaciones cumplan con lo que se
  // envía en 'comparar'

  // sale desde que no se cumpla en algún caso
  let i = 0;
  let coincidenTodos;
  do {
    const operacion = operaciones[i];
    let coincide = true;
    // con que lo cumpla en un operando vale
    let j = 0;
    do {
      coincide = (operacion.operandos[j] == comparar );
      j++;
    } while ( coincide==true && j < operacion.cantidad_operandos );
    // si no hay operandos negativos, esNegativo es False
    coincidenTodos = coincide;
    i++;
  } while ( coincidenTodos == true && i< operaciones.length );

  return coincidenTodos;
}

describe('Generar Examen', ()=>{
  it(
      'debería generar operaciones con al menos una de cada tipo de operacion seleccionada',
      ()=>{
        debug = false;
        const o = new GenerarExamen( {
          cantidadOperaciones: 6,
          tiposOperaciones: [
            OPERACIONES.MULTIPLICACION,
            OPERACIONES.SUMA,
            OPERACIONES.RESTA,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.DIVISION_DECIMAL,
            OPERACIONES.DIVISION_RESTO,
          ],
          tiposNumero: [TIPO_NUMERO.NATURAL],
        });
        const actual = o.cantidadPorTipo;

        // uno de cada
        const expected = [1, 1, 1, 1, 1, 1];
        console.log( 'nombreOperaciones', o.nombreOperaciones );
        console.log('operaciones examen:', o.operacionesExamen);

        expect( actual ).to.have.members( expected );
      });

  it('Si no se selecciona operacion debería dar suma', ()=>{
    const o = new GenerarExamen( {
      cantidadOperaciones: 6,
    });
    const actual = o.cantidadPorTipo;
    // uno de cada
    const expected =[6];

    expect( actual ).to.have.members( expected );
  });
  it('si no se seleccionan operandos debería dar operaciones con 2', ()=>{
    const o = new GenerarExamen( {
      cantidadOperaciones: 6,
    });

    const actual = o.operacionesExamen;
    // .cantidad_operandos

    expect( actual ).to.satisfy((x)=>{
      let r =true;
      let i = 0;
      do {
        const operacion = x[i];
        r = (operacion.cantidad_operandos == 2);
        i++;
      } while ( r == true && i< x.length );
      return r;
    }, actual );
  });

  // en realidad no , por que las divisiones aun que pidas 3 operandos te las
  // manda con 2
  // it('debería generar todas las operaciones con el numero de operandos
  // enviado',()=>{
  // });

  it('debería alguno de los operandos cumplir, en nivel 100, tener entre 50 y 150', ()=>{
    const o = new GenerarExamen( {
      cantidadOperaciones: 6,
      nivel: 100,
      tiposOperaciones: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.DIVISION_RESTO,
        OPERACIONES.DIVISION_DECIMAL,
      ],
    });

    const actual = o.operacionesExamen;
    // .cantidad_operandos
    const minNivel = 0;
    const maxNivel = 100;

    expect( actual ).to.satisfy((x)=>{
      let r =true;
      let i = 0;
      do {
        const operacion = x[i];
        let cumpleNivel = false;
        // con que lo cumpla en un operando vale
        let j = 0;
        do {
          cumpleNivel = (operacion.operandos[j] >=minNivel &&
              operacion.operandos[j] <= maxNivel);
          j++;
        } while ( cumpleNivel==false && j< operacion.cantidad_operandos );
        // deberia salir del while cumpliendolo si uno esta bien
        r = cumpleNivel;
        i++;
      } while ( r == true && i< x.length );
      return r;
    }, actual );
  });

  it('debería alguno de los operandos cumplir, nivel 100, tener entre 50 y 150 con las DIVISIONES CON DECIMALES'
      // ()=>{
      //     const o = new GenerarExamen( {
      //         cantidadOperaciones: 6,
      //         nivel: 100,
      //         tiposOperaciones: ['division_decimal'] ,
      //     });

      //     actual = o.operacionesExamen;
      //     // .cantidad_operandos

      //     expect( actual ).to.satisfy((x)=>{
      //         let r =true;
      //         let i = 0;
      //         do {
      //             let operacion = x[i];
      //             cumpleNivel = false;
      //             // con que lo cumpla en un operando vale
      //             let j = 0;
      //             do{
      //                 cumpleNivel = (operacion.operandos[j] >50 &&
      //                      operacion.operandos[j] < 150);
      //                 j++;
      //             } while( cumpleNivel==false &&
      //                    j< operacion.cantidad_operandos );
      //             //deberia salir del while cumpliendolo si uno esta bien
      //             r = cumpleNivel;
      //             i++;
      //         } while ( r == true && i< x.length );
      //         return r;
      //     }, actual );
      // }
  );

  it('al seleccionar números negativos: al menos un operando o el resultado ' +
      'debe ser negativo (en cada operacion)', ()=>{
    // he quitado las divisiones por que se hablo que siempre fueran positivas
    const o = new GenerarExamen( {
      cantidadOperaciones: 6,
      nivel: 100,
      permitirNegativos: true,
      tiposOperaciones: ['multiplicacion', 'suma', 'resta'],
    });
    const actual = o.operacionesExamen;
    expect( actual ).to.satisfy( (x)=>{
      return comprobarNumerosPositivos(x, true);
    }, actual );
  });

  it('operandos de las divisiones deberían ser siempre positivos',
      ()=>{
        debug= false;

        const o = new GenerarExamen( {
          cantidadOperaciones: 10,
          nivel: 100,
          permitirNegativos: true,
          tiposOperaciones: [
            OPERACIONES.DIVISION_DECIMAL,
            OPERACIONES.DIVISION_ENTERA,
            OPERACIONES.DIVISION_RESTO,
          ],
        });

        const actual = o.operacionesExamen;
        // console.log(actual);

        expect( actual ).to.satisfy( (x)=>{
          return comprobarNumerosPositivos(x);
        }, actual );
      }
  );

  // en las divisiones el dividendo no es mul de 10 (del 2 al 9)
  it('Seleccionada la opción de múltiplos de 10 en +,-,* las soluciones que se generan deben ser múltiplos de este número. ',
      ()=>{
        const o = new GenerarExamen( {
          cantidadOperaciones: 6,
          nivel: 100,
          multiplo10: true,
          tiposOperaciones: ['multiplicacion', 'suma', 'resta'],
        });

        const actual = o.operacionesExamen.map((x)=>{
          return x.resultado;
        });
        // console.log(actual);

        expect( actual ).to.satisfy((x)=>{
          let r = true;
          let i = 0;
          do {
            r = ( x[i] % 10 == 0 );
            i++;
          } while ( r==true && i<x.length );
          return r;
        }, actual);
      }
  );

  it('Seleccionada la opción de múltiplos de 100 en +,-,* las soluciones que se generan deben ser múltiplos de este número. ',
      ()=>{
        // debug = true;
        const examen = new GenerarExamen( {
          cantidadOperaciones: 10,
          nivel: 10,
          multiplo100: true,
          tiposOperaciones: ['multiplicacion', 'suma', 'resta'],
        });

        const actual = examen.operacionesExamen.map((x)=>{
          return x.resultado;
        });

        expect( actual ).to.satisfy((x)=>{
          let r = true;
          let i = 0;
          do {
            r = ( x[i] % 100 == 0 );
            i++;
          } while ( r==true && i<x.length );
          return r;
        }, actual);
      });
  // en las div dividendo del 2 al 10, en la mul, resultado y un operando , solo con 2 operandos

  it('Seleccionado complementario 30 se generan operaciones que den como ' +
      'resultado 30, +,-,*, division entera', ()=>{
    const examen = new GenerarExamen( {
      cantidadOperaciones: 10,
      complementario: 30,
      tiposOperaciones: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.DIVISION_ENTERA],
    });

    const actual = examen.operacionesExamen.map((x)=>{
      return x.resultado;
    });
    const diezTreintas = [];
    for (let index = 0; index < 10; index++) {
      diezTreintas.push(30);
    }

    expect( actual ).be.eql(diezTreintas);
  });

  it('Seleccionado complementario 30 se generan operaciones que den como resultado 30, division con resto'
      // , ()=>{
      // const examen = new GenerarExamen( {
      //     cantidadOperaciones: 10,
      //     complementario: 30,
      //     tiposOperaciones: ['division_resto'] ,
      // });

      // actual = examen.operacionesExamen.map((x)=>{
      //     return x.resultado;
      // });
      // diezTreintas = [];
      // for (let index = 0; index < 10; index++) {
      //     diezTreintas.push(30);
      // }

      // expect( actual ).be.eql(diezTreintas);
      // }
  );

  // it('Seleccionado complementario 30 se generan operaciones que den como resultado 30, division con decimales',()=>{
  //     const examen = new GenerarExamen( {
  //         cantidadOperaciones: 10,
  //         complementario: 30,
  //         tiposOperaciones: ['division_decimales'] ,
  //     });

  //     actual = examen.operacionesExamen.map((x)=>{
  //         return x.resultado;
  //     });
  //     diezTreintas = [];
  //     for (let index = 0; index < 10; index++) {
  //         diezTreintas.push(30);
  //     }

  //     expect( actual ).be.eql(diezTreintas);
  // });

  it('Seleccionado complementario 90 se generan operaciones que den como resultado 90', ()=>{
    const examen = new GenerarExamen( {
      cantidadOperaciones: 10,
      complementario: 90,
      tiposOperaciones: [
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.DIVISION_ENTERA,
      ],
    });

    const actual = examen.operacionesExamen.map((x)=>{
      return x.resultado;
    });
    const diez90 = [];
    for (let index = 0; index < 10; index++) {
      diez90.push(90);
    }

    expect( actual ).be.eql(diez90);
  });
  it('Seleccionado complementario 90 se generan operaciones que den como resultado 90, division con resto'
      // , ()=>{
      //     const examen = new GenerarExamen( {
      //         cantidadOperaciones: 10,
      //         complementario: 90,
      //         tiposOperaciones: ['division_resto'] ,
      //     });

      //     actual = examen.operacionesExamen.map((x)=>{
      //         return x.resultado;
      //     });
      //     diez90 = [];
      //     for (let index = 0; index < 10; index++) {
      //         diez90.push(90);
      //     }

      //     expect( actual ).be.eql(diez90);
      // }
  );

  // Por ejemplo, 3 +? = 10, 12 + ? = 20, para el 10 y el 20 podrían ser ejemplos.

  it('La posicion de la incognita debería variar cuando se escoge que sea al azar', ()=>{
    const examen = new GenerarExamen( {
      cantidadOperaciones: 50,
      posicionIncognitaAlAzar: true,
      nivel: 100,
      tiposOperaciones: [
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.DIVISION_ENTERA,
      ],
      cantidadOperandos: 4,
    });

    const actual = examen.operacionesExamen.map((x)=>{
      return x.posicion_incognita;
    });
    const unique = actual.filter( onlyUnique );
    // console.log(unique);

    // tienen que haber al menos uno de cada operando +1 del resultado
    // al filtrar en único debe dar 5 para 4 operandos si hay menos es que una
    // posicion no ha salido nunca...
    expect(unique).to.have.lengthOf(5);
  });

  it('La posicion de la incognita debería variar cuando se escoge que sea al azar, en complementarios',
      ()=>{
        const examen = new GenerarExamen( {
          cantidadOperaciones: 100,
          posicionIncognitaAlAzar: true,
          tiposOperaciones: [
            'suma',
            'resta',
            'multiplicacion',
            'division_entera',
          ],
          complementario: 50,
        });

        const actual = examen.operacionesExamen.map((x)=>{
          return x.posicion_incognita;
        });
        // console.log(actual);
        const unique = actual.filter( onlyUnique );
        // console.log(unique);

        // en este caso la incoginita solo esta en los operandos
        expect(unique).to.have.lengthOf(2);
      });

  // it('complementarios: se crean operaciones con números positivos al NO permitir negativos',()=>{});
  it('complementarios: se crean operaciones con números negativos al permitir negativos +-*',
      ()=>{
        debug= false;

        const o = new GenerarExamen( {
          cantidadOperaciones: 10,
          nivel: 100,
          permitirNegativos: true,
          tiposOperaciones: ['suma', 'resta', 'multiplicacion'],
        });

        const actual = o.operacionesExamen;


        expect( actual ).to.satisfy( (x)=>{
          return comprobarNumerosPositivos(x, true);
        }, actual );
      }
  );

  // En las divisiones esta puesto que siempre sean positivas
  // it('complementarios: se crean operaciones con números negativos al permitir negativos',
  // ()=>{
  //     debug= false;

  //     const o = new GenerarExamen( {
  //         cantidadOperaciones: 10,
  //         nivel: 100,
  //         permitirNegativos: true,
  //         tiposOperaciones: ['division_decimales','division_entera', 'division_resto'] ,
  //     });

  //     actual = o.operacionesExamen;


  //     expect( actual ).to.satisfy( (x)=>{return comprobarNumerosPositivos(x,true)}, actual );

  // }
  // );


  // Estos 3 test dudo de que estén funcionando bien aun que parece que si
  it('no debería aparecer ningún valor como "undefined"', ()=>{
    debug= false;

    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      nivel: 100,
      permitirNegativos: true,
      tiposOperaciones: [
        OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.DIVISION_DECIMAL,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.DIVISION_RESTO],
    });

    const actual = o.operacionesExamen;

    expect( actual ).to.satisfy( (operaciones)=>{
      return !comprobarOperandos(operaciones, undefined);
    }, actual );
  });
  it('no debería aparecer ningún valor como "NaN"', ()=>{
    debug= false;

    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      nivel: 100,
      permitirNegativos: true,
      tiposOperaciones: [OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.DIVISION_DECIMAL,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.DIVISION_RESTO],
    });

    const actual = o.operacionesExamen;

    expect( actual ).to.satisfy( (operaciones)=>{
      return !comprobarOperandos(operaciones, NaN);
    }, actual );
  });

  it('no debería aparecer ningún valor como "Infinity"', ()=>{
    debug= false;

    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      nivel: 100,
      permitirNegativos: true,
      tiposOperaciones: [OPERACIONES.SUMA,
        OPERACIONES.RESTA,
        OPERACIONES.MULTIPLICACION, OPERACIONES.DIVISION_DECIMAL,
        OPERACIONES.DIVISION_ENTERA,
        OPERACIONES.DIVISION_RESTO],
    });

    const actual = o.operacionesExamen;

    expect( actual ).to.satisfy( (operaciones)=>{
      return !comprobarOperandos(operaciones, Infinity);
    }, actual );
  });
});

describe('Generar Examen, Tipos numero', ()=>{
  it('NATURAL : deberia generar solo números positivos', ()=>{
    debug= false;
    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      tiposOperaciones: OPERACIONES.enteras,
      tiposNumero: [TIPO_NUMERO.NATURAL],
    });
    const actual = o.operacionesExamen;
    // expect(actual).all.match(/^[0-9]+ [-+∙\/] [0-9]+ = [0-9]$/);
    expect(actual).to.satisfy( (operacion) => {
      const re = new RegExp(/^[0-9]+ [-+∙\/] [0-9]+ = [0-9]+$/);
      // si alguna operacion on coincide con la exp regular:
      const operacionNoMatch = operacion.some(
          (o) => {
            const match = re.exec(o.toString());
            if ( debug ) console.log(match, o.toString() );
            return !( match && match.length > 0);
          }
      );
      return !operacionNoMatch;
    }, actual.operacionesExamen);
    debug = false;
  });

  it('ENTERO : debería generar números negativos y positivos', ()=>{
    // debug= true;
    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      tiposOperaciones: OPERACIONES.enteras,
      tiposNumero: [TIPO_NUMERO.ENTERO],
    });
    const actual = o.operacionesExamen;
    // expect(actual).all.match(/^[0-9]+ [-+∙\/] [0-9]+ = [0-9]$/);
    expect(actual).to.satisfy( (operacion) => {
      const re = new RegExp(/^-?[0-9]+ [-+∙\/] \(?-?[0-9]+\)? = -?[0-9]+$/);
      // si alguna operacion on coincide con la exp regular:
      const operacionNoMatch = operacion.some(
          (o) => {
            const match = re.exec(o.toString());
            if ( debug ) console.log(match, o.toString() );
            return !( match && match.length > 0);
          }
      );
      return !operacionNoMatch;
    }, actual.operacionesExamen);
    debug = false;
  });

  it('DECIMAL: números con decimales (máximo 3)', ()=>{
    global.debug= false;
    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      tiposOperaciones: OPERACIONES.base,
      tiposNumero: [TIPO_NUMERO.DECIMAL],
    });

    const actual = o.operacionesExamen;

    expect(actual).to.satisfy( (operacion) => {
      const re = new RegExp(
          '^([\\( ]?-?[0-9]+([.][0-9]{0,3})?\\)?) [-+*\\/] ' +
          '([\\( ]?\\(?-?[0-9]+([.][0-9]{0,3})?\\)?[ \\)]?) ' +
          '= (-?[0-9]+([.][0-9]{0,3})?)$');
      // si alguna operacion on coincide con la exp regular:
      const operacionNoMatch = operacion.some(
          (o) => {
            const match = re.exec(o.toString());
            // if ( debug ) {
            console.log('tests:', 'match:', match, o.toString(), 'resultado', o.resultado );
            // }

            const algunaCoincide = ( match && match.length > 0);
            // comprobar que al menos uno de los números tiene decimales:
            let decimales = false;
            if (algunaCoincide) {
            // decimales la primera cifra:
              if ( match[2] && match[2] != '' ) decimales = true;
              // decimales segunda cifra:
              if ( match[4] && match[4] != '' ) decimales = true;
              // decimales resultado
              if ( match[6] && match[6] != '' ) decimales = true;
              if ( debug ) {
                console.log( 'decimales', decimales );
              }
            }
            // si no coincide con la exp regular o no tiene ni un numero
            // con decimales falla
            return !algunaCoincide || !decimales;
          }
      );
      return !operacionNoMatch;
    }, actual.operacionesExamen);
    debug = false;
  });

  it('DECIMAL: deberia generar a nivel 8 máximo 1 o 2 decimal', ()=>{
    // global.debug = true;
    // let debug = true;
    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      nivel: 8,
      tiposOperaciones: OPERACIONES.base,
      tiposNumero: [TIPO_NUMERO.DECIMAL],
    });
    const actual = o.operacionesExamen;
    // falla por que las divisiones las fuerza a que sean de 2 operandos!
    expect(actual).to.satisfy( (operacion) => {
      const re = new RegExp(
          '^([\\( ]?-?[0-9]+([.][0-9]{0,2})?\\)?) [-+*\\/] ' +
          '([\\( ]?\\(?-?[0-9]+([.][0-9]{0,2})?\\)?[ \\)]?) ' +
          '= (-?[0-9]+([.][0-9]{0,3})?)$'); // he dejado el resultado con 3 decimales por mul/div
      // si alguna operacion on coincide con la exp regular:
      // '^([\( ]?-?[0-9]+([.][0-9]{0,1})?\)?) [-+∙\/] ([\( ]?\(?-?[0-9]+([.][0-9]{0,1})?\)?[ \)]?) = (-?[0-9]+([.][0-9]{0,3})?)$'
      // para buscar en
      // ([\( ]?-?[0-9]+([.][0-9]{0,1})?\)?) [-+∙\/] ([\( ]?\(?-?[0-9]+([.][0-9]{0,1})?\)?[ \)]?) = \[(-?[0-9]+([.][0-9]{0,3})?)\]
      const operacionNoMatch = operacion.some(
          (o) => {
            const match = re.exec(o.toString());
            if ( debug ) {
              if (o.decimalesMaximo>1) {
                console.log(
                    match, '\n\t',
                    o.toString(), '\n\t',
                    'resultado', o.resultado, '\n\t',
                    'decimales máximos:', o.decimalesMaximo, '\n\t'
                );
              }
            }
            const algunaCoincide = ( match && match.length > 0);
            let decimales = false;
            if (algunaCoincide) {
            // decimales la primera cifra:
              if ( match[2] && match[2] != '' ) decimales = true;
              // decimales segunda cifra:
              if ( match[4] && match[4] != '' ) decimales = true;
              // decimales resultado
              if ( match[6] && match[6] != '' ) decimales = true;
              if ( !decimales ) {
                if ( debug ) console.log( 'decimales', decimales );
              }
            } else {
              if ( debug ) console.log('no coincide', o.toString() );
            }
            return !algunaCoincide || !decimales;
          }
      );
      return !operacionNoMatch;
    }, actual.operacionesExamen);
    debug = false;
  });

  it('DECIMAL: +-* a nivel 8 máximo 1 decimal ', ()=>{
    global.debug = false;
    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      nivel: 8,
      tiposOperaciones: [
        OPERACIONES.SUMA,
        // OPERACIONES.RESTA,
        // OPERACIONES.MULTIPLICACION
      ],
      tiposNumero: [TIPO_NUMERO.DECIMAL],
    });
    const actual = o.operacionesExamen;
    expect(actual).to.satisfy( (operacion) => {
      const re = new RegExp(
          '^([\\( ]?-?[0-9]+([.][0-9]{0,1})?\\)?) [-+*\\/] ' +
          '([\\( ]?\\(?-?[0-9]+([.][0-9]{0,1})?\\)?[ \\)]?) ' +
          '= (-?[0-9]+([.][0-9]{0,3})?)$'); // he dejado el resultado con 3 decimales por mul/div
      // si alguna operacion on coincide con la exp regular:
      // '^([\( ]?-?[0-9]+([.][0-9]{0,1})?\)?) [-+∙\/] ([\( ]?\(?-?[0-9]+([.][0-9]{0,1})?\)?[ \)]?) = (-?[0-9]+([.][0-9]{0,3})?)$'
      // para buscar en
      // ([\( ]?-?[0-9]+([.][0-9]{0,1})?\)?) [-+∙\/] ([\( ]?\(?-?[0-9]+([.][0-9]{0,1})?\)?[ \)]?) = \[(-?[0-9]+([.][0-9]{0,3})?)\]
      const operacionNoMatch = operacion.some(
          (o) => {
            const match = re.exec(o.toString());
            if ( debug ) {
              console.log(
                  'testmatch',
                  match, '\n\t',
                  o.toString(), '\n\t',
                  'resultado', o.resultado, '\n\t',
                  'decimales maximos:', o.decimalesMaximo, '\n\t'
              );
            }
            const algunaCoincide = ( match && match.length > 0);
            let decimales = false;
            if (algunaCoincide) {
            // decimales la primera cifra:
              if ( match[2] && match[2] != '' ) decimales = true;
              // decimales segunda cifra:
              if ( match[4] && match[4] != '' ) decimales = true;
              // decimales resultado
              if ( match[6] && match[6] != '' ) decimales = true;
              if ( debug ) console.log( 'decimales', decimales );
            }
            return !algunaCoincide || !decimales;
          }
      );
      return !operacionNoMatch;
    }, actual.operacionesExamen);
    debug = false;
  });

  it('DECIMAL: a nivel 15 máximo 2 decimales', ()=>{
    // debug = false;
    // let debug = true;
    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      nivel: 15,
      tiposOperaciones: OPERACIONES.base,
      tiposNumero: [TIPO_NUMERO.DECIMAL],
    });
    const actual = o.operacionesExamen;
    expect(actual).to.satisfy( (operacion) => {
      const re = new RegExp(
          '^([\\( ]?-?[0-9]+([.][0-9]{0,2})?\\)?) [-+*\\/]' +
          '([\\( ]?\\(?-?[0-9]+([.][0-9]{0,2})?\\)?[ \\)]?) ' +
          '= (-?[0-9]+([.][0-9]{0,3})?)$'); // he dejado el resultado con 3 decimales por mul/div
      // si alguna operacion on coincide con la exp regular:
      const operacionNoMatch = operacion.some(
          (o) => {
            const match = re.exec(o.toString());
            if ( debug ) {
              console.log(match, o.toString(),
                  'resultado', o.resultado );
            }
            const algunaCoincide = ( match && match.length > 0);
            let decimales = false;
            if (algunaCoincide) {
            // decimales la primera cifra:
              if ( match[2] && match[2] != '' ) decimales = true;
              // decimales segunda cifra:
              if ( match[4] && match[4] != '' ) decimales = true;
              // decimales resultado
              if ( match[6] && match[6] != '' ) decimales = true;
              if ( debug ) console.log( 'decimales', decimales );
            }
            return !algunaCoincide || !decimales;
          }
      );
      return !operacionNoMatch;
    }, actual.operacionesExamen);
    debug = false;
  });

  it('DECIMAL: forzar 4 decimales ', ()=>{
    const o = new GenerarExamen( {
      cantidadOperaciones: 100,
      tiposOperaciones: OPERACIONES.base,
      tiposNumero: [TIPO_NUMERO.DECIMAL],
      decimalesMaximo: 4,
    });
    const actual = o.operacionesExamen;
    expect(actual).to.satisfy( (operacion) => {
      const re = new RegExp(
          '^([\\( ]?-?[0-9]+([.][0-9]{0,4})?\\)?) [-+*\\/]' +
          '([\\( ]?\\(?-?[0-9]+([.][0-9]{0,4})?\\)?[ \\)]?) ' +
          '= (-?[0-9]+([.][0-9]{0,4})?)$');
      const operacionNoMatch = operacion.some(
          (o) => {
            const match = re.exec(o.toString());
            console.log(o.toString());
            if ( debug ) {
              console.log(match, o.toString(),
                  'resultado', o.resultado );
            }
            const algunaCoincide = ( match && match.length > 0);
            let decimales = false;
            if (algunaCoincide) {
            // decimales la primera cifra:
              if ( match[2] && match[2] != '' ) decimales = true;
              // decimales segunda cifra:
              if ( match[4] && match[4] != '' ) decimales = true;
              // decimales resultado
              if ( match[6] && match[6] != '' ) decimales = true;
              if ( debug ) console.log( 'decimales', decimales );
            }
            return !algunaCoincide || !decimales;
          }
      );
      return !operacionNoMatch;
    }, actual.operacionesExamen);
    debug = false;
  });

  it('01. Resultado Negativo: numeros positivos', ()=>{
    debug = false;
    const op = new GenerarExamen({
      cantidadOperaciones: 100,
      nivel: 10,
      cantidadOperandos: 3,
      tiposOperaciones: [
        OPERACIONES.RESTA,
        OPERACIONES.DIVISION,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
      ],
      tiposNumero: [TIPO_NUMERO.NATURAL],
      operacionMultiple: true,
      posicionIncognitaAlAzar: true,
      resultadoNegativo: true,
    });
    const actual = op.operacionesExamen;
    // console.log(op);
    console.log(actual.length);

    // actual.forEach( (op, i) => {
    //   console.log(i, op.toString());
    // });
    expect(actual).to.satisfy( (operaciones) => {
      const hayResultadoPositivo = operaciones.some( (o) => {
        console.log(o.toString());
        if ( o.resultado > -1 ) {
          console.log(o.toString());
          return true;
        }
        return false;
      });
      // si hay positivo el test falla
      return !hayResultadoPositivo;
    });
  });

  it('02. Resultado Negativo: números positivos y decimales', ()=>{
    debug = false;
    const op = new GenerarExamen({
      cantidadOperaciones: 100,
      nivel: 10,
      cantidadOperandos: 3,
      tiposOperaciones: [
        OPERACIONES.RESTA,
        OPERACIONES.DIVISION,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
      ],
      tiposNumero: [TIPO_NUMERO.NATURAL, TIPO_NUMERO.DECIMAL],
      operacionMultiple: true,
      posicionIncognitaAlAzar: true,
      resultadoNegativo: true,
    });
    const actual = op.operacionesExamen;
    console.log(actual.length);

    expect(actual).to.satisfy( (operaciones) => {
      const hayResultadoPositivo = operaciones.some( (o) => {
        // console.log(o.toString());
        if ( o.resultado >= 0 ) {
          console.log(o.resultado);
          return true;
        }
        return false;
      });
      // si hay positivo el test falla
      return !hayResultadoPositivo;
    });
  });

  it('03.  Resultado Negativo y números negativos', ()=>{
    debug = false;
    const op = new GenerarExamen({
      cantidadOperaciones: 50,
      nivel: 10,
      cantidadOperandos: 3,
      tiposOperaciones: [
        OPERACIONES.RESTA,
        OPERACIONES.DIVISION,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
      ],
      tiposNumero: [TIPO_NUMERO.ENTERO],
      operacionMultiple: true,
      posicionIncognitaAlAzar: true,
      resultadoNegativo: true,
    });
    const actual = op.operacionesExamen;

    expect(actual).to.satisfy( (operaciones) => {
      const hayResultadoPositivo = operaciones.some( (o, i) => {
        console.log( o.toString() );
        // if ( o.resultado == false ) {
        //   console.log( 'i', i, 'id:', o.id, o);
        //   return true;
        // }
        if ( o.resultado > -1 ) {
          // if ( !o.toString() ) {
          //   console.log(JSON.stringify(o));
          // }
          console.log( o.toString() );
          return true;
        }
        return false;
      });
      // si hay positivo el test falla
      return !hayResultadoPositivo;
    });
  });

  it('04. Resultado Negativo y números negativos decimales', ()=>{
    debug = false;
    const op = new GenerarExamen({
      cantidadOperaciones: 50,
      nivel: 10,
      cantidadOperandos: 3,
      tiposOperaciones: [
        OPERACIONES.RESTA,
        OPERACIONES.DIVISION,
        OPERACIONES.MULTIPLICACION,
        OPERACIONES.SUMA,
      ],
      tiposNumero: [TIPO_NUMERO.ENTERO, TIPO_NUMERO.DECIMAL],
      operacionMultiple: true,
      posicionIncognitaAlAzar: true,
      resultadoNegativo: true,
    });
    const actual = op.operacionesExamen;
    // console.log(op.errors);
    // console.log('length', actual.length);

    expect(actual).to.satisfy( (operaciones) => {
      const hayResultadoPositivo = operaciones.some( (o, i) => {
        console.log('n', i, ':', o.toString());
        if ( o.resultado >= 0 ) {
          console.log('resultado positivo');
          console.log('n', i, ':', o.toString());
          return true;
        }
        return false;
      });
      // si hay positivo el test falla
      return !hayResultadoPositivo;
    });
  });

  // it('Multiplo10 : deberia genera multiplos10');
  // it('Multiplo100 : deberia genera multiplos100');


  // it('generar operaciones con incoginta al azar y decimales', ()=>{
  //   const o = new GenerarExamen( {
  //     nivel: 10,
  //     cantidadOperaciones: 10,
  //     cantidadOperandos: 3,
  //     cuentaAtras: 0,
  //     operacionMultiple: true,
  //     posicionIncognitaAlAzar: true,
  //     resultadoNegativo: false,
  //     tiposNumero: [0, 1, 2],
  //     tiposOperaciones: ['suma', 'resta', 'division', 'multiplicacion'],
  //   });
  //   const actual = o.operacionesExamen;
  //   expect(actual).to.satisfy( (operaciones) => {
  //     operaciones.forEach((operacion) => {
  //       console.log( operacion.toString(true, true) );
  //     });

  //     return false;
  //   });
  // });
});


// ()=>{ }

