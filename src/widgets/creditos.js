
import $ from 'jquery';

// estilos para MDC Drawer:

import '../../css/widgets.css';
import '../../css/creditos.scss';

import {DEFAULTS} from '../defaultOptions';

/**
 * al importar este archivo busca .openCreditos
 * .open creditos al picar en el abre y cierra el drawer
 */
class Creditos {
  constructor() {
    // load template in #creditos div
    fetch('templates/creditos.html')
        .then((response) => response.text())
        .then((data) => {
          const creditosHtml = data;
          $('body').append(creditosHtml);

          this.load();
        });
  }

  load() {

    $('#creditos h2')[0].innerHTML = 'Créditos <span class="version small">Versión ' + DEFAULTS.version + '</span>';
    // Poner fecha en creditos
    const curYearElements = document.getElementsByClassName('currentYear');
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < curYearElements.length; i++) {
      curYearElements[i].innerHTML = currentYear;
    }
  }
}

export default new Creditos();