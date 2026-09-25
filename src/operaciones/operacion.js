 
import '../debug.js';
import {Decimal} from 'decimal.js';
import {DEFAULTS} from '../defaultOptions';
import {asRandom} from './random';
import {
  multiplyValues,
  divideValues,
  sumValues,
  subtractValues,
} from './arithmetic';
import {countDecimalOperands, countFollowingOperands, countNegativeOperands, decimalPlaces, decimalPlacesForLevel, multiplesUntil} from './numberRules';
import {factorize} from './factorization';
import {countDefinedOperands, hasOperandValue, invertAllOperandSigns, invertOperandSign, sortOperandsDescending} from './operandRules';
/**
 * Clase base para las distintas operaciones ( ver Suma, Resta, Multiplicacion, Division )
 * 
 * Los parametro entre llaves, esta hecho para poder cargar cualquier parametro por su nombre como objeto
 * de esta manera se podria escribir:
 * new Operacion(10, 1, 0, 100, 4 ) ;
 * como:
 * new Operacion( cantidadOperandos = 4 );
 * sin necesidad de poner los campos anteriores
 *
 * @author Fernando Ramírez Pérez <fernando.ramirez@altia.es>
 * @author Área de Tecnología Educativa <ate.educacion@gobiernodecanarias.org> (versión simplificada 1.3+)
 * @version 1.0.0-rc1
 * 
 * @param {number} [nivel=50] nivel de la operacion decide los numeros que se van a generar
 * @param {number} [posicion_nivel=1] posicion donde se fija el nivel y el enfocado
 * @param {number} [lower_bound=1] limite inferior minimo valor de operando
 * @param {number} [upper_bound=10000] limite superior, maximo valor de operando
 * @param {number} [cantidadOperandos=2] cantidad operandos
 * @param {boolean} [permitirNegativos = false] permitir numeros negativos en la operacion
 * @param {boolean} [enfocado = false] si esta la opcion activa se queda un numero fijo igual al nivel
 * @param {Array.number} [operandos = []] lista de operandos
 * @param {number} [incognita = parseInt(cantidadOperandos) + 1] cual es el dato que el usuario tendra que averiguar puedeser cualquier operando o el  resultado para eso , en caso de tener 2 operandos, habria que poner 3 (por defecto es ta en el resultado)
 * @param {boolean} [multiplo10 = false] Crear la operacion solo con multiplos de 10
 * @param {boolean} [multiplo100 = false] Crear la operacion solo con multiplos de 100
 * @param {boolean} [complementario = false]
 * @param {boolean} [resultadoNegativo = false] Fuerza que el resultado sea negativo o positivo
 * @param {boolean} [decimales = false] Crear la operacino con numeros decimales
 * @param {number} [decimalesMaximo] Cantidad de decimales que puede tener cada numero
 * @param {Array} [forzarSignos = []] lista de simbolos poner 1 para positivo o -1 para negativo
 *
 *
 * @export
 * @class Operacion
 */
export default class Operacion {
  /**
   * Creates an instance of Operacion.
   * @memberof Operacion
   */
  constructor({
    nivel = 50,
    posicion_nivel = 1,
    lower_bound = 1,
    upper_bound = 10000,
    cantidadOperandos = 2,
    permitirNegativos = false,
    enfocado = false,
    operandos = [],
    incognita = parseInt(cantidadOperandos) + 1,
    multiplo10 = false,
    multiplo100 = false,
    complementario = false,
    resultadoNegativo = false,
    decimales = false,
    decimalesMaximo,
    forzarSignos = [],
    random,
  } = {}) {
    this._rng = asRandom(random);
    const tag= '[Operacion]';
    if ( isNaN(cantidadOperandos) ) {
      cantidadOperandos = parseInt(cantidadOperandos);
      if (isNaN(cantidadOperandos)) cantidadOperandos = 2;
    }
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
    // CONFIG
    /**
     * Numero primo maximo que se usara al separa en factores para generar números multiplos 
     * @type {Number}
     * */
    this._MAXIMO_PRIMO = DEFAULTS.maximoPrimo;

    this.nivel = nivel;
    this.lower_bound = lower_bound;
    this.upper_bound = upper_bound;
    this.cantidad_operandos = cantidadOperandos;
    this.permitir_negativos = permitirNegativos;
    this.posicion_nivel = posicion_nivel;
    this.posicion_incognita = parseInt(incognita);
    this.multiplo10 = multiplo10;
    this.multiplo100 = multiplo100;
    this.complementario = complementario;
    /**
     * Guarda informaicon sober errores recogidos 
     * @type {number[]}  */
    this.errors = [];
    this.decimales = decimales;
    this.decimalesMaximo = decimalesMaximo;
    this.resultadoNegativo = resultadoNegativo;

    /** 
     * Guarda informaicon sober errores recogidos
     * @type {Array}  */
    this.operandosIniciales = operandos.slice();

    this.deep = 0;

    // forzar signo de cada operando a positivo si no se permiten negativos
    // y el forzarsigno esta vacio
    if ( !this.permitir_negativos && (forzarSignos == [] || !forzarSignos) ) {
      for (let i = 0; i < this.cantidad_operandos.length; i++) {
        forzarSignos[i] = 1;
      }
    }
    this.forzarSignos = forzarSignos;
    // }
    /**
     * Para Debug. Numero id generado al azar para identificar mas facil que operacion falla 
     * y buscra en los logs en la consola cual ese el motiov
     * @type number
     */
    this.id = '[id:'+this.getRandomMinMax(0, 10000) +']'+this.getTipo();

    if ( ! decimalesMaximo ) {
      this.decimalesMaximo = this.obtenerDecimalesSegunNivel(nivel);
      // if ( debug ) {
      //   console.log( this.id+tag,
      //       'decimales maximo:', decimalesMaximo || 'X', this.decimalesMaximo );
      // }
    }

    // si incognita es = true o otro valor distinto a un numero entonces se
    // pone al azar
    if (isNaN(this.posicion_incognita)) {
      this.posicion_incognita = this.posicionAlAzar();
    }

    if (this.complementario) {
      // posicion incognita no puede ser el resultado
      if ( this.posicion_incognita == this.cantidad_operandos+1 ) {
        if ( debug ) {
          console.log(tag,
              'posicion incognita en complementario no puede ser resultado');
        }

        this.errors.push({
          'error': 'posicion incognita en complementario',
          'msg': 'la posicion de la incognita no puede ser el resultado'});
        this.posicion_incognita = this.posicionAlAzar(false);
        if ( debug ) {
          console.log(tag, this.posicion_incognita);
        }
      }

      if ((this.complementario>100 || this.complementario<10) ) {
        this.errors.push({
          'error': 'valor erróneo para complementarios',
          'msg': 'El valor debe de estar entre 10 y 100 ',
        });
        if (this.complementario>100) this.complementario=100;
        if (this.complementario<10) this.complementario=10;
      }
      if ((this.complementario % 10)!==0 ) {
        this.errors.push({
          'error': 'valor erróneo para complementarios',
          'msg': 'El valor debe de 10, 20, 30, 40, 50, 60, 70, 80, 90 o 100. '+
            'Se cambio al mas cercano',
        });
        if ( typeof(this.complementario) === 'number') {
          this.complementario = (this.complementario/10).toFixed(0)*10;
        }
      }
    }

    if (enfocado===undefined) this.enfocado = false;
    else this.enfocado = enfocado;

    // if (!cantidadOperandos) this.cantidad_operandos=2;
    // posicion nivel no se usa
    // if (!this.posicion_nivel) this.posicion_nivel = this.posicionAlAzar();

    this.simbolo = ' ';

    this.operandos = operandos;

    // si el numero "posicion_nivel" es el resultado lo calculamos primero
    if (this.posicion_nivel == this.cantidad_operandos) {
      if (this.enfocado) this.resultado = this.nivel;
      else this.resultado = this.numeroRandom(true);
    }

    // si no se envían operandos los generamos
    this.operandos_por_usuario = true;
    this.comprobarOperandosEnviados();
    if (this.operandos.length < this.cantidad_operandos) {
      this.generarNumerosOperandos();
      this.operandos_por_usuario = false;
    }

    this.tipo = '';

    // esto lo separe para hacer una prueba
    this.init();
    if ( debug ) {
      console.log( tag, 'FIN constructor' );
    }
  }

