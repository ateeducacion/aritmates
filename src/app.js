
/* eslint-disable camelcase */
/* eslint-disable no-invalid-this */
/**
 *
 * Este es el js inicial que carga toda la aplicación, aqui 
 * estan los imports de todos los objetos, en est e mismo archivo esta 
 * la carga de interfaz 
 *
 * @module App
 * @header app.js
 *
 * @author Fernando Ramirez <fernando.ramirez@altia.es>
 * @version 1.0.0-rc1
 * @license AGPL-3.0 
 */
/** @global */
window.debug = false;
const debug = false;
// const t0 = performance.now();
console.time('app.js');

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import $ from 'jquery';
// Switch nativo compatible (sustituye @material/mwc-switch)
import './components/mwc-switch.js';
// Slider vendored (antes xy-ui)
import './components/xy-slider.js';
// Dropdown nativo (antes @polymer/paper-dropdown-menu)
import './components/paper-dropdown-menu.js';
// paper-item layout nativo
import './components/paper-item.js';
// Checkbox nativo compatible (sustituye @polymer/paper-checkbox)
import './components/paper-checkbox.js';
// eslint-disable-next-line no-unused-vars
// // # Fonts,Css,Img FILES ------------------------

// no funcionaba con @material/..../mdc.dialog.css los he tenido que copiar
import '../css/mdc.dialog.min.css';
import '../css/mdc.textfield.min.css';

import '../css/main.scss';
import '../css/widgets.css';
// Iconos Material, Font Awesome y placeholder-loading se emiten en dist/css/vendors.css
// (scripts/build.mjs). Estos imports CSS se ignoran en esbuild (css-stub).
import '../css/ejercicio.scss';
import '../css/resultado.scss';
import '../css/print.scss';


import {DEFAULTS, ENABLE} from './defaultOptions';
import OPERACIONES from './operaciones/operaciones';
import {TIPO_NUMERO} from './operaciones/tipoNumero';

import './widgets/creditos';
import ayudaDrawer from './widgets/ayuda';

import './widgets/boxButton';
import IbRadio from './widgets/ibRadio';

import GenerarExamen from './generarExamen';
import {MDCDialog, MDCTextField} from './components/mdc-compat.js';
import OptionsShortcode from './OptionsShortcode';

import utils from './utils';
import ImprimirPdf from './imprimirPdf';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import html2canvas from 'html2canvas';

import {valoresNiveles} from './helpers';

import { keyCrono, valoresCrono, keyNivel, textoCrono } from './PortadaUI';
import {descargarPdfResultados, enviarform} from './ResultadosUI';

// TODO: refactor , la mayoria de las cosas de este fichero se deberian separar
// en uno o varios archivos como por ejemplo portadaUi.js ejerciosUi.js y resultadosUi.js
// opcines igual abria que movelo a otro archivo y en este meter imports a todo lo que llama 

window.jQuery = $;
/**
 * Opciones actuales
 * @container Opciones
 */
const opciones = {
  /** array tipos de operaciones selecionadas */
  tiposOperaciones: [],
  /**
   * tipo de numeros
   * @type array  */
  tiposNumero: [],
  /**
   * get posicionIncognitaAlAzar
   * @return {boolean} devuelve si esta definido o no
   */
  get posicionIncognitaAlAzar() {
    // el boton "al Azar" tiene data-value 2
    if ( $('[data-name="resultado"]')[0].dataset.value == 2 ) return true;
    return false;
  },
  /**
   * set posicionIncognitaAlAzar
   * @param {boolean} x definir como cierto o no 
   */
  set posicionIncognitaAlAzar(x) {
    // console.log('set posicion incognita a', x );
    if (x) {
      $('#radioResultado .ib-radio[data-val=2]').click();
      $('#radioResultado_mv .ib-radio[data-val=2]').click();
    } else {
      $('#radioResultado .ib-radio[data-val=1]').click();
      $('#radioResultado_mv .ib-radio[data-val=1]').click();
    }
  },

  set cantidadOperandos(x) {
    $('#selectNuOperandos')[0].dataset.value = x;
    $('#selectNuOperandos .ib-radio[data-val='+x+']').click();
    $('#selectNuOperandos_mv')[0].dataset.value = x;
    $('#selectNuOperandos_mv .ib-radio[data-val='+x+']').click();
  },
  get cantidadOperandos() {
    return $('#selectNuOperandos')[0].dataset.value;
  },

  set operacionMultiple(x) { },
  get operacionMultiple() {
    if (this.cantidadOperandos>2) {
      return true;
    }
    return false;
  },
  set nivel(x) {
    // converitr en value slider
    // console.log('nivel set', x , 'keynivel', keyNivel[x], valoresNiveles(x) );
    sliderNivelEl.value = keyNivel[x];
    sliderNivelEl_mv.value = keyNivel[x];
    sliderNivelUpdate();
  },
  get nivel() {
    // this.nivel = valoresNiveles(sliderNivel.value);
    // sliderNivelUpdate();
    return valoresNiveles(sliderNivel.value);
  },
  set cuentaAtras(x) {
    console.log('set cuenta atras', x);
    const val = textoCrono.indexOf(utils.sgToMinSg(x));
    sliderCrono.value = val;
    sliderCrono_mv.value = val;
    if ( x == 0 ) {
      // $('#switch-crono')[0].setAttribute('checked', '');
      $('#switch-crono')[0].checked = true;
      sliderCrono.disabled = true;
      sliderCrono.sliderCon.show = false;
      // $('#switch-crono').trigger('change');
    } else {
      $('#switch-crono')[0].checked = false;
      sliderCrono.disabled = false;
      sliderCrono.sliderCon.show = true;
    }
    // $('#switch-crono').trigger('change');
    sliderCronoUpdateMv(null);
    sliderCronoUpdateOr(null);
  },
  get cuentaAtras() {
    if ( $('#switch-crono')[0] && $('#switch-crono')[0].checked ) {
      return 0;
    }
    let a = valoresCrono(sliderCrono.value);
    a = utils.strTiempoASegundos(a);
    return a; // tiempo en segundos
  },
  set cantidadOperaciones(x) {
    sliderCantidadOp.value = x;
    sliderCantidadOp_mv.value = x;

    // Activa switch "Sin limite" si vale 0
    const sinLimite = ( x == 0 );
    $('#switch-limiteOp')[0].checked = sinLimite;
    // Fuerza actualizar visibilidad sliderCantidadOp y tooltip
    // console.log('set cantidad operaciones, sin limite ? ', sinLimite) ;
    // desactiva slider si esta marcada "SinLimite"
    sliderCantidadOp.disabled = sinLimite;
    sliderCantidadOp_mv.disabled = sinLimite;
    // muestra tooltip si NO esta marcado sin limite
    sliderCantidadOp.sliderCon.show = !sinLimite;
    sliderCantidadOp_mv.sliderCon.show = !sinLimite;
    sliderNivelUpdate();
  },
  get cantidadOperaciones() {
    if ( $('#switch-limiteOp')[0] && $('#switch-limiteOp')[0].checked ) {
      return 0;
    }
    return sliderCantidadOp.value;
  },

  set enfocado(x) {
    $('#switch-enfocado')[0].checked = x;
    $('#switch-enfocado_mv')[0].checked = x;
  },
  get enfocado() {
    if ( $('#switch-enfocado')[0] ) {
      return $('#switch-enfocado')[0].checked;
    }
    return false;
  },

  get resultadoNegativo() {
    if ( $('#switch-resultadoNegativo')[0] ) {
      return $('#switch-resultadoNegativo')[0].checked;
    }
    return false;
  },
  set resultadoNegativo(x) {
    $('#switch-resultadoNegativo')[0].checked = x;
    $('#switch-resultadoNegativo_mv')[0].checked = x;
  },

  // parentesis solo funicona con operaciones multiples
  get parentesis() {
    if ( $('#opConParentesis')[0] ) {
      return $('#opConParentesis')[0].checked;
    }
    return false;
  },
  set parentesis(x) {
    $('#opConParentesis')[0].checked = x;
    $('#opConParentesis_mv')[0].checked = x;
  },

  get complementario() {
    if ( $('#resultadoIgualA')[0] ) {
      return $('#resultadoIgualA')[0].value;
    }
    return false;
  },
  set complementario(x) {
    $('#resultadoIgualA')[0].value = x;
    $('#resultadoIgualA_mv')[0].value = x;
  },

  addTipoOperacion(tipo) {
    // const debug = true;
    const tag = '[app.js.addTipoOperacion(tipo)]';
    let el;
    let elName;
    if ( debug ) console.log( tag, tipo );
    if ( !(this.tiposOperaciones.includes(tipo)) ) {
      switch (tipo) {
        case OPERACIONES.SUMA:
          // el = $('#btnSuma');
          elName = '#btnSuma';
          break;
        case OPERACIONES.RESTA:
          elName = '#btnResta';
          break;
        case OPERACIONES.DIVISION:
          elName = '#btnDiv';
          break;
        case OPERACIONES.DIVISION_RESTO:
          elName = '#btnDiv';
          // $('#cbDivResto')[0].checked = true;
          // $('#cbDivResto').trigger('change');
          $('#cbDivResto').click();
          break;
        case OPERACIONES.MULTIPLICACION:
          elName = '#btnMulti';
          break;
      }
      el = $(elName);
    }
    el.click();
    if ( debug ) {
      console.log( tag, 'clases el:', el[0].classList );
    }
  },

  removeTipoOperacion(tipo) {
    if (this.tiposOperaciones.includes(tipo)) {
      switch (tipo) {
        case OPERACIONES.MULTIPLICACION:
          $('#btnMulti').click();
          break;
        case OPERACIONES.SUMA:
          $('#btnSuma').click();
          break;
        case OPERACIONES.RESTA:
          $('#btnResta').click();
          break;
        case OPERACIONES.DIVISION:
        case OPERACIONES.DIVISION_RESTO:
          $('#btnDiv').click();
          break;
      }
    }
  },

  addTipoNumero(tipo) {
    // const debug = true;
    if (debug) console.log('addTipoNumero called', 'tipo', tipo);
    if ( !(this.tiposNumero.includes(tipo)) ) {
      switch (tipo) {
        case TIPO_NUMERO.NATURAL:
          $('#btnPositivos').click();
          break;
        case TIPO_NUMERO.ENTERO:
          $('#btnNegativos').click();
          break;
        case TIPO_NUMERO.DECIMAL:
          $('#btnDecimales').click();
          break;
        case TIPO_NUMERO.MULTIPLO10:
          $('#btnMul10').click();
          break;
        case TIPO_NUMERO.MULTIPLO100:
          $('#btnMul100').click();
          break;
      }
    }
  },
};

