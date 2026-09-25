
import '../debug.js';
import Operacion from './operacion';
import {evaluateArithmetic} from './evaluate';
import {
  symbolsFor,
  hasAny,
  sameOperatorMultiset,
  foldMulDiv,
  countAdjacent,
  onlyMulDiv,
  canAutoPlaceParentheses,
  groupSimilarOperations,
  MUL_DIV,
  SUM_SUB,
  DIVISIONS,
} from './expression';
import Suma from './suma';
import Resta from './resta';
import Multiplicacion from './multiplicacion';
import DivisionEntera from './divisionEntera';
import OPERACIONES from './operaciones';
import {TIPO_NUMERO} from './tipoNumero';
import {selectExpressionOperations} from './operationSelection';
import DivisionDecimales from './divisionDecimales';
import Division from './division';
import Decimal from 'decimal.js';

/**
 * Operaciones con mulitiples operaciones dentro, como una operacion de 3 cifras con una suma y multiplicacion 
 *
 * @author Fernando Ramírez Pérez
 * @author Área de Tecnología Educativa (versión simplificada 1.3+)
 * @class OperacionMultiple
 * @extends {Operacion}
 */
class OperacionMultiple extends Operacion {
  constructor({
    nivel = 50,
    cantidadOperandos = 3,
    permitirNegativos = false,
    tiposOperacion,
    operandos = [],
    resultadoNegativo = false,
    tiposOperacionAzar = true,
    parentesis = false,
    posicionParentesis = [],
    tiposNumero = [],
    incognita = parseInt(cantidadOperandos) + 1,
    enfocado = false,
    random,
  } = {}) {
    let tag = '[OperacionMultiple]';
     

    // si no pongo esto me cambia los operandos el super
    const operandosEnviados = operandos.slice();

    super({
      nivel: nivel,
      cantidadOperandos: cantidadOperandos,
      operandos: operandos,
      incognita: incognita,
      enfocado: enfocado,
      random,
      // permitirNegativos: permitirNegativos,
      // resultadoNegativo: resultadoNegativo,
    });


    if (cantidadOperandos < 3) {
      this.resultado = null;
      this.errors.push({
        'error': 'operandos',
        'msg': 'Cantidad de operandos menor que 3',
      });
      return this.errors;
    }
    tag = this.id + tag;
    this.operandos_por_usuario =
      (operandosEnviados.length == this.cantidad_operandos );
    this.operandosEnviados = operandosEnviados;

    this.resultadoNegativo = resultadoNegativo;
    this.resultados = [];
    this.tiposOperacionAzar = tiposOperacionAzar;

    this.deep = 0;

    this.forzarParentesis = parentesis;
    this.posicionParentesis = posicionParentesis;

    if (tiposOperacion==undefined) {
      tiposOperacion = OPERACIONES.enteras;
    }
    this.tiposOperacion = tiposOperacion;
    // si el tipo de operacion es solo uno y hay multiples operadores llama a
    // la operacion simple y sale
    if (tiposOperacion.length==1) {
      this.operacionSimple(
          tiposOperacion[0], nivel, cantidadOperandos,
          permitirNegativos, this.operandosEnviados);
      return;
    }

    this.operacionesGuardadas = [];

    if (tiposNumero.includes(TIPO_NUMERO.DECIMAL)) {
      this.decimales = true;
    }
    if (tiposNumero.includes(TIPO_NUMERO.ENTERO)) {
      this.permitirNegativos = true;
    } else {
      this.permitirNegativos = false;
    }

    // remplaza 'division' por 'division entera' si no hay decimales
    const buscar = OPERACIONES.DIVISION;
    let remplazar;
    if ( this.tiposOperacion.includes(OPERACIONES.DIVISION) &&
        !tiposNumero.includes(TIPO_NUMERO.DECIMAL)) {
      remplazar = OPERACIONES.DIVISION_ENTERA;
    } else {
      remplazar = OPERACIONES.DIVISION_DECIMAL;
    }
    this.tiposOperacion.forEach((tipoOp, index) => {
      if ( tipoOp == buscar ) this.tiposOperacion[index] = remplazar;
    });

    this.tiposNumero = tiposNumero;

    if ( this.operandos_por_usuario ) {
    }

    // definir operaciones que se van a realizar
    if (this.tiposOperacionAzar ) {
      this.tiposOperacion = this.obtenerOperacionesAzar(this.tiposOperacion);
    }


    // comprobar error operaciones imposibles
    this.comprobarErrorTiposOperacion();

    this.operadores = symbolsFor(this.tiposOperacion);
    if ( this.forzarParentesis ) this.colocarParentesis();
    if ( this.operandos_por_usuario ) {
      // colocar parentesis si fuera necesario
      if ( this.forzarParentesis ) this.resolverOperacionParentesis();
      this.calcularResultado();
    } else {
      this.generarOperaciones();
      this.calcularResultado();
      if (this.comprobarResultado().resultado == false ) {
        this.errors.push({
          error: 'Operación con errores', msg: '',
        });
        // Keep the instance. Returning a plain copy dropped every method
        // (toString became Object.prototype.toString → "[object Object]")
        // whenever validation failed, so the UI and the tests could not
        // inspect the exercise. resultado === false still signals failure
        // and GenerarExamen already retries on that.
        this.resultadoPre = this.resultado;
        this.resultado = false;
      }
    }

  }

  generarOperaciones() {

    const antiguosOperandos = this.operandos.slice();
    this.operandos = null;
    this.operandos = [];
    const operacionesRestantes = this.tiposOperacion.slice();
    
    // separo esto para resolver el problema divisiones con parentesis
    if ( this.forzarParentesis && hasAny(this.tiposOperacion, DIVISIONS) ) {
      if (onlyMulDiv(this.tiposOperacion) && this.parentesisInicial == 0 && this.parentesisFinal == 2){
        // si solo hay mul y div deveria resolverse como una operacion normal con multiplicaciones y divisiones
      } else {
        this.crearDivisionesSinParentesis(operacionesRestantes);
        this.resolverOperacionParentesisResultado();
        return;
      }      
    } else {
      // si no hay divisiones podemos resolver los parentesis primero
      if ( this.forzarParentesis ) {
        // resolver primero las operaciones entre parentesis
        this.resolverOperacionParentesis();
      }
    }    


    // generamos primeros multiplicaciones y divisiones
    if ( hasAny(this.tiposOperacion, MUL_DIV)) {
      if ( hasAny(this.tiposOperacion, DIVISIONS) ){

        // divisiones
        this.crearDivisiones(operacionesRestantes);
      }
      
      // multiplicaciones:
      this.crearMultiplicaciones(operacionesRestantes);
    }
    // cambiar signo de resultados mul / div segun
    // si se queirer que el resultado final
    // lo sea o no ->


    const operandosMulDiv = this.operandos.slice();

    // cambia el signo de algun operandos en mul y divi. para dar
    // resultado positivo o negativo
    // hace esto si son todo multiplicaciones y divisiones
    if ( onlyMulDiv(this.tiposOperacion) ) {
      if ( this.tiposNumero.includes(TIPO_NUMERO.ENTERO) ) {
        this.cambiarSignoAMulDivSiResultado(operandosMulDiv);

        if (this.resultadoNegativo == false) {
          this.cambiarSignoDosOperandos();
        }
      }

    } else {
      const jsonDivDecimal = [OPERACIONES.SUMA, OPERACIONES.DIVISION_DECIMAL];
      const jsonSumaMulti = [OPERACIONES.SUMA, OPERACIONES.MULTIPLICACION];
      if (
        this.compararTiposOperaciones(
          this.tiposOperacion,
          [OPERACIONES.SUMA,OPERACIONES.DIVISION_ENTERA]
        ) ||
         this.compararTiposOperaciones(this.tiposOperacion, jsonDivDecimal)
      ) {
        // TODO: FALLA CON LOS DECIMALES
        this.crearSumasParaDivisionSuma(operacionesRestantes);
      } else if ( this.compararTiposOperaciones(this.tiposOperacion, jsonSumaMulti) ) {
        this.crearSumasParaMultiplicacionSuma(operacionesRestantes);
      } else {
        this.crearSumasRestas(operacionesRestantes);
      }
    }


    // rellenar huecos de operandos con los operandos random que nos dio el
    // padre
    this._rellenarOperandosVacios(antiguosOperandos);

  }

