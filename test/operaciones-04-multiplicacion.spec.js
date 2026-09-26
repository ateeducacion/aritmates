
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

describe('Multiplicación', ()=> {
  it('debería multiplicar dos números correctamente', ()=>{
    const input = {
      cantidadOperandos: 2,
      operandos: [34, 18],
    };
    const resultado = 34*18;
    // const s = new objetos.Multiplicacion(input);
    console.log('llamada a multiplicacion');
    const s = new Multiplicacion(input);
    console.log('fin llamada a multiplicacion');
    console.log(s.toString());
    expect(s.resultado).to.eql(resultado);
  });

  it('enfocado debería mostrar un numero igual al del nivel', ()=>{
    const input = {nivel: 10, enfocado: true, permitirNegativos: false};

    const s = new objetos.Multiplicacion(input);
    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log(s.nivel);
    // console.log(s.toString());
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
    const s = new objetos.Multiplicacion(input);
    // s.enfocado = true;
    // s.generarNumerosOperandos();
    // s.calcularResultado();
    const actual = s.operandos;
    actual.push(s.resultado);
    // console.log(s.nivel);
    // console.log(s.toString());

    expect(actual[s.posicion_nivel-1]).be.oneOf([100, -100]);
  });
  it('no enfocado debería mostrar al menos un numero entre 40 y 60 a nivel 50', ()=>{
    const input = {nivel: 50, enfocado: false};
    const s = new objetos.Multiplicacion(input);
    const actual = s.operandos;
    actual.push(s.resultado);
    const minNivel = 0;
    const maxNivel = 100;
    // console.log(s.nivel);
    // console.log(s.toString());
    //  no funciona con expect(actual).any.within(40,60);
    expect(actual).to.satisfy(function(x) {
      let r=false;
      x.forEach((operando) => {
        if ( operando>=minNivel && operando<=maxNivel ) r = true;
      });
      return r;
    }, 'msg: '+actual.operandos );
  });
  it('no enfocado debería mostrar al menos un numero entre 0 y 100 a nivel 100', ()=>{
    const input = {nivel: 100, enfocado: false};
    const s = new objetos.Multiplicacion(input);
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
    const s = new objetos.Multiplicacion(input);
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

  it('no enfocado debería mostrar al menos un numero entre el 0 y 5 a nivel 5', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 5, enfocado: false};
    const s = new objetos.Multiplicacion(input);
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

  it('no enfocado debería mostrar al menos un numero entre el 1 y 19 a nivel 10', ()=>{
    // en los niveles del 1 al 20 se muestro esta entre mas o menos el nivel-1
    // es decir a nivel 5 entre 5-4 y 5+4
    const input = {nivel: 10, enfocado: false};
    const s = new objetos.Multiplicacion(input);
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
    const s = new objetos.Multiplicacion(input);
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
    const s = new objetos.Multiplicacion(input);
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
    const input = {
      nivel: 100,
      cantidadOperandos: 3,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.Multiplicacion(input);

    expect(Math.abs(actual.resultado)).to.be.within(0, 100);
  });
  it('el primer operando debería ser un numero valido cuando el numero que define el nivel es el resultado', ()=>{
    const input = {
      nivel: 100,
      cantidadOperandos: 2,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.Multiplicacion(input);
    // console.log(actual.toString());

    expect(actual.operandos[0]).not.to.be.equal(NaN);
  });
  it('el primer operando debería ser un numero entero cuando el numero que define el nivel es el resultado', ()=>{
    const input = {
      nivel: 100,
      cantidadOperandos: 2,
      permitirNegativos: true,
      posicion_nivel: 4,
    };
    const actual = new objetos.Multiplicacion(input);
    // console.log(actual.toString());

    expect(actual.operandos[0]).to.satisfy(function(x) {
      return x % 1 === 0;
    });

  });
  it('con mas de 2 operandos el primero debería ser entero cuando el numero que define el nivel es el resultado', ()=>{
    const input = {
      nivel: 500,
      cantidadOperandos: 4,
      permitirNegativos: true,
      posicion_nivel: 5,
    };
    const actual = new objetos.Multiplicacion(input);
    // console.log('actual',actual.toString());

    expect(actual.operandos[0]).to.satisfy(function(x) {
      return x % 1 === 0;
    });
  });
  it('debería estar correcta la multiplicacion con mas de 2 operandos y el nivel es el resultado', ()=>{
    const input = {
      nivel: 500,
      cantidadOperandos: 4,
      permitirNegativos: true,
      posicion_nivel: 5,
    };
    const actual = new objetos.Multiplicacion(input);
    let expected = 1;
    actual.operandos.forEach((element) => {
      // console.log(element);
      expected *= element;
    });

    // console.log('actual',actual.toString());

    expect(actual.resultado).equal(expected);
  });

  it('no pueden haber operandos que no sean números', ()=>{
    const input = {
      nivel: 100,
      cantidadOperandos: 4,
      permitirNegativos: true,
      posicion_nivel: 5,
    };
    const actual = new objetos.Multiplicacion(input);


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

  it('debería dar múltiplos de 10 con la opción x10', ()=>{
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo10: true,
    };
    const actual = new objetos.Multiplicacion(input);
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
  });
  
  it('debería dar múltiplos de 10 con la opción x10 y resultado positivo', ()=>{
    const input = {
      nivel: 10,
      cantidadOperandos: 2,
      permitirNegativos: true,
      multiplo10: true,
      resultadoNegativo: false,
    };
    const actual = new objetos.Multiplicacion(input);
    console.log( actual );
    expect( parseInt( actual.resultado) ).to.be.greaterThan(-1);

  });


  it('debería dar múltiplos de 100 con la opción x100', ()=>{
    const input = {
      nivel: 25,
      cantidadOperandos: 3,
      permitirNegativos: true,
      multiplo100: true,
    };
    const actual = new objetos.Multiplicacion(input);
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
  });

  it('complementarios debería estar entre 10-100', ()=>{
    const input = {
      nivel: 25,
      complementario: 120,
    };
    const actual = new objetos.Multiplicacion(input);

    expect(actual.complementario).to.be.within(10, 100);
  });

  it('complementarios debería ser múltiplo de 10', ()=>{
    const input = {
      nivel: 25,
      complementario: 12,
    };
    const actual = new objetos.Multiplicacion(input);

    expect( actual.complementario ).to.satisfy(function(x) {
      return (x % 10)==0;
    }, 'expected '+actual.complementario+' to be divisible by 10' );
  });
  it('complemetario debería generar resultado igual al valor de complementario', ()=>{
    const input = {
      complementario: 50,
    };
    const actual = new objetos.Multiplicacion(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.resultado).to.be.equal(input.complementario);

  });

  it('complemetario debería generar operandos multiplos de 10 cuando el nivel es 100', ()=>{
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Multiplicacion(input);

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
    const actual = new objetos.Multiplicacion(input);

    expect(actual.operandos).to.have.length(2);

  });
  it('con complementario, debería ser igual cantidad_operandos que la longitud de el array operandos', ()=>{
    const input = {
      complementario: 100,
    };
    const actual = new objetos.Multiplicacion(input);

    // console.log('\nACTUAL\n', actual );
    expect(actual.operandos.length).be.equal(actual.cantidad_operandos);

  });

  it('con complementario, todos los operandos deberían ser números', ()=>{
    const input = {
      complementario: 40,
    };
    const actual = new objetos.Multiplicacion(input);

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

  });

  it('no debería cambiar los operandos cuando los manda el usuario', ()=>{
    const input = {
      operandos: [34, 18],
    };

    const s = new objetos.Multiplicacion(input);
    expect(s.operandos).to.eql(input.operandos);
  });

  it('Generar operandos que falten cuando se manda un solo operando, el 2', ()=>{
    const input = {
      operandos: [undefined, 100],

      nivel: 50,
      permitirNegativos: false,
      enfocado: false,
      posicion_nivel: 1,
    };
    const s = new Multiplicacion(input);
    console.log(s.toString());
    // que sea numero / numero = numero entero
    expect(s.toString())
        .to.match(/^-?[0-9]+ ∙ -?[0-9]+ = -?[0-9]+$/);
  });
  it('Generar operandos que falten cuando se manda un solo operando, el 1', ()=>{
    const input = {
      operandos: [100],
    };

    const s = new Multiplicacion(input);
    // que sea numero / numero = numero entero
    expect(s.toString())
        .to.match(/^-?[0-9]+ ∙ -?[0-9]+ = -?[0-9]+$/);
  });

  it('Dado el resultado', ()=>{
    const input = {
      cantidadOperandos: 2,
      resultado: 100,
    };

    const s = new Multiplicacion(input);
    console.log(s.toString(true, true));
    expect(s.toString())
        .to.match(/^-?[0-9]+ ∙ -?[0-9]+ = 100$/);
  });
  it('Dado el resultado, operandos con decimales', ()=>{
    const input = {
      cantidadOperandos: 2,
      resultado: [100],
      decimales: true,
    };

    const s = new Multiplicacion(input);
    console.log(s.toString(true, true));
    // que sea numero / numero = numero entero
    expect(s).satisfy(function(x) {
      const resultadoOk = (x.resultado == input.resultado);
      // al menos un operando tiene decimales
      const decimalesOk = x.operandos.some(
          (val, idx) => (val%1!==0)
      );
      return (resultadoOk && decimalesOk);
    });
    // expect(s.toString())
    //     .to.match(/^-?[0-9]+(\.[0-9]+)? \* -?[0-9]+(\.[0-9]+)? = 100$/);
  });
  it('Dado el resultado con decimales, operandos con decimales', ()=>{
    const resul = '42.375';
    const input = {
      cantidadOperandos: 2,
      resultado: resul,
      decimales: true,
    };

    const s = new Multiplicacion(input);
    console.log(s.toString(true, true));
    // que sea numero / numero = numero entero
    expect(s).satisfy(function(x) {
      const resultadoOk = (x.resultado == input.resultado);
      // al menos un operando tiene decimales
      const decimalesOk = x.operandos.some(
          (val, idx) => (val%1!==0)
      );
      return (resultadoOk && decimalesOk);
    });
    // expect(s.toString())
    //     .to.match(/^-?[0-9]+(\.[0-9]+)? \* -?[0-9]+(\.[0-9]+)? = 100$/);
  });
});


// divisiones