// Para poder saber en que parte de la aplicacion estamos en este momento:
const SCENE = {
  OPTIONS: 0,
  OPERATIONS: 1,
  SCORE: 2,
};
let scene = SCENE.OPTIONS;

window.opciones = opciones;
// console.log('Opciones iniciales', opciones);


const sliderNivel = $('xy-slider#sliderNivel')[0];
const sliderNivelEl = $('#row-nivel-crono-noperaciones').find('#sliderNivel')[0];
const sliderNivelEl_mv = $('#movil').find('#sliderNivel_mv')[0];
const sliderNivel_mv = $('#sliderNivel_mv')[0];

sliderNivelEl.value = parseInt(DEFAULTS.nivel);

const sliderNivelUpdate = () => {
  sliderNivel_mv.sliderCon.tips = valoresNiveles(sliderNivel.value);
  sliderNivel.sliderCon.tips = valoresNiveles(sliderNivel.value);
  $('#nivelMax').val( valoresNiveles(sliderNivel.value) );
  $('#nivelMax_mv').val(valoresNiveles(sliderNivel.value));
};
const onChangeNivelUpdateMv = (ev) => {
  sliderNivel_mv.value = sliderNivel.value;
  sliderNivelUpdate();
};
const onChangeNivelUpdateOr = (ev) => {
  sliderNivel.value = sliderNivel_mv.value;
  sliderNivelUpdate();
};
$(sliderNivelEl).on('change', onChangeNivelUpdateMv );

sliderNivel.slider.addEventListener('input', onChangeNivelUpdateMv );
sliderNivel.slider.addEventListener('change', onChangeNivelUpdateMv );
sliderNivel.slider.addEventListener('wheel', onChangeNivelUpdateMv );

sliderNivel_mv.slider.addEventListener('input', onChangeNivelUpdateOr );
sliderNivel_mv.slider.addEventListener('change', onChangeNivelUpdateOr );
sliderNivel_mv.slider.addEventListener('wheel', onChangeNivelUpdateOr );

$('#nivelMax').val(valoresNiveles(sliderNivel.value));
$('#nivelMax_mv').val(valoresNiveles(sliderNivel.value));

const sliderCrono = $('#row-nivel-crono-noperaciones').find('#sliderCrono')[0];
window.sliderCrono = sliderCrono;
const sliderCrono_mv = $('#sliderCrono_mv')[0];
// console.log('sliderCrono_mv');
// console.log('sliderCrono_mv', sliderCrono_mv );

if (DEFAULTS.cuentaAtras != 0) {
  sliderCrono.value = keyCrono(DEFAULTS.cuentaAtras);
  sliderCrono_mv.value = keyCrono(DEFAULTS.cuentaAtras);
} else {
  $('#switch-crono')[0].setAttribute('checked', '');
  $('#switch-crono').trigger('change');
}

const sliderCronoUpdateMv = (ev) => {
  // console.log( 'sliderCronoUpdateMv', ev );
  sliderCrono_mv.value = sliderCrono.value;
  sliderCrono_mv.sliderCon.tips = valoresCrono(sliderCrono.value);
  sliderCrono.sliderCon.tips = valoresCrono(sliderCrono.value);
};
const sliderCronoUpdateOr = (ev) => {
  // console.log( 'sliderCronoUpdateMv', ev );
  sliderCrono.value = sliderCrono_mv.value;
  sliderCrono_mv.sliderCon.tips = valoresCrono(sliderCrono_mv.value);
  sliderCrono.sliderCon.tips = valoresCrono(sliderCrono_mv.value);
};

sliderCrono.slider.addEventListener('input', sliderCronoUpdateMv );
sliderCrono.slider.addEventListener('change', sliderCronoUpdateMv );
sliderCrono.slider.addEventListener('wheel', sliderCronoUpdateMv );

sliderCrono_mv.slider.addEventListener('input', sliderCronoUpdateOr );
sliderCrono_mv.slider.addEventListener('change', sliderCronoUpdateOr );
sliderCrono_mv.slider.addEventListener('wheel', sliderCronoUpdateOr );

sliderCronoUpdateMv();

// Slider cantidad Operaciones --
const sliderCantidadOp = $('#sliderCantidadOp')[0];
const sliderCantidadOp_mv = $('#sliderCantidadOp_mv')[0];

const sliderCantOpUpdateMv = (ev) => {
  sliderCantidadOp_mv.value = sliderCantidadOp.value;
};
const sliderCantOpUpdateOr = (ev) => {
  sliderCantidadOp.value = sliderCantidadOp_mv.value;
};

sliderCantidadOp.slider.addEventListener('input', sliderCantOpUpdateMv );
sliderCantidadOp.slider.addEventListener('change', sliderCantOpUpdateMv );
sliderCantidadOp.slider.addEventListener('wheel', sliderCantOpUpdateMv );
sliderCantidadOp_mv.slider.addEventListener('input', sliderCantOpUpdateOr );
sliderCantidadOp_mv.slider.addEventListener('change', sliderCantOpUpdateOr );
sliderCantidadOp_mv.slider.addEventListener('wheel', sliderCantOpUpdateOr );

// mostrar ToolTips siempre :
sliderCrono.sliderCon.show = true;
sliderCrono_mv.sliderCon.show = true;

// mostrar siempre los tooltips
sliderNivel.sliderCon.show = true;
sliderNivel_mv.sliderCon.show = true;
sliderCantidadOp.sliderCon.show = true;
sliderCantidadOp_mv.sliderCon.show = true;

// si esta selecionado el CheckBox "sin cronometro" se desactiva el slider
sliderCrono.disabled = $('#switch-crono')[0].checked;
sliderCrono.sliderCon.show = !$('#switch-crono')[0].checked;
sliderCrono_mv.disabled = $('#switch-crono')[0].checked;
sliderCrono_mv.sliderCon.show = !$('#switch-crono')[0].checked;

// lo mismo con cantidaop
sliderCantidadOp.disabled = $('#switch-limiteOp')[0].checked;
sliderCantidadOp.sliderCon.show = !$('#switch-limiteOp')[0].checked;
sliderCantidadOp_mv.disabled = $('#switch-limiteOp')[0].checked;
sliderCantidadOp_mv.sliderCon.show = !$('#switch-limiteOp')[0].checked;


// --- fin sliders ----------

// Checkboxes

const cbCronoOnChange = (ev) => {
  console.log( 'cronometro cambiado ', ev);
  //  en teoria si ya se ha cambiado deberia estar en estado correcto , pero ahora esto funciona como un click
  //  asi que tienes que tener en cuenta que esta al contrario de com va estar al final

  sliderCrono.disabled = !ev.target.checked; // desactiva el silder si el cronometro esta checkeado
  console.log('sildercrono disabled', sliderCrono.disabled, ev.target.checked)
  sliderCrono.sliderCon.show = ev.target.checked;

  sliderCrono_mv.disabled = !ev.target.checked;
  sliderCrono_mv.sliderCon.show = ev.target.checked;

  // pone los dos de la version movil y desktop iguales:
  $('#switch-crono').checked = $('#switch-crono_mv').checked = ev.target.checked;
  //  = ev.target.checked;
};

const cbLimiteOpOnChange = (ev) => {
  // console.log('cb limite operaciones cambiado ', ev);
  sliderCantidadOp.disabled = ev.target.checked;
  sliderCantidadOp.sliderCon.show = !ev.target.checked;
  sliderCantidadOp_mv.disabled = ev.target.checked;
  sliderCantidadOp_mv.sliderCon.show = !ev.target.checked;
  $('#switch-limiteOp')[0].checked = ev.target.checked;
  $('#switch-limiteOp_mv')[0].checked = ev.target.checked;

  // si esta sin limite activar cronometro y no permitir desactivarlo
  // if ( $('#switch-limiteOp')[0].checked ) {
  //   if ( $('#switch-crono')[0].checked ) {
  //     $('#switch-crono').click();
  //   }
  //   sliderCrono.disabled = false;
  //   $('#switch-crono').disabled = true;
  // } else {
  //   // sliderCrono.disabled = true;
  //   $('#switch-crono').disabled = false;
  // }
};