  /**
   * Comprara dos arrays de tipos de operaciones
   *
   * @param {*} tiposA
   * @param {*} tiposB
   * @return {boolean} devuelve true si son iguales
   * @memberof OperacionMultiple
   */
  compararTiposOperaciones( tiposA , tiposB ) {
    return sameOperatorMultiset(tiposA, tiposB);
  }

  toString(equal=true, verbose=false) {
    let resultado = this.resultado;
    let txt = '';
    let lastSymbol = '';
    for (let i = 0; i < this.operandos.length; i++) {
      this.simbolo = this.operadores[i];
      let operan = this.operandos[i];

      if ( verbose ) {
        if (this.posicion_incognita - 1 == i) {
          operan = '[' + operan + ']';
        }
      }

      // en las restas los negativos entre paréntesis
      if (operan<0 && lastSymbol == ' - ' ) operan = '('+operan+')';
      if (operan<0 && lastSymbol == ' + ' ) operan = '('+operan+')';

      lastSymbol = ' ' + this.simbolo + ' ';
      if (this.parentesisInicial == i) operan = '( '+operan;
      if (this.parentesisFinal == i) operan = operan+ ' )';
      txt = txt + operan + lastSymbol;

      if ( verbose ) {
        if (this.posicion_incognita == this.operandos.length + 1) {
          resultado = '[' + this.resultado + ']';
        }
      }
    }
    // borra el ultimo simbolo
    txt = txt.substr(0, txt.length - lastSymbol.length);
    if ( equal ) txt += ' = ' + resultado;


    return txt;
  }

  /**
   * Version html de la operacion
   *
   * @return {string} html de la operacion
   * @memberof OperacionMultiple
   */
  toHtml() {
    let html = this.toString();
    const inputIncognita = '<input type="number" size=3 class="incognita">';
    let solucionInput;
    if ( this.posicion_incognita == this.cantidad_operandos+1 ) {
      html = this.toString(false);
      solucionInput = ' = '+ inputIncognita;
      html += solucionInput;
    } else {
      const txtini = this.toString(true, true);
      const regex = /\[-?[0-9]+(.[0-9]+)?\]/gi;
      const txt = txtini.replace( regex, inputIncognita);
      html = txt;
    }
    html = '<p class="operacion operacionMultiple">'+html+'</p>';
    return html;
  }

  /**
   * Verion para imprimir de la operacion se usa en el pdf
   *
   * @return {string} codigo html que se enviara con el formato para imprimir
   * @memberof OperacionMultiple
   */
  toPrint() {

    let html = '';
    const inputIncognita = '<span class="input">&nbsp;</span>';
    const igual = '<span class="simbolo igual"> = </span>';
    const operandos = this.getOperandos();
    let lastSymbol;

    for (let index = 0; index < operandos.length; index++) {
      let operan = operandos[index];
      // agrega separadores de miles y cambia la ',' por '.'
      operan = Number(operan).toLocaleString('Es-es');
      if (operan<0 && lastSymbol && lastSymbol.includes('-') ) operan = '('+operan+')';
      if (operan<0 && lastSymbol && lastSymbol.includes('+') ) operan = '('+operan+')';
      operan = '<span class="operando">'+operan+'</span>';

      if (this.posicion_incognita - 1 == index) {
        operan = inputIncognita;
      }

      if (this.parentesisInicial == index) {
        operan = '<span class="simbolo parentesis inicial">(</span>'+operan;
      }
      if (this.parentesisFinal == index) {
        operan += '<span class="simbolo parentesis final">)</span>';
      }

      const simbolo = this.operadores[index];
      if ( simbolo ) {
        lastSymbol = `<span class="simbolo ${simbolo}">${simbolo}</span>`;
      } else {
        lastSymbol = ' ';
      }

      html += operan + lastSymbol;
    }
    html = html.substr(0, html.length - lastSymbol.length);
    let resultado = this.resultado;
    if (this.posicion_incognita == operandos.length + 1) {
      resultado = inputIncognita;
    } else {
      resultado = `<span class="resultado">${resultado}</span>`;
    }
    html += igual + resultado;

    html = '<p class="operacion f-operacion">'+ '<br>'+html+'</p>';
    return html;
  }

  toHtmlSolved() {
    const html = '<p class="operacion">'+this.toString()+'</p>';
    return html;
  }

  ordenarPrioridad(operaciones) {
    const orden = [[], [], []];
    let operandos;

    // como tengo en cuenta los paréntesis?

    if ( this.operandos_por_usuario ) {
      operandos = this.operandos.slice();
    }

    let opAnterior;

    operaciones = groupSimilarOperations(operaciones, operandos, this.operandos_por_usuario);

    operaciones.forEach((element, index) => {


      switch (element.tipo) {
        case OPERACIONES.MULTIPLICACION:
        case OPERACIONES.DIVISION_DECIMAL:
        case OPERACIONES.DIVISION_ENTERA:
        case OPERACIONES.DIVISION_RESTO:
        case OPERACIONES.DIVISION:
          orden[1].push(element);
          break;

        case OPERACIONES.SUMA:
        case OPERACIONES.RESTA:
          orden[2].push(element);
          break;

        default:
          break;
      }
      opAnterior=element;
    });


    // 1 + 2 * 5 debería devolver
    // multiplicacion [2,5] y suma [1]
    let posOperadoresMulti = orden[1].map((x)=>{
      return x.posicionOperadores;
    });
    posOperadoresMulti = posOperadoresMulti.flat();

    // elimina operandos usados por mul/div
    orden[2].forEach( (operacionesUltimaPrioridad, indx) => {
      const operadoresABorrar= [];
      operacionesUltimaPrioridad.posicionOperadores.forEach(
          (posOperador, i)=> {
            if (posOperadoresMulti.indexOf( posOperador ) != -1) {
              operadoresABorrar.push(i);
            }
          }
      );
      // los borra en orden descendente por que si no ya no existe el que se
      // va a borrar
      operadoresABorrar.sort().reverse();
      operadoresABorrar.forEach((x)=>{
        operacionesUltimaPrioridad.operandos.splice(x, 1);
      });
    });

    const operacionesOrdenadas = orden.flat();

    return operacionesOrdenadas;
  }

