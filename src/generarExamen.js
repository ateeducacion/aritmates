
import OPERACIONES from './operaciones/operaciones';

import Suma from './operaciones/suma';
import Resta from './operaciones/resta';
import Multiplicacion from './operaciones/multiplicacion';
import DivisionEntera from './operaciones/divisionEntera';
import DivisionResto from './operaciones/divisionResto';
import DivisionDecimales from './operaciones/divisionDecimales';
import Division from './operaciones/division';
import OperacionMultiple from './operaciones/OperacionMultiple';
import {TIPO_NUMERO} from './operaciones/tipoNumero';
import {DEFAULTS} from './defaultOptions';
import utils, {shuffle} from './utils';
/**
 * Gererar examen crea un objeto con varias operaciones que son cargadas en la 
 * web
 * 
 * @author Fernando Ramirez Perez <fernando.ramirez@altia.es>
 * @version 1.0.0-rc1
 * @export
 * @class GenerarExamen
 */
export default class GenerarExamen {
  constructor(
      {
        cantidadOperaciones,
        tiposOperaciones,
        cantidadOperandos=2,

        posicionIncognitaAlAzar=false,

        nivel=10,
        permitirNegativos=false,

        enfocado=false,
        curso=1,
        multiplo10=false,
        multiplo100=false,

        complementario=false,
        posicionIncognita,
        posicionNivel,

        tiposNumero = [TIPO_NUMERO.NATURAL],
        decimales = false,
        decimalesMaximo,
        operacionMultiple= false,
        parentesis = false,
        resultadoNegativo,

      } = {}) {
    // const debug = true;
    const tag = '[GenerarExamen] ';
    const txtTiposNumero = TIPO_NUMERO.tiposNumeroToText(tiposNumero);
    if ( debug ) {
      console.log( tag,
          'Llamado con: \n\t',
          'cantidadOperaciones', cantidadOperaciones, '\n\t',
          'tiposOperaciones', tiposOperaciones, '\n\t',
          'cantidadOperandos', cantidadOperandos, '\n\t',
          'posicionIncognitaAlAzar', posicionIncognitaAlAzar, '\n\t',
          'nivel', nivel, '\n\t',
          'permitirNegativos', permitirNegativos, '\n\t',
          'enfocado', enfocado, '\n\t',
          'curso', curso, '\n\t',
          'multiplo10', multiplo10, '\n\t',
          'multiplo100', multiplo100, '\n\t',
          'complementario', complementario, '\n\t',
          'posicionIncognita', posicionIncognita, '\n\t',
          'posicionNivel', posicionNivel, '\n\t',
          'tiposNumero', tiposNumero, '\n\t',
          'tiposNumero', txtTiposNumero, '\n\t',
          'decimales', decimales, '\n\t',
          'decimalesMaximo', decimalesMaximo, '\n\t',
          'operacionMultiple', operacionMultiple, '\n\t',
          'parentesis', parentesis, '\n\t',
          'resultadoNegativo', resultadoNegativo, '\n\t'
      );
    }
    // eslint-disable-next-line prefer-rest-params
    if ( debug ) console.log( tag, arguments, arguments[0] );
    this.operacionesExamen = [];
    this.cantidad= cantidadOperaciones;
    this.nivel=nivel;
    this.cantidad_operandos= cantidadOperandos;
    this.posicion_incognita_al_azar= posicionIncognitaAlAzar;
    this.tipos_operaciones= tiposOperaciones;
    if (this.tipos_operaciones == null ) this.tipos_operaciones = [];
    this.permitirNegativos = permitirNegativos;
    this.enfocado = enfocado;
    this.tiposNumeroInicial = tiposNumero;

    if ( this.posicion_incognita_al_azar ) {
      posicionIncognita = 'r';
    } else {
      posicionIncognita = cantidadOperandos + 1;
    }

    if ( permitirNegativos === undefined ) {
      permitirNegativos = false;
    }

    if ( tiposNumero.indexOf(TIPO_NUMERO.ENTERO) != -1 ) {
      permitirNegativos = true;
    }
    if ( debug ) {
      console.log( tag,
          tiposNumero,
          TIPO_NUMERO.DECIMAL,
          'tipo numero decimal:', tiposNumero.indexOf(TIPO_NUMERO.DECIMAL) );
    }
    if ( tiposNumero.indexOf(TIPO_NUMERO.DECIMAL) != -1 ) {
      decimales = true;
    } else {
      decimales = false;
    }
    if ( tiposNumero.indexOf(TIPO_NUMERO.MULTIPLO10) != -1 ) {
      multiplo10 = true;
    }
    if ( tiposNumero.indexOf(TIPO_NUMERO.MULTIPLO100) != -1 ) {
      multiplo100 = true;
    }

    this.errors = [];

    // if (!posicionNivel) this.posicionNivel = 1;
    // else this.posicionNivel = this.posicionNivel;
    // console.log('---', tiposNumero, resultadoNegativo);
    if ( tiposNumero.indexOf(TIPO_NUMERO.NATURAL) !== -1 &&
        resultadoNegativo ) {
      // console.log('----', this.tipos_operaciones);
      if (
        this.tipos_operaciones.indexOf(OPERACIONES.RESTA) == -1 &&
        tiposNumero.indexOf(TIPO_NUMERO.ENTERO) == -1
      ) {
        const error = {
          'error': 'Resultado negativo con numeros naturales sin restas',
          'msg': 'no puede darse este resultado',
        };
        console.log('guardando error', error);
        // no se puede realizar esta operacion
        this.errors.push(error);

        // Muestra el error
        return;
        // resultadoNegativo = false;
      }
    }

    const opciones = {
      nivel: this.nivel,
      cantidadOperandos: this.cantidad_operandos,
      cantidad_operandos: this.cantidad_operandos,
      incognita: posicionIncognita,
      posicion_incognita: posicionIncognita,
      tiposOperaciones: this.tipos_operaciones,
      permitirNegativos: permitirNegativos,
      enfocado: this.enfocado,
      // posicionNivel: this.posicionNivel,
      multiplo10: multiplo10,
      multiplo100: multiplo100,
      complementario: complementario,
      decimales: decimales,
      decimalesMaximo: decimalesMaximo,
      parentesis: parentesis,
      tiposNumero: tiposNumero,
      resultadoNegativo: resultadoNegativo,
    };

    this.resultadoNegativo = resultadoNegativo;

    if ( debug ) console.log( tag, 'opciones:', opciones );
    if (!tiposOperaciones) tiposOperaciones=[];

    this.nombreOperaciones = [
      OPERACIONES.SUMA,
      OPERACIONES.RESTA,
      OPERACIONES.MULTIPLICACION,
      OPERACIONES.DIVISION_RESTO,
      OPERACIONES.DIVISION_DECIMAL,
      OPERACIONES.DIVISION_ENTERA];
    this.cantidadPorTipo = [];

    const tiposNumeroTxt = function() {
      const tipos = [];
      tiposNumero.forEach((val, i) =>{
        tipos.push( TIPO_NUMERO.getKey(val) );
      });
      return tipos;
    };
    // clone object with assing to remove references
    const opcionesCopy = Object.assign({}, opciones);
    this.info = Object.assign({}, opciones);
    this.info.tiposNumero = tiposNumeroTxt();

    this.operacionesInfinitas = false;
    if (cantidadOperaciones == 0 ) {
      this.operacionesInfinitas = true;
      cantidadOperaciones = DEFAULTS.recargarOperacionesInfinitas || 3;
      this.cantidadOperaciones = cantidadOperaciones;
      this.operacionMultiple = operacionMultiple;
      this.opciones = opcionesCopy;
      this.tiposOperaciones = tiposOperaciones;
    }

    if ( !operacionMultiple ) {
      this._crearOperacionesSimples(tiposOperaciones, cantidadOperaciones,
          opcionesCopy);
    } else {
      this._crearOperacionesMultiples(tiposOperaciones, cantidadOperaciones,
          opcionesCopy);
    }
  }

