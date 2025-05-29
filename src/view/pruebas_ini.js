
window.debug = false;
const t0 = performance.now();
import $ from 'jquery';
import GenerarExamen from '../generarExamen';
import {TIPO_NUMERO} from '../generarExamen';
import OPERACIONES from '../operaciones/operaciones';
import ImprimirPdf from '../imprimirPdf';
import OperacionMultiple from '../operaciones/OperacionMultiple';
import Resta from '../operaciones/resta';
import Suma from '../operaciones/suma';

const problema1 = {
  nivel: nivel,
  cantidadOperandos: 4,
  tiposNumero: [TIPO_NUMERO.DECIMAL],
  tiposOperacionAzar: false,
  parentesis: true,
  posicionParentesis: [1, 2],
  resultadoNegativo: true,
  tiposOperacion: [
    OPERACIONES.DIVISION,
    OPERACIONES.SUMA,
    OPERACIONES.DIVISION,
  ],
};
const problema2 = {
  nivel: nivel,
  cantidadOperandos: 4,
  tiposNumero: [TIPO_NUMERO.ENTERO],
  tiposOperacionAzar: false,
  parentesis: true,
  posicionParentesis: [1, 2],
  resultadoNegativo: true,
  tiposOperacion: [
    OPERACIONES.DIVISION,
    OPERACIONES.SUMA,
    OPERACIONES.DIVISION,
  ],
};
const problema3 = {
  nivel: nivel,
  cantidadOperandos: 4,
  tiposNumero: [TIPO_NUMERO.ENTERO],
  tiposOperacionAzar: false,
  parentesis: true,
  posicionParentesis: [0, 1],
  resultadoNegativo: true,
  tiposOperacion: [
    OPERACIONES.SUMA,
    OPERACIONES.MULTIPLICACION,
    OPERACIONES.DIVISION,
  ],
};
const problema4 = {
  nivel: nivel,
  cantidadOperandos: 3,
  permitirNegativos: false,
  tiposOperacion: [
    OPERACIONES.SUMA,
    OPERACIONES.RESTA,
  ],
  // operandos: [3, 2, 1],
  tiposOperacionAzar: false,
};
const problema5 = {
  cantidadOperandos: 5,
  tiposOperacion: [
    OPERACIONES.SUMA,
    OPERACIONES.DIVISION_ENTERA,
    OPERACIONES.RESTA,
    OPERACIONES.MULTIPLICACION,
    OPERACIONES.DIVISION,
  ],
  tiposOperacionAzar: false,
  operandos: [
    1, 3, 3, 1, 2,
  ],
};
  // 3 operandos combinando * / el resultado a de ser un numero entero
const problema6 = {
  nivel: nivel,
  cantidadOperandos: 3,
  permitirNegativos: false,
  tiposOperacion: [
    OPERACIONES.MULTIPLICACION,
    OPERACIONES.DIVISION_ENTERA,
  ],
};

const problema7 = {
  nivel: 19,
  cantidadOperandos: 2,
  permitirNegativos: false,
  resultadoNegativo: false,
  // operandos: [null, 50],
  tiposNumero: [1],
};

const problema8 = {
  nivel: nivel,
  cantidadOperandos: 4,
  permitirNegativos: true,
  operandos: [31],
  // incognita: 3,
  // enfocado: false,
  // posicion_nivel: 1,
  // multiplo10: false,
  // multiplo100: false,
  // complementario: false,
  resultadoNegativo: true,
  // decimales: false,
};

const problema9 = {
  nivel: nivel,
  cantidadOperandos: 3,
  // permitirNegativos: false,
  resultadoNegativo: true,
  parentesis: false,
  tiposOperacion: [
    OPERACIONES.SUMA,
    OPERACIONES.RESTA,
  ],
  tiposNumero: [TIPO_NUMERO.NATURAL],
};
const problema10 = {
  nivel: nivel,
  cantidadOperandos: 3,
  permitirNegativos: true,
  // resultadoNegativo: true,
  decimales: true,
  parentesis: false,
};


opciones = problema1; // A / (B+C) / D , decimales
opciones = problema2; // A / (B+C) / D enteros
opciones = problema3; // (A + B ) * C / D enteros
opciones = problema4; // 3 + 2 - 1
opciones = problema5; // 1+3/3-1*2 = 0
opciones = problema6; // 3 operandos combinando * / el resultado a de
// ser un numero entero
opciones = problema7;
opciones = problema10;

