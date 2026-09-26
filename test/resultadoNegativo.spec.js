import OPERACIONES from '../src/operaciones/operaciones';
import GenerarExamen from '../src/generarExamen';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';

import Resta from '../src/operaciones/resta';
import {seededRandom} from '../src/operaciones/random';


const expect = require('chai').expect;

describe( 'resultadoNegativo ', ()=> {
  describe('Forzar resultado Negativo', () => {
  // Restas
  // Restas con Números Naturales 1..inf
    it( 'en restas, con números naturales, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 50,
        tiposNumero: [TIPO_NUMERO.NATURAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);

    } );
    it( 'en restas, con números naturales, 3 op', ()=>{
      const actual = new GenerarExamen({
        tiposNumero: [TIPO_NUMERO.NATURAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en restas, n2 n.naturales, 3 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.NATURAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
            // console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en restas, n2 n.naturales, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.NATURAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    // Restas con Numeros Enteros ( negativos y positivos )
    it( 'en restas, con números enteros, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 50,
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
            // console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);

    });
    it( 'en restas, con números enteros, 3 op', ()=>{
      const actual = new GenerarExamen({
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
            // console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en restas, n2 n.enteros, 3 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en restas, n2 n.entero, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
            // console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    // Restas con Decimales
    it( 'en restas, con decimales, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 50,
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);

    });
    it( 'en restas, con decimales, 3 op', ()=>{
      const actual = new GenerarExamen({
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en restas, n2 decimales, 3 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en restas, n2 decimales, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.RESTA],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );

    it('dado primer operando 31 - vacío, sin op negativos', ()=>{
      const input = {
        cantidadOperandos: 3,
        operandos: [31],
        permitirNegativos: false,
        resultadoNegativo: true,
      };
      const s = new Resta(input);

      expect(s.resultado).to.be.lessThan(0);
    });
    it('dado primer operando 31 - vacío, con  op negativos', ()=>{
      const input = {
        cantidadOperandos: 3,
        operandos: [31],
        permitirNegativos: true,
        resultadoNegativo: true,
      };
      const s = new Resta(input);

      expect(s.resultado).to.be.lessThan(0);
    });

    // Sumas
    // Natural-number sums cannot satisfy a requested negative result.

    // Multiplicación
    // Multiplicación con Números Naturales 1..inf
    // no es posible deberia devolver error siempre
    // Natural-number multiplication cannot produce a negative result.
    // Natural-number multiplication cannot produce a negative result.
    // Natural-number multiplication cannot produce a negative result.
    // Natural-number multiplication cannot produce a negative result.

    // Restas con Numeros Enteros ( negativos y positivos )
    it( 'en multiplicaciones, con números enteros, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 50,
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
            // console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);

    });
    it( 'en multiplicaciones, con números enteros, 3 op', ()=>{
      const actual = new GenerarExamen({
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
            // console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en multiplicaciones, n2 n.enteros, 3 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en multiplicaciones, n2 n.entero, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.ENTERO],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
            // console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    // Restas con Decimales
    it( 'en multiplicaciones, con decimales, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 50,
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);

    });
    it( 'en multiplicaciones, con decimales, 3 op', ()=>{
      const actual = new GenerarExamen({
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log( 'operacion', o.toString() );
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en multiplicaciones, n2 decimales, 3 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 3,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );
    it( 'en multiplicaciones, n2 decimales, 2 op', ()=>{
      const actual = new GenerarExamen({
        nivel: 2,
        tiposNumero: [TIPO_NUMERO.DECIMAL],
        tiposOperaciones: [OPERACIONES.MULTIPLICACION],
        cantidadOperaciones: 10,
        cantidadOperandos: 2,
        resultadoNegativo: true,
      });

      expect(actual.operacionesExamen).to.satisfy( (operacion) => {
        const algunResultadoPositivo = operacion.some(
            (o) => {
              console.log(o.toString());
              return o.resultado>0;
            }
        );
        // si hay algun resultado positivo devuelve false
        return !algunResultadoPositivo;
      }, actual.operacionesExamen);
    } );


    // Division classes reject negative operands/results by contract.
    // Decimal division does not support negative operands/results.
    // Remainder division does not support negative operands/results.
  });


  describe('Forzar resultado Negativo en op multiples negativos', () => {
    it('3 op div y mul, numeros enteros', ()=>{
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: true,
            parentesis: false,
            random: seededRandom(1),
            tiposOperacion: [
              OPERACIONES.DIVISION,
              OPERACIONES.MULTIPLICACION,
            ],
            tiposNumero: [TIPO_NUMERO.ENTERO],
          }
      );
      const actual = op.toString();
      // expect(actual).to.match(/-?[0-9]+ [∙\/] -?[0-9]+ [∙\/] -?[0-9]+ = -[0-9]+/);
      expect(actual).to.match(
          /-?[0-9]+ [∙\/] \(?-?[0-9]+\)? [∙\/] \(?-?[0-9]+\)? = -[0-9]+/
      );
    });
    it('3 op sumas y restas, enteros', ()=> {
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: true,
            parentesis: false,
            random: seededRandom(1),
            tiposOperacion: [
              OPERACIONES.SUMA,
              OPERACIONES.RESTA,
            ],
            tiposNumero: [TIPO_NUMERO.ENTERO],
          }
      );
      const actual = op.toString();
      expect(actual).to.match(
          /-?[0-9]+ [+-] \(?-?[0-9]+\)? [-+] \(?-?[0-9]+\)? = -[0-9]+/
      // /-?[0-9]+ [+-] (\\( )?-?[0-9]+( \\))? [-+] (\\( )?-?[0-9]++( \\))? = -[0-9]+/
      );
    });
    it('3 op -+/*, numeros enteros', ()=>{
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: true,
            parentesis: false,
            random: seededRandom(1),
            tiposOperacion: [
              OPERACIONES.SUMA,
              OPERACIONES.RESTA,
              OPERACIONES.MULTIPLICACION,
              OPERACIONES.DIVISION,
            ],
            tiposNumero: [TIPO_NUMERO.ENTERO],
          }
      );
      const actual = op.toString();
      expect(actual).to.match(
          /-?[0-9]+ [∙\/+-] \(?-?[0-9]+\)? [∙\/+-] \(?-?[0-9]+\)? = -[0-9]+/
      // /-?[0-9]+ [∙\/+-] -?[0-9]+ [∙\/+-] -?[0-9]+ = -[0-9]+/
      );
    });
  });

  describe('Forzar resultado positivo en op multiples negativos', () => {
    it('3 op div y mul, numeros enteros', ()=>{
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: false,
            parentesis: false,
            random: seededRandom(1),
            tiposOperacion: [
              OPERACIONES.DIVISION,
              OPERACIONES.MULTIPLICACION,
            ],
            tiposNumero: [TIPO_NUMERO.ENTERO],
          }
      );
      const actual = op.toString();
      expect(actual).to.match(/-?[0-9]+ [∙\/] -?[0-9]+ [∙\/] -?[0-9]+ = [0-9]+/);
    });
    it('3 op sumas y restas, enteros', ()=>{
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: false,
            parentesis: false,
            random: seededRandom(1),
            tiposOperacion: [
              OPERACIONES.SUMA,
              OPERACIONES.RESTA,
            ],
            tiposNumero: [TIPO_NUMERO.ENTERO],
          }
      );
      const actual = op.toString();
      // expect(actual).to.match(/-?[0-9]+ [+-] -?[0-9]+ [-+] -?[0-9]+ = [0-9]+/);

      expect(actual).to.match(
          /-?[0-9]+ [+-] \(?-?[0-9]+\)? [-+] \(?-?[0-9]+\)? = [0-9]+/
      );
      // /-?[0-9]+ [+-]
      // \(?-?[0-9]+\)?
      // [-+]
      // \(?-?[0-9]+\)?
      // = [0-9]+/
      // );


    });
    it('3 op -+/*, numeros enteros', ()=>{
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: false,
            parentesis: false,
            random: seededRandom(1),
            tiposOperacion: [
              OPERACIONES.SUMA,
              OPERACIONES.RESTA,
              OPERACIONES.MULTIPLICACION,
              OPERACIONES.DIVISION,
            ],
            tiposNumero: [TIPO_NUMERO.ENTERO],
          }
      );
      const actual = op.toString();
      expect(actual).to.match(
          /-?[0-9]+ [∙\/+-] (\( )?\(?-?[0-9]+\)?( \))? [∙\/+-] (\( )?\(?-?[0-9]+\)?( \))? = [0-9]+/
      );
    });
  });
});
