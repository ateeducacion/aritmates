import combinations from 'combinations';

// export const posibilidadPorOpcion = {
//   cantidadOperaciones: 11,
//   cantidadOperandos: 3,
//   complementario: 10,
//   cuentaAtras: 10,
//   nivel: 23,

// enfocado: 2,
// operacionMultiple: 2,
// parentesis: 2,
// posicionIncognitaAlAzar: 2,
// resultadoNegativo: 2,

//   tiposNumero: 32,
//   tiposOperacion: 32,
// };


function totalPosibilidades( posibilidadPorOpcion ) {
  let posibilidades = 1;
  const keys = Object.keys(posibilidadPorOpcion);
  keys.forEach((e) => {
    posibilidades = posibilidades * e;
  });
  return posibilidades;
}

function calcPosibilidadesPorOpcion( opciones ) {
  const posiciones = {};

  Object.keys(opciones.bool).forEach( (e) => {
    posiciones[e] = 2;
  });

  Object.keys(opciones.select).forEach( (e) => {
    posiciones[e] = opciones.select[e];
  });

  Object.keys(opciones.multi).forEach( (e) => {
    // eslint-disable-next-line prefer-spread
    const array = Array.apply(null, {length: opciones.multi[e]})
        .map(Number.call, Number);
    const combinaciones = combinations( array ).length;
    // +1 de la opcion de que este vacio
    posiciones[e] = combinaciones+1;
  });

  return posiciones;
}

// eslint-disable-next-line prefer-spread
const array10al100 = Array.apply(null, {length: 10})
    .map(Number.call, Number).map( (x) => ((x+1)*10));

// eslint-disable-next-line prefer-spread
const array1al20 = Array.apply(null, {length: 20})
    .map(Number.call, Number).map( (x) => (x+1));

const listOptionsPorTipoV0 = {
  'bool': [
    'enfocado',
    'operacionMultiple',
    'parentesis',
    'posicionIncognitaAlAzar',
    'resultadoNegativo',
  ],
  'select': {
    'complementario': 10,
    'cantidadOperaciones': 11,
    'cuentaAtras': 10,
    'nivel': 23,
    'cantidadOperandos': 3,
  },
  'multi': {
    'tiposOperaciones': 5,
    'tiposNumero': 5,
  },
};

const listOptionsPorTipo = listOptionsPorTipoV0;

function tipoOpcion( option ) {
  let tipo = false;
  if ( listOptionsPorTipo.bool.includes(option) ) {
    return 'bool';
  }
  Object.keys(listOptionsPorTipo).forEach( (x)=> {
    if (option in listOptionsPorTipo[x]) {
      tipo = x;
    }
  });
  return tipo;
}

const selectOptionsV0 = {
  'complementario': array10al100,
  'cantidadOperaciones': [0].concat(array10al100),
  'cuentaAtras': [0, '0:30', '1:00', '2:00', '3:00', '4:00', '5:00', '10:00',
    '20:00', '30:00'],
  'nivel': array1al20.concat([50, 100, 500]),
  'cantidadOperandos': [2, 3, 4],
};

// console.log('selectOptionsv0', selectOptionsV0);

const posibilidadPorOpcionV0 = calcPosibilidadesPorOpcion(listOptionsPorTipoV0);

function listarOpciones( listOptionPorTipo ) {
  let list = [];
  Object.keys(listOptionPorTipo).forEach( ( tipo ) => {
    let listaOpciones;
    if ( Array.isArray(listOptionPorTipo[tipo]) ) {
      listaOpciones = listOptionPorTipo[tipo];
    } else {
      listaOpciones = Object.keys(listOptionPorTipo[tipo]);
    }
    list = list.concat( listaOpciones );
  });
  return list;
}

// opciones actuales
export const version = 0;
export const listOptions = listarOpciones(listOptionsPorTipoV0);
export const posibilidadesPorOpcion = posibilidadPorOpcionV0;
export const gTipoOpcion = tipoOpcion;
export const opcionesPosibilidades = totalPosibilidades(posibilidadPorOpcionV0);
export const selectOptions = selectOptionsV0;

