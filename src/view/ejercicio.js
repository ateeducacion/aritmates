window.debug = false;
const t0 = performance.now();

import $ from 'jquery';

// # Fonts,Css,Img FILES ------------------------
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'webpack-material-design-icons';

import '../widgets/creditos';

import '../../css/main.scss';
import '../../css/widgets.css';
import '../../css/ejercicio.scss';



const t1 = performance.now();
console.log('Call app.js took ' + (t1 - t0) + ' milliseconds.');
console.log('fin.');
