
const expect = require('chai').expect;
// let assert = require('chai').assert;
import Operacion from '../src/operaciones/operacion';
import Suma from '../src/operaciones/suma';
import Resta from '../src/operaciones/resta';
import Multiplicacion from '../src/operaciones/multiplicacion';
import DivisionEntera from '../src/operaciones/divisionEntera';
import DivisionResto from '../src/operaciones/divisionResto';
import DivisionDecimales from '../src/operaciones/divisionDecimales';

const objetos = {};
objetos.Operacion = Operacion;
objetos.Suma = Suma;
objetos.Resta = Resta;
objetos.Multiplicacion = Multiplicacion;
objetos.DivisionEntera = DivisionEntera;
objetos.DivisionResto = DivisionResto;
objetos.DivisionDecimales = DivisionDecimales;

import {Decimal} from 'decimal.js';

// const {equal} = require('assert');
// import debug from '../src/debug';
// let debug = false;

// use equal when comparing numbers, strings, or booleans, and use
// eql when comparing arrays or objects.

describe('Division Resto', ()=>{
  let divisionRestoAuto;
  before(()=>{
    divisionRestoAuto = new objetos.DivisionResto({cantidadOperandos: 2});
  });

  it('debería dividir dos números correctamente y mostrar el resto', ()=>{
    const input = {
      cantidadOperandos: 2,
      operandos: [13, 5],
    };
    const s = new objetos.DivisionResto(input);
    const actual = {
      resultado: s.resultado.toString(),
      resto: s.resto.toString(),
    };
    // console.log(s.operandos);
    // const dividendo = s.operandos[0];
    // const divisor = s.operandos[1];
    // const resultado = new Decimal(dividendo).div(divisor).floor().toFixed(0);
    // const resto = new Decimal(dividendo).modulo(divisor);
    const resultado = 2;
    const resto = 3;

    const expected = {
      resultado: resultado.toString(),
      resto: resto.toString(),
    };

    expect(actual).to.eql(expected);
  });

  it('debería mostrar error si se pasan 3 o mas operando a division', ()=>{
    const input = {cantidadOperandos: 3};
    const s = new objetos.DivisionResto(input);

    const actual = s.errors;
    const expected = [{
      'error': 'Cantidad de operandos',
      'msg': 'No se permiten más de dos operandos para esta operación, '+
             'se enviaron 3'}];

    expect(actual).to.eql(expected);
  });
  it('debería mostrar 2 operandos si se pasan 3 o mas operando a division', ()=>{
    // se pasa un numero entre 3 y 6
    const input = {cantidadOperandos: 5};
    const actual = new objetos.DivisionResto(input);
    // let actual = s.cantidad_operandos;
    const expected = 2;
    // console.log(s);


    expect(actual.cantidad_operandos).to.eql(expected);
  });

  it('debería dividir dos números correctamente (auto)', ()=>{
    // const msg = 'debería dividir dos números correctamente (auto)';

    const s = divisionRestoAuto;
    const resultado = new Decimal(s.operandos[0]).div(s.operandos[1]).floor().toFixed(0);
    console.log(s.operandos);

    expect(s.resultado).to.equal(resultado);
  });

  it('debería dividir dos números correctamente (auto) -> resto ', ()=>{
    // const msg = 'debería dividir dos números correctamente (auto)';

    const s = divisionRestoAuto;
    const resto = new Decimal(s.operandos[0]).modulo(s.operandos[1]).toString();
    expect(s.resto.toString()).to.eql(resto);
  });

  it('debería dividir dos números correctamente, redondeo hacia abajo', ()=>{

    // si es entera, cambia el primer operando para que tenga resto pero es el mismo resultado
    const input = {
      cantidadOperandos: 2,
      operandos: [102, 17],
    };
    const resultado = Math.floor(102/17);
    const actual = new objetos.DivisionResto(input);
    // console.log(actual);
    expect(actual.resultado).to.eql(resultado.toString());

  });

  // en las divisiones con resto modifica el dividendo para que tenga un resto
  // por lo que no esta enfocada casi nunca

  // it('enfocado debería mostrar un numero igual al del nivel', ()=>{
  //   const input = {nivel: 10, enfocado: true, permitirNegativos: false};

  //   const s = new objetos.DivisionResto(input);
  //   const actual = s.operandos;

  //   actual.push(s.resultado);

  //   if ( debug ) console.log(actual);

  //   expect(actual).to.include(10);
  // });
  // it('enfocado debería mostrar un numero igual al del nivel 100', ()=>{
  //   const input = {
  //     nivel: 100,
  //     enfocado: true,
  //     permitirNegativos: true,
  //   };
  //   const s = new objetos.DivisionResto(input);
  //   // s.enfocado = true;
  //   // s.generarNumerosOperandos();
  //   // s.calcularResultado();
  //   const actual = s.operandos;
  //   actual.push(s.resultado);
  //   // console.log(s.nivel);
  //   // console.log(s);
  //   if ( debug ) {
  //     console.log('actual', actual, 'pos nivel', s.posicion_nivel );
  //     console.log('enfocado debería = nivel', s.toString() );
  //   }

  //   expect(actual[s.posicion_nivel-1]).be.oneOf([100, -100]);
  // });

  it('no enfocado debería mostrar al menos un numero entre el 1 y 9 a nivel 5', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 5, enfocado: false};
    const s = new objetos.DivisionResto(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=1 && operando<=9 ) r = true;
      });
      return r;
    });
  });

  it('no enfocado debería mostrar al menos un numero entre 0 y 51 a nivel 50', ()=>{
    const input = {nivel: 50, enfocado: false};
    const s = new objetos.DivisionResto(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    // console.log(s.nivel);
    // console.log(s.toString());
    //  no funciona con expect(actual).any.within(40,60);
    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=51 ) r = true;
      });
      return r;
    });
  });
  it('no enfocado debería mostrar al menos un numero entre 0 y 100 a nivel 100', ()=>{
    const input = {nivel: 100, enfocado: false};
    const s = new objetos.DivisionResto(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=100 ) r = true;
      });
      return r;
    });
  });
  it('no enfocado debería mostrar al menos un numero entre 0 y 500 a nivel 500', ()=>{
    const input = {nivel: 500, enfocado: false};
    const s = new objetos.DivisionResto(input);
    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log(s.posicion_nivel );

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=500 ) r = true;
      });
      return r;
    });
  });
  it('no enfocado debería mostrar al menos un numero entre el 1 y 10 a nivel 10', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.DivisionResto(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=1 && operando<=10 ) r = true;
      });
      return r;
    });
  });
  it('no enfocado debería mostrar al menos un numero entre el 1 y 39 a nivel 20', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.DivisionResto(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=1 && operando<=39 ) r = true;
      });
      return r;
    });
  });
  it('no debería mostrar números negativos si no esta activado permitir negativos', ()=>{
    const input = {nivel: 20, cantidadOperandos: 4};
    const s = new objetos.DivisionResto(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 ) r = true;
      });
      return r;
    });
  });


  // Operaciones con calculo nivel en resultado
  // en la division no se puede poner el niver como resultado
  // it('el resultado debería ser un numero valido cuando el numero que define el nivel es el resultado',()=>{
  //     // debug = true;
  //     let input = {
  //         nivel: 100,
  //         cantidadOperandos: 2,
  //         permitirNegativos: true,
  //         posicion_nivel: 3
  //     };
  //     let actual = new objetos.DivisionResto(input);
  //     if ( debug ) console.log( actual );

  //     expect(Math.abs(actual.resultado)).to.be.within(50,150);
  // });


  it('posicion nivel debería cambiarse si es mayor que el numero de operandos', ()=>{
    const input = {
      nivel: 100,
      cantidadOperandos: 3, // cambia 3 operandos a 2
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.DivisionResto(input);

    expect(actual.posicion_nivel).to.be.lessThan(4); // 3 , 2 o 1

  });

  // no sale est error por que antnes falla el de que el numero de operandos tiene que ser 2
  // it('posicion nivel debería devolver error  si es mayor que el numero de operandos',()=>{
  //     // debug = true;
  //     let input = {
  //         nivel: 100,
  //         cantidadOperandos: 3, // cambia 3 operandos a 2
  //         permitirNegativos: true,
  //         posicion_nivel: 4
  //     };
  //     let s = new objetos.DivisionResto(input);
  //     if ( debug ) console.log( s.toString() );

  //     let actual = s.errors;
  //     let expected = [{ 'error':'posicion nivel mayor que numero de operandos' }];

  //     expect(actual).to.has.members(expected);
  // });

  // it('el primer operando debería ser un numero valido cuando el numero que define el nivel es el resultado',()=>{
  //     let input = {
  //         nivel: 100,
  //         cantidadOperandos: 2,
  //         permitirNegativos: true,
  //         posicion_nivel: 4
  //     };
  //     let actual = new objetos.DivisionResto(input);
  //     // console.log(actual.toString());

  //     expect(actual.operandos[0]).not.to.be.equal(NaN);
  // });
  // it('el primer operando debería ser un numero entero cuando el numero que define el nivel es el resultado',()=>{
  //     // debug = true;
  //     let input = {
  //         nivel: 100,
  //         cantidadOperandos: 2,
  //         permitirNegativos: true,
  //         posicion_nivel: 4
  //     };
  //     let actual = new objetos.DivisionResto(input);
  //     // console.log(actual.toString());

  //     expect(actual.operandos[0]).to.satisfy(function(x){
  //         return x % 1 === 0;
  //     });

  // });
  // it('con mas de 2 operandos el primero debería ser entero cuando el numero que define el nivel es el resultado',()=>{
  //     let input = {
  //         nivel: 500,
  //         cantidadOperandos: 4,
  //         permitirNegativos: true,
  //         posicion_nivel: 5
  //     };
  //     let actual = new objetos.DivisionResto(input);
  //     // console.log('actual',actual.toString());

  //     expect(actual.operandos[0]).to.satisfy(function(x){
  //         return x % 1 === 0;
  //     });
  // });
  // it('debería estar correcta la division con mas de 2 operandos y el nivel es el resultado',()=>{
  //     // debug = true;
  //     let input = {
  //         nivel: 500,
  //         cantidadOperandos: 4,
  //         permitirNegativos: true,
  //         posicion_nivel: 5
  //     };
  //     let actual = new objetos.DivisionResto(input);
  //     // console.log(actual);
  //     let expected = actual.operandos[0];
  //     for (let index = 1; index < input.cantidadOperandos; index++) {
  //         element = actual.operandos[index];
  //         expected = expected / element;
  //     }
  //     // console.log('actual',actual.toString());

  //     expect(actual.resultado).equal(expected);
  // });

  it('no pueden haber operandos que no sean números', ()=>{
    const input = {
      nivel: 100,
      cantidadOperandos: 4,
      permitirNegativos: true,
      posicion_nivel: 5,
    };
    const actual = new objetos.DivisionResto(input);


    expect(actual.operandos).satisfy(function(x) {
      let r = true;
      x.forEach((element) => {
        if ( isNaN(element) ) {
          r = false;
        }
        if ( typeof(element) !== 'number' ) {
          r = false;
        }
      });
      return r;
    });
  });

  // no todos tienen que ser de 10 en division con resto
  // it('debería dar múltiplos de 10 con la opción x10',()=>{
  //     let input = {
  //         nivel: 25,
  //         cantidadOperandos: 3,
  //         permitirNegativos: true,
  //         multiplo10 : true,
  //     };
  //     const actual = new objetos.DivisionResto(input);

  //     expect([10,20,30,40,50,60,70,80,90,100,-10,-20,-30,-40,-50,-60,-70,-80,-90,-100]).to.includes(...actual.operandos);
  // });

  it('debería dar múltiplos de 100 con la opción x100', ()=>{
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo100: true,
    };
    const actual = new objetos.DivisionResto(input);
    // console.log( actual );

    // en el caso de division con resto con que un operando lo cumpla vale
    expect(actual).to.satisfy(function(x) {
      let r=false;
      let i= 0;
      do {
        const operando = x.operandos[i];
        r = (Math.abs(operando)>0 && operando % 100 == 0 );
        i++;
      } while (r==false && i < x.cantidad_operandos );
      return r;
    }, actual.operandos );
  });

  it('complementarios debería ser múltiplo de 10', ()=>{
    const input = {
      nivel: 25,
      complementario: 12,
    };
    const actual = new objetos.DivisionResto(input);

    expect( actual.complementario ).to.satisfy(function(x) {
      return (x % 10)==0;
    }, 'expected '+actual.complementario+' to be divisible by 10' );
  });

  // Division-with-remainder complementary output is not a supported contract.
  // Multiples plus complementary mode are not supported for remainder division.
  // quito las pruebas con complementarios

  it('no debería cambiar los operandos cuando los manda el usuario', ()=>{
    const input = {
      operandos: [34, 18],
    };

    const s = new objetos.DivisionResto(input);
    expect(s.operandos).to.eql(input.operandos);
  });
});