  addOperandoOperacionAnterior( posicionOperando, operandos, operacionesAnte,
      resultadoAnterior) {


    if (operandos.length == 0) {
      operandos[0] = resultadoAnterior;
    }

    // Agrega el valor de operaciones anteriores con mas prioridad
    if ( operandos.length == 1 ) {
      if (operacionesAnte.length>0 ) {
        if ( posicionOperando < operacionesAnte[0].posicionOperadores[0] ) {
          if (resultadoAnterior) {
            operandos[0] = resultadoAnterior;
          }
          operandos.push( operacionesAnte[0].resultado );
        } else {
          operandos.unshift( operacionesAnte[0].resultado );
        }
        // borramos al operacion calculada usada
        operacionesAnte.splice(0, 1);
      } else {
        // ponemos el resultado operaciones anteriores como operando anterior
        if ( posicionOperando > 0 ) operandos.unshift(resultadoAnterior);
      }
    } else {
      if ( operandos.length >= 2 ) {

        if ( operacionesAnte.length>0 ) {
          if ( posicionOperando < operacionesAnte[0].posicionOperadores[0] ) {
            if (resultadoAnterior) {
              operandos[0] = resultadoAnterior;
            }
            operandos.push( operacionesAnte[0].resultado );
          } else {
            operandos.unshift( operacionesAnte[0].resultado );
          }
        } else {
          // en caso multiplicacion anterior de dos operandos
          if ( posicionOperando > 0 ) {
            operandos[0] = resultadoAnterior;
          }
        }
      }
    }

    return operandos;
  }

  obtenerOperacionesAzar(operaciones) {
    return selectExpressionOperations({
      operations: operaciones,
      operandCount: this.cantidad_operandos,
      negativeResult: this.resultadoNegativo,
      numberTypes: this.tiposNumero,
      random: this._rng,
    });
  }

  generarNumerosOperandos() {
     

    if ( undefined === this.tiposOperacion ) return;
    this.generarOperaciones();
  }

  calcularResultadoComplejo() {
    const operandos = this.operandos.slice();

    // evita que entre desde el contructor de Operacion.js sin operaciones
    if ( undefined === this.tiposOperacion ) return;

    const tiposOperacion = this.tiposOperacion.slice();
    const cantidadOperaciones = this.cantidad_operandos-1;
    // operadores tienen que venir ya definidos

    const ejercicioTxt = this.toString(false); // algo como 343 * 43 = 0

    let d = new Decimal(0);

    // despejar parentesis
    if (
      this.parentesisInicial !== undefined &&
        this.parentesisFinal !== undefined ) {
      const opParentesis = {
        operandos: operandos.slice(
            this.parentesisInicial, this.parentesisFinal+1),
        tiposOperacion: tiposOperacion.slice(
            this.parentesisInicial, this.parentesisFinal+1),
        tiposOperacionAzar: false,
        tiposNumero: this.tiposNumero,
      };

      // si ya se creo  la operacion entre parenteis al genera la opMultiple
      // solo hay que rescatar el resultado
      if ( this.forzarParentesis ) {
        // sustituir los operandos entre parentesis por el resultado
        // elimina todos los operados enter parentesis menos el primero:
        operandos.splice(
            this.parentesisInicial,
            this.operacionEnParentesis.cantidad_operandos-1);
        // sustituye el primero por el resultado
        operandos[this.parentesisInicial]=this.operacionEnParentesis.resultado;
        // elimina las operaciones entren parentesis:
        tiposOperacion.splice(
            this.parentesisInicial,
            this.operacionEnParentesis.cantidad_operandos-1
        );
      }
    } else {
    }


    // despejar muli/divi
    const despejadoMulDiv = this.despejarPrioridadMultiDivi(
        operandos, tiposOperacion );

    // sumar restar todo
    despejadoMulDiv.operaciones.forEach((operacion, i)=> {
      if ( i == 0 ) {
        d = new Decimal(despejadoMulDiv.operandos[i]);
      }
      switch (operacion) {
        case OPERACIONES.RESTA:
          d = d.minus(despejadoMulDiv.operandos[i+1]);
          break;
        case OPERACIONES.SUMA:
          d = d.plus(despejadoMulDiv.operandos[i+1]);
          break;
      }
    });


    if ( despejadoMulDiv.operaciones.length == 0 ) {
      // si hay un solo operando y no hay operaciones?
      d = d.plus(despejadoMulDiv.operandos[0]);
    }


    this.resultado = parseFloat( d.toString() );
  }

  /**
   * Calcula el resultado de la operacion y lo
   * guarda en this.resultado
   */
  calcularResultado() {
    if ( undefined === this.tiposOperacion ) return;
    let operacion = this.toString(false);


    operacion = operacion.replace(/∙/g, '*');
    let resultado;
    try {
      resultado = evaluateArithmetic(operacion);
    } catch (err) {
      resultado = NaN;
    }
    this.resultado = resultado.toFixed(3);
    this.resultado = parseFloat(this.resultado).toString();
  }

  /**
   * Actualiza las operaciones restantes y escribe los operadores resueltos
   * este es para restas y sumas
   * @param {number} operacionesRestantes
   * @param {number} numOperacionesJuntas
   * @param {number} posicion
   * @param {Array} operandos
   */
  _escribeOperandosOperacionesJuntasHaciaDelante(
      operacionesRestantes, numOperacionesJuntas,
      posicion, operandos ) {

    let j = 0;
    for ( let i = posicion; i < posicion+numOperacionesJuntas; i++ ) {
      if (this.operandos[i]===undefined) {
        this.operandos[i] = operandos[j];
      }
      // si la operacion es la ultima habria que poner el operador siguiente
      // tambien
      if ( posicion == this.cantidad_operandos-2 ) {
        this.operandos[i+1] = operandos[j+1];
      }
      operacionesRestantes[i] = null;
      j++;
    }
  }

  /**
   * Actualiza las operaciones restantes y escribe los operadores resueltos
   * este va hacia atras para divisiones y multipliciaciones
   * @param {number} operacionesRestantes
   * @param {number} numOperacionesJuntas
   * @param {number} posicion
   * @param {Array} operandos
   */
  _escribeOperandosOperacionesJuntas(operacionesRestantes, numOperacionesJuntas,
      posicion, operandos ) {
    let j = 0;
    for (
      let index = posicion-(numOperacionesJuntas-1);
      index <= posicion+1;
      index++
    ) {
      const posicionOpMultiple = index;
      // no lo borra si ya exsite
      if (this.operandos[posicionOpMultiple]===undefined) {
        this.operandos[posicionOpMultiple] = operandos[j];
      }
      j++;
      // y borra los operadores division en posicion actual y
      // anteriores divisiones juntas
      if (posicionOpMultiple <= posicion) {
        operacionesRestantes[posicionOpMultiple] = null;
      }
    }
  }

  obtenerOperacion(operacion, opciones) {
    opciones = Object.assign({}, opciones, {
      random: (opciones && opciones.random) || this._rng,
    });
    let op;
    switch (operacion) {
      case OPERACIONES.DIVISION:
        op = new Division(opciones);
        break;
      case OPERACIONES.DIVISION_DECIMAL:
        op = new DivisionDecimales(opciones);
        break;
      case OPERACIONES.DIVISION_ENTERA:
        op = new DivisionEntera(opciones);
        break;
      case OPERACIONES.MULTIPLICACION:
        op = new Multiplicacion(opciones);
        break;
      case OPERACIONES.RESTA:
        op = new Resta(Object.assign({random: this._rng}, opciones));
        break;
      case OPERACIONES.SUMA:
        op = new Suma(Object.assign({random: this._rng}, opciones));
        break;
      default:
        op = new Suma(Object.assign({random: this._rng}, opciones));
        break;
    }
    return op;
  }