  _crearOperacionesSimples(tiposOperaciones, cantidadOperaciones, opciones) {
    const tag = '[GenerarExamen._crearOperacionesSimples]';
    if ( debug ) console.log( tag );
    let nombre;

    if (tiposOperaciones.length>1) {
      for (let index = 0; index < cantidadOperaciones; index++) {
        // primero crear uno de cada operación
        if ( index < tiposOperaciones.length ) {
          nombre = tiposOperaciones[index];
        } else {
          // luego crear el resto random
          const randomOp = Math.floor(Math.random()*tiposOperaciones.length);
          nombre = tiposOperaciones[randomOp];
        }
        this._addOperacionesPorTipo(nombre);

        // crear hasta que sea correcta
        let opRand;
        let i=0;
        do {
          const opcionesCopy = Object.assign({}, opciones);
          opRand = this.crearOperacionPorNombre(nombre, opcionesCopy);
          i++;
        } while (opRand.resultado == false && DEFAULTS.reCalcTries>i );
        this.operacionesExamen.push( opRand );
      }
      // desordenar array
      this.operacionesExamen = shuffle(this.operacionesExamen);
    } else {
      if ( this.tipos_operaciones.length == 0 ) {
        this.tipos_operaciones[0]='suma';
      }
      // console.log( tag, 'tipos operaciones', this.tipos_operaciones );

      for (let index = 0; index < cantidadOperaciones; index++) {
        nombre = this.tipos_operaciones[0];
        this._addOperacionesPorTipo(nombre);
        const opcionesCopy = Object.assign({}, opciones);
        const op = this.crearOperacionPorNombre(nombre, opcionesCopy);
        this.operacionesExamen.push( op );
      }
    }

    // TODO: comprobar que existe una de cada
  }