$('#switch-crono').on('click', cbCronoOnChange );
$('#switch-crono_mv').on('click', cbCronoOnChange );

$('#switch-limiteOp').on('click', cbLimiteOpOnChange );
$('#switch-limiteOp_mv').on('click', cbLimiteOpOnChange );

// BoxButtons
// activa/deactiva opcion y guarda en opciones
function toogleOption( option, optionVal) {
  if ( option.includes( optionVal ) ) {
    removeOption( option, optionVal);
  } else {
    addOption( option, optionVal);
  }
}
function removeOption( option, optionVal) {
  if ( option.includes( optionVal ) ) {
    const elPosition = option.indexOf( optionVal );
    option.splice( elPosition, 1 );
  }
  if (option == opciones.tiposNumero ) {
    updateSliderLevelState();
  }
}
function addOption(option, optionVal) {
  if ( !option.includes( optionVal ) ) {
    option.push( optionVal );
  }
  if (option == opciones.tiposNumero ) {
    updateSliderLevelState();
  }
}

/**
 * Actualiza el selector de niveles si ha falta activarlo/ desactivarlso
 *
 * @author Fernando Ramírez Pérez
 * @param {*} [activar=null]
 */
function updateSliderLevelState( activar=null ) {
  if ( opciones.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ||
      opciones.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100) ) {
    sliderNivel.disabled = true;
  } else {
    sliderNivel.disabled = false;
  }

  sliderNivel.sliderCon.show = !sliderNivel.disabled; // siempre es lo crontrario a sliderNivel.disabled
}

$(document).on('selected:btnSuma', (ev) => {
  toogleOption( opciones.tiposOperaciones, OPERACIONES.SUMA );
} );
$(document).on('selected:btnResta', (ev) => {
  toogleOption( opciones.tiposOperaciones, OPERACIONES.RESTA );
} );
$(document).on('selected:btnMulti', (ev) => {
  toogleOption( opciones.tiposOperaciones, OPERACIONES.MULTIPLICACION );
} );


$(document).on('selected:btnDiv', (ev, clickOrigen) => {
  // console.log('ev type:', ev.type, 'origen', clickOrigen );
  const id = '#' + clickOrigen;
  // NO-Quitar negativos si estan selecionado al selecionar division
  // Ya que lo que no sean divisiones pueden ser negativas
  const evSelected = $(id)[0].classList.contains('selected');
  if ( evSelected ) {
    if ( $('#cbDivResto')[0].checked ) {
      addOption( opciones.tiposOperaciones, OPERACIONES.DIVISION_RESTO );
    } else {
      addOption( opciones.tiposOperaciones, OPERACIONES.DIVISION );
    }
    $('#divResto').addClass('d-block');
    $('#divResto_mv').addClass('d-block');
  } else {
    // $('#btnNegativos')[0].removeAttribute('disabled');
    removeOption( opciones.tiposOperaciones, OPERACIONES.DIVISION_RESTO );
    // click checbox resto para restaurar numero de operandos al quitar
    // las divisiones
    if ( $('#cbDivResto')[0].checked == true ) $('#cbDivResto').click();
    removeOption( opciones.tiposOperaciones, OPERACIONES.DIVISION );
    $('#divResto').removeClass('d-block');
    $('#divResto_mv').removeClass('d-block');
  }
});

function elimminarOpcionMas2Operandos() {
  $('#selectNuOperandos').find('span[data-val="2"]').addClass('selected');
  $('#selectNuOperandos').find('span[data-val="3"]').removeClass('selected');
  $('#selectNuOperandos').find('span[data-val="4"]').removeClass('selected');
  $('#selectNuOperandos').find('span[data-val="3"]').hide();
  $('#selectNuOperandos').find('span[data-val="4"]').hide();

  $('#selectNuOperandos')[0].dataset.value=2;

  $('#selectNuOperandos_mv').find('span[data-val="2"]').addClass('selected');
  $('#selectNuOperandos_mv').find('span[data-val="3"]').removeClass('selected');
  $('#selectNuOperandos_mv').find('span[data-val="4"]').removeClass('selected');
  $('#selectNuOperandos_mv').find('span[data-val="3"]').hide();
  $('#selectNuOperandos_mv').find('span[data-val="4"]').hide();

  $('#selectNuOperandos_mv')[0].dataset.value=2;
}

function restaurarOpcionMas2Operandos() {
  $('#selectNuOperandos').find('span[data-val="3"]').show();
  $('#selectNuOperandos').find('span[data-val="4"]').show();

  $('#selectNuOperandos_mv').find('span[data-val="3"]').show();
  $('#selectNuOperandos_mv').find('span[data-val="4"]').show();
}

const cbDivRestoChange = (ev) => {
  // quita las divisiones "a secas" y pone division con resto ( o viceversa )
  // console.log( ev.target, 'checked', ev.target.checked );

  if (ev.target.checked) {
    // console.log( 'checked true');
    removeOption( opciones.tiposOperaciones, OPERACIONES.DIVISION );
    addOption( opciones.tiposOperaciones, OPERACIONES.DIVISION_RESTO );

    elimminarOpcionMas2Operandos();
  } else {
    // console.log( 'checked false');
    addOption( opciones.tiposOperaciones, OPERACIONES.DIVISION );
    removeOption( opciones.tiposOperaciones, OPERACIONES.DIVISION_RESTO );

    restaurarOpcionMas2Operandos();
  }
  // igualamos los dos cb
  $('#cbDivResto')[0].checked = ev.target.checked;
  $('#cbDivResto_mv')[0].checked = ev.target.checked;
  // desactiva los decimales si esta selecionado solo div con resto
  changeOpTipoNumero();
};

$('#cbDivResto').on('change', cbDivRestoChange );
$('#cbDivResto_mv').on('change', cbDivRestoChange );

const changeOpParentesis = () => {
  if ( opciones.cantidadOperandos == 2 ||
      opciones.tiposOperaciones.length == 1) {
    $('#opConParentesis')[0].setAttribute('disabled', '');
    $('#opConParentesis')[0].removeAttribute('checked');
    $('#opConParentesis_mv')[0].setAttribute('disabled', '');
    $('#opConParentesis_mv')[0].removeAttribute('checked');
  } else {
    $('#opConParentesis')[0].removeAttribute('disabled');
    $('#opConParentesis_mv')[0].removeAttribute('disabled');
  }
};

$('#selectNuOperandos').on('change', (ev) => {
  // console.log('change!', ev.target );
  // console.log('opciones.cantidadOperandos', opciones.cantidadOperandos);
  changeOpParentesis();
  ev.stopPropagation();
  ev.preventDefault();
  return false;
});

$('#opConParentesis')[0].setAttribute('disabled', '');
$('#opConParentesis_mv')[0].setAttribute('disabled', '');

const opConParentesisChange = (ev) => {
  $('#opConParentesis')[0].checked = ev.target.checked;
  $('#opConParentesis_mv')[0].checked = ev.target.checked;
};

$('#opConParentesis').on('change', opConParentesisChange );
$('#opConParentesis_mv').on('change', opConParentesisChange );

const resultadoIgualaChange = (ev) => {
  // console.log('target value:', ev.target.value );
  $('#resultadoIgualA_mv')[0].value = ev.target.value;
  $('#resultadoIgualA')[0].value = ev.target.value;
};

$('#resultadoIgualA').on('value-changed', resultadoIgualaChange );
$('#resultadoIgualA_mv').on('value-changed', resultadoIgualaChange );

const deselect = (id, opcion) => {
  const hashId = '#' + id;
  if ( $(hashId).hasClass('selected') ) {
    toogleOption( opciones.tiposNumero, opcion );
    // no te deja justar dos triggers
    // $(document).trigger('selected:'+ id );
    $(hashId).removeClass('selected');
  }
};

const deselectDecimal = () => {
  const id = 'btnDecimales';
  const opcion = TIPO_NUMERO.DECIMAL;
  deselect(id, opcion);
};
const deselectmul10 = () => {
  const id = 'btnMul10';
  const opcion = TIPO_NUMERO.MULTIPLO10;
  deselect(id, opcion);
};
const deselectmul100 = () => {
  const id = 'btnMul100';
  const opcion = TIPO_NUMERO.MULTIPLO100;
  deselect(id, opcion);
};

/**
 * Comprueba si esta seleciondo alguno de los  tipos de numero con los que no
 * es compatible la opcion de enfocado, si es asi desactiva la opcion enfocado
 *
 */
function disableEnfocadoSiTipoNumero() {
  if (
    opciones.tiposNumero.includes(TIPO_NUMERO.DECIMAL) ||
    opciones.tiposNumero.includes(TIPO_NUMERO.MULTIPLO10) ||
    opciones.tiposNumero.includes(TIPO_NUMERO.MULTIPLO100)
  ) {
    opciones.enfocado = false;
    $('#switch-enfocado')[0].disabled = true;
  } else $('#switch-enfocado')[0].disabled = false;
}