  /**
   * Next value from the injected generator (Math.random in production).
   * @return {number}
   */
  rng() {
    return this._rng();
  }

  init() {
    const tag = this.id+'[operacion.js.init]';
    if ( debug ) {
      console.log( tag,
          'ante primer calcular resultado operandos',
          'operandos', this.operandos,
          'forzarSignos', this.forzarSignos );
    }
    this.generarNumerosOperandos();
    this.calcularResultado();
    // **********************************************
    // if ( debug ) {
    //   console.log( this.id+tag,
    //       'tras primer calcular resultado operandos',
    //       'operandos', this.operandos,
    //       'forzarSignos', this.forzarSignos );
    // }
    // **********************************************

    if ( this.comprobarResultado().resultado == false ) {
      // descartarn esta y generar otra
      this.errors.push({
        error: 'Operación con errores', msg: '',
      });
    }

    if ( this.posicion_nivel > this.cantidad_operandos +1 ) {
      this.errors.push({
        'error': 'posicion nivel mayor que número de operandos'});
      this.posicion_nivel = this.cantidad_operandos;
    }

    // muestra los errores
    if ( this.errors.length>0 ) this.showErrors();
  }

  /**
   * Genera un numero al azar del 1 al 9
   * tiene en cuenta si ha de ser negativo
   * @param {number} index Posición del operando
   * @memberof Operacion
   */
  _operandoUnidad(index) {
    // const debug = true;
    const tag = '[Operacion._operandoUnidad]';
    if ( debug ) console.log(tag + ' index : '+ index );
    // numero al azar del 1-9
    this.operandos[index] = Math.floor( (this.rng()*8)+1 );
    if ( this.operandos[index] === 10 ) this.operandos[index]=9;
    if (this.permitir_negativos) this.operandos[index] *= this.getSigno();

    if ( debug ) {
      console.log(tag, 'this.operandos[index]', this.operandos[index] );
    }
  }

  /**
   * Genera todos los operandos con _operandoUnidad()
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  _operandosUnidades() {
    const tag = '[Operacion._operandosUnidades] ';
    if ( debug ) console.log(tag+'generar operandos unidades');
    for (let index = 0; index < this.cantidad_operandos; index++) {
      // se ignora nivel y enfocado
      this._operandoUnidad(index);
    }
  }

  /**
   * Comprobar que el resultado cumple los requisitos
   *
   * @author Fernando Ramírez Pérez
   * @return {Object} {resultado: false} si falla o {resultado: true} si todo esta correcto
   * @memberof Operacion
   */
  comprobarResultado() {
    // const debug = true;
    // debugger;
    const tag = this.id+'[Operacion.comprobarResultado()]';
    if ( debug ) console.log(tag);
    if ( debug ) {
      console.log(tag, ' inicio comprobar resultado',
          'this.deep', this.deep, 'this.operandos', this.operandos );
    }

    if (this.deep > DEFAULTS.reCalcTries ) {
      return {resultado: false};
    }

    if ( this.getTipo() == '' ) return {resultado: false};

    const resu = this.resultado;
    if ( debug ) console.log(tag, 'resu', resu );
    // if (this.deep > DEFAULTS.reCalcTries ) {
    if (this.deep > 2 ) {
      const errormsg = 'Tardo demasiados intentos en generar una operación'+
        'correcta';
      if ( debug ) console.log( tag, errormsg);
      return {resultado: false};
    }

    if ( this.enfocado ) {
      // console.log( tag, 'check enfocados');
      // console.log( tag,
      //     'this.operandosHasValue(this.nivel) ',
      //     this.operandosHasValue(this.nivel)
      // );

      if ( ! this.operandosHasValue(this.nivel) ) {
        this.deep++;
        this.generarNumerosOperandos();
        this.calcularResultado();
        return this.comprobarResultado();
      }
    }

    // si hay signos forzados no se tiene en cuenta permitirNegativos
    // pero si forzarSigno
    if ( this.forzarSignos == [] || !this.forzarSignos ) {
      if ( this.permitir_negativos && this.operandosSonPositivos() ) {
        if ( debug ) {
          console.log( tag,
              'no hay números negativos' );
        }
        this.errors.push({
          'error': 'Todos los operandos positivos',
          'msg': 'No hay números negativos' + this.toString(),
        });

        this.deep++;
        this.generarNumerosOperandos();
        this.calcularResultado();
        return this.comprobarResultado();
      }
      if ( !this.permitir_negativos && !this.operandosSonPositivos() ) {
        if ( debug ) {
          console.log( tag, 'hay numeros negativos' );
        }
        this.errors.push({
          'error': 'Números negativos en operandos',
          'msg': 'No deberían haber números negativos' + this.toString(),
        });
        this.deep++;
        this.generarNumerosOperandos();
        this.calcularResultado();
        return this.comprobarResultado();
      }
    } else {
      for (let i = 0; i < this.operandos.length; i++) {
        const o = this.operandos[i];
        const signo = this.forzarSignos[i];
        const signoPositivo = signo == 1;
        const signoNegativo = signo == -1;
        const opNegativo = o < 0;
        const opPositivo = o >= 0;
        if ( (signoPositivo && opNegativo) ||
             (signoNegativo && opPositivo)) {
          this.errors.push({
            'error': 'Error en forzar simbolo',
            'msg': 'No se corresponde ' + o + ' con ' + signo + ' \n' +
              JSON.stringify(this.forzarSignos) + '\n' +
              JSON.stringify(this.operandos) + ' =' + this.resultado,
          });
          this.deep++;
          this.generarNumerosOperandos();
          this.calcularResultado();
          return this.comprobarResultado();
        }
      }
    }


    if ( !this.resultadoNegativo && resu <0 ) {
      this.errors.push({
        'error': 'Resultado negativo',
        'msg': 'Debería ser positivo' + this.toString(),
      });
      this.deep++;

      this.generarNumerosOperandos();
      this.calcularResultado();
      return this.comprobarResultado();
    }
    if ( this.resultadoNegativo && resu >= 0 ) {
      this.errors.push({
        'error': 'Resultado positivo',
        'msg': 'Debería ser negativo ' + this.toString(),
      });
      this.deep++;

      this.generarNumerosOperandos();
      this.calcularResultado();
      return this.comprobarResultado();
    }
    if ( debug ) console.log(tag, 'fin resu', resu );
    return {resultado: (resu == this.resultado)};
  }

