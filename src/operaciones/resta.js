
import {Decimal} from 'decimal.js';
import Operacion from './operacion';
import OPERACIONES from './operaciones';
/**
 * Operacion resta
 *
 * @author Fernando Ramírez Pérez
 * @export
 * @class Resta
 * @extends {Operacion}
 */
export default class Resta extends Operacion {
  constructor({
    nivel,
    lower_bound,
    upper_bound,
    cantidadOperandos,
    permitirNegativos,
    operandos = [],
    incognita,
    enfocado,
    posicion_nivel,
    multiplo10 = false,
    multiplo100 = false,
    complementario = false,
    resultado = null,
    resultadoNegativo = false,
    decimales = false,
    decimalesMaximo,
    forzarSignos,
  } = {}) {
    const tag = '[Resta.constructor]';
    // const debug = true;
    if ( debug ) {
      console.log( tag, 'llamado con: \n\t',
          'nivel', nivel, '\n\t',
          'cantidadOperandos', cantidadOperandos, '\n\t',
          'permitirNegativos', permitirNegativos, '\n\t',
          'operandos', operandos, '\n\t',
          'incognita', incognita, '\n\t',
          'enfocado', enfocado, '\n\t',
          'posicion_nivel', posicion_nivel, '\n\t',
          'multiplo10', multiplo10, '\n\t',
          'multiplo100', multiplo100, '\n\t',
          'complementario', complementario, '\n\t',
          'resultadoNegativo', resultadoNegativo, '\n\t',
          'decimales', decimales, '\n\t',
          'decimalesMaximo', decimalesMaximo, '\n\t',
          'forzarSignos', forzarSignos, '\n\t' );
    }
    if ( !upper_bound ) {
      upper_bound = nivel;
    }
    super({
      nivel: nivel,
      lower_bound: lower_bound,
      upper_bound: upper_bound,
      cantidadOperandos: cantidadOperandos,
      permitirNegativos: permitirNegativos,
      operandos: operandos,
      incognita: incognita,
      enfocado: enfocado,
      posicion_nivel: posicion_nivel,
      multiplo10: multiplo10,
      multiplo100: multiplo100,
      complementario: complementario,
      resultadoNegativo: resultadoNegativo,
      decimales: decimales,
      decimalesMaximo: decimalesMaximo,
      forzarSignos: forzarSignos,
    });

    if ( debug ) {
      console.log( this.id+tag, 'llamado con: \n\t',
          'nivel', nivel, '\n\t',
          'cantidadOperandos', cantidadOperandos, '\n\t',
          'permitirNegativos', permitirNegativos, '\n\t',
          'operandos', operandos, '\n\t',
          'incognita', incognita, '\n\t',
          'enfocado', enfocado, '\n\t',
          'posicion_nivel', posicion_nivel, '\n\t',
          'multiplo10', multiplo10, '\n\t',
          'multiplo100', multiplo100, '\n\t',
          'complementario', complementario, '\n\t',
          'resultadoNegativo', this.resultadoNegativo, '\n\t',
          'decimales', decimales, '\n\t',
          'decimalesMaximo', decimalesMaximo, '\n\t',
          'forzarSignos', forzarSignos, '\n\t'
      );
    }

    this.simbolo = '-';
    this.tipo = OPERACIONES.RESTA;
    // esta en super
    // this.operandosIniciales = operandos.slice();
    if ( resultado ) {
      this.resultadoPorUsuario = true;
      this.resultado = resultado;
      this.generarNumerosOperandos();
      this.calcularResultado();
      // console.log ('comprobar resultado', 
      this.comprobarResultado();

    }

    if ( this.resultadoNegativo == false &&
          this.cantidad_operandos != 2 &&
          this.cantidad_operandos >= this.nivel ) {
      // no se pueden generar restas de 4 números con nivel 3 donde pudeen salir
      // restas como _3_ - 2 - 1 - 0  = 0 y ya que se previene que no salga
      // el 0 no se crea nunca
      this.cantidad_operandos = parseInt(this.nivel);
      this.errors.push({
        'error': 'Nivel demasiado bajo para numero de operandos',
        'msg': 'No se pueden crear operaciones para este nivel con este' +
            'numero de operando, hemos bajado el numero de operandos',
      });
    }

    if ( debug ) {
      console.log( this.id+tag,
          'final contructor, operandos:', this.operandos );
    }
  }


