
import combinations from './utils/combinations.js';
import sh from './utils/shorthash.js';
import {listOptions, selectOptions, gTipoOpcion,
  opcionesPosibilidades} from './Opciones';

import {OPERACIONES} from './operaciones/operaciones';
import {TIPO_NUMERO} from './operaciones/tipoNumero';
import utils from './utils';


global.listOptions = listOptions;

/**
  * Generar y parsear un codigo corto basando en las opciones
  *
  * @export
  * @class OptionsShortcode
  */
export class OptionsShortcode {
  constructor() {
    const tag = '[OptionsShortcode.js.constructor]';
  }

  generateCode( ) {
    const tag = '[generateCode]';
    console.log(tag);

    console.log('fin calcularnuopc:');
    console.log( this._calcularNumOpciones(listOptions));
  }

  getOptions( code ) {
    const list = this._getHashList();
    return list[code];
  }

  jsonToHash(json) {
    return sh.unique(JSON.stringify(json));
  }

  _getHashList(hash) {
    const list = {};
    // guardar todas las opciones posibles
    // generar opciones
    //  json = tal;
    // conevtir en hash
    // const hash = this.jsonToHash(json);
    // list[hash] = json;

    return list;
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
    const debug = false;
    const tag = '[OptionsShortcode.js.generateCodeDirecto]';
    if ( debug ) console.log( tag );

    const alphabet = utils.alphabetArray();
    let code = '';

    listOptions.forEach( (o, indx) => {
      const letter = alphabet[indx];
      let posiblesOpciones;
      const opcionSeleccionada = options[o];
      if ( debug ) {
        console.log( tag,
            'letter', letter,
            'es', o,
            'valor', opcionSeleccionada );
      }
      let curOtn; // es un numero enviado como string p.e.:'42'
      const esNumber = typeof opcionSeleccionada === 'number';
      const esString = typeof opcionSeleccionada === 'string';
      const esUndef = typeof opcionSelecionada === undefined;
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
        if ( debug ) {
          console.log( tag,
              'opcionSeleccionada', opcionSeleccionada,
              'o', o);
        };
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
        if ( debug ) {
          console.log( tag,
              'opcionSeleccionada ordenanda:', opcionSeleccionada);
        };

        const combinaciones = this._combinaciones(o);
        curOtn = utils.findArrayInArray(opcionSeleccionada, combinaciones);
        curOtn++; // + 1 para que la opcion 0 sea nada seleccionado

        if ( debug ) {
          console.log( tag,
              'en array', '\n\t',
              'valor combinación', opcionSeleccionada, '\n\t',
              'indice de la combinación', curOtn
          );
          console.log( 'en combinaciones', combinaciones[curOtn] );
          console.table( 'conbinaciones', combinaciones );
        }
      }
      if ( undefined !== curOtn ) {
        curOtn = curOtn.toString();
        code = code + letter + curOtn;
        if ( debug && esUndef ) {
          console.log(
              'opcion', o, '\n\t',
              'typeof opcionSelecionada', typeof opcionSeleccionada, '\n\t',
              'posibles opciones', posiblesOpciones, '\n\t',
              'valor', opcionSeleccionada
          );
        }
      } else {
        if ( debug ) {
          console.log(
              'undefined curOpt, en letter', letter, '\n\t',
              'opcion', o, '\n\t',
              'typeof opcionSelecionada', typeof opcionSeleccionada, '\n\t',
              'posibles opciones', posiblesOpciones, '\n\t',
              'valor', opcionSeleccionada
          );
        }
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
    const debug = false;
    const tag = '[OptionsShortcode.js.codigoDirectoToOptions]';
    if ( debug ) console.log( tag, codigo );
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
        if (debug) console.log( tag, optionKey, 'es', tipoOpcion );

        if ( tipoOpcion == 'bool') {
          // Parentesis no se guarda si no hay dos operandos
          // como es obligatorio 3 operandos para poder poner parentesis 
          // lo pongo directamente
          if (optionKey == 'parentesis' && (valOpcion == 1) ) {
            // objOpciones.cantidadOperandos = 3;
            // console.log(tag, 'cantidad de operandos pasado a 3? ', objOpciones.cantidadOperandos );
            objOpciones[optionKey] = true;
            if (debug) {
              console.log( tag,
                  'parentesis', objOpciones[optionKey],
                  'objOpciones.parentesis', objOpciones.parentesis,
                  'valOpcion', valOpcion
              );
            }
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
          if (debug) {
            if (optionKey == 'cantidadOperaciones' && objOpciones[optionKey]==0) {
              console.log(tag, 'catidad de operaciones sin limite');
            }
            if (optionKey == 'cantidadOperandos' ) {
              console.log(tag, 'cantidad Operandos', objOpciones[optionKey]);
            }
          }
        }
        if ( tipoOpcion == 'multi') {
          const combinaciones = this._combinaciones(optionKey);
          if ( debug ) {
            console.log( tag,
                'valopcion ', valOpcion,
                'valor:', combinaciones[valOpcion]
            );
          }
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