  /**
   *
   *
   * @author Fernando Ramírez Pérez
   * @return {boolean}
   * @memberof Operacion
   */
  esResultadoNegativo() {
    return ( this.resultado<0 );
  }

  /**
   * Comprueba que la operacion es correcta y revisa la incognita
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  resolverIncognita() {
    // comprobar si la operacion es correcta
    if (this.comprobarResultado()) {
      // resorvel incognita si no lo es
      // this.operando[this.posicion_incognita] = 0;
      if ( this.resolver_deep < 10 ) {
        this.calcularResultado();
      }
      this.resolver_deep++;
    }
  }

  /**
   * Genera operandos con la opcion de complemetarios
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  _generarOperandosComplementario() {
    const tag = '[Operacion._generarOperandosComplementario] ';
    if ( debug ) console.log(tag);
    // respeta los operandos enviados y crea los faltantes

    for (let index = 0; index < this.cantidad_operandos; index++) {
      if ( this.operandos[index] === undefined ) {
        if ( debug ) console.log(tag + 'index ' + index + ' undefined ');

        if (this.multiplo100) {
          this._operandoUnidad(index);
          this.operandos[index] = this.operandos[index] * 10;
        } else {
          this.operandos[index] = this._operandosUnidades * 10;
          // un numero entre el 1 y el 100
          // no lo voy a rellenar aquy por que de pende de la operacion
          // this.operandos[index] = 55;
        }
      }
    }
    // if ( debug ) console.log(tag,' x10 operandos ', this.operandos );
  }

  /**
   * Generar operandos
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  generarNumerosOperandos() {
    const tag = this.id+'[Operacion.generarNumerosOperandos] ';
    // const debug = true;
    if ( debug ) console.log(tag);

    this.operandos = this.operandosIniciales.slice();
    if ( debug ) console.log(tag, 'operandos:', this.operandos);

    if (this.complementario && this.complementario>0) {
      if ( debug ) console.log(tag+ ' es complementario');
      if (this.complementario==100) this.multiplo10 = true;
      if (this.posicion_incognita == this.cantidad_operandos) {
        // error no puede ser el resultado la incognita
        this.posicion_incognita = this.posicionAlAzar(false);
      }
      this.nivel = this.cantidad_operandos;
      this.resultado = this.complementario;
      if ( debug ) console.log(tag +'', this );

      if (this.complementario==100) {
        this.multiplo10 = true;
      }
      this._generarOperandosComplementario();
      this.resolverIncognita();
      return;
    }

    if ( this.enfocado ) {
      // Pone el operador "posicion_nivel" con el valor del nivel
      this.operandos[this.posicion_nivel-1] = this.nivel;
    }

    if (this.multiplo10) {
      for (let index = 0; index < this.cantidad_operandos; index++) {
        this.operandoMultiplo10(index);
      }
      if ( debug ) console.log(tag+' x10 operandos ', this.operandos );
    } else if ( this.multiplo100 ) {
      for (let j = 0; j < this.cantidad_operandos; j++) {
        this.operandoMultiplo100(j);
      }
      if ( debug ) console.log(tag+' x100 operandos ', this.operandos );
    } else {
      if ( debug ) {
        console.log( tag,
            'operandos antes _generarOperandoPosicion',
            JSON.stringify(this.operandos) );
      }
      for (let index = 0; index < this.cantidad_operandos; index++) {
        // si no esta definido de antes lo genera
        // estos operandos son this.operandosInicales.slice();
        if ( !this.operandos[index] ) {
          this._generarOperandoPosicion(index);
        }
      }
      // TODO: ahora misomo this.resultadoNegativo nunca vale null
      if (this.permitir_negativos && this.resultadoNegativo==null ) {
        this._forzarOperandosNegativos();
      }
    }

    if (this.decimales==true) {
      // comprobar si la operacion no tiene decimales
      const cantidadOpDecimales = this.getCantidadOperandosDecimales();
      if (cantidadOpDecimales==0) {
        this.deep++;
        if ( debug ) {
          console.log( tag, 'this.operandos', this.operandos );
          console.log( tag, this.toString(),
              'No hay decimales, generando nuevos números:');
        }
        this.operandos = [];
        this.generarNumerosOperandos();
      }
    }
  }

  /**
   * Genera solo el operando de la posicion selecionada
   *
   * @author Fernando Ramírez Pérez
   * @param {number} posicion
   * @memberof Operacion
   */
  _generarOperandoPosicion(posicion) {
    // let debug;
    // const debug = true;
    const tag = this.id+'[Operacion._generarOperandoPosicion(posicion)]';

    if ( debug ) console.log( tag, posicion );
    if ( debug ) console.log( tag, 'decimales', this.decimales );
    // if ( debug ) console.log( tag, this.operandos,'this.operandos' );
    // if ( debug ) console.log( tag, this.operandos[posicion],
    //     'this.operandos[posicion]' );
    // if ( debug ) console.log( tag,(this.posicion_nivel-1==posicion),
    //     '(this.posicion_nivel-1 == posicion)' );

    const cantidadDecimales = this.getRandomMinMax(1, this.decimalesMaximo);
    const powDecimales = Math.pow(10, cantidadDecimales);

    let limiteInferior = 0;
    if (this.lower_bound) limiteInferior = this.lower_bound;
    if (this.permitir_negativos) {
      limiteInferior = this.nivel*-1;
    }

    const genOperandoNoDecimal = () => {
      if ( limiteInferior % 1 !== 0 ) limiteInferior = Math.ceil(limiteInferior);
      this.operandos[posicion] = this.getRandomMinMax(
          limiteInferior, this.nivel);

      // if ( this.operandos[posicion] == 0 ) {
      //   console.log('posicion nivel != posicion');
      //   console.log('Operando sin decimales:');
      //   console.log('limites:', limiteInferior, this.nivel );
      //   console.log('operandos:', this.operandos[posicion]);
      // }
    };
    const genOperandoDecimal = () => {
      let partedecimal;
      let i = 0;
      const tries = 10;
      do {
        partedecimal = this.getRandomMinMax(this.lower_bound, this.nivel*powDecimales);
        i++;
      } while ( partedecimal == 0 && i<tries );
      this.operandos[posicion] = Math.trunc( partedecimal )/powDecimales;
      // if ( this.operandos[posicion] == 0 ) {
      //   console.log('posicion nivel != posicion');
      //   console.log('parte decimal:', partedecimal);
      //   console.log('limites:', this.lower_bound, this.nivel*powDecimales);
      //   console.log('operandos:', this.operandos[posicion]);
      // }
    };

    if (this.posicion_nivel-1 == posicion) {
      if ( debug ) console.log( tag, this.posicion_nivel-1, 'this.posicion_nivel-1 == posicion' );
      if (this.enfocado) {
        const numero = this.nivel;
        this.operandos[posicion] = numero;
        if (this.permitir_negativos) {
          this.operandos[posicion] *= this.getSigno();
        }
      } else {
        if (this.decimales) {
          genOperandoDecimal();
        } else {
          genOperandoNoDecimal();
        }
      }
    } else {
      // limite superior = nivel ahora
      if (this.decimales && cantidadDecimales>0) {
        genOperandoDecimal();
        if ( debug ) console.log(tag, 'decimales', this.operandos[posicion]);
      } else {
        genOperandoNoDecimal();
      }
    }

    if ( this.enfocado ) {
      if (posicion == this.posicion_nivel) {
        this.operandos[posicion] = this.nivel;
      }
    }

    // multiplosl de 10 o 100 ignoran enfocado y decimales
    if (this.multiplo10) {
      // console.log(tag, 'mul 10');
      this._operandoUnidad(posicion);
      this.operandos[posicion] *= 10;
    } else if ( this.multiplo100 ) {
      // console.log(tag, 'mul 100');
      this._operandoUnidad(posicion);
      this.operandos[posicion] *= 100;
    }

    // if ( this.operandos[posicion] == 0 ) {
    //   debug = true;
    // }
    if ( debug ) {
      console.log( tag, 'this.posicion_nivel-1 == posicion?',
          this.posicion_nivel-1, posicion );
      console.log( tag, 'enfocado', this.enfocado );
      console.log( tag, 'decimales', this.decimales );
      console.log( tag, 'fin',
          '\n\t', 'posicion', posicion,
          '\n\t', 'this.operandos[posicion]', this.operandos[posicion] );
    }
  }