  calcularResultado() {
    const tag = '[Resta.calcularResultado]';
    if ( debug ) console.log( this.id+tag );

    // TODO:
    // if (this.complementario) {
    //   this.resultado = this.complementario;
    //   this.resolverIncognita();
    //   return;
    // }

    if (this.resultadoPorUsuario) {
      this.resolverIncognita();
      if ( debug ) {
        console.log( this.id+tag, this.operandos, 'this.operandos',
            this.operandosIniciales );
      }
      return;
    }

    this.resultado = this.operandos[0];

    if (this.posicion_nivel-1 == this.operandos.length) {
      // console.log('el resultado es el numero que define el nivel');
      // poner un numero que cumpla con el nivel como resultado y averiguar
      //  el resto de operandos
      this.resultado = this.numeroRandom(true);
      // re-calcula primer operando para que sea valido con el resultado
      let primerOperando=this.resultado;
      for (let i =1; i < this.operandos.length; i++) {
        if ( debug ) console.log('primerop', primerOperando);
        // primerOperando += this.operandos[i];
        primerOperando = new Decimal(primerOperando).plus(this.operandos[i]);
        primerOperando = parseFloat(primerOperando.toString());
      }
      this.operandos[0] = primerOperando;
    } else {
      this.resultado = this.restarValores(this.operandos);
    }

    this.comprobarResultado();

    if ( debug ) {
      console.log( this.id+tag,
          'operandos', JSON.stringify(this.operandos),
          'resultado', this.resultado );
    }
  }

  generarNumerosOperandos() {
    // const debug = true;
    super.generarNumerosOperandos();
    const tag = '[Resta.generarNumerosOperandos]';

    if ( debug ) {
      console.log( this.id+tag, '\n\t',
          'this.permitir_negativos', this.permitir_negativos, '\n\t',
          'this.resultadoNegativo', this.resultadoNegativo
      );
    }

    if (this.complementario && this.complementario>0) {
      return;
    }

    if ( debug ) {
      console.log(this.id+tag, 'no se permiten negativos', '\n\t',
          'this.permitir_negativos', this.permitir_negativos, '\n\t',
          'this.resultadoNegativo', this.resultadoNegativo
      );
    }

    // if ( !this.resultadoNegativo) {
    //   // ordenador de mayor a menor
    //   this.operandos.sort(function(a, b) {
    //     return b-a;
    //   });

    //   if (this.cantidad_operandos>2) {
    //     // comprobamos del 3 op en adelante
    //     for ( let index = 2; index < this.operandos.length; index++ ) {
    //       const operando = this.operandos[index];
    //       // resultado de operandos anteriores:
    //       const resultadoAnterior = this.restarValores(
    //           this.operandos.slice(0, index));
    //       if ( resultadoAnterior==0 ) {
    //         // si el resultado anterior es 0 corremos el riesgo de terminar
    //         // con numero al azar del 1-9una operacion tipo
    //         // "23 - 23 - 0 - 0 = 0 "
    //         // asi que pedimos nuevos numero
    //         this.generarNumerosOperandos();
    //         return;
    //       }
    //       // calculamos los operandos siguiente, el max el resutadoAnterior
    //       // para que no sea resultado negativo creo que no hace falta por
    //       // que ya lo hace en generarNumeroOperando
    //       // if ( resultadoAnterior < operando ) {
    //       //   this.operandos[index] = Math.round(
    //       //       Math.random()*resultadoAnterior );
    //       // }
    //     }
    //   }
    // }

    // if (this.resultadoNegativo) {
    //   if (this.cantidad_operandos>2) {
    //     // comprobamos del 3 op en adelante
    //     for (let index = 2; index < this.operandos.length; index++) {
    //       const operando = this.operandos[index];
    //       // resultado de operandos anteriores:
    //       const resultadoAnterior = this.restarValores(
    //           this.operandos.slice(0, index));
    //       if ( resultadoAnterior >= operando ) {
    //         const max = (this.nivel > resultadoAnterior) ?
    //             this.nivel : resultadoAnterior+2;
    //         this.operandos[index] = this.getRandomMinMax(resultadoAnterior+1,
    //             max );
    //       }
    //     }
    //   } else {
    //     this.operandos.sort(function(a, b) {
    //     // ordenador de menor a mayor
    //       return a-b;
    //     });
    //     if ( this.operandos[0] == this.operandos[1] ) {
    //       this.operandos[1] = this.operandos[1] + this.getRandomMinMax(
    //           1, this.nivel);
    //     }
    //   }
    // }

    if ( debug ) {
      console.log( this.id+tag,
          'fin this.operandos', this.operandos );
    }
  }