  operacionSimple(tipo, nivel, cantidadOperandos, permitirNegativos,
      operandos) {
    const opciones = {
      nivel: nivel,
      cantidadOperandos: cantidadOperandos,
      permitirNegativos: permitirNegativos,
      operandos: operandos,
    };

    const op = this.obtenerOperacion(tipo, opciones);
    this.tiposOperacion = this.obtenerOperacionesAzar(this.tiposOperacion);
    this.operadores = symbolsFor(this.tiposOperacion);
    this.resultado = op.resultado;
    this.operandos = op.operandos;
    this.incognita = op.incognita;
  }

  guardaResultado(operacion, posicion) {
    this.resultados[posicion] = operacion.resultado;
  }

  obtenerResultado(posicion) {
    return this.resultados[posicion];
  }

  obtenerResultadoOpAnteriores(posicion) {
    // lo usa la resta para evitar operaciones negativas
    // normalmente estas operaciones son todas div y multiplicaciones asi que
    // no hay problemas de prioridad de operaciones
    if ( posicion <= 0 ) return 0;
    const optmp = this.operandos.slice();
    const opertmp = this.tiposOperacion.slice();
    const operandosAnteriores = optmp.slice(0, posicion+1);
    const operacionesAnteriores = opertmp.slice(0, posicion);


    const cantOperandos = this.cantidad_operandos - posicion;
    let op;
    if (cantOperandos==2) {
      op = this.obtenerOperacion(operacionesAnteriores[0], {
        operandos: operandosAnteriores,
      });
    } else {
      op = new OperacionMultiple({
        cantidadOperandos: cantOperandos,
        operandos: operandosAnteriores,
        tiposOperacion: operacionesAnteriores,
        tiposOperacionAzar: false,
        random: this._rng,
      });
    }

    return op.resultado;
  }

  obtenerResultadoOpPosteriores(posicion, operacionesJuntas=1) {


    const ultimaOperacion = this.cantidad_operandos-2;
    if ( posicion > ultimaOperacion ) {
      return 0;
    }
    const optmp = this.operandos.slice();
    const opertmp = this.tiposOperacion.slice();
    const ultimaPosicion = this.cantidad_operandos;
    const posicionFinJuntas = posicion+operacionesJuntas;


    const operandosPosteriores = optmp.slice(posicionFinJuntas,
        ultimaPosicion);

    const operacionesPosteriores = opertmp.slice(posicionFinJuntas,
        ultimaPosicion);


    const cantOperandos = this.cantidad_operandos-(posicion+operacionesJuntas);
    let op;
    if (cantOperandos<2) return 0;
    if (cantOperandos==2) {
      op = this.obtenerOperacion(operacionesPosteriores[0], {
        operandos: operandosPosteriores,
        incognita: operacionesPosteriores.length+1,
      });
    } else {
      const opciones = {
        permitirNegativos: this.permitir_negativos,
        cantidadOperandos: cantOperandos,
        operandos: operandosPosteriores,
        tiposOperacion: operacionesPosteriores,
        tiposOperacionAzar: false,
        random: this._rng,
      };
      op = new OperacionMultiple(opciones);
    }

    return op.resultado;
  }

  _rellenarOperandosVacios( operandosRelleno ) {

    for (let index = 0; index < this.cantidad_operandos; index++) {
      if ( this.operandos[index] === undefined ) {
        if ( operandosRelleno[index] ) {
          this.operandos[index] = operandosRelleno[index];
        } else {
          this._generarOperandoPosicion(index);
        }
      }
    }
  }

  _rellenarOperandosSumasLejosDeRestas( operandosRelleno ) {

    const ultimaOperacion = this.cantidad_operandos-2;

    for (let index = 0; index < this.cantidad_operandos; index++) {
      if ( this.tiposOperacion[index] == OPERACIONES.SUMA ) {
        // si la operacion anterior o posterior no son restas
        const opPrev = this.tiposOperacion[index]-1;
        const opPost = this.tiposOperacion[index]+1;
        if (
          ( index==0 || opPrev && opPrev!=OPERACIONES.RESTA ) &&
          ( index==ultimaOperacion || opPost && opPrev!=OPERACIONES.RESTA )
        ) {
          // si esta undefined es por que no forma parte de una mul/div
          if ( this.operandos[index] === undefined ) {
            this.operandos[index] = operandosRelleno[index];
          }
        }
      }
    }
  }

  /**
   * Comprobar resultado
   * llama a super.comprorbarresultado()
   * @return {boolean} devuelve verdadero si el resultado cumple como valido
   */
  comprobarResultado() {

    // ignoramos esto si lo llama desde el constructor de Operacion
    if ( this.getTipo() == '' ) return {resultado: true};

    // llamamos a comprobar resultado de Operacion pero ya con los
    // datos actualizados por OperacionMultiple
    return super.comprobarResultado();
  }

  colocarParentesis() {
    this.parentesisInicial = null;
    this.parentesisFinal = null;
    let inicial;
    let final;
    if ( this.posicionParentesis && this.posicionParentesis.length>0 ) {
      this.parentesisInicial = this.posicionParentesis[0];
      this.parentesisFinal = this.posicionParentesis[1];
      return;
    }
    // Sin una posición explícita, los paréntesis solo se colocan cuando
    // existe un operador de precedencia alta. El código anterior usaba
    // indexOf() como booleano (-1 es truthy y 0 falsy), por lo que esta
    // condición prácticamente nunca filtraba nada.
    if (!canAutoPlaceParentheses(this.cantidad_operandos, this.tiposOperacion)) {
      this.forzarParentesis = false;
      return;
    }

    let operacionInvalida = true;
    const posicionMin = 0;
    const posicionMax = this.cantidad_operandos-1;
    inicial = posicionMin;
    final = posicionMax;
    // no se puede dar ( 1 + 3 * 5 )
    const maxtries = 20;
    let tries = 0;
    while (
      (
        (inicial == posicionMin && final == posicionMax) ||
        operacionInvalida
      ) &&
      tries < maxtries
    ) {

      inicial = this.getRandomMinMax(0, posicionMax-1);
      final = this.getRandomMinMax(inicial+1, posicionMax);
      // operaciones dentro de los parentesis tienen que ser sum y restas
      operacionInvalida = true;
      for (let i = inicial; i < final; i++) {
        const operacion = this.tiposOperacion[i];
        if (operacion == OPERACIONES.SUMA ||operacion == OPERACIONES.RESTA) {
          operacionInvalida = false;
        }
      }
      tries++;
    }

    this.parentesisInicial = inicial;
    this.parentesisFinal = final;
  }