/**
 * Comprueba que haya que desactivar la opcion de 3 operandos y la desactiva
 * si estan selecianadas divisiones decimales
 *
 * @author Fernando Ramírez Pérez
 */
function updateOperasdosOnDivisionChange() {
  const tag = '[app.js.updateOperasdosOnDivisionChange]';
  const debug = true;
  if ( debug ) console.log( tag );
  // Si hay en tipos numero decimal y esta seleciondo solo la opoeracion de diviision:
  // o si esta seleciondo division con resto
  if (
    (
      opciones.tiposNumero.includes(TIPO_NUMERO.DECIMAL) &&
      utils.isArraysCompareSimilar(opciones.tiposOperaciones, [OPERACIONES.DIVISION])
    ) ||
    opciones.tiposOperaciones.includes(OPERACIONES.DIVISION_RESTO)
  ) {
    elimminarOpcionMas2Operandos();
  } else {
    restaurarOpcionMas2Operandos();
  }
}

/**
* @event selected:btnPositivos
*/
$(document).on('selected:btnPositivos', (ev) => {
  toogleOption( opciones.tiposNumero, TIPO_NUMERO.NATURAL );
} );
/**
* @event selected:btnNegativos
*/
$(document).on('selected:btnNegativos', (ev) => {
  toogleOption( opciones.tiposNumero, TIPO_NUMERO.ENTERO );
} );
/**
* @event selected:btnDecimales
*/
$(document).on('selected:btnDecimales', (ev) => {
  toogleOption( opciones.tiposNumero, TIPO_NUMERO.DECIMAL );
  disableEnfocadoSiTipoNumero();
  updateOperasdosOnDivisionChange();
  deselectmul10();
  deselectmul100();
} );
/**
* @event selected:btnMul10
*/
$(document).on('selected:btnMul10', (ev) => {
  toogleOption( opciones.tiposNumero, TIPO_NUMERO.MULTIPLO10 );
  disableEnfocadoSiTipoNumero();
  deselectmul100();
  deselectDecimal();
  // al deselecionar deciamles hace falta actulalizar operandos:
  updateOperasdosOnDivisionChange();
} );
/**
* @event selected:btnMul100
*/
$(document).on('selected:btnMul100', (ev) => {
  toogleOption( opciones.tiposNumero, TIPO_NUMERO.MULTIPLO100 );
  disableEnfocadoSiTipoNumero();
  // deselecionar btml10 si esta selecionado
  deselectmul10();
  deselectDecimal();
  // al eselcionar multilos se deseleciona los decimales:
  updateOperasdosOnDivisionChange();
});

// inicializar tooltips
$(document).ready(function() {
  console.log('document ready');
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      placement: 'bottom',
      template: '<div class="tooltip" role="tooltip">'+
      '<div class="tooltip-arrow d-hide"></div>'+
      '<div class="tooltip-inner"></div></div>'
    })
  });
});

// botones clear no cabe el texto en versino tablet, se pone como alt
// $('.button.clear').attr('title', $(this).find('name') );
$.each($('.button.button-long.clear'), (index, val)=> {
  const nameElement =$(val).find('.txt')[0];
  const txt = nameElement.innerHTML;
  $(val).attr('title', txt );
});

// --- enviar respuesta
let endPregunta;
let startPregunta;
const tiempoPreguntas = [];
let puedeReintentar = true;

const enviarRespuesta = (ev) => {
  // console.log( ev.target.id, 'clicked' );
  // guarda el tiempo de la pregunta recién respondida
  endPregunta = Date.now();
  tiempoPreguntas[currentOp] = endPregunta - startPregunta;
  score.tiempoConsumido += tiempoPreguntas[currentOp];
  startPregunta = Date.now();

  // Calcular media
  score.tiempoMedioEjercicio = score
      .tiempoConsumido / opcionesGuardadas.cantidadOperaciones;
  // console.log( score.tiempoConsumido );

  // acierto o fallo?
  const op = examen.operacionesExamen[currentOp];
  let respuesta = $('.incognita')[0].value;
  if ( op.getTipo() == OPERACIONES.DIVISION_RESTO ) {
    respuesta = {
      'incognita': $('.incognita')[0].value,
      'resto': $('input.resto')[0].value,
    };
  }
  // console.log( 'operación', op, 'respuesta', respuesta,
  //     'op respuesta', op.respuesta() );

  // --- feedback
  // si falla
  if ( (respuesta == '' || !op.esRespuesta(respuesta)) &&
      puedeReintentar ) {
    $('.pantalla').hide();
    $('.modalEjercicio.reintentar').addClass('d-flex');
    puedeReintentar = false;
    return;
  }
  if ( (respuesta == '' || !op.esRespuesta(respuesta)) &&
      !puedeReintentar ) {
    $('.pantalla').hide();
    $('.modalEjercicio.incorrecta').addClass('d-flex');
  }
  // SI ACIERTA:
  if ( op.esRespuesta(respuesta) ) {
    $('.pantalla').hide();
    $('.modalEjercicio.correcta').addClass('d-flex');
    const modalCorrecta = $('.modalEjercicio.correcta')[0];

    setTimeout(function(t) {
      // console.log('ha pasado 500 milisegundos');
      // $(t).slideUp(750);
      $(t).removeClass('d-flex');
      $('.pantalla').show();

      // focus incognita
      tagOperacion.getElementsByClassName('incognita')[0].focus();
    }, 800, modalCorrecta);
  }
  // set para siguiente respuesta cuando ya se ha contestado esta
  // bien
  puedeReintentar = true;

  // guardar acierto o fallo
  if ( respuesta != '' ) {
    score.completados++;
    if ( op.esRespuesta(respuesta) ) {
      // respuesta correta
      // console.log('respuesta ok');
      score.aciertos++;
    } else {
      // console.log('respuesta ko');
      score.fallos++;
      score.operacionesMal[currentOp] = respuesta;
    }
  } else {
    // console.log('considerando fallo la respuesta no contestada');
    score.fallos++;
    score.operacionesMal[currentOp] = respuesta;
  }
  // console.log('puntuación', score);

  // si hay operaciones infinitas carga nuevas cada x operaciones
  // const tagOI = '[OperacionesInfinitas]';
  if ( opcionesGuardadas.cantidadOperaciones == 0 ) {
    // console.log( tagOI, 'operaciones infinitas',
    //     DEFAULTS.recargarOperacionesInfinitas,
    //     'current op:', currentOp );
    // console.log( tagOI, 'resto current op / recargarOpInf',
    //     (currentOp+1) % DEFAULTS.recargarOperacionesInfinitas);
    if ( (currentOp+1) % DEFAULTS.recargarOperacionesInfinitas == 0 ) {
      examen.crearMasOperaciones();
      // console.log( tagOI, 'creadas mas operaciones',
      //     examen.operacionesExamen.length
      // );
    }
  }
  // mostrar la proxima operacion
  // console.log( tagOI, 'mostrar la proxima op',
  //     '\n currentOp', currentOp,
  //     '\n examen.operacionesExamen.length', examen.operacionesExamen.length);

  currentOp++;
  if ( currentOp >= examen.operacionesExamen.length ) {
    currentOp = 0;
    $('body').trigger('finEjercicios');
    return;
  }
  mostrarOperacion(examen.operacionesExamen[currentOp]);
  actualizarNumeroEjercicio(opcionesGuardadas.cantidadOperaciones);
};
// Fin enviar respuesta ---

window.opActual = {};

function mostrarOperacion(op) {
  // TODO: no desactiva la barra scroll en input number
  // disableMouseWheelInputNumber();
  actualizarClaseAyuda( op.getTipo() );
  tagOperacion.innerHTML = op.toHtml();
  // console.log('%cOp Actual: '+op, 'font-size:3rem', window.debugSelenium);
  if ( window.debugSelenium ) {
    // console.log('%cOp debugSelenium: '+op, 'font-size:3rem');
    window.opActual = op;
  }
  actualizarClaseAyuda(op.getTipo() );
}

const score = {
  puntuacion: 0,
  completados: 0,
  aciertos: 0,
  fallos: 0,
  tiempoConsumido: 0,
  tiempoMedioEjercicio: 0,
  operacionesMal: [],
};

let examen;
let currentOp;
let tagOperacion;

let modalCorreoHtml;

function guardarOpciones(opciones) {
  let opcionesGuardadas = {};
  opcionesGuardadas = Object.assign(opcionesGuardadas, opciones);
  opcionesGuardadas.cantidadOperandos = parseInt(
      opcionesGuardadas.cantidadOperandos);
  window.opcionesGuardadas = opcionesGuardadas;
  return opcionesGuardadas;
}