  _generarOperandoPosicion( posicion ) {
    const tag = this.id+'[Resta._generarOperandoPosicion]';
    // const debug = true;
    if ( debug ) console.log( tag, 'posicion', posicion );

    const limites = this.calcularLimitesOperando(posicion);
    let limiteInferior = limites.limiteInferior;
    let limiteSuperior = limites.limiteSuperior;

    const forzarOperandoNegativo = (this.forzarSignos[posicion]==-1);
    const ultimoOperando = this.cantidad_operandos-1;
    let opAnteriores;
    if (posicion>0) {
      opAnteriores = this.restarValores(
          this.operandos.slice(0, posicion));
    }

    // si el ultimo operando tiene cambiar el signo y este no :
    const fopNegNext = this.forzarSignos[posicion+1];
    if ( fopNegNext && fopNegNext==-1 && ultimoOperando==posicion+1 ) {
      if ( this.resultadoNegativo ) {
        limiteInferior=opAnteriores+2;
        limiteSuperior=limiteInferior + this.nivel;
      }
    }

    // si este operando tiene cambiar el signo:
    if ( forzarOperandoNegativo ) {
      // console.log(tag, 'forzar negativo');
      if (this.resultadoNegativo) {
        switch (posicion) {
          case 0:
            if (valOpPosteriores >= 0) {
              limiteSuperior = -1;
              limiteInferior = limiteSuperior - this.nivel;
            } else {
              limiteSuperior = valOpPosteriores -1;
              limiteInferior = limiteSuperior - this.nivel;
            }
            break;
          case ultimoOperando:
            if ( opAnteriores>=0) {
              // no se puede generar resultado negativo con estos operandos
              // por que seria como positivo 5 - (-1) = 6
              this.operandos[posicion] = 0;
            } else {
              // ej: opAnteriores = -5
              // -5 - ( -4..-1 ) = ( -1..-4 )  >= 0;
              limiteInferior = opAnteriores+1;
              limiteSuperior = -1;
            }
            break;
          default:
            limiteInferior = - this.nivel;
            limiteSuperior = -1;
            break;
        }
      } else {
        switch (posicion) {
          case ultimoOperando:
            if ( opAnteriores>0 ) {
              limiteSuperior = -1;
              limiteInferior = -this.nivel;
            } else {
              // operadores anteriores negativos
              // y resultado positivo ( con nivel 10)
              // -5 - (-6..-16) = 1..11
              limiteInferior = opAnteriores -1;
              limiteSuperior = limiteInferior - this.nivel;
            }
            break;
          default:
            limiteInferior = - this.nivel;
            limiteSuperior = -1;
            break;
        }
      }
      // if ( limiteInferior == 0 ) limiteInferior = -1;
      // if ( limiteSuperior == 0 ) limiteSuperior = -1;
    }

    if ( debug ) {
      console.log( tag,
          'posicion', posicion,
          'limites finales', limiteInferior, limiteSuperior);
    }

    this.operandos[posicion] = this.getRandomMinMax(
        limiteInferior, limiteSuperior);

    if ( debug ) console.log( tag, opAnteriores, 'opAnteriores' );
    
    if ( debug ) {
      console.log( tag, 'this.operandos', this.operandos,
          'nuevo op', this.operandos[posicion] );
    }

    if ( this.decimales ) {
      // agregar decimales
      this.operandos[posicion] = this.agregarDecimalesAzar(
          this.operandos[posicion]);
    }

    if ( debug ) {
      console.log( tag, 'this.operandos', this.operandos,
          'nuevo op', this.operandos[posicion] );
    }
  }