  _addOperacionesPorTipo(nombre) {
    const tag = '[GenerarExamen._addOperacionesPorTipo] ';
    if ( debug ) console.log( tag, nombre );
    const tipo = this.nombreOperaciones.indexOf(nombre);

    if ( this.cantidadPorTipo[tipo] === undefined ) {
      this.cantidadPorTipo[tipo] = 1;
    } else {
      this.cantidadPorTipo[tipo] += 1;
    }
  }

  crearOperacionPorNombre(nombre, opciones={}) {
    const tag = '[crearOperacionPorNombre] ';
    if ( debug ) {
      console.log( tag, nombre, opciones );
      console.log( tag,
          'decimales', opciones.decimales );
    }

    if ( opciones.tiposNumero.indexOf(TIPO_NUMERO.DECIMAL) != -1 ) {
      opciones.decimales=true;
    } else {
      opciones.decimales=false;
    }
    if (opciones.tiposNumero.indexOf(TIPO_NUMERO.MULTIPLO10) != -1 ) {
      opciones.multiplo10=true;
    }
    if (opciones.tiposNumero.indexOf(TIPO_NUMERO.MULTIPLO100) != -1) {
      opciones.multiplo100=true;
    }
    if (opciones.tiposNumero.indexOf(TIPO_NUMERO.ENTERO) != -1) {
      opciones.permitirNegativos=true;
    }
    let operacion;
    if ( debug ) console.log(nombre);
    // const tipo = this.TIPO_OPERACION();
    switch (nombre) {
      case 'suma':
      case OPERACIONES.SUMA:
        operacion = new Suma(opciones);
        break;
      case 'resta':
      case OPERACIONES.RESTA:
        operacion = new Resta(opciones);
        break;
      case 'multiplicacion':
      case OPERACIONES.MULTIPLICACION:
        operacion = new Multiplicacion(opciones);
        break;
      case OPERACIONES.DIVISION:
        operacion = new Division(opciones);
        break;
      case 'division_entera':
      case OPERACIONES.DIVISION_ENTERA:
        operacion = new DivisionEntera(opciones);
        break;
      case 'division_resto':
      case OPERACIONES.DIVISION_RESTO:
        operacion = new DivisionResto(opciones);
        break;
      case 'division_decimales':
      case OPERACIONES.DIVISION_DECIMAL:
        operacion = new DivisionDecimales(opciones);
        break;

      default:
        break;
    }
    return operacion;
  }

