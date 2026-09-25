
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
import OPERACIONES from '../src/operaciones/operaciones';
import {seededRandom} from '../src/operaciones/random';

// const {equal} = require('assert');
// import debug from '../src/debug';
// let debug = false;

// use equal when comparing numbers, strings, or booleans, and use
// eql when comparing arrays or objects.

describe('Resta', ()=>{

  it('00debería restar dos números correctamente', ()=>{
    const input = {
      cantidadOperandos: 2,
      // incognita: 'random',
      operandos: [34, 18],
    };
    const resultado = 34-18;

    const s = new objetos.Resta(input);
    console.log(s.toString());

    expect( parseInt(s.resultado.toFixed() )).to.be.equal(resultado);
  });
  it('01debería restar tres números correctamente', ()=>{
    // global.debug = true;
    const input = {
      cantidadOperandos: 2,
      // incognita: 'random',
      operandos: [34, 18, 10],
    };
    const resultado = 34-18-10;
    const s = new objetos.Resta(input);
    // console.log(s.toString());

    expect( parseInt(s.resultado.toFixed() )).to.be.equal(resultado);
  });
  it('02enfocado debería mostrar un numero igual al del nivel', ()=>{
    const input = {nivel: 10, enfocado: true, permitirNegativos: false};

    // debug = true;
    const s = new objetos.Resta(input);
    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log(s.nivel);
    // console.log(s.toString());
    // console.log('enfocado debería = nivel\n', s );
    // console.log('actual\n',s.toString() );
    // debug = false;

    expect(actual).to.include(10);
  });
  it('03enfocado debería mostrar un numero igual al del nivel 100', ()=>{
    const input = {
      nivel: 100,
      enfocado: true,
      permitirNegativos: true,
    };
    const s = new objetos.Resta(input);
    // s.enfocado = true;
    // s.generarNumerosOperandos();
    // s.calcularResultado();
    debug= false;
    const actual = s.operandos;
    actual.push(s.resultado);
    if ( debug ) {
      // FIXME : PARA FORZAR SE CAMBIA EL ORDEN DE LOS OPERANDOS Y EL ENFOCADO
      // ESTA EN OTRO LUGAR
      // EL TEST FALLA PERO APARECE UN NUMERO CON EL NIVEL
      console.log(s.toString());
      console.log('actual', actual, 'pos nivel', s.posicion_nivel );
      console.log('enfocado debería = nivel', s.toString() );
    }

    expect(actual[s.posicion_nivel-1]).be.oneOf([100, -100]);
  });
  it('04no enfocado debería mostrar al menos un numero entre 0 y 60 a nivel 50', ()=>{
    const input = {nivel: 50, enfocado: false};
    const s = new objetos.Resta(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    // debug = true;
    // console.log(s.nivel);
    // console.log(s.toString());
    //  no funciona con expect(actual).any.within(40,60);
    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=60 ) r = true;
      });
      return r;
    });
  });
  it('05no enfocado debería mostrar al menos un numero entre 0 y 150 a nivel 100', ()=>{
    const input = {nivel: 100, enfocado: false};
    const s = new objetos.Resta(input);
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
  it('06no enfocado debería mostrar al menos un numero entre 0 y 600 a nivel 500', ()=>{
    const input = {nivel: 500, enfocado: false};
    const s = new objetos.Resta(input);
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
  it('07no enfocado debería mostrar al menos un numero entre el 0 y 10 a nivel 10', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.Resta(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=10 ) r = true;
      });
      return r;
    });
  });
  it('08no enfocado debería mostrar al menos un numero entre el 0 y 20 a nivel 20', ()=>{
    debug = false;
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.Resta(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=20 ) r = true;
      });
      return r;
    });
  });

  it('09no debería mostrar números negativos si no esta activado permitir negativos,2 operandos', ()=>{
    // debug= true;
    const input = {
      nivel: 20,
      cantidadOperandos: 2,
    };
    const s = new objetos.Resta(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 ) r = true;
      });
      return r;
    });
    debug = false;
  });

  it('10no debería mostrar números negativos si no esta activado permitir negativos, 4 operandos', ()=>{
    debug= false;
    const input = {
      nivel: 20,
      cantidadOperandos: 4,
    };
    const s = new objetos.Resta(input);
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
  it('11debería ser un numero valido cuando el numero que define el nivel es el resultado', ()=>{
    // debug = true;
    const input = {
      nivel: 100,
      cantidadOperandos: 3,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.Resta(input);
    // console.log(actual.toString());

    expect(Math.abs(actual.resultado)).to.be.within(0, 100);
    debug = false;
  });
  it('debería cambiar la cantidad de operandos si es mayor que el nivel, ', ()=>{
    // debug = true;
    const input = {nivel: 2, cantidadOperandos: 3, permitirNegativos: false};
    const s = new objetos.Resta(input);
    const actual = s.cantidad_operandos;

    expect(actual).to.be.equal(2);
    debug = false;
  });
  it('no debería mostrar resultado negativo en las restas si no esta activado permitir negativos, 3 operandos', ()=>{
    debug = false;
    const input = {
      nivel: 20,
      cantidadOperandos: 4,
      permitirNegativos: false};
    const s = new objetos.Resta(input);
    const actual = s.resultado;
    // console.log(s.toString());
    expect(actual).to.greaterThan(-1);
    debug = false;
  });
  it('no debería mostrar resultado negativo en las restas si no esta activado permitir negativos, 4 operandos', ()=>{
    debug = false;
    const input = {nivel: 20, cantidadOperandos: 4, permitirNegativos: false};
    const s = new objetos.Resta(input);
    const actual = s.resultado;
    // console.log(s.toString());
    expect(actual).to.greaterThan(-1);
    debug = false;
  });

  it('15debería dar múltiplos de 10 con la opción x10', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo10: true,
      random: seededRandom(1),
    };
    const actual = new objetos.Resta(input);
    // console.log( actual );

    expect(actual).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        r = (Math.abs(operando)>0 && operando % 10 == 0 );
        i++;
      } while (r==true && i<=x.cantidadOperandos );
      return r;
    }, actual.operandos );
    debug = false;
  });

  it('debería dar múltiplos de 100 con la opción x100', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo100: true,
      random: seededRandom(1),
    };
    const actual = new objetos.Resta(input);
    // console.log( actual );

    expect(actual).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        r = (Math.abs(operando)>0 && operando % 100 == 0 );
        i++;
      } while (r==true && i<=x.cantidadOperandos );
      return r;
    }, actual.operandos );
    debug = false;
  });

  it('complementarios debería estar entre 10-100', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      complementario: 120,
    };
    const actual = new objetos.Resta(input);

    expect(actual.complementario).to.be.within(10, 100);
    debug = false;
  });

  it('complementarios debería ser múltiplo de 10', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      complementario: 12,
    };
    const actual = new objetos.Resta(input);

    expect( actual.complementario ).to.satisfy(function(x) {
      return (x % 10)==0;
    }, 'expected '+actual.complementario+' to be divisible by 10' );
    debug = false;
  });

  it('complemetario debería generar resultado igual al valor de complementario', ()=>{
    debug = false;
    const input = {
      complementario: 50,
    };
    const actual = new objetos.Resta(input);

    if ( debug ) console.log('\nACTUAL\n', actual );
    expect(actual.resultado).to.be.equal(input.complementario);

    debug = false;
  });

  it('20complemetario debería generar operandos múltiplos de 10 cuando el nivel es 100', ()=>{
    // debug = true;
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Resta(input);

    if ( debug ) console.log('\nACTUAL\n', actual );
    expect(actual.operandos).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x[i];
        r = (operando % 10 == 0 );
        i++;
      } while (r==true && i<=x.cantidadOperandos );
      return r;
    }, 'operandos: ' + actual.operandos );

    debug = false;
  });

  it('con complementario, debería tener 2 operandos cuando no lo especificas', ()=>{
    debug = false;
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Resta(input);

    if ( debug )console.log('\nACTUAL\n', actual );
    expect(actual.operandos).to.have.length(2);

    debug = false;
  });
  it('con complementario, debería ser igual cantidad_operandos que la longitud de el array operandos', ()=>{
    debug = false;
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Resta(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.operandos.length).be.equal(actual.cantidad_operandos);

    debug = false;
  });

  it('con complementario, sin negativos el primer operando debería ser mayor o igual que el resultado 100', ()=>{
    // debug = true;
    const input = {
      complementario: 100,
      // permitirNegativos: false,
    };
    const actual = new objetos.Resta(input);

    if ( debug ) console.log('\nACTUAL\n', actual );
    expect(actual.operandos[0]).be.greaterThan(99);

    debug = false;
  });


  it('con complementario, sin negativos, el primer operando debería ser mayor que el resultado 30', ()=>{
    // debug = true;
    const input = {
      complementario: 30,
    };
    const actual = new objetos.Resta(input);

    if ( debug ) console.log('\nACTUAL\n', actual );
    expect(actual.operandos[0]).be.greaterThan(30);

    debug = false;
  });

  it('25con complementario, todos los operandos deberían ser números', ()=>{
    // debug = true;
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Resta(input);

    if ( debug )console.log('\nACTUAL\n', actual );
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
    }, '['+actual.operandos+']' );

    debug = false;
  });

  // pruebas complementarios con num negativos
  // it('complemetario con números negativos' );

  // TODO: preguntar
  // Complementary-range behavior is covered by the concrete tests below.

  it('27no debería cambiar los operandos cuando los manda el usuario', ()=>{
    const input = {
      operandos: [34, 18],
    };
    const s = new objetos.Resta(input);
    expect( s.operandos ).to.eql(input.operandos);
  });

  const resuPositivoPrimerOp = {};
  resuPositivoPrimerOp.operandos=[];
  resuPositivoPrimerOp.operandos[0]=10;
  resuPositivoPrimerOp.input = {
    operandos: resuPositivoPrimerOp.operandos,
    cantidadOperandos: 2,
  };
  resuPositivoPrimerOp.operacion= new objetos.Resta(resuPositivoPrimerOp.input);


  it('28generar resta con un resultado positivo (o 0) dado el primer operando', ()=>{
    // debug = true;
    const s = resuPositivoPrimerOp.operacion;
    if ( debug ) console.log(s);
    expect(s.resultado).to.greaterThan(-1);
    debug = false;
  });
  it('29generar resta con el primer operando igual a el primer operando dado ', ()=>{
    debug = false;
    const s = resuPositivoPrimerOp.operacion;
    if ( debug ) console.log(s);
    expect(s.operandos[0]).to.be.equal(10);
    debug = false;
  });

  // global.debug = true;
  const resuPositivoSegundoOp = {};
  resuPositivoSegundoOp.operandos=[];
  resuPositivoSegundoOp.operandos[1]=10;
  resuPositivoSegundoOp.input = {
    operandos: resuPositivoSegundoOp.operandos,
    cantidadOperandos: 2,
  };
  resuPositivoSegundoOp.operacion = new objetos.Resta(resuPositivoSegundoOp.input);
  // debug = false;

  it('30 generar resta con un resultado positivo dado el segundo operando', ()=>{
    debug = false;
    const s = resuPositivoSegundoOp.operacion;
    if ( debug ) console.log(s);
    expect(s.operandos[1]).to.be.equal(10);
    debug = false;
  });

  it('31 generar resta con un resultado positivo dado el segundo operando,b', ()=>{
    // debug = true;
    const s = resuPositivoSegundoOp.operacion;
    if ( debug ) console.log(s);
    expect(s.resultado).to.greaterThan(-1);
    debug = false;
  });

  it('32 vacío - vacío - 50 = debería generar operacion positiva', ()=>{
    // debug = true;
    const input = {
      cantidadOperandos: 3,
      operandos: [undefined, undefined, 50],
      permitirNegativos: false,
    };
    const s = new objetos.Resta(input);
    if ( debug ) console.log( s.toString() );

    expect(s.resultado).to.be.greaterThan(0);
    debug = false;
  });
  it('33 vacío - 4 = - #', ()=>{
    // debug = true;
    const input = {
      operandos: [undefined, 4],
      resultadoNegativo: true,
    };
    const s = new Resta(input);
    if ( debug ) console.log( s.toString() );

    expect(s.resultado).to.be.lessThan(0);
    debug = false;
  });
  it('34 vacío - 4 = - #, todos los operandos positivos', ()=>{
    // debug = true;
    const input = {
      operandos: [undefined, 4],
      resultadoNegativo: true,
    };
    const actual = new Resta(input);
    if ( debug ) console.log( actual.toString() );

    expect(actual.operandos).to.satisfy(function(x) {
      // si alguno es negativo devuelve false
      return !( x.some((operando) => {
        return ( operando<0 );
      }));
    });

    // expect(actual).to.match(/[0-9]+ - 4 = -[0-9]+/);
    debug = false;
  });

  it('35 4 - vacio = - #', ()=>{
    // debug = true;
    const input = {
      operandos: [4],
      resultadoNegativo: true,
    };
    const s = new Resta(input);
    if ( debug ) console.log( s.toString() );

    expect(s.resultado).to.be.lessThan(0);
    debug = false;
  });
  it('36 4 - vacio  = - #, todos los operandos positivos', ()=>{
    // debug = true;
    const input = {
      operandos: [4],
      resultadoNegativo: true,
    };
    const actual = new Resta(input);
    if ( debug ) console.log( actual.toString() );

    expect(actual.operandos).to.satisfy(function(x) {
      // si alguno es negativo devuelve false
      return !( x.some((operando) => {
        return ( operando<0 );
      }));
    });

    // expect(actual).to.match(/[0-9]+ - 4 = -[0-9]+/);
    debug = false;
  });
  it('37.Resta,Forzar Resultado negativo, y un Operando Negativo en el operando no definido', ()=> {
    // no se puede forzar negativo en operandos definidos
    const input = {
      'nivel': 10,
      'cantidadOperandos': 2,
      'permitirNegativos': false,
      'tiposNumero': [1],
      'forzarSignos': [-1, 1],
      'decimales': false,
      'resultadoNegativo': true,
      'operandos': [undefined, 45],
    };
    const s = new objetos.Resta(input);
    console.log(s.toString());
    expect( parseInt(s.resultado) ).to.be.lessThan(0);
  });


  it('38. múltiplos de 10, 3 operandos, resultado negativo', ()=>{
    debug = false;
    const input = {
      nivel: 10,
      cantidadOperandos: 3,
      permitirNegativos: true,
      resultadoNegativo: true,
      multiplo10: true,
    };
    const actual = new objetos.Resta(input);
    // console.log( actual );

    expect(actual).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        // operando multiplo de 10
        r = (Math.abs(operando)>0 && operando % 10 == 0 );
        i++;
      } while (r==true && i<=x.cantidadOperandos );

      return (r && x.resultado<0 );

    }, actual.operandos + ' resultado:' + actual.resultado );
    debug = false;
  });
});

