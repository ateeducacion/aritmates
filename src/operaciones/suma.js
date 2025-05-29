

import Operacion from './operacion';
import OPERACIONES from './operaciones';
import Decimal from 'decimal.js';
/**
 * Operacion Suma 
 *
 * @author Fernando Ramírez Pérez
 * @export
 * @class Suma
 * @extends Operacion
 */
export default class Suma extends Operacion {
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
  } = {}) {
    const tag = '[Suma.constructor]';
    const debug = false;
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
          'decimalesMaximo', decimalesMaximo, '\n\t'
      );
    }
    if ( !upper_bound ) {
      upper_bound = nivel;
    }
    super({
      nivel,
      lower_bound,
      upper_bound,
      cantidadOperandos,
      permitirNegativos,
      operandos,
      incognita,
      enfocado,
      posicion_nivel,
      multiplo10,
      multiplo100,
      complementario,
      resultadoNegativo,
      decimales,
      decimalesMaximo,
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
          'decimalesMaximo', decimalesMaximo, '\n\t'
      );
    }

    this.simbolo = '+';
    this.tipo = OPERACIONES.SUMA;

    if ( resultado ) {
      this.resultadoPorUsuario = true;
      this.resultado = resultado;
      this.operandosIniciales = operandos.slice();
      this.generarNumerosOperandos();
      this.calcularResultado();
      this.comprobarResultado();
    }

    if ( debug ) console.log( this.id+tag, this.operandos, 'this.operandos' );
  }

  /**
   * Calcular reultado
   * Actualiza this.resultado 
   * @author Fernando Ramírez Pérez
   * @returns void
   * @memberof Suma
   */
  calcularResultado() {
    const tag = '[Suma.calcularResultado]';
    // const debug = true;
    if ( debug ) console.log( this.id+tag );

    // TODO revisar complementario y resultado por usuario
    if (this.complementario) {
      this.resultado = this.complementario;
      this.resolverIncognita();
      return;
    }
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
        // primerOperando -= this.operandos[i];
        primerOperando = new Decimal(primerOperando).minus(this.operandos[i]);
        primerOperando = parseFloat(primerOperando.toString());
      }
      this.operandos[0] = primerOperando;
    } else {
      this.resultado = this.sumarValores(this.operandos);
    }

    // this.comprobarResultado();

    if ( debug ) {
      console.log( this.id+tag, 'Fin',
          'operandos', JSON.stringify(this.operandos),
          'resultado', this.resultado );
    }
  }

  /**
   * Genera Operandos segun la configuracion
   *
   * @author Fernando Ramírez Pérez
   * @memberof Suma
   */
  generarNumerosOperandos() {
    // const debug = true;
    super.generarNumerosOperandos();
    const tag = '[Suma.generarNumerosOperandos]';
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


    // aqui ya viene con unso operandos de
    // this._generarOperandoPosicion(posicion)

    // TODO: si permite numeros negativos y el resultado es positivo

    // solo puede ser negativo con numeros negativos
    // TODO: revisar
    // if (this.resultadoNegativo && this.permitir_negativos) {
    //   if (this.cantidad_operandos>2) {
    //     // comprobamos del 3 op en adelante
    //     for (let index = 2; index < this.operandos.length; index++) {
    //       const operando = this.operandos[index];
    //       // resultado de operandos anteriores:
    //       const resultadoAnterior = this.sumarValores(
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

  /**
   * Generar operando para una posicion deterimnad teniendo en centa las distintas opciones
   *
   * @author Fernando Ramírez Pérez
   * @param {number} posicion
   * @memberof Suma
   */
  _generarOperandoPosicion( posicion ) {
    const tag = this.id+'[Suma._generarOperandoPosicion]';
    const debug = false;

    if ( debug ) console.log( this.id+tag, 'posicion', posicion );
    const ultimoOperando = this.cantidad_operandos-1;
    let valOpPosteriores = 0;
    const numOperandosPosteriores = this.numOperandosPosteriores(posicion);
    if (numOperandosPosteriores>0) {
      valOpPosteriores = parseFloat(this.sumarValores(this.operandos));
    }
    let limiteInferior = 0;
    const nivel = parseInt(this.nivel);
    // console.log(tag, 'permitir negativos?', this.permitir_negativos );
    if ( this.permitir_negativos ) {
      limiteInferior = nivel * -1;
    }
    let limiteSuperior = nivel;
    let opAnteriores;
    if (posicion>0) {
      opAnteriores = this.sumarValores(
          this.operandos.slice(0, posicion));
    }
    

    if ( debug ) {
      console.log( this.id+tag,
          'this.resultadoNegativo', this.resultadoNegativo );
      console.log( this.id+tag,
          'limites iniciales', limiteInferior, limiteSuperior );
      console.log( this.id+tag,
          'val op poste', valOpPosteriores, numOperandosPosteriores );
    }

    if (!this.resultadoNegativo ) {
      if ( posicion == 0 ) {
        if ( numOperandosPosteriores>0 ) {
          // console.log( tag,
          //    'primer operando','limites',limiteInferior,limiteSuperior, 
          //    'con numeros posteriores', numOperandosPosteriores );
          // limiteInferior = valOpPosteriores;
          // limiteSuperior = nivel+valOpPosteriores;
          // si solo se permiten positivos no hace falta cambiar nada

          // si hay operandos negativos 
          if ( this.permitir_negativos && valOpPosteriores<0 ) {
            limiteInferior = math.abs(valOpPosteriores)+1;
            if ( limiteInferior > limiteSuperior ) limiteSuperior = limiteInferior + 2;
          }
        } else {
          // si no hay generar un operando culaquiera
          super._generarOperandoPosicion(posicion);
        }
      } else {
      // en otra posicion != 0
        // si no hay mas operandos pone el maximo la suma de los anteriores
        // 10 - [ del -nivel al 10]
        if ( debug ) {
          console.log( tag,
              'posicion distinta a 0, n operandos posteriores ', numOperandosPosteriores );
        }
        //Si no hay mas operaderes 
        if ( !(numOperandosPosteriores>0) ) {
          // limiteSuperior = opAnteriores; // comento para que el limite superiro sea el nivel          
          if ( this.permitir_negativos ) {
            if (opAnteriores <= 0) {
              // asegurar resultado positivo?
              limiteInferior = opAnteriores * -1;
              limiteSuperior = nivel;
              if (limiteInferior > nivel) limiteSuperior = limiteInferior+1;
            }
          }
        } else {
          limiteSuperior = opAnteriores - valOpPosteriores;
          if (limiteSuperior<limiteInferior) limiteInferior = 0;
        }
      }
      if ( debug ) {
        console.log( this.id+tag + ' ' +
            'resultado positivo: limites', limiteInferior, limiteSuperior);
        console.log( this.id+tag,
            'valor op posteriores', valOpPosteriores );
      }
    }
    if ( this.resultadoNegativo ) {
      if ( debug ) {
        console.log( tag,
            'ultimo opreando', ultimoOperando,
            'posicion', posicion  );
      }
      switch (posicion) {
        case 0:
          if (numOperandosPosteriores>0) {
            limiteSuperior = - valOpPosteriores -1;
            limiteInferior = limiteSuperior - nivel;
          } 
          break;
        case ultimoOperando:
          // operaciones anteriores negativas o 0 :
          if (opAnteriores<=0) {
            // suponiendo nivel 10 :
            // ejempplo -5 + [-10..4] = negativo
            limiteInferior = -nivel;
            // limiteSuperior = limiteInferior + nivel;  
            limiteSuperior = opAnteriores-1;  
          } else {
            // operaciones anteriores positivas
            // ejemplo 5 + [-10..-6] = negativo
            limiteSuperior = - opAnteriores - 1;
            if (this.decimales) limiteSuperior = - opAnteriores + 2;
            // limiteInferior = limiteSuperior - nivel;
            limiteInferior = - nivel;
          }
          
          if ( debug ) {
            console.log( tag,
                'opAnteriores', opAnteriores,
                'limiteInferior', limiteInferior,
                'limiteSuperior', limiteSuperior,
                'nivel', nivel
            );
          }
          break;
      }

      if ( debug ) {
        console.log( this.id+tag,
            'resultado negativo: limites', limiteInferior, limiteSuperior);
      }
    }

    this.operandos[posicion] = this.getRandomMinMax(
        limiteInferior, limiteSuperior);
    if ( debug ) console.log( this.id+tag, opAnteriores, 'opAnteriores' );
    if ( debug ) {
      console.log( this.id+tag, 'this.operandos', this.operandos,
          'nuevo op', this.operandos[posicion] );
    }

    if ( this.decimales ) {
      // agregar decimales
      this.operandos[posicion] = this.agregarDecimalesAzar(
          this.operandos[posicion]);
    }

    if ( debug ) {
      console.log( this.id+tag, 'this.operandos', this.operandos,
          'nuevo op', this.operandos[posicion] );
    }
  }


  // TODO: complementarios los voy a dejar aparte por ahora
  _generarOperandosComplementario() {
    const tag = '[Suma._generarOperandosComplementarios] ';
    if ( debug ) console.log(this.id+tag);
    const nivel= parseInt(this.nivel);

    const maximo = nivel*2;
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
   * esto no hace nada!
   */
  resolverIncognita() {
    const tag = '[Resta.resolverIncognita()]';
    if ( debug ) console.log(this.id+tag);
    const posicionIncognita = this.posicion_incognita-1;
    if ( debug ) console.log(this.id+tag, 'posicionIncognita: ', posicionIncognita);
  }

  /** @inheritdoc */
  obtenerSimbolo() {
    return '+';
  }

  /** @inheritdoc */
  getTipo() {
    return OPERACIONES.SUMA;
  }
  
  /**
   * Compprueba que no hubo error al generar el resultado o no cumple 
   *
   * @author Fernando Ramírez Pérez
   * @return {Object} {resultado: false} si falla o {resultado: true} si todo esta correcto
   * @memberof Suma
   */
  comprobarResultado() {
    const tag = '[suma.js.comprobarResultado]';
    if ( debug ) console.log( tag );
    if ( this.resultadoNegativo && !this.permitir_negativos ) {
      this.errors.push({
        error: 'Resultado Negativo Imposible',
        msg: 'no se puede obtener resultados negativos'});
      return {resultado: false};
    }

    return super.comprobarResultado();
  }

  operandoMultiploN(posicion, multiplo) {
    // const debug = true;
    const tag = '[suma.js.operandoMultiploN(posicion, multiplo)]';
    if ( debug ) console.log( tag );
    const ultimoOperando = this.cantidad_operandos-1;
    let valOpPosteriores = 0;
    const numOperandosPosteriores = this.numOperandosPosteriores(posicion);
    if (numOperandosPosteriores>0) {
      valOpPosteriores = parseFloat(this.sumarValores(this.operandos));
      valOpPosteriores = valOpPosteriores / multiplo;
    }
    
    let limiteInferior = 1;
    const nivel = 9;
    if ( this.permitir_negativos ) {
      limiteInferior = -9;
    }
    let limiteSuperior = 9;
    let valOpAnteriores;
    if (posicion>0) {
      valOpAnteriores = this.sumarValores(
          this.operandos.slice(0, posicion));
      valOpAnteriores = valOpAnteriores / multiplo;
    }
    
    if (!this.resultadoNegativo ) {
      if ( posicion == 0 ) {
        if ( numOperandosPosteriores>0 ) {
          limiteInferior = valOpPosteriores;
          limiteSuperior = nivel+valOpPosteriores;
        } else {
          super.operandoMultiploN(posicion, multiplo);
          if ( debug ) {
            console.log( tag,
                'llamado operandoMultipoN de operaciones y sale' );
          }
          return;
        }
      } else {

        if ( debug ) {
          console.log( tag,
              'posicion distinta a 0, n operandos posteriores ', numOperandosPosteriores );
        }

        if ( !numOperandosPosteriores>0 ) {
          limiteSuperior = valOpAnteriores;
          if ( this.permitir_negativos ) {
            if (valOpAnteriores <= 0) {
              limiteInferior = valOpAnteriores * -1;
              limiteSuperior = nivel;
              if (limiteInferior > nivel) limiteSuperior = limiteInferior+1;
            }
          }
        } else {
          if ( debug ) {
            console.log( tag,
                'ultimo operando',  );
          }
          limiteSuperior = valOpAnteriores - valOpPosteriores;
          if (limiteSuperior<limiteInferior) limiteInferior = 0;
        }
      }
    }
    if ( this.resultadoNegativo ) {
        switch (posicion) {
          case 0:
            if (numOperandosPosteriores>0) {
              limiteSuperior = - valOpPosteriores -1;
              limiteInferior = limiteSuperior - nivel;
            } 
            break;
          case ultimoOperando:
            
            if (valOpAnteriores<0) {
              // ej: -5 + [-9..4] = negativo
              // ej: -2 + [-9..1] = negativo
              // ej: -1 + [-9..0] = negativo
              limiteInferior = -9;
              limiteSuperior = - (valOpAnteriores+1);

              // ejemplo real: -80 -60 + [?] = negativo
              // -140 + [-90 .. 130 ] = negativo => asi estaba con la op de arriba
              // -140 + [-90 .. 90 ] = negativo (resultado entre -230 y -50 )
              if (limiteSuperior > 9 ) limiteSuperior = 9;
            } else {
              // ej: 5 + [-9 .. -6] = negativo
              // ej: 2 + [-9 .. -3] = negativo
              // ej: 1 + [-9 .. -2] = negativo
              limiteSuperior = - (valOpAnteriores + 1);
              limiteInferior = - 9;
              // if (valOpAnteriores > 9){
              //   limiteInferior = - (valOpAnteriores+1);
              //   limiteSuperior = - (valOpAnteriores+1);
              // } 
              // 60 + 50 + ? = negativo
              // 110 + [-120 .. -120] = negativo (-10)
              // 
            }
            break;
        }
    }
    
    this.operandos[posicion] = this.getRandomMinMax(
      limiteInferior, limiteSuperior);
    this.operandos[posicion] *= multiplo;

    if ( debug ) {
      console.log( tag,
          'nuevo operando', this.operandos[posicion],
          'limites', limiteInferior, limiteSuperior );
    }
  }
}