  /**
   * Comprueba que al menos un operando es negativo y si no lo es cambia uno
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  _forzarOperandosNegativos() {
    //
    let negativos = false;
    let i = 0;
    do {
      const esteOp = this.operandos[i];
      if (esteOp < 0 ) negativos = true;
      i++;
    } while ( !negativos && i<this.cantidad_operandos);

    // si no hay negativos cambia un operando al azar de signo
    if ( !negativos ) {
      const opRand = Math.round(this.rng()*(this.cantidad_operandos-1));
      this.operandos[opRand] *= -1;
    }
  }

  /**
   * Cambia todos los operandos a numeros positivos
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  _forzarOperandosPositivos() {
    // pasa todos los operandos a postivo
    for (let index = 0; index < this.cantidad_operandos; index++) {
      this.operandos[index] = Math.abs(this.operandos[index]);
    }
  }

  /**
   * Recalcula el resultado , en esta clase solo lo coniverte en un 0 si no hay
   * resultado defiinido
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  calcularResultado() {
    const tag = '[Operacion.calcularResultado()] ';
    if ( debug ) console.log( tag );
    if (this.resultado === undefined) this.resultado = 0;
  }

  /**
   * En esta clase solo cambia el operando nivel por "?" y la incognita por "x"
   * para poder saber cual seria cada operando en pruebas
   *
   * @deprecated   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  calcularResultadoNivel() {
    // calcula la incognita cuando no es el resultado y también cuando coincide
    // con resultado otro numero para hacer posible que la operacion este
    // correcta

    this.operandos[this.posicion_nivel - 1] = '?';
    this.operandos[this.posicion_incognita - 1] = 'x';
    // this.calcularResultado();
  }

  /**
   * Convierte la operacion en una cadena de texto legible
   *
   * @author Fernando Ramírez Pérez
   * @param {boolean} [equal=true] Muestra el símbolo igual y el resultado
   * @param {boolean} [verbose=false] Muestra mas información de la operacion, un resumen de las opciones
   * @return {string}
   * @memberof Operacion
   */
  toString( equal=true, verbose = false ) {
    // const debug= true;
    const tag = '[operacion.js.toString(equal=true, verbose = false)]';
    if ( debug ) console.log( tag, equal, verbose );
    // expresa la operación
    let txt = '';
    const operandos = this.getOperandos();
    // console.log( tag, 'operandos', operandos);

    if ( debug && verbose ) {
      txt += '- nivel: ' + this.nivel + '.\n';
      // txt += '- posnivel: ' + this.posicion_nivel + '.\n';
      if (this.cantidad_operandos >2 ) {
        txt += '- numero de operandos: ' +
        operandos.length + '.\n';
      }
      txt += '- incognita: ' + this.posicion_incognita + '.\n';
      if (this.enfocado) txt += '- enfocado: ' + this.enfocado + '.\n';
      if (this.permitir_negativos) txt += '- negativos: ' + this.permitir_negativos + '.\n';
      if (this.complementario) txt += '- complementario: ' + this.complementario + '.\n';
    }
    // pone entre corchetes la incognita
    let lastSymbol = '';
    for (let i = 0; i < operandos.length; i++) {
      let operan = operandos[i];
      if ( debug && verbose ) {
        if (this.posicion_nivel - 1 == i) {
          operan = '_' + operan + '_';
        }
      }
      if ( verbose ) {
        if (this.posicion_incognita - 1 == i) {
          operan = '[' + operan + ']';
        }
      }

      // en las restas y sumas los negativos entre paréntesis
      if (operan<0 && lastSymbol == ' - ' ) operan = '('+operan+')';
      if (operan<0 && lastSymbol == ' + ' ) operan = '('+operan+')';

      lastSymbol = ' ' + this.obtenerSimbolo() + ' ';
      txt = txt + operan + lastSymbol;
    }
    // borra el ultimo simbolo
    txt = txt.substr(0, txt.length - lastSymbol.length);

    let resultado = this.resultado;
    if ( verbose ) {
      if (this.posicion_incognita == operandos.length + 1) {
        resultado = '[' + this.resultado + ']';
      }
    }
    if (equal) txt += ' = ' + resultado;
    return txt;
  }

