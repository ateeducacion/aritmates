
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

describe('Suma', ()=>{
  it('debería sumar dos números correctamente', ()=>{
    const input = {
      cantidadOperandos: 2,
      // incognita: 'random',
      operandos: [34, 18],
    };
    const resultado = 34+18;

    const s = new objetos.Suma(input);
    expect(s.resultado).to.eql(resultado);
  });
  it('enfocado debería mostrar un numero igual al del nivel', ()=>{
    const input = {nivel: 10, enfocado: true, permitirNegativos: false};

    const s = new objetos.Suma(input);
    const actual = s.getOperandos();
    actual.push(s.resultado);
    // console.log( actual );
    // console.log(s);
    // console.log(s.nivel);
    // console.log(s.toString());
    // console.log(s.toHtml());
    // console.log('actual', actual);
    // console.log(s.getOperandos());
    // console.log('enfocado debería = nivel\n', s );
    // console.log('actual\n',s.toString() );

    expect(actual).to.include(10);
  });
  it('enfocado debería mostrar un numero igual al del nivel 100', ()=>{
    const input = {
      nivel: 100,
      enfocado: true,
      permitirNegativos: true,
    };
    const s = new objetos.Suma(input);
    // s.enfocado = true;
    // s.generarNumerosOperandos();
    // s.calcularResultado();
    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log(s.nivel);
    // console.log(s.toString());

    expect(actual[s.posicion_nivel-1]).be.oneOf([100, -100]);
  });
  it('no enfocado debería mostrar al menos un numero entre 0 y 50 a nivel 50', ()=>{
    const input = {nivel: 50, enfocado: false};
    const s = new objetos.Suma(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    // console.log(s.nivel);
    // console.log(s.toString());
    //  no funciona con expect(actual).any.within(40,60);
    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=0 && operando<=50 ) r = true;
      });
      return r;
    });
  });
  it('no enfocado debería mostrar al menos un numero entre 0 y 100 a nivel 100', ()=>{
    const input = {nivel: 100, enfocado: false};
    const s = new objetos.Suma(input);
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
    const s = new objetos.Suma(input);
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
  it('no enfocado debería mostrar al menos un numero entre el 1 y 19 a nivel 10', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.Suma(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=1 && operando<=19 ) r = true;
      });
      return r;
    });
  });
  it('no enfocado debería mostrar al menos un numero entre el 1 y 39 a nivel 20', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.Suma(input);
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
    const s = new objetos.Suma(input);
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
  it('debería ser un numero valido cuando el numero que define el nivel es el resultado', ()=>{
    const input = {
      nivel: 100,
      cantidadOperandos: 3,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.Suma(input);
    // console.log('posicion nivel', actual.posicion_nivel);
    // console.log(actual.toString());
    // console.log('upper_bound', actual.upper_bound );

    expect(Math.abs(actual.resultado)).to.be.within(0, 100);
  });
  it('debería dar múltiplos de 10 con la opción x10', ()=>{
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo10: true,
    };
    const actual = new objetos.Suma(input);
    // console.log( actual );

    expect(actual).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        r = ( operando && operando % 10 == 0 );
        i++;
      } while (r==true && i<=x.cantidadOperandos );
      return r;
    }, actual.operandos );
  });

  it('debería dar múltiplos de 100 con la opción x100', ()=>{
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo100: true,
    };
    const actual = new objetos.Suma(input);
    // console.log( actual );

    expect(actual).to.satisfy(function(x) {
      let r=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        r = ( Math.abs(operando)>=0 && operando % 100 == 0 );
        i++;
        if (!r) {
          console.log('\n Operando' + i +' no es multiplo de 100 ->' + operando + '\n');
          // console.log( x.cantidad_operandos );
        }
      } while (r==true && i<x.cantidad_operandos );
      return r;
    }, actual.operandos);
  });

  it('con la opción x100 pero no pude ser mayor que nivelx100', ()=>{
    const input = {
      nivel: 10,
      cantidadOperandos: 2,
      permitirNegativos: true,
      multiplo100: true,
      resultadoNegativo: true,
    };
    const actual = new objetos.Suma(input);

    expect(actual).to.satisfy(function(x) {
      // console.log('expect', actual, 'x',x);
      let r=true;
      let operandoEnNivel=true;
      let i= 0;
      do {
        const operando = x.operandos[i];
        // console.log('operando', operando);
        operandoEnNivel = ( Math.abs(operando)>=0 && Math.abs(operando)<=(input.nivel*100) );
        i++;
        // console.log('operandoEnNivel==true', (operandoEnNivel==true));
        // console.log('i<=x.cantidadOperandos', i , x.cantidad_operandos );
      } while (operandoEnNivel==true && i<=x.cantidad_operandos );
      return r;
    }, actual.operandos );
  });

  it('complementarios debería estar entre 10-100', ()=>{
    const input = {
      nivel: 25,
      complementario: 120,
    };
    const actual = new objetos.Suma(input);

    expect(actual.complementario).to.be.within(10, 100);
  });

  it('complementarios debería ser múltiplo de 10', ()=>{
    const input = {
      nivel: 25,
      complementario: 12,
    };
    const actual = new objetos.Suma(input);

    expect( actual.complementario ).to.satisfy(function(x) {
      return (x % 10)==0;
    }, 'expected '+actual.complementario+' to be divisible by 10' );
  });
  it('complemetario debería generar resultado igual al valor de complementario', ()=>{
    const input = {
      complementario: 50,
    };
    const actual = new objetos.Suma(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.resultado).to.be.equal(input.complementario);

  });

  it('complementario debería generar operandos múltiplos de 10 cuando el nivel es 100', ()=>{
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Suma(input);

    // console.log('\nACTUAL\n', actual );
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

  });

  it('con complementario, debería tener 2 operandos cuando no lo especificas', ()=>{
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Suma(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.operandos).to.have.length(2);

  });
  it('con complementario, debería ser igual cantidad_operandos que la longitud de el array operandos', ()=>{
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Suma(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.operandos.length).be.equal(actual.cantidad_operandos);

  });

  it('no debería cambiar los operandos cuando los manda el usuario', ()=>{
    const input = {
      operandos: [34, 18],
    };

    const s = new objetos.Suma(input);
    expect(s.operandos).to.eql(input.operandos);
  });

  // TODO:
  // sumar numeros enteros y que de el resultado negativo
  // sumar numeros enteros con decimales y resultado negativo
  // sumar numeros enteros y naturales, con decimales y resultado negativo
});