  // TODO: revisar, por ahora no voy a hacer los complementarios
  _generarOperandosComplementario() {
    const tag = '[Resta._generarOperandosComplementarios] ';
    if ( debug ) console.log(this.id+tag);

    const maximo = 150;
    let maximoActual = maximo;
    let minimo = this.complementario; // = this.resultado

    if ( this.permitir_negativos ) minimo = maximoActual * -1;

    let restaOperandosSinIncognita = 0;
    const ultimoOperando = this.cantidad_operandos-1;
    const posicionIncognita = this.posicion_incognita-1;

    if ( debug ) console.log(this.id+tag, 'ultimoOperando', ultimoOperando);

    let valorIncognita;
    if (this.operandos[posicionIncognita] !== undefined ) {
      valorIncognita = this.operandos[this.posicion_incognita];
    }

    if ( debug ) console.log(this.id+tag, 'valorIncognita', valorIncognita);

    for (let index = 0; index < this.cantidad_operandos; index++) {
      if ( debug ) console.log(this.id+tag, 'index operando', index );
      let nuevoOperando;
      const op = this.operandos[index];

      // if ( index !== posicionIncognita ){
      // generamos el operando a no se que existan operandos mandados por el
      // usuario
      if ( !this.operandos_por_usuario ||
          (this.operandos_por_usuario && op === undefined) ) {
        if ( debug ) console.log(this.id+tag, 'operandos no definidos por usuario');

        if ( index == ultimoOperando) {
          // si la incognita ya se definió calcular el ultimo operando
          if ( debug ) {
            console.log(this.id+tag, 'ultimo operando con incognita definida ');
          }
          // if (restaOperandosSinIncognita>0){
          nuevoOperando = restaOperandosSinIncognita - this.resultado;
          // } else {
          //     nuevoOperando = this.resultado+ ;
          // }
          if ( debug ) {
            console.log(this.id+tag, 'nuevo op', nuevoOperando, 'index', index );
          }

          // pero esto no se va  a dar nunca con los complementarios!
          // ultimo operando con ingognita == resultado
          if ( posicionIncognita==this.cantidad_operandos ) {
            if ( debug ) {
              console.log(this.id+tag,
                  'ultimo operando con incognita = resultado ');
            }
            nuevoOperando = restaOperandosSinIncognita - this.resultado;
          }
          if ( debug ) {
            console.log(this.id+tag,
                'nuevo op (ultimo operando)', nuevoOperando );
          }
        } else {
          if ( debug ) {
            console.log(this.id+tag, 'mínimo', minimo);
            console.log(this.id+tag, 'maximo actual', maximoActual);
          }

          nuevoOperando = Math.round(
              Math.random()*(maximoActual-minimo))+minimo;
          if ( debug ) {
            console.log(this.id+tag, 'nuevo op (no ultimo operando)', nuevoOperando );
          }
        }
      } else {
        // si esta definido por el usuario se queda como esta
        nuevoOperando = op;
      }

      maximoActual = maximo - nuevoOperando;

      if (this.complementario==100) {
        nuevoOperando = Math.round( nuevoOperando/10 ) * 10;
      }

      this.operandos[index] = nuevoOperando;
      if ( debug ) {
        console.log(this.id+tag, 'op',
            this.operandos[index], 'index', index);
      }


      if (index == 0) {
        restaOperandosSinIncognita = nuevoOperando;
      } else {
        restaOperandosSinIncognita -= nuevoOperando;
      }

      // el único numero posible para el resultado hay que repartirlo entre los
      // operandos
      // const operandos_restantes = this.cantidad_operandos-index;
      // maximo = Math.round(
      //  ( restaOperandosSinIncognita - this.resultado) / operandos_restantes
      // ) ;
      maximoActual = restaOperandosSinIncognita - this.resultado;


      // }  // fi ( index !== posicionIncognita )
    }// fin for
    if ( debug ) {
      console.log(this.id+tag, 'restaOperandosSinIncognita',
          restaOperandosSinIncognita );
    }
    // this.restaOperandosSinIncognita = restaOperandosSinIncognita;
  }

  /**
   * esto no hace nada
   */
  resolverIncognita() {
    // const debug = true;
    const tag = '[Resta.resolverIncognita()]';
    if ( debug ) console.log(this.id+tag);
    const posicionIncognita = this.posicion_incognita-1;
    const lastOperando = this.cantidad_operandos-1;
    let valOpAnteriores;
    const opAnteriores = this.operandos.slice(0, lastOperando-1);
    if (opAnteriores.length>1) {
      valOpAnteriores = this.sumarValores(opAnteriores);
    } else {
      valOpAnteriores = this.operandos[0];
    }

    this.operandos[lastOperando] = valOpAnteriores - this.resultado;
    if (!this.permitir_negativos) {
      if ( this.operandos[lastOperando]<0 ) {
        const opOld = this.operandos[0];
        this.operandos[0] = this.resultado + opOld;
        this.operandos[lastOperando] = opOld;
      }
    }

    if ( debug ) console.log(this.id+tag, 'posicionIncognita: ', posicionIncognita);
  }