  /**
   * Obtiene un string como en toString() pero sustituye el resultado por un interrogante
   *
   * @author Fernando Ramírez Pérez
   * @return {string} Operacion como cadena de texto pero sin resolver
   * @memberof Operacion
   */
  toStringUnsolved() {
    const tag = '[operacion.js.toStringUnsolved() {]';
    if ( debug ) console.log( tag );
    let txt = this.toString(true, true);
    txt = txt.replace('/\[ (\-?[0-9]+) ]/gi', '[ ? ]');
    return txt;
  }

  /**
   * Muestra la operacion como string con la resolución a la incognita mandada por
   *  el usuario
   *
   * @author Fernando Ramírez Pérez
   * @param {*} input
   * @return {string} Operacion con input del usuario
   * @memberof Operacion
   */
  toStringUserInput(input) {
    const tag = '[operacion.js.toStringUserInput(input)]';
    if ( debug ) console.log( tag, input );
    const txtini = this.toString(true, true);
    const regex = /\[-?[0-9]+(.[0-9]+)?\]/gi;
    const txt = txtini.replace( regex, '[ '+ input +' ]');
    if ( debug ) {
      console.log( tag,
          '\n\t regex', regex,
          '\n\t txtini', txtini,
          '\n\t txt', txt
      );
    }

    return txt;
  }

  /**
   * Devuelve la operacion como html
   *
   * @author Fernando Ramírez Pérez
   * @return {string} Html
   * @memberof Operacion
   */
  toHtml() {
    let html = '';
    let lastSymbol;
    const operandos = this.getOperandos();
    const inputIncognita = '<input type="number" size=3 class="incognita"> ';
    for (let index = 0; index < operandos.length; index++) {
      let operan = operandos[index];
      if (operan<0 && lastSymbol == ' - ' ) operan = '('+operan+')';
      if (operan<0 && lastSymbol == ' + ' ) operan = '('+operan+')';

      if (this.posicion_incognita - 1 == index) {
        operan = inputIncognita;
      }
      lastSymbol = ' ' + this.simbolo + ' ';
      html += operan + lastSymbol;
    }
    html = html.substr(0, html.length - lastSymbol.length);

    let resultado = this.resultado;
    if (this.posicion_incognita == operandos.length + 1) {
      resultado = inputIncognita;
    }
    html += ' = ' + resultado;

    html = '<p class="operacion f-operacion">'+html+'</p>';
    return html;
  }

  /**
   * Version de la operacion para imprimir en pdf
   *
   * @author Fernando Ramírez Pérez
   * @return {string}
   * @memberof Operacion
   */
  toPrint() {
    // const debug = true;
    let html = '';
    let lastSymbol;
    let lastSymbolTxt;
    const operandos = this.getOperandos();
    const inputIncognita = '<span class="input">&nbsp;</span>';
    for (let index = 0; index < operandos.length; index++) {
      let operan = operandos[index];
      if (operan<0 && lastSymbol == '-' ) operan = '('+operan+')';
      if (operan<0 && lastSymbol == '+' ) operan = '('+operan+')';
      operan = '<span class="operando">'+operan+'</span>';

      if (this.posicion_incognita - 1 == index) {
        operan = inputIncognita;
      }
      lastSymbol = this.simbolo;
      lastSymbolTxt = `<span class="simbolo ${this.simbolo}">
          ${this.simbolo}</span>`;
      html += operan + lastSymbolTxt;
    }
    html = html.substr(0, html.length - lastSymbolTxt.length);

    let resultado = this.resultado;
    if (this.posicion_incognita == operandos.length + 1) {
      resultado = inputIncognita;
    } else {
      resultado = `<span class="resultado">${resultado}</span>`;
    }
    html += '<span class="simbolo igual"> = </span>'+ resultado;

    html = '<p class="operacion f-operacion">'+html+'</p>';
    if ( debug ) html = this.id + ' ' + html;

    return html;
  }

  /**
   * Igual que toHtml muestra la operacion como codigo html, pero mostrando el resultado
   *
   * @author Fernando Ramírez Pérez
   * @return {string} html
   * @memberof Operacion
   */
  toHtmlSolved() {
    const tag = '[operacion.js.toHtmlSolved]';
    if ( debug ) console.log( tag );
    const html = '<p>' + this.toString(true, true) + '</p>';
    return html;
  }

  /**
   * Devuelve una clase con información de la operacion,
   *
   * @author Julio
   * @return {object} con los datos tipo, operandos, resultado, posicion, incognita, nivel, lower_bound, upper_bound y cantidad de operandos
   * @memberof Operacion
   */
  formula() {
    const formula = {
      'tipo': this.tipo,
      'operandos': this.operandos,
      'resultado': this.resultado,
      'posicion': this.posicion_nivel,
      'incognita': this.posicion_incognita,
      'nivel': this.nivel,
      'lower_bound': this.lower_bound,
      'upper_bound': this.upper_bound,
      'cantidadOperandos': this.cantidad_operandos,
    };
    return formula;
  }

  /**
   * Posicion al azar, empieza por 1 y incluye el resultado como ultima
   * posicion
   * @param {boolean} incluirPosicionResultado el resultado puede ser una
   *                    posicion
   *
   * @return {number} position
   * @memberof Operacion
   */
  posicionAlAzar( incluirPosicionResultado = true) {
    const tag = '[Operacion.posicionAlAzar]';
    let posicion;
    if (incluirPosicionResultado) {
      // sale la mayoria de las veces la primera posicion
      // posicion = Math.round( this.rng()*this.cantidad_operandos )+2
      posicion = this.getRandomMinMax(1, this.cantidad_operandos+1);
      // Math.round( this.rng()*123412341234 ) %
      // (this.cantidad_operandos+1) +1;
    } else {
      posicion = posicion = this.getRandomMinMax(1, this.cantidad_operandos);
      // Math.round( this.rng()*123412341234 ) % this.cantidad_operandos + 1;
    }
    if ( debug ) {
      console.log(
          tag, 'fin', '\n\t',
          'complementario', this.complementario, '\n\t',
          'incluirPosicionResultado', incluirPosicionResultado, '\n\t',
          this.cantidad_operandos, '\n\t',
          'posicion al azar:', posicion);
    }
    return posicion;
  }

