import OPERACIONES from './operaciones/operaciones';
import {TIPO_NUMERO} from './operaciones/tipoNumero';
import $ from 'jquery';
/**
 *  Aqui definimos las opciones predeterminadas que se cargan en la web
 *  @author Fernando Ramirez Perez <fernando.ramirez@altia.es>
 *  @version 1.0.0-rc1
 *  @class DEFAULTS
 */

/* eslint-disable max-len */
export const DEFAULTS = {
  version: '1.2.0',
  // DEV
  // baseurl: 'http://omvs0006.medusa.gobiernodecanarias.net/aritmates/',
  // PRE
  baseurl: 'https://www3-pre.gobiernodecanarias.org/medusa/apps/aritmates/',
  nivel: 10,
  cuentaAtras: 0, // '10:00',
  // 0 = sin cronometro,'0:30', valores validos:
  //    '1:00', '2:00', '3:00', '4:00', '5:00', '10:00', '20:00', '30:00'
  cantidadOperaciones: 10, // 0 = sin limite
  cantidadOperandos: 2,
  posicionIncognitaAlAzar: false,
  resultadoNegativo: false,
  maximoPrimo: 4999, // al factorizar se para si llega a este numero
  maximoOperandos: 3,
  recargarOperacionesInfinitas: 3, // cada cuantas operaciones carga mas operaciones
  reCalcTries: 500, // numero de veces que se intenta calcular una operacion nueva
  tiposOperaciones: [
    OPERACIONES.SUMA,
    OPERACIONES.RESTA,
    OPERACIONES.MULTIPLICACION,
    OPERACIONES.DIVISION,
    // OPERACIONES.DIVISION_RESTO,
  ], // ver OPERACIONES
  tiposNumero: [
    TIPO_NUMERO.NATURAL,
    // TIPO_NUMERO.ENTERO,
    // TIPO_NUMERO.DECIMAL,
    // TIPO_NUMERO.MULTIPLO10,
    // TIPO_NUMERO.MULTIPLO100,
  ], //  ver TIPO_NUMERO

};


export const ENABLE = {
  parentesis: false,
  resultadoIgualA: false,
  enfocado: true,
};


/* load from config.json */
let config;
$.ajax({
  url: './config.json',
  dataType: 'json',
  async: false,
  success: function(data) {
    console.log( 'config cargado success: ', data );
    config = data;
    console.log( 'config cargado en "config": ', config );

    if ( config.nivel ) DEFAULTS.nivel = config.nivel;
    if ( config.cuentaAtras ) DEFAULTS.cuentaAtras = config.cuentaAtras;
    if ( config.cantidadOperaciones ) DEFAULTS.cantidadOperaciones = config.cantidadOperaciones;
    if ( config.cantidadOperandos ) DEFAULTS.cantidadOperandos = config.cantidadOperandos;
    if ( config.posicionIncognitaAlAzar ) DEFAULTS.posicionIncognitaAlAzar = config.posicionIncognitaAlAzar;
    if ( config.resultadoNegativo ) DEFAULTS.resultadoNegativo = config.resultadoNegativo;
    if ( config.maximoPrimo ) DEFAULTS.maximoPrimo = config.maximoPrimo;
    if ( config.maximoOperandos ) DEFAULTS.maximoOperandos = config.maximoOperandos;
    if ( config.recargarOperacionesInfinitas ) DEFAULTS.recargarOperacionesInfinitas = config.recargarOperacionesInfinitas;
    if ( config.reCalcTries ) DEFAULTS.reCalcTries = config.reCalcTries;
    if ( config.tiposOperaciones ) DEFAULTS.tiposOperaciones = config.tiposOperaciones;
    if ( config.tiposNumero ) DEFAULTS.tiposNumero = config.tiposNumero;

    if ( config.baseurl ) DEFAULTS.baseurl = config.baseurl;
    if ( config.version ) DEFAULTS.baseurl = config.version;

    console.log( 'Nivel cargado: ', DEFAULTS.nivel );
  },
});
console.log( 'config fuera de ajax cargado: ', config );

console.log( 'DEFAULTS: ', DEFAULTS );
console.log( 'ENABLED: ', ENABLE );