// al pulsar iniciar cargar ejercicios
$('#btnComenzar').on('click', function() {
  // eslint-disable-next-line no-unused-vars
  const dontstop = console.time('btnComenzar');
  // console.log('btnComenzar clicked ');

  if ( opciones.tiposOperaciones.length == 0 ||
      opciones.tiposNumero.length == 0 ) {
    // mostra dialogo no ha selecionado operaciones o tipos de numero
    const dialogMissingOptions = {};
    cargarFaltaOpciones(dialogMissingOptions);
    console.timeEnd('btnComenzar');
    return;
  }

  // copiar opciones en op
  const opcionesGuardadas = guardarOpciones(opciones);

  // visualizar opciones:
  // console.log(JSON.stringify(opcionesGuardadas, null, 2));
  // generar operaciones con estos datos y cargar ejercicios
  // load template
  fetch('./templates/part_ejercicio.html')
      .then((response) => response.text() )
      .then((data) => {
        // console.log('data ok');
        // ocultar cajas portada:
        $('#primeraCaja').hide();
        $('#hoja-ejercicios').hide();
        $('hoja-opciones').addClass('mb-3');
        $('.esquinaHoja').hide();
        $('#hoja-opciones').find('.container-fluid').remove();
        $('#hoja-opciones').append('<div style="width:100%" id="newContent"></div>');

        // renombrar hoja-opciones a ejericios
        $('#hoja-opciones').attr('id', 'ejercicios');

        // console.log('append', data);
        // agregar nuevo contenido
        $('#newContent').hide();
        $('#newContent').append(data);

        // evento cuando aparezca ventana con autoclose
        $('.autoclose').on('show', function(ev) {
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          ev.preventDefault();
        });

        // mostrar loading encima de nuevo contenido
        const loadingPlaceholder = `
        <div id="loading" class="ph-item col-md-12">
            <div class="ph-col-12">
                <div class="ph-row">
                    <div class="ph-col-12 big"></div>
                    <div class="ph-col-12 empty"></div>

                    <div class="ph-col-4 empty "></div>
                    <div class="ph-col-4 "></div>
                    <div class="ph-col-4 empty "></div>                    

                    <div class="ph-col-3 empty big"></div>
                    <div class="ph-col-6 big"></div>
                    <div class="ph-col-3 empty big"></div>
                    
                    <div class="ph-col-12 empty big"></div>

                    <div class="ph-col-4 empty big"></div>
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-4 empty big"></div>                    
                </div>
            </div>
        </div>
        `;
        $('#newContent').before(loadingPlaceholder);

        tagOperacion = document.querySelector('.operacion');
        tagOperacion = tagOperacion.parentNode;

        // generar examen con estos valores
        examen = new GenerarExamen( opcionesGuardadas );
        if (debug) console.log(examen.toString( true, true ));

        if ( examen.errors.length > 0 ) {
          // console.log(examen.toString( true, true ));
          // console.log( 'errores:', examen.errors, examen.mostrarErrores() );
          $('#ejercicios').find('#newContent')
              .append(
                  examen.toHtml()
              );
        } else {
          // console.log('%cDEBUG',
          //   'background-color: red;font-size:5em;border');
          // debugger;
          currentOp = 0;
          tagOperacion.innerHTML = examen.operacionesExamen[currentOp].toHtml();

          const opActual = examen.operacionesExamen[currentOp];
          // window.opActual = opActual;
          actualizarClaseAyuda(opActual.getTipo() );
          mostrarOperacion(opActual);
          // tagOperacion.innerHTML = opActual.toHtml();
          actualizarNumeroEjercicio(opcionesGuardadas.cantidadOperaciones);

          // cerrar pantalla modal al picar boton de continuar/reintentar
          $('#ejercicios').find('.button.mini').click((ev) =>
            showOperationAgain()
          );

          $('#loading').hide();
          $(loadingPlaceholder).hide();
          $('#newContent').show();
          if ( opcionesGuardadas.cantidadOperaciones == 0 ) {
            $('#enviarTerminar').removeClass('d-none');
            $('body').find('#btnEnviarTerminar')
                .on('click', (ev) => {
                  opcionesGuardadas.cantidadOperaciones = currentOp+1;
                  examen.operacionesExamen
                      .slice(opcionesGuardadas.cantidadOperaciones);
                  enviarRespuesta(ev);
                });
          }
          scene = SCENE.OPERATIONS;
          tagOperacion.getElementsByClassName('incognita')[0].focus();
          if (typeof ayudaDrawer !== 'undefined') {
            ayudaDrawer.refreshEvents();
          }
          if ( opcionesGuardadas.cuentaAtras > 0 ) {
            const timeArr = (opcionesGuardadas.cuentaAtras/60)
                .toString().split('.');
            let min = timeArr[0];
            let sg = parseInt(timeArr[1])*6 | 0;
            min = utils.rellenaIzq(min, 2, '0');
            // console.log('boxtime total', sg, timeArr[1] );
            sg = utils.rellenaIzq(sg, 2, '0');
            $('#boxTime #total')[0].innerHTML = min + ':' + sg;
            // console.log('boxtime total', $('#boxTime #total')[0].toString() );
            // console.log('boxtime total', sg );
            initializeCountDown('countdown', opcionesGuardadas.cuentaAtras*1000);
          } else {
            const notime = '--:--'; // '――:――'
            $('#boxTime #total')[0].innerHTML = notime;
            $('#boxTime #countdown')[0].innerHTML = notime;
            initializeCountUp('countdown');
          }

          // tiempo primera respuesta
          startPregunta = Date.now();
          puedeReintentar = true;

          $('body').find('#btnEnviarRespuesta').on('click', (ev) => enviarRespuesta(ev) );
          $('#interior').on('keyup', '.incognita', function(ev) {
            // console.log('key .incoginita', ev.keyCode);
            const op = examen.operacionesExamen[currentOp];
            if ( ev.keyCode == 13 ) {
              ev.stopPropagation();
              ev.preventDefault();
              // console.log('pulsado enter', op.tipo );
              if ( op.getTipo() != OPERACIONES.DIVISION_RESTO ) {
                // console.log('enviar respuesta');
                enviarRespuesta(ev);
              } else {
                document.getElementById('resto').focus( (ev) =>
                  $(this).select()
                );
                // inputResto.focus( function(ev) {
                //   console.log(ev);
                //
                // });
              }
            }
          });
          $('#interior').on('keyup', '.resto', function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            if ( ev.keyCode == 13 ) {
              enviarRespuesta(ev);
            }
          });

          $('body').on('timeup', (ev) => {
            // console.log('se acabo el tiempo');
            // console.log('SCENE ES SCORE?', scene == SCENE.SCORE );

            // lanzar solo si no estas ya en resultados
            if ( scene != SCENE.SCORE ) {
              score.tiempoConsumido = opciones.cuentaAtras * 1000;
              $('body').trigger('finEjercicios');
              // ya deberia estar parado pero...
              clearInterval(timeinterval);
            }
          });
        }
      });
  // console.log('fin btnComenzar click');
  console.timeEnd('btnComenzar');
} );




/**
 * Cuando terminan los ejerecicios se carga la parte de resultados
 * Obtine la platilla de part_resultado.html
 * Muestra insignias, puntuacion y operaciones con errores corregidas
 *
 * @event finEjecricios
 * @property event ev
 *
*/
$('body').on('finEjercicios', (ev) => {
  console.time('resultados');
  // console.log('finEjercicios', ev);
  $('#ejercicios > div').hide();

  fetch('./templates/part_resultado.html')
      .then((response) => response.text() )
      .then((data) => {
        $('#ejercicios').hide();
        // agregar nuevo contenido
        $('#newContent').remove();
        $('#ejercicios').append('<div class="container" id="newContent"></div>');
        // console.log('append data', data);
        $('#newContent').append(data);
        ocultarInsignias();

        // console.log(score);
        // --- Actualizar datos score
        $('#ejercicios .score #aciertos')[0].innerHTML = score.aciertos;
        $('#ejercicios .score #fallos')[0].innerHTML = score.fallos;
        const tiempoConsumido = utils.milisToMinSg(score.tiempoConsumido);
        console.log('tiempoconsumido to milistominsg', tiempoConsumido);
        $('#ejercicios .score #tiempoConsumido')[0]
            .innerHTML = tiempoConsumido;
        let ttotal;
        if (opcionesGuardadas.cuentaAtras != 0 ) {
          ttotal = utils.milisToMinSg(
              opcionesGuardadas.cuentaAtras*1000);
          $('#ejercicios .score #tiempoTotal')[0]
              .innerHTML = ttotal;
          mostrarInsigniasTiempo(
              score.tiempoConsumido, opcionesGuardadas.cuentaAtras );
        } else {
          $('#ejercicios .score #tiempoTotal').hide();
          $('#ejercicios .score #tiempoSeparador').hide();
          $('#ejercicios #rowVelocidad').css('visibility', 'hidden');
        }

        $('#ejercicios .score #tiempoMedio')[0]
            .innerHTML = utils.milisToMinSg(score.tiempoMedioEjercicio);
        $('#ejercicios .score #ejerciciosCompletados')[0]
            .innerHTML = score.completados;
        $('#ejercicios .score #ejerciciosTotal')[0]
            .innerHTML = opcionesGuardadas.cantidadOperaciones;

        const puntuacion = score.aciertos / opcionesGuardadas
            .cantidadOperaciones * 10;
        $('#ejercicios #puntuacion')[0]
            .innerHTML = puntuacion;
        mostrarInsignias(puntuacion);
        // fin Actualizar datos score

        // const soluciones = [];
        score.operacionesMal.forEach((val, key) => {
          const curOperacion = examen.operacionesExamen[key];
          const solucion = curOperacion.respuesta();
          const line = $('<tr>')
              .append('<td>'+
                curOperacion.toStringUserInput(val) +'</td>')
              .append('<td>'+ curOperacion.toStringUserInput(solucion) +
                '</td>');
          // soluciones.push(line);

          $('#correciones tbody').append(line);
        });


        $('#btnVolverEmpezar').click( (ev) => {
          location.reload();
        });

        $('#btnDownloadScore').click( (ev) => {

            const formData = new FormData();
            formData.append('score', JSON.stringify(score) );
            formData.append('puntuacion', puntuacion);
            formData.append('cantidadOperaciones', opcionesGuardadas.cantidadOperaciones);
            formData.append('tiempoTotal', ttotal);
            formData.append('tiempoConsumido', tiempoConsumido);
            formData.append('tiempoMedia', utils.milisToMinSg(score.tiempoMedioEjercicio) );
            formData.append('tiempoTotalMilis', opcionesGuardadas.cuentaAtras );

            // formData.append('date', hdate );
            // formData.append('hashfirma', hash );

            formData.append('correcciones', $('#correciones').html() );

            enviarform('pdf.php', formData);

          // console.log('lanzado abrir modal #btnDownloadScore', ev);

        });

        $('#ejercicios').show();
        scene = SCENE.SCORE;
        if (typeof ayudaDrawer !== 'undefined') {
          ayudaDrawer.refreshEvents();
        }
        console.timeEnd('resultados');
      });

  // fetch('./templates/modal_envioCorreo.html')
  //   .then((response) => response.text())
  //   .then((template) => {
  //     modalCorreoHtml = template;
  //     console.log('cargado modal');
  // });
});