  /**
   * devuelve +1 o -1 para reflejar - o +
   * @return {number} signo
   * @memberof Operacion
   */
  getSigno() { // 0 negativo; 1 positivo
    let signo = Math.round(this.rng());
    if (signo == 0) signo = -1;
    return signo;
  }
  /**
     * Se cambio la manera de calcular los números y ya no se usa
     *
     * Genera un numero entre 0 y offset, tiene en cuenta lower y upper bound
     * como limites inferiores y superiores que debe tener el numero resultante
     *
     *
     *
     * @param {number} lowerBound
     * @param {number} upperBound
     * @param {number} offset
     * @return {number} desvio
     * @memberof Operacion
     */
  getDesvio(lowerBound = 1, upperBound = 10, offset = 0 ) {
    const tag = '[Operacion.getDesvio]';
    if ( debug ) {
      console.log( this.id+tag, 'lowerBound', lowerBound,
          'upperBound', upperBound, 'offset', offset );
    }
    let limiteSuperior = this.nivel + offset;
    let limiteInferior = this.nivel - offset;
    if ( limiteSuperior > upperBound ) {
      limiteSuperior = upperBound;
    }
    if ( limiteInferior < lowerBound ) {
      limiteInferior = lowerBound;
    }
    if ( debug ) console.log( this.id+tag, 'limiteSuperior', limiteSuperior );
    if ( debug ) console.log( this.id+tag, 'limiteInferior', limiteInferior );
    const desvio = Math.round(
        this.rng()*(limiteSuperior-limiteInferior)+limiteInferior);

    if ( debug ) console.log( this.id+tag, 'desvio', desvio );
    return desvio;
  }

  /**
   * Obtenener numero aleatorio entre dos numeros
   *
   * @author Fernando Ramírez Pérez
   * @param {number} min
   * @param {number} max
   * @return {number}
   * @memberof Operacion
   */
  getRandomMinMax(min, max) {
    // const tag = '[Operacion.getRandomMinMax(min, max)]';
    // if ( debug ) console.log( this.id+tag, min, max );
    return Math.round(this.rng()*(max-min)+min);
  }

  /**
   * Obtiene un numero al azar que cumple con las condiciones de la operacion
   * esPosicionNivel antes estaba por que se tenia en cuenta la opcion de
   * posicionNivel como el numero que cumplia con los parametros del nivel
   * y tambien se ve lo de offset comentado por que antes se calculaba que este
   * numero tenia que estar entre nivel-offset y nivel+offtest, se decir si era nivel 10 y
   * el offset era 10 estaria entre 0 y 20 ,
   * todo eso cambio y ahora todos lon numeros estan entre 0 y el nivel
   * asi que se camibo esta function y basciamente lo que hace es llamar a
   * getRandomMinMax(lowerBound, upperBound) y multiplicarla por -1 si tiene
   * la opcion desvio negativo
   *
   * @author Fernando Ramírez Pérez
   * @param {boolean} [esPosicionNivel=false]
   * @param {boolean} [desvioNegativo=false] si es verdadero se devuelve un numoro negativo
   * @param {*} [lowerBound=this.lower_bound] limite inferior
   * @param {*} [upperBound=this.upper_bound] limine superior
   * @return {number} Numero al azar entre los limites enviados
   * @memberof Operacion
   */
  numeroRandom(
      esPosicionNivel = false, desvioNegativo = false,
      lowerBound=this.lower_bound, upperBound=this.upper_bound ) {
    const tag = '[Operacion.numeroRandom]';
    if ( debug ) {
      console.log( this.id+tag,
          'esPosicionNivel, desvioNegativo,'+
          'lowerBound, upperBound',
          esPosicionNivel, desvioNegativo,
          lowerBound, upperBound
      );
    }
    // porcentaje de desvio del número al azar depende del nivel
    let offset = 0;
    let signo = 1; // Inicializamos el signo a Positivo

    if (this.permitir_negativos) {
      signo = this.getSigno();
    }

    switch (this.nivel) {
      case 50:
        // console.log('lvl 10 offset 10');
        offset = this.nivel;
        break;
      case 100:
        // console.log('lvl 100 offset 50');
        offset = this.nivel;
        break;
      case 500:
        // console.log('lvl 500 offset 100');
        offset = this.nivel;
        break;
      default: // del 1 al 20
        offset = this.nivel - 1;
        break;
    }

    if (desvioNegativo) {
      signo= -1;
    }

    // if ( debug ) console.log( this.id+tag, 'lowerBound, upperBound, offset',
    //    lowerBound, upperBound, offset );
    // Desvio siempre da el mismo numero, lo cambio por getRandomMinMax
    // const operando = this.getDesvio( lowerBound, upperBound, offset );
    const operando = this.getRandomMinMax( lowerBound, upperBound);
    // const operando = this.getRandomMinMax(lowerBound, upperBound);

    return operando * signo;
  }

  /**
   * Numero al azar teniendo en cuenta la posicion del operando, la posicion
   * nivel
   * @param {int} posicionOperando
   * @return {number} posicion de un operador al azar
   */
  operandoRandom(posicionOperando) {
    let esPosicionNivel=false;
    if (posicionOperando==this.posicion_nivel) esPosicionNivel=true;
    return this.numeroRandom( esPosicionNivel );
  }

  /**
   * Multiplica los numeros enviados en un array
   * @param {Array.number} lista de numeros
   * @return {number} resultado
   */
  multiplicarValores(lista) {
    const tag = '[Operacion.multiplicarValores(lista)]';
    if ( debug ) console.log( this.id+tag, lista );
    return multiplyValues(lista);
  }

  /**
   * /Divide los numeros enviados en un array
   * @author Fernando Ramírez Pérez
   * @param {Array.number} lista de numeros
   * @return {number} resultado
   */
  dividirValores(lista) {
    const tag = '[Operacion.dividirValores(lista)]';
    if ( debug ) console.log( this.id+tag, lista );
    return divideValues(lista);
  }

  /**
   * Suma los numeros enviados en un array
   * @author Fernando Ramírez Pérez
   * @param {Array.number} lista de numeros
   * @return {number} resultado
   */
  sumarValores(lista) {
    const tag = '[Operacion.sumarValores(lista)]';
    if ( debug ) console.log( this.id+tag, lista );
    return sumValues(lista);
  }

  /**
   * Resta los numeros enviados en un array
   * @author Fernando Ramírez Pérez
   * @param {Array.number} lista de numeros
   * @return {number} resultado
   */
  restarValores(lista) {
    const tag = '[Operacion.restarValores(lista)]';
    if ( debug ) console.log( this.id+tag, lista );
    if (lista[0] === undefined) {
      console.log( tag, 'r es undefined algo ha ido mal', lista );
    }
    return subtractValues(lista);
  }