opciones = {
  'nivel': 50, 'cantidadOperandos': 2, 'permitirNegativos': false,
  'resultadoNegativo': true, 'operandos': [null, 19]};

opciones = {
  'nivel': 50, 'cantidadOperandos': 2, 'permitirNegativos': false,
  'resultadoNegativo': true, 'operandos': [null, 100],
};


function operacionesDirectas(opciones) {
  // opciones soN referencia json parse para copiarlas:
  const op = JSON.parse(JSON.stringify(opciones));
  const operaciones = [];
  for (let i = 0; i < 10; i++) {
    const a = JSON.parse(JSON.stringify(op));
    operaciones.push( new Resta(a) );
    // const b = JSON.parse(JSON.stringify(op));
    // operaciones.push( new Suma(b) );
    // operaciones.push( new OperacionMultiple( a ) );
  }
  return operaciones;
  // nivelesEnfocado[nivel] = {operacionesExamen: operaciones};
}

const operaciones = operacionesDirectas(opciones);

// const niveles = [
//   4, 6, 8, 9, 10,
//   12, 14, 15, 16, 17, 18, 19, 20,
//   50, 100, 500];
// const nivelesPrimos = [2, 3, 5, 7, 11, 13];
// niveles.join(nivelesPrimos);
const niveles = [
  // 2, 9, 10, 
  19,
  // 50, 100, 500,
];

const nivelesEnfocado = [];

$('body').append( '<h1>Operaciones Matemáticas</h1>' );
niveles.forEach((nivel) => {
  $('body').append( '<h2>Operaciones nivel '+nivel+':</h2>' );
  const jsonstring = $('<p style="font-size:smaller">');

  const opciones = {
    nivel: nivel,
    cantidadOperaciones: 5,
    cantidadOperandos: 3,
    // resultadoNegativo: true,
    resultado_negativo: true,
    tiposOperaciones: [
      OPERACIONES.SUMA,
      OPERACIONES.RESTA,
      OPERACIONES.MULTIPLICACION,
      OPERACIONES.DIVISION,
    ],
    tiposNumero: [
      TIPO_NUMERO.NATURAL,
      TIPO_NUMERO.DECIMAL,
      // TIPO_NUMERO.ENTERO,
      // TIPO_NUMERO.MULTIPLO10,
      // TIPO_NUMERO.MULTIPLO100,
    ],
    operacionMultiple: true,
    // parentesis: true,
    // enfocado: true,
  };

  jsonstring.append(JSON.stringify( opciones, null, '\t') );
  nivelesEnfocado[nivel]= new GenerarExamen( opciones );
  jsonstring.append('<pre >'+ JSON.stringify(nivelesEnfocado[nivel].info, null, '\t') + '</pre >' );
  $('body').append( jsonstring );

  console.log('##--Fin-nivel-'+nivel+'-----------------------------------\n\n');
  console.log( 'operacion mulitple', nivelesEnfocado[nivel]);

  nivelesEnfocado[nivel].operacionesExamen.forEach((val)=>{
    $('body').append(
        '<div style="position:relative;margin-top:3em;font-size:small;">' +
        val.id + '</div>' +
        '<div class="linea">'+
        '<div class="examen">'+
        val.toHtml() +
        '</div>'+
        '<div class="soluciones">' +
        val.toHtmlSolved() +
        '</div>'+
        '<p class="clear" ></p>'+
        '</div>'+
        '<p class="clear" ></p>'
    );

    if ( debug ) {
      console.log(
          'decimales', val.decimales,
          'decimalesMaximo', val.decimalesMaximo
      );
    }
    // errores Resta
    // $('body').append('<div><pre>'+ val.mostrarErroresHtml() +'</pre></div>');
  });
  // errores genera examen:
  $('body').append(
      '<div><pre>' + nivelesEnfocado[nivel].mostrarErroresHtml() + '</pre></div>'
  );
});

// const pdf = new ImprimirPdf();
// pdf.printHtmlToPdf($('html').html());
// const solus = $('.soluciones');
// console.log( 'solus', solus );
// pdf.printHtmlToPdf( solus[0] );

// pdf.printAsImg();
// // me da el error "Element is no attached to Document"
// pdf.printAddHtml( document.getElementsByTagName('body') );


const t1 = performance.now();
console.log('Call app.js took ' + (t1 - t0) + ' milliseconds.');
console.log('fin.');