function ocultarInsignias() {
  $('.part_resultado #rowInsignia .puntos .circulo.mini').hide();
}

function mostrarInsignias( puntuacion ) {
  // console.log('puntuacion', puntuacion);
  const maximo = 10;
  // console.log('conciente', puntuacion/maximo );
  if ( puntuacion == 0 ) return;
  if ( puntuacion/maximo > 0) {
    $('.part_resultado #rowInsignia .bronze').show();
  }
  if ( puntuacion/maximo > 0.25) {
    $('.part_resultado #rowInsignia .silver').show();
  }
  if ( puntuacion/maximo > 0.5) {
    $('.part_resultado #rowInsignia .gold').show();
  }
  if ( puntuacion/maximo > 0.75) {
    $('.part_resultado #rowInsignia .platinum').show();
  }
  if ( puntuacion/maximo == 1) {
    $('.part_resultado #rowInsignia .perfect').show();
  }
}
function mostrarInsigniasTiempo( tiempoGastado, maximo ) {
  // const tag = '[app.mostrarInsigniasTiempo]';
  // console.log(tag, '(tiempoGastado,maximo)', tiempoGastado, maximo );
  // Tiempo gastado viene como milisg y maximo como sg:
  maximo = maximo * 1000;
  // const cociente = tiempoGastado/maximo;
  // console.log(
  //     'tiempoGastado', tiempoGastado,
  //     'maximo', maximo,
  //     'cociente', cociente
  // );
  // 1 has gastado todo el tiempo
  // .css('visibility', 'visible');
  $('.part_resultado #rowVelocidad .bronze').css('visibility', 'hidden');
  $('.part_resultado #rowVelocidad .silver').css('visibility', 'hidden');
  $('.part_resultado #rowVelocidad .gold').css('visibility', 'hidden');
  $('.part_resultado #rowVelocidad .platinum').css('visibility', 'hidden');

  if ( tiempoGastado == maximo ) {
    return;
  }

  // No ha gastado todo le tiempo
  if ( tiempoGastado/maximo < 1 ) {
    $('.part_resultado #rowVelocidad .bronze').css('visibility', 'visible');
  }
  // ha gastodo menos del 75%
  if ( tiempoGastado/maximo < 0.75 ) {
    $('.part_resultado #rowVelocidad .silver').css('visibility', 'visible');
  }
  if ( tiempoGastado/maximo < 0.5 ) {
    $('.part_resultado #rowVelocidad .gold').css('visibility', 'visible');
  }
  if ( tiempoGastado/maximo < 0.20 ) {
    $('.part_resultado #rowVelocidad .platinum').css('visibility', 'visible');
  }
}

window.finEjercicios = () => {
  $('body').trigger('finEjercicios');
};
window.ocultarInsignias = ocultarInsignias;
window.mostrarInsignias = mostrarInsignias;

function actualizarNumeroEjercicio( total ) {
  $('.numEjercicios')[0]
      .innerHTML = currentOp+1 + ' / ' + total;
}

function actualizarClaseAyuda( operacion ) {
  // console.log( examen.operacionesExamen[currentOp] );
  // console.log('actualizar clase ayuda', operacion);
  $('#ayudaEjercicio')[0].dataset.operacion = operacion;
  // console.log('data-operacion: ',$('#ayudaEjercicio')[0].dataset.operacion);
}

// --- cuenta atras
let timeinterval;


function updateCountdown(end, clock) {
  const t = end - Date.now();
  clock.innerHTML = utils.milisToMinSg(t);
  if ( t <=0 ) {
    clearInterval(timeinterval);
    $('body').trigger('timeup');
  }
}

function updateCount( start, clock ) {
  const t = Date.now() - start;
  clock.innerHTML = utils.milisToMinSg(t);
}

function initializeCountDown(id, milis) {
  // console.log('initialize countdown llamado', id, milis);
  const clock = document.getElementById(id);
  const start = Date.now();
  const end = start + milis;
  timeinterval = setInterval( updateCountdown, 500, end, clock );
}

function initializeCountUp(id) {
  // console.log('initialize countdown llamado', id, milis);
  const clock = document.getElementById(id);
  const start = Date.now();
  timeinterval = setInterval( updateCount, 500, start, clock );
}
// --- Fin cuenta atras

// --- desactivar checkbox resultado negativo
/**
 * Determina si se puede marcar resultados negativos o no :
 */
function permitirResultadoNegativo() {
  const btnNegativosSelected = $('#btnNegativos')[0]
      .classList.contains('selected');
  const btnSumSelected = $('#btnSuma')[0].classList.contains('selected');
  const btnRestaSelected = $('#btnResta')[0].classList.contains('selected');
  const btnDivSelected = $('#btnDiv')[0].classList.contains('selected');
  const onlyBtnDivSelected = (utils.isArraysCompareSimilar(
      opciones.tiposOperaciones, [OPERACIONES.DIVISION] ) ||
    utils.isArraysCompareSimilar(
        opciones.tiposOperaciones, [OPERACIONES.DIVISION_RESTO]));

  const btnMultiSelected = $('#btnMulti')[0].classList.contains('selected');
  // si esta seleccionado numeros negativos o restas ( y solo restas )
  // console.log('opciones operaciones:', opciones.tiposOperaciones );
  // console.log('solo division', onlyBtnDivSelected );

  // console.log('negativos y no solo divisiones', (btnNegativosSelected && !onlyBtnDivSelected) );
  // console.log('resta y no divsion , no mul y no suma ', ( btnRestaSelected && !btnDivSelected && !btnMultiSelected && !btnSumSelected ) );
  // console.log('resta y mas de 2 operadores', ( btnRestaSelected && opciones.cantidadOperandos>2) );
  if (
    ( btnNegativosSelected && !onlyBtnDivSelected )|| (
      btnRestaSelected && !btnDivSelected &&
      !btnMultiSelected && !btnSumSelected ) ||
      ( btnRestaSelected && opciones.cantidadOperandos>2)
  ) {
    $('#switch-resultadoNegativo')[0].removeAttribute('disabled');
    $('#switch-resultadoNegativo_mv')[0].removeAttribute('disabled');
  } else {
    $('#switch-resultadoNegativo')[0].setAttribute('disabled', '');
    $('#switch-resultadoNegativo_mv')[0].setAttribute('disabled', '');
    opciones.resultadoNegativo = false;
  }
}
$('#switch-resultadoNegativo')[0].setAttribute('disabled', '');
$('#switch-resultadoNegativo_mv')[0].setAttribute('disabled', '');

const cbResultadoOnChange = (ev) => {
  $('#switch-resultadoNegativo')[0].checked = ev.target.checked;
  $('#switch-resultadoNegativo_mv')[0].checked = ev.target.checked;
};

$('#switch-resultadoNegativo').on('change', cbResultadoOnChange );
$('#switch-resultadoNegativo_mv').on('change', cbResultadoOnChange );

/**
* @event selected:btnNegativos
*/
$(document).on('selected:btnNegativos', (ev) => {
  permitirResultadoNegativo();
});
/**
* @event selected:btnResta
*/
$(document).on('selected:btnResta', (ev) => {
  permitirResultadoNegativo();
  changeOpParentesis();
  changeOpTipoNumero();

  // por si se ha deselecionado suma y solo queda division:
  updateOperasdosOnDivisionChange();
} );
/**
* @event selected:btnSuma
*/
$(document).on('selected:btnSuma', (ev) => {
  permitirResultadoNegativo();
  changeOpParentesis();
  changeOpTipoNumero();
  
  // por si se ha deselecionado suma y solo queda division:
  updateOperasdosOnDivisionChange();
} );
/**
* @event selected:btnMulti
*/
$(document).on('selected:btnMulti', (ev) => {
  permitirResultadoNegativo();
  changeOpParentesis();
  changeOpTipoNumero();

  // por si se ha deselecionado suma y solo queda division:
  updateOperasdosOnDivisionChange();
} );
/**
* @event selected:btnDiv
*/
$(document).on('selected:btnDiv', (ev) => {
  permitirResultadoNegativo();
  updateOperasdosOnDivisionChange();
  changeOpParentesis();
  changeOpTipoNumero();
});
/**
* @event selectNuOperandos__change
*/
$('#selectNuOperandos').on('change', (ev) => {
  permitirResultadoNegativo();
});