  /**
   * Obtenetiene un array con el numero multiplicado por 2,3,4,5...
   *
   * @example <caption>Obtener 5 numeros  multiplicnado 2 hasta 3  </caption>
   * //returns [10,15]
   * obtenerMultiplosHasta(5,3);
   *
   *
   * @author Fernando Ramírez Pérez
   * @param {*} num numero
   * @param {number} [limite=10] se multiplica hasta este numero
   * @return {Array}
   * @memberof Operacion
   */
  obtenerMultiplosHasta(num, limite=10) {
    return multiplesUntil(num, limite);
  }

  /**
   * Divide un número en sus factores primos.
   *
   * @param {*} numero
   * @return {Array} factores
   */
  factorizar(numero) {
    return factorize(numero, this._MAXIMO_PRIMO);
  }

  /**
   * Obtener numero de decimales del numero dado
   *
   * @example <caption>Obtener deciamles del numero 22.111 </caption>
   * obtenerNumeroDecimales( 22.111 )
   * // devuelve 3
   *
   * @author Fernando Ramírez Pérez
   * @param {float} num
   * @return {number}
   * @memberof Operacion
   */
  obtenerNumeroDecimales(num) {
    return decimalPlaces(num);
  }

  /**
   * Comprueba que estan definidos todos los operandos, si no lo estan llama a
   * _generarOperandoPosicion() para el operando faltante
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  comprobarOperandosEnviados() {
    const tag = '[Operacion.comprobarOperandosEnviados]';
    if ( debug ) console.log( this.id+tag, this.operandos );

    // si se envia solo un operando generar el faltante:
    // if ( debug ) console.log( this.id+tag, 'operandos', this.operandos );
    // if ( debug ) console.log( this.id+tag, 'cantidad_operandos',
    //    this.cantidad_operandos );
    // if ( debug ) console.log( this.id+tag, 'operandos length',
    //    this.operandos.length );

    let operandosVacios = 0;
    let operandosLlenos = 0;
    for (let idx = 0; idx < this.cantidad_operandos; idx++) {
      if ( !this.operandos[idx] || this.operandos[idx] === undefined) {
        operandosVacios++;
      } else {
        operandosLlenos++;
      }
    }
    if ( debug ) {
      console.log( this.id+tag,
          'operandosVacios', operandosVacios,
          'operandosLlenos', operandosLlenos
      );
    }
    if ( operandosLlenos>0 && operandosVacios>0 ) {
      if ( debug ) {
        console.log( this.id+tag,
            'hay operados vacios'
        );
      }
      for (let idx = 0; idx < this.cantidad_operandos; idx++) {
        if ( debug ) console.log(tag, 'rellenar operandos pendientes:');
        // if ( debug ) console.log(tag,'operando number', this.operandos[idx]);
        if ( !this.operandos[idx] || this.operandos[idx] === undefined) {
          if ( debug ) {
            console.log(
                this.id+tag, 'generar operando para ', idx );
          }
          this._generarOperandoPosicion(idx);
        }
      }
    }
    if ( debug ) console.log( this.id+tag, 'final operandos:', this.operandos );
  }

  /**
   * Numero de operandos después de la posicion dada
   *
   * @author Fernando Ramírez Pérez
   * @param {*} posicion
   * @return {number} numero de operandos
   * @memberof Operacion
   */
  numOperandosPosteriores(posicion) {
    return countFollowingOperands(this.operandos, posicion, this.cantidad_operandos);
  }

  /**
   *  Obtener Grupo de factores
   * @todo revisar uso
   *
   * @author Fernando Ramírez Pérez
   * @param {*} factores
   * @param {*} cantidadOperandos
   * @return {array} operandos
   * @memberof Operacion
   */
  _ObtenerOperandosDeGrupoFactores(factores, cantidadOperandos) {
    const tag = '[Operacion._ObtenerOperandosDeGrupoFactores]';
    if ( debug ) console.log( tag );

    const factoresRestantes = factores;
    let nFactoresRestantes = factores.length;
    let operandosRestantes = cantidadOperandos;
    const operandos = [];
    const grupoFactores = [];

    if (this.complementario==100) {
      if ( debug ) console.log('todos los operandos deberían ser multiplos de 10, solo puede ser 10*10*1*1....');
      const cien =[100, 1];
      // agregar *1 para el resto de operandos
      for (let index = 0; index < this.cantidad_operandos-2; index++) {
        cien.push(1);
      }
      return cien;
    }

    for (let grupoN = 0; grupoN < this.cantidad_operandos; grupoN++) {
      // if ( debug ) console.log(tag, 'gen grupo de factores',
      // '\n\t', tag, 'factoresRestantes', factoresRestantes,
      // '\n\t', tag, 'factoresRestantes', factoresRestantes,
      // );
      // genera un grupo con el numero al azar de factores
      // que sea inferior la n factores restantes

      const maxSize = Math.ceil(nFactoresRestantes/operandosRestantes);
      let groupSize;
      if ( maxSize>1 ) {
        groupSize = Math.round( this.rng()*(maxSize-1) ) +1;
      } else groupSize = 1;
      if ( debug ) {
        console.log( this.id+tag,
            'groupSize', groupSize );
      }

      if ( operandosRestantes == 1 ) {
        groupSize = maxSize;
      }
      grupoFactores[grupoN] = [];
      let op;
      if ( nFactoresRestantes > 0) {
        for (let index = 0; index < groupSize; index++) {
          const r = Math.floor(this.rng()*nFactoresRestantes);
          if ( debug ) console.log( this.id+tag, 'factor que se agrega a grupo:', factores[r] );
          grupoFactores[grupoN].push( factoresRestantes[r] );
          factoresRestantes.splice(r, 1);
          nFactoresRestantes--;
        }

        op = this.multiplicarValores(grupoFactores[grupoN]);
      } else {
        op = 1;
      }
      operandos[grupoN] = op;
      operandosRestantes -= 1;
    }
    return operandos;
  }

  /**
   * Devuelve el simbolo
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   *
   * @return {string} simobolo "+", "-", "*", "/"
   */
  obtenerSimbolo() {
    return this.simbolo;
  }

  /**
   * Segun el nivel de la operacion se obtienen un numeros de decimales
   * mientras mayor sea el nivel mayor la dificualtad y mas decimales
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   *
   * @param {number} nivel
   * @return {number} numerodecimales entre uno y tres
   *
   */
  obtenerDecimalesSegunNivel(nivel) {
    return decimalPlacesForLevel(nivel);
  }

