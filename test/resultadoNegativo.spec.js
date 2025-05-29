import OPERACIONES from '../src/operaciones/operaciones';
import GenerarExamen from '../src/generarExamen';
import {TIPO_NUMERO} from '../src/operaciones/tipoNumero';
import OperacionMultiple from '../src/operaciones/OperacionMultiple';

import Resta from '../src/operaciones/resta';


const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-match'));

describe( 'resultadoNegativo ', ()=> {
  describe('Forzar resultado Negativo', () => {
  // Restas
  // Restas con Números Naturales 1..inf
    it( 'en restas, con números naturales, 2 op', ()=>{
      debug = false;
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

      debug = false;
    } );
    it( 'en restas, con números naturales, 3 op', ()=>{
    // debug = true;
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
      debug = false;
    } );
    it( 'en restas, n2 n.naturales, 3 op', ()=>{
      // debug = true;
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
      debug = false;
    } );
    it( 'en restas, n2 n.naturales, 2 op', ()=>{
      // debug = true;
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
      debug = false;
    } );
    // Restas con Numeros Enteros ( negativos y positivos )
    it( 'en restas, con números enteros, 2 op', ()=>{
      debug = false;
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

      debug = false;
    });
    it( 'en restas, con números enteros, 3 op', ()=>{
      // debug = true;
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
      debug = false;
    } );
    it( 'en restas, n2 n.enteros, 3 op', ()=>{
    // debug = false;
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
      debug = false;
    } );
    it( 'en restas, n2 n.entero, 2 op', ()=>{
    // debug = true;
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
      debug = false;
    } );
    // Restas con Decimales
    it( 'en restas, con decimales, 2 op', ()=>{
    // debug = true;
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

      debug = false;
    });
    it( 'en restas, con decimales, 3 op', ()=>{
      // debug = true;
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
      debug = false;
    } );
    it( 'en restas, n2 decimales, 3 op', ()=>{
      // global.debug = true;
      // debug = false;
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
      debug = false;
    } );
    it( 'en restas, n2 decimales, 2 op', ()=>{
    // debug = true;
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
      debug = false;
    } );

    it('dado primer operando 31 - vacío, sin op negativos', ()=>{
      // debug = true;
      const input = {
        cantidadOperandos: 3,
        operandos: [31],
        permitirNegativos: false,
        resultadoNegativo: true,
      };
      const s = new Resta(input);
      if ( debug ) console.log( s.toString() );

      expect(s.resultado).to.be.lessThan(0);
      debug = false;
    });
    it('dado primer operando 31 - vacío, con  op negativos', ()=>{
      // debug = true;
      const input = {
        cantidadOperandos: 3,
        operandos: [31],
        permitirNegativos: true,
        resultadoNegativo: true,
      };
      const s = new Resta(input);
      if ( debug ) console.log( s.toString() );

      expect(s.resultado).to.be.lessThan(0);
      debug = false;
    });

    // Sumas
    it( 'en sumas' );

    // Multiplicación
    // Multiplicación con Números Naturales 1..inf
    // no es posible deberia devolver error siempre
    it( 'en Multiplicación, con números naturales, 2 op' );
    it( 'en Multiplicación, con números naturales, 3 op' );
    it( 'en Multiplicación, n2 n.naturales, 3 op' );
    it( 'en multiplicaciones, n2 n.naturales, 2 op' );

    // Restas con Numeros Enteros ( negativos y positivos )
    it( 'en multiplicaciones, con números enteros, 2 op', ()=>{
      debug = false;
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

      debug = false;
    });
    it( 'en multiplicaciones, con números enteros, 3 op', ()=>{
      // debug = true;
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
      debug = false;
    } );
    it( 'en multiplicaciones, n2 n.enteros, 3 op', ()=>{
    // debug = false;
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
      debug = false;
    } );
    it( 'en multiplicaciones, n2 n.entero, 2 op', ()=>{
    // debug = true;
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
      debug = false;
    } );
    // Restas con Decimales
    it( 'en multiplicaciones, con decimales, 2 op', ()=>{
      debug = false;
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

      debug = false;
    });
    it( 'en multiplicaciones, con decimales, 3 op', ()=>{
      // debug = true;
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
      debug = false;
    } );
    it( 'en multiplicaciones, n2 decimales, 3 op', ()=>{
    // debug = false;
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
      debug = false;
    } );
    it( 'en multiplicaciones, n2 decimales, 2 op', ()=>{
    // debug = true;
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
      debug = false;
    } );


    it( 'en divisiones' );
    it( 'en divisiones con decimales' );
    it( 'en divisiones con resto' );
  });


  describe('Forzar resultado Negativo en op multiples negativos', () => {
    it('3 op div y mul, numeros enteros', ()=>{
      debug = false;
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: true,
            parentesis: false,
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
      if ( debug ) console.log(actual);
      debug = false;
    });
    it('3 op sumas y restas, enteros', ()=> {
      debug = false;
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: true,
            parentesis: false,
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
      if ( debug ) console.log(actual);
      debug = false;
    });
    it('3 op -+/*, numeros enteros', ()=>{
      debug = false;
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: true,
            parentesis: false,
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
      if ( debug ) console.log(actual);
      debug = false;
    });
  });

  describe('Forzar resultado positivo en op multiples negativos', () => {
    it('3 op div y mul, numeros enteros', ()=>{
      debug = false;
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: false,
            parentesis: false,
            tiposOperacion: [
              OPERACIONES.DIVISION,
              OPERACIONES.MULTIPLICACION,
            ],
            tiposNumero: [TIPO_NUMERO.ENTERO],
          }
      );
      const actual = op.toString();
      expect(actual).to.match(/-?[0-9]+ [∙\/] -?[0-9]+ [∙\/] -?[0-9]+ = [0-9]+/);
      if ( debug ) console.log(actual);
      debug = false;
    });
    it('3 op sumas y restas, enteros', ()=>{
      debug = false;
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: false,
            parentesis: false,
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


      if ( debug ) console.log(actual);
      debug = false;
    });
    it('3 op -+/*, numeros enteros', ()=>{
      debug = false;
      const op = new OperacionMultiple(
          {nivel: 50,
            cantidadOperandos: 3,
            permitirNegativos: true,
            resultadoNegativo: false,
            parentesis: false,
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
      if ( debug ) console.log(actual);
      debug = false;
    });
  });
});
