import Operacion from './operacion';
import OPERACIONES from './operaciones';

/** 
 * Operación Multiplicación
 * @author Fernando Ramírez Pérez
 * @export
 * @class Multiplicacion
 * @extends {Operacion}
 */
export default class Multiplicacion extends Operacion {
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
    resultadoNegativo,
    decimales = false,
    decimalesMaximo,
  } = {}) {
    const tag = '[Multiplicacion.constructor] ';
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
          'decimalesMaximo', decimalesMaximo, '\n\t'
      );
    }
    let operandosIniciales;
    if ( undefined !== operandos ) {
      operandosIniciales = operandos.slice();
    } else {
      operandosIniciales = [];
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
    this.simbolo = this.obtenerSimbolo();
    this.tipo = 'multiplicación';


    // si viene dado el resultado y un operando calcular el resto
    if ( resultado && operandosIniciales.length < cantidadOperandos ) {
      if (operandosIniciales) this.operandosIniciales = operandosIniciales;
      if ( debug ) {
        console.log( tag,
            'operandosIniciales:', this.operandosIniciales, operandosIniciales );
      }
      if ( debug ) console.log( tag, 'resultado por el usuario', resultado );
      this.resultadoUsuario = true;
      this.resultado = resultado;
      if ( debug ) {
        console.log( tag,
            'pre this.resultado:', this.resultado,
            ' operandos:', JSON.stringify(this.operandos) );
      }
      // this.generarNumerosOperandos();
      this.calcularResultado();
      if ( debug ) console.log( tag, 'post this.resultado', this.resultado, JSON.stringify(this.operandos) );
    }
  }


  calcularResultado() {
    // const debug = true;
    const tag = '[Multiplicacion.calcularResultado] ';
    if ( debug ) console.log(tag);

    if (this.complementario) {
      if ( debug ) console.log(tag, 'es complementario');
      this.resultado = this.complementario;
      this.resolverIncognita();
      return;
    }

    // entra en bucle
    // se mete aquí cuando intenta resolver operaciones multiples
    // Creo que esto era para los complementarios cuando la incoginta no era
    // el resultado asi que lo he desactivado por ahora...
    if ( debug ) console.log( tag, this.resultadoUsuario, 'this.resultadoUsuario' );
    if (this.resultadoUsuario) {
      if ( debug ) {
        console.log( tag,
            'resultado usuario', this.resultado );
      }
      this._generarOperandosComplementario();
      this.resolverIncognita();
      return;
    }

    // if ( debug ) console.log(tag + '--------------------' );
    if (this.posicion_nivel-1 == this.operandos.length) {
      // console.log('el resultado es el numero que define el nivel');

      // poner un numero que cumpla con el nivel como resultado y averiguar el
      // resto de operandos
      if (this.enfocado) this.resultado = this.nivel;
      else this.resultado = this.numeroRandom(true);

      // factorizar el numero (devuelve un array de factores)
      let factores = this.factorizar(this.resultado);
      while (this.cantidad_operandos > factores.length ) {
        // console.log('menos factores que operandos o numero primo, calculando
        //  otro resultado')
        this.resultado = this.numeroRandom(true);
        factores = this.factorizar(this.resultado);
      }
      if ( debug ) console.log(tag + '-----------------factores', factores);

      this.operandos = this._ObtenerOperandosDeGrupoFactores(factores,
          this.cantidad_operandos );
    } else {
      if ( debug ) {
        console.log( tag,
            'this.operandos', this.operandos );
      }
      this.resultado = this.multiplicarValores(this.operandos);
    }
    if ( debug ) {
      console.log( tag, 'fin',
          'this.operandos', this.operandos,
          'this.resultado', this.resultado );
    }
  }

  _generarOperandosComplementario() {
    // const debug = true;
    const tag = '[Multiplicacion._generarOperandosComplementarios] ';
    if ( debug ) console.log(tag);
    if ( debug ) {
      console.log(tag, 'this.operandos', this.operandos,
          this.decimales);
    }

    let opTmp;
    const resuFactorizado = this.factorizar(this.resultado);


    if (this.resultado % 1 == 0) {
      opTmp = this._ObtenerOperandosDeGrupoFactores(
          resuFactorizado, this.cantidad_operandos );
    } else {
      // resultado con decimales
      // le quito los decimales
      const resDecimales = this.obtenerNumeroDecimales(this.resultado);
      const resInt = Math.pow(10, resDecimales) * this.resultado;
      const resIntFactores = this.factorizar(resInt);
      if ( debug ) {
        console.log( tag,
            'resultado', this.resultado, '\n\t',
            'decimales resultado', resDecimales, '\n\t',
            'factores', this.factorizar(resInt), '\n\t',
            'Resultado sin decimales', resInt, '\n\t'
        );
      }
      // factorizo numero sin deciamels
      opTmp = this._ObtenerOperandosDeGrupoFactores(
          resIntFactores, this.cantidad_operandos );
      if ( debug ) {
        console.log( tag,
            'opTmp', opTmp );
      }

      // reparto los decimales entre los operandos
      // a la mitad o casi
      if ( resDecimales % 2 == 0 ) {
        opTmp[0] = opTmp[0] / Math.pow(10, resDecimales/2);
        opTmp[1] = opTmp[1] / Math.pow(10, resDecimales/2);
      } else {
        if ( debug ) {
          console.log( tag,
              'opTmp[0] = opTmp[0] / Math.pow(10, Math.floor(resDecimales/2));',
              '\n\t',
              'opTmp[0] / Math.pow(10, Math.floor(resDecimales/2))',
              opTmp[0] / Math.pow(10, Math.floor(resDecimales/2)), '\n\t',
              'opTmp[0]', opTmp[0], '\n\t',
              'Math.pow(10, Math.floor(resDecimales/2))',
              Math.pow(10, Math.floor(resDecimales/2)), '\n\t',
              'Math.floor(resDecimales/2)', Math.floor(resDecimales/2), '\n\t',
              'resDecimales % 2', resDecimales % 2
          );
        }
        opTmp[0] = opTmp[0] / Math.pow(10, Math.floor(resDecimales/2));
        opTmp[1] = opTmp[1] / Math.pow(10,
            Math.floor(resDecimales/2) + resDecimales % 2 );
      }
      if ( debug ) {
        console.log( tag, 'opTmp', opTmp );
      }
      this.operandos = opTmp;
      return; // y ya no quiero saber nada mas
    }

    this.operandos = opTmp;
    // convierte los operandos en decimales para que den el mismo resultado:
    if (this.decimales) {
      const nDecimales = this.obtenerDecimalesSegunNivel(this.nivel);
      const powDecimales = Math.pow(10, nDecimales);
      const opConDec = this.getRandomMinMax(0, 1);
      // si no tiene operandos iniciales:
      if ( this.operandosInicialesLength() == 0 ) {
        if ( debug ) {
          console.log( tag,
              'no hay operandos iniciales', this.operandosIniciales, this.operandos );
        }
        if (opConDec == 0) {
          this.operandos[0] /= powDecimales;
          this.operandos[1] *= powDecimales;
        } else {
          this.operandos[1] /= powDecimales;
          this.operandos[0] *= powDecimales;
        }
      } else {
        // si tiene UN operando inicial:
        if ( this.operandosInicialesLength() == 1 ) {
          if ( this.operandos[1] == this.operandosIniciales[1]) {
            // si es el divisor, calculamo,.s el dividendo
            this.operandos[0] = this.operandos[1] * resultado;
          } else {
            this.operandos[1] = this.operandos[0] / this.resultado;
          }
        }
        // si el operando incogin
      }
      if ( debug ) {
        console.log( tag,
            'fin generar operandos complementario Decimiales', this.operandos );
      }
    }
    if ( debug ) console.log(tag, 'FIN, this.operandos', this.operandos);
  }

  resolverIncognita() {
    const tag = '[Multiplicacion.resolverIncognita()]';
    if ( debug ) console.log(tag, this.resultado);
    const posIncognita = this.posicion_incognita-1;
    if ( debug ) {
      console.log(tag,
          (posIncognita !== this.cantidad_operandos),
          'posIncognita', posIncognita);
    }

    // genera la incognita en this._generarOperandosComplementario
  }

  _generarOperandoPosicion(posicion) {
    // const debug = true;
    const tag = '[Multiplicacion._generarOperandoPosicion(posicion)]';
    if ( debug ) console.log( tag, posicion );
    const decimalesInicial = this.decimales;
    let cantOperandosDecimales = 0;
    const ultimaPosicion = this.cantidad_operandos-1;
    if (this.decimales) {
      cantOperandosDecimales = this.getCantidadOperandosDecimales();
      this.decimales = false;
      if ( posicion == this.getRandomMinMax(0, ultimaPosicion) ) {
        this.decimales = true;
      }
      if (cantOperandosDecimales>=1) this.decimales = false;
      if (posicion==ultimaPosicion && cantOperandosDecimales==0) {
        this.decimales = true;
      }
    }
    super._generarOperandoPosicion(posicion);
    this.decimales = decimalesInicial;

    // forzar resultado negativo o positivo según this.resultadoNegativo
    if ( posicion==ultimaPosicion ) {
      this.cambiarOperandoForzarSignoResultado(posicion);
    }
    if ( debug ) {
      console.log( tag, 'FIN',
          'operando generado', this.operandos[posicion] );
    }
  }

  cambiarOperandoForzarSignoResultado( posicion ) {
    const tag = '[multiplicacion.js.cambiarOperandoForzarSignoResultado( posicion )]';
    if ( debug ) console.log( tag, posicion );
    const cantidadNegativo = this.getCantidadOperandosNegativos();
    const ultimaPosicion = this.cantidad_operandos-1;
    if ( debug ) {
      console.log( tag,
          'operandos: ', this.operandos,
          'cantidadNegativo', cantidadNegativo,
          'posicion', posicion
      );
    }
    let pasarANegativo = false;
    // let operandosPar = (this.cantidad_operandos % 2 == 0 );
    const cantidadNegativoPar = (cantidadNegativo % 2 == 0) &&
        cantidadNegativo>0;
    const ultimoPositivo = this.operandos[posicion] >= 0;

    if ( posicion==ultimaPosicion ) {
      if ( cantidadNegativoPar ) {
        // quedarían un numero par contando este operando
        // resultado seria positivo
        pasarANegativo = ultimoPositivo ?
            this.resultadoNegativo : !this.resultadoNegativo;
      } else {
        // si resultado + y el ultimo op es - y cantidad negativos es impar
        pasarANegativo = !ultimoPositivo ?
            this.resultadoNegativo : !this.resultadoNegativo;
      }
      if ( cantidadNegativo == 0 ) {
        pasarANegativo = this.resultadoNegativo;
      }
    }
    if (pasarANegativo) {
      this.operandos[posicion] = Math.abs(this.operandos[posicion]) * -1;
    } else {
      this.operandos[posicion] = Math.abs(this.operandos[posicion]);
    }
    if ( debug ) {
      console.log( tag,
          'cantidad negativos', cantidadNegativo,
          'ultimo operando cambiado a negativo?', pasarANegativo,
          '\n\t', this.operandos );
    }
  }

  operandoMultiploN(posicion, multiplo) {
    super.operandoMultiploN(posicion, multiplo);
    // forzar resultado negativo o positivo según this.resultadoNegativo
    const ultimaPosicion = this.cantidad_operandos -1;
    if ( posicion==ultimaPosicion ) {
      this.cambiarOperandoForzarSignoResultado(posicion);
    }
  }

  obtenerSimbolo() {
    return '∙';
    // https://www.utf8icons.com/character/183/middle-dot
    // middeldot ·
    // // https://www.utf8icons.com/character/8729/bullet-operator
    // bullet Operator: ∙
  }
  getTipo() {
    return OPERACIONES.MULTIPLICACION;
  }
}