/**
 * Activa o desactiva tipos de numeros segun operaciones seleccioanadas
 */
function changeOpTipoNumero() {
  const onlyBtnDivSelected = (utils.isArraysCompareSimilar(
      opciones.tiposOperaciones, [OPERACIONES.DIVISION] ) ||
  utils.isArraysCompareSimilar(
      opciones.tiposOperaciones, [OPERACIONES.DIVISION_RESTO]));

  const decimalesSelected = utils.isArraysCompareSimilar(
      opciones.tiposOperaciones, [OPERACIONES.DIVISION_RESTO]);

  // si solo esta selecionado division entonces desactiva numeros negativos
  if (onlyBtnDivSelected) {
    // si esta selecionado lo quita
    if ( $('#btnNegativos').hasClass('selected') ) {
      $('#btnNegativos').click();
    }
    $('#btnNegativos')[0].setAttribute('disabled', '');
    $('#btnNegativos_mv')[0].setAttribute('disabled', '');

    removeOption( opciones.tiposNumero, TIPO_NUMERO.ENTERO );
  } else {
    // $('#btnNegativos').show();
    $('#btnNegativos')[0].removeAttribute('disabled');
    $('#btnNegativos_mv')[0].removeAttribute('disabled');
  }
  if (decimalesSelected) {
    // si esta selecionado lo quita
    if ( $('#btnDecimales').hasClass('selected') ) {
      $('#btnDecimales').click();
    }
    $('#btnDecimales')[0].setAttribute('disabled', '');
    $('#btnDecimales_mv')[0].setAttribute('disabled', '');

    removeOption( opciones.tiposNumero, TIPO_NUMERO.ENTERO );
  } else {
    $('#btnDecimales')[0].removeAttribute('disabled');
    $('#btnDecimales_mv')[0].removeAttribute('disabled');
  }
}

// --- fin desactivar checkbox resultado negativo

// --- Diálogos modales
// force webpack load
let dialogShare;// = new MDCDialog();
let inputField;
// fetch html modal
fetch('./templates/modal.html')
    .then((response) => response.text() )
    .then((data) => {
      $('body').append(data);
      const dialogEl = document.querySelector('.mdc-dialog');
      dialogShare = new MDCDialog(dialogEl);
    });

function cargarFaltaOpciones(dialog, pdf = false) {
  fetch('./templates/modalFaltaOpciones.html')
      .then((response) => response.text() )
      .then((data) => {
        $('body').append(data);
        const dialogEl = document.querySelector('#faltanOpciones');
        dialog = new MDCDialog(dialogEl);
        dialog.open();
        $('#faltanOpciones .button_ok').click( (ev) => {
          dialog.close();
        });
        $('#faltanOpciones .modal-close').click( (ev) => {
          dialog.close();
        });

        $('#faltanOpciones .button_ok').click( (ev) => {
          if (opciones.tiposOperaciones.length == 0) {
            opciones.addTipoOperacion(OPERACIONES.SUMA);
          }
          if (opciones.tiposNumero.length == 0 ) {
            opciones.addTipoNumero(TIPO_NUMERO.NATURAL);
          }

          if ( ! pdf ) {
            $('#btnComenzar').click();
          } else {
            // console.log('vista previa pdf');
            window.scrollTo(0, 0);
            vistaPreviaPdf();
          }
        });
      });
}

/**
 * Boton Cargar codigo ejercicio
*/
$('#btnCodigoEjercicio').click((ev) => {
  // console.log('btnCodigoEjercicio click');
  $('#modal-dialog-title')[0].innerHTML = 'Código de ejercicios';
  $('#modal-dialog-content')[0].innerHTML = `<p>
    Introduce el código o nombre de tu hoja de ejercicios. De esta manera se
     mostrará la configuración para generar las operaciones.
    </p>`;

  $('#button_cancel').hide();
  // placeholder="Introduce o pega el código de ejercicios"
  inputField = `
  <div class="mdc-text-field mdc-text-field--fullwidth">
    <input id="userCode" class="mdc-text-field__input" >
    <div class="mdc-line-ripple"></div>
    <label for="userCode" class="mdc-floating-label">
      Introduce o pega el código de ejercicios
    </label>
  </div>
  `;
  $('#modal-dialog-content')[0].innerHTML += inputField;
  $('#button_ok').find('.mdc-button__label')[0].innerHTML = 'Cargar';
  // const textField =
  new MDCTextField(document.querySelector('.mdc-text-field'));

  dialogShare.open();
  $('.modal-close').click( (ev) => {
    dialogShare.close();
    $('#button_ok').unbind();
  });
  $('#button_ok').click( (ev) => {
    // console.log('cargar opciones');
    const code = $('#userCode').val();
    // console.log( code );
    // opciones = OptionsShortcode.codigoDirectoToOptions(code);
    cargarOpcionesCodigo(code);

    dialogShare.close();

    ev.preventDefault();
    ev.stopPropagation();
    // return false;
    // dialog.close();
  });
});

$('#btnCompartirHoja').click( (ev) => {
  // generar codigo directo:
  const baseurl = DEFAULTS.baseurl;
  const code = OptionsShortcode.generateCodeDirecto(opciones);
  const urlcode = encodeURIComponent(OptionsShortcode.generateCodeDirecto(opciones));
  // console.log(code);

  $('#modal-dialog-title')[0].innerHTML = 'Compartir Ejercicios';
  $('#modal-dialog-content')[0].innerHTML = `<p>
    Puedes copiar y pegar esta dirección en tu navegador web:
    </p>`;
  inputField = `<div class="mdc-text-field mdc-text-field--fullwidth">
      <input class="mdc-text-field__input" 
      readonly
      value="${baseurl}?c=${urlcode}" 
      >
      <div class="mdc-line-ripple"></div>
    </div>`;
  $('#modal-dialog-content')[0].innerHTML += inputField;
  $('#modal-dialog-content')[0].innerHTML += `<p class="mt-1">
      O puedes copiar este código y cargar los ejercicios desde la página de 
      inicio:
    </p>
    <div>
      <i class="material-icons md-icon-fix">description</i> Código Ejercicios:
      <div style="top: 0.9rem; width:16rem" class="ml-2 mdc-text-field d-inline-block">
        <input type="text" 
          class="mdc-text-field__input" readonly value="${code}" >
      </div>
    </div>
    
    <p><br>Comparte el enlace con la aplicación que prefieras:</p>
    `;
  $('#button_cancel').hide();
  // $('#button_ok').hide();
  $('.mdc-dialog__container input:text').focus(function() {
    $(this).select();
  } );
  $('.mdc-dialog__container input:text').click(function() {
    $(this).select();
  } );

  dialogShare.open();
  $('.modal-close').click( (ev) => {
    dialogShare.close();
    $('#button_ok').unbind();
  });
});

let textField;
let textFieldComentario;

/**
 * @desc -brir dialogo modal para con formulario para descargar resultados en pdf
 *        
 * @author Fernando Ramírez Pérez
 */
function abrirModalCorreo() {
  console.log('lanzado abrirModalCorreo()');
  $('#button_ok').unbind();
  console.log('unbind');
  $('#modal-dialog-title')[0].innerHTML = 'Descargar Resultados';
  $('#modal-dialog-content')[0].innerHTML = modalCorreoHtml;
  console.log('cargado modal');

  // $('.mdc-dialog__container input:text').focus(function() {
  //   $(this).select();
  // } );
  // $('.mdc-dialog__container input:text').click(function() {
  //   $(this).select();
  // });

  // textField = new MDCTextField(document.querySelector('.mdc-text-field'));
  // se eliminaron estsos campos
  // const textFieldCopia = new MDCTextField(document.querySelector('#tfCopia.mdc-text-field'));
  // const textFieldAlumno = new MDCTextField(document.querySelector('#tfAlumno.mdc-text-field'));

  // textFieldComentario = new MDCTextField(document.querySelector('.mdc-text-field.mdc-text-field--textarea'));
  // console.log('text fields');


  dialogShare.open();
  // console.log('open dialogShare');

  $('.modal-close').click( (ev) => {
    dialogShare.close();
    $('#button_ok').unbind();
  });
}


// --- fin dialogos modales

$('body').on('keyup', function(ev) {
  // console.log( 'ev charcode', ev.charCode);
  if ( ev.keyCode == 13 && scene == SCENE.OPERATIONS ) {
    showOperationAgain();
    return;
  }
  // if ( ev.keyCode == 32 ) {
  //   console.log('the last frontier');
  // }
  // if ( ev.charCode == 32 ) {
  //   console.log('the last frontier -char');
  // }
});

