

import Operacion from './operacion';
import OPERACIONES from './operaciones';
import Decimal from 'decimal.js';
import {isMissingOperand} from './numberRules';
import {roundedBetween} from './random';
/**
 * Operacion Suma 
 *
 * @author Fernando Ramírez Pérez
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
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
    random,
  } = {}) {
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
      random,
    });


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

  }

  /**
   * Calcular reultado
   * Actualiza this.resultado 
   * @author Fernando Ramírez Pérez
   * @returns void
   * @memberof Suma
   */
  calcularResultado() {

    // TODO revisar complementario y resultado por usuario
    if (this.complementario) {
      this.resultado = this.complementario;
      this.resolverIncognita();
      return;
    }
    if (this.resultadoPorUsuario) {
      this.resolverIncognita();
      return;
    }

    this.resultado = this.operandos[0];

    if (this.posicion_nivel-1 == this.operandos.length) {
      // poner un numero que cumpla con el nivel como resultado y averiguar
      //  el resto de operandos
      this.resultado = this.numeroRandom(true);
      // re-calcula primer operando para que sea valido con el resultado
      let primerOperando=this.resultado;
      for (let i =1; i < this.operandos.length; i++) {
        primerOperando = new Decimal(primerOperando).minus(this.operandos[i]);
        primerOperando = parseFloat(primerOperando.toString());
      }
      this.operandos[0] = primerOperando;
    } else {
      this.resultado = this.sumarValores(this.operandos);
    }


  }

  /**
   * Genera Operandos segun la configuracion
   *
   * @author Fernando Ramírez Pérez
   * @memberof Suma
   */
  generarNumerosOperandos() {
    super.generarNumerosOperandos();

    if (this.complementario && this.complementario>0) {
      return;
    }


    // aqui ya viene con unso operandos de

    // TODO: si permite numeros negativos y el resultado es positivo

    // solo puede ser negativo con numeros negativos
    // TODO: revisar

  }

  /**
   * Generar operando para una posicion deterimnad teniendo en centa las distintas opciones
   *
   * @author Fernando Ramírez Pérez
   * @param {number} posicion
   * @memberof Suma
   */
  _generarOperandoPosicion( posicion ) {

    const ultimoOperando = this.cantidad_operandos-1;
    let valOpPosteriores = 0;
    const numOperandosPosteriores = this.numOperandosPosteriores(posicion);
    if (numOperandosPosteriores>0) {
      valOpPosteriores = parseFloat(this.sumarValores(this.operandos));
    }
    let limiteInferior = 0;
    const nivel = parseInt(this.nivel);
    if ( this.permitir_negativos ) {
      limiteInferior = nivel * -1;
    }
    let limiteSuperior = nivel;
    let opAnteriores;
    if (posicion>0) {
      opAnteriores = this.sumarValores(
          this.operandos.slice(0, posicion));
    }
    


    if (!this.resultadoNegativo ) {
      if ( posicion == 0 ) {
        if ( numOperandosPosteriores>0 ) {
          // console.log( tag,
          //    'primer operando','limites',limiteInferior,limiteSuperior, 
          //    'con numeros posteriores', numOperandosPosteriores );
          // si solo se permiten positivos no hace falta cambiar nada

          // si hay operandos negativos 
          if ( this.permitir_negativos && valOpPosteriores<0 ) {
            limiteInferior = Math.abs(valOpPosteriores)+1;
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
        //Si no hay mas operaderes 
        if ( !(numOperandosPosteriores>0) ) {
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
          // operaciones anteriores negativas o 0 :
          if (opAnteriores<=0) {
            // suponiendo nivel 10 :
            // ejempplo -5 + [-10..4] = negativo
            limiteInferior = -nivel;
            limiteSuperior = opAnteriores-1;  
          } else {
            // operaciones anteriores positivas
            // ejemplo 5 + [-10..-6] = negativo
            limiteSuperior = - opAnteriores - 1;
            if (this.decimales) limiteSuperior = - opAnteriores + 2;
            limiteInferior = - nivel;
          }
          
          break;
      }

    }

    this.operandos[posicion] = this.getRandomMinMax(
        limiteInferior, limiteSuperior);

    if ( this.decimales ) {
      // agregar decimales
      this.operandos[posicion] = this.agregarDecimalesAzar(
          this.operandos[posicion]);
    }

  }


  /**
   * Genera operandos cuya suma es el complementario. Respeta los operandos
   * enviados por el usuario; el último operando cierra la suma.
   *
   * @memberof Suma
   */
  _generarOperandosComplementario() {
    const objetivo = this.complementario;
    const ultimo = this.cantidad_operandos - 1;
    let acumulado = 0;

    for (let index = 0; index < this.cantidad_operandos; index++) {
      let operando = this.operandos[index];
      if (isMissingOperand(operando)) {
        if (index == ultimo) {
          operando = objetivo - acumulado;
        } else {
          const restante = Math.max(objetivo - acumulado, 0);
          const minimo = this.permitir_negativos ? -objetivo : 0;
          operando = roundedBetween(this._rng, minimo, restante);
          if (objetivo == 100) operando = Math.round(operando / 10) * 10;
        }
      }
      this.operandos[index] = operando;
      acumulado += operando;
    }
  }

  /**
   * Sin efecto: evita que se ejecute la versión de Operacion.
   */
  resolverIncognita() {}

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
    if ( this.resultadoNegativo && !this.permitir_negativos ) {
      this.errors.push({
        error: 'Resultado Negativo Imposible',
        msg: 'no se puede obtener resultados negativos'});
      return {resultado: false};
    }

    return super.comprobarResultado();
  }

  operandoMultiploN(posicion, multiplo) {
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
          return;
        }
      } else {


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

  }
}