  toString(equal=true, verbose = false) {
    // console.log( 'tostring', equal, verbose );
    let txt = 'Ejercicios de Matemáticas\n';
    txt += 'Nivel: ' + this.nivel + ' \n';
    txt += this.cantidad + ' ejercicios, ';
    txt += this.cantidad_operandos + ' operandos, \n';
    // solo si hay mas de una operacion:
    if ( this.tipos_operaciones.length > 1 ) {
      txt += this.tipos_operaciones.slice(0, -1).join(', ') +' y ' +
        this.tipos_operaciones[this.tipos_operaciones.length-1] + '.';
    } else {
      if (this.tipos_operaciones.length == 1) {
        txt += this.tipos_operaciones[0] + '.';
      }
    }


    txt += '\ntipos numero: \n';
    txt += TIPO_NUMERO.tiposNumeroToText(this.tiposNumeroInicial);
    if (this.resultadoNegativo) {
      txt += '\nresulatdo negativo, <br>';
    }

    txt += '\nEnfocado: ';
    txt += this.enfocado? 'si':'no';
    txt += '\n';
    txt += '\nIncognita: ';
    txt += this.incognita;
    txt += 'al azar?' + this.posicionIncognitaAlAzar;
    

    // const nombrePluralOperaciones = this.TIPO_OPERACION().map(function(x){
    //  return x.plural; }) ;
    // txt += nombrePluralOperaciones.slice(0,-1).join(', ') +' y ';
    // txt += nombrePluralOperaciones[nombrePluralOperaciones.length-1] + '.' ;
    txt += '\n\n';

    this.operacionesExamen.forEach((op) => {
      // debug = true;
      txt += '['+op.id + '] '+ op.toString( equal, verbose ) + '\n';
      // debug = false;
    });
    return txt;
  }

  toPrint( ) {
    // imprime las soluciones
    // console.log( 'tostring', equal, verbose );
    let txt ='';
    // txt += '<h2>Ejercicios de Matemáticas</h2>';
    txt += '<div class="solucionesEjercicio" >';
    txt += '<p>Nivel: ' + this.nivel + ' <br>';
    txt += this.cantidad + ' ejercicios, ';
    txt += this.cantidad_operandos + ' operandos, <br>';

    if ( this.tipos_operaciones.length > 1 ) {
      txt += this.tipos_operaciones.slice(0, -1).join(', ') +' y ' +
        this.tipos_operaciones[this.tipos_operaciones.length-1] + '.';
    } else {
      if (this.tipos_operaciones.length == 1) {
        txt += this.tipos_operaciones[0] + '.';
      }
    }

    txt += '<br>tipos numero: <br>';
    // txt += this.tiposNumeroInicial;
    // txt += '<br>';
    txt += TIPO_NUMERO.tiposNumeroToText(this.tiposNumeroInicial);
    if (this.resultadoNegativo) {
      txt += '<br>Resultado negativo<br>';
    } else {
      txt += '<br>Resultado positivo<br>';
    }
    txt += '<br></p>';

    txt += '<p>Enfocado: ';
    txt += this.enfocado? 'si':'no';
    txt += '</p>';
    txt += '<p>Incognita al azar? ';
    txt += this.posicion_incognita_al_azar? 'si':'no';
    txt += '</p>';

    const data = [];
    this.operacionesExamen.forEach((oe) => {
      const opSolve = oe.toString(true, true);
      data.push( opSolve );
    });
    // txt += utils.organizeInLines( data, 'opSolucion' );
    // txt += utils.organizeSimpleNum( data, 'opSolucion' );
    txt += utils.organizeInTables( data, 2, 'tableSolucion', 'opSolucion', 34, 50 );

    txt += '</div>';
    return txt;
  }

  toHtml() {
    let html='';

    this.operacionesExamen.forEach((op) => {
      html += op.toHtml() + '\n';
    });

    return html;
  }

  toHtmlSolved() {
    let html='';

    this.operacionesExamen.forEach((op) => {
      html += op.toHtmlSolved() + '\n';
    });

    return html;
  }

  mostrarErrores() {
    let txt= '';
    const erroresExamen = [];
    // console.log('operaciones examen:', this.operacionesExamen);
    // console.log('miserrores:', this.errors);

    this.operacionesExamen.forEach((element, index) => {
      // console.log('error:', element.errors );
      if ( element.errors.length>0 ) {
        // console.log( 'errores en ', index );
        erroresExamen.push({
          'posicion': index,
          'id': element.id,
          'operacion': element.toString(),
          'errors': element.errors,
        });
      }
    });
    if (this.errors.length > 0 || erroresExamen.length > 0 ) {
      txt = 'Errores:\n';
    } else {
      return '';
    }

    this.errors.forEach((e) => {
      txt += e.error+': ' + '\n';
      txt += e.msg+'. \n';
      this.operacionesExamen.forEach((e, i) => {
        txt += 'Afecta a : ' + e.toString() +', ';
      });
      txt += '\n';
    });

    erroresExamen.forEach( (eo) => {
      // console.log('recorriendo errores examen', eo.errors );
      // txt += '\n' + 'posicion: ' + eo.posicion;
      txt += eo.id + ' ' + eo.operacion + '\n';
      eo.errors.forEach( (error) => {
        txt += '\t * ' + error.error+': ';
        txt += '\n\t   ' + error.msg+'. \n';
      });
    });

    return txt;
  }

