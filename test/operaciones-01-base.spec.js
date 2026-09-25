
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


// const {equal} = require('assert');
// import debug from '../src/debug';
// let debug = false;

// use equal when comparing numbers, strings, or booleans, and use
// eql when comparing arrays or objects.

describe('Objeto Operaciones', ()=>{
  it('debería restar dos números correctamente', ()=>{
    const input = {
      cantidadOperandos: 2,
      // incognita: 'random',
      operandos: [34, 18],
    };
    const resultado = 34-18;

    const s = new objetos.Resta(input);
    expect(s.resultado).to.eql(resultado);
  });
  it('debería multiplicar dos números correctamente', ()=>{
    const input = {
      cantidadOperandos: 2,
      // incognita: 'random',
      operandos: [34, 18],
    };
    const resultado = 34*18;
    const s = new objetos.Multiplicacion(input);
    expect(s.resultado).to.eql(resultado);
  });

  // probar filtros :

  it('no enfocado debería mostrar al menos un numero entre el 1 y 5 a nivel 5', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 5, enfocado: false};
    const s = new objetos.Operacion(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=5 ) r = true;
      });
      return r;
    });
  });
  it('no enfocado debería mostrar al menos un numero entre el 1 y 10 a nivel 10', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.Operacion(input);
    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log('actual',actual);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=1 && operando<=10 ) r = true;
      });
      return r;
    });
  });
  it(
      'no enfocado debería mostrar al menos un numero entre el 1 y 20 a nivel 20',
      ()=>{
        // en los niveles del 1 al 20 se muestro esta entre mas o menos el
        // nivel-1, es decir a nivel 5 entre 5-4 y 5+4
        const input = {nivel: 10, enfocado: false};
        const s = new objetos.Operacion(input);
        const actual = s.operandos;
        actual.push(s.resultado);

        expect(actual).to.satisfy(function(x) {
          let r=false;
          x.forEach((operando) => {
            if ( operando>=1 && operando<=20 ) r = true;
          });
          return r;
        });
      });
  it('no debería mostrar números negativos si no esta activado permitir negativos', ()=>{
    const input = {nivel: 20, cantidadOperandos: 4};
    const s = new objetos.Operacion(input);
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


  it('debería dar múltiplos de 10 con la opción x10', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo10: true,
    };
    const actual = new objetos.Operacion(input);
    // console.log( actual );

    expect(actual).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        r = (operando % 10 == 0 );
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
    };
    const actual = new objetos.Operacion(input);
    // console.log( actual );

    expect(actual).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        r = (operando % 100 == 0 );
        i++;
      } while (r==true && i<=x.cantidadOperandos );
      return r;
    }, actual.operandos );
    debug = false;
  });

  it('complementarios deberían estar entre 10-100', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      complementario: 120,
    };
    const actual = new objetos.Operacion(input);

    expect(actual.complementario).to.be.within(10, 100);
    debug = false;
  });

  it('complementarios deberían ser múltiplo de 10', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      complementario: 12,
    };
    const actual = new objetos.Operacion(input);

    expect( actual.complementario ).to.satisfy(function(x) {
      return (x % 10)==0;
    }, 'expected '+actual.complementario+' to be divisible by 10' );
    debug = false;
  });

  // it ('complementarios deberían fijar el resultado en el valor que se le pasa en complementario')
  it('deberían valer el resultado 30 si se fija complementario 30', ()=>{
    debug=false;
    const input = {
      nivel: 100,
      enfocado: true,
      complementario: 30,
    };
    const actual = new objetos.Operacion(input);
    expect(actual.resultado).is.equal(30);
    debug=false;
  });

  it('no deberían ser el resultado la posición incognita en complementarios',
      ()=>{
        debug=false;
        const input = {
          nivel: 100,
          enfocado: true,
          complementario: 30,
        };
        const actual = new Operacion(input);

        expect(actual.posicion_incognita).is
            .not.equal(actual.cantidad_operandos+1);
        debug=false;
      }
  );

  it('no pueden haber operandos que no sean números', ()=>{
    // debug = true;
    const input = {
      nivel: 100,
      cantidadOperandos: 4,
      permitirNegativos: true,
      posicion_nivel: 5,
    };
    const actual = new objetos.Operacion(input);
    if ( debug )console.log(actual.toString());


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
    debug = false;
  });

  it('complementario debería generar resultado igual al valor de complementario',
      ()=>{
        const input = {
          complementario: 50,
        };
        const actual = new objetos.Operacion(input);

        expect(actual.resultado).to.be.equal(input.complementario);

        debug = false;
      }
  );

  it('complementario, posicion de la incognita no puede ser posicion resultado', ()=>{
    // debug = true;

    const input = {
      complementario: 5,
    };
    const actual = new objetos.Operacion(input);
    if ( debug ) console.log( actual );

    console.log( actual.toString(), actual.posicion_incognita );

    expect(actual.posicion_incognita).not.to.be.equal(3);

    debug = false;
  });

  // pruebas de metodos
  it('multiplicar valores', ()=>{
    const input = [5, 3, 7, 13];
    const oper = new objetos.Operacion();
    const actual = oper.multiplicarValores(input);
    const expected = 5*3*7*13;
    expect(actual).to.be.equal(expected);
  });
  it('dividir valores', ()=>{
    const input = [1000, 2, 5];
    const oper = new objetos.Operacion();
    const actual = oper.dividirValores(input);
    const expected = 100;
    expect(actual).to.be.equal(expected);
  });
  it('factorizar', ()=>{
    const input = [5000];
    const oper = new objetos.Operacion();
    const actual = oper.factorizar(input);
    const expected = [2, 2, 2, 5, 5, 5, 5];// 2*5 2*5 2*5 * 5 => (10*10*10*5)
    expect(actual).to.be.eql(expected);
  });


  it('no debería cambiar los operandos cuando los manda el usuario', ()=>{
    const input = {
      operandos: [34, 18],
    };

    const s = new objetos.Operacion(input);
    expect(s.operandos).to.eql(input.operandos);
  });
});




describe('resolverIncognita', () => {
  it('no recalcula cuando comprobarResultado rechaza la operación', () => {
    const op = new objetos.Operacion();
    let recalculos = 0;
    op.comprobarResultado = () => ({resultado: false});
    op.calcularResultado = () => recalculos++;

    op.resolverIncognita();

    expect(recalculos).to.equal(0);
  });

  it('recalcula cuando comprobarResultado acepta la operación', () => {
    const op = new objetos.Operacion();
    let recalculos = 0;
    op.comprobarResultado = () => ({resultado: true});
    op.calcularResultado = () => recalculos++;

    op.resolverIncognita();

    expect(recalculos).to.equal(1);
  });
});
