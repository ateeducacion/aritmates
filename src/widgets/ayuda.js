
import $ from 'jquery';
import {MDCDrawer} from '../components/mdc-compat.js';

import '../../css/mdc.list.min.css';
import '../../css/mdc.drawer.min.css';

// para que funcionen los mixin en css hace falta esto!!!


// Panel de expansión nativo (sin iron-collapse / iron-icons)
import '../widgets/paper-expansion-panel';
// paper-item nativo (layout en ayuda y portada)
import '../components/paper-item.js';

import '../../css/widgets.css';
import '../../css/mdc-drawer.scss';
import '../../css/creditos.scss';
import '../../css/ayuda.css';
import OPERACIONES from '../operaciones/operaciones';

const HELP_TABS = {
  '#nav-suma': '#nav-suma-tab',
  '#nav-resta': '#nav-resta-tab',
  '#nav-multiplicacion': '#nav-multiplicacion-tab',
  '#nav-division': '#nav-division-tab',
};

// youtbe videojs

// Image viewer
import {FullScreenViewer} from 'iv-viewer';
import 'iv-viewer/dist/iv-viewer.css';
const viewer = new FullScreenViewer();

class Ayuda {
  constructor() {
    fetch('templates/ayuda.html')
        .then((response) => response.text())
        .then((data) => {
          const mHtml = data;
          $('body').prepend(mHtml);
          this.load();

          // cargar iv-viewer para zoom en imagenes
          // images.forEach((img) => {


          Array.from(document.querySelectorAll('.zoom')).forEach((elem) => {
            elem.addEventListener('click', function(ev) {
              const imgSrc = elem.src;
              viewer.show( imgSrc );
              // texto de explicación zoom
              const txt = '<div class="zoomtxt">Pulsa dos veces o usa la rueda del ratón para hacer ZOOM</div>';
              $('.iv-image-view').append(txt);
            });
          });

          // al picar en nav o en tab-content cierra el desplegable de "que es aritmates?"
          const cierraQueEs = () => {
            $('#thisapp').removeAttr('opened');
            // .attr('opened');
          };
          $('nav').click( cierraQueEs );
          $('#nav-tabContent').click( cierraQueEs );

          document.getElementById('nav-tab').addEventListener('shown.bs.tab', (event) => {
            const href = event.target.getAttribute('href');
            if (href && location.hash !== href) {
              history.replaceState(null, '', href);
            }
          });

          this.openFromHash();
          window.addEventListener('hashchange', () => this.openFromHash());
        });
  }

  openFromHash() {
    const tabSel = HELP_TABS[location.hash];
    if (!tabSel || !this._drawer || !window.bootstrap) return;
    const tab = document.querySelector(tabSel);
    if (!tab) return;
    this._drawer.open = true;
    window.bootstrap.Tab.getOrCreateInstance(tab).show();
  }

  load() {
    this.elDrawer = document.querySelector('.mdc-drawer');
    this._drawer = MDCDrawer.attachTo( this.elDrawer );
    this.bindEvents();
  }

  bindEvents() {
    // abrir drawer al picar .openDrawer
    // mOpen.addEventListener('click', (event) => {
    $('.openAyuda').on('click', (ev) => {
      this._drawer.open = true;
      if (ev.target.classList.contains('ayudaEspecifica')) {
        // abrir la parte especifica de la ayuda
        const operacion = $('#ayudaEjercicio')[0].dataset.operacion;
        switch ( operacion ) {
          case OPERACIONES.SUMA:
            $('#nav-suma-tab').click();
            break;
          case OPERACIONES.RESTA:
            $('#nav-resta-tab').click();
            break;
          case OPERACIONES.DIVISION:
          case OPERACIONES.DIVISION_DECIMAL:
          case OPERACIONES.DIVISION_ENTERA:
          case OPERACIONES.DIVISION_RESTO:
            $('#nav-division-tab').click();
            break;
          case OPERACIONES.MULTIPLICACION:
            $('#nav-multiplicacion-tab').click();
            break;
        }
      }
    });

    // la equis cierra los creditos:
    $(this.elDrawer).find('.mdc-drawer-close')
        .on('click', (ev) => {
          this._drawer.open = false;
        });
  }
  unbindEvents() {
    $('.openAyuda').unbind('click');
    $(this.elDrawer).find('.mdc-drawer-close').unbind('click');
  }
  refreshEvents() {
    this.unbindEvents();
    this.bindEvents();
  }
}

export default new Ayuda();