  mostrarErroresHtml() {
    const txt = this.mostrarErrores();
    return '<pre>'+txt+'</pre>';
  }

  _crearOperacionesMultiples(tiposOperaciones, cantidadOperaciones, opciones) {
    const tag = '[generarExamen.js._crearOperacionesMultiples('+
        'tiposOperaciones, cantidadOperaciones, opciones) {]';
    if ( debug ) console.log( tag );
    if ( debug ) console.log( tag, tiposOperaciones, cantidadOperaciones, opciones );
    let opRand;
    let i=0;

    // crea operaciones multiples (1 * 2 + 3)
    if (tiposOperaciones.length>1) {
      for (let index = 0; index < cantidadOperaciones; index++) {
        // crear hasta que sea correcta
        do {
          const opcionesCopy = Object.assign({}, opciones);
          opcionesCopy.tiposOperacion = tiposOperaciones;
          opRand = new OperacionMultiple( opcionesCopy );
          i++;
          // console.log('operandos', opRand.operandos, 
          //     'operandos has undefined', this.hasUndefined(opRand.operandos),
          //     'operandos has NaN', this.hasNaN(opRand.operandos)
          // );
        } while (
          (
            opRand.resultado == false ||
            this.hasUndefined(opRand.operandos) ||
            this.hasNaN(opRand.operandos) ||
            opRand.resultado == Infinity ||
            opRand.resultado == -Infinity ||
            opRand.obtenerNumeroDecimales( opRand.resultado ) > 3 ||
            opRand.obtenerNumeroDecimales( opRand.operandos[0] ) > 3 ||
            opRand.obtenerNumeroDecimales( opRand.operandos[1] ) > 3 ||
            opRand.obtenerNumeroDecimales( opRand.operandos[2] ) > 3 ||
            ( !opRand.tiposNumero.includes(TIPO_NUMERO.DECIMAL) && opRand.obtenerNumeroDecimales(opRand.resultado)>0 )
          ) &&
          DEFAULTS.reCalcTries > i
        );

        this.operacionesExamen.push( opRand );
      }
    } else {
      // estas no son multiples!
      if ( this.tipos_operaciones.length == 0 ) {
        this.tipos_operaciones[0]='suma';
      }

      for (let index = 0; index < cantidadOperaciones; index++) {
        // crear hasta que sea correcta
        let op;
        do {
          const opcionesCopy = Object.assign({}, opciones);
          opcionesCopy.tiposOperacion = tiposOperaciones;
          const nombre = this.tipos_operaciones[0];
          op = this.crearOperacionPorNombre(nombre, opcionesCopy);
          i++;
        } while (
          ( op.resultado == false || this.hasUndefined(op.operandos) || this.hasNaN(op.operandos) ) &&
          DEFAULTS.reCalcTries > i
        );
        this.operacionesExamen.push( op );
      }
    }
  }

  /**
   * Para examenes con operaciones infinitas
   * @param {*} tiposOperaciones
   * @param {*} opciones
   */
  crearMasOperaciones() {
    // const debug = true;
    const tag = '[generarExamen.js.crearMasOperaciones]';
    if ( debug ) console.log( tag );
    const opciones = Object.assign({}, this.opciones);
    const tiposOperaciones = this.tiposOperaciones;
    const cantidad = this.cantidadOperaciones;

    if ( debug ) {
      console.log( tag,
          'se van a crear '+ cantidad +' operaciones' );
    }


    if ( !this.operacionMultiple ) {
      this._crearOperacionesSimples(tiposOperaciones, cantidad, opciones);
    } else {
      this._crearOperacionesMultiples(tiposOperaciones, cantidad, opciones);
    }
  }


  hasUndefined( array ) {
    let undf = false;
    for (let index = 0; index < 3; index++) {
      if ( 'undefined' === typeof array[index] ) {
        undf = true;
      }
    }
    return undf;
    // return array.some((val) => {
    //   return (undefined === val);
    // } );
  }

  hasNaN( array ) {
    let nan = false;
    for (let index = 0; index < 3; index++) {
      if ( isNaN(array[index]) ) {
        nan = true;
      }
    }
    return nan;
  }
}