  resolverOperacionParentesis() {

    const tiposOperacionEnParentesis = [];
    for (let i = this.parentesisInicial; i < this.parentesisFinal; i++) {
      tiposOperacionEnParentesis.push(this.tiposOperacion[i]);
    }
    const cantidadOperandosEnParentesis = tiposOperacionEnParentesis.length+1;
    let operacionEnParentesis;
    let tries=20;
    do {
      if (cantidadOperandosEnParentesis==2) {
        const opciones = {
          nivel: this.nivel,
          // permitirNegativos: this.permitir_negativos,
        };
        if ( this.tiposNumero.includes(TIPO_NUMERO.ENTERO) ) {
          opciones.permitirNegativos = true;
        }
        if ( this.operandos_por_usuario) {
          opciones.operandos = this.operandos.slice(
              this.parentesisInicial, this.parentesisFinal+1 );
        }
        
        if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ) {
          opciones.multiplo10 = true;
        }
        if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
          opciones.multiplo100 = true;
        }
        opciones.tiposNumero = this.tiposNumero;

        if ( this.resultadoNegativo == true && hasAny(this.tiposOperacion, DIVISIONS) ) {
          opciones.resultadoNegativo = true;
        }
        operacionEnParentesis = this.obtenerOperacion(
            tiposOperacionEnParentesis[0],
            opciones
        );
      } else {
        operacionEnParentesis = new OperacionMultiple({
          nivel: this.nivel,
          // permitirNegativos: this.permitir_negativos,
          tiposNumero: this.tiposNumero,
          tiposOperacion: tiposOperacionEnParentesis,
          tiposOperacionAzar: false,
          cantidadOperandos: cantidadOperandosEnParentesis,
          random: this._rng,
        });
        if ( this.operandos_por_usuario) {
          operacionEnParentesis.operandos = this.operandos.slice(
              this.parentesisInicial, this.parentesisFinal+1 );
        }
      }
      tries++;
    } while ( operacionEnParentesis.resultado==0 || tries < 20 );
    // pasar el operandos parentesis a los operadores operacion final:
    operacionEnParentesis.operandos.forEach((operandoPrntss, index) => {
      this.operandos[this.parentesisInicial+index] = operandoPrntss;
    });
    this.operacionEnParentesis = operacionEnParentesis;
  }

  /**
   * Resuelve la operacion entre parentesis dandole el resultado de una division 
   * anterior
   */
  resolverOperacionParentesisResultado() {
    let tipoDivision;
    if (this.tiposOperacion.indexOf(OPERACIONES.DIVISION_ENTERA) != -1) {
      tipoDivision = OPERACIONES.DIVISION_ENTERA;
    }
    if (this.tiposOperacion.indexOf(OPERACIONES.DIVISION) != -1) {
      tipoDivision = OPERACIONES.DIVISION;
    }
    if (this.tiposOperacion.indexOf(OPERACIONES.DIVISION_DECIMAL) != -1) {
      tipoDivision = OPERACIONES.DIVISION_DECIMAL;
    }
    
    const posiciondiv = this.tiposOperacion.indexOf( tipoDivision );
    let resultado;

    // el resultado de la operacion tiene que ser el operando correspondiente de 
    // la division
    // 8 / 2  = 4 => 8 / (4 - 2) => [8, 2 , null]
    // 8 / 2  => ( 10 - 2 ) / 2  => [null, 8, 2]


    // donde esta el parentesis
    if (this.parentesisInicial != 0 ) {
      resultado = this.operandos[this.parentesisInicial];
    } else {
      resultado = this.operandos[this.parentesisFinal];
      if (this.resultadoNegativo) resultado = resultado * -1;
    }
    
    
    const tiposOperacionEnParentesis = [];
    for (let i = this.parentesisInicial; i < this.parentesisFinal; i++) {
      tiposOperacionEnParentesis.push(this.tiposOperacion[i]);
    }
    const cantidadOperandosEnParentesis = tiposOperacionEnParentesis.length+1;
    let operacionEnParentesis;
    let tries=20;
    if (cantidadOperandosEnParentesis==2) {
      const opciones = {
        nivel: this.nivel,
        resultado: resultado,
      };
      if ( this.tiposNumero.includes(TIPO_NUMERO.ENTERO) ) {
        opciones.permitirNegativos = true;
      }

      operacionEnParentesis = this.obtenerOperacion(
          tiposOperacionEnParentesis[0],
          opciones
      );
    } else if (cantidadOperandosEnParentesis > 2) {
      // The binary branch above was the only one implemented. A wider
      // parenthesis left operacionEnParentesis undefined and threw while
      // reading .operandos. Generate the inner exercise the same way the
      // non-division path does, so the outer exercise can still be built.
      operacionEnParentesis = new OperacionMultiple({
        nivel: this.nivel,
        tiposNumero: this.tiposNumero,
        tiposOperacion: tiposOperacionEnParentesis,
        tiposOperacionAzar: false,
        cantidadOperandos: cantidadOperandosEnParentesis,
        permitirNegativos: this.permitirNegativos,
        random: this._rng,
      });
    }

    if (!operacionEnParentesis || !operacionEnParentesis.operandos) {
      return;
    }

    // pasar el operandos parentesis a los operadores operacion final:
    operacionEnParentesis.operandos.forEach((operandoPrntss, index) => {
      this.operandos[this.parentesisInicial+index] = operandoPrntss;
    });
      
    this.operacionEnParentesis = operacionEnParentesis;
  }

  crearDivisiones(operacionesRestantes) {

    const operandos = this.operandosEnviados;
    let tipoDivision;

    while (
      (operacionesRestantes.indexOf(OPERACIONES.DIVISION_ENTERA) != -1) ||
      operacionesRestantes.indexOf(OPERACIONES.DIVISION_DECIMAL) != -1 ||
      operacionesRestantes.indexOf(OPERACIONES.DIVISION) != -1
    ) {

      if (operacionesRestantes.indexOf(OPERACIONES.DIVISION_ENTERA) != -1) {
        tipoDivision = OPERACIONES.DIVISION_ENTERA;
      }
      if (operacionesRestantes.indexOf(OPERACIONES.DIVISION) != -1) {
        tipoDivision = OPERACIONES.DIVISION;
      }
      if (operacionesRestantes.indexOf(OPERACIONES.DIVISION_DECIMAL) != -1) {
        tipoDivision = OPERACIONES.DIVISION_DECIMAL;
      }

      const posicion = operacionesRestantes.lastIndexOf(tipoDivision);
      // si hay varias divisiones enteras juntas generarlas a la vez
      const numOperacionesJuntas = countAdjacent(
          operacionesRestantes, posicion, tipoDivision);

      const cantidadOperandos = numOperacionesJuntas+1;
      const posicionFin = posicion+numOperacionesJuntas;
      const parentesisEnIni = ( this.parentesisFinal == posicion );
      const parentesisEnFin = ( this.parentesisInicial == posicionFin );
      const parentesisCerca = ( parentesisEnIni || parentesisEnFin );

      if ( this.forzarParentesis && parentesisCerca ) {
        if (parentesisEnIni) {
          operandos[0] = this.operacionEnParentesis.resultado;
        } else {
          // numOperacionesJuntas == siempre ultimo operando de la division
           
          operandos[numOperacionesJuntas] = this.operacionEnParentesis.resultado;
        }
      }
      const opciones = {
        nivel: this.nivel,
        cantidadOperandos: cantidadOperandos,
      };

      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ) {
        opciones.multiplo10 = true;
      }
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
        opciones.multiplo100 = true;
      }

      if (operandos != []) {
        opciones.operandos = operandos;
      }
      let newOp;
      switch (tipoDivision) {
        case OPERACIONES.DIVISION:
          newOp = new Division(Object.assign({random: this._rng}, opciones));
          break;
        case OPERACIONES.DIVISION_ENTERA:
          newOp = new DivisionEntera(Object.assign({random: this._rng}, opciones));
          break;
        case OPERACIONES.DIVISION_DECIMAL:
          newOp = new DivisionDecimales(Object.assign({random: this._rng}, opciones));
          break;
      }

      this.operacionesGuardadas.push({
        posicion: posicion,
        tipo: tipoDivision,
        operandos: newOp.operandos,
        operacion: newOp,
      });

      // quitar operando del resutado opreacion enter parenteisis antes de
      // escribirlos y poner el correspondiente de la op parentesis
      if ( this.forzarParentesis && parentesisCerca ) {
        this.volverAOperandoParentesis(newOp.operandos, parentesisEnIni);
      }

      // escribe los operandos generados en su posicion en operados
      this._escribeOperandosOperacionesJuntas(
          operacionesRestantes, numOperacionesJuntas, posicion,
          newOp.operandos );
      this.guardaResultado(newOp, posicion);
    }
  }

  /**
   * Crea las divisiones sin tener en cuenta los parentesis, para usar cuando
   * se necesita crear las diviones antes que los parentesis
   * @param {*} operacionesRestantes 
   */
  crearDivisionesSinParentesis(operacionesRestantes) {

    const operandos = this.operandosEnviados;
    let tipoDivision;

    while ( hasAny(operacionesRestantes, DIVISIONS) ) {
      if (operacionesRestantes.indexOf(OPERACIONES.DIVISION_ENTERA) != -1) {
        tipoDivision = OPERACIONES.DIVISION_ENTERA;
      }
      if (operacionesRestantes.indexOf(OPERACIONES.DIVISION) != -1) {
        tipoDivision = OPERACIONES.DIVISION;
      }
      if (operacionesRestantes.indexOf(OPERACIONES.DIVISION_DECIMAL) != -1) {
        tipoDivision = OPERACIONES.DIVISION_DECIMAL;
      }

      const posicion = operacionesRestantes.lastIndexOf(tipoDivision);
      // si hay varias divisiones enteras juntas generarlas a la vez
      const numOperacionesJuntas = countAdjacent(
          operacionesRestantes, posicion, tipoDivision);

      const cantidadOperandos = numOperacionesJuntas+1;
      const posicionFin = posicion+numOperacionesJuntas;
      const opciones = {
        nivel: this.nivel,
        cantidadOperandos: cantidadOperandos,
      };

      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ) {
        opciones.multiplo10 = true;
      }
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
        opciones.multiplo100 = true;
      }

      if (operandos != []) {
        opciones.operandos = operandos;
      }

      let newOp;
      switch (tipoDivision) {
        case OPERACIONES.DIVISION:
          newOp = new Division(Object.assign({random: this._rng}, opciones));
          break;
        case OPERACIONES.DIVISION_ENTERA:
          newOp = new DivisionEntera(Object.assign({random: this._rng}, opciones));
          break;
        case OPERACIONES.DIVISION_DECIMAL:
          newOp = new DivisionDecimales(Object.assign({random: this._rng}, opciones));
          break;
      }

      this.operacionesGuardadas.push({
        posicion: posicion,
        tipo: tipoDivision,
        operandos: newOp.operandos,
        operacion: newOp,
      });

      // escribe los operandos generados en su posicion en operados
      this._escribeOperandosOperacionesJuntas(
          operacionesRestantes, numOperacionesJuntas, posicion,
          newOp.operandos );
      this.guardaResultado(newOp, posicion);
    }
  }

  crearMultiplicaciones(operacionesRestantes) {
    while ( operacionesRestantes.indexOf(OPERACIONES.MULTIPLICACION) != -1 ) {
      const posicion = operacionesRestantes
          .lastIndexOf(OPERACIONES.MULTIPLICACION);
      // si hay varias divisiones enteras juntas generarlas a la vez
      const numOperacionesJuntas = countAdjacent(
          operacionesRestantes, posicion, OPERACIONES.MULTIPLICACION);
      const cantidadOperandos = numOperacionesJuntas+1;
      

      // si el ultimo operando esta definido viene de otra operacion con mas
      // prioridad y se usa como resultado
      const opcionesMultiplicacion = {
        nivel: this.nivel,
        cantidadOperandos: cantidadOperandos,
        // permitirNegativos: this.permitir_negativos,
        // da resultado positivo pero por que siempre va con una resta
        // resultadoNegativo: this.resultadoNegativo,
        decimales: this.decimales,
        multiplo10: this.multiplo10,
        multiplo100: this.multiplo100,
      };


      if ( this.tiposNumero.includes(TIPO_NUMERO.ENTERO) ) {
        opcionesMultiplicacion.permitirNegativos = true;
      }

      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ) {
        opcionesMultiplicacion.multiplo10 = true;
      }
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
        opcionesMultiplicacion.multiplo100 = true;
      }


      // esto no es necesario para las multiplicaciones 
      // // si ya esta definido el ultimo operando:
      //   // ultimoOperandoDefinido = true;
      // // si ya esta definido el primero operando:
      //   // primerOperandoDefinido = true;

      
      const newOp = new Multiplicacion(Object.assign({random: this._rng}, opcionesMultiplicacion));
      this.operacionesGuardadas.push({
        posicion: posicion,
        operandos: newOp.operandos,
        tipo: OPERACIONES.MULTIPLICACION,
        operacion: newOp,
      });
      // escribe los operandos generados en su posicion en operados
      this._escribeOperandosOperacionesJuntas(
          operacionesRestantes, numOperacionesJuntas, posicion,
          newOp.operandos );
      this.guardaResultado(newOp, posicion);
    }
  }

  /**
   * Crea sumas y restas combinadas para tener en cuenta el resultado
   * las sumas las convierte en restas con el signo cambiado
   * @param {Array.OPERACIONES} operacionesRestantes
   */
  crearSumasRestas(operacionesRestantes) {
    let tries = 0;

    // realizar la resta al final para poder mostrar resultado negativo con
    // numeros positivos
    const operacionesRestantesOriginal = operacionesRestantes.slice();
    const forzarSigno = [1];
    operacionesRestantesOriginal.forEach((element, i) => {
      if (element == OPERACIONES.SUMA ) {
        operacionesRestantes[i] = OPERACIONES.RESTA;
        forzarSigno[i+1] = -1;
      } else {
        forzarSigno[i+1] = 1;
      }
    });

    while (
      hasAny(operacionesRestantes, SUM_SUB) &&
      tries<20
    ) {
      const posicion = operacionesRestantes.indexOf(OPERACIONES.RESTA);

      const restaOperandos = [];
      const tipoOperacion = operacionesRestantes[posicion];
      const numOperacionesJuntas = countAdjacent(
          operacionesRestantes, posicion,
          tipoOperacion // Operacion.Suma/Resta
      );
      const cantidadOperandos = numOperacionesJuntas+1;
      // reducimos forzar signo a solo los operandos correspondientes a esta op
      const forzarSignoResta = forzarSigno.slice(posicion, posicion+cantidadOperandos );

      const anterior = this.obtenerResultadoOpAnteriores(posicion);
      const posterior = this.obtenerResultadoOpPosteriores(
          posicion, numOperacionesJuntas);

      // (0 == false) => true
      // si existe anterior y posterior no
      // const esAnt =( anterior && anterior!=0 ) &&
      //    ( !posterior || posterior==0);
      // si existe posterior y anterior no
      // const esPos =(!anterior || anterior==0 ) &&
      //    ( posterior && posterior!=0);

      const esAnt = anterior;
      const esPos = posterior;

      if ( esAnt ) {
        restaOperandos[0] = anterior;
      }
      if ( esPos ) {
        restaOperandos[numOperacionesJuntas] = posterior;
      }

      const opciones = {
        nivel: this.nivel,
        cantidadOperandos: cantidadOperandos,
        permitirNegativos: this.permitirNegativos,
        tiposNumero: this.tiposNumero,
        forzarSignos: forzarSignoResta,
        decimales: this.decimales,
        enfocado: this.enfocado,
      };

      if (
        this.tiposOperacion.includes(OPERACIONES.SUMA) &&
        this.tiposOperacion.includes(OPERACIONES.MULTIPLICACION) &&
        !this.tiposOperacion.includes(OPERACIONES.RESTA)
      ) {
        opciones.resultadoNegativo = false;
        // cambiar signo a la multiplicaicion si se quier resultado negativo
        if (this.resultadoNegativo)
        // camiba el signo de la multiplicacion :
        {
          this.tiposOperacion.forEach((val, index) => {
            if (val == OPERACIONES.MULTIPLICACION) {
              this.forzarSignos[index] = -1;
            }
          });
        }
      } else {
        opciones.resultadoNegativo = this.resultadoNegativo;
      }

      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ) {
        opciones.multiplo10 = true;
      }
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
        opciones.multiplo100 = true;
      }

      // si la resta no tiene ningun operandos probablemente este entre dos
      //  mul/div y ya se hayan definido lo normal es que haya uno de los dos
      if (restaOperandos.length>0) {
        opciones.operandos = restaOperandos;

        // TODO: revisar si hay mul y divisiones tipo A - B * C - D
        opciones.resultadoNegativo = this.resultadoNegativo;


      } else {
      }

       


      const newOp = new Resta(Object.assign({random: this._rng}, opciones));
      this.operacionesGuardadas.push({
        posicion: posicion,
        tipo: tipoOperacion,
        operandos: newOp.operandos.slice(),
        operacion: newOp,
      });

      // darle la vuelta a las operaciones
      const operandosResultados = newOp.operandos.slice();
      operandosResultados.forEach((operando, i) => {
        operandosResultados[i] = operando * forzarSigno[i];
      });


      // escribeOperandosOperacionesJuntas
      let j = 0;
      const inicio = posicion;
      const fin = posicion+numOperacionesJuntas;

      // esto es lo que deberia hacer escribe operandos
      for (let i = inicio; i <= fin; i++) {
        const posicionOp = i;
        if (this.operandos[posicionOp]===undefined) {
          this.operandos[posicionOp] = operandosResultados[j];
        }
        j++;
      }

      tries++;
    }
  }

  /**
   * crea las sumas en el caso de operaciones con divisiones y suma que me estaban
   * dado porbelmas
   *
   * @param {*} operacionesRestantes Operaciones que quedan por generar
   * @memberof OperacionMultiple
   */
  crearSumasParaDivisionSuma(operacionesRestantes) {
    let tries = 0;
    const operacionesRestantesOriginal = operacionesRestantes.slice();
    const forzarSigno = [];
    operacionesRestantesOriginal.forEach((element, i) => {
      if (element == OPERACIONES.SUMA ) {
        if ( i == 0 ) forzarSigno[0]=-1;
        if ( i == 1 ) forzarSigno[2]=-1;
      }
    });

    while (
      hasAny(operacionesRestantes, SUM_SUB) &&
      tries<20
    ) {
      const posicion = operacionesRestantes.indexOf(OPERACIONES.SUMA);
      const operandosOperacionSuma = [];
      const tipoOperacion = operacionesRestantes[posicion];
      const numOperacionesJuntas = countAdjacent(
          operacionesRestantes, posicion,
          tipoOperacion
      );
      const cantidadOperandos = numOperacionesJuntas+1;
      const forzarSignoOperacion = forzarSigno.slice(posicion, posicion+cantidadOperandos );
      const anterior = this.obtenerResultadoOpAnteriores(posicion);
      const posterior = this.obtenerResultadoOpPosteriores(
          posicion, numOperacionesJuntas);

      const esAnt = anterior;
      const esPos = posterior;
      if ( esAnt ) {
        operandosOperacionSuma[0] = anterior;
      }
      if ( esPos ) {
        operandosOperacionSuma[numOperacionesJuntas] = posterior;
      }

      const opciones = {
        nivel: this.nivel,
        cantidadOperandos: cantidadOperandos,
        permitirNegativos: this.permitirNegativos,
        tiposNumero: this.tiposNumero,
        forzarSignos: forzarSignoOperacion,
        decimales: this.decimales,
        enfocado: this.enfocado,
      };
      opciones.resultadoNegativo = this.resultadoNegativo;
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ) {
        opciones.multiplo10 = true;
      }
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
        opciones.multiplo100 = true;
      }

      if (operandosOperacionSuma.length>0) {
        opciones.operandos = operandosOperacionSuma;
        opciones.resultadoNegativo = this.resultadoNegativo;
      }

      const newOp = new Suma(Object.assign({random: this._rng}, opciones));
      this.operacionesGuardadas.push({
        posicion: posicion,
        tipo: tipoOperacion,
        operandos: newOp.operandos.slice(),
        operacion: newOp,
      });
      const operandosResultados = newOp.operandos.slice();
      operandosResultados.forEach((operando, i) => {
        if (forzarSigno[i]) {
          operandosResultados[i] = operando * forzarSigno[i];
        }
      });

      // escribeOperandosOperacionesJuntas
      let j = 0;
      const inicio = posicion;
      const fin = posicion+numOperacionesJuntas;

      // esto es lo que deberia hacer escribe operandos
      for (let i = inicio; i <= fin; i++) {
        const posicionOp = i;
        if (this.operandos[posicionOp]===undefined) {
          this.operandos[posicionOp] = operandosResultados[j];
        }
        j++;
      }
      tries++;
    }
  }

  /**
   * Crear Sumas para caso de operacion multile con Multiplicacion y Suma
   * @param [Operaciones] operacionesRestantes 
   */
  crearSumasParaMultiplicacionSuma(operacionesRestantes) {
    let tries = 0;
    const operacionesRestantesOriginal = operacionesRestantes.slice();
    const forzarSigno = [];

    // A previous draft negated the first operand of a sum that sits next to
    // a multiplication. That flip belongs only to subtractions; leaving it
    // here made sums negative. The block is gone. forzarSigno stays empty
    // unless a caller fills it.

    const operandosIniciales = this.operandos.slice();

    while (
      hasAny(operacionesRestantes, SUM_SUB) &&
      tries<20
    ) {
      const posicion = operacionesRestantes.indexOf(OPERACIONES.SUMA);
      const operandosOperacionSuma = [];
      const tipoOperacion = operacionesRestantes[posicion];
      const numOperacionesJuntas = countAdjacent(
          operacionesRestantes, posicion,
          tipoOperacion
      );
      const cantidadOperandos = numOperacionesJuntas+1;
      const forzarSignoOperacion = forzarSigno.slice(posicion, posicion+cantidadOperandos );
      const anterior = this.obtenerResultadoOpAnteriores(posicion);
      const posterior = this.obtenerResultadoOpPosteriores(
          posicion, numOperacionesJuntas);

      const esAnt = anterior;
      const esPos = posterior;
      if ( esAnt ) {
        operandosOperacionSuma[0] = anterior;
      }
      if ( esPos ) {
        operandosOperacionSuma[numOperacionesJuntas] = posterior;
      }

      const opciones = {
        nivel: this.nivel,
        cantidadOperandos: cantidadOperandos,
        permitirNegativos: this.permitirNegativos,
        tiposNumero: this.tiposNumero,
        forzarSignos: forzarSignoOperacion,
        decimales: this.decimales,
        enfocado: this.enfocado,
      };
      opciones.resultadoNegativo = this.resultadoNegativo;
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ) {
        opciones.multiplo10 = true;
      }
      if ( this.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
        opciones.multiplo100 = true;
      }

      if (operandosOperacionSuma.length>0) {
        opciones.operandos = operandosOperacionSuma;
        opciones.resultadoNegativo = this.resultadoNegativo;
      }

      const newOp = new Suma(Object.assign({random: this._rng}, opciones));
      this.operacionesGuardadas.push({
        posicion: posicion,
        tipo: tipoOperacion,
        operandos: newOp.operandos.slice(),
        operacion: newOp,
      });
      let operandosResultados = newOp.operandos.slice();
      operandosResultados.forEach((operando, i) => {
        if (forzarSigno[i]) {
          operandosResultados[i] = operando * forzarSigno[i];
        }
      });

      // escribeOperandosOperacionesJuntas
      let j = 0;
      const inicio = posicion;
      const fin = posicion+numOperacionesJuntas;

      // esto es lo que deberia hacer escribe operandos
      
      for (let i = inicio; i <= fin; i++) {        
        const posicionOp = i;
        if ( operandosIniciales[posicionOp]===undefined ) {
          this.operandos[posicionOp] = operandosResultados[j];
        }
        j++;
        // Borra de operaciones restantes
        operacionesRestantes[i] = null;
      }
      tries++;
    }
  }

  volverAOperandoParentesis(operandos, parentesisEnIni) {

    const parestesisOperandos = this.operacionEnParentesis.operandos;
    if ( parentesisEnIni ) {
      const parentesisUltimoOp = parestesisOperandos.length-1;
      operandos[0] = parestesisOperandos[parentesisUltimoOp];
    } else { // parentesis en posicion final
      operandos[operandos.length] = parestesisOperandos[0];
    }
  }

  /**
   * Cambia un operando de division o multiplicacion a el signo contrario
   * para forzar resultado negativo o positivo
   */
  cambiarSignoAMulDivSiResultado() {
    const operandos =this.operandos.slice();
    const operaciones = this.tiposOperacion.slice();

    let mudivsigno = 1;
    const operandosMulDiv = [];
    operandos.forEach((op, i) => {
      if (op!== undefined && op!=null ) {
        if (operaciones[i-1] && hasAny([operaciones[i-1]], MUL_DIV) ) {
          operandosMulDiv.push(i);
        }
      }
    });
    operandosMulDiv.forEach((i) => {
      const op = this.operandos[i];
      if (op>=0) mudivsigno *= 1;
      else mudivsigno *= -1;
    });
    let rand;
    let cambiado = false;

    // Cambia un operando de signo para forzar a que el resultado sea negativo
    if ( mudivsigno > 0 && this.resultadoNegativo ) {
      rand = operandosMulDiv[
          this.getRandomMinMax(0, operandosMulDiv.length-1)
      ];
      this.operandos[rand] = this.operandos[rand] * -1;
      cambiado = rand;

      this.errors.push({
        error: 'Se cambio el signo',
        msg: 'Se cambio el signo del operando ' + rand});
    }
    
  }

  /**
   * Cambia el signo a los operandos cuando se quiere que el resultado
   * sea positivo y los operandos negativos y solo hay 
   * multiplicaicones y diviisones en la operacion multiple
   * 
   */
  cambiarSignoDosOperandos() {

    const operandos = this.operandos.slice();
    // cambia 2 operandos de signo para forzar resultado positivo con numeros
    // negativos


    // The only caller already checks ENTERO and resultadoNegativo == false.
    const rand = this.getRandomMinMax(1, operandos.length-1);

    // el primero operando negativo y otro al azar negativo
    operandos[0] = Math.abs(operandos[0]) * -1;
    operandos[rand] = Math.abs(operandos[rand]) * -1;

    this.operandos = operandos;
  }

  comprobarErrorTiposOperacion() {
    // error si no se puede dar este tipo de operacion:
    if ( !this.tiposNumero.includes(TIPO_NUMERO.ENTERO) &&
        this.resultadoNegativo ) {
      if ( !this.tiposOperacion.includes(OPERACIONES.RESTA) ) {
        const error = {
          'error': 'Resultado negativo con numeros naturales sin restas',
          'msg': 'no puede darse este resultado',
        };
        // no se puede realizar esta operacion
        this.errors.push(error);

        // muestra el error en lugar de cambiar las opciones
        this.resultadoNegativo = false;
      }
    }
  }

   
  crearRestas(operacionesRestantes) {
    let tries = 0;
    while ( operacionesRestantes.indexOf(OPERACIONES.RESTA) != -1 && tries<5 ) {
      const posicion = operacionesRestantes.indexOf(OPERACIONES.RESTA);
      let restaOperandos = [];
      const numOperacionesJuntas = countAdjacent(
          operacionesRestantes, posicion, OPERACIONES.RESTA);

      const anterior = this.obtenerResultadoOpAnteriores(posicion);
      const posterior = this.obtenerResultadoOpPosteriores(
          posicion, numOperacionesJuntas);

      if ( ( anterior && anterior!=0 ) &&
          ( !posterior || posterior==0) ) {
        restaOperandos[0] = anterior;
      }
      if ( ( !anterior || anterior==0 ) &&
          ( posterior && posterior!=0) ) {
        restaOperandos[numOperacionesJuntas] = posterior;
      }

      let newOp;
      // si la resta no tiene ningun operandos probablemente este entre dos mul/div
      // y ya se hayan definido
      // lo normal es que haya uno de los dos
      if (restaOperandos.length>0) {
        const opciones = {
          nivel: this.nivel,
          cantidadOperandos: numOperacionesJuntas+1,
          permitirNegativos: this.permitir_negativos,
          resultadoNegativo: this.resultadoNegativo,
          operandos: restaOperandos.slice(),
          decimales: this.decimales,
        };
        newOp = new Resta(Object.assign({random: this._rng}, opciones));
        restaOperandos = newOp.operandos.slice();
        this.operacionesGuardadas.push({
          posicion: posicion,
          tipo: OPERACIONES.RESTA,
          operandos: newOp.operandos.slice(),
          operacion: newOp,
        });
      }

      this._escribeOperandosOperacionesJuntasHaciaDelante(
          operacionesRestantes, numOperacionesJuntas, posicion,
          restaOperandos );
      tries++;
    }
  }

  getTipo() {
    return this.constructor.name;
  }


}

export default OperacionMultiple;