  operandoMultiploN(posicion, multiplo) {
    // const debug = true;
    const tag = '[resta.js.operandoMultiploN(posicion, multiplo)]';
    if ( debug ) console.log( tag, posicion, multiplo );
    // super.operandoMultiploN(posicion, multiplo);
    // const ultimoOperando = this.cantidad_operandos-1;
    const nivelOriginal = this.nivel;
    this.nivel = 9; // maximo 90 o 900
    const limites = this.calcularLimitesOperando(posicion, multiplo );
    this.nivel = nivelOriginal;

    this.operandos[posicion] = this.getRandomMinMax(limites.limiteInferior, limites.limiteSuperior) * multiplo;
  }

  /**
   * Calcular los limites del los operandos
   *
   * @param {number} posicion
   * @param {number} multiploN : 10-> multiplo de 10, 100 -> múltiplo de 100
   *
   * @return {object} objeto con {limiteInferior, limiteSuperior}
   */
  calcularLimitesOperando(posicion, multiploN=null) {
    const ultimoOperando = this.cantidad_operandos-1;
    let valOpPosteriores = 0;
    const numOperandosPosteriores = this.numOperandosPosteriores(posicion);
    if (numOperandosPosteriores>0) {
      valOpPosteriores = this.sumarValores(this.operandos) ;
      if ( multiploN == 10 ) valOpPosteriores = valOpPosteriores/10;
      if ( multiploN == 100 ) valOpPosteriores = valOpPosteriores/100;
    }
    let limiteInferior = 0;

    if ( this.permitir_negativos ) {
      limiteInferior = this.nivel * -1;
    }
    let limiteSuperior = this.nivel;
    let opAnteriores;
    if (posicion>0) {
      opAnteriores = this.restarValores(
          this.operandos.slice(0, posicion));
      if ( multiploN == 10 ) opAnteriores = opAnteriores/10;
      if ( multiploN == 100 ) opAnteriores = opAnteriores/100;
    }

    if ( posicion == 0 ) {
      if ( numOperandosPosteriores>0 ) {
        limiteInferior = valOpPosteriores;
        // esto lo puse para facilitar resultado positivo, pero no hace falta
        // y si lo pongo no se cumple que el maximo sea el nivel
        // limiteSuperior = this.nivel+valOpPosteriores;
        limiteSuperior = this.nivel;
      } else {
        // si no hay generar un operando culaquiera
        super._generarOperandoPosicion(posicion);
      }
    } else {
    // en otra posicion != 0
      // si no hay mas operandos pone el maximo la suma de los anteriores
      // 10 - [ del -nivel al 10]
      if ( !numOperandosPosteriores>0 ) {
        // Esto tampoco hace falta esto hace que si tengo 70 - ?,  el operando sea
        // como maximo 70 para el resultado sea positivo pero podria ser el nivel
        // a no ser que el nivel sea mayor que el operando anteriro
        if (this.nivel > opAnteriores ) {
          limiteSuperior = opAnteriores;
        } else {
          limiteSuperior = this.nivel;
        }
      } else {
        limiteSuperior = opAnteriores - valOpPosteriores;
        if (limiteSuperior<limiteInferior) limiteInferior = 0;
      }
    }

    if ( this.resultadoNegativo ) {
      switch (posicion) {
        case 0:
          if (numOperandosPosteriores>0) {
            if ( this.permitir_negativos ) {
              limiteSuperior = - valOpPosteriores -1;
              limiteInferior = limiteSuperior - this.nivel;
            } else {
              limiteSuperior = valOpPosteriores -1;
              limiteInferior = 1;
            }
          }
          break;
        case ultimoOperando:
          limiteInferior = opAnteriores+1;
          limiteSuperior = limiteInferior+ this.nivel;
          break;
        default:
          //
          break;
      }
    }

    return {
      limiteInferior: limiteInferior,
      limiteSuperior: limiteSuperior,
    };
  }


  obtenerSimbolo() {
    return '-';
  }
  getTipo() {
    return OPERACIONES.RESTA;
  }
}
