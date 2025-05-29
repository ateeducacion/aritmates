const t0 = performance.now();

// import {tooltip} from 'bootstrap';
// import $ from 'jquery';

import '../widgets/creditos';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '../..//css/main.scss';
import '../../css/widgets.css';
import '../../css/resultado.scss';
import 'webpack-material-design-icons';
// aqui estan los iconos de la medalla y el cohete
import '@fortawesome/fontawesome-free';
import '@fortawesome/fontawesome-free/css/all.css';


const t1 = performance.now();
console.log('resultado.js' + (t1 - t0) + ' milliseconds.');
console.log('fin.');
