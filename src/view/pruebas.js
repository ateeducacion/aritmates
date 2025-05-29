
window.debug = false;
const t0 = performance.now();
import '@polymer/paper-slider/paper-slider.js';
import 'xy-ui/components/xy-slider';
import $ from 'jquery';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';

import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';


import 'webpack-material-design-icons';
import 'bootstrap/scss/bootstrap-grid.scss';
import '../../css/widgets.css';

import {mustache} from 'mustache';

import '../widgets/creditos';
import '../widgets/ibRadio';


let slider;
$(function() {
  // $('xy-slider').sliderCon.tips = 'SIETE';
  slider = $('xy-slider');

  console.log('slider', slider);

  slider = $('xy-slider')[0].slider;
  const sliderCon = $('xy-slider')[0].sliderCon;

  // const niveles = [
  //   4, 6, 8, 9, 10,
  //   12, 14, 15, 16, 17, 18, 19, 20,
  //   50, 100, 500];
  function valoresNiveles(x) {
    let r;
    switch (x) {
      case '21':
      case 21:
        r = 50;
        break;
      case '22':
      case 22:
        r = 100;
        break;
      case '23':
      case 23:
        r = 500;
        break;
      default:
        r = x;
        break;
    }
    // asignarle este valor a un input oculto
    // $("#nivelVal").value(r);
    return r;
  }

  // slider.addEventListener('change', function(ev) {
  //   console.log('change slider');
  //   sliderCon.tips = "valgo mas que "+ this.value;
  //   // console.log(this.value);
  //   // console.log(ev.target.value);
  //   // console.log(ev.detail.value);
  // });

  // slider.addEventListener('mouseover', function(ev) {
  //   console.log('mouseover slider');
  //   sliderCon.tips = valoresNiveles(slider.value);
  // });

  // sliderCon.addEventListener('mouseover', function(ev) {
  //   console.log('mouseover');
  //   sliderCon.tips = valoresNiveles(slider.value);
  // });


  sliderCon.addEventListener('scroll', function(ev) {
    console.log('scroll');
    sliderCon.tips = valoresNiveles(slider.value);
  });
  slider.addEventListener('input', function(ev) {
    console.log('input');
    sliderCon.tips = valoresNiveles(slider.value);
  });
  slider.addEventListener('change', function(ev) {
    console.log('change');
    sliderCon.tips = valoresNiveles(slider.value);
  });
  slider.addEventListener('wheel', function(ev) {
    console.log('wheel');
    sliderCon.tips = valoresNiveles(slider.value);
  });
});



// -- Drawer

// cargar tema con mustache{}

// old style
// const creditosHTML = new XMLHttpRequest();
// creditosHTML.open('GET', 'templates/creditos.html')
// creditosHTML.onreadystatechange = () => {
// }
// js 2019 and beyond:



// ---- SELECT ----

// import {MDCSelect} from '@material/select';
// //estilos
// import "@material/list/dist/mdc.list.css";
// import "@material/menu-surface/dist/mdc.menu-surface.css";
// import "@material/menu/dist/mdc.menu.css";
// import "@material/select/dist/mdc.select.css";

// const select = new MDCSelect(document.querySelector('.mdc-select'));
// select.listen('MDCSelect:change', () => {
//   console.log(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
// });

const t1 = performance.now();
console.log('Call app.js took ' + (t1 - t0) + ' milliseconds.');
console.log('fin.');

// / select polymer


