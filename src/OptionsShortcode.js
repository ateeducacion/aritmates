
import combinations from './utils/combinations.js';
import sh from './utils/shorthash.js';
import {listOptions, selectOptions, gTipoOpcion} from './Opciones';

import {OPERACIONES} from './operaciones/operaciones';
import {TIPO_NUMERO} from './operaciones/tipoNumero';
import utils from './utils';


global.listOptions = listOptions;

/**
  * Generar y parsear un codigo corto basando en las opciones
  *
  * @export
  * @class OptionsShortcode
  * @author Fernando Ramírez Pérez
  * @author Área de Tecnología Educativa (versión simplificada 1.3+)
  */
export class OptionsShortcode {
  jsonToHash(json) {
    return sh.unique(JSON.stringify(json));
  }

  /**
   * Devuelve todas las opciones posibles para esa opcion, para usar con las
   * opciones en la que se puede elegir multiples opciones
   * la posicion 0 del array es un arroy vacio[] para guardar una combinacion
   * cuando esta vacio
   * @param {string} opcion nombre opcion
   * @return {Array} Listado de todas las combinaciones posibles de esa opcion
   */
  _combinaciones(opcion) {
    let listaOpcionesMultiples;
    if ( opcion == 'tiposOperaciones' ) {
      listaOpcionesMultiples = OPERACIONES.selecionables;
    }
    if ( opcion == 'tiposNumero' ) {
      listaOpcionesMultiples = TIPO_NUMERO.selecionables;
    }
    return combinations( listaOpcionesMultiples );
  }

  /**
   * Genera codigo basado en las opciones
   * mi idea es que sete sea la vernsion mas larga del codigo y mas adelaste guardar un listado
   * con todas las combicanicones de codigos y generar codigos mas cortos
   * donde la primera letra es la versiond el codigo este tipo siempre empezaria por # y los
   * otros pueden ser algo como V1-<codigo>
   *
   *
   * @param {Array} options
   * @return {string} codigo tipo #A0B1C2...
   */
  generateCodeDirecto( options ) {

    const alphabet = utils.alphabetArray();
    let code = '';

    listOptions.forEach( (o, indx) => {
      const letter = alphabet[indx];
      let posiblesOpciones;
      const opcionSeleccionada = options[o];
      let curOtn; // es un numero enviado como string p.e.:'42'
      const esNumber = typeof opcionSeleccionada === 'number';
      const esString = typeof opcionSeleccionada === 'string';
      if ( esNumber || esString ) {
        posiblesOpciones = selectOptions[o];
        curOtn = posiblesOpciones.indexOf( opcionSeleccionada );
        if ( curOtn == -1 ) {
          curOtn = posiblesOpciones.indexOf( parseInt(opcionSeleccionada) );
        }
        if ( o == 'cuentaAtras' ) {
          if ( opcionSeleccionada != 0 && opcionSeleccionada != '0' ) {
            const timestr = utils.sgToMinSg(opcionSeleccionada);
            curOtn = posiblesOpciones.indexOf(timestr);
          }
        }
      }
      if (typeof opcionSeleccionada === 'boolean') {
        curOtn = opcionSeleccionada ? '1' : '0'; // true:1 false:0
      }
      // si es un array entonces es una opcion multiple:
      if ( Array.isArray(opcionSeleccionada) ) {
        // Ordenamos el array de opciones selecionadas para que coicida siempre
        //  ['suma', 'resta'] es lo mismo que  ['resta','suma' ]
        opcionSeleccionada.sort();
        if (o =='tiposOperaciones') {
          opcionSeleccionada.sort((first, second) => {
            // ordenar siempre con este orden:
            const orden = ['suma', 'resta', 'multiplicacion', 'division', 'division_resto'];
            if ( orden.indexOf(first) > orden.indexOf(second) ) {
              return 1;
            }
            if ( orden.indexOf(first) < orden.indexOf(second) ) {
              return -1;
            }
            return 0;
          });
        }

        const combinaciones = this._combinaciones(o);
        curOtn = utils.findArrayInArray(opcionSeleccionada, combinaciones);
        curOtn++; // + 1 para que la opcion 0 sea nada seleccionado

      }
      if ( undefined !== curOtn ) {
        curOtn = curOtn.toString();
        code = code + letter + curOtn;
      } else {
      }
    });
    return '#'+code;
  }

  /**
   * Convierte el codigo tipo #A0B1C5... en options { opcion: val, opcionb: valb....}
   * @param {string} codigo
   * @return {Object} Objecto con opciones para cargar
   */
  codigoDirectoToOptions( codigo ) {
    if (codigo[0] != '#') return false;
    const alphabet = utils.alphabetArray();
    codigo = codigo.substr(1);
    const objOpciones = {};
    const objCodigoLetras = {};

    for (let i = 0; i < codigo.length; i++) {
      const letraOpcion = codigo[i];

      let valOpcion='';
      const esLetra = alphabet.indexOf( letraOpcion ) != -1;
      if ( esLetra ) {
        const restoCodigo = codigo.substr(i+1);
        for (let j = 0; j < restoCodigo.length; j++) {
          const nextLetra = restoCodigo[j];
          const esNextLetra = alphabet.indexOf( nextLetra ) != -1;
          if ( esNextLetra ) {
            // si termina el numero y empiza la siguinte letra guarda el valor
            objCodigoLetras[letraOpcion] = valOpcion;
            break;
          } else {
            valOpcion += nextLetra;
          }
          // si es el fin del codigo guarda el ultitmo valor
          if (j == restoCodigo.length-1) objCodigoLetras[letraOpcion] = valOpcion;
        }
      }
    }

    listOptions.forEach( ( optionKey, indx) => {
      const letraOpcion = alphabet[indx];
      const opcionDefinida = Object.keys(objCodigoLetras).indexOf(letraOpcion) != -1;

      if (opcionDefinida) {
        const valOpcion = objCodigoLetras[letraOpcion];
        const tipoOpcion = gTipoOpcion(optionKey);

        if ( tipoOpcion == 'bool') {
          // Parentesis no se guarda si no hay dos operandos
          // como es obligatorio 3 operandos para poder poner parentesis 
          // lo pongo directamente
          if (optionKey == 'parentesis' && (valOpcion == 1) ) {
            objOpciones[optionKey] = true;
          }

          if (valOpcion == 1) objOpciones[optionKey] = true;
          else objOpciones[optionKey] = false;
        }
        if ( tipoOpcion == 'select') {
          const posiblesOpciones = selectOptions[optionKey];
          objOpciones[optionKey] = posiblesOpciones[valOpcion];
          if (optionKey == 'cuentaAtras' && objOpciones[optionKey]!==0) {
            objOpciones[optionKey] = utils
                .strTiempoASegundos( objOpciones[optionKey]);
          }
        }
        if ( tipoOpcion == 'multi') {
          const combinaciones = this._combinaciones(optionKey);
          // si val opcion es 0 es que se enivo sin nada selecionado en este campo
          if ( valOpcion == 0 ) objOpciones[optionKey] = [];
          else {
            // combicanicoen epmieza desde 0 y equivale a la que se envia como 1
            // por lo toanto combinaciones[valOpcionCorregida-1]
            objOpciones[optionKey] = combinaciones[valOpcion-1];
          }
        }
      }
    });
    return objOpciones;
  }
}

// usar como singleton
// https://stackoverflow.com/a/29977213/385437
export default new OptionsShortcode();

