import OPERACIONES from './operaciones/operaciones';
import {TIPO_NUMERO} from './operaciones/tipoNumero';
/**
 *  Aqui definimos las opciones predeterminadas que se cargan en la web
 *  @author Fernando Ramirez Perez <fernando.ramirez@altia.es>
 *  @author Área de Tecnología Educativa <ate.educacion@gobiernodecanarias.org> (versión simplificada 1.3+)
 *  @version 1.0.0-rc1
 *  @class DEFAULTS
 */

 
export const DEFAULTS = {
  version: '1.3.0',
  // URL pública de la app (sobrescribible con config.json → baseurl)
  baseurl: './',
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


const CONFIG_KEYS = [
  'nivel', 'cuentaAtras', 'cantidadOperaciones', 'cantidadOperandos',
  'posicionIncognitaAlAzar', 'resultadoNegativo', 'maximoPrimo',
  'maximoOperandos', 'recargarOperacionesInfinitas', 'reCalcTries',
  'tiposOperaciones', 'tiposNumero', 'baseurl', 'version',
];

/**
 * Copy the truthy values of config.json onto DEFAULTS, as the historical
 * loader did (a falsy value in the file never overrides a default).
 *
 * @param {object} config
 * @param {object} [target=DEFAULTS]
 * @return {object} target
 */
export function applyConfig(config, target = DEFAULTS) {
  if (!config) return target;
  for (const key of CONFIG_KEYS) {
    if (config[key]) target[key] = config[key];
  }
  return target;
}

/**
 * Load ./config.json without blocking the page. On any failure the built-in
 * defaults stay, like the old synchronous request.
 *
 * @return {Promise<object>} DEFAULTS
 */
export async function loadConfig() {
  try {
    const response = await fetch('./config.json');
    if (response.ok) applyConfig(await response.json());
  } catch {
    // Keep the defaults.
  }
  return DEFAULTS;
}
