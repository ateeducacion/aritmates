export const TIPO_NUMERO = {
  NATURAL: 0, // 1 .. Infinito
  ENTERO: 1, // (NEGATIVOS) -Infinito .. Infinito
  DECIMAL: 2,
  MULTIPLO10: 3, // 10,20,30...
  MULTIPLO100: 4, // 100,200
};

TIPO_NUMERO.getKey = function(value) {
  switch (value) {
    case TIPO_NUMERO.NATURAL:
      return 'NATURAL (positivos)';
      break;
    case TIPO_NUMERO.ENTERO:
      return 'ENTERO (negativos)';
      break;
  }
  for (const key in this) {
    if (this[key] == value) {
      return key;
    }
  }
  return null;
};


TIPO_NUMERO.tiposNumeroToText = ( array ) => {
  let txt = '';
  array.forEach((tipoNumero, i) => {
    let txtTipoNumero = '';
    const tipoNumeroName = TIPO_NUMERO.getKey(tipoNumero);
    if ( array.length>1 ) {
      switch (i) {
        case (array.length-1):
          txtTipoNumero += ' y '+tipoNumeroName;
          break;
        case (array.length-2):
          txtTipoNumero += tipoNumeroName;
          break;
        default:
          txtTipoNumero += tipoNumeroName + ', ';
          break;
      }
    } else {
      txtTipoNumero = TIPO_NUMERO.getKey(array[0]);
    }
    txt += txtTipoNumero;
  });
  return txt;
};

TIPO_NUMERO.selecionables = [
  TIPO_NUMERO.NATURAL,
  TIPO_NUMERO.ENTERO,
  TIPO_NUMERO.DECIMAL,
  TIPO_NUMERO.MULTIPLO10,
  TIPO_NUMERO.MULTIPLO100];
