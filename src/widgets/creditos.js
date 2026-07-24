
import $ from 'jquery';
// import {MDCDrawer} from '@material/drawer';

// estilos para MDC Drawer:
// import '../../css/mdc.list.min.css';
// import '../../css/mdc.drawer.min.css';

import '../../css/widgets.css';
// import '../../css/mdc-drawer.scss';
import '../../css/creditos.scss';

import {DEFAULTS} from '../defaultOptions';

/**
 * al importar este archivo busca .openCreditos
 * .open creditos al picar en el abre y cierra el drawer
 */
class Creditos {
  constructor() {
    this.debug = false;
    const debug = this.debug;
    const tag = '[creditos.js.constructor]';
    if ( debug ) console.log( tag );

    // load template in #creditos div
    fetch('templates/creditos.html')
        .then((response) => response.text())
        .then((data) => {
          console.log('get creditos ok');
          const creditosHtml = data;
          $('body').append(creditosHtml);

          this.load();
        });
  }

  load() {
    const debug = this.debug;
    const tag = '[creditos.js.load]';
    if ( debug ) console.log( tag );

    $('#creditos h2')[0].innerHTML = 'Créditos <span class="version small">Versión ' + DEFAULTS.version + '</span>';
    // Poner fecha en creditos
    const curYearElements = document.getElementsByClassName('currentYear');
    console.log(curYearElements);
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < curYearElements.length; i++) {
      curYearElements[i].innerHTML = currentYear;
    }
  }
}

export default new Creditos();