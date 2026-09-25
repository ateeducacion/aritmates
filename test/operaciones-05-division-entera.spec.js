
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

describe('Division Entera', ()=>{
  it('debería dividir dos números correctamente (auto)', ()=>{
    const input = {cantidadOperandos: 2};
    const s = new objetos.DivisionEntera(input);
    const resultado = s.operandos[0] / s.operandos[1];

    expect(s.resultado).to.eql(resultado);
  });

  it('debería dividir dos números correctamente', ()=>{
    const input = {
      cantidadOperandos: 2,
      operandos: [102, 17],
    };
    const resultado = 102/17;

    const actual = new objetos.DivisionEntera(input);
    // console.log(actual);
    expect(actual.resultado).to.eql(resultado);
  });
  it('enfocado debería mostrar un numero igual al del nivel', ()=>{
    const input = {nivel: 10, enfocado: true, permitirNegativos: false};
    // debug = true;


    const s = new objetos.DivisionEntera(input);
    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log('enfocado debería = nivel\n', s.nivel );
    // console.log('actual\n',s );
    // debug = false;


    expect(actual).to.include(10);
  });
  it('enfocado debería mostrar un numero igual al del nivel 100', ()=>{
    debug= false;
    const input = {
      nivel: 100,
      enfocado: true,
      permitirNegativos: true,
    };
    const s = new objetos.DivisionEntera(input);

    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log(s.nivel);
    console.log(s);
    if ( debug ) {
      console.log('actual', actual, 'pos nivel', s.posicion_nivel );
      console.log('enfocado debería = nivel', s.toString() );
    }

    expect(actual[s.posicion_nivel-1]).be.oneOf([100, -100]);
  });

  it('no enfocado debería mostrar al menos un numero entre el 0 y 5 a nivel 5', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 5, enfocado: false};
    const s = new objetos.DivisionEntera(input);
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

  it('no enfocado debería mostrar al menos un numero entre 0 y 50 a nivel 50', ()=>{
    const input = {nivel: 50, enfocado: false};
    const s = new objetos.DivisionEntera(input);
    const actual = s.operandos;
    actual.push(s.resultado);

    // debug = true;
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
    const s = new objetos.DivisionEntera(input);
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
    const s = new objetos.DivisionEntera(input);
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
  it('no enfocado debería mostrar al menos un numero entre el 0 y 10 a nivel 10', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.DivisionEntera(input);
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
  it('no enfocado debería mostrar al menos un numero entre el 0 y 29 a nivel 20', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.DivisionEntera(input);
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
  it('no debería mostrar números negativos si no esta activado permitir negativos', ()=>{
    const input = {nivel: 20, cantidadOperandos: 4};
    const s = new objetos.DivisionEntera(input);
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
  it('el resultado debería ser un numero valido cuando el numero que define el nivel es el resultado', ()=>{
    // debug = true;
    const input = {
      nivel: 100,
      cantidadOperandos: 3,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.DivisionEntera(input);
    if ( debug ) console.log(actual.toString());

    expect(Math.abs(actual.resultado)).to.be.within(0, 100);
    debug = false;
  });
  it('el primer operando debería ser un numero valido cuando el numero que define el nivel es el resultado', ()=>{
    debug = false;
    const input = {
      nivel: 100,
      cantidadOperandos: 2,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.DivisionEntera(input);
    // console.log(actual.toString());

    expect(actual.operandos[0]).not.to.be.equal(NaN);
    debug = false;
  });
  it('el primer operando debería ser un numero entero cuando el numero que define el nivel es el resultado', ()=>{
    // debug = true;
    const input = {
      nivel: 100,
      cantidadOperandos: 2,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.DivisionEntera(input);
    // console.log(actual.toString());

    expect(actual.operandos[0]).to.satisfy(function(x) {
      return x % 1 === 0;
    });

    debug = false;
  });
  it('con mas de 2 operandos el primero debería ser entero cuando el numero que define el nivel es el resultado', ()=>{
    debug = false;
    const input = {
      nivel: 500,
      cantidadOperandos: 4,
      permitirNegativos: true,
      posicion_nivel: 5,
    };
    const actual = new objetos.DivisionEntera(input);
    // console.log('actual',actual.toString());

    expect(actual.operandos[0]).to.satisfy(function(x) {
      return x % 1 === 0;
    });
    debug = false;
  });

  it('no pueden haber operandos que no sean números', ()=>{
    // debug = true;
    const input = {
      nivel: 100,
      cantidadOperandos: 4,
      permitirNegativos: true,
      posicion_nivel: 5,
    };
    const actual = new objetos.DivisionEntera(input);
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

  it('debería dar múltiplos de 10 con la opción x10', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo10: true,
    };
    const actual = new objetos.DivisionEntera(input);
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
    };
    const actual = new objetos.DivisionEntera(input);
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

  it('complementarios debería ser múltiplo de 10', ()=>{
    debug = false;
    const input = {
      nivel: 25,
      complementario: 12,
    };
    const actual = new objetos.DivisionEntera(input);

    expect( actual.complementario ).to.satisfy(function(x) {
      return (x % 10)==0;
    }, 'expected '+actual.complementario+' to be divisible by 10' );
    debug = false;
  });
  it('complemetario debería generar resultado igual al valor de complementario', ()=>{
    // debug = true;
    const input = {
      complementario: 50,
    };
    const actual = new objetos.DivisionEntera(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.resultado).to.be.equal(input.complementario);

    debug = false;
  });


  it('complemetario debería generar operandos multiplos de 10 cuando el nivel es 100', ()=>{
    const input = {
      complementario: 100,
    };
    const actual = new objetos.DivisionEntera(input);

    // debug = true;
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
    const actual = new objetos.DivisionEntera(input);

    if ( debug )console.log('\nACTUAL\n', actual );
    expect(actual.operandos).to.have.length(2);

    debug = false;
  });
  it('con complementario, debería ser igual cantidad_operandos que la longitud de el array operandos', ()=>{
    debug = false;
    const input = {
      complementario: 100,
    };
    const actual = new objetos.DivisionEntera(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.operandos.length).be.equal(actual.cantidad_operandos);

    debug = false;
  });

  it('con complementario, todos los operandos deberían ser números', ()=>{
    // debug = true;
    const input = {
      complementario: 40,
    };
    const actual = new objetos.DivisionEntera(input);

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

  it('no debería cambiar los operandos cuando los manda el usuario', ()=>{
    const input = {
      operandos: [34, 18],
    };

    const s = new objetos.DivisionEntera(input);
    expect(s.operandos).to.eql(input.operandos);
  });

  it('deberia generar division entera dado un solo operando', ()=>{
    const input = {
      operandos: [undefined, 100],
    };

    const s = new objetos.DivisionEntera(input);
    // que sea numero / numero = numero entero
    expect(s.toString())
        .to.match(/^-?[0-9]+ \/ -?[0-9]+ = -?[0-9]+$/);
  });

  it('deberia generar division entera dado un solo operando e incluir el operando,final', ()=>{
    const input = {
      operandos: [undefined, 100],
    };

    const s = new objetos.DivisionEntera(input);
    // que sea numero / numero = numero entero
    expect(s.toString())
        .to.match(/^-?[0-9]+ \/ 100 = -?[0-9]+$/);
  });

  it('deberia generar division entera dado un solo operando e incluir el operando,inicial', ()=>{
    const input = {
      operandos: [100],
    };

    const s = new objetos.DivisionEntera(input);
    // que sea numero / numero = numero entero
    expect(s.toString())
        .to.match(/^100 \/ -?[0-9]+ = -?[0-9]+$/);
  });

  it('No generar divisiones con cero', ()=>{
    const input = {
    };

    const divisiones = [];
    for (let i = 0; i < 100; i++) {
      divisiones.push( new objetos.DivisionEntera(input) );
    }

    expect(divisiones).satisfy(function(x) {
      // si alguna
      const divisionConCero = x.some((div) => {
        // si algun operando es igual a cero
        const hay = div.operandos.some((o) => o == 0 );
        if ( hay ) console.log( 'division con cero:', div.toString() );
        return hay;
      });
      // si hay una division con cero no pasa el test
      // if (!divisionConCero) console.log('hay div:', divisionConCero);
      return !divisionConCero;
    });
  });
});