  /**
   * Devuelve numero de operandos con decimales en la operacion
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   *
   * @return {number} cantidad de operandos deciamales
   */
  getCantidadOperandosDecimales() {
    return countDecimalOperands(this.operandos);
  }

  /**
   * Devuelve numero de operandos con negativos en la operacion
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   *
   * @return {number} cantidad de operandos negativos
   */
  getCantidadOperandosNegativos() {
    return countNegativeOperands(this.operandos);
  }

  /**
   * Ordena de mayor a menor los operandos
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   *
   */
  ordenarOperandosMayorAMenor() {
    const sorted = sortOperandsDescending(
        this.operandos,
        this.posicion_nivel,
    );
    this.operandos = sorted.operandos;
    this.posicion_nivel = sorted.levelPosition;
  }

  /**
   * Devuelve una copia de los operandos ( no lo pasa por referencia para que no
   * se puedan modificar accidentalmente )
   *
   * @author Fernando Ramírez Pérez
   * @return {Array} Opreandos
   * @memberof Operacion
   */
  getOperandos() {
    return this.operandos.slice();
  }

  /**
   * Cambia los operando a los valores enviados en el array
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   * @param {Array.number} lista con operandos nuevos
   * @return {number} cantidad de operandos negativos
   */
  setOperandos(lista) {
    this.operandos = lista;
  }

  /**
   * Busca el valor entre los operadores actuales
   *
   * @param {number} val valor a buscar
   * @return {boolean} Verdadero si encuentra el numero en los operadores
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  operandosHasValue(val) {
    return hasOperandValue(this.operandos, val);
  }

  /**
   * Cambia el signo de todos los operandos
   *
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  cambiarSignoOperandos() {
    if (this.operandos) {
      this.operandos = invertAllOperandSigns(this.operandos);
    }
  }

  /**
   * Cambia el signo del operando en la posicion
   *
   * @param {integer} i posicion operando
   * @author Fernando Ramírez Pérez
   * @memberof Operacion
   */
  cambiarSignoOperando(i = 0) {
    this.operandos = invertOperandSign(this.operandos, i);
  }

  /**
   * Agrega decimales al numero , tiene en cuenta el nivel para poner mas o
   * menos decimales
   *
   * @author Fernando Ramírez Pérez
   * @param {number} num Numero original 
   * @return {float} Numero con decimales
   * @memberof Operacion
   * @example
   * // devuelve 5.4 o 5.1 o 5.3...
   * agregarDecimalesAzar(5)
   */
  agregarDecimalesAzar( num ) {
    let newNum;
    const numDecimales = this.obtenerDecimalesSegunNivel(this.nivel);
    const p = new Decimal(10).pow(numDecimales);

    let parteDecimal = this.getRandomMinMax(0, p -1);
    parteDecimal = new Decimal(parteDecimal).div(p);
    if ( num >= 0 ) {
      newNum = new Decimal(num).plus( parteDecimal );
    } else {
      newNum = new Decimal(num).minus( parteDecimal );
    }
    newNum = parseFloat( newNum.toString());

    return newNum;
  }

  /**
   * Devuelve el tipo de operacion , en este caso como es la base de las demas
   * operaciones solo devuelve una cadena vacia
   *
   * @author Fernando Ramírez Pérez
   * @return {string} tipo de operacion
   * @memberof Operacion
   */
  getTipo() {
    return '';
  }

  /**
   * Muestra los errores que han surgido al generar la operacion
   *
   * @author Fernando Ramírez Pérez
   * @return {string}
   * @memberof Operacion
   */
  showErrors() {
    let txt= '';
    this.errors.forEach((e) => {
      txt += e.error+': ';
      txt += e.msg+'. \n';
    });
    return txt;
  }

  //TODO: revisar esto para borrarlo o unificar showErrors y mostrarErrores
  mostrarErrores() {
    let txt= '';
    if (this.errors.length > 0 ) {
      txt = 'Errores:\n';
    } else {
      return '';
    }

    this.errors.forEach((e) => {
      txt += this.toString() + '\n';
      txt += e.error+': ' + '\n';
      txt += e.msg+'. \n';
      txt += '\n';
    });

    return txt;
  }

  mostrarErroresHtml() {
    const txt = this.mostrarErrores();
    return '<pre>'+txt+'</pre>';
  }

  esRespuesta( respuestaUsuario ) {
    const tag = '[operacion.js.esRespuesta( respuestaUsuario )]';
    if ( debug ) console.log( tag, respuestaUsuario );
    if ( debug ) console.log( this.respuesta() );
    return (this.respuesta() == respuestaUsuario);
  }

  /**
   * Respuesta correcta a la incognita
   *
   * @author Fernando Ramírez Pérez
   * @return {Object}
   * @memberof Operacion
   */
  respuesta() {
    let respuesta;
    if (this.posicion_incognita != this.cantidad_operandos+1) {
      respuesta = this.operandos[this.posicion_incognita-1];
    } else {
      respuesta = this.resultado;
    }
    return respuesta;
  }

  /**
   * Comprobar la cantidad de operandos inicales enviados al crear la operacion,
   * los que no son generados
   *
   * @author Fernando Ramírez Pérez
   * @return {Object} Cantida de operandos
   * @memberof Operacion
   */
  operandosInicialesLength() {
    return countDefinedOperands(this.operandosIniciales);
  }

  /**
   * Genera un numero del 1-9 y lo multiplica por 'multiplo'
   *
   * @author Fernando Ramírez Pérez
   * @param {*} posicion posicion del operando
   * @param {*} multiplo numero por el que se va a multiplicar
   * @memberof Operacion
   */
  operandoMultiploN(posicion, multiplo) {
    // const debug = true;
    const tag = '[operacion.js.operandoMultiploN(posicion, multiplo)]';
    if ( debug ) console.log( tag, posicion, multiplo );
    this._operandoUnidad(posicion);
    let operando = this.operandos[posicion];
    if ( debug ) {
      console.log( tag,
          'operando de _operandoUnidad(posicion)', operando );
    }

    if (Math.abs(operando)>0) {
      operando *= multiplo;
    }
    this.operandos[posicion] = operando;
    if ( debug ) {
      console.log( tag,
          'operando posicion', operando, this.operandos );
    }
  }

  /**
   * Genera un numero del 1-9 y lo multiplica por 10
   *
   * @author Fernando Ramírez Pérez
   * @param {*} posicion
   * @memberof Operacion
   */
  operandoMultiplo10(posicion) {
    this.operandoMultiploN(posicion, 10);
  }

  /**
   * Genera un numero del 1-9 y lo multiplica por 100
   *
   * @author Fernando Ramírez Pérez
   * @param {*} posicion
   * @memberof Operacion
   */
  operandoMultiplo100(posicion) {
    this.operandoMultiploN(posicion, 100);
  }
}

