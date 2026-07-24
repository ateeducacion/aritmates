
import $ from 'jquery';
import {MDCDrawer} from '@material/drawer';

import '../../css/mdc.list.min.css';
import '../../css/mdc.drawer.min.css';

// para que funcionen los mixin en css hace falta esto!!!
// import '@webcomponents/shadycss/entrypoints/apply-shim.js';
// import mep from 'material-expansion-panel';


import '../widgets/paper-expansion-panel';

import '@polymer/iron-a11y-announcer';
// # esto deberia cargarlo dr-niels-paper-expansion-panel pero por algun motivo
// no va si no lo pongo asi aqui:
import '@polymer/iron-icons';
import '@polymer/iron-collapse';
import '@polymer/paper-icon-button';
import '@polymer/paper-item';
// import '@polymer/paper-styles';
import '@polymer/paper-styles/paper-styles.js';
// import '@polymer/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/polymer';

import '../../css/widgets.css';
import '../../css/mdc-drawer.scss';
import '../../css/creditos.scss';
import '../../css/ayuda.css';
import OPERACIONES from '../operaciones/operaciones';

// youtbe videojs
// import 'video.js/dist/video-js.min.css';
// import 'video.js/dist/video.min.js';
// import 'videojs-youtube/dist/Youtube.min.js';

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
          // const images = document.querySelectorAll('.zoom');
          // images.forEach((img) => {
          //   const viewer = new ImageViewer( img );
          //   console.log('viewer cargado', viewer)
          // });

          // const pic = document.querySelector('.zoom');
          // const viewer = new ImageViewer( pic );
          // console.log('viewer cargado', viewer);

          Array.from(document.querySelectorAll('.zoom')).forEach((elem) => {
            elem.addEventListener('click', function(ev) {
              const imgSrc = elem.src;
              // const highResolutionImage = elem.getAttribute('data-high-res-src');
              // viewer.show(imgSrc, highResolutionImage);
              viewer.show( imgSrc );
              // texto de explicación zoom
              const txt = '<div class="zoomtxt">Pulsa dos veces o usa la rueda del ratón para hacer ZOOM</div>';
              $('.iv-image-view').append(txt);
            });
          });

          // al picar en nav o en tab-content cierra el desplegable de "que es aritmates?"
          const cierraQueEs = () => {
            console.log('cierra "que es"');
            $('#thisapp').removeAttr('opened');
            // .attr('opened');
          };
          $('nav').click( cierraQueEs );
          $('#nav-tabContent').click( cierraQueEs );
        });
  }

  load() {
    this.elDrawer = document.querySelector('.mdc-drawer');
    // this.elDrawer = document.getElementById('ayudaDrawer');
    this._drawer = MDCDrawer.attachTo( this.elDrawer );
    // console.log('drawerAyuda', this._drawer);
    this.bindEvents();
  }

  bindEvents() {
    // abrir drawer al picar .openDrawer
    // const mOpen = document.querySelector('.openAyuda');
    // mOpen.addEventListener('click', (event) => {
    //   drawerAyuda.open = true;
    //   console.log('event target', event.target );
    // });
    $('.openAyuda').on('click', (ev) => {
      this._drawer.open = true;
      console.log('event target', ev.target );
      if (ev.target.classList.contains('ayudaEspecifica')) {
        // abrir la parte especifica de la ayuda

        console.log(
            'tipo op', $('#ayudaEjercicio')[0].dataset.operacion,
            OPERACIONES.MULTIPLICACION
        );
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
          default:
            console.log('operación es', operacion, 'pero no llega');
            break;
        }
        console.log('después del switch');
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