const showOperationAgain = () => {
  $('.modalEjercicio').removeClass('d-flex');
  $('.pantalla').show();
  tagOperacion.getElementsByClassName('incognita')[0].focus();
};

// cerrar ejercicios: muestra modal de quieres salir o no y vuelve
// a la pantala inicial de opciones
$('body').on('click', '.close-ejercicio', (ev) => {
  // console.log('cerrar ejercicio y volver, pendiente!');
  location.reload();
} );

// Cargar valores en las opciones predeterminadas en DEFAULTS
opciones.posicionIncognitaAlAzar = DEFAULTS.posicionIncognitaAlAzar;
opciones.cantidadOperandos = DEFAULTS.cantidadOperandos;
opciones.resultadoNegativo = DEFAULTS.resultadoNegativo;

// console.log('tipos op defaults', DEFAULTS.tiposOperaciones );
DEFAULTS.tiposOperaciones.forEach((x) => {
  // console.log('tipos operacion', x);
  opciones.addTipoOperacion(x);
});
DEFAULTS.tiposNumero.forEach((x) => opciones.addTipoNumero(x) );
opciones.cantidadOperaciones = DEFAULTS.cantidadOperaciones;

if (DEFAULTS.maximoOperandos) {
  for (let i = 3; i <= DEFAULTS.maximoOperandos; i++) {
    let clases = 'mr-2';
    if (i== DEFAULTS.maximoOperandos) clases = '';
    const html = '<span data-val="'+i+'" class="'+
    clases+' ib-radio un-char" >'+i+'</span>';
    $('#selectNuOperandos').append(html);
    $('#selectNuOperandos_mv').append(html);
  }
  IbRadio.unbindEvents();
  IbRadio.setEvents();
  opciones.cantidadOperandos = DEFAULTS.cantidadOperandos;
}


const getPrintHtml = (operacionesExamen) => {
  // const tag = '[getPrintHtml]';
  // console.log(tag);
  let html='';

  const data = [];
  operacionesExamen.forEach( (el, i) => {
    const ihtml = el.toPrint();
    data.push(ihtml);
  } );
  html = utils.organizeInTables( data, 2, 'tablaEjercicios', 'boxOperacion', 13, 14 );


  html = html + '<div style="clear:both"></div>';
  return html;
};

const cabecera = `
<div class="title" >
  <img src="img/logo_gobierno_canarias.png" alt="gobierno de canarias" >
  <img class="right" src="img/Logo_Aritmates.svg" alt="aritmates" />          
</div>`;
let css;
let solucionesHtml;


function vistaPreviaPdf() {
  const printpdf = new ImprimirPdf();
  const tag = '[app.js.function vistaPreviaPdf()]';
  if ( debug ) console.log( tag );
  const opcionesGuardadas = guardarOpciones(opciones);
  const examen = new GenerarExamen( opcionesGuardadas );
  const soluciones = examen.toPrint();

  $('#main').hide();
  // console.log('fetch print css:');
  css = '';
  let ejercicios = getPrintHtml(examen.operacionesExamen);
  ejercicios = `<div class="ejercicios">${ejercicios}</div>`;
  solucionesHtml = `<div class="soluciones">
      <h3>Soluciones:</h3>${soluciones}</p>
  </div>`;
  const htmlPreview = css + cabecera + ejercicios + solucionesHtml;

  $('#paper').html(htmlPreview);
  $('#preview').show();
}

$('#preview #cancel').click((ev) => {
  location.reload();
  // window.scrollTo(0, 0);
  // $('#preview').hide();
  // $('#paper').html('');
  // $('#main').show();
});

$('#preview #print').click((ev) => {
  const printpdf = new ImprimirPdf();

  // console.log('print click', ev);
  window.scrollTo(0, 0);
  $('.ejercicios').show();
  $('.soluciones').removeClass('d-block');

  printpdf.printImgPages();
});

$('#preview #printSolu').click((ev) => {
  const printpdf = new ImprimirPdf('OperacionesMatematicas-Soluciones.pdf');

  window.scrollTo(0, 0);
  $('.ejercicios').hide();
  $('.soluciones').addClass('d-block');
  printpdf.printImgPages();
});


$('#pdfdown').click( (ev) => {
  if ( opciones.tiposOperaciones.length == 0 ||
      opciones.tiposNumero.length == 0 ) {
    // mostra dialogo no ha selecionado operaciones o tipos de numero
    const dialogMissingOptions = {};
    cargarFaltaOpciones(dialogMissingOptions, true);
    return;
  }

  // console.log('vista previa');
  window.scrollTo(0, 0);
  vistaPreviaPdf();
  // enviarAimprimirPdf();
});

// Desactivar caracteristicas
if ( !ENABLE.parentesis ) {
  $('#opConParentesis')[0].disabled = true;
  $('#opConParentesis_mv')[0].disabled = true;
}
if ( !ENABLE.resultadoIgualA ) {
  $('#resultadoIgualA')[0].disabled = true;
  $('#resultadoIgualA_mv')[0].disabled = true;
  // $('#resultadoIgualA').hide();
  // $('#resultadoNegativo').addClass('controles');
}
if ( !ENABLE.enfocado ) $('#switch-enfocado')[0].disabled = true;

/*
Ejemplo documentacion jsdoc de @tutorial que no funciona
For more information, see {@tutorial create|Creating a Widget} and
{@tutorial destroy Destroying a Widget}.
*/

/**
 * Carga en la pagina las opciones vinculadas al codigo corto introducido por 
 * el usuario. Ver {@tutorial gettingstarted} y [Ejemplo enlace a tutorial]{@tutorial enlace}.
 * Se puede poner un enlace asi {@link http://google.com enlace a google} o asi [Enlace a jsdoc]{@link https://jsdoc.app/tags-inline-link.html}
 *
 * @author Fernando Ramírez Pérez
 * @param {string} code Codigo para cargar las opciones
 * @throws {error} No se pudieron cargar las opciones
 *
 */
function cargarOpcionesCodigo(code) {
  const debug = false;
  /**
 * @const {Options}
 */
  const opcionesCargadas = OptionsShortcode.codigoDirectoToOptions(code);
  try {
    Object.keys(opcionesCargadas).forEach( (x) => {
      if ( debug ) {
        console.log('cambiar', x, 'de', opciones[x],
            'a', opcionesCargadas[x], x );
      }
      // si es tipo multiple deselecionar lo actual y selecionar nuevo
      if (['tiposOperaciones', 'tiposNumero'].includes(x)) {
        if ( debug ) {
          console.log('cambiar multiselect', x, 'de', opciones[x],
              'a', opcionesCargadas[x]);
        }
        opciones[x] = [];
  
        switch (x) {
          case 'tiposNumero':
            $('.tiposNumero .boxButton').removeClass('selected');
            opcionesCargadas[x].forEach((tipoNum) => {
              opciones.addTipoNumero(tipoNum);
            });
            break;
          case 'tiposOperaciones':
            $('.operacionesMatematicas .boxButton').removeClass('selected');
            opcionesCargadas[x].forEach((tipoOp) => {
              // console.log(tipoOp);
              opciones.addTipoOperacion(tipoOp);
            });
            break;
        }
      } else if (x == 'cuentaAtras') {
        const minsg = utils.sgToMinSg(opcionesCargadas[x]);
        opciones[x] = keyCrono(minsg);
      } else if ( x == 'parentesis' ) {
        // para activar los parentesis hace falta que la cantidad de operandos sea 3
        if ( debug ) console.log( 'parentesis', opcionesCargadas[x] );
        if ( opcionesCargadas[x] ) {
          if ( debug ) console.log('parentesis a true');
          opciones.cantidadOperandos = 3;
          opciones[x] = opcionesCargadas[x];
          opciones.parentesis = true;
        }
      } else {
        opciones[x] = opcionesCargadas[x];
        if ( debug ) {
          console.log(
              'opcion cargada: -', x, '-',
              'estado parentesis', opciones.parentesis
          );
        }
      }
    });    
  } catch (error) {
    console.log('[cargarOpcionesCodigo]', 'error', error);
    throw error;
  }

  if ( debug ) {
    console.log(
        'opciones cargadas',
        'opciones.parentesis', opciones.parentesis,
        'opciones.cantidadOperandos', opciones.cantidadOperandos
    );
  }
  // tengo que refrescar estas variables
  opciones.parentesis = opcionesCargadas.parentesis;
  opciones.resultadoNegativo = opcionesCargadas.resultadoNegativo;
  opciones.cuentaAtras = opcionesCargadas.cuentaAtras;

  if ( debug ) {
    console.log(
        'opciones cargadas',
        'opciones.parentesis', opciones.parentesis,
        'opciones.cantidadOperandos', opciones.cantidadOperandos
    );
  }
  // actualiza textos tooltips:
  sliderNivelUpdate();
}


/**
 * * Cuando esta todo listo muestra el body y carga las opciones con
 * el codigo corto si viene con parametro
 * @name OnloadApp
 *
 */
window.onload = function() {
  $('#load').hide();
  $('#main').show();

  const urlParams = new URLSearchParams(window.location.search);
  if ( urlParams.has('c') ) {
    const code = urlParams.get('c');
    console.log('Cargando shortcode', code );
    cargarOpcionesCodigo(code);
  }
};

console.timeEnd('app.js');
console.log('fin.');
